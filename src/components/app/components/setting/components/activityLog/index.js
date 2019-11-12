/*
 * @Author: Virendra Patidar 
 * @Date: 2018-09-26 10:45:31 
 * @Last Modified by: Virendra Patidar
 * @Last Modified time: 2019-01-04 09:44:03
 */
import React, { PureComponent } from 'react'

import Grid from '@material-ui/core/Grid'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'

import HistoryLogList from 'global/HistoryLogList'
import ErrorBoundary from 'global/ErrorBoundary'

import SystemLogList from './SystemLogList'


class ActivityLog extends PureComponent {

    state = {
        search: '',
        value: 0,
    }

    handleChange = name => event => {
        this.setState({ search: event.target.value })
    }

    handleTabChange = (event, value) => {
        this.setState({ value });
    };

    render() {
        mixpanel.track("View Page", {
            "Page Name": 'Setting Activity Log',
        });
        const { search, value } = this.state
        return (
            <div className="page-wrapper page-content">
                <Grid container spacing={24}>
                    <Grid item sm={12} className="pdB0">
                        <h3 className="mr0 main-heading">Log Details</h3>
                    </Grid>
                   
                    <Grid item sm={12}>
                        <Tabs
                            value={value}
                            onChange={this.handleTabChange}
                            className="tab-wrapper mrB15"
                        >
                            <Tab
                                disableRipple
                                label="Activity Log"
                                className="tab-btn"
                            />
                            <Tab
                                disableRipple
                                label="System Log"
                                className="tab-btn"
                            />
                        </Tabs>
                    </Grid>
                </Grid>
                <Grid container spacing={24} className="grid-container">
                    <Grid item sm={12} className="pdB0">
                        <div className="tab-container">
                            <ErrorBoundary error="error-boundary">
                                {value === 1 &&
                                    <SystemLogList search={search} />
                                }
                            </ErrorBoundary>
                            <ErrorBoundary error="error-boundary">
                                {value === 0 &&
                                    <HistoryLogList search={search} />
                                }
                            </ErrorBoundary>
                        </div>
                    </Grid>
                </Grid>
            </div>
        );
    }
}

export default ActivityLog; 