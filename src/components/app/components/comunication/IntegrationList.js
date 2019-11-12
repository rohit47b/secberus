/*
 * @Author: Virendra Patidar 
 * @Date: 2018-09-26 10:01:52 
 * @Last Modified by: Virendra Patidar
 * @Last Modified time: 2018-11-23 15:34:53
 */
import React, { PureComponent } from "react"

import {
    Table,
    Column,
    SortDirection,
    InfiniteLoader
} from "react-virtualized"
import AutoSizer from "react-virtualized/dist/commonjs/AutoSizer"

import WithDrawer from 'TableHelper/with-drawer'

import Switch from '@material-ui/core/Switch'
import Chip from '@material-ui/core/Chip'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { debounce } from "lodash"
import { withRouter } from 'react-router-dom'

import Loader from 'global/Loader'
import ConfirmDialogBoxHOC from 'hoc/DialogBox'

import { headerRenderer, dateCellRenderer } from 'TableHelper/cellRenderer'

import { showMessage } from 'actions/messageAction'
import * as integrationActions from 'actions/integrationAction'
import * as slackIntegrationActions from 'actions/slackIntegrationAction'
import { setProgressBar } from 'actions/commonAction'

class IntegrationList extends PureComponent {

    _mounted = false

    state = {
        // Table helper attribute
        headerHeight: 40,
        rowHeight: 25,
        rowCount: 0,
        height: 450,
        sortBy: "columnone",
        sortDirection: SortDirection.ASC,
        count: 10,
        dataList: [],
        checkedA: false,
        integrationIndex: 0,
        integrationId: 0,
        openRuleDialog: false,
        ruleIndex: 0,
        ruleId: 0,
        toggleRowIndex: -1,
        filterProgress: false
    };

    componentDidMount() {
        this._mounted = true
        this.props.setProgressBar(true);
        this.fetchClouds();
    }

    componentWillUnmount() {
        this._mounted = false
    }

    fetchClouds() {
        // if (this.props.awsList.length === 0) {
        this.props.actions.fetchIntegrationList().
            then(result => {
                if (this._mounted) {
                    if (result.success) {
                        this.props.setProgressBar(false);
                        let dataList = []
                        result.data.forEach(function(item) {
                            item.accounts.forEach(function(account) {
                                account['cloud'] = item.cloud
                                if (account['role_arn'] === null) {
                                    account['role_arn'] = account['role_email']
                                }
                                if (account['account_name'] === null) {
                                    account['account_name'] = account['key_id']
                                }
                                dataList.push(account)
                            });
                        });
                        this.setState({ dataList: dataList, loaded: true })
                    } else {
                        this.props.setProgressBar(false);
                        this.setState({ dataList: [], loaded: true })
                        let message = { message: result, showSnackbarState: true, variant: 'error' }
                        this.props.showMessage(message)
                    }
                }
            });
        // } else {
        //     // this.setState({ clouds: this.props.awsList, loaded: true })
        // }
    }

    // ---------------- Table helper method start------------------

    _rowGetter = ({ index }) => {
        return this.state.dataList[index];
    }

    _isRowLoaded = ({ index }) => {
        return !!this.state.dataList[index];
    }

    accountCellRenderer = ({ cellData }) => {
        return (
            cellData.map((accountName, index) => {
                return <div key={accountName}>
                    <Chip label={accountName} className="chip-gray" />
                </div>
            })
        );
    };

    _loadMoreRows = ({ startIndex, stopIndex }) => {
        const filterData = this.props.filterData
    }

    isSortEnabled = () => {
        const list = this.state.dataList;
        const rowCount = this.state.rowCount;
        return rowCount <= list.length;
    }

    sort = ({ sortBy, sortDirection }) => {
        this.setState({ sortBy, sortDirection });
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

    actionCellRenderer = ({ rowData, cellData, rowIndex }) => {
        let boxClass = ["switch-green"];
        if (rowData.status === 'active') {
            boxClass.push('active');
        }
        return (
            <div>
                <Switch className={boxClass.join(' ')} checked={cellData === undefined ? true : cellData} />
            </div>
        );
    };

    // ---------------- Table helper method End------------------


    // ---------------- Custom logic method Start------------------

    // ---------------- Custom logic method end------------------


    render() {
        const {
            height,
            dataList,
            toggleRowIndex,
            integrationName,integrationId
        } = this.state;

        return (
            <div className="container">
                <WithDrawer
                    drawerContent={(rowProps) => {
                        return (<div className="sub-table"></div>);
                    }}
                    rowsDimensions={dataList.map((dataItem) => ({ collapsedHeight: 38, expandedHeight: 300 }))}
                >
                    {({ rowHeight, rowRenderer, toggleDrawerWithAnimation, setTableRef }) => (
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
                                                ref={setTableRef}
                                                headerHeight={39}
                                                height={height}
                                                width={width}
                                                rowCount={dataList.length}
                                                rowGetter={this._rowGetter}
                                                rowHeight={rowHeight}
                                                rowRenderer={rowRenderer}
                                                noRowsRenderer={this.noRowsRenderer}
                                                className="data-table table-no-border"
                                            >

                                                <Column
                                                    className="col-td toggle-row"
                                                    label="Type"
                                                    dataKey="cloud"
                                                    width={50}
                                                    flexGrow={1}
                                                    headerRenderer={headerRenderer}
                                                />
                                                <Column
                                                    className="col-td"
                                                    dataKey="account_name"
                                                    label="Name"
                                                    headerRenderer={headerRenderer}
                                                    disableSort={!this.isSortEnabled}
                                                    width={200}
                                                    flexGrow={2}

                                                />

                                                <Column
                                                    className="col-td"
                                                    dataKey="role_arn"
                                                    label="Role"
                                                    headerRenderer={headerRenderer}
                                                    disableSort={!this.isSortEnabled}
                                                    width={400}
                                                    flexGrow={3}
                                                />

                                                <Column
                                                    className="col-td"
                                                    dataKey="status"
                                                    label="Status"
                                                    headerRenderer={headerRenderer}
                                                    disableSort={true}
                                                    width={50}
                                                    flexGrow={4}
                                                />

                                                <Column
                                                    className="col-td"
                                                    dataKey="created_at"
                                                    label="Created"
                                                    headerRenderer={headerRenderer}
                                                    disableSort={!this.isSortEnabled}
                                                    width={350}
                                                    flexGrow={5}
                                                />

                                                   <Column
                                                    dataKey="action"
                                                    label="Disable/Enable"
                                                    headerRenderer={headerRenderer}
                                                    cellRenderer={this.actionCellRenderer}
                                                    disableSort={true}
                                                    width={100}
                                                    flexGrow={8}
                                                />
                                            
                                            </Table>
                                        )}
                                    </InfiniteLoader>
                                )}
                            </AutoSizer>
                        </div>
                    )}
                </WithDrawer>
            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => ({
    awsList: state.commonReducer.awsList,
    filterData: state.uiReducer.filterData,
})

const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators(Object.assign({}, integrationActions, slackIntegrationActions), dispatch),
        showMessage: message => {
            dispatch(showMessage(message))
        }, setProgressBar: isProgress => {
            dispatch(setProgressBar(isProgress))
        }, setHeaderFilterData: filterData => {
            dispatch(setHeaderFilterData(filterData))
        },
    };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(IntegrationList));