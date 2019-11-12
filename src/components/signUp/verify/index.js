
import React, { PureComponent } from 'react'
import { Grid } from '@material-ui/core'

import Verify from './Verify'

import LoginBackground from 'global/LoginBackground'
import ErrorBoundary from 'global/ErrorBoundary'

import qs from 'qs'

class VerifyPage extends PureComponent {

    render() {
        const location  = this.props.location.search;
        return (
            <div className="section-login">
                <Grid container spacing={24} className="quad-container">
                    <ErrorBoundary error="bg-error">
                        <LoginBackground></LoginBackground>
                    </ErrorBoundary>
                    <ErrorBoundary error="login-error">
                        <Verify data={qs.parse(location.substring(1))}></Verify>
                    </ErrorBoundary>
                </Grid>
            </div>
        )
    }
}

export default VerifyPage;