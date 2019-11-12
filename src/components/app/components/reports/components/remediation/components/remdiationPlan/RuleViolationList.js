import React, { PureComponent } from "react"
import WithDrawer from 'TableHelper/with-drawer'
import { Checkbox } from '@material-ui/core'
import Loader from 'global/Loader';

import { Column, InfiniteLoader, SortDirection, Table } from "react-virtualized";
import AutoSizer from "react-virtualized/dist/commonjs/AutoSizer";
import { headerRenderer } from 'TableHelper/cellRenderer';

import { withRouter } from 'react-router-dom'
import { connect } from "react-redux"
import { bindActionCreators } from 'redux'

import RemediationSubTableList from "./RemediationSubTableList"

import * as remediationActions from 'actions/remediationAction'
import { showMessage } from 'actions/messageAction'
import { setProgressBar } from 'actions/commonAction'
import * as alertsActions from 'actions/alertsAction';
import { fetchServiceIconPath } from 'utils/serviceIcon';
import history from 'customHistory';
import { cloneDeep } from "lodash"

class RuleViolationList extends PureComponent {

    _mounted = false

    state = {
        // Table attribute
        headerHeight: 40,
        rowHeight: 25,
        rowCount: 0,
        height: 450,
        sortBy: "service",
        sortDirection: SortDirection.ASC,

        dataList: [],
        rowIndex: 0,
        loading: true,
        isMoreRecord: false,
        workDoneList: []
    };


    componentDidMount() {
        this._mounted = true

        const filterData = this.props.filterData
        if (filterData.selectAccount.id !== 'all' && filterData.selectAccount.id !== undefined) {
            this.fetchAlerts(filterData)
        } else {
            this.setState({ filterProgress: false })
        }
    }


    fetchAlerts(filterData) {
        let alerts = []
        let alertIds = {}
        const rule_id = this.props.rule
        this.props.plan.alerts.forEach(function (alert) {
            console.log('status--->', alert.status)
            if (alert.rule.id === rule_id) {
                alerts.push(alert)
                alertIds[alert.id] = false
            }
        })
        this.setState({workDoneList: alertIds, dataList: alerts})
    }

    updateWorkDoneList(alertId) {
        let newList = cloneDeep(this.state.workDoneList)
        newList[alertId] = !newList[alertId]
        this.setState({workDoneList: newList})
    }


    //   --------------------Table helper method Start-----------------------

    _isRowLoaded = ({ index }) => {
        return !!this.state.dataList[index];
    }

    _loadMoreRows = ({ startIndex, stopIndex }) => {
        if (this.state.isMoreRecord) {
            console.log(" load more ....", startIndex, stopIndex);
            let pageNo = Math.floor((startIndex) / this.state.perPage)
            if ((pageNo + this.state.perPage) !== this.state.pageNo) {
                this.setState({ pageNo: this.state.pageNo + this.state.perPage, filterProgress: true }, () => {
                    const filterData = this.props.filterData
                    this.fetchAlerts(filterData)
                });
            }
        }
    }


    sort = ({ sortBy, sortDirection }) => {
    }

    noRowsRenderer = () => {
        if (!this.state.loading) {
            return (<div className="data-not-found">Name
                <span>Records Not Found</span>
            </div>)
        }
        else if (this.state.loading) {
            return <Loader />
        }
    }


    toggleActiveClass = (toggleRowIndex) => {
        if (this.state.toggleRowIndex !== toggleRowIndex) {
            this.setState({ toggleRowIndex })
        } else {
            this.setState({ toggleRowIndex: -1 })
        }
    }

    ruleRenderer = (index, planId) => {
        return (
            <RemediationSubTableList />
        );
    }

    nameCellRenderer = ({ cellData }) => {
        const assetName = cellData.asset_type.cloud_service_name
        return (
            <div className="service-icon" title={assetName}>
                {assetName !== undefined && <img src={fetchServiceIconPath(assetName)} />} {cellData.data[cellData.asset_type.discriminator[0]]}
            </div>
        );
    }

    regionCellRenderer = ({ rowData }) => {
        const region = rowData.asset.data.region ? rowData.asset.data.region : ''
        return (
            <div>
                {region.toUpperCase()}
            </div>
        )
    }

    _rowGetter = ({ index }) => {
        return this.state.dataList[index];
    }

    alertIdAnchorCellRenderer = ({...params}) => {
        const alertId = params.rowData.asset.asset_type.cloud + '-' + params.rowData.asset.asset_type.cloud_service_name + '-' + params.rowData.id.substring(0, 6)
        return (
            <div>
                <a onClick={() => history.push({pathname: '/app/alerts/detail/'+params.rowData.id, state: { alert: params.rowData, backUrl: '/app/reports/plan/'+this.props.plan.id, backUrlState: {planId: this.props.plan.id }}})} href="javascript:void(0)">{alertId.toUpperCase()}</a>
            </div>
        );
    };

    workDoneCellRenderer = ({...params}) => {
        const alertId = params.rowData.id
        return (
            <Checkbox
                checked={this.state.workDoneList[alertId]}
                tabIndex={params.rowIndex}
                disableRipple={true}
                color="primary"
                className="checkbox-blue"
                onChange={() => this.updateWorkDoneList(alertId)}
            />
        )
    }

    verifiedCellRenderer = ({...params}) => {
        const alert = params.rowData
        let verified = ''
        if (this.state.workDoneList[alert.id]) {
            if (alert.status === 'OPEN') {
                verified = 'No'
            } else if (alert.status === 'CLOSED_REMEDIATED' || alert.status === 'CLOSED_EXPIRED') {
                verified = 'Yes'
            }
        }
        return (
            <span className={verified === 'yes' ? "text-success" : "text-danger"}>{verified}</span>
        )
    }


    //   --------------------Table helper method End-----------------------

    render() {
        const {
            dataList,
            toggleRowIndex,
        } = this.state;
        return (

            <WithDrawer
                drawerContent={(rowProps) => {
                    return (<div className="sub-table">{this.ruleRenderer(rowProps.index, rowProps.rowData.plan_id)}</div>);
                }}
                rowsDimensions={dataList.map((dataItem) => ({ collapsedHeight: 40, expandedHeight: 130 }))}
            >
                {({ rowHeight, rowRenderer, toggleDrawerWithAnimation, setTableRef }) => (
                    <AutoSizer disableHeight>
                        {({ width }) => (
                            <InfiniteLoader
                                isRowLoaded={this._isRowLoaded}
                                loadMoreRows={this._loadMoreRows}
                                rowCount={dataList.length}
                                height={dataList.length * 80}
                                threshold={10}
                            >
                                {({ onRowsRendered, registerChild }) => (
                                    <Table
                                        ref={setTableRef}
                                        headerHeight={39}
                                        height={dataList.length * 80}
                                        width={width}
                                        rowCount={dataList.length}
                                        rowGetter={this._rowGetter}
                                        rowHeight={rowHeight}
                                        rowRenderer={rowRenderer}
                                        noRowsRenderer={this.noRowsRenderer}
                                        className="data-table table-no-border report-table"
                                    >
                                        <Column
                                            dataKey="alert_id"
                                            label="Alert ID"
                                            headerRenderer={headerRenderer}
                                            cellRenderer={this.alertIdAnchorCellRenderer}
                                            disableSort={true}
                                            width={300}
                                            flexGrow={1}
                                        />
                                        <Column
                                            dataKey="asset"
                                            label="Name"
                                            headerRenderer={headerRenderer}
                                            cellRenderer={this.nameCellRenderer}
                                            disableSort={true}
                                            width={300}
                                            flexGrow={1}
                                        />

                                        <Column
                                            dataKey="asset"
                                            label="Region"
                                            headerRenderer={headerRenderer}
                                            cellRenderer={this.regionCellRenderer}
                                            disableSort={false}
                                            width={300}
                                            flexGrow={2}

                                        />

                                        {/* <Column
                                                    className="col-td toggle-row"
                                                    label=""
                                                    dataKey="resource"
                                                    width={20}
                                                    flexGrow={1}
                                                    headerRenderer={headerRenderer}
                                                    cellRenderer={
                                                        ({ cellData, rowIndex }) => {
                                                            return (
                                                                <div onClick={() => { this.toggleActiveClass(rowIndex) }} className={rowIndex === toggleRowIndex ? 'arrow-down' : ''}>
                                                                    <span style={{ cursor: "pointer",fontSize:"24px",color:"#225BDE" }} onClick={() => toggleDrawerWithAnimation(rowIndex)}>
                                                                        <i className="fa fa-caret-left"></i>
                                                                    </span>
                                                                </div>
                                                            );
                                                        }
                                                    }
                                                /> */}
                                        <Column
                                            dataKey="work_done"
                                            label="Work Done"
                                            headerRenderer={() => {
                                                return (
                                                    <div className="table-td text-center">
                                                        Work Done
                                                            </div>
                                                );
                                            }}
                                            cellRenderer={this.workDoneCellRenderer}
                                            disableSort={false}
                                            width={150}
                                            flexGrow={3}
                                            className="justify-content-center"
                                        />
                                        <Column
                                            dataKey="verified"
                                            label="Verified"
                                            headerRenderer={() => {
                                                return (
                                                    <div className="table-td text-center">
                                                        Verified
                                                            </div>
                                                );
                                            }}
                                            cellRenderer={this.verifiedCellRenderer}
                                            disableSort={false}
                                            width={150}
                                            flexGrow={4}
                                            className="justify-content-center"
                                        />

                                    </Table>
                                )}
                            </InfiniteLoader>
                        )}
                    </AutoSizer>
                )}
            </WithDrawer>
        )
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators(Object.assign({}, remediationActions, alertsActions), dispatch),
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(RuleViolationList))