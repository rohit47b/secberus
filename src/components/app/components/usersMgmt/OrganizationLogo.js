/*
 * @Author: Virendra Patidar 
 * @Date: 2018-10-12 10:24:05 
 * @Last Modified by: Virendra Patidar
 * @Last Modified time: 2019-04-23 16:27:41
 */
import React, { PureComponent } from 'react'

import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import Button from '@material-ui/core/Button'

import Loader from 'global/Loader'

import { withRouter } from 'react-router-dom'
import { connect } from "react-redux"
import { bindActionCreators } from 'redux'

import * as profileActions from 'actions/profileAction'

import SnackbarMessage from 'global/SnackbarMessage'

import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';

class OrganizationLogo extends PureComponent {
    _mounted = false
    state = {
        profilePicUrl: '',
        profilePicSrc: '',
        isProgress: false,
        openDialog: this.props.openDialog,
        isCancelled: false,
        disabled: false,
        coverPicturePreviewImageId: 0,

        message: '',
        variant: 'info',
        showSnackbarState: false
    }


    static getDerivedStateFromProps(nextProps, state) {
        return { openDialog: nextProps.openDialog }
    }

    componentDidMount() {
        this._mounted = true
    }

    componentWillUnmount() {
        this._mounted = false
    }

    componentDidUpdate = (prevProps, prevState) => {
        if (this.props.openDialog !== prevProps.openDialog) {
            this.setState({ openDialog: prevProps.openDialog }, () => {
                this.setState({ profilePicSrc: '' })
            })
        }
        if (this.props.profilePicUrl !== prevProps.profilePicUrl) {
            this.setState({ profilePicUrl: this.props.profilePicUrl }, () => {

            })
        }
    }

    deleteProfilePicture = () => {
        this.setState({ profilePicUrl: '', profilePictureId: 0, profilePicSrc: '' })
        this.handleCloseProfile()
    }



    _handleImageChangeProfilePic(e) {
        e.preventDefault();

        let reader = new FileReader();
        let file = e.target.files[0];

        reader.onloadend = () => {
            this.setState({
                profilePicSrc: reader.result
            }, () => {

            });
        }
        reader.readAsDataURL(file)

    }

    cancelUploading = () => {
        this.setState({ isCancelled: true, profilePicSrc: '', disabled: false, profilePictureId: 0, profilePicUrl: '', isProgress: false })
    }



    /**
     * When image cropped by user and save,send request to server with croped image details
     */

    saveProfilePicture = () => {
        this.profilePictureUpload();
    }


    cropNUploadProfilePicture = () => {

        fetch(this.refs.profileCrop.getCroppedCanvas().toDataURL())
            .then(res => res.blob())
            .then(blob => {
                const file = new File([blob], "profile_picture.png")
                // this.profilePictureUpload(file, url.split(",")[0].split("/")[1].replace(';base64', ''))
            })
    }

    profilePictureUpload(options) {
        this.setState({ disabled: true, isProgress: true })

        fetch(this.refs.profileCrop.getCroppedCanvas().toDataURL())
            .then(res => res.blob())
            .then(blob => {
                const file = new File([blob], "profile_picture.png")
                if (file.size > 1048576) {
                    this.setState({ message: 'File is too big', showSnackbarState: true, variant: 'error', disabled: false, isProgress: false })
                    return
                };
                return this.props.actions.photoUpload(file).
                    then(result => {
                        if (this._mounted) {
                            if (result.success) {
                                this.setState({ message: 'Profile Picture Changed Successfully ', showSnackbarState: true, variant: 'success', profilePicSrc: '', profilePicUrl: result.data.image, isProgress: false }, () => {
                                    this.props.updateOrganizationLogo(this.state.profilePicUrl)
                                })

                            } else {
                                this.setState({ message: result, showSnackbarState: true, variant: 'error' });
                            }
                        }
                        this.setState({ disabled: false, isProgress: false })

                    });
            })


    }

    handleClose = () => {
        this.setState({ message: '', showSnackbarState: false });
    }



    render() {
        const { openDialog, isProgress, variant, message, showSnackbarState, profilePicUrl } = this.state
        const { handleDialogClose } = this.props

        return (

            <Dialog
                open={openDialog}
                onClose={handleDialogClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                className="modal-add network-modal modal-report"
            >
                <DialogTitle className="modal-title" id="alert-dialog-title">
                    Organization Logo
                  <span onClick={handleDialogClose} className="close-icon">
                        <i className="fa fa-times-circle" aria-hidden="true"></i>
                    </span>
                </DialogTitle>
                <DialogContent className="modal-body">
                    {isProgress && <Loader />}

                    {this.state.profilePicSrc === '' &&
                        <div className="cover-pic-preview">
                            <img alt="Cover Picture" src={profilePicUrl === '' ? '/assets/images/user.png' : profilePicUrl} className="img-responsive" />
                        </div>
                    }

                    <div className="text-center mrB20">
                        {this.state.profilePicSrc != '' && <Cropper
                            ref='profileCrop'
                            src={this.state.profilePicSrc}
                            style={{ height: 400, width: '100%' }}
                            aspectRatio={16 / 9}
                            guides={false}
                        />
                        }
                    </div>


                    {/* <Button disabled={this.state.isProgress} className="btn bx-delete-gray-btn pull-left" onClick={this.deleteProfilePicture}>Delete</Button> */}
                    <div className="text-right upload-btn">
                        <input
                            accept="image/*"
                            id="outlined-button-file"
                            multiple
                            type="file"
                            onChange={event => this._handleImageChangeProfilePic(event, 'profilePic')}

                        />
                        {!this.state.isProgress &&

                            <label htmlFor="outlined-button-file">
                                <Button disabled={this.state.isProgress} variant="outlined" component="span" className="btn btn-primary btn-md mrR15 btn-upload">
                                    Change
                         </Button>
                            </label>
                        }

                        {/* <Button disabled={this.state.isProgress} className="btn btn-gray btn-md mrL0" onClick={this.saveProfilePicture}  >Apply</Button> */}
                        <Button disabled={this.state.isProgress} className="btn btn-gray btn-md mrL0" onClick={handleDialogClose}  >Apply</Button>

                    </div>
                </DialogContent>
                <SnackbarMessage
                    open={showSnackbarState}
                    message={message}
                    variant={variant}
                    handleClose={this.handleClose}
                />

            </Dialog>)
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators(profileActions, dispatch),
    };
}
module.exports = withRouter((connect(null, mapDispatchToProps)(OrganizationLogo)));