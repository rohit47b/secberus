/*
 * @Author: Virendra Patidar 
 * @Date: 2018-11-14 11:38:57 
 * @Last Modified by: Virendra Patidar
 * @Last Modified time: 2019-04-23 16:30:23
 */
import React, { PureComponent } from 'react'
import { reduxForm } from 'redux-form'
import { Card, CardContent, CardHeader, Typography, Grid, Button } from '@material-ui/core'

import history from 'customHistory';
import APPCONFIG from 'constants/Config'

import SnackbarMessage from 'global/SnackbarMessage'

import * as signupActions from 'actions/signupAction'
import { showMessage } from 'actions/messageAction'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

class Welcome extends PureComponent {
    state = {
        resentEmail: false,
        message: { message: '', showSnackbarState: false, variant: 'error' }
    }

    componentWillMount() {
        this.props.reset();
        this.props.initialize({ email: this.props.email });
    }

    resentEmail = (values) => {
        this.props.actions.resentMail(values).
            then(result => {
                if (result.success) {
                    let message = { message: result.message, showSnackbarState: true, variant: 'success' }
                    this.setState({ message, resentEmail: true })
                }
            })
    }

    handleClose = () => {
        let message = { message: '', showSnackbarState: false, variant: 'error' }
        this.setState({ message })
    }

    render() {
        const { handleSubmit, isVerified } = this.props;
        const { resentEmail } = this.state
        const { showSnackbarState, message, variant } = this.state.message
        return (
            <Grid item sm={3} className="form-panel">
                <Card className="side-login-panel">
                    <CardHeader
                        avatar={
                            <img alt="Company Logo" src={APPCONFIG.company_logo_path} className="logo-icon" />
                        }
                        className="logo-qaud"
                    />
                    <CardContent className="quad-content">
                        <Typography className="mrB15" gutterBottom variant="headline" component="label">
                            WELCOME TO SECBERUS
                        </Typography>
                        <Typography className="mrB5" gutterBottom variant="headline" component="p">
                            {resentEmail ? 'Email resent successfully.' : 'You have successfully created a Secberus account.'}
                        </Typography>
                        {!isVerified && <Typography className="mrB15" gutterBottom variant="headline" component="p">
                            Please click the link on your email address and complete your registration.
                         </Typography>
                        }
                        <form className="form-qaud" onSubmit={handleSubmit((values) => this.resentEmail(values))}>
                            {(!resentEmail && !isVerified) && <Button variant="contained" type="submit" className="btn-success mrR10">Resend</Button>}
                            <Button variant="contained" className="btn-success" onClick={() => history.push('/login')}>Login</Button>
                        </form>
                    </CardContent>
                </Card>

                <SnackbarMessage
                    className="server-error"
                    open={showSnackbarState}
                    message={message}
                    variant={variant}
                    handleClose={this.handleClose}
                />
            </Grid>
        )
    }
}


const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators(Object.assign({}, signupActions), dispatch),
        showMessage: message => {
            dispatch(showMessage(message))
        }
    };
}


export default reduxForm({
    form: 'welcome',
    destroyOnUnmount: false,
})(connect(null, mapDispatchToProps)(Welcome));