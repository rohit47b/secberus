/*
 * @Author: Virendra Patidar 
 * @Date: 2018-10-01 11:38:17 
 * @Last Modified by: Virendra Patidar
 * @Last Modified time: 2019-04-23 16:31:13
 */
import React, { PureComponent } from 'react'

import { Card, CardContent, Typography, Grid } from '@material-ui/core'


class ErrorBoundary extends PureComponent {

  state = { hasError: false };

  componentDidCatch(error, info) {
    this.setState({ hasError: true });
  }

  render() {
    const { hasError } = this.state;
    const { error } = this.props;
    if (hasError) {
      return (
        <Grid item sm={3} className={error + ' form-panel'}>
          <Card className="side-login-panel">
            <CardContent className="quad-content">
              <div className="error-icon">
                <img alt="Error Page" src="/assets/images/error.png" />
                <Typography className="mrB15 mrT20" gutterBottom variant="headline" component="h2">
                  Something went wrong.
                </Typography>
              </div>
            </CardContent>
          </Card>
        </Grid>
      )
    }
    return this.props.children;
  }
}

export default ErrorBoundary;