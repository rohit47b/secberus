/*
 * @Author: Virendra Patidar 
 * @Date: 2018-11-19 09:38:58 
 * @Last Modified by: Virendra Patidar
 * @Last Modified time: 2019-04-23 16:28:09
 */
import React, { PureComponent } from 'react'

import { Button, Card, CardHeader, CardContent, Typography, Grid } from '@material-ui/core'

import history from 'customHistory'

import APPCONFIG from 'constants/Config'

class ForgotPasswordEmail extends PureComponent {

    render() {
        const { email } = this.props
        return (
            <Grid item sm={3} className="form-panel">
                <Card className="side-login-panel">
                    <CardHeader
                        avatar={
                            <img  alt="Company Logo" src={APPCONFIG.company_logo_path} className="logo-icon" />
                        }
                        className="logo-qaud"
                    />
                    <CardContent className="quad-content">
                        <Typography className="mrB15" gutterBottom variant="headline" component="label">
                            PASSWORD RESET EMAIL SEND!
                         </Typography>
                        <Typography className="mrB15" gutterBottom variant="headline" component="p">
                            An email has been sent to {email} follow the directions in the email to reset your password
                        </Typography>
                        <div>
                            <Button type="submit" onClick={() => history.push('/login')} variant="contained" className="btn btn-success">Done</Button>
                        </div>
                    </CardContent>
                </Card>
            </Grid>
        )
    }
}

export default ForgotPasswordEmail
