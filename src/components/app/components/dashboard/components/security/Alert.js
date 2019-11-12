/*
 * @Author: Virendra Patidar 
 * @Date: 2018-09-27 09:03:40 
 * @Last Modified by: Virendra Patidar
 * @Last Modified time: 2019-05-29 12:46:56
 */
import React, { PureComponent } from 'react';

import Grid from '@material-ui/core/Grid';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';

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
import { convertDateFormatWithDateTime } from 'utils/dateFormat'


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

        critical_alert_count: 0,
        high_alert_count: 0,
        low_alert_count: 0,
        medium_alert_count: 0,
        suppressed_alert_count: 0,

        alertTitle: 'low',
        last_scan_date: 'N/A' //'2019-04-08T07:05:29+00:00'
    }
    //SUPPRESSED
    componentDidMount() {
        this._mounted = true
        const filterData = this.props.filterData
        if (filterData.selectAccount.id !== 'all' && filterData.selectAccount.id !== undefined) {
            this._mounted = false
            this.fetchAlertSummery(filterData)
            this.fetchLatestScan(filterData)
            if (this.props.location.state !== undefined && this.props.location.state.backUrlState !== undefined) {
                this.setState({
                    openDrawer: this.props.location.state.backUrlState.openDrawer,
                    alertTitle: this.props.location.state.backUrlState.alertTitle
                })
            }
        }

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
            if (filterData.selectAccount.id !== 'all' && this._mounted) {
                this.fetchAlertSummery(filterData)
                this.fetchLatestScan(filterData)
            }
        }
    }


    fetchLatestScan(filterData) {
        let payload = {}
        payload.cloud_account_id = filterData.selectAccount.id
        this.props.actions.fetchLatestScan(payload).
            then(response => {
                this._mounted = true
                if (typeof response !== 'string') {
                    if (response.latest_scan_datetime !== undefined && response.latest_scan_datetime !== null) {
                        this.setState({ last_scan_date: response.latest_scan_datetime })
                    }
                } else {
                    console.log(' Error in fetching alert summery :- ', response);
                }
            });
    }


    fetchAlertSummery(filterData) {
        let payload = {}
        payload.accountId = filterData.selectAccount.id
        this.props.actions.fetchAlertSummery(payload).
            then(response => {
                this._mounted = true
                if (typeof response !== 'string') {
                    let result = {
                        list: response.data,
                        total_alerts: response.total_alerts,
                    }
                    this.setState({ data: response }, () => {
                        this.setAlertCountData()
                    })
                } else {
                    console.log(' Error in fetching alert summery :- ', response);
                }
            });
    }


    setAlertCountData = () => {
        const CRITICAL = find(this.state.data.summary, { priority: 'CRITICAL' }).open;
        const MEDIUM = find(this.state.data.summary, { priority: 'MEDIUM' }).open;
        const HIGH = find(this.state.data.summary, { priority: 'HIGH' }).open;
        const LOW = find(this.state.data.summary, { priority: 'LOW' }).open;
        const suppressed = this.state.data.suppressed;
        this.setState({ critical_alert_count: CRITICAL, medium_alert_count: MEDIUM, high_alert_count: HIGH, low_alert_count: LOW, suppressed_alert_count: suppressed }, () => {
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
            critical_alert_count,
            high_alert_count,
            low_alert_count,
            medium_alert_count,
            suppressed_alert_count
        } = this.state;

        return (
            <div className="sec-alert mrB40">
                <Grid container spacing={24} className="mrB20">
                    <Grid item sm={4}>
                        <LabelWithHelper message={"Alerts"} title={"Alerts - " + data.alert_count} content={"These are the total number of outstanding cloud security alerts as of the most recent scan. The alerts are sorted based on their security priority."} />
                    </Grid>
                    <Grid item sm={8} className="text-right">
                        {last_scan_date !== "N/A" && <span className="mrR10 fnt-13">Last Scan: { convertDateFormatWithDateTime(last_scan_date) }</span>}
                        {/* <span className="link-hrf fnt-13" onClick={this.toggleDrawerLogs}>View Scan Logs</span> */}
                    </Grid>
                </Grid>
                <Grid container spacing={24}>
                    <Grid item sm={12}>
                        <div className="alert-count alert-count-dashboard">
                            <AlertCount key={"CRITICAL"} toggleDrawer={this.toggleDrawer} borderColorClass={"alert-critical"} alertTitle={"CRITICAL"} alertCount={critical_alert_count} />
                            <AlertCount key={"HIGH"} toggleDrawer={this.toggleDrawer} borderColorClass={"alert-high"} alertTitle={"HIGH"} alertCount={high_alert_count} />
                            <AlertCount key={"MEDIUM"} toggleDrawer={this.toggleDrawer} borderColorClass={"alert-mid"} alertTitle={"MEDIUM"} alertCount={medium_alert_count} />
                            <AlertCount key={"LOW"} toggleDrawer={this.toggleDrawer} borderColorClass={"alert-low"} alertTitle={"LOW"} alertCount={low_alert_count} />
                            <AlertCount key={"suppressed"} toggleDrawer={this.toggleDrawer} borderColorClass={"alert-surpress"} alertTitle={"suppressed"} alertCount={suppressed_alert_count} />
                        </div>
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
        }
    };
}

const mapStateToProps = (state, ownProps) => ({
    filterData: state.uiReducer.filterData,
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Alert))