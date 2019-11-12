
import React, { PureComponent } from 'react'
import { Grid } from '@material-ui/core'

import SignUp from './Resent'

import LoginBackground from 'global/LoginBackground'
import ErrorBoundary from 'global/ErrorBoundary'

class ResentPage extends PureComponent {
    render() {
        return (
            <div className="section-login">
                <Grid container spacing={24} className="quad-container">
                    <ErrorBoundary error="bg-error">
                        <LoginBackground></LoginBackground>
                    </ErrorBoundary>
                   <ErrorBoundary error="login-error">
                       <SignUp></SignUp>
                    </ErrorBoundary>
                </Grid>
            </div>
        )
    }
}


export default ResentPage;
