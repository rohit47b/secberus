/*
 * @Author: Virendra Patidar 
 * @Date: 2018-07-05 18:18:44 
 * @Last Modified by: Virendra Patidar
 * @Last Modified time: 2019-04-23 16:29:32
 */
import React, { PureComponent } from 'react'
import { Card, CardContent, CardHeader, Typography, Grid, Button } from '@material-ui/core'

import history from 'customHistory';

import APPCONFIG from 'constants/Config'

class ErrorPage extends PureComponent {

    render() {
        const { message } = this.props;
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
                        <Typography className="mrB15" gutterBottom variant="headline" component="p">
                            {message}
                        </Typography>
                        <Button variant="contained" className="btn-success" onClick={() => history.push('/login')}>login</Button>
                    </CardContent>
                </Card>
            </Grid>
        )
    }
}

export default ErrorPage;