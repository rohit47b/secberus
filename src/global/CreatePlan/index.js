/*
 * @Author: Virendra Patidar 
 * @Date: 2019-02-28 12:56:10 
 * @Last Modified by: Virendra Patidar
 * @Last Modified time: 2019-05-17 12:49:00
 */
import React, { PureComponent } from 'react'
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button'

import { Field, reduxForm } from 'redux-form'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import { showMessage } from 'actions/messageAction'
import { setProgressBar, setAlertsPlan } from 'actions/commonAction'
import { renderTextField } from 'reduxFormComponent'
import { formValueSelector } from 'redux-form'

import * as remediationActions from 'actions/remediationAction'
import Loader from 'global/Loader'
import history from 'customHistory'

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


    state = {
        isSubmitted: false,
        isProgress: false
    }
    componentDidMount() {
        this.props.reset()
    }

    createPlanSubmit = (values) => {
        this.setState({ isProgress: true })
        let payload = { name: values.name, alerts: this.props.selectedAlerts, account_id: this.props.filterData.selectAccount.id }
        this.props.actions.savePlan(payload).
            then(result => {
                this.props.setAlertsPlan([])
                mixpanel.track("Create Remediation Plan", {
                    "Type": "Manual",
                    "Last Date Created": result.create_timestamp,
                    "Type of auto ": 'N/A',
                });
                this.setState({ isSubmitted: true, isProgress: false })
            });
    }

    handleCloseDialog=()=>{
        this.setState({selectedAlerts:[]},()=>{
            this.props.handleCloseDialog()
        })
    }

    render() {
        const { openDialog, handleCloseDialog,handleSuccess } = this.props
        const { handleSubmit, name } = this.props;
        const { isSubmitted, isProgress } = this.state
        return (
            <Dialog
                open={openDialog}
                onClose={() => this.props.handleCloseDialog}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                className="dialog-box"
            >
                <DialogTitle className="dialog-header" id="alert-dialog-title">
                    {isSubmitted === false ? "Please enter the name of this Remediation plan" : " You have successfully created new plan '" + name + "' and added alert to plan"}
                </DialogTitle>
                <DialogContent>
                    {isSubmitted === false ? <form onSubmit={handleSubmit((values) => this.createPlanSubmit(values))}>
                        <Field className="text-field " component={renderTextField} name="name" type="text" />

                        <div className="dialog-footer pdL0 mrT30">
                            <Button className="btn btn-primary btn-md mrR10" type="submit">
                                Next
                        </Button>
                            <Button className="btn btn-light-gray btn-md" onClick={handleCloseDialog}>
                                Cancel
                        </Button>
                        </div>
                    </form> :
                        <div className="dialog-footer pdL0 mrT30">
                            <Button className="btn btn-light-gray btn-md mrR10" onClick={handleSuccess} type="button">
                                Close
                           </Button>
                           <Button className="btn btn-primary btn-md mrR10" onClick={() => history.push('/app/reports/remediation')} type="button">
                                View
                           </Button>
                        </div>}
                    {isProgress === true && <Loader />}
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


const mapStateToProps = (state, ownProps) => {
    const selector = formValueSelector('createPlan')
    return {
        name: selector(state, 'name'),
        filterData: state.uiReducer.filterData,
    }
}

const connectWithRedux = withRouter((connect(mapStateToProps, mapDispatchToProps)(CreateRemediationPlan)));

const CreatePlanDialogRedux = reduxForm({ form: 'createPlan', validate, keepValues: true })(connectWithRedux)

export default CreatePlanDialogRedux;
