/*
 * @Author: Virendra Patidar 
 * @Date: 2018-09-27 09:03:40 
 * @Last Modified by: Virendra Patidar
 * @Last Modified time: 2019-05-29 12:46:56
 */
import React, { PureComponent } from 'react';

import Grid from '@material-ui/core/Grid';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import Paper from '@material-ui/core/Paper'
import { withRouter } from 'react-router-dom'

import { connect } from "react-redux"
import { bindActionCreators } from 'redux'
import { store } from 'client'
import { cloneDeep, find } from "lodash"

import AlertList from './AlertList';
import ScanLogsTable from 'global/ScanLogsTable';

import * as securityActions from 'actions/securityAction'
import { showMessage } from 'actions/messageAction'
import { setProgressBar } from 'actions/commonAction'

import { AlertCount } from 'hoc/AlertCount';
import LabelWithHelper from 'hoc/Label/LabelWithHelper';

import { setAccountAlerts } from 'actions/commonAction'

const alertClassName = { CRITICAL: 'alert-critical', HIGH: 'alert-high', MEDIUM: 'alert-mid', LOW: 'alert-low', SUPPRESSED: 'alert-surpress' }

class Alert extends PureComponent {

    _mounted = false;

    state = {
        openDrawer: false,
        openDrawerLogs: false,
        data: {
            list: [
                { priority: "CRITICAL", count: 0 }
                , { priority: "HIGH", count: 0 }
                , { priority: "MEDIUM", count: 0 }
                , { priority: "LOW", count: 0 }
                , { priority: "SUPPRESSED", count: 0 }
            ],
            alert_count: 0,
        },

        alert_count: 0,
        critical_alert_count: 0,
        high_alert_count: 0,
        low_alert_count: 0,
        medium_alert_count: 0,
        suppressed_alert_count: 0,

        alertTitle: 'low',
        last_scan_date: '2019-04-08T07:05:29+00:00',
    }

    currentValue = this.props.filterData
    
    //SUPPRESSED
    componentDidMount() {
        this._mounted = true
        const filterData = this.props.filterData
        /* if (filterData.selectAccount.id !== 'all') {
            this.fetchAlertSummery(filterData)
            this.fetchLatestScan(filterData)
        } */
        let selectedAccounts = []
        if (filterData.selectCloud.id !== 'all'){
            this.props.accountList.map(account => {
                if (filterData.selectCloud.id === account.cloud) {
                    selectedAccounts.push(account)
                }
            })
        } else {
            selectedAccounts = this.props.accountList
        }
        this._mounted = false;
        if (this.props.location.state !== undefined && this.props.location.state.backUrlState !== undefined) {
            this.setState({
                openDrawer: this.props.location.state.backUrlState.openDrawer,
                alertTitle: this.props.location.state.backUrlState.alertTitle
            })
        }
        this.fetchAlertSummery(selectedAccounts)
        this.unsubscribe = store.subscribe(this.receiveFilterData)
    }


    receiveFilterData = data => {

        const currentState = store.getState()
        const previousValue = this.currentValue
        this.currentValue = currentState.uiReducer.filterData
        if (
            this.currentValue && previousValue !== this.currentValue && this._mounted
        ) {
            const filterData = cloneDeep(currentState.uiReducer.filterData)
            /* if (filterData.selectAccount.id !== 'all' && this._mounted) {
                this.fetchAlertSummery(filterData)
                this.fetchLatestScan(filterData)
            } */
            this.setState({ critical_alert_count: 0, medium_alert_count: 0, high_alert_count: 0, low_alert_count: 0, suppressed_alert_count: 0, alert_count: 0 }, () => {
                let selectedAccounts = []
                if (filterData.selectCloud.id !== 'all'){
                    this.props.accountList.map(account => {
                        if (filterData.selectCloud.id === account.cloud) {
                            selectedAccounts.push(account)
                        }
                    })
                } else {
                    selectedAccounts = this.props.accountList
                }

                this.fetchAlertSummery(selectedAccounts)
            })
        }
    }


    fetchLatestScan(filterData) {
        let payload = {}
        payload.cloud_account_id = filterData.selectAccount.id
        this.props.actions.fetchLatestScan(payload).
            then(response => {
                if (typeof response !== 'string') {
                    this.setState({ last_scan_date: response.latest_scan_datetime })
                } else {
                    console.log(' Error in fetching alert summery :- ', response);
                }
            });
    }


    fetchAlertSummery(selectedAccounts) {
        selectedAccounts.map(account => {
            let payload = {}
            payload.accountId = account.id
            this.props.actions.fetchAlertSummery(payload).
                then(response => {
                    if (typeof response !== 'string') {
                        /* let result = {
                            list: response.data,
                            total_alerts: response.total_alerts,
                        }
                        this.setState({ data: response }, () => {
                            this.setAlertCountData()
                        }) */
                        this.setAlertCountData(response,  account.id)
                    } else {
                        console.log(' Error in fetching alert summery :- ', response);
                    }
                });
        })
    }


    setAlertCountData = (data, accountId) => {
        let CRITICAL = this.state.critical_alert_count;
        let MEDIUM = this.state.medium_alert_count;
        let HIGH = this.state.high_alert_count;
        let LOW = this.state.low_alert_count;
        let suppressed = this.state.suppressed_alert_count;

        const countCritical = find(data.summary, { priority: 'CRITICAL' }).open;
        const countMedium = find(data.summary, { priority: 'MEDIUM' }).open;
        const countHigh = find(data.summary, { priority: 'HIGH' }).open;
        const countLow = find(data.summary, { priority: 'LOW' }).open;
        const countSuppressed = data.suppressed;

        let accountAlerts = {}
        accountAlerts[accountId] = countCritical + countMedium + countHigh + countLow + countSuppressed
        this.props.setAccountAlerts(accountAlerts)

        let alert_count = this.state.alert_count
        CRITICAL += countCritical;
        MEDIUM += countMedium;
        HIGH += countHigh;
        LOW += countLow;
        suppressed += countSuppressed;
        alert_count += (countCritical + countMedium + countHigh + countLow + countSuppressed)
        this.setState({ critical_alert_count: CRITICAL, medium_alert_count: MEDIUM, high_alert_count: HIGH, low_alert_count: LOW, suppressed_alert_count: suppressed, alert_count }, () => {
            this._mounted = true;
            this.props.setProgressBar(false)
        })
    }


    // --------------- Custom Logic Method Start----------------------
    toggleDrawer = (alertTitle) => {
        this.setState(prevState => ({
            openDrawer: !prevState.openDrawer,
            alertTitle
        }));
    };

    toggleDrawerLogs = () => {
        this.setState(prevState => ({
            openDrawerLogs: !prevState.openDrawerLogs
        }));
    };



    // --------------- Custom Logic Method End----------------------

    render() {
        const { openDrawer, openDrawerLogs, data, last_scan_date, alertTitle,
            alert_count,
            critical_alert_count,
            high_alert_count,
            low_alert_count,
            medium_alert_count,
            suppressed_alert_count
        } = this.state;

        return (
            <div className="sec-alert mrB15">
                <Grid container spacing={24}>
                    <Grid item sm={12}>
                        <LabelWithHelper message={"Alerts"} title={"Alerts - " + alert_count} content={"These are the total number of outstanding cloud security alerts as of the most recent scan. The alerts are sorted based on their security priority."} />
                    </Grid>
                </Grid>
                <Grid container spacing={24}>
                    <Grid item sm={12}>
                        <Paper className="multi-tenancy-dashboard-alert white-paper">
                            <div className="alert-count">
                                <AlertCount key={"CRITICAL"} toggleDrawer={this.toggleDrawer} borderColorClass={"alert-critical"} alertTitle={"CRITICAL"} alertCount={critical_alert_count} />
                                <AlertCount key={"HIGH"} toggleDrawer={this.toggleDrawer} borderColorClass={"alert-high"} alertTitle={"HIGH"} alertCount={high_alert_count} />
                                <AlertCount key={"MEDIUM"} toggleDrawer={this.toggleDrawer} borderColorClass={"alert-mid"} alertTitle={"MEDIUM"} alertCount={medium_alert_count} />
                                <AlertCount key={"LOW"} toggleDrawer={this.toggleDrawer} borderColorClass={"alert-low"} alertTitle={"LOW"} alertCount={low_alert_count} />
                                <AlertCount key={"suppressed"} toggleDrawer={this.toggleDrawer} alertCountSuppress={"alert-count-suppress"} borderColorClass={"alert-surpress"} alertTitle={"suppressed"} alertCount={suppressed_alert_count} />
                            </div>
                        </Paper>
                    </Grid>
                </Grid>
                <SwipeableDrawer onOpen={this.toggleDrawer} onClose={this.toggleDrawer} className="right-sidebar" anchor="bottom" open={openDrawer}>
                    <AlertList alertTitle={alertTitle} toggleDrawer={this.toggleDrawer} alertCount={data.total_alerts} />
                </SwipeableDrawer>
                <SwipeableDrawer onOpen={this.toggleDrawerLogs} onClose={this.toggleDrawerLogs} className="right-sidebar" anchor="bottom" open={openDrawerLogs}>
                    <ScanLogsTable toggleDrawer={this.toggleDrawerLogs} />
                </SwipeableDrawer>
            </div>
        );
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators(Object.assign({}, securityActions), dispatch),
        showMessage: message => {
            dispatch(showMessage(message))
        }, setProgressBar: isProgress => {
            dispatch(setProgressBar(isProgress))
        }, setAccountAlerts: alerts => {
            dispatch(setAccountAlerts(alerts))
        }
    };
}

const mapStateToProps = (state, ownProps) => ({
    filterData: state.uiReducer.filterData,
    accountList:state.commonReducer.cloud_accounts
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Alert))