/*
 * @Author: Virendra Patidar 
 * @Date: 2019-03-19 16:34:59 
 * @Last Modified by: Virendra Patidar
 * @Last Modified time: 2019-03-19 17:24:17
 */
import React, { PureComponent } from 'react'
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import { Button, Grid } from '@material-ui/core'
import MenuItem from '@material-ui/core/MenuItem'

import { Field, reduxForm } from 'redux-form'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import * as ruleActions from 'actions/ruleAction'
import { showMessage } from 'actions/messageAction'

const SeverityList = ['Critical', 'High', 'Mid', 'Low', 'Suppessed']
import { renderControlSelect } from 'reduxFormComponent'

class ChangeSeverityForm extends PureComponent {


    state = {
        displaySeverityList: [],
        currentSeverity: 'Select Severity'
    }

    handleSeveritySelect = () => {
    }

    changeSeverity = () => {
        this.props.handleDialogClose()
        let message = { message: 'Severity Changed Successfully', showSnackbarState: true, variant: 'success' }
        this.props.showMessage(message)
    }

    componentDidUpdate = (prevProps, prevState) => {
        if (this.props.currentSeverity !== prevProps.currentSeverity) {
            this.props.initialize({ severity: this.props.currentSeverity })
            const severityIndex = SeverityList.indexOf(this.props.currentSeverity)
            let displaySeverityList = []
            for (var i = 0; i <= severityIndex; i++) {
                displaySeverityList.push(SeverityList[i])
            }
            this.setState({ displaySeverityList, currentSeverity: this.props.currentSeverity })
        }
    }



    render() {
        const { openDialog, handleDialogClose, handleSubmit, rule_details } = this.props
        const { displaySeverityList } = this.state
        return (
            <Dialog
                open={openDialog}
                onClose={handleDialogClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                className="modal-add network-modal modal-report"
            >
                <DialogTitle className="modal-title" id="alert-dialog-title">
                    <strong>Rule</strong> - {rule_details.rule_name ? rule_details.rule_name : ''}
                    <span onClick={handleDialogClose} className="close-icon">
                        <i className="fa fa-times-circle" aria-hidden="true"></i>
                    </span>
                </DialogTitle>
                <DialogContent className="modal-body">
                    <form onSubmit={handleSubmit((values) => this.changeSeverity(values))}>
                        <Grid container spacing={24}>
                            <Grid item sm={6}>
                                <Field onChangeMethod={this.handleSeveritySelect} className="text-field" component={renderControlSelect} name="severity" type="text" label={''}>
                                    {
                                        displaySeverityList.map(item => (
                                            <MenuItem data={item} className="select-item" key={item} value={item}>
                                                {item}
                                            </MenuItem>
                                        ))}
                                    }
                                </Field>
                            </Grid>
                            <Grid item sm={12}>
                                <Button type="submit" className="btn btn-primary btn-md mrR10" color="primary" variant="contained">
                                    {'Save'}
                                </Button>
                                <Button className="btn btn-gray btn-md" onClick={handleDialogClose} color="primary" autoFocus>
                                    Cancel
                               </Button>
                            </Grid>
                        </Grid>

                    </form>
                </DialogContent>
            </Dialog>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(Object.assign({}, ruleActions), dispatch),
        showMessage: message => {
            dispatch(showMessage(message))
        }
    };
}


const connectWithRedux = withRouter((connect(null, mapDispatchToProps)(ChangeSeverityForm)));

const SeverityDialogRedux = reduxForm({ form: 'severityChange', keepValues: true })(connectWithRedux)


export default SeverityDialogRedux;