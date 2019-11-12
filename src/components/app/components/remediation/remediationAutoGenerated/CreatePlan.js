/*
 * @Author: Virendra Patidar 
 * @Date: 2019-02-28 12:56:10 
 * @Last Modified by: Virendra Patidar
 * @Last Modified time: 2019-02-28 15:10:06
 */
import React, { PureComponent } from 'react'
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button'
import MenuItem from '@material-ui/core/MenuItem'

import { Field, reduxForm, reset } from 'redux-form'
import { SubmissionError, formValueSelector } from 'redux-form'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'


import { showMessage } from 'actions/messageAction'
import { setProgressBar, setAlertsPlan } from 'actions/commonAction'
import { renderTextField, renderSelectField } from 'reduxFormComponent'

import * as remediationActions from 'actions/remediationAction'

const validate = values => {
    const errors = {}
    const requiredFields = [
        'criteria',
        'max_alerts'
    ]
    requiredFields.forEach(field => {
        if (!values[field] || values[field] === undefined || values[field] === null) {
            errors[field] = 'This field is required'
        }
    })
    return errors
}


class CreatePlan extends PureComponent {

    componentDidUpdate = (prevProps, prevState) => {
        if (this.props.openDialog !== prevProps.openDialog) {
             this.props.reset();
        }
    }

    createPlanSubmit=(values)=>{

        let payload = {
            account_id:this.props.accountId,
            criteria:values.criteria,
            max_alerts:values.max_alerts,
            selected_alerts: this.props.selectedAlerts
        }

        this.props.actions.savePlan(payload).
            then(result => {
                if (result && (typeof result !== 'string')) {
                    this.props.setAlertsPlan([])
                    this.props.showMessage({ message: 'You have successfully created "New Plan"', showSnackbarState: true, variant: 'success' });
                    this.props.handleCloseDialog()
                } else {
                    this.props.showMessage({ message: result, showSnackbarState: true, variant: 'error' });
                    this.props.handleCloseDialog()
                }
            });
    }

    render() {
        const { openDialog } = this.props
        const { handleSubmit, invalid, submitting, pristine, editPayload } = this.props;
        return (
            <Dialog
                open={openDialog}
                onClose={() => this.props.handleCloseDialog}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                className="dialog-box"
            >
                <DialogTitle className="dialog-header field-plan" id="alert-dialog-title">
                    Please enter the criteria of this<br /> Remediation plan
            </DialogTitle>
                <DialogContent>
                    <form onSubmit={handleSubmit((values) => this.createPlanSubmit(values))}>
                        {/* <Field className="text-field" component={renderTextField} controllabel="Name" name="plan_name" type="text" /> */}
                        <Field className="text-field field-plan" component={renderSelectField} name="criteria" type="select" label="Criteria" controllabel="Criteria">
                            <MenuItem value={'age'}>Age</MenuItem>
                            <MenuItem value={'priority'}>Priority</MenuItem>
                            <MenuItem value={'risk'}>Risk</MenuItem>
                        </Field>
                        <Field className="text-field field-plan" component={renderTextField} controllabel="Max Alerts" name="max_alerts" type="number" />
                        <div className="dialog-footer">
                            <Button className="btn btn-primary btn-md mrR10" type="submit">
                                Save
                            </Button>
                            <Button className="btn btn-light-gray btn-md" onClick={this.props.handleCloseDialog}>
                                Cancel
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(Object.assign({}, remediationActions), dispatch),
        showMessage: message => {
            dispatch(showMessage(message))
        }, setProgressBar: isProgress => {
            dispatch(setProgressBar(isProgress))
        }, setAlertsPlan: alerts_plan => {
            dispatch(setAlertsPlan(alerts_plan))
        }
    };
}


const connectWithRedux = withRouter((connect(null, mapDispatchToProps)(CreatePlan)));

const CreatePlanDialogRedux = reduxForm({ form: 'createPlan', validate, keepValues: true })(connectWithRedux)

export default CreatePlanDialogRedux;
