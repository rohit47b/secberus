/*
 * @Author: Virendra Patidar 
 * @Date: 2018-11-19 09:39:10 
 * @Last Modified by:   Virendra Patidar 
 * @Last Modified time: 2018-11-19 09:39:10 
 */

import React, { PureComponent } from 'react'

import { Grid } from '@material-ui/core'

import qs from 'qs'

import ForgotPasswordEmail from './ForgotPasswordEmail'

import LoginBackground from 'global/LoginBackground'
import ErrorBoundary from 'global/ErrorBoundary'

class ForgotPasswordEmailPage extends PureComponent {

    render() {
        mixpanel.track("View Page", {
            "Page Name": 'Forgot Password Email',
        });
        const location  = this.props.location.search;
        return (
            <div className="section-login">
                <Grid container spacing={24} className="quad-container">
                    <ErrorBoundary error="bg-error">
                        <LoginBackground></LoginBackground>
                    </ErrorBoundary>
                    <ErrorBoundary error="login-error">
                        <ForgotPasswordEmail email={qs.parse(location.substring(1)).email}></ForgotPasswordEmail>
                    </ErrorBoundary>
                </Grid>
            </div>
        )
    }
}

export default ForgotPasswordEmailPage;
