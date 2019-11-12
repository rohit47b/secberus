/*
 * @Author: Virendra Patidar 
 * @Date: 2018-10-11 16:44:53 
 * @Last Modified by: Virendra Patidar
 * @Last Modified time: 2019-04-23 16:26:33
 */
import React, { PureComponent, Fragment } from 'react'
import Grid from '@material-ui/core/Grid'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Button from '@material-ui/core/Button'
import Paper from '@material-ui/core/Paper'
import Switch from '@material-ui/core/Switch'
import { Field, reduxForm, SubmissionError } from 'redux-form'
import { renderTextField, renderTextFieldWithEndEditAdornment, renderTextArea } from 'reduxFormComponent'

import ErrorBoundary from 'global/ErrorBoundary'
import ProfilePicture from './ProfilePicture'

import { withRouter } from 'react-router-dom'
import { connect } from "react-redux"
import { bindActionCreators } from 'redux'

import * as profileActions from 'actions/profileAction'
import * as userActions from 'actions/userAction'
import { showMessage } from 'actions/messageAction'
import { setProgressBar } from 'actions/commonAction'
import { setProfileData } from 'actions/profileAction'

const validate = values => {
    const errors = {}
    const requiredFields = [
        //'first_name',
        //'last_name',
        //'contact_number',
        //'email',
    ]

    requiredFields.forEach(field => {
        if (!values[field]) {
            errors[field] = 'This field is required'
        }
    })

    if (
        values.email &&
        !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)
    ) {
        errors.email = 'Invalid email address'
    }

    if (
        values.contact_number &&
        !/^(?:[0-9.^(^)-] ?){6,14}[0-9]$/i.test(values.contact_number)
    ) {
        errors.contact_number = 'Invalid phone number'
    }

    return errors
}

class Profile extends PureComponent {
    _mounted = false
    state = {
        data: {},
        openDialog: false,
        profile_picture: '',
        isEnable: false
    }
    componentDidMount() {
        this._mounted = true
        this.props.setProgressBar(true);
        this.fetchProfile()
    }

    componentWillUnmount() {
        this._mounted = false
    }

    fetchProfile = () => {
        const currentProfile = JSON.parse(this.props.profile)
        this.props.initialize(currentProfile);
        this.setState({isEnable: currentProfile.two_factor_auth}, () => {
            this.props.setProgressBar(false);
        })
    }

    profileUpdate = (values) => {
        /* this.props.setProgressBar(true);
        return this.props.actions.updateProfileDetail(values).then(result => {
            this.props.setProgressBar(false);
            if (this._mounted) {
                if (!result.success) {
                    throw new SubmissionError(result)
                } else {
                    let message = { message: 'Profile details update successfully', showSnackbarState: true, variant: 'success' }
                    this.props.showMessage(message)
                    this.props.setProfileData(values)
                }
            }
        }); */
        this.updateTwoFactorAuth()
    }

    updateTwoFactorAuth = () => {
        if (this.state.isEnable){
            this.props.actions.enableTwoFactorAuth({'email': JSON.parse(this.props.profile).email}).then(result => {
                if (this._mounted) {
                    if (result && typeof(result) === 'string') {
                        throw new SubmissionError(result)
                    } else {
                        let currentProfile = JSON.parse(this.props.profile)
                        currentProfile.two_factor_auth = false
                        this.props.setProfileData(JSON.stringify(currentProfile))
                        localStorage.setItem('profile', JSON.stringify(currentProfile))
                        let message = { message: 'Profile Updated', showSnackbarState: true, variant: 'success' }
                        this.props.showMessage(message)
                    }
                }
            });
        } else {
            this.props.actions.disableTwoFactorAuth({'email': JSON.parse(this.props.profile).email}).then(result => {
                if (this._mounted) {
                    if (result && typeof(result) === 'string') {
                        throw new SubmissionError(result)
                    } else {
                        let currentProfile = JSON.parse(this.props.profile)
                        currentProfile.two_factor_auth = true
                        this.props.setProfileData(JSON.stringify(currentProfile))
                        localStorage.setItem('profile', JSON.stringify(currentProfile))
                        let message = { message: 'Profile Updated', showSnackbarState: true, variant: 'success' }
                        this.props.showMessage(message)
                    }
                }
            });
        }
    }

    handleDialogClose = () => {
        this.setState({ openDialog: false })
    }
    openProfilePicDialog = () => {
        this.setState({ openDialog: true })
    }

    updateProfilePic = (url) => {
        this.setState({ profile_picture: url }, () => {
            let profile = this.props.profile
            profile.profile_picture = url
            this.props.setProfileData(profile)
        })
    }
    enableFactorAuthentication = () => {
        this.setState((pre) => ({ isEnable: !pre.isEnable }))

    }

    render() {
        mixpanel.track("View Page", {
            "Page Name": 'Setting profile',
        });
        const { handleSubmit, invalid, submitting, pristine, valid, submitSucceeded } = this.props;
        const { openDialog, profile_picture, isEnable } = this.state

        return (
            <div className="page-content">
                <Grid container spacing={24}>
                    <Grid item sm={12} className="pdB10">
                        <h3 className="mr0 main-heading">Profile</h3>
                    </Grid>
                    <Grid item sm={12} className="pdB10">
                        <Card className="card-wizard card-profile">
                            <CardContent>
                                <Grid container spacing={24}>
                                    <ErrorBoundary error="error-boundary">
                                        <Grid item xs={12} md={3}>
                                            <div className="add-pic">
                                                <Paper elevation={1} className="profile-pic mrB10">
                                                    <img alt="User Profile Pic" src={this.state.profile_picture === '' ? '/assets/images/user.png' : this.state.profile_picture} />
                                                </Paper>
                                                <label htmlFor="flat-button-file">
                                                    <Button onClick={this.openProfilePicDialog} className="btn btn-upload" component="span">
                                                        Change Profile Picture
                                           </Button>
                                                </label>
                                            </div>
                                        </Grid>
                                        <Grid item xs={12} md={9} className="mrT20">
                                            <form className="pdL20 form-pro" onSubmit={handleSubmit((values) => this.profileUpdate(values))}>
                                                <Grid item xs={12} md={6} className="mrB20">
                                                    <Field className="text-field" component={renderTextField} name="first_name" type="text" label="Your First Name" />
                                                </Grid>
                                                <Grid item xs={12} md={6} className="mrB20">
                                                    <Field className="text-field" component={renderTextField} name="last_name" type="text" label="Your Last Name" />
                                                </Grid>
                                                <Grid container spacing={16}>
                                                    <Grid item xs={12} md={6} className="mrB20">
                                                        <Field className="text-field" component={renderTextField} disabled={true} name="email" type="text" label="Email address" />
                                                    </Grid>
                                                    <Grid item xs={12} md={6}>
                                                        <div className="pdT10">
                                                            <span className="light-text fnt-14">Enable 2-Factor Authentication</span>
                                                            <Switch
                                                                checked={isEnable}
                                                                onChange={this.enableFactorAuthentication}
                                                                value={isEnable}
                                                                className={isEnable ? "select-control-green active" : "select-control-green"}
                                                            />
                                                        </div>
                                                    </Grid>
                                                </Grid>


                                                <Grid item xs={12} md={6} className="mrB20">
                                                    <Field className="text-field" component={renderTextField} name="contact_number" type="text" label="Contact Number" />
                                                </Grid>
                                                {/* <Grid item sm={6} className="mrB15">
                                                <Field className="text-field" component={renderTextFieldWithEndEditAdornment} name="email" type="text" label="Role" />
                                            </Grid>
                                            <Grid item sm={6} className="mrB15">
                                                <Field className="text-field" component={renderTextFieldWithEndEditAdornment} name="email" type="text" label="Permission" />
                                            </Grid> */}
                                                {/* <Grid item sm={12} className="mrB40">
                                                <Field className="text-field" component={renderTextArea} name="name" label="More Info" />
                                            </Grid> */}

                                                <div className="card-footer text-right responsive-profile">
                                                    <Button type="submit" className="btn btn-primary btn-md mrR10" color="primary" variant="contained">
                                                        Update Info </Button>
                                                    <Button className="btn btn-gray btn-md responsive-profile-buttons" onClick={this.handleClose} color="primary" autoFocus>
                                                        Reset</Button>
                                                </div>

                                            </form>
                                        </Grid>
                                        <ProfilePicture updateProfilePic={this.updateProfilePic} profilePicUrl={profile_picture} openDialog={openDialog} handleDialogClose={this.handleDialogClose} />
                                    </ErrorBoundary>
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => ({
    profile: state.userReducer.profile
})

const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators(Object.assign({}, profileActions, userActions), dispatch),
        showMessage: message => {
            dispatch(showMessage(message))
        }, setProgressBar: isProgress => {
            dispatch(setProgressBar(isProgress))
        }, setProfileData: profile => {
            dispatch(setProfileData(profile))
        },
    };
}

const ConnectWithRedux = withRouter((connect(mapStateToProps, mapDispatchToProps)(Profile)));

const ProfileReduxForm = reduxForm({ form: 'profile', validate, destroyOnUnmount: false })(ConnectWithRedux)

export default ProfileReduxForm;