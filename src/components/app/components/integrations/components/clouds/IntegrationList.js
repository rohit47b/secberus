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
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { debounce } from "lodash"
import { withRouter } from 'react-router-dom'

import Loader from 'global/Loader'
import ConfirmDialogBoxHOC from 'hoc/DialogBox'

import { headerRenderer, dateCellRenderer } from 'TableHelper/cellRenderer'

import { showMessage } from 'actions/messageAction'
import * as integrationActions from 'actions/integrationAction'
import { setProgressBar, setAutoRefresh } from 'actions/commonAction'
import DeleteCloud from 'global/DeleteCloud'
import { cloneDeep } from "lodash"

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
        checkedA: false,
        integrationIndex: 0,
        integrationId: 0,
        openRuleDialog: false,
        ruleIndex: 0,
        ruleId: 0,
        toggleRowIndex: -1,
        filterProgress: false,
        openConfirmDialog: false,
        content: 'After deletion, the User’s cloud account will no longer exist and will be erased from the face of this planet. To continue deletion, please type in delete',
        currentStatus: true,
        openStatusDialog: false,
        dataList: []
    };

    componentDidMount() {
        this._mounted = true
        this.props.setProgressBar(true);
        this.fetchClouds()
    }

    componentWillUnmount() {
        this._mounted = false
    }

    fetchClouds() {
        this.props.setProgressBar(false);
        this.setState({ dataList: this.props.cloudList, loaded: true })
    }

    UpdateCloud(data) {
        this.props.actions.updateAccount(data).
            then(result => {
                if (this._mounted) {
                    if (result && (typeof result === 'string')) {
                        let message = { message: result, showSnackbarState: true, variant: 'error' }
                        this.props.showMessage(message)
                    }
                }
            })
    }

    // ---------------- Table helper method start------------------

    _rowGetter = ({ index }) => {
        if (this.props.autoRefresh === 'LoadRows') {
            this.setState({ dataList: this.props.cloudList })
            this.props.setAutoRefresh('None')
        }
        return this.state.dataList[index];
    }

    _isRowLoaded = ({ index }) => {
        if (this.props.autoRefresh === 'LoadRows') {
            this.setState({ dataList: this.props.cloudList })
            this.props.setAutoRefresh('None')
        }
        return this.state.dataList[index];
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
        return (
            <Switch
                checked={cellData === true}
                onChange={() => this.statusChangeDialog(cellData, rowIndex)}
                value={cellData === true}
                className={cellData === true ? "select-control-red" : "select-control-green active"}
            />
        )
    };

    handleDialogClose = () => {
        this.setState({ openStatusDialog: false })
    }

    statusChangeDialog = (cellData, rowIndex) => {
        this.setState({ openStatusDialog: true, rowIndex, currentStatus: cellData });
    }

    enableDisableCloud = () => {
        const dataList = cloneDeep(this.state.dataList)
        let newDataList = dataList.map((row, sidx) => {
            if (this.state.rowIndex !== sidx) {
                return row;
            } else {
                const currentStatus = this.state.currentStatus;
                let currentStatusString = 'Enable'
                if (currentStatus) {
                    currentStatusString = 'Disable'
                }
                this.UpdateCloud({id: row.id, cloud: row.cloud, name: row.name, credentials: row.credentials, enabled: !currentStatus})
                return { ...row, enabled: !currentStatus,  status: currentStatusString};
            }
        });
        this.setState({ dataList: newDataList, openStatusDialog: false }, () => {
        });
    }

    deleteCellRenderer = ({ rowData, cellData, rowIndex }) => {
        return (
            <DeleteCloud cloudData={rowData} />
        );
    };

    // ---------------- Table helper method End------------------


    // ---------------- Custom logic method Start------------------

    // ---------------- Custom logic method end------------------


    render() {
        const {
            height,
            toggleRowIndex,
            integrationName,
            integrationId,
            openStatusDialog,
            currentStatus,
            dataList
        } = this.state;
        const { cloudList } = this.props
        return (
            <div className="container">
                <WithDrawer
                    drawerContent={(rowProps) => {
                        return (<div className="sub-table"></div>);
                    }}
                    rowsDimensions={dataList.map((dataItem) => ({ collapsedHeight: 38, expandedHeight: 300 }))}
                >
                    {({ rowHeight, rowRenderer, toggleDrawerWithAnimation, setTableRef }) => (
                         <div className="table-container" style={{ height: "100%", maxHeight: "100%" }}>
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
                                                className="data-table table-no-border table-height-39"
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
                                                    dataKey="name"
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
                                                    dataKey="create_date"
                                                    label="Created"
                                                    headerRenderer={headerRenderer}
                                                    disableSort={!this.isSortEnabled}
                                                    width={350}
                                                    flexGrow={5}
                                                />

                                                <Column
                                                    dataKey="enabled"
                                                    label="Disable/Enable"
                                                    headerRenderer={headerRenderer}
                                                    cellRenderer={this.actionCellRenderer}
                                                    disableSort={true}
                                                    width={100}
                                                    flexGrow={8}
                                                />

                                                <Column
                                                    dataKey="delete"
                                                    cellRenderer={this.deleteCellRenderer}
                                                    disableSort={true}
                                                    width={100}
                                                    flexGrow={8}
                                                />
                                            
                                            </Table>
                                        )}
                                    </InfiniteLoader>
                                )}
                            </AutoSizer>

                            <ConfirmDialogBoxHOC
                                isOpen={openStatusDialog}
                                handleDialogClose={this.handleDialogClose}
                                title={'Confirmation'}
                                cancelBtnLabel={"CANCEL"}
                                confirmBtnLabel={currentStatus === true ? "DEACTIVATE":"ACTIVE"}
                                content={currentStatus === true ? 'If you disable the cloud account it will stop the scanner from detecting any cloud vulnerabilities and/or cloud configuration changes.' : 'Are you sure you want to Active this Cloud ?'}
                                successDialogEvent={this.enableDisableCloud} />
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
    autoRefresh: state.commonReducer.autoRefresh
})

const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators(Object.assign({}, integrationActions), dispatch),
        showMessage: message => {
            dispatch(showMessage(message))
        }, setProgressBar: isProgress => {
            dispatch(setProgressBar(isProgress))
        }, setHeaderFilterData: filterData => {
            dispatch(setHeaderFilterData(filterData))
        }, setAutoRefresh: autoRefresh => {
            dispatch(setAutoRefresh(autoRefresh))
        }
    };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(IntegrationList));