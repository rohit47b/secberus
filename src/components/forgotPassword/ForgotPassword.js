/*
 * @Author: Virendra Patidar 
 * @Date: 2018-11-19 09:37:35 
 * @Last Modified by: Virendra Patidar
 * @Last Modified time: 2019-04-23 16:27:58
 */
import React, { PureComponent } from 'react'

import { Card, CardContent, CardHeader, Typography, Grid, Button } from '@material-ui/core'

import { Field, reduxForm, SubmissionError } from 'redux-form'
import { renderTextField } from 'reduxFormComponent'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import history from 'customHistory'

import APPCONFIG from 'constants/Config'

import * as forgotPasswordActions from 'actions/forgotPasswordAction'


const validate = values => {
    const errors = {}
    const requiredFields = [
        'email',
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
    return errors
}

class ForgotPassword extends PureComponent {

    state = { errorMessage: '' }

    componentWillMount() {
        this.props.reset();
    }

    forgetPasswordFormSubmit = (values) => {
        return this.props.actions.forgotPassword(values).
            then(result => {
                throw new SubmissionError(result)
            });
    }

    render() {
        const { handleSubmit, invalid, submitting, pristine } = this.props;
        const { errorMessage } = this.state

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
                            FORGOT PASSWORD
                            <br /><span className="validation-error">{errorMessage}</span>
                        </Typography>
                        <Typography className="mrB15" gutterBottom variant="headline" component="p">
                            Please enter your email id to request a password reset
                         </Typography>

                        <form className="form-qaud" onSubmit={handleSubmit((values) => this.forgetPasswordFormSubmit(values))}>
                            <Grid item sm={12} className="qaud-grid">
                                <Field className="text-field" component={renderTextField} controllabel="Email" name="email" type="text" placeholder="Email" />
                            </Grid>
                            <Button type="submit" disabled={invalid || submitting || pristine} variant="contained" className="btn btn-success">Password Reset</Button>
                        </form>
                        <hr className="divider" />
                        <div className="mrT25 login-foo">
                            <p>Not Registered yet ?</p>
                            <Button onClick={() => history.push('/sign-up')} variant="outlined" className="btn btn-outline mrR10">Register</Button>
                            <Button onClick={() => history.push('/login')} variant="outlined" className="btn btn-outline">Sign in</Button>
                        </div>
                    </CardContent>
                </Card>
            </Grid>
        )
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators(forgotPasswordActions, dispatch)
    };
}

const connectWithRedux = withRouter((connect(null, mapDispatchToProps)(ForgotPassword)));
const forgotPasswordReduxForm = reduxForm({ form: 'forgotpassword', validate, destroyOnUnmount: false, })(connectWithRedux)

export default forgotPasswordReduxForm;
