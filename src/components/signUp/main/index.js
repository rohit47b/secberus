/*
 * @Author: Virendra Patidar 
 * @Date: 2018-11-19 09:40:18 
 * @Last Modified by: Virendra Patidar
 * @Last Modified time: 2019-01-04 12:26:00
 */

import React, { PureComponent } from 'react'

import { Grid } from '@material-ui/core'

import { withRouter } from 'react-router-dom'
import history from 'customHistory'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import qs from 'qs'

import * as signupAction from 'actions/signupAction'

import ErrorPage from './ErrorPage'
import SignUp from './SignUp'

import LoginBackground from 'global/LoginBackground'
import ErrorBoundary from 'global/ErrorBoundary'

class SignUpPage extends PureComponent {

    state = {
        loaded: false,
        message: '',
        valid: false,
        isVerifyRequest: false,
        email: '',
        countryCode: '0',
        stateCode: '0',
        timezone: '',
        uidb64: ''
    }

    componentDidMount() {
        const location = this.props.location.search;
        const parsed = qs.parse(location.substring(1));

        if (parsed.uidb64) {
            this.props.actions.verifyCollbrators(parsed.uidb64).then(result => {
                if (result && result.success) {
                    this.setState({ timezone: parsed.timezone, countryCode: parsed.country, stateCode: parsed.state, uidb64: parsed.uidb64, isVerifyRequest: true, valid: true, email: result.data.email, message: 'Verified your email address.', loaded: true })
                }
                else if (result) {
                    this.setState({ isVerifyRequest: true, message: result, loaded: true, valid: false })
                }
                else {
                    this.setState({ isVerifyRequest: true, message: 'Contact administrator to request access', loaded: true, valid: false })
                }

            });
        } else {
            this.setState({ isVerifyRequest: false, loaded: true })
        }
    }

    render() {
        mixpanel.track("View Page", {
            "Page Name": 'Sing Up',
        });
        const { isVerifyRequest, valid, message, email, loaded, uidb64, countryCode, stateCode,timezone } = this.state;
        return (
            <div className="section-login">
                <Grid container spacing={24} className="quad-container">
                    <ErrorBoundary error="bg-error">
                        <LoginBackground></LoginBackground>
                    </ErrorBoundary>
                    {loaded && <ErrorBoundary error="login-error">
                        {((isVerifyRequest && valid) || !isVerifyRequest) && <SignUp timezone={timezone} countryCode={countryCode} stateCode={stateCode} email={email} uidb64={uidb64}></SignUp>}
                        {isVerifyRequest && !valid && <ErrorPage message={message}></ErrorPage>}
                    </ErrorBoundary>
                    }
                </Grid>
            </div>
        )
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators(signupAction, dispatch)
    };
}

export default withRouter(connect(null, mapDispatchToProps)(SignUpPage));
