/*
 * @Author: Virendra Patidar 
 * @Date: 2018-09-06 17:29:15 
 * @Last Modified by: Virendra Patidar
 * @Last Modified time: 2018-10-15 17:40:15
 */
import React, { PureComponent } from "react"
import { withRouter } from 'react-router-dom'

import {
    Table,
    Column,
    SortDirection,
    InfiniteLoader
} from "react-virtualized"
import AutoSizer from "react-virtualized/dist/commonjs/AutoSizer"

import { store } from 'client'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { cloneDeep, debounce } from "lodash"

import Loader from 'global/Loader'

import { sNoCellRenderer, dateCellRenderer, headerRenderer, wrapTextCellRenderer } from 'TableHelper/cellRenderer'
import * as logActions from 'actions/logAction'
import { showMessage } from 'actions/messageAction'
import { setProgressBar } from 'actions/commonAction'

class HistoryLogList extends PureComponent {
    _mounted = false
    state = {
        headerHeight: 40,
        rowHeight: 25,
        rowCount: 0,
        height: 450,
        sortBy: "time_stamp",
        sortDirection: SortDirection.DESC,
        count: 10,
        dataList: [],
        loaded: true,
        isMoreData: true,
        filterProgress: false
    };

    fetchLogs = debounce(this.fetchLogs, 500);
    currentValue = this.props.filterData

    componentDidMount() {
        this._mounted = true
        this.props.setProgressBar(true);
        const filterData = this.props.filterData
        if (filterData.selectAccount.id !== 'all' && filterData.selectAccount.id !== undefined) {
            this._mounted = false
            this.fetchLogs(filterData)
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
                this.fetchLogs(filterData)
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
            this.props.setProgressBar(true);
            this.setState({ dataList: [] }, () => {
                if (filterData.selectAccount.id !== 'all' && this._mounted) {
                    this.setState({dataList: []}, () => {
                        this.fetchLogs(filterData)
                    })
                } else {
                    this.props.setProgressBar(false);
                }
            })
        }
    }

    fetchLogs(filterData) {
        let payload = {
            search: this.props.search,
            sort_order: this.state.sortDirection === SortDirection.ASC,
            sort_by: this.state.sortBy
        }

        if (filterData.selectAccount.id !== 'all' && filterData.selectAccount.id !== undefined) {
            payload['account_id'] = filterData.selectAccount.id
        }

        this.props.actions.fetchLogs(payload).
            then(result => {
                this._mounted = true
                if (result.success) {
                    this.props.setProgressBar(false);
                    this.setState({ filterProgress: false, dataList: this.state.dataList.concat(result.data), loaded: true, isMoreData: !result.data.length < 10 });
                } else {
                    this.props.setProgressBar(false);
                    this.setState({ filterProgress: false, loaded: true })
                    if (result.account_id) {
                        let message = { message: 'Please select account', showSnackbarState: true, variant: 'error' }
                        this.props.showMessage(message)
                    } else {
                        let message = { message: result, showSnackbarState: true, variant: 'error' }
                        this.props.showMessage(message)
                    }
                }
            });
    }

    _isRowLoaded = ({ index }) => {
        return !!this.state.dataList[index];
    }

    actionCellRenderer = () => {
        return (
            <div className="actions-icon">
                <a href="javascript:void(0)">
                    <i className="fa fa-trash-o"></i>
                </a>
            </div>
        );
    };

    statusCellRenderer = ({ cellData }) => {
        return (
            <div>
                <span className="text-success"> {cellData}</span>
            </div>
        );
    };

    _loadMoreRows = ({ startIndex, stopIndex }) => {
        if (this.state.isMoreData) {
            const filterData = this.props.filterData
            this.fetchLogs(filterData)
        }
    }

    isSortEnabled = () => {
        const list = this.state.dataList;
        const rowCount = this.state.rowCount;
        return rowCount <= list.length;
    }

    sort = ({ sortBy, sortDirection }) => {
        this.props.setProgressBar(true);
        this.setState({ sortBy, sortDirection, dataList: [] }, () => {
            const filterData = this.props.filterData
            this.fetchLogs(filterData)
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

    render() {
        const {
            headerHeight,
            height,
            sortBy,
            sortDirection,
            dataList
        } = this.state;

        const sortedList = dataList;

        return (
            <div style={{ height: "100%", maxHeight: "100%" }}>
                <AutoSizer>
                    {({ width, height }) => (
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
                                    width={width}
                                    className="data-table table-no-border"
                                    noRowsRenderer={this.noRowsRenderer}
                                >

                                    <Column
                                        dataKey="sno"
                                        label="S.No."
                                        headerRenderer={headerRenderer}
                                        cellRenderer={sNoCellRenderer}
                                        disableSort={true}
                                        width={20}
                                        flexGrow={1}
                                    />

                                    <Column
                                        dataKey="user"
                                        label="User"
                                        headerRenderer={headerRenderer}
                                        width={80}
                                        disableSort={false}
                                        flexGrow={2}
                                    />

                                    <Column
                                        dataKey="message"
                                        label="Message"
                                        headerRenderer={headerRenderer}
                                        width={400}
                                        disableSort={false}
                                        flexGrow={3}
                                        cellRenderer={wrapTextCellRenderer}
                                    />

                                    <Column
                                        dataKey="section"
                                        label="Section"
                                        headerRenderer={headerRenderer}
                                        width={200}
                                        disableSort={false}
                                        flexGrow={4}
                                        className="table-td"
                                    />
                                    <Column
                                        dataKey="type"
                                        label="type"
                                        headerRenderer={headerRenderer}
                                        disableSort={false}
                                        width={150}
                                        flexGrow={5}
                                        className="table-td"
                                    />

                                    <Column
                                        dataKey="time_stamp"
                                        label="Time stamp"
                                        headerRenderer={headerRenderer}
                                        cellRenderer={dateCellRenderer}
                                        disableSort={false}
                                        width={200}
                                        flexGrow={6}
                                    />
                                </Table>
                            )}
                        </InfiniteLoader>
                    )}
                </AutoSizer>
            </div>
        );
    }
}


const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators(Object.assign({}, logActions), dispatch),
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

export default withRouter((connect(mapStateToProps, mapDispatchToProps)(HistoryLogList)));
