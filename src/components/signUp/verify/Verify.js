import React, { PureComponent } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import history from 'customHistory';

import { Card, CardContent, CardHeader, Typography, Grid, Button } from '@material-ui/core'

import APPCONFIG from 'constants/Config'

import * as signupAction from 'actions/signupAction'

class Verify extends PureComponent {

    state = {
        loaded: false,
        message: '',
        valid: false
    }

    componentDidMount() {
        this.props.actions.verify(this.props.data.uidb64, this.props.data.token).then(result => {
            if (result && result.data && result.data.token) {
                this.setState({ valid: true, message: 'Congratulations! You have successfully verified the email address.', loaded: true })
            }
            else if (result) {
                this.setState({ message: result, loaded: true })
            }
            else {
                this.setState({ message: 'Contact administrator to request access', loaded: true })
            }
        });
    }

    render() {
        const { valid, loaded, message } = this.state
        return (
            <Grid item sm={3} className="form-panel">
                <Card className="side-login-panel">
                    <CardHeader
                        avatar={
                            <img alt="Company Logo" src={APPCONFIG.company_logo_path} className="logo-icon" />
                        }
                        className="logo-qaud"
                    />
                    {loaded &&
                        <CardContent className="quad-content text-center">
                        
                            <Typography className="mrB15" gutterBottom variant="headline" component="label">
                                {valid && 'Email Verified'}
                            </Typography>
                            {valid && <div className="success-icon">
                                <img src="/assets/images/success.png"/>
                            </div>}
                            <Typography className="mrB15" gutterBottom variant="headline" component="p">
                                {message}
                            </Typography>
                            {valid && <Button variant="contained" className="btn btn-success" onClick={() => history.push('/login')}>login</Button>}
                        </CardContent>}
                </Card>
            </Grid>
        )
    }
}

const mapDispatchToProps =(dispatch)=> {
    return {
        actions: bindActionCreators(signupAction, dispatch)
    };
}

export default withRouter(connect(null, mapDispatchToProps)(Verify));
