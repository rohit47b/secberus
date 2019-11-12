import Checkbox from '@material-ui/core/Checkbox';
import Grid from '@material-ui/core/Grid';
import Switch from '@material-ui/core/Switch';
import { setProgressBar } from 'actions/commonAction';
import { showMessage } from 'actions/messageAction';
import * as schedulerSettingActions from 'actions/schedulerSettingAction';
import * as integrationActions from 'actions/integrationAction'
import * as securityPolicyActions from 'actions/securityPolicyAction';
import { store } from 'client';
import Loader from 'global/Loader';
import ConfirmDialogBoxHOC from 'hoc/DialogBox';
import { cloneDeep } from "lodash";
import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { withRouter } from 'react-router-dom';
import { Column, InfiniteLoader, SortDirection, Table,SortIndicator } from "react-virtualized";
import AutoSizer from "react-virtualized/dist/commonjs/AutoSizer";
import { bindActionCreators } from 'redux';
import { dateCellRenderer, headerRenderer } from 'TableHelper/cellRenderer';
import { fetchServiceIconPath } from 'utils/serviceIcon';


class PullIntervalList extends PureComponent {
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
        repeat_delay_list: [5, 10, 15,20,25,30],
        selectRepeatDelays: ['Select Repeat Delay']
    };

    currentValue = this.props.filterData

    componentDidMount() {
        this._mounted = true
        const filterData = this.props.filterData
        this.props.setProgressBar(true);
        this.getSchedulers(filterData)
    }

    componentWillUnmount() {
        this._mounted = false
    }

    static getDerivedStateFromProps(nextProps, state) {
        return { reload: nextProps.reload }
    }

    componentDidUpdate = (nextProps, prevState) => {
        if (this.props !== nextProps) {
            if (this.props.reload) {
                this.setState({ filterProgress: true }, () => {
                    const filterData = this.props.filterData
                    this.fetchClouds(filterData)
                })
            }
        }
    }

    //   --------------------Custom logic method Start-----------------------


    fetchClouds(filterData) {
        this.props.actions.fetchIntegrationList().
            then(result => {
                if (this._mounted) {
                    if (result && typeof result !== 'string') {
                        this.props.resetReload();
                        this.props.setProgressBar(false);
                        this.setState({ dataList: result})
                    } else {
                        this.props.setProgressBar(false);
                        let message = { message: result, showSnackbarState: true, variant: 'error' }
                        this.props.showMessage(message)
                    }
                }
            });
    }

    getSchedulers(filterData) {
        const { sortDirection, sortBy, pageNo, service, policyId, selectRepeatDelays } = this.state

        this.props.actions.fetchSchedulerList().
            then(result => {
                if (this._mounted) {
                    if (result && typeof result !== 'string') {
                        this.props.resetReload();
                        this.props.setProgressBar(false);
                        let allScheulers = []
                        result.map((schduler, index) => {
                            allScheulers.push(schduler.id)
                        })
                        this.setState({ allServices: allScheulers, dataList: result, loaded: true, filterProgress: false });
                    } else {
                        this.props.setProgressBar(false);
                        this.setState({ dataList: [], loaded: true, filterProgress: false })
                        let message = { message: result, showSnackbarState: true, variant: 'error' }
                        this.props.showMessage(message)
                    }
                }
            });
    }

    clickEvent = (repeatDelay, cloud) => {
        this.props.clickEvent(repeatDelay, cloud)
    }

    statusChangeDialog = (rowIndex, schdulerId) => {
        this.setState({ openDialog: true, rowIndex, schdulerId });
    }

    selectStatusChangeDialog = (status) => {
        this.setState({ openSelectDialog: true, status });
    }

    handleDialogClose = () => {
        this.setState({ openDialog: false, openSelectDialog: false });
    };


    policyChangeHandler = name => event => {
        this.setState({ policyId: event.target.value }, () => {
            this.getSchedulers(this.props.filterData)
        })
    }


    statusChange = () => {
        this.state.dataList.map((row, sidx) => {
            if (this.state.rowIndex !== sidx) {
                return row;
            } else {
                const currentStatus = row.active === undefined || row.active === null ? true : row.active;
                this.schedulerEnableDisable(this.state.schdulerId, currentStatus === true ? 'deactivate' : 'activate')
                this.setState({ openDialog: false });
                return { ...row, active: !currentStatus };
            }
        });
    }

    schedulerEnableDisable(schdulerId, status) {
        let payload = {
            scheduler_ids: [schdulerId],
            state: status
        }
        this.props.setProgressBar(true);
        this.props.actions.schedulerEnableDisable(payload).
            then(result => {
                if (this._mounted) {
                    if (result.success) {
                        let message = { message: result.message, showSnackbarState: true, variant: 'success' }
                        this.props.showMessage(message)

                        const newDataList = this.state.dataList.map((row, sidx) => {
                            if (this.state.rowIndex !== sidx) {
                                return row;
                            } else {
                                const currentStatus = row.active === undefined || row.active === null ? true : row.active;
                                return { ...row, active: !currentStatus };
                            }
                        });
                        this.setState({ dataList: newDataList, schdulerId: 0, rowIndex: 0, openDialog: false });
                    } else {
                        if (typeof result === 'string') {
                            let message = { message: result, showSnackbarState: true, variant: 'error' }
                            this.props.showMessage(message)
                        }
                    }
                }
                this.props.setProgressBar(false);
            });
    }



    selectStatusChange = () => {
        let payload = {
            scheduler_ids: this.state.selectScheduler,
            state: this.state.status
        }
        this.handleDialogClose()
        this.props.setProgressBar(true);
        return this.props.actions.schedulerEnableDisable(payload).
            then(result => {
                if (this._mounted) {
                    if (result.success) {
                        let message = { message: result.message, showSnackbarState: true, variant: 'success' }
                        this.props.showMessage(message)
                        this.setState({ selectScheduler: [], isAllServiceSelect: false })
                        const filterData = this.props.filterData
                        this.getSchedulers(filterData)
                    } else {
                        if (typeof result === 'string') {
                            let message = { message: result, showSnackbarState: true, variant: 'error' }
                            this.props.showMessage(message)
                        }
                    }
                }
                this.props.setProgressBar(false);
            });
    }


    handleCheckbox = (service, isChecked) => {
        const selectScheduler = cloneDeep(this.state.selectScheduler)
        if (isChecked) {
            const newService = pull(selectScheduler, service)
            this.setState({ selectScheduler: newService })
        } else {
            selectScheduler.push(service)
            this.setState({ selectScheduler: selectScheduler })
        }
    };

    allCheckBoxEvent = () => {
        if (this.state.isAllServiceSelect) {
            this.setState({ selectScheduler: [] })
        } else {
            const allServices = cloneDeep(this.state.allServices)
            this.setState({ selectScheduler: allServices })
        }

        this.setState(prevState => ({
            isAllServiceSelect: !prevState.isAllServiceSelect
        }));

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
            this.getSchedulers(filterData)
        });
    };


    repeatDelaySelectHandler = name => event => {
        let value = event.target.value;
        if (value.length === 0) {
            value[0] = 'Select Repeat Delay'
        } else if (value[0] === 'Select Repeat Delay') {
            value.splice(0, 1)
        }
        this.setState({ filterProgress: true, pageNo: 0, selectRepeatDelays: value, dataList: [] }, () => {
            const filterData = this.props.filterData
            this.getSchedulers(filterData)
        });

    };
    //   --------------------Custom logic method End-----------------------


    //   --------------------Table helper method Start-----------------------

    headerRenderer = ({ dataKey, label, sortBy, sortDirection }) => {
        const { isAllServiceSelect } = this.state
        return (
            <div className="table-td">
                {dataKey === 'checkbox' &&
                    <Checkbox
                        checked={isAllServiceSelect}
                        className="mt-checkbox white-checkbox"
                        onChange={() => this.allCheckBoxEvent()}
                    />}
                {dataKey !== 'checkbox' && label}
                {sortBy === dataKey && <SortIndicator sortDirection={sortDirection} />}
            </div>
        );
    }

    _isRowLoaded = ({ index }) => {
        return !!this.state.dataList[index];
    }

    scheduleCellRenderer = ({ rowData, cellData }) => {
        let interval = ''
        if (rowData.enabled) {
            if (cellData === 3600) {
                interval = 'Hourly'
            } else if (cellData === 86400) {
                interval = 'Daily'
            } else if (cellData === 60200) {
                interval = 'weekly'
            } else if (cellData === 900) {
                interval = 'Continuous'
            } else {
                interval = cellData/60 + ' minutes'
            }
        } else {
            interval = 'Disabled'
        }
        return (
            <div className="width-100 d-flex align-item-center">
                {/*rowData.enabled === false ? cellData + ' min' : <a href="javascript:void(0)" > {cellData === null ? 'Edit' : cellData}</a>*/} 
                {interval + ' '}
                <span className="fnt-16 text-gray mrL20 mlAuto" style={{ cursor: "pointer"}} onClick={() => this.clickEvent(rowData.scan_interval, rowData)}>
                <i className="fa fa-pencil" aria-hidden="true"></i>
            </span>
            </div>
        );
    };
    actionCellRenderer

    statusCellRenderer = ({ rowData, cellData, rowIndex }) => {
        let boxClass = ["switch-green"];
        if (cellData === undefined || cellData === true || cellData === null) {
            boxClass.push('active');
        }
        return (
            <div>
                <Switch className={boxClass.join(' ')} checked={cellData === undefined || cellData === null ? true : cellData} onChange={() => this.statusChangeDialog(rowIndex, rowData._id)} />
            </div>
        );
    };

    checkBoxCellRenderer = ({ rowData,cellData }) => {
        const isChecked = this.state.selectScheduler.indexOf(rowData._id) > -1
        return (
            <div className="d-flex align-item-center">
                {/* <Checkbox
                    checked={isChecked}
                    onChange={() => this.handleCheckbox(rowData._id, isChecked)}
                    value="checkedA"
                    className="mt-checkbox checkbox-success"
                /> */}
                 <img className="mrL15" alt={cellData} height={"30"} src={fetchServiceIconPath('cloud_' + cellData)}/> 
            </div>
        );
    };

    yesNoIconCellRenderer = ({ cellData }) => {
        if (cellData === undefined || cellData === null) {
            cellData = 'Undefined'
        } else if (cellData) {
            cellData = 'Yes'
        } else {
            cellData = 'No'
        }
        const chipClassName = cellData === 'Yes' ? 'chip-green' : 'chip-red'
        return (
            <div>
                <span className={"chip-sm " + chipClassName}>{cellData}</span>
            </div>
        )
    }


    _loadMoreRows = ({ startIndex, stopIndex }) => {
        let pageNo = Math.floor((stopIndex) / this.state.perPage)
        if (pageNo + 1 !== this.state.pageNo && this.state.isMoreData) {
            const filterData = this.props.filterData
            this.getSchedulers(filterData)
        }
    }

    isSortEnabled = () => {
        const list = this.state.dataList;
        const rowCount = this.state.rowCount;
        return rowCount <= list.length;
    }

    sort = ({ sortBy, sortDirection }) => {
        this.setState({ sortBy, sortDirection }, () => {
            const filterData = this.props.filterData
            this.getSchedulers(filterData)
        });

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


    //   --------------------Table helper method End-----------------------


    render() {
        const {
            headerHeight,
            height,
            sortBy,
            sortDirection,
            dataList,
            openDialog,
            selectScheduler,
            openSelectDialog,
            policyId,
            policyList,
            service,
            repeat_delay_list,
            selectRepeatDelays
        } = this.state;

        const sortedList = dataList;

        return (
            <div className="container">
                <div className="table-container" style={{ height: "calc(100% - 24px)", maxHeight: "100%" }}>
                    <AutoSizer>
                        {({ height, width }) => (
                            <InfiniteLoader
                                isRowLoaded={this._isRowLoaded}
                                loadMoreRows={this._loadMoreRows}
                                rowCount={dataList.length}
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
                                        noRowsRenderer={this.noRowsRenderer}
                                        width={width}
                                        className="data-table table-no-border"
                                    >

                                        <Column
                                            dataKey="cloud"
                                            label="Cloud Type"
                                            headerRenderer={this.headerRenderer}
                                            cellRenderer={this.checkBoxCellRenderer}
                                            disableSort={true}
                                            width={150}
                                            flexGrow={1}
                                        />

                                        <Column
                                            dataKey="name"
                                            label="Account Name"
                                            headerRenderer={headerRenderer}
                                            disableSort={false}
                                            width={300}
                                            flexGrow={2}

                                        />

                                        <Column
                                            dataKey="last_scan_start_date"
                                            label="Last Scan Start"
                                            headerRenderer={headerRenderer}
                                            cellRenderer={dateCellRenderer}
                                            disableSort={true}
                                            width={200}
                                            flexGrow={3}

                                        />

                                        <Column
                                            dataKey="last_scan_finish_date"
                                            label="Last Scan Finish"
                                            headerRenderer={headerRenderer}
                                            cellRenderer={dateCellRenderer}
                                            disableSort={true}
                                            width={200}
                                            flexGrow={3}

                                        />

                                        <Column
                                            dataKey="first_scan_date"
                                            label="First Scan"
                                            headerRenderer={headerRenderer}
                                            cellRenderer={dateCellRenderer}
                                            disableSort={true}
                                            width={200}
                                            flexGrow={3}

                                        />

                                        <Column
                                            dataKey="in_progress"
                                            label="In Progress"
                                            headerRenderer={headerRenderer}
                                            cellRenderer={this.yesNoIconCellRenderer}
                                            disableSort={false}
                                            width={50}
                                            flexGrow={2}

                                        />
                                     
                                        <Column
                                            dataKey="scan_interval"
                                            label="Schedule"
                                            headerRenderer={headerRenderer}
                                            cellRenderer={this.scheduleCellRenderer}
                                            disableSort={false}
                                            width={120}
                                            flexGrow={4}
                                        />
                                        
                                    

                                    </Table>
                                )}
                            </InfiniteLoader>
                        )}
                    </AutoSizer>
                </div>

                <ConfirmDialogBoxHOC
                    isOpen={openDialog}
                    handleDialogClose={this.handleDialogClose}
                    title={'Confirmation'}
                    content={'Are you sure you want to change status this scheduler ?'}
                    successDialogEvent={this.statusChange}
                />

                <ConfirmDialogBoxHOC
                    isOpen={openSelectDialog}
                    handleDialogClose={this.handleDialogClose}
                    title={'Confirmation'}
                    content={'Are you sure you want to change status of selected scheduler ?'}
                    successDialogEvent={this.selectStatusChange}
                />


            </div>
        );
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators(Object.assign({}, integrationActions, schedulerSettingActions, securityPolicyActions), dispatch),
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
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(PullIntervalList));