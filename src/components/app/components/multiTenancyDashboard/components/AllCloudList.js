import React, { PureComponent, Fragment } from "react";
import { connect } from "react-redux"
import { bindActionCreators } from 'redux'
import { store } from 'client'
import { withRouter } from 'react-router-dom';
import { Column, InfiniteLoader, SortDirection, Table, SortIndicator } from "react-virtualized";
import AutoSizer from "react-virtualized/dist/commonjs/AutoSizer";

import Grid from '@material-ui/core/Grid'

import { setProgressBar } from 'actions/commonAction';
import { showMessage } from 'actions/messageAction';
import * as schedulerSettingActions from 'actions/schedulerSettingAction';
import * as integrationActions from 'actions/integrationAction'
import * as securityPolicyActions from 'actions/securityPolicyAction';
import { setHeaderFilterData } from 'actions/commonAction'

import {headerRenderer } from 'TableHelper/cellRenderer'
import Loader from 'global/Loader';
import SearchField from 'global/SearchField'

import AppConfig from 'constants/Config'

const riskType = ['Low', 'Medium', 'High', 'Critical']
const riskLabelColor = ['text-success', 'text-warning', 'text-orange', 'text-danger']

class AllCloudList extends PureComponent {
    _mounted = false
    state = {

        // Table attribute
        headerHeight: 40,
        rowHeight: 25,
        rowCount: 0,
        height: 450,
        sortBy: "service",
        sortDirection: SortDirection.ASC,

        count: 10,
        dataList: [],

        policyList: [],
        policyId: '',
        service: ['Select Service'],

        checkedA: false,
        loaded: false,
        openDialog: false,
        rowIndex: 0,
        schdulerId: 0,
        pageNo: 0,
        isMoreData: true,
        perPage: 50,
        filterProgress: false,
        allServices: [],
        selectScheduler: [],
        isAllServiceSelect: false,
        openSelectDialog: false,
        status: '',
        repeat_delay_list: [5, 10, 15, 20, 25, 30],
        selectRepeatDelays: ['Select Repeat Delay'],
        defaultCloudList: [
            { name: 'All Clouds', id: 'all', cloudIcon: '/assets/images/cloud_all.png' },
            { name: 'Amazon Web Services', id: 'aws', cloudIcon: '/assets/images/cloud_aws.png' },
            { name: 'Google Cloud Platform', id: 'gcp', cloudIcon: '/assets/images/cloud_gcp.png' },
            { name: 'Azure', id: 'azure', cloudIcon: '/assets/images/cloud_azure.png' },
          ],
    };

    componentDidMount() {
        this.timer = setInterval(this.updateState, 5000);
    }

    componentWillUnmount() {
        clearInterval(this.timer);
    }

    updateState = () => {
        this.setState({state: this.state})
    }

    //currentValue = this.props.accountAlerts

    /* shouldComponentUpdate(nextProps, nextState){
        if (this.state.alerts !== nextProps.accountAlerts){
            this.setState({alerts: nextProps.accountAlerts}, () => {
                this.setState({ loaded: true });
            })
        }
        return true;
    } */

    //   --------------------Custom logic method Start-----------------------

    setSelectAccount = (selectedRow) => {
        const selectedAccount=selectedRow
        if (!selectedAccount.enabled && selectedAccount.id !== 'all') {
          let message = { message: 'Enable account ' + selectedAccount.name + ' for view data', showSnackbarState: true, variant: 'error' }
          this.props.showMessage(message)
        } else {
          let cloud = { name: 'Amazon Web Services', id: 'aws', cloudIcon: '/assets/images/cloud_aws.png' }
           let filterData = { selectAccount: selectedAccount, selectCloud: cloud }
           this.props.setHeaderFilterData(filterData)
        }
      }

    //   --------------------Custom logic method End-----------------------

    searchHandler = name => event => {
        this.setState({ search: event.target.value })
    }

    //   --------------------Table helper method Start-----------------------

    _isRowLoaded = ({ index }) => {
        return !!this.state.dataList[index];
    }

    cloudTypeCellRenderer = ({ rowData, cellData, rowIndex }) => {
        return (
            <div className="d-flex align-item-center"><img className="mrL15" alt="aws" height="30" src={AppConfig.cloudStaticData[rowData.cloud] ? AppConfig.cloudStaticData['cloud_'+rowData.cloud].cloudIconPath : '/assets/images/cloud_all.png'} /></div>
        )
    }

    accountNameCellRenderer = ({ rowData, cellData, rowIndex }) => {
        return (
            <span className="link-hrf" onClick={()=>this.setSelectAccount(rowData)}>{cellData}</span>
        )
    }

    riskScoreCellRenderer = ({ rowData, cellData, rowIndex }) => {
        let riskScore = 0
        let row_risk_score = this.props.riskScores[rowData.id] ? Math.round(this.props.riskScores[rowData.id]) : 0
        if (row_risk_score >= 25 && row_risk_score <= 49) {
            riskScore = 1
        }
        if (row_risk_score >= 50 && row_risk_score <= 79) {
            riskScore = 2
        }
        if (row_risk_score >= 80) {
            riskScore = 3
        }
        return (
            <span className={riskLabelColor[riskScore]}>{row_risk_score} ({riskType[riskScore]})</span>
        )
    }

    alertsCellRenderer = ({ rowData, cellData, rowIndex }) => {
        return (
            <span className="text-danger">{this.props.accountAlerts[rowData.id] ? this.props.accountAlerts[rowData.id] : 0}</span>
        )
    }

    assetsCellRenderer = ({ rowData, cellData, rowIndex }) => {
        return (
            <span><span className="text-danger">{this.props.accountFailedAssets[rowData.id] ? this.props.accountFailedAssets[rowData.id].length : 0}</span> / {this.props.accountAssets[rowData.id] ? this.props.accountAssets[rowData.id] : 0}</span>
        )
    }

    pciCellRender = ({ rowData, cellData, rowIndex }) => {
        let elements = this.props.compliancePercent[rowData.id]
        let percent = 0
        if (elements !== undefined){
            elements.map(element => {
                if (element.compliance.indexOf('PCI') !== -1){
                    percent = element.percent ? element.percent : 0
                }
            })
        } 
        return this.complianceCellRender(Math.round(percent))
    }

    hipaaCellRender = ({ rowData, cellData, rowIndex }) => {
        let elements = this.props.compliancePercent[rowData.id]
        let percent = 0
        if (elements !== undefined){
            elements.map(element => {
                if (element.compliance.indexOf('HIPAA') !== -1){
                    percent = element.percent ? element.percent : 0
                }
            })
        } 
        return this.complianceCellRender(Math.round(percent))
    }

    cisCellRender = ({ rowData, cellData, rowIndex }) => {
        let elements = this.props.compliancePercent[rowData.id]
        let percent = 0
        if (elements !== undefined){
            elements.map(element => {
                if (element.compliance.indexOf('CIS') !== -1){
                    percent = element.percent ? element.percent : 0
                }
            })
        } 
        return this.complianceCellRender(Math.round(percent))
    }

    iso27001CellRender = ({ rowData, cellData, rowIndex }) => {
        let elements = this.props.compliancePercent[rowData.id]
        let percent = 0
        if (elements !== undefined){
            elements.map(element => {
                if (element.compliance.indexOf('ISO 2700') !== -1){
                    percent = element.percent ? element.percent : 0
                }
            })
        } 
        return this.complianceCellRender(Math.round(percent))
    }


    complianceCellRender = (percent) => {
        return (
            <span>{percent}%</span>
        )
    }

    _loadMoreRows = ({ startIndex, stopIndex }) => {
        console.log(" load more ....", startIndex, stopIndex);
        // this.setState({ dataList: this.getRows(startIndex + 5) });
    }

    noRowsRenderer = () => {
        if (!this.state.filterProgress) {
            return (<div className="data-not-found">
                <span>Records Not Found</span>
            </div>)
        }
        else if (this.state.filterProgress) {
            return <Loader />
        }
    }

    headerRenderer = () => {
        return (
            <div className="table-td text-left">
               Account Name
            </div>
        );
    }


    //   --------------------Table helper method End-----------------------


    render() {
        const {
            headerHeight,
            sortBy,
            sortDirection,
            loaded
        } = this.state;
       let dataList = []
       if (this.props.filterData.selectCloud.id !== 'all'){
            this.props.accountList.map(account => {
                if (this.props.filterData.selectCloud.id === account.cloud) {
                    dataList.push(account)
                }
            })
        } else {
            dataList = this.props.accountList
        }
        const sortedList = dataList;

        return (
            <Fragment>
                <Grid container spacing={24}>
                    <Grid item xs={12} sm={12}>
                        <div className="d-flex justify-flex-end">
                            <SearchField handleChange={this.searchHandler} />
                        </div>
                    </Grid>
                </Grid>
                <Grid container spacing={24}>
                    <Grid item xs={12} sm={12}>
                    <div className="table-container" style={{ height: "100%", maxHeight: "100%" }}>
                        <AutoSizer disableHeight>
                            {({ width }) => (
                                <InfiniteLoader
                                    isRowLoaded={this._isRowLoaded}
                                    loadMoreRows={this._loadMoreRows}
                                    rowCount={10}
                                    height={400}
                                    threshold={10}
                                >
                                    {({ onRowsRendered, registerChild }) => (
                                        <Table
                                            headerHeight={headerHeight}
                                            height={400}
                                            rowCount={dataList.length}
                                            rowGetter={({ index }) => sortedList[index]}
                                            rowHeight={40}
                                            sortBy={sortBy}
                                            sortDirection={sortDirection}
                                            onRowsRendered={onRowsRendered}
                                            noRowsRenderer={this.noRowsRenderer}
                                            width={width}
                                            className="data-table table-no-border table-all-cloud"
                                        >

                                            <Column
                                                dataKey="cloud_type"
                                                label="Cloud Type"
                                                headerRenderer={headerRenderer}
                                                cellRenderer={this.cloudTypeCellRenderer}
                                                disableSort={true}
                                                width={150}
                                                flexGrow={1}
                                            />

                                            <Column
                                                dataKey="name"
                                                label="Account Name"
                                                headerRenderer={this.headerRenderer}
                                                cellRenderer={this.accountNameCellRenderer}
                                                disableSort={false}
                                                width={200}
                                                flexGrow={2}
                                                className="justify-content-start"

                                            />

                                            <Column
                                                dataKey="riskScore"
                                                label="Risk Score"
                                                headerRenderer={headerRenderer}
                                                cellRenderer={this.riskScoreCellRenderer}
                                                disableSort={true}
                                                width={200}
                                                flexGrow={3}

                                            />

                                            <Column
                                                dataKey="alerts"
                                                label="Alerts"
                                                headerRenderer={headerRenderer}
                                                cellRenderer={this.alertsCellRenderer}
                                                disableSort={true}
                                                width={200}
                                                flexGrow={3}

                                            />

                                            <Column
                                                dataKey="assets"
                                                label="Assets (Fail/Total)"
                                                headerRenderer={headerRenderer}
                                                cellRenderer={this.assetsCellRenderer}
                                                disableSort={true}
                                                width={200}
                                                flexGrow={3}

                                            />

                                            <Column
                                                dataKey="pci"
                                                label="PCI"
                                                headerRenderer={headerRenderer}
                                                cellRenderer={this.pciCellRender}
                                                disableSort={false}
                                                width={50}
                                                flexGrow={2}

                                            />

                                            <Column
                                                dataKey="hipaa"
                                                label="HIPAA"
                                                headerRenderer={headerRenderer}
                                                cellRenderer={this.hipaaCellRender}
                                                disableSort={false}
                                                width={120}
                                                flexGrow={4}
                                            />
                                            <Column
                                                dataKey="cis"
                                                label="CIS"
                                                headerRenderer={headerRenderer}
                                                cellRenderer={this.cisCellRender}
                                                disableSort={false}
                                                width={120}
                                                flexGrow={4}
                                            />
                                            <Column
                                                dataKey="ISO 2700"
                                                label="ISO 27001"
                                                headerRenderer={headerRenderer}
                                                cellRenderer={this.iso27001CellRender}
                                                disableSort={false}
                                                width={120}
                                                flexGrow={5}
                                            />
                                        </Table>
                                    )}
                                </InfiniteLoader>
                            )}
                        </AutoSizer>
                        </div>
                    </Grid>
                </Grid>
            </Fragment>
        )
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators(Object.assign({}, integrationActions, schedulerSettingActions, securityPolicyActions), dispatch),
        showMessage: message => {
            dispatch(showMessage(message))
        }, setProgressBar: isProgress => {
            dispatch(setProgressBar(isProgress))
        },
        setHeaderFilterData: filterData => {
            dispatch(setHeaderFilterData(filterData))
        }
    }
}
const mapStateToProps = (state, ownProps) => ({
    filterData: state.uiReducer.filterData,
    serviceList: state.commonReducer.serviceList,
    accountList: state.commonReducer.cloud_accounts,
    accountAlerts: state.commonReducer.accountAlerts,
    riskScores: state.commonReducer.riskScores,
    compliancePercent: state.commonReducer.compliancePercent,
    accountAssets: state.commonReducer.accountAssets,
    accountFailedAssets: state.commonReducer.accountFailedAssets,
})
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AllCloudList));