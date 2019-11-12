/*
 * @Author: Virendra Patidar 
 * @Date: 2018-10-09 11:08:57 
 * @Last Modified by: Virendra Patidar
 * @Last Modified time: 2019-01-09 17:07:46
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
import Chip from '@material-ui/core/Chip'
import Button from '@material-ui/core/Button'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import ListItemText from '@material-ui/core/ListItemText'
import Input from '@material-ui/core/Input'

import { connect } from "react-redux"
import { store } from 'client'
import { bindActionCreators } from 'redux'
import { cloneDeep, debounce, includes, filter } from "lodash"
import { withRouter } from 'react-router-dom'

import Loader from 'global/Loader'
import ConfirmDialogBoxHOC from 'hoc/DialogBox'

import CreateReportDialog from 'global/CreateReport'
import SearchField from 'global/SearchField'
import ServiceFilter from 'global/ServiceFilter'

import { sNoCellRenderer, headerRenderer, dateCellRenderer, wrapTextCellRenderer } from 'TableHelper/cellRenderer'
import { showMessage } from 'actions/messageAction'
import { setProgressBar } from 'actions/commonAction'

import * as reportScheduleActions from 'actions/reportScheduleAction'
import * as commonActions from 'actions/commonAction'

import STATIC_DATA from 'data/StaticData'


const cache = new CellMeasurerCache({
    fixedWidth: true,
    minHeight: 100,
});

class ScheduleReport extends PureComponent {

    _mounted = false

    state = {

        // Table attribute
        headerHeight: 40,
        rowHeight: 25,
        rowCount: 0,
        height: 450,
        sortBy: "name",
        sortDirection: SortDirection.ASC,

        count: 10,
        dataList: [],
        checkedA: false,
        loaded: false,
        openDialog: false,
        openEditDialog: false,
        rowIndex: 0,
        schdulerId: 0,
        complianceList: [],

        pageNo: 0,
        isRequestForData: false,
        isMoreData: true,
        perPage: 50,
        filterProgress: false,
        search: '',
        service: ['Select Service'],
        time_interval_list: [{ display_name: 'Daily', value: 'daily' }, { display_name: 'Weekly', value: 'weekly' }, { display_name: 'Monthly', value: 'monthly' }],
        selectTimeInterval: ['Select Time Interval'],

        editPayload: {},
        reportId: null,
        openAddDialog: false
    };

    fetchSchedulerReport = debounce(this.fetchSchedulerReport, 1000);

    currentValue = this.props.filterData

    componentDidMount() {
        this._mounted = true
        const filterData = this.props.filterData
        this.props.setProgressBar(false);
        this.fetchCompliances()
        if (filterData.selectAccount.id !== 'all' && filterData.selectAccount.id !== undefined) {
            this._mounted = false
            this.fetchSchedulerReport(filterData)
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
                this.setState({dataList: []}, () => {
                    this.props.setProgressBar(true);
                    this.fetchSchedulerReport(filterData)
                })
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
                    this.fetchSchedulerReport(filterData.selectAccount.id)
                })
            }
        }
    }

    //   --------------------Custom logic method Start-----------------------


    fetchCompliances() {
        this.props.actions.fetchCompliances().
            then(result => {
                if (this._mounted) {
                    if (result.success) {
                        this.setState({ complianceList: result.data, loaded: true });
                    } else {
                        let message = { message: result, showSnackbarState: true, variant: 'error' }
                        this.props.showMessage(message)
                    }
                }
            });
    }



    handleSearchChange = name => event => {
        this.setState({ filterProgress: true, pageNo: 0, [name]: event.target.value, dataList: [] }, () => {
            const filterData = this.props.filterData
            this.fetchSchedulerReport(filterData)
        });
    };


    openReportDialog = () => {
        this.setState({ openAddDialog: true })
    }


    fetchSchedulerReport(filterData) {

        const { pageNo, sortDirection, sortBy, search, service, selectTimeInterval } = this.state

        let payload = {
            account_id: filterData.selectAccount.id,
            page: pageNo,
            sort: sortDirection === SortDirection.ASC,
            sort_by: sortBy,
            // search: search,
        }

        if (service && service[0] !== 'Select Service') {
            let filtered_services = filter(this.state.serviceList, function (p) {
                return includes(service, p.service_name);
            });
            const filtered_services_names = filtered_services.map(service => service.service);
            payload.service = filtered_services_names
        }


        if (selectTimeInterval && selectTimeInterval[0] !== 'Select Service') {
            let filtered_time_interval = filter(this.state.time_interval_list, function (p) {
                return includes(selectTimeInterval, p.display_name);
            });
            const filtered_time_interval_value = filtered_time_interval.map(time_interval => time_interval.value);
            payload.time_interval = filtered_time_interval_value
        }




        this.setState({ isRequestForData: true, filterProgress: true })

        this.props.actions.fetchReportSchedule(payload).
            then(result => {
                this._mounted = true
                if (result.success) {
                    this.props.setProgressBar(false);
                    let oldDataList = this.state.dataList
                    this.setState({ filterProgress: false, isRequestForData: false, dataList: oldDataList.concat(result.data), isMoreData: result.data.length >= this.state.perPage, loaded: true, filterProgress: false });
                } else {
                    this.props.setProgressBar(false);
                    this.setState({ filterProgress: false, isRequestForData: false, dataList: [], loaded: true, filterProgress: false })
                    if (typeof result === 'string') {
                        let message = { message: result, showSnackbarState: true, variant: 'error' }
                        this.props.showMessage(message)
                    }
                }
                this.props.setProgressBar(false);
            });
    }



    handleDialogClose = () => {
        this.setState({ openDialog: false, openEditDialog: false, openAddDialog: false, dataList: [], filterProgress: true }, () => {
            this.fetchSchedulerReport(this.props.filterData)
        })
    }

    openEditReportSchedule = (cellData) => {

        let filtered_status = filter(STATIC_DATA.STATUS_LIST, function (p) {
            return includes(cellData.rule_status, p.value);
        });
        const filtered_status_values = filtered_status.map(status => status.display_name);
   

        let filtered_compliance = filter(this.state.complianceList, function (p) {
            return includes(cellData.compliance, p.value);
        });
        const filtered_compliance_values = filtered_compliance.map(compliance => compliance.name);

        const editPayload = { id: cellData.id, name: cellData.name, description: cellData.description, account_id: this.props.filterData.selectAccount.id, service: cellData.service_name, time_interval: cellData.time_interval, rule_status: filtered_status_values, priority: cellData.priority, compliance: filtered_compliance_values }
        this.setState({ openEditDialog: true, editPayload })
    }


    deleteReportSchedule = (reportId) => {
        this.setState({ openDialog: true, reportId })
    }

    deleteReport = () => {
        this.handleDialogClose()
        let payload = { report_id: this.state.reportId }
        this.props.actions.deleteReportSchdule(payload).
            then(result => {
                if (this._mounted) {
                    if (result.success) {
                        let message = { message: result.message, showSnackbarState: true, variant: 'success' }
                        this.props.showMessage(message)
                        this.fetchSchedulerReport(this.props.filterData)
                    } else {
                        this.setState({ loaded: true, filterProgress: false })
                        let message = { message: result, showSnackbarState: true, variant: 'error' }
                        this.props.showMessage(message)
                    }
                }
                this.props.setProgressBar(false);
            });

    }



    handleServiceChange = name => event => {
        let value = event.target.value;
        if (value.length === 0) {
            value[0] = 'Select Service'
        }
        else if (value[0] === 'Select Service') {
            value.splice(0, 1)
        }
        this.setState({ filterProgress: true, pageNo: 0, [name]: value, dataList: [] }, () => {
            const filterData = this.props.filterData
            this.fetchSchedulerReport(filterData)
        });
    };

    timeIntervalSelectHandler = name => event => {
        let value = event.target.value;
        if (value.length === 0) {
            value[0] = 'Select Time Interval'
        } else if (value[0] === 'Select Time Interval') {
            value.splice(0, 1)
        }
        this.setState({ filterProgress: true, pageNo: 0, selectTimeInterval: value, dataList: [] }, () => {
            const filterData = this.props.filterData
            this.fetchSchedulerReport(filterData)
        });

    };


    //   --------------------Custom logic method End-----------------------


    //   --------------------Table helper method Start-----------------------

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

    statusCellRenderer = ({ cellData }) => {
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
            // this.fetchSchedulerReport(filterData)
        }

    }

    isSortEnabled = () => {
        const list = this.state.dataList;
        const rowCount = this.state.rowCount;
        return rowCount <= list.length;
    }

    sort = ({ sortBy, sortDirection }) => {
        this.setState({ sortBy, sortDirection, pageNo: 0, dataList: [], filterProgress: true }, () => {
            const filterData = this.props.filterData
            this.fetchSchedulerReport(filterData)
        });
    }


    scrollEvent = ({ clientHeight, scrollHeight, scrollTop }) => {
        if (this.state.isMoreData && scrollTop > 0 && clientHeight > 0 && !this.state.isRequestForData) {
            this.setState({ pageNo: this.state.pageNo + 1, isRequestForData: true }, () => {
                const filterData = this.props.filterData
                this.fetchSchedulerReport(filterData)
            });
        }
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

    serviceCellRenderer = ({ cellData }) => {
        return (
            <div className="wd-spc-line">
                {cellData.length > 0 ? cellData.join() : 'All services'}
            </div>
        );
    };

    ruleStatusCellRenderer = ({ cellData }) => {

        let filtered_status_values = []
        if (cellData !== null && cellData.length > 0) {
            let filtered_status = filter(STATIC_DATA.STATUS_LIST, function (p) {
                return includes(cellData, p.value);
            });
            filtered_status_values = filtered_status.map(status => status.display_name);
        }


        return (
            <div className="wd-spc-line">
                {filtered_status_values.length > 0 ? filtered_status_values.join() : 'All Status'}
            </div>
        );
    };


    priorityCellRenderer = ({ cellData }) => {

        return (
            <div className="wd-spc-line">
                {cellData !== null && cellData.length > 0 ? cellData.join() : 'All Priority'}
            </div>
        );
    };


    complianceCellRenderer = ({ cellData }) => {
        return (
            <div className="wd-spc-line">
                {cellData !== null && cellData.length > 0 ? cellData.join() : 'All Compliance'}
            </div>
        );
    };




    //   --------------------Table helper method End-----------------------



    render() {
        mixpanel.track("View Page", {
            "Page Name": 'Setting Scheduler Report',
        });
        const {
            headerHeight,
            height,
            sortBy,
            sortDirection,
            dataList,
            openDialog,
            openEditDialog,
            editPayload, openAddDialog,
            service,
            time_interval_list,
            selectTimeInterval
        } = this.state;

        const sortedList = dataList;

        return (
            <div className="page-wrapper page-content">
                <Grid container spacing={24}>
                    <Grid item md={5}>
                        <h3 className="mr0 main-heading">Report Schedule</h3>
                    </Grid>
                    {/* <Grid item sm={6} className="text-right">
                        <Button onClick={this.openReportDialog} variant="outlined" className="btn-blue-outline btn-ouline-sm">
                            Create Report
                        </Button>
                    </Grid> */}

                    <Grid item md={7}>
                    <div className="d-flex filter-grid">
                        <Button onClick={this.openReportDialog} variant="outlined" className="btn-blue-outline btn-ouline-sm">
                            Create Report
                       </Button>
                        <FormControl className="multi-select">
                            <Select
                                multiple
                                value={selectTimeInterval ? selectTimeInterval : []}
                                onChange={this.timeIntervalSelectHandler('time_interval')}
                                input={<Input id="select-multiple-checkbox" />}
                                renderValue={selected => selected.join(', ')}
                                className="select-feild"
                                MenuProps={{
                                    style: {
                                        top: '30px'
                                    }
                                }}
                            >
                                <MenuItem className="select-item default-item" key={'Select Time Interval'} value="Select Time Interval" disabled>
                                </MenuItem>
                                {
                                    time_interval_list.map(function (item, index) {
                                        return <MenuItem className="select-item" key={item.display_name} value={item.display_name} >
                                            <Checkbox checked={selectTimeInterval ? selectTimeInterval.indexOf(item.display_name) > -1 : false} />
                                            <ListItemText className="item-text" primary={item.display_name} />
                                        </MenuItem>
                                    })
                                }
                            </Select>
                        </FormControl>
                        <ServiceFilter selectServices={service} selectHandler={this.handleServiceChange} />
                        <SearchField handleChange={this.handleSearchChange} />
                        </div>
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
                                                onScroll={this.scrollEvent}
                                                className="data-table table-report table-no-border"
                                            >

                                                {/* <Column
                                        dataKey="checkbox"
                                        label=""
                                        headerRenderer={headerRenderer}
                                        cellRenderer={this.checkBoxCellRenderer}
                                        disableSort={true}
                                        width={50}
                                        flexGrow={1}
                                    /> */}


                                                <Column
                                                    dataKey="name"
                                                    label="Name"
                                                    headerRenderer={headerRenderer}
                                                    cellRenderer={this.anchorCellRenderer}
                                                    disableSort={false}
                                                    width={100}
                                                    flexGrow={3}
                                                />

                                                <Column
                                                    Grid dataKey="description"
                                                    Grid label="Description"
                                                    Grid headerRenderer={headerRenderer}
                                                    Grid cellRenderer={wrapTextCellRenderer}
                                                    Grid disableSort={false}
                                                    Grid width={100}
                                                    flexGrow={4}
                                                />


                                                <Column
                                                    dataKey="service_name"
                                                    label="Services"
                                                    headerRenderer={headerRenderer}
                                                    disableSort={true}
                                                    cellRenderer={this.serviceCellRenderer}
                                                    width={300}
                                                    flexGrow={5}
                                                />


                                                <Column
                                                    dataKey="rule_status"
                                                    label="Rule Status"
                                                    headerRenderer={headerRenderer}
                                                    disableSort={true}
                                                    cellRenderer={this.ruleStatusCellRenderer}
                                                    width={80}
                                                    flexGrow={6}
                                                />



                                                <Column
                                                    dataKey="priority"
                                                    label="Priority"
                                                    headerRenderer={headerRenderer}
                                                    disableSort={true}
                                                    cellRenderer={this.priorityCellRenderer}
                                                    width={80}
                                                    flexGrow={7}
                                                />

                                                <Column
                                                    dataKey="compliance"
                                                    label="Compliance"
                                                    headerRenderer={headerRenderer}
                                                    disableSort={true}
                                                    cellRenderer={this.complianceCellRenderer}
                                                    width={100}
                                                    flexGrow={8}
                                                />

                                                <Column
                                                    dataKey="status"
                                                    label="Status"
                                                    headerRenderer={headerRenderer}
                                                    cellRenderer={this.statusCellRenderer}
                                                    disableSort={true}
                                                    width={70}
                                                    flexGrow={9}
                                                    className="table-td"
                                                />

                                                <Column
                                                    dataKey="time_interval"
                                                    label="Reporting"
                                                    headerRenderer={headerRenderer}
                                                    cellRenderer={this.anchorCellRenderer}
                                                    disableSort={true}
                                                    width={60}
                                                    flexGrow={10}

                                                />

                                                <Column
                                                    dataKey="action"
                                                    label="Action"
                                                    headerRenderer={headerRenderer}
                                                    cellRenderer={this.actionCellRenderer}
                                                    disableSort={true}
                                                    width={80}
                                                    flexGrow={11}
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
        actions: bindActionCreators(Object.assign({}, reportScheduleActions, commonActions), dispatch),
        showMessage: message => {
            dispatch(showMessage(message))
        }, setProgressBar: isProgress => {
            dispatch(setProgressBar(isProgress))
        }
    };
}
const mapStateToProps = (state, ownProps) => ({
    filterData: state.uiReducer.filterData,
    serviceList: state.commonReducer.serviceList,
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ScheduleReport));