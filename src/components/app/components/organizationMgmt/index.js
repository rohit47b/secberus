/*
 * @Author: Virendra Patidar 
 * @Date: 2018-11-16 14:55:42 
 * @Last Modified by: Virendra Patidar
 * @Last Modified time: 2019-04-04 16:11:04
 */
import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom'
import { Card, CardContent, Grid, Tab, Tabs } from '@material-ui/core';
import Users from './Users';
import CloudAccounts from './CloudAccounts'

class OrganizationMgmt extends PureComponent {

    state = {
        value: 0
    }

    handleChangeTab = (event, value) => {
        this.setState({ value });
    }

    render() {
        const { value } = this.state
        return (
            <Card className="card-wizard card-panel card-tab card-inner">
                <div className="card-title">
                    <h3 className="mrB10 mr0 main-heading"> <Link to="/app/user-management">Company 1 </Link>/ Organization 1</h3>
                    <Tabs
                        value={value}
                        onChange={this.handleChangeTab}
                        indicatorColor="primary"
                        className="tabs tab-policies"
                    >
                        <Tab
                            disableRipple
                            label="Users"
                            className="tab-item mrR20"
                        />
                        <Tab
                            disableRipple
                            label="Cloud Accounts"
                            className="tab-item mrR20"
                        />

                    </Tabs>
                </div>
                <CardContent className="card-body">
                    <Grid container spacing={24} className="grid-container">
                        <Grid item sm={12}>
                            {value === 0 && <Users />}
                            {value === 1 && <CloudAccounts />}
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        )
    }
}


export default OrganizationMgmt