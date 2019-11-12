/*
 * @Author: Virendra Patidar 
 * @Date: 2018-07-05 18:18:44 
 * @Last Modified by: Virendra Patidar
 * @Last Modified time: 2019-05-06 21:32:06
 */
import React, { PureComponent } from 'react'

import { Field, reduxForm } from 'redux-form'

import { Button, Card, CardContent, CardHeader, Typography, Grid } from '@material-ui/core'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { SubmissionError } from 'redux-form'
import { withRouter } from 'react-router-dom'
import { Link } from 'react-router-dom'

import history from 'customHistory'
import APPCONFIG from 'constants/Config'

import * as loginActions from 'actions/loginAction'

import { renderTextField, renderPasswordField } from 'reduxFormComponent'
import Loader from 'global/Loader'
import LogingVerificationDialog from './LogingVerificationDialog'

const validate = values => {
    const errors = {}
    const requiredFields = [
        'username',
        'password'
    ]
    requiredFields.forEach(field => {
        if (!values[field]) {
            errors[field] = 'This field is required'
        }
    })
    if (
        values.username &&
        !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.username)
    ) {
        errors.username = 'Invalid email address'
    }
    return errors
}

class Login extends PureComponent {
    _mounted = false
    state = { errorMessage: '', isProgress: false, open:false, token: '', verificationError: '', code: '', email: '' }

    componentDidMount() {
        this._mounted = true
        this.props.reset();
    }

    componentWillUnmount() {
        this._mounted = false
    }

    loginFormSubmit = (values) => {
        this.setState({ isProgress: true })
        return this.props.actions.login(values).
            then(result => {
                if (result && !(typeof result === 'string')) {
                    if (this._mounted) {
                        if (result.token !== undefined) {
                            this.setState({
                                email: values.username,
                                isProgress: false,
                                token: result.token,
                                open: true,
                              });
                        }
                        this.setState({ isProgress: false })
                        throw new SubmissionError(result)
                    }
                } else if (result) {
                    this.setState({ errorMessage: result, isProgress: false  })
                    setTimeout(() => {
                        this.setState({ errorMessage: '' })
                    }, 5000);
                }
            });
    }

    loginVerificationCode = () => {
        const pin = this.state.code
        if (pin === undefined || pin === null || pin === '') {
            this.setState({verificationError: 'Verification code is required'}, () => {
                return;
            })
        } else {
            this.setState({verificationError: ''}, () => {
                this.setState({ isProgress: true })
                const headerPin = pin + ":" + this.state.token + ":" + this.state.email
                return this.props.actions.twofactor(btoa(headerPin), this.state.email).
                    then(result => {
                        if (result && !(typeof result === 'string')) {
                            this.setState({
                                isProgress: false,
                              });
                        } else if (result) {
                            this.setState({ verificationError: result, isProgress: false })
                            setTimeout(() => {
                                this.setState({ verificationError: '' })
                            }, 5000);
                        }
                    });
            })
        }
    }

    handleSetCode = event => {
        this.setState({
          code: event.target.value,
        });
      };

    handleVerificationDialogOpen = () => {
        this.setState({
          open: true,
        });
      };
    
      handleVerificationDialogClose = () => {
        this.setState({ open: false });
      };

    render() {
        const { handleSubmit, invalid, submitting,pristine } = this.props;
        const { errorMessage, isProgress, open, verificationError, code } = this.state
        return (
            <Grid item md={3} className="form-panel">
                <Card className="side-login-panel">
                    <CardHeader
                        avatar={
                            <img alt="Company Logo" src={APPCONFIG.company_logo_path} className="logo-icon" />
                        }
                        className="logo-qaud"
                    />
                    <CardContent className="quad-content">
                        <Typography className="mrB15" gutterBottom variant="headline" component="label">
                            SIGN IN WITH SECBERUS
                            <br /><span className="validation-error">{errorMessage}</span>
                        </Typography>

                        <form onSubmit={handleSubmit((values) => this.loginFormSubmit(values))} className="form-qaud">
                            <Grid item sm={12} className="qaud-grid">
                                <Field className="text-field" component={renderTextField} controllabel="Email" name="username" type="text" />
                            </Grid>
                            <Grid item sm={12} className="qaud-grid mrB10">
                                <Field className="text-field icon-size" component={renderPasswordField} name="password" controllabel="Password" type="password" />
                            </Grid>
                            <div className="mrB20">
                                <Link to="/forgot-password" >Forgot Password</Link>
                            </div>
                            <div>
                                <Button type="submit" variant="contained" className="btn btn-success" disabled={invalid || submitting || pristine}>Sign in</Button>
                            </div>
                        </form>
                        <hr className="divider" />
                        <div className="mrT25 login-foo">
                            <p>Not Registered yet ?</p>
                            <Button onClick={() => history.push('/sign-up')} variant="outlined" className="btn btn-outline">Register</Button>
                        </div>
                    </CardContent>
                </Card>
                {isProgress && <Loader />}
                <LogingVerificationDialog isOpen={open} handleVerificationDialogClose={this.handleVerificationDialogClose} loginVerificationCode={this.loginVerificationCode} verificationError={verificationError} code={code} handleSetCode={this.handleSetCode}/>
            </Grid>
        )
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators(loginActions, dispatch)
    };
}

const connectWithRedux = withRouter((connect(null, mapDispatchToProps)(Login)))
const loginReduxForm = reduxForm({ form: 'login', validate, destroyOnUnmount: false, })(connectWithRedux)

export default loginReduxForm