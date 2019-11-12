
import React, { PureComponent } from 'react'
import { Grid } from '@material-ui/core'

import Welcome from './Welcome'

import LoginBackground from 'global/LoginBackground'
import ErrorBoundary from 'global/ErrorBoundary'

class WelcomePage extends PureComponent {

    componentDidMount() {
        // console.log(' EMaill id ', this.props.location.state.email);
    }
    render() {
        mixpanel.track("View Page", {
            "Page Name": 'Wellcome',
        });
        return (
            <div className="section-login">
                <Grid container spacing={24} className="quad-container">
                    <ErrorBoundary error="bg-error">
                        <LoginBackground></LoginBackground>
                    </ErrorBoundary>
                    <ErrorBoundary error="login-error">
                        <Welcome isVerified={this.props.location.state ? this.props.location.state.isVerified : false} email={this.props.location.state ? this.props.location.state.email : ''}></Welcome>
                    </ErrorBoundary>
                </Grid>
            </div>
        )
    }
}

export default WelcomePage;
