/*
 * @Author: Virendra Patidar 
 * @Date: 2019-02-28 12:56:10 
 * @Last Modified by: Virendra Patidar
 * @Last Modified time: 2019-05-14 16:38:08
 */
import React, { PureComponent } from 'react'
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button'


import { Field, reduxForm, reset } from 'redux-form'
import { SubmissionError, formValueSelector } from 'redux-form'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'


import { showMessage } from 'actions/messageAction'
import { setProgressBar } from 'actions/commonAction'
import { renderTextField } from 'reduxFormComponent'

import * as remediationActions from 'actions/remediationAction'

const validate = values => {
    const errors = {}
    const requiredFields = [
        'name'
    ]
    requiredFields.forEach(field => {
        if (!values[field]) {
            errors[field] = 'This field is required'
        }
    })
    return errors
}


class CreateRemediationPlan extends PureComponent {

    state={
        changePlan:false
    }


    createPlanSubmit=(values)=>{
        let payload = {account_id:'1234',name:values.name,alerts:['1234']}
        this.props.actions.savePlan(payload).
            then(result => {
                this.setState({
                    changePlan:false
                })
                this.props.handleCloseDialog()
            });
    }

    handleNewPlanConfirmDialog =()=>{
        this.setState({
            changePlan:true
        })
    }

    render() {
        const { openDialog,handleCloseDialog } = this.props
        const { handleSubmit} = this.props;
        const {changePlan} =this.state
        return (
            <Dialog
                open={openDialog}
                onClose={() => this.props.handleCloseDialog}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                className="dialog-box"
            >
                <DialogTitle className="dialog-header" id="alert-dialog-title">
                    {changePlan === false ? "Please enter the name of this Remediation plan" :'You have successfully created "New Plan"' }
            </DialogTitle>
                <DialogContent>
                <form onSubmit={handleSubmit((values) => this.createPlanSubmit(values))}>
                    {changePlan === false &&  <Field className="text-field " component={renderTextField} controllabel="Name" name="name" type="text" />}

                    <div className="dialog-footer pdL0 mrT30">
                    {changePlan === false ?<Button className="btn btn-primary btn-md mrR10" onClick={this.handleNewPlanConfirmDialog} type="button">
                            Next
                        </Button>:<Button className="btn btn-primary btn-md mrR10" type="submit">
                            Save
                        </Button>}
                        <Button className="btn btn-light-gray btn-md" onClick={handleCloseDialog}>
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
        }
    };
}


const connectWithRedux = withRouter((connect(null, mapDispatchToProps)(CreateRemediationPlan)));

const CreatePlanDialogRedux = reduxForm({ form: 'createPlan', validate, keepValues: true, keepDirtyOnReinitialize: true, destroyOnUnmount: false, forceUnregisterOnUnmount: true, enableReinitialize: true })(connectWithRedux)

export default CreatePlanDialogRedux;
