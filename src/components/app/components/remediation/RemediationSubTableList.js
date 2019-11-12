import React, { PureComponent } from "react";

import { Column, InfiniteLoader, SortDirection, Table } from "react-virtualized";
import AutoSizer from "react-virtualized/dist/commonjs/AutoSizer";

import { Grid } from '@material-ui/core';

import { sNoCellRenderer,headerRenderer } from 'TableHelper/cellRenderer';

import { withRouter } from 'react-router-dom'
import { connect } from "react-redux"
import { bindActionCreators } from 'redux'
import Loader from 'global/Loader';

import * as remediationActions from 'actions/remediationAction'
import { showMessage } from 'actions/messageAction'
import { setProgressBar } from 'actions/commonAction'

import RiskScore from 'global/RiskScore';
import { HelperPopup } from 'hoc/HelperPopup'

import ComplianceChart from '../dashboard/components/compliance/ComplianceChart'

class RemediationSubTableList extends PureComponent {

    _mounted = false
    
    state = {
        // Table attribute
        headerHeight: 40,
        rowHeight: 25,
        rowCount: 0,
        height: 450,
        sortDirection: SortDirection.ASC,
        count: 10,
        dataList: [],
        loaded: false,
        rowIndex: 0,
        pageNo: 0,
        isMoreData: true,
        perPage: 50,
        loading: true,

        planId: this.props.planId,
        planDetails: {},

        anchorEl: null,
        open: false,
        placement: null,
    }

    componentDidMount() {
        this.fetchRemediationPlanDetails(this.props.planId)
    }

    fetchRemediationPlanDetails(planId) {
        /* this.props.actions.fetchRemediationPlanDetails(planId).
            then(result => {
                if (typeof result !== 'string') {
                    this.setState({ planDetails: result, dataList: result.alerts, loading: false })
               } else {
                   console.log(' Error in fetching remediation plan details :- ',result);
               }
            }); */

        alerts = []
        let AlertDescription = [
            {alert: 'S3 Bucket has Global ACL Permissions enabled', asset: 's3', rule: 'AWS-CIS-S3-1'},
            {alert: 'S3 Logging Enabled', asset: 's3', rule: 'AWS-CIS-S3-6'},
            {alert: 'S3 Bucket has Global GET Permissions enabled via bucket policy', asset: 's3', rule: 'AWS-CIS-S3-2'},
            {alert: 'S3 Object Versioning Not Enabled', asset: 's3', rule: 'AWS-CIS-S3-3'},
            {alert: 'S3 Server Side Encryption Not Enabled', asset: 's3', rule: 'AWS-CIS-S3-4'},
            {alert: 'S3 Bucket has Global List Permissions enabled via bucket policy', asset: 's3', rule: 'AWS-CIS-S3-5'},
            {alert: 'Too Few IAM Users with Administrator Privilege', asset: 'iam', rule: 'AWS-CIS-IAM-1'},
            {alert: 'IAM password policy require at least one lowercase letter', asset: 'iam', rule: 'AWS-CIS-IAM-2'},
            {alert: 'ELB POODLE Vulnerability Detected', asset: 'iam', rule: 'AWS-CIS-IAM-3'},
            {alert: 'Global Service Port Access - PostgreSQL (TCP Port 5432) Detected', asset: 'ec2', rule: 'AWS-CIS-EC2-1'},
            {alert: 'Global ICMP (Ping) Access Detected', asset: 'ec2', rule: 'AWS-CIS-EC2-2'},
            {alert: 'Nearing limits of On-Demand EC2 instances', asset: 'ec2', rule: 'AWS-CIS-EC2-3'}
            ]
        let randomAlerts = [];
            for(var i=1 ; i<=20 ; i++){
        
            randomAlerts.push(Math.floor(Math.random() * 12));
        
            }
        let alerts = [...Array(5).keys()].map(a => ({
            alert_id: `Alert- `+a,
            summary: AlertDescription[randomAlerts[a]].alert,
            age: Math.floor(Math.random() * 24) + ` Hours`,
            status: 'Pending'
    
        }));
        this.setState({ planDetails: [], dataList: alerts, loading: false })
    }

    //   --------------------Table helper method Start-----------------------

    _isRowLoaded = ({ index }) => {
        return !!this.state.dataList[index];
    }

    _loadMoreRows = ({ startIndex, stopIndex }) => {
        console.log(" load more ....", startIndex, stopIndex);
    }


    sort = ({ sortBy, sortDirection }) => {

    }

    noRowsRenderer = () => {
        if (!this.state.loading) {
            return (<div className="data-not-found">
                <span>Records Not Found</span>
            </div>)
        }
        else if (this.state.loading) {
            return <Loader />
        }
    }

    statusCellRenderer = ({ cellData }) => {
        return (
            <span className="text-success">
                {cellData}
            </span>
        )
    }


    _rowGetter = ({ index }) => {
        return this.state.dataList[index];
    }

    handleOpenPopper = (placement) => (event) => {
        const { currentTarget } = event;
        this.setState(state => ({
            anchorEl: currentTarget,
            open: state.placement !== placement || !state.open,
            placement,
        }))
    }

    handleClosePopper = () => {
        this.setState(state => ({
            open: false
        }))
    }


    //   --------------------Table helper method End-----------------------

    render() {
        const {
            headerHeight,
            sortBy,
            sortDirection,
            dataList,
            anchorEl,
            open,
            placement,
            planDetails
        } = this.state;

        const sortedList = dataList;
        return (
            <Grid container spacing={24}>
                <Grid item sm={6} className="pdR0">
                    <AutoSizer>
                        {({ width, height }) => (
                            <InfiniteLoader
                                isRowLoaded={() => this._isRowLoaded}
                                loadMoreRows={this._loadMoreRows}
                                rowCount={5}
                                height={height}
                                threshold={10}
                            >
                                {({ onRowsRendered, registerChild }) => (
                                    <Table
                                        headerHeight={headerHeight}
                                        height={height}
                                        rowCount={dataList.length}
                                        rowGetter={({ index }) => sortedList[index]}
                                        rowHeight={40}
                                        sort={this.sort}
                                        sortBy={sortBy}
                                        sortDirection={sortDirection}
                                        onRowsRendered={onRowsRendered}
                                        width={width}
                                        noRowsRenderer={this.noRowsRenderer}
                                        className="data-table table-no-border"
                                    >

                                        <Column
                                            dataKey="alert_id"
                                            label="Alert ID"
                                            headerRenderer={headerRenderer}
                                            cellRenderer={sNoCellRenderer}
                                            disableSort={true}
                                            width={150}
                                            flexGrow={1}
                                        />

                                        <Column
                                            dataKey="summary"
                                            label="Alert Description"
                                            headerRenderer={headerRenderer}
                                            disableSort={false}
                                            width={200}
                                            flexGrow={2}
                                        />
                                        <Column
                                            dataKey="age"
                                            label="Age"
                                            headerRenderer={headerRenderer}
                                            disableSort={false}
                                            width={300}
                                            flexGrow={2}
                                        />

                                        <Column
                                            dataKey="status"
                                            label="Status"
                                            headerRenderer={headerRenderer}
                                            cellRenderer={this.statusCellRenderer}
                                            disableSort={false}
                                            width={200}
                                            flexGrow={3}
                                        />

                                    </Table>
                                )}
                            </InfiniteLoader>
                        )}
                    </AutoSizer>

                </Grid>
                <Grid item sm={6} className="pdL0">
                    <div className="box-score">
                        <div className="box-header">
                            <span className="box-title">Projection</span>
                            <span onClick={this.handleOpenPopper('bottom-start')} className={open === true ? "alert-icon active" : 'alert-icon'}><i className="fa fa-question-circle" aria-hidden="true"></i></span>
                        </div>
                        <div className="box-body">
                            <Grid container spacing={24}>
                                <Grid item sm={6} className="col-lg-45">
                                    <RiskScore riskScore={planDetails.risk_score_after_plan ? planDetails.risk_score_after_plan : 0} />
                                    <HelperPopup title={"Message"} content={"These scores reflect the projected scores after this plan is completed."} anchorEl={anchorEl} open={open} placement={placement} handleClosePopper={this.handleClosePopper} />
                                </Grid>
                                <Grid item sm={6} className="col-lg-65">
                                    <div className="d-flex">

                                        <ComplianceChart title={'PCI'} passed={70} failed={4} percantage={-2} isShowLegend={false} />
                                        <ComplianceChart title={'HIPAA'} passed={90} failed={4} percantage={-2} isShowLegend={false} />
                                    </div>
                                </Grid>
                            </Grid>
                        </div>
                    </div>
                </Grid>
            </Grid>
        )
    }
}


const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators(Object.assign({}, remediationActions), dispatch),
        showMessage: message => {
            dispatch(showMessage(message))
        }, setProgressBar: isProgress => {
            dispatch(setProgressBar(isProgress))
        }
    };
}

export default withRouter(connect(null, mapDispatchToProps)(RemediationSubTableList))