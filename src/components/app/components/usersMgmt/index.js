/*
 * @Author: Virendra Patidar 
 * @Date: 2018-11-16 14:55:42 
 * @Last Modified by: Virendra Patidar
 * @Last Modified time: 2019-04-24 11:57:11
 */
import React, { PureComponent } from 'react';


import { connect } from "react-redux";
import { withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';


import { Card, CardContent, Grid, Tab, Tabs } from '@material-ui/core';
import { setActiveMenu, setActiveParentMenu } from 'actions/commonAction';
import Users from './Users';
import Organizations from './Organizations'
import CloudAccounts from './CloudAccounts'

class UserMgmt extends PureComponent {

    state = {
        value: 0
    }

    componentDidMount() {
        this.props.setActiveParentMenu('Settings')
        this.props.setActiveMenu('User Mgmt')
    }

    handleChangeTab = (event, value) => {
        this.setState({ value });
    }

    render() {
        mixpanel.track("View Page", {
            "Page Name": 'Setting User Management',
        });
        const { value } = this.state
        return (
            <Card className="card-wizard card-panel card-tab card-inner">
                <div className="card-title">
                    <h3 className="mrB10 mr0 main-heading">Company 1</h3>
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
                        {/* <Tab
                            disableRipple
                            label="Cloud Accounts"
                            className="tab-item mrR20"
                        /> */}

                    </Tabs>
                </div>
                <CardContent className="card-body">
                    <Grid container spacing={24} className="grid-container">
                        <Grid item xs={12} sm={12}>
                            {value === 0 && <Users />}
                            {/* {value === 1 && <CloudAccounts />} */}
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        )
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators(Object.assign({}), dispatch),
        setActiveMenu: activeMenu => {
            dispatch(setActiveMenu(activeMenu))
        },setActiveParentMenu: activeParentMenu => {
            dispatch(setActiveParentMenu(activeParentMenu))
        },
    };
}

export default withRouter(connect(null, mapDispatchToProps)(UserMgmt))