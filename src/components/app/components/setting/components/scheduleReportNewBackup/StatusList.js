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
import Checkbox from '@material-ui/core/Checkbox'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'

import { connect } from "react-redux"
import { store } from 'client'
import { bindActionCreators } from 'redux'
import { cloneDeep } from "lodash"
import { withRouter } from 'react-router-dom'

import Loader from 'global/Loader'
import ConfirmDialogBoxHOC from 'hoc/DialogBox'

import CreateReportDialog from 'global/CreateReport'
import SearchField from 'global/SearchField'

import { sNoCellRenderer, headerRenderer, dateCellRenderer, wrapTextCellRenderer } from 'TableHelper/cellRenderer'
import { showMessage } from 'actions/messageAction'
import { setProgressBar } from 'actions/commonAction'

import * as reportScheduleActions from 'actions/reportScheduleAction'


const cache = new CellMeasurerCache({
    fixedWidth: true,
    minHeight: 100,
});

class StatusList extends PureComponent {
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



    openReportDialog = () => {
        this.setState({ openAddDialog: true })
    }


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


    handleDialogClose = () => {
        this.setState({ openDialog: false, openEditDialog: false, openAddDialog: false }, () => {
            this.fetchSchdulerReport(this.props.filterData)
        })
    }

    openEditReportSchedule = (cellData) => {
        const editPayload = { id: cellData.id, name: cellData.name, description: cellData.description, account_id: this.props.filterData.selectAccount.id, service: cellData.service_name, time_interval: cellData.time_interval }
        this.setState({ openEditDialog: true, editPayload })
    }


    deleteReportSchedule = (reportId) => {
        this.setState({ openDialog: true, reportId })
    }

    deleteReport = () => {
        this.handleDialogClose()
        let paylod = { report_id: this.state.reportId }
        this.props.actions.deleteReportSchdule(paylod).
            then(result => {
                if (this._mounted) {
                    if (result.success) {
                        let message = { message: result.message, showSnackbarState: true, variant: 'success' }
                        this.props.showMessage(message)
                        this.fetchSchdulerReport(this.props.filterData)
                    } else {
                        this.setState({ loaded: true, filterProgress: false })
                        let message = { message: result, showSnackbarState: true, variant: 'error' }
                        this.props.showMessage(message)
                    }
                }
                this.props.setProgressBar(false);
            });

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

    actionCellRenderer = ({ columnIndex, key, parent, rowIndex, style, rowData }) => {
        return (
            <div className="icon-action">
                <a href="javascript:void(0)" onClick={() => this.openEditReportSchedule(rowData)} ><i className="fa fa-pencil" ></i></a>
                <a href="javascript:void(0)" onClick={() => this.deleteReportSchedule(rowData.id)} className="mrL10"><i className="fa fa-trash-o"></i></a>
            </div>
        );
    };


    _isRowLoaded = ({ index }) => {
        return !!this.state.dataList[index];
    }

    anchorCellRenderer = ({ cellData }) => {
        return (
            <div>
                <a href="javascript:void(0)">{cellData}</a>
            </div>
        );
    };

    statusCellRenderer = ({ rowData, cellData, rowIndex }) => {
        const boxClass = cellData === 'Active' ? 'text-success' : 'text-danger'
        return (
            <div>
                <span className={boxClass}>{cellData}</span>
            </div>
        );
    };

    checkBoxCellRenderer = ({ }) => {
        return (
            <div>
                <Checkbox
                    value="checkedA"
                    className="mt-checkbox"
                />
            </div>
        );
    };

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

    serviceCellRenderer = ({ cellData, columnIndex, key, parent, rowIndex, style }) => {
        return (
            <div className="wd-spc-line">
                {cellData.length > 0 ? cellData.join() : 'All services'}
            </div>
        );
    };

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
            openDialog,
            openEditDialog,
            editPayload, openAddDialog
        } = this.state;

        const sortedList = dataList;

        return (
            <div className="page-wrapper">
                <Grid container spacing={24}>
                    <Grid item sm={10} className="text-right">
                        <Button onClick={this.openReportDialog} variant="outlined" className="btn-blue-outline btn-ouline-sm">
                            Create Report
                        </Button>
                    </Grid>
                    <Grid item sm={2} className="text-right">
                        <SearchField handleChange={this.handleChange} />
                    </Grid>

                    {/* <Grid item sm={6}>
                        <Grid container spacing={24}>
                            <Grid item sm={6} className="pdB0 text-right">
                                <Button onClick={this.openReportDialog} variant="outlined" className="btn-blue-outline btn-ouline-sm">
                                    Create Report
                                 </Button>
                            </Grid>
                            <Grid item sm={6} className="pdB0 text-right">
                                <SearchField handleChange={this.handleChange} />
                            </Grid>
                        </Grid>
                    </Grid> */}
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
                                                    label="S.No."
                                                    headerRenderer={headerRenderer}
                                                    cellRenderer={sNoCellRenderer}
                                                    disableSort={true}
                                                    width={20}
                                                    flexGrow={2}
                                                />

                                                <Column
                                                    dataKey="name"
                                                    label="Name"
                                                    headerRenderer={headerRenderer}
                                                    cellRenderer={this.anchorCellRenderer}
                                                    disableSort={true}
                                                    width={150}
                                                    flexGrow={3}
                                                />

                                                <Column
                                                    Grid dataKey="description"
                                                    Grid label="Description"
                                                    Grid headerRenderer={headerRenderer}
                                                    Grid cellRenderer={wrapTextCellRenderer}
                                                    Grid disableSort={true}
                                                    Grid width={100}
                                                    flexGrow={4}
                                                />


                                                <Column
                                                    dataKey="service_name"
                                                    label="Services"
                                                    headerRenderer={headerRenderer}
                                                    disableSort={true}
                                                    cellRenderer={this.serviceCellRenderer}
                                                    width={400}
                                                    flexGrow={5}
                                                />


                                                <Column
                                                    dataKey="status"
                                                    label="Status"
                                                    headerRenderer={headerRenderer}
                                                    cellRenderer={this.statusCellRenderer}
                                                    disableSort={true}
                                                    width={70}
                                                    flexGrow={6}
                                                    className="table-td"
                                                />

                                                <Column
                                                    dataKey="time_interval"
                                                    label="Reporting"
                                                    headerRenderer={headerRenderer}
                                                    cellRenderer={this.anchorCellRenderer}
                                                    disableSort={true}
                                                    width={60}
                                                    flexGrow={7}

                                                />

                                                <Column
                                                    dataKey="action"
                                                    label="Action"
                                                    headerRenderer={headerRenderer}
                                                    cellRenderer={this.actionCellRenderer}
                                                    disableSort={true}
                                                    width={80}
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
                <ConfirmDialogBoxHOC isOpen={openDialog} handleDialogClose={this.handleDialogClose} title={'Confirmation'} content={'Are you sure you want to delete this scheduled report ?'} successDialogEvent={this.deleteReport} />

                <CreateReportDialog openDialog={openAddDialog} handleDialogClose={this.handleDialogClose} />

                <CreateReportDialog editPayload={editPayload} openDialog={openEditDialog} handleDialogClose={this.handleDialogClose} />
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
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(StatusList));