/*
 * @Author: Virendra Patidar 
 * @Date: 2018-11-19 09:38:39 
 * @Last Modified by:   Virendra Patidar 
 * @Last Modified time: 2018-11-19 09:38:39 
 */

import React, { PureComponent } from 'react'

import { Grid } from '@material-ui/core'

import ForgotPassword from './ForgotPassword'

import LoginBackground from 'global/LoginBackground'
import ErrorBoundary from 'global/ErrorBoundary'

class ForgotPasswordPage extends PureComponent {

    render() {
        mixpanel.track("View Page", {
            "Page Name": 'Forgot Password',
        });
        return (
            <div className="section-login">
                <Grid container spacing={24} className="quad-container">
                    <ErrorBoundary error="bg-error">
                        <LoginBackground></LoginBackground>
                    </ErrorBoundary>
                    <ErrorBoundary error="login-error">
                        <ForgotPassword></ForgotPassword>
                    </ErrorBoundary>
                </Grid>
            </div>
        )
    }
}

export default ForgotPasswordPage;
