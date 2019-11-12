/*
 * @Author: Virendra Patidar 
 * @Date: 2018-11-23 14:33:36 
 * @Last Modified by: Virendra Patidar
 * @Last Modified time: 2018-11-26 13:15:33
 */

import React, { PureComponent } from 'react'

import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import { Button, Grid } from '@material-ui/core'

import { Field, reduxForm, reset } from 'redux-form'
import { SubmissionError } from 'redux-form'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import { renderTextField } from 'reduxFormComponent'
import Loader from 'global/Loader'

import * as securityPolicyActions from 'actions/securityPolicyAction'
import { showMessage } from 'actions/messageAction'
import { setProgressBar } from 'actions/commonAction'

import SnackbarMessage from 'global/SnackbarMessage'

const validate = values => {
    const errors = {}
    const requiredFields = [
        'name',
    ]
    requiredFields.forEach(field => {
        if (!values[field]) {
            errors[field] = 'This field is required'
        }
    })
    return errors
}



class EditPolicy extends PureComponent {

    _mounted = false
    
    state = {
        isProgress: false,
        openDialog: this.props.openDialog,

        message: '',
        variant: 'info',
        showSnackbarState: false
    }

    static getDerivedStateFromProps(nextProps, state) {
        return { openDialog: nextProps.openDialog }
    }

    componentDidUpdate = (prevProps, prevState) => {
        if (this.props.openDialog !== prevProps.openDialog) {
            this.props.reset();
            this.props.initialize({ name: this.props.name, policy_id: this.props.policy_id });
            this.setState({ openDialog: prevProps.openDialog })
        }
    }

    componentDidMount() {
        this._mounted = true
        this.props.reset();
    }

    componentWillUnmount() {
        this._mounted = false
    }

    EditPolicyNameFormSubmit = (values) => {
        const payload = {
            name: values.name,
            policy_id: this.props.policyId
        }
        return this.props.actions.editPolicyName(payload).
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
                        let message = { message: result.message, showSnackbarState: true, variant: 'success' }
                        this.props.showMessage(message)
                        this.props.editSuccess(payload.name)
                    }
                }
            });
    }


    handleClose = () => {
        this.setState({ message: '', showSnackbarState: false });
    }


    render() {
        const { openDialog, isProgress, variant, message, showSnackbarState } = this.state
        const { handleDialogClose } = this.props
        const { handleSubmit } = this.props;
        return (

            <Dialog
                open={openDialog}
                onClose={handleDialogClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                className="modal-add network-modal modal-report"
            >
                <DialogTitle className="modal-title" id="alert-dialog-title">
                    Edit Policy Name
            <span onClick={handleDialogClose} className="close-icon">
                        <i className="fa fa-times-circle" aria-hidden="true"></i>
                    </span>
                </DialogTitle>
                <DialogContent className="modal-body">
                    {isProgress && <Loader />}
                    <form onSubmit={handleSubmit((values) => this.EditPolicyNameFormSubmit(values))}>
                        <Grid item sm={12} className="qaud-grid mrB10">
                            <Field className="text-field" component={renderTextField} controllabel="Name" name="name" type="text" />
                        </Grid>
                        <Button type="submit" className="btn btn-primary btn-md mrR10" color="primary" variant="contained">
                             Save
                        </Button>
                        <Button className="btn btn-gray btn-md" onClick={handleDialogClose} color="primary" autoFocus>
                            Cancel
                        </Button>
                    </form>

                    <SnackbarMessage
                        open={showSnackbarState}
                        message={message}
                        variant={variant}
                        handleClose={this.handleClose}
                    />
                </DialogContent>
            </Dialog>)
    }
}


const mapStateToProps = (state, ownProps) => {
    return {
        awsList: state.commonReducer.awsList,
        filterData: state.uiReducer.filterData,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(Object.assign({}, securityPolicyActions), dispatch),
        showMessage: message => {
            dispatch(showMessage(message))
        }, setProgressBar: isProgress => {
            dispatch(setProgressBar(isProgress))
        }
    };
}


const connectWithRedux = withRouter((connect(mapStateToProps, mapDispatchToProps)(EditPolicy)));

const EditPolicyRedux = reduxForm({ form: 'edit-policy', validate, keepValues: true })(connectWithRedux)


export default EditPolicyRedux;