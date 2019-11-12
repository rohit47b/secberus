/*
 * @Author: Virendra Patidar 
 * @Date: 2018-11-19 09:39:51 
 * @Last Modified by:   Virendra Patidar 
 * @Last Modified time: 2018-11-19 09:39:51 
 */

import React, { PureComponent } from 'react'
import { Grid } from '@material-ui/core'

import qs from 'qs'
import ResetPassword from './ResetPassword'

import LoginBackground from 'global/LoginBackground'
import ErrorBoundary from 'global/ErrorBoundary'

class ResetPasswordPage extends PureComponent {

    render() {
        mixpanel.track("View Page", {
            "Page Name": 'Reset Password',
        });
        const location  = this.props.location.search;
        return (
            <div className="section-login">
                <Grid container spacing={24} className="quad-container">
                    <ErrorBoundary error="bg-error">
                        <LoginBackground></LoginBackground>
                    </ErrorBoundary>
                    <ErrorBoundary error="login-error">
                        <ResetPassword data={qs.parse(location.substring(1))}></ResetPassword>
                    </ErrorBoundary>
                </Grid>
            </div>
        )
    }
}

export default ResetPasswordPage;
