/*
 * @Author: Virendra Patidar 
 * @Date: 2018-09-04 14:10:15 
 * @Last Modified by: Virendra Patidar
 * @Last Modified time: 2019-01-07 15:58:58
 */
import React, { PureComponent } from "react"


import {
    Table,
    Column,
    SortDirection,
    InfiniteLoader
} from "react-virtualized"
import AutoSizer from "react-virtualized/dist/commonjs/AutoSizer"

import Grid from '@material-ui/core/Grid'

import { withRouter } from 'react-router-dom'
import { store } from 'client'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { cloneDeep, filter, includes } from "lodash"

import Loader from 'global/Loader'
import ServiceFilter from 'global/ServiceFilter'
import SearchField from 'global/SearchField'

import { serviceCellRenderer, headerRenderer, dateCellRenderer } from 'TableHelper/cellRenderer'

import { showMessage } from 'actions/messageAction'
import * as dashboardActions from 'actions/dashboardAction'
import { setProgressBar } from 'actions/commonAction'

class SystemLogList extends PureComponent {

    _mounted = false

    state = {
        headerHeight: 40,
        rowHeight: 25,
        rowCount: 0,
        height: 150,
        sortBy: "service",
        sortDirection: SortDirection.ASC,

        count: 10,
        dataList: [],
        ruleCategoryList: [],
        checkedA: false,
        category: '',
        issueType: this.props.issueType,
        open: false,
        resultId: 0,

        pageNo: 0,
        perPage: 50,
        isMoreData: false,
        isRequestForData: false,

        filterProgress: true,
        service: ['Select Service'],
        search: ''

    };

    componentDidMount() {
        this._mounted = true
        const filterData = this.props.filterData
        this.props.setProgressBar(true);
        if (filterData.selectAccount.id !== 'all' && filterData.selectAccount.id !== undefined) {
            this._mounted = false
            this.fetchSecurityAudit(filterData)
        } else {
            this.props.setProgressBar(false);
        }
        this.unsubscribe = store.subscribe(this.receiveFilterData)
    }

    componentWillUnmount() {
        this._mounted = false
    }

    componentDidUpdate = (prevProps, prevState) => {
        if (this.props.search !== prevProps.search) {
            this.setState({ dataList: [], filterProgress: true }, () => {
                const filterData = this.props.filterData
                this.fetchSecurityAudit(filterData)
            })
        }
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
                    this.fetchSecurityAudit(filterData)
                })
            } else {
                this.props.setProgressBar(false);
            }
        }
    }

    fetchSecurityAudit(filterData) {

        this.setState({ isRequestForData: true })

        const { service, pageNo, sortDirection, sortBy } = this.state

        let payload = {
            page: pageNo,
            sort: sortDirection === SortDirection.ASC,
            sort_by: sortBy,
        }

        if (filterData.selectAccount.id !== 'all' && filterData.selectAccount.id !== undefined) {
            payload['account'] = filterData.selectAccount.id
        }

        if (filterData.selectCloud.id !== 'all') {
            payload['cloud'] = filterData.selectCloud.id
        }


        if (service && service[0] !== 'Select Service') {
            let filtered_services = filter(this.props.serviceList, function (p) {
                return includes(service, p.service_name);
            });
            const filtered_services_names = filtered_services.map(service => service.service);
            payload.service = filtered_services_names
        }


        this.props.actions.fetchSecurityAudit(payload).
            then(result => {
                this._mounted = true
                if (!result.success) {
                    const message = { message: result, showSnackbarState: true, variant: 'error' }
                    this.props.showMessage(message)
                    this.props.setProgressBar(false);
                    this.setState({isRequestForData: false})
                } else {
                    this.props.setProgressBar(false);
                    let oldDataList = this.state.dataList
                    this.setState({ isRequestForData: false, dataList: oldDataList.concat(result.data), isMoreData: result.data.length >= this.state.perPage })
                }
            });
    }


    //   --------------------Table related method Start-----------------------

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

    _isRowLoaded = ({ index }) => {
        return !!this.state.dataList[index];
    }

    actionCellRenderer = ({ cellData }) => {
        return (
            <div>
                <a href="javascript:void(0)"> {cellData}</a>
            </div>
        );
    };

    ruleExecuteCellRenderer = ({ cellData }) => {
        return (
            <div>
                <span className="text-sucess"> {cellData}</span>
            </div>
        );
    };

    ruleIssueCellRenderer = ({ cellData }) => {
        return (
            <div>
                <span className="text-danger"> {cellData}</span>
            </div>
        );
    };


    _loadMoreRows = ({ startIndex, stopIndex }) => {
        let pageNo = Math.floor((stopIndex) / this.state.perPage)
        if (pageNo + 1 !== this.state.pageNo && this.state.isMoreData) {
            const filterData = this.props.filterData
            // this.fetchSecurityAudit(filterData)
        }
    }


    scrollEvent = ({ clientHeight, scrollHeight, scrollTop }) => {
        if (this.state.isMoreData && scrollTop > 0 && clientHeight > 0 && !this.state.isRequestForData) {
                this.setState({ pageNo: this.state.pageNo + 1, isRequestForData: true }, () => {
                    const filterData = this.props.filterData
                    this.fetchSecurityAudit(filterData)
                });
            
        }
    }



    isSortEnabled = () => {
        const list = this.state.dataList;
        const rowCount = this.state.rowCount;
        return rowCount <= list.length;
    }

    sort = ({ sortBy, sortDirection }) => {
        this.setState({ sortBy, sortDirection, filterProgress: true, pageNo: 0, dataList: [] }, () => {
            const filterData = this.props.filterData
            this.fetchSecurityAudit(filterData)
        });
    }

    //   --------------------Table related method End-----------------------

    //   --------------------Custom logic method Start-----------------------

    handleCheckbox = name => event => {
        this.setState({ [name]: event.target.checked });
    };


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
            this.fetchSecurityAudit(filterData)
        });
    };


    handleChange = name => event => {
        this.setState({ search: event.target.value })
    }

    //   --------------------Custom logic method Ebd-----------------------
    render() {
        const {
            headerHeight,
            height,
            sortBy,
            sortDirection,
            dataList,
            service
        } = this.state;

        const sortedList = dataList;

        return (
            <div
                tabIndex={0}
                role="button"
                className="container"
            >
                <Grid container spacing={24} justify="flex-end" className="mrB5">
                    <Grid item xs={12} sm={6} md={2} className="pdB0">
                        <div className="d-flex">
                            <ServiceFilter selectServices={service} selectHandler={this.handleServiceChange} />
                        </div>
                       
                    </Grid>
                    {/* <Grid item sm={3}>
                        <SearchField handleChange={this.handleChange} />
                    </Grid> */}
                </Grid>
                <div style={{ height: "calc(100% - 30px)", maxHeight: "100%" }}>
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
                                        rowHeight={40}
                                        sort={this.sort}
                                        sortBy={sortBy}
                                        sortDirection={sortDirection}
                                        onRowsRendered={onRowsRendered}
                                        noRowsRenderer={this.noRowsRenderer}
                                        width={width}
                                        onScroll={this.scrollEvent}
                                        className="data-table table-no-border"
                                    >

                                        <Column
                                            dataKey="service"
                                            label="Services"
                                            headerRenderer={headerRenderer}
                                            cellRenderer={serviceCellRenderer}
                                            disableSort={false}
                                            width={200}
                                            flexGrow={1}
                                        />

                                        <Column
                                            dataKey="execution_time"
                                            label="Time Checked"
                                            headerRenderer={headerRenderer}
                                            cellRenderer={dateCellRenderer}
                                            disableSort={false}
                                            width={100}
                                            flexGrow={2}
                                        />

                                        <Column
                                            dataKey="executedSuccessfully"
                                            label="Rules Executed"
                                            headerRenderer={headerRenderer}
                                            cellRenderer={this.ruleExecuteCellRenderer}
                                            disableSort={false}
                                            width={70}
                                            flexGrow={3}
                                        />
                                        <Column
                                            dataKey="issueIdentifield"
                                            label="Issues"
                                            headerRenderer={headerRenderer}
                                            disableSort={false}
                                            cellRenderer={this.ruleIssueCellRenderer}
                                            width={70}
                                            flexGrow={4}
                                        />

                                        <Column
                                            dataKey="status"
                                            label="Status"
                                            headerRenderer={headerRenderer}
                                            disableSort={false}
                                            width={100}
                                            flexGrow={5}
                                        />
                                    </Table>
                                )}
                            </InfiniteLoader>
                        )}
                    </AutoSizer>
                </div>
            </div>
        );
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators(Object.assign({}, dashboardActions), dispatch),
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

export default withRouter((connect(mapStateToProps, mapDispatchToProps)(SystemLogList)));