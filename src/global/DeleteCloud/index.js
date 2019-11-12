/*
 * @Author: Virendra Patidar 
 * @Date: 2018-11-05 16:31:27 
 * @Last Modified by: Virendra Patidar
 * @Last Modified time: 2018-11-27 10:09:21
 */
import React, { PureComponent, Fragment } from 'react'

import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import Button from '@material-ui/core/Button'

import history from 'customHistory'

import { Field, reduxForm } from 'redux-form'
import { connect } from "react-redux"
import { bindActionCreators } from 'redux'
import { withRouter } from 'react-router-dom'

import * as integrationActions from 'actions/integrationAction'
import { showMessage } from 'actions/messageAction'
import { setProgressBar, setAutoRefresh } from 'actions/commonAction'

import Loader from 'global/Loader'

import { renderTextField } from 'reduxFormComponent'

import SnackbarMessage from 'global/SnackbarMessage'


const validate = values => {
    const errors = {}
    const requiredFields = [
        'input_keyword',
    ]

    requiredFields.forEach(field => {
        if (!values[field]) {
            errors[field] = 'This field is required'
        }
        if (values[field] !== 'delete') {
            errors[field] = 'Input Keyword should be "delete"'
        }
    })
    return errors
}

class DeleteCloud extends PureComponent {
    _mounted = false
    state = {
        confirmBtnLabel: 'Delete',
        cancelBtnLabel: 'Cancel',
        title: 'Confirmation',
        content: 'After deletion, the cloud account will no longer exist and will be erased from the face of this planet. To continue deletion, please type in delete',
        typeKeyword: '',

        message: '',
        variant: 'info',
        showSnackbarState: false,
        isProgress: false,
        autoRefresh: false,
        openConfirmDialog: false,
        successDelete: false
    }

    successDialogEvent = () => {

    }

    componentDidMount() {
        this._mounted = true
        this.setState({ content: 'After deletion, the cloud "'+this.props.cloudData.name+'" account will no longer exist and will be erased from the face of this planet. To continue deletion, please type in delete' })
        this.props.reset()
    }

    componentWillUnmount() {
        this._mounted = false
    }

    deleteCloud = () => {
        this.props.actions.deleteCloudAccount(this.props.cloudData.id).
            then(result => {
                this.setState({ isProgress: false })
                if (this._mounted) {
                    if (result !== '') {
                        this.setState({ message: 'Error during the request', showSnackbarState: true, variant: 'error' })
                    } else {
                        this.setState({ 
                            content: 'The cloud "'+this.props.cloudData.name+'" has been deleted successfully!!',
                            successDelete: true,
                            cancelBtnLabel: 'Confirm',
                            title: 'Success' 
                        })
                    }
                }
            });
    }

    handleClose = () => {
        this.setState({ message: '', showSnackbarState: false })
    }

    handleConfirmDialogOpen = () => {
        this.setState({ openConfirmDialog: true });
    }

    handleConfirmDialogClose = () => {
        this.props.setAutoRefresh('LoadTable')
        this.setState({ openConfirmDialog: false });
    };



    render() {
        const { handleSubmit, invalid, submitting, pristine } = this.props
        const { isProgress,openConfirmDialog, variant, message, showSnackbarState, title, content, confirmBtnLabel, cancelBtnLabel, classbtnCancel, classbtnDelete, successDelete } = this.state

        return (
            <Fragment>

                <Button
                    className="btn btn-red"
                    variant="contained"
                    onClick={() => this.handleConfirmDialogOpen()}
                >
                    Delete
                            </Button>

                <Dialog
                    open={openConfirmDialog}
                    onClose={this.handleConfirmDialogClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                    className="confirm-dialog delete-dialog"
                >
                    <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
                    <DialogContent>
                        <DialogContentText className="mrB15">
                            {content}
                        </DialogContentText>

                        { !successDelete && <form className="form-qaud step2" onSubmit={handleSubmit((values) => this.deleteCloud(values))}>
                            <div className="d-flex">
                                <Field onKeyPress={e => {
                                    if (e.key === 'Enter') e.preventDefault();
                                }} className="text-outline" component={renderTextField} name="input_keyword" type="text" />
                                <Button disabled={invalid || submitting || pristine} variant="contained" className='btn btn-red mrL10' onClick={this.deleteCloud}>
                                    {confirmBtnLabel ? confirmBtnLabel : 'Yes'}
                                </Button>
                            </div>
                        </form> }
                    </DialogContent>
                    <DialogActions className="dailog-footer">
                        <Button variant="outlined" className="btn btn-gray" onClick={this.handleConfirmDialogClose} color="primary">
                            {cancelBtnLabel ? cancelBtnLabel : 'No'}
                        </Button> 
                    </DialogActions>
                    <SnackbarMessage
                        open={showSnackbarState}
                        message={message}
                        variant={variant}
                        handleClose={this.handleClose}
                    />
                    {isProgress && <Loader/>}
                </Dialog>
            </Fragment>
        )
    }
}

const deleteCloudReduxForm = reduxForm({ form: 'deleteCloud', validate })(DeleteCloud) 

const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators(Object.assign({}, integrationActions), dispatch),
        showMessage: message => {
            dispatch(showMessage(message))
        }, setProgressBar: isProgress => {
            dispatch(setProgressBar(isProgress))
        }, setAutoRefresh: autoRefresh => {
            dispatch(setAutoRefresh(autoRefresh))
        }
    };
}
export default withRouter(connect(null, mapDispatchToProps)(deleteCloudReduxForm))
