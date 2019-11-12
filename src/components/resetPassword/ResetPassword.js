/*
 * @Author: Virendra Patidar 
 * @Date: 2018-11-12 16:14:21 
 * @Last Modified by: Virendra Patidar
 * @Last Modified time: 2019-04-23 16:29:03
 */
import React, { PureComponent } from 'react'

import { Field, reduxForm } from 'redux-form'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { Button, Card, CardHeader, CardContent, Typography, Grid } from '@material-ui/core'

import { withRouter } from 'react-router-dom'
import APPCONFIG from 'constants/Config'

import * as forgotPasswordActions from 'actions/forgotPasswordAction'
import { renderTextField, renderPasswordField } from 'reduxFormComponent'

const validate = values => {
    const errors = {}
    const requiredFields = [
        'email',
        'password',
        'confirm_password'
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
        values.password &&
        !/^(?=.*[A-Za-z])(?=.*\d)(?=.*[$&+,:;=?@#|'"`<>.^*()%!-~/])[A-Za-z\d$&+,:;=?@#|'"`<>.^*()%!-~/]{8,}$/i.test(values.password)
    ) {
        errors.password = 'Password is not strong (Minimum eight characters, at least one letter, one number and one special character.)'
    }


    if (
        values.password && values.confirm_password &&
        values.confirm_password !== values.password
    ) {
        errors.confirm_password = 'Not Match Password'
    }
    return errors
}

class ResetPassword extends PureComponent {

    state = { errorMessage: '' }
    
    componentDidMount() {
        this.props.reset();
        this.props.initialize({ uidb64: this.props.data.uidb64, token: this.props.data.token });
    }

    resetPasswordFormSubmit = (values) => {
        this.props.actions.resetPassword(values).
            then(result => {
                this.setState({ errorMessage: result.message || result })
                setTimeout(() => {
                    this.setState({ errorMessage: '' })
                }, 5000);
            });
    }
    
    render() {
        const { handleSubmit, invalid, submitting, pristine } = this.props;
        const {errorMessage}= this.state

        return (
            <Grid item sm={3} className="form-panel">
                <Card className="side-login-panel">
                    <CardHeader
                        avatar={
                            <img alt="Company Logo" src={APPCONFIG.company_logo_path} className="logo-icon" />
                        }
                        className="logo-qaud"
                    />
                    <CardContent className="quad-content">
                        <Typography className="mrB15" gutterBottom variant="headline" component="label">
                            NEW PASSWORD

                              <br /><span className="validation-error">{errorMessage}</span>
                        </Typography>
                        <form className="form-qaud" onSubmit={handleSubmit((values) => this.resetPasswordFormSubmit(values))}>
                            <Grid item sm={12} className="qaud-grid">
                                <Field className="text-field" component={renderTextField} controllabel="Email" name="email" type="text" placeholder="Email" />
                            </Grid>
                            <Grid item sm={12} className="qaud-grid">
                                <Field className="text-field icon-size" component={renderPasswordField} name="password" type="password" controllabel="Password" />
                            </Grid>
                            <Grid item sm={12} className="qaud-grid">
                                <Field className="text-field icon-size" component={renderPasswordField} name="confirm_password" type="password" controllabel="Confirm Password" />
                            </Grid>
                            <Button type="submit" disabled={invalid || submitting || pristine} variant="contained" className="btn btn-success">Save</Button>
                        </form>
                    </CardContent>
                </Card>
            </Grid>
        )
    }
}

const mapDispatchToProps =(dispatch)=> {
    return {
        actions: bindActionCreators(forgotPasswordActions, dispatch)
    };
}

const connectWithRedux = withRouter((connect(null, mapDispatchToProps)(ResetPassword)));
const resetPasswordReduxForm = reduxForm({ form: 'resetpassword', validate, destroyOnUnmount: false, })(connectWithRedux)

export default resetPasswordReduxForm;
