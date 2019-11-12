/*
 * @Author: Virendra Patidar 
 * @Date: 2018-08-09 11:36:17 
 * @Last Modified by: Virendra Patidar
 * @Last Modified time: 2019-05-24 15:36:48
 */
import Grid from '@material-ui/core/Grid';
import { setProgressBar, setActiveMenu, setActiveParentMenu } from 'actions/commonAction';
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
import history from 'customHistory'

class Home extends PureComponent {
  
    componentDidMount() {
        this.props.setActiveParentMenu('')
        this.props.setActiveMenu('Dashboard')
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
            if(filterData.selectAccount.id === 'all' ||  filterData.selectCloud.id === 'all'){
                if (this.props.cloudAccounts.length > 0){
                    history.push('/app/multi-tenancy-dashboard/home')
                }
            }
        }
    }


    redirectToReportPage(){
    alert('Clicked')
    }

    render() {
        mixpanel.track("View Page", {
            "Page Name": 'Dashboard',
        });
        return (
            <div className="container-fluid page-dashboard page-content">
                {/* <Grid container spacing={24}>
                    <Grid item sm={12}>
                        <h3 className="mr0 main-heading">Dashboard</h3>
                    </Grid>
                </Grid> */}
                <Grid container spacing={24} className="mobile-container container">
                    <Grid item xs={12} md={6}>
                        <Security/>
                    </Grid> 
                    <Grid item xs={12} md={6}>
                    <Compliance/>
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
        }, setActiveMenu: activeMenu => {
            dispatch(setActiveMenu(activeMenu))
        },setActiveParentMenu: activeParentMenu => {
            dispatch(setActiveParentMenu(activeParentMenu))
        },
    };
}

const mapStateToProps = (state, ownProps) => ({
    filterData: state.uiReducer.filterData,
    token: state.userReducer.token,
    layout: state.uiReducer.dashboardLayout,
    cloudAccounts: state.commonReducer.cloud_accounts,
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Home))