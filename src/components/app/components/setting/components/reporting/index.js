import React, { PureComponent } from 'react';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

import SearchField from 'global/SearchField'
import ErrorBoundary from 'global/ErrorBoundary'

import history from 'customHistory'

class Reporting extends PureComponent {
    onClickEvent = () => {
        history.push({
            pathname: 'app/assets/details'
        })
    }

    handleChange = () => {
        console.log('  search');
    }
    render() {
        mixpanel.track("View Page", {
            "Page Name": 'Setting Reporting',
        });
        return (
            <div className="page-content">
                <Grid container spacing={24}>
                    <Grid item sm={10} className="pdB0">
                        <h3 className="mr0 main-heading">Reporting</h3>
                    </Grid>
                    <Grid item sm={2}>
                        <SearchField handleChange={this.handleChange} />
                    </Grid>
                    <Grid item sm={12} className="pdT0">
                        <Card className="card-wizard card-notification">
                            <CardContent className="card-body">
                                <ErrorBoundary error="error-boundary">
                                    <Typography className="notification-info" component="div">
                                        <small className="headline">Today</small>
                                        <h5>We're transitioning resource ID's to a formate</h5>
                                        <div className="fnt-13">
                                            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
                                            when an unknown printer took a galley of type and scrambled it to make a type specimen book.
                                    </div>
                                    </Typography>
                                    <Typography className="notification-info" component="div">
                                        <small className="headline">23 July 2018</small>
                                        <h5>Heading of Notification</h5>
                                        <div className="fnt-13">
                                            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
                                            when an unknown printer took a galley of type and scrambled it to make a type specimen book.
                                    </div>
                                        <a className="icon-delete" href="javascript:void(0)"><i className="fa fa-trash-o"></i></a>
                                    </Typography>
                                </ErrorBoundary>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </div>
        );
    }
}

export default Reporting; 
