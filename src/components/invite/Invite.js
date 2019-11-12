/*
 * @Author: Virendra Patidar 
 * @Date: 2018-07-05 18:18:44 
 * @Last Modified by: Virendra Patidar
 * @Last Modified time: 2019-04-23 16:28:35
 */
import React, { PureComponent } from 'react'

import { Card, CardContent, CardHeader, Typography, Grid, Button } from '@material-ui/core'

import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import APPCONFIG from 'constants/Config'

import { Field, reduxForm } from 'redux-form'

import * as signupAction from 'actions/signupAction'
import * as forgotPasswordActions from 'actions/forgotPasswordAction'

import { renderPasswordField } from 'reduxFormComponent'


const validate = values => {
    const errors = {}
    const requiredFields = [
        'new_password',
        'confirm_password'
    ]
    requiredFields.forEach(field => {
        if (!values[field]) {
            errors[field] = 'This field is required'
        }
    })


    if (
        values.new_password &&
        !/^(?=.*[A-Za-z])(?=.*\d)(?=.*[$&+,:;=?@#|'"`<>.^*()%!-~/])[A-Za-z\d$&+,:;=?@#|'"`<>.^*()%!-~/]{8,}$/i.test(values.new_password)
    ) {
        errors.new_password = 'Password is not strong (Minimum eight characters, at least one letter, one number and one special character.)'
    }


    if (
        values.new_password && values.confirm_password &&
        values.confirm_password !== values.new_password
    ) {
        errors.confirm_password = 'Not Match Password'
    }
    return errors
}


class Invite extends PureComponent {

    state = {
        loaded: false,
        message: '',
        valid: true,
        emailId: 'demo@secberus.com',
    }

    componentDidMount() {
        this.props.initialize({ uidb64: this.props.data.uidb64, token: this.props.data.token });
        this.setState({emailId:this.props.data.email})

        let uuid = this.props.data.uidb64
        this.props.actions.verifyCollbrators(uuid).then(result => {
            if (result.success) {
                this.setState({ valid: true, message: 'Verified your email address.', loaded: true })
            }
            else if (result) {
                this.setState({ message: result, loaded: true,valid: false })
            }
            else {
                this.setState({ message: 'Contact administrator to request access', loaded: true,valid: false })
            }

        });
    }

    resetPasswordFormSubmit = (values) => {
        this.props.actions.resetPassword(values).
            then(result => {
                this.setState({ message: result })
                setTimeout(() => {
                    this.setState({ message: '' })
                }, 5000);
            });
    }


    render() {
        const { message, valid, loaded, emailId } = this.state;
        const { handleSubmit, invalid, submitting, pristine } = this.props;
        return (
            <Grid item sm={3} className="form-panel">
                <Card className="side-login-panel">
                    <CardHeader
                        avatar={
                            <img alt="Company Logo" src={APPCONFIG.company_logo_path} className="logo-icon" />
                        }
                        className="logo-qaud"
                    />
                    {loaded &&
                        <CardContent className="quad-content">
                            <Typography className="mrB15" gutterBottom variant="headline" component="label">
                                Welcome
                            </Typography>
                            <Typography className="mrB15" gutterBottom variant="headline" component="p">
                                {emailId}
                            </Typography>
                            <Typography className={valid ? 'mrB15 text-success' : 'mrB15 validation-error'} gutterBottom variant="headline" component="p">
                                {message}
                            </Typography>
                            {valid &&

                                <form className="form-qaud" onSubmit={handleSubmit((values) => this.resetPasswordFormSubmit(values))}>
                                    <Grid item sm={12} className="qaud-grid">
                                        <Field className="text-field icon-size" component={renderPasswordField} name="new_password" type="password" controllabel="Password" />
                                    </Grid>
                                    <Grid item sm={12} className="qaud-grid">
                                        <Field className="text-field icon-size" component={renderPasswordField} name="confirm_password" type="password" controllabel="Confirm Password" />
                                    </Grid>
                                    <Button type="submit" disabled={invalid || submitting || pristine} variant="contained" className="btn btn-success">Save</Button>
                                </form>
                            }
                        </CardContent>}
                </Card>
            </Grid>
        )
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators(Object.assign({}, signupAction, forgotPasswordActions), dispatch),
    };
}


const inviteUser = withRouter((connect(null, mapDispatchToProps)(Invite)));

const inviteUserReduxForm = reduxForm({ form: 'inviteUsersetpassword', validate, destroyOnUnmount: false, })(inviteUser)

export default inviteUserReduxForm;
