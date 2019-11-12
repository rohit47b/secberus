/*
 * @Author: Virendra Patidar 
 * @Date: 2018-10-09 11:08:57 
 * @Last Modified by: Virendra Patidar
 * @Last Modified time: 2018-11-23 14:30:13
 */
import React, { PureComponent } from "react"

import {
    Table,
    Column,
    SortDirection,
    InfiniteLoader,
    CellMeasurer,
    CellMeasurerCache
} from "react-virtualized"
import AutoSizer from "react-virtualized/dist/commonjs/AutoSizer"
import Grid from '@material-ui/core/Grid'
import Chip from '@material-ui/core/Chip'

import { connect } from "react-redux"
import { store } from 'client'
import { bindActionCreators } from 'redux'
import { cloneDeep } from "lodash"
import { withRouter } from 'react-router-dom'

import Loader from 'global/Loader'
import { CountBox } from 'hoc/Box/CountBox'
import ErrorBoundary from 'global/ErrorBoundary'
import SearchField from 'global/SearchField'

import { sNoCellRenderer, headerRenderer, dateCellRenderer, wrapTextCellRenderer } from 'TableHelper/cellRenderer'
import { showMessage } from 'actions/messageAction'
import { setProgressBar } from 'actions/commonAction'

import * as reportScheduleActions from 'actions/reportScheduleAction'

class AlertList extends PureComponent {
    _mounted = false
    state = {

        // Table attribute
        headerHeight: 40,
        rowHeight: 25,
        rowCount: 0,
        height: 450,
        sortBy: "columnone",
        sortDirection: SortDirection.ASC,

        count: 10,
        dataList: [],
        checkedA: false,
        loaded: false,
        openDialog: false,
        openEditDialog: false,
        rowIndex: 0,
        schdulerId: 0,
        pageNo: 0,
        isMoreData: true,
        perPage: 50,
        filterProgress: false,
        editPayload: {},
        criticalReport:0,
        highReport:0,
        mediumReport:0,
        lowReport:0,
        reportId: null,
        openAddDialog: false
    };

    currentValue = this.props.filterData

    componentDidMount() {
        this._mounted = true
        const filterData = this.props.filterData
        this.props.setProgressBar(false);
        if (filterData.selectAccount.id !== 'all' && filterData.selectAccount.id !== undefined) {
            this._mounted = false
            this.fetchSchdulerReport(filterData)
        } else {
            this.props.setProgressBar(false);
        }
        this.unsubscribe = store.subscribe(this.receiveFilterData)
    }

    componentWillUnmount() {
        this._mounted = false
    }

    receiveFilterData = data => {
        const currentState = store.getState()
        const previousValue = this.currentValue
        this.currentValue = currentState.uiReducer.filterData
        if (
            this.currentValue &&
            previousValue !== this.currentValue
        ) {
            const filterData = cloneDeep(currentState.uiReducer.filterData)
            if (filterData.selectAccount.id !== 'all' && this._mounted) {
                this.props.setProgressBar(true);
                this.fetchSchdulerReport(filterData)
            }
        }
    }

    static getDerivedStateFromProps(nextProps, state) {
        return { reload: nextProps.reload }
    }

    componentDidUpdate = (nextProps, prevState) => {
        if (this.props !== nextProps) {
            if (this.props.reload) {
                this.setState({ filterProgress: false }, () => {
                    const filterData = this.props.filterData
                    this.fetchSchdulerReport(filterData.selectAccount.id)
                })
            }
        }
    }

    //   --------------------Custom logic method Start-----------------------


    fetchSchdulerReport(filterData) {
        let pyaload = {
            account_id: filterData.selectAccount.id
        }
        this.props.actions.fetchReportSchedule(pyaload).
            then(result => {
                this._mounted = true
                if (result.success) {
                    this.props.setProgressBar(false);
                    this.setState({ dataList: result.data, loaded: true, filterProgress: false });
                } else {
                    this.props.setProgressBar(false);
                    this.setState({ dataList: [], loaded: true, filterProgress: false })
                    let message = { message: result, showSnackbarState: true, variant: 'error' }
                    this.props.showMessage(message)
                }
                this.props.setProgressBar(false);
            });
    }


    sortProperties(obj, sortedBy, isNumericSort, reverse) {
        sortedBy = sortedBy || 1; // by default first key
        isNumericSort = isNumericSort || false; // by default text sort
        reverse = reverse || false; // by default no reverse

        let reversed = (reverse) ? -1 : 1;

        const sortedData = []
        for (let key in obj) {
            if (obj.hasOwnProperty(key)) {
                sortedData.push(obj[key])
            }
        }
        if (isNumericSort)
            sortedData.sort(function (a, b) {
                return reversed * (a[sortedBy] - b[sortedBy]);
            });
        else
            sortedData.sort(function (a, b) {
                let x = a[sortedBy] ? a[sortedBy].toLowerCase() : '',
                    y = b[sortedBy] ? b[sortedBy].toLowerCase() : '';
                return x < y ? reversed * -1 : x > y ? reversed : 0;
            });

        return sortedData; // array in format [ [ key1, val1 ], [ key2, val2 ], ... ]
    }


    //   --------------------Custom logic method End-----------------------


    //   --------------------Table helper method Start-----------------------


    getRows(num) {
        return [...Array(num).keys()].map(a => ({
            sno: a,
            id: `User- ~${a}~`,
            name: `Hello ~${a}~ Privet`,
            description: `Report used for showing`,
            date: new Date(),
            status: 'active',
            reporting: 'Daily'
        }));
    }

    _isRowLoaded = ({ index }) => {
        return !!this.state.dataList[index];
    }

    severityCellRenderer = () => {
        return (
            <div>
                <a href="javascript:void(0)" className="text-danger">
                    <i className="fa fa-circle"></i>
                </a>
            </div>
        );
    };

    TypeCellRenderer = () => {
        return (
            <div>
                <a href="javascript:void(0)">
                   ABC Report
                </a>
            </div>
        );
    };

    policyLogCellRenderer=()=>{
        return (
        <div>
            <Chip label="p123" className="chip-gray" />
            <Chip label="acbc" className="chip-gray" />
            <Chip label="p123" className="chip-gray" />
        </div>
        )
    }

    lastSeenCellRenderer=()=>{
        return (
        <div>
           5 day ago
        </div>
        )
    }

    amountCellRenderer=()=>{
        return (
        <div>
           VulnerableHost
        </div>
        )
    }
    
    affectedResourcesCellRenderer=()=>{
        return (
        <div>
           <span>Resab / res21 / res145 </span>
           <a href="javascript:void(0)">+5more </a>
        </div>
        )
    }

    _loadMoreRows = ({ startIndex, stopIndex }) => {
        let pageNo = Math.floor((stopIndex) / this.state.perPage)
        if (pageNo + 1 !== this.state.pageNo && this.state.isMoreData) {
            const filterData = this.props.filterData
            this.fetchSchdulerReport(filterData)
        }

    }

    isSortEnabled = () => {
        const list = this.state.dataList;
        const rowCount = this.state.rowCount;
        return rowCount <= list.length;
    }

    sort = ({ sortBy, sortDirection }) => {
        this.setState({ sortBy, sortDirection });
        const reverse = sortDirection === 'ASC' ? false : true
        const isNumericSort = sortBy == 'repeat_delay' ? true : false
        this.setState({ dataList: this.sortProperties(this.state.dataList, sortBy, isNumericSort, reverse) });
    }


    noRowsRenderer = () => {
        if (!this.state.filterProgress) {
            return (<div className="data-not-found">
                <span>Records Not Found</span>
            </div>)
        }
        // else if (this.state.filterProgress) {
        //     return <Loader />
        // }
    }

    //   --------------------Table helper method End-----------------------

    handleChange = () => {
        console.log('  search');
    }

    render() {
        const {
            headerHeight,
            height,
            sortBy,
            sortDirection,
            dataList,
            criticalReport,
            highReport,
            mediumReport,
            lowReport

        } = this.state;

        const sortedList = dataList;

        return (
            <div className="page-wrapper">
             <Grid container spacing={24} className="mtAuto mrB10">
                    <ErrorBoundary error="error-boundary">
                        <Grid item sm={3} className="pdT0">
                            <CountBox title={'Critical'} nextLineTitle={''} cssClass={'text-danger'} count={criticalReport} />
                        </Grid>
                        <Grid item sm={3} className="pdT0">
                            <CountBox nextLineTitle={''} title={'High'} cssClass={'text-warning'} count={highReport} />
                        </Grid>
                        <Grid item sm={3} className="pdT0">
                            <CountBox nextLineTitle={''} title={'Medium'} cssClass={'text-warning'} count={mediumReport} />
                        </Grid>
                        <Grid item sm={3} className="pdT0">
                            <CountBox nextLineTitle={''} title={'Low'} cssClass={'text-success'} count={lowReport} />
                        </Grid>
                    </ErrorBoundary>
                </Grid>
                <Grid container spacing={24}>
                    <Grid item sm={10}></Grid>
                    <Grid item sm={2} className="text-right">
                        <SearchField handleChange={this.handleChange} />
                    </Grid>
                </Grid>
                <Grid container spacing={24} className="grid-container">
                    <Grid item sm={12}>
                        <div style={{ height: "100%", maxHeight: "100%" }}>
                            <AutoSizer>
                                {({ width, height }) => (
                                    <InfiniteLoader
                                        isRowLoaded={this._isRowLoaded}
                                        loadMoreRows={this._loadMoreRows}
                                        rowCount={100}
                                        height={height}
                                        threshold={10}
                                    >
                                        {({ onRowsRendered, registerChild }) => (
                                            <Table
                                                headerHeight={headerHeight}
                                                height={height}
                                                rowCount={dataList.length}
                                                rowGetter={({ index }) => sortedList[index]}
                                                rowHeight={61}
                                                sort={this.sort}
                                                sortBy={sortBy}
                                                sortDirection={sortDirection}
                                                onRowsRendered={onRowsRendered}
                                                noRowsRenderer={this.noRowsRenderer}
                                                width={width}
                                                className="data-table table-report"
                                            >

                                                <Column
                                                    dataKey="S.No."
                                                    label="Alert ID"
                                                    headerRenderer={headerRenderer}
                                                    cellRenderer={sNoCellRenderer}
                                                    disableSort={true}
                                                    width={50}
                                                    flexGrow={1}
                                                />

                                                <Column
                                                    dataKey="severity"
                                                    label="Severity"
                                                    headerRenderer={headerRenderer}
                                                    cellRenderer={this.severityCellRenderer}
                                                    disableSort={true}
                                                    width={50}
                                                    flexGrow={2}
                                                />

                                                <Column
                                                    Grid dataKey="description"
                                                    Grid label="Description"
                                                    Grid headerRenderer={headerRenderer}
                                                    Grid cellRenderer={wrapTextCellRenderer}
                                                    Grid disableSort={true}
                                                    Grid width={100}
                                                    flexGrow={3}
                                                />


                                                <Column
                                                    dataKey="type"
                                                    label="Type"
                                                    headerRenderer={headerRenderer}
                                                    disableSort={true}
                                                    cellRenderer={this.TypeCellRenderer}
                                                    width={150}
                                                    flexGrow={4}
                                                />


                                                <Column
                                                    dataKey="policy-log"
                                                    label="Policy Log"
                                                    headerRenderer={headerRenderer}
                                                    cellRenderer={this.policyLogCellRenderer}
                                                    disableSort={true}
                                                    width={200}
                                                    flexGrow={5}
                                                    className="table-td"
                                                />

                                                <Column
                                                    dataKey="last-seen"
                                                    label="Last Seen"
                                                    headerRenderer={headerRenderer}
                                                    cellRenderer={this.lastSeenCellRenderer}
                                                    disableSort={true}
                                                    width={60}
                                                    flexGrow={6}

                                                />

                                                <Column
                                                    dataKey="amount"
                                                    label="Amount"
                                                    headerRenderer={headerRenderer}
                                                    cellRenderer={this.amountCellRenderer}
                                                    disableSort={true}
                                                    width={80}
                                                    flexGrow={7}
                                                />
                                                  <Column
                                                    dataKey="affected-resources"
                                                    label="Affected Resources"
                                                    headerRenderer={headerRenderer}
                                                    cellRenderer={this.affectedResourcesCellRenderer}
                                                    disableSort={true}
                                                    width={200}
                                                    flexGrow={8}
                                                />
                                            </Table>
                                        )}
                                    </InfiniteLoader>
                                )}
                            </AutoSizer>
                        </div>
                    </Grid>
                </Grid>
            </div>
        );
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators(reportScheduleActions, dispatch),
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
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AlertList));