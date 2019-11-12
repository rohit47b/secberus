/*
 * @Author: Virendra Patidar 
 * @Date: 2018-10-10 09:37:55 
 * @Last Modified by: Virendra Patidar
 * @Last Modified time: 2019-04-23 16:29:41
 */
import React, { PureComponent } from 'react'

import { Button, Card, CardContent, CardHeader, Typography, Grid } from '@material-ui/core'
import MenuItem from '@material-ui/core/MenuItem'
import Switch from '@material-ui/core/Switch'
import { Field, reduxForm, SubmissionError } from 'redux-form'
import { withRouter } from 'react-router-dom'

import history from 'customHistory'
import APPCONFIG from 'constants/Config'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { find } from "lodash"

import * as signupActions from 'actions/signupAction'
import * as commonAction from 'actions/commonAction'

import Loader from 'global/Loader'

import { renderTextField, renderAutoCompleteField, renderCheckbox, renderPasswordField, renderControlSelect } from 'reduxFormComponent'

import { getSuggestions, setConfig } from 'reduxFormComponent/AutoComplete'

const validate = values => {
    const errors = {}

    const requiredFields = [
        'first_name',
        'last_name',
        'email',
        'password',
        'company_name',
        'license_key',
        'iAgree',
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
        values.phone_number &&
        !/^(?:[0-9.^(^)-] ?){6,14}[0-9]$/i.test(values.phone_number)
    ) {
        errors.phone_number = 'Invalid phone number'
    }

    if (
        values.password &&
        !/^(?=.*[A-Za-z])(?=.*\d)(?=.*[$&+,:;=?@#|'"`<>.^*()%!-~/])[A-Za-z\d$&+,:;=?@#|'"`<>.^*()%!-~/]{8,}$/i.test(values.password)
    ) {
        errors.password = 'Password is not strong (Minimum eight characters, at least one letter, one number and one special character.)'
    }
    return errors
}


class SignUp extends PureComponent {


    _mounted = false

    state = {
        errorMessage: '',
        isEnable:false
    }

    componentDidMount() {
        this._mounted = true
        this.props.reset();
        this.props.initialize({ email: this.props.email });
    }

    signUpFormSubmit = (values) => {
        this.setState({ isProgress: true })
        values['IsEnableTwoWayAuth'] = this.state.isEnable
        return this.props.actions.signup(values).
            then(result => {
                if (this._mounted) {
                    if (result) {
                        if (typeof result === 'string' || result instanceof String) {
                            this.setState({ isProgress: false })
                            this.setState({ errorMessage: result })
                            setTimeout(() => {
                                this.setState({ errorMessage: '' })
                            }, 5000);
                        } else {
                            this.setState({ isProgress: false }); throw new SubmissionError(result)

                        }
                    };
                }
            })
    }


    handleTimeZoneSelect = () => {
       
    }
    enableFactorAuthentication=()=>{
        this.setState((pre) => ({  isEnable:!pre.isEnable }))
        
    }
    render() {

        const { handleSubmit, invalid, submitting, pristine, email, uidb64 } = this.props;
        const { timeZoneList, countryValue, stateValue, errorMessage, selectedCountry, countrySuggestions, stateSuggestions, isProgress, countryError,isEnable } = this.state;

        const countryInputProps = {
            placeholder: 'Select Country',
            value: countryValue,
            type: 'search',
            onChange: this.handleChangeCountry,
            onBlur: this.countryOnBlur,
            disabled: uidb64.length !== 0
        };

        const stateInputProps = {
            placeholder: 'Select State',
            value: stateValue,
            type: 'search',
            onChange: this.handleChangeState,
            onBlur: this.countryOnBlur,
            disabled: uidb64.length !== 0
        };
     
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
                            REGISTER WITH SECBERUS
                            <br /><span className="validation-error">{errorMessage}</span>
                        </Typography>

                        <form className="form-qaud" onSubmit={handleSubmit((values) => this.signUpFormSubmit(values))}>
                            <Grid item sm={12} className="qaud-grid">
                                <Field disabled={uidb64.length !== 0} className="text-field" component={renderTextField} name="first_name" type="text" controllabel="First Name" />
                            </Grid>
                            <Grid item sm={12} className="qaud-grid">
                                <Field disabled={uidb64.length !== 0} className="text-field" component={renderTextField} name="last_name" type="text" controllabel="Last Name" />
                            </Grid>
                            <Grid item sm={12} className="qaud-grid">
                                <Field disabled={uidb64.length !== 0} className="text-field" component={renderTextField} name="email" type="text" controllabel="Username (Email Address)" />
                            </Grid>
                            <Grid item sm={12}>
                                <span className="light-text fnt-14">Enable 2-Factor Authentication</span>
                                <Switch
                                    checked={isEnable === true}
                                    onChange={this.enableFactorAuthentication}
                                    value={isEnable === true}
                                    className={isEnable === true ? "select-control-green active" : "select-control-green"}
                                />
                            </Grid>

                            {email === '' && <Grid item sm={12} className="qaud-grid">
                                <Field className="text-field" component={renderTextField} name="company_name" type="text" controllabel="Company Name" />
                            </Grid>
                            }
                            <Grid item sm={12} className="qaud-grid">
                                <Field className="text-field icon-size" component={renderPasswordField} name="password" type="password" controllabel="Password" />
                            </Grid>
                            <Grid item sm={12} className="qaud-grid">
                                <Field disabled={uidb64.length !== 0} className="text-field" component={renderTextField} name="license_key" type="text" controllabel="License Key" />
                            </Grid>
                            <Field className="mt-checkbox" name="iAgree" color="primary" component={renderCheckbox} label="iAgree" />
                            <span className="fnt-12"> I agree with the <a href="javascript:void(0)">Service agreement</a></span>
                            <div className="mrT10">
                                <Button type="submit" variant="contained" className="btn btn-success" disabled={invalid || pristine}>Register</Button>{' '}
                            </div>
                        </form>
                        <hr className="divider" />
                        <div className="mrT25 login-foo">
                            <p >Already Registered ?</p>
                            <Button onClick={() => history.push('/login')} variant="outlined" className="btn btn-outline">Sign In</Button>
                        </div>
                    </CardContent>
                </Card>
                {isProgress && <Loader />}
            </Grid>
        )
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators(Object.assign({}, signupActions, commonAction), dispatch)
    };
}

const connectWithRedux = withRouter((connect(null, mapDispatchToProps)(SignUp)));
const signupReduxForm = reduxForm({ form: 'signup', validate, destroyOnUnmount: false, })(connectWithRedux)

export default signupReduxForm;