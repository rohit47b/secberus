/*
 * @Author: Virendra Patidar 
 * @Date: 2018-11-02 10:51:53 
 * @Last Modified by: Virendra Patidar
 * @Last Modified time: 2019-04-23 14:29:42
 */
import React, { PureComponent } from 'react'

import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import InputLabel from '@material-ui/core/InputLabel'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Switch from '@material-ui/core/Switch'
import MenuItem from '@material-ui/core/MenuItem'

import AppConfig from 'constants/Config'

import { pull, cloneDeep } from "lodash"
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import Loader from 'global/Loader'
import SnackbarMessage from 'global/SnackbarMessage'

import * as integrationActions from 'actions/integrationAction'
import * as slackIntegrationActions from 'actions/slackIntegrationAction'

import { showMessage } from 'actions/messageAction'

import { renderTextField, renderControlSelect, renderControlMultiSelect } from 'reduxFormComponent'
import { Field, reduxForm, reset } from 'redux-form'

/**
 * Validate slack configuration
 * Webhook URL and account id should be required
 */
const validate = values => {
    const errors = {}
    const requiredFields = [
        'webhook_url',
        'account_id',
    ]
    requiredFields.forEach(field => {
        if (!values[field]) {
            errors[field] = 'This field is required'
        }
    })
    if (
        values.username &&
        !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.username)
    ) {
        errors.username = 'Invalid email address'
    }
    return errors
}

class SlackIntegration extends PureComponent {

    _mounted = false

    state = {
        openSlackDialog: true,
        account: '',
        accountDataList: [],
        serviceList: [],
        activeServices: this.props.slackConfig.services,

        isProgress: false,
        message: '',
        variant: 'info',
        showSnackbarState: false
    }

    componentDidMount() {
        this._mounted = true
        this.fetchAccountData()
        this.fetchServiceList()
        this.props.initialize({ webhook_url: this.props.slackConfig.webhook_url, account_id: this.props.slackConfig.account_id });
    }

    componentWillUnmount() {
        this._mounted = false
    }

    handleChange = name => event => {
        this.setState({ [name]: event.target.value }, () => {
        })
    };

    fetchAccountData() {
        if (this.props.awsList.length === 0) {
            this.props.actions.fetchIntegrationList().
                then(result => {
                    if (this._mounted) {
                        if (result.success) {
                            this.setState({ accountDataList: result.data[0].accounts }, () => {
                            })
                        } else {
                            let message = { message: result, showSnackbarState: true, variant: 'error' }
                            this.props.showMessage(message)
                        }
                    }
                });
        } else {
            this.setState({ accountDataList: this.props.awsList.accountList })
        }
    }

    fetchServiceList = () => {
        this.props.actions.fetchServiceList().
            then(result => {
                if (this._mounted) {
                    if (result.success) {
                        let activeServices = []
                        result.data.map((service, index) => {
                            activeServices.push(service.name)
                        })
                        /**
                         * this.props.slackConfig.is_active :- When customer open for edit configuration else for add new slack configuration
                         * Note :- At time of add slack show all service as selected by default
                         */
                        if (this.props.slackConfig.is_active === true) {
                            this.setState({ serviceList: result.data }, () => {
                            })
                        } else {
                            this.setState({ serviceList: result.data, activeServices }, () => {
                            })
                        }
                    } else {
                        let message = { message: result, showSnackbarState: true, variant: 'error' }
                        this.props.showMessage(message)
                    }
                }
            });

    }

    statusChangeDialog = (service, isActive) => {

        let updatedServices = cloneDeep(this.state.activeServices)
        if (isActive) {
            updatedServices = pull(updatedServices, service)
        } else {
            updatedServices.push(service)
        }
        this.setState({ activeServices: updatedServices })
    }

    integrateSlack = (values) => {
        values.is_active = true
        values.services = this.state.activeServices

        return this.props.actions.slackWebHookIntegrate(values).
            then(result => {
                this.setState({ isProgress: false })
                if (this._mounted) {
                    if (!result.success) {
                        this.setState({ isProgress: false })
                        if (typeof result === 'string') {
                            this.setState({ message: result, showSnackbarState: true, variant: 'error' });
                        } else {
                            throw new SubmissionError(result)
                        }

                    } else if (result.success) {
                        this.setState({ isProgress: false })
                        this.props.handleCloseSlackDialog(true)
                    }
                }
            });

    }

    handleAccountSelect = () => {
    }

    handleClose = () => {
        this.setState({ message: '', showSnackbarState: false });
    }


    render() {
        const { serviceList, openSlackDialog, accountDataList, account, activeServices, isProgress, variant, message, showSnackbarState } = this.state
        const { handleSubmit, invalid, submitting, pristine, editPayload } = this.props;
        return (
            <Dialog
                open={openSlackDialog}
                onClose={this.props.handleCloseSlackDialog}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                className="dialog-intgration"
            >
                <DialogTitle className="dialog-title">Slack Integration</DialogTitle>
                <DialogContent className="dialog-content">
                    {isProgress && <Loader />}
                    <form className="form-intgration" onSubmit={handleSubmit((values) => this.integrateSlack(values))}>
                        <Grid container spacing={24} className="form-container">

                            <Grid item sm={5}>
                                <div className="logo-box">
                                    <div className="slk-logo">
                                        <img  alt="Slack" src={AppConfig.cloudStaticData['slack'] ? AppConfig.cloudStaticData['slack'].cloudIconPath : '/assets/images/slack.png'} />
                                    </div>
                                    <h3>Slack</h3>
                                </div>
                            </Grid>
                            <Grid item sm={7}>

                                <Field className="text-outline" component={renderTextField} name="webhook_url" type="text" fixedlabel="Webhook URL" />

                                <Field onChangeMethod={this.handleAccountSelect} className="text-outline" component={renderControlSelect} name="account_id" type="text" fixedlabel="Account" >
                                    {
                                        accountDataList.map(function (account, index) {
                                            return <MenuItem className="select-item" key={account.account_name} value={account.id} >
                                                {account.account_name}
                                            </MenuItem>
                                        })
                                    }
                                </Field>

                                <InputLabel htmlFor="Webhook URL">Services</InputLabel>
                                <div className="table-outline">
                                    <Table className="table-slack">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell colSpan={2}>Select Services to use</TableCell>
                                            </TableRow>
                                        </TableHead>
                                    </Table>
                                    <div style={{ maxHeight: '180px', overflowX: 'hidden', overflowY: 'auto' }}>
                                        <Table className="table-slack">
                                            <TableBody>
                                                {
                                                    serviceList.map((service, index) => {
                                                        const isActive = activeServices.indexOf(service.service) > -1
                                                        let boxClass = ["switch-green"];
                                                        if (isActive) {
                                                            boxClass.push('active');
                                                        }
                                                        return <TableRow key={service.service}>
                                                            <TableCell numeric className="text-left">{service.service_name}</TableCell>
                                                            <TableCell numeric className="text-right">
                                                                <div className="switch-control">
                                                                    <Switch checked={isActive} className={boxClass.join(' ')} onChange={() => this.statusChangeDialog(service.service, isActive)} />
                                                                </div>
                                                            </TableCell>
                                                        </TableRow>
                                                    })
                                                }
                                            </TableBody>
                                        </Table>
                                    </div>
                                </div>
                            </Grid>
                        </Grid>
                        <div className="dialog-footer">
                            <Button className="btn btn-outline-blue mrR10" onClick={this.props.handleCloseSlackDialog} color="primary">
                                Cancel
                            </Button>
                            <Button type="submit" className="btn btn-primary" color="primary">
                                Save
                            </Button>

                        </div>
                    </form>
                    <SnackbarMessage
                        open={showSnackbarState}
                        message={message}
                        variant={variant}
                        handleClose={this.handleClose}
                    />
                </DialogContent>
            </Dialog>
        )
    }
}

const mapStateToProps = (state, ownProps) => ({
    awsList: state.commonReducer.awsList,
    filterData: state.uiReducer.filterData,
})


function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(Object.assign({}, integrationActions, slackIntegrationActions), dispatch),
        showMessage: message => {
            dispatch(showMessage(message))
        }
    };
}


const connectWith = withRouter((connect(mapStateToProps, mapDispatchToProps)(SlackIntegration)));

const slackIntegrationRedux = reduxForm({ form: 'slack_integration', validate, destroyOnUnmount: false, })(connectWith)

export default slackIntegrationRedux;