/*
 * @Author: Virendra Patidar 
 * @Date: 2018-08-09 11:36:17 
 * @Last Modified by: Virendra Patidar
 * @Last Modified time: 2019-05-24 15:36:48
 */
import Grid from '@material-ui/core/Grid';
import { setProgressBar } from 'actions/commonAction';
import * as dashboardActions from 'actions/dashboardAction';
import * as integrationActions from 'actions/integrationAction';
import { showMessage } from 'actions/messageAction';
import * as securityPolicyActions from 'actions/securityPolicyAction';
import { setDashboardLayout } from 'actions/uiAction';
import { store } from 'client';
import { cloneDeep } from "lodash";
import React, { PureComponent } from 'react';
import { connect } from "react-redux";
import { withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import Compliance from './compliance';
import Security from './security';
import AllCloudList from './AllCloudList';


import history from 'customHistory'
class Home extends PureComponent {
    state = {accountAlerts: {}}
    currentValue=this.props.filterData
    componentDidMount() {
        this.unsubscribe = store.subscribe(this.receiveFilterData)
    }

    receiveFilterData = data => {

        const currentState = store.getState()
        const previousValue = this.currentValue
        this.currentValue = currentState.uiReducer.filterData
        if (
            this.currentValue && previousValue !== this.currentValue
        ) {
            const filterData = cloneDeep(currentState.uiReducer.filterData)
            if (filterData.selectAccount.id !== 'all') {
                this.props.setProgressBar(true)
                if (window.location.href.indexOf('multi-tenancy-dashboard') !== -1) {
                    history.push('/app/dashboard/home')
                }
            }

        }
    }
    
    render() {
        const { accountAlerts} = this.state;
        return (
            <div className="container-fluid page-content multi-tenancy-dashboard">
                <Grid container spacing={24} className="mobile-container">
                    <Grid item xs={12} md={5}>
                        <Security />
                    </Grid>
                    <Grid item xs={12} md={7}>
                        <Compliance />
                    </Grid>
                </Grid>
                <Grid container spacing={24} className="mobile-container">
                    <Grid item xs={12} md={12} className="pdB0">
                        <AllCloudList />
                    </Grid>
                </Grid>
                
            </div>
        )
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators(Object.assign({}, dashboardActions, integrationActions, securityPolicyActions), dispatch),
        showMessage: message => {
            dispatch(showMessage(message))
        }, setProgressBar: isProgress => {
            dispatch(setProgressBar(isProgress))
        }, setDashboardLayout: dashboardLayout => {
            dispatch(setDashboardLayout(dashboardLayout))
        }
    };
}

const mapStateToProps = (state, ownProps) => ({
    filterData: state.uiReducer.filterData,
    token: state.userReducer.token,
    layout: state.uiReducer.dashboardLayout
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Home))