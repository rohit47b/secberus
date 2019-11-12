/*
 * @Author: Virendra Patidar 
 * @Date: 2018-09-26 10:12:52 
 * @Last Modified by: Virendra Patidar
 * @Last Modified time: 2018-11-19 09:39:25
 */

import React, { PureComponent } from 'react'
import { Grid } from '@material-ui/core'

import { withRouter } from 'react-router-dom'

import Login from './Login'

import LoginBackground from 'global/LoginBackground'
import ErrorBoundary from 'global/ErrorBoundary'

class LoginPage extends PureComponent {

    render() {
        mixpanel.track("View Page", {
            "Page Name": 'Login',
        });
        return (
            <div className="section-login">
                <Grid container spacing={24} className="quad-container">
                    <ErrorBoundary error="bg-error">
                        <LoginBackground></LoginBackground>
                    </ErrorBoundary>
                    <ErrorBoundary error="login-error">
                        <Login></Login>
                    </ErrorBoundary>
                </Grid>
            </div>

        )
    }
};

export default withRouter(LoginPage);
