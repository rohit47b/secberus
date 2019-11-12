
import React, { PureComponent } from 'react'
import { Grid } from '@material-ui/core';

import qs from 'qs'

import Invite from './Invite'

import LoginBackground from 'global/LoginBackground'
import ErrorBoundary from 'global/ErrorBoundary'

class VerifyPage extends PureComponent {

    render() {
        mixpanel.track("View Page", {
            "Page Name": 'Invite User',
        });
        const location  = this.props.location.search;
        return (
            <div className="section-login">
                <Grid container spacing={24} className="quad-container">
                    <ErrorBoundary error="bg-error">
                        <LoginBackground></LoginBackground>
                    </ErrorBoundary>
                    <ErrorBoundary error="login-error">
                        <Invite data={qs.parse(location.substring(1))}></Invite>
                    </ErrorBoundary>
                </Grid>
            </div>

        )
    }
}

export default VerifyPage;