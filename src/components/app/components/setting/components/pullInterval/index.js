/*
 * @Author: Virendra Patidar 
 * @Date: 2018-09-26 10:51:42 
 * @Last Modified by: Virendra Patidar
 * @Last Modified time: 2018-12-20 12:21:52
 */
import React, { PureComponent } from 'react'

import Grid from '@material-ui/core/Grid'
import { setActiveMenu, setActiveParentMenu } from 'actions/commonAction';
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import MenuItem from '@material-ui/core/MenuItem'

import { Field, reduxForm } from 'redux-form'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import ErrorBoundary from 'global/ErrorBoundary'
import PullIntervalList from './PullIntervalList'
import Loader from 'global/Loader'
import { CardWithTitle } from 'hoc/CardWithTitle';
import * as accountMgmtAction from 'actions/accountMgmtAction'
import { showMessage } from 'actions/messageAction'
import { setProgressBar, setMttd } from 'actions/commonAction'

import { renderSelectField } from 'reduxFormComponent'

class PullInterval extends PureComponent {
    _mounted = false
    state = {
        open: false,
        repeatDelay: 0,
        reload: false,
        cloud: {},
        intervals: {
            900: 'Continuous',
            3600: 'Hourly',
            86400: 'Daily',
            60200: 'weekly'
        }
    };

    componentDidMount() {
        this.props.setActiveParentMenu('Settings')
        this.props.setActiveMenu('Detection')
        this._mounted = true
    }

    componentWillUnmount() {
        this._mounted = false
    }

    handleClickOpen = () => {
        this.setState({ open: true });
    };

    handleClose = () => {
        this.setState({ open: false });
    };

    resetReload = () => {
        this.setState({ reload: false });
    }

    editSchduler = (repeatDelay, cloud) => {
        this.setState({ open: true, repeatDelay, cloud });
        if (this.state.intervals[repeatDelay] === undefined) {
            repeatDelay = 900
        }
        this.props.initialize({ repeatDelay: repeatDelay });
    }

    editSchedulerSubmit = (values) => {
        let payload = {
            scan_interval: values.repeatDelay,
            cloud_account_id: this.state.cloud.id,
            cloud: this.state.cloud.cloud,
            name: this.state.cloud.name,
            credentials: this.state.cloud.credentials,
            enabled: this.state.cloud.enabled
        }
        this.props.setProgressBar(true);
        return this.props.actions.updateAccount(payload).
            then(result => {
                if (this._mounted) {
                    if (result && (typeof result !== 'string')) {
                        this.props.setMttd(values.repeatDelay)
                        this.props.setProgressBar(false);
                        this.setState({ reload: true, open: false })
                        let message = { message: 'Cloud ' + payload['name'] + ' detection has been changed to ' + this.state.intervals[payload['scan_interval']], showSnackbarState: true, variant: 'success' }
                        this.props.showMessage(message)
                    }
                    else {
                        this.props.setProgressBar(false);
                        this.setState({ open: false })
                        let message = { message: result, showSnackbarState: true, variant: 'error' }
                        this.props.showMessage(message)
                    }
                }
            });
    }

    handleChange = () => {
        console.log('  search');
    }

    render() {
        mixpanel.track("View Page", {
            "Page Name": 'Setting Detection',
        });
        const { open, reload } = this.state
        const { handleSubmit } = this.props;
        return (

            <CardWithTitle title={<h3 className="card-heading">Cloud Scanner</h3>} bgImageClass={"card-inner"}>
                <Grid container spacing={24} className="grid-container">
                    <Grid item xs={12} sm={12} className="pdT0">
                        <ErrorBoundary error="error-boundary">
                            <PullIntervalList reload={reload} resetReload={this.resetReload} clickEvent={this.editSchduler} />
                        </ErrorBoundary>
                    </Grid>
                </Grid>
                <Dialog
                    open={open}
                    onClose={this.handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                    className="modal-add network-modal modal-interval"
                >
                    <DialogTitle className="modal-title" id="alert-dialog-title">
                        Edit Schedule
                    <span onClick={this.handleClose} className="close-icon">
                            <i className="fa fa-times-circle" aria-hidden="true"></i>
                        </span>
                    </DialogTitle>
                    <DialogContent className="modal-body">
                        <form onSubmit={handleSubmit((values) => this.editSchedulerSubmit(values))}>
                            <Grid item sm={12} className="mrB20">
                                <Field className="text-field" component={renderSelectField} name="repeatDelay" type="text" label="State">
                                    <MenuItem value={900}>Continuous</MenuItem>
                                    <MenuItem value={3600}>Hourly</MenuItem>
                                    <MenuItem value={86400}>Daily</MenuItem>
                                    <MenuItem value={60200}>weekly</MenuItem>
                                    {/* <MenuItem value={'Suppressed'}>Suppressed</MenuItem> */}
                                </Field>
                            </Grid>
                            <Button type="submit" className="btn btsn-primary btn-md mrR10" color="primary" variant="contained">
                                Save
                            </Button>
                            <Button className="btn btn-gray btn-md responsive-cancel-edit-schedule" onClick={this.handleClose} color="primary" autoFocus>
                                Cancel
                            </Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </CardWithTitle>
        );
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators(accountMgmtAction, dispatch),
        showMessage: message => {
            dispatch(showMessage(message))
        }, setProgressBar: isProgress => {
            dispatch(setProgressBar(isProgress))
        }, setActiveMenu: activeMenu => {
            dispatch(setActiveMenu(activeMenu))
        },setActiveParentMenu: activeParentMenu => {
            dispatch(setActiveParentMenu(activeParentMenu))
        }, setMttd: mttd => {
            dispatch(setMttd(mttd))
        }, 
    };
}

const connectWithRedux = withRouter((connect(null, mapDispatchToProps)(PullInterval)));
const pullIntervalReduxForm = reduxForm({ form: 'pullInterval', destroyOnUnmount: false, })(connectWithRedux)

export default pullIntervalReduxForm