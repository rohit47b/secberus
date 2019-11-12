/*
 * @Author: Virendra Patidar 
 * @Date: 2018-10-01 15:49:14 
 * @Last Modified by: Virendra Patidar
 * @Last Modified time: 2019-04-04 15:44:55
 */
import { Drawer, Switch } from '@material-ui/core';
import SnackbarMessage from 'global/SnackbarMessage';
import ConfirmDialogBoxHOC from 'hoc/DialogBox';
import React, { PureComponent } from "react";
import { Column, InfiniteLoader, SortDirection, Table } from "react-virtualized";
import AutoSizer from "react-virtualized/dist/commonjs/AutoSizer";
import { headerRenderer, sNoCellRenderer } from 'TableHelper/cellRenderer';
import history from 'customHistory'


class UserOrganizations extends PureComponent {

    _mounted = false

    state = {
        headerHeight: 40,
        rowHeight: 25,
        rowCount: 0,
        height: 450,
        sortBy: "columnone",
        sortDirection: SortDirection.ASC,
        count: 10,
        dataList: [],
        checkedA: false,

        openDialog: false,
        openStatusDialog: false,
        openSelectDialog: false,
        selecteAccountId: [],
        isAllAccountSelect: false,
        allAccountIds: [],
        isProgress: false,
        currentStatus: '',

        message: '',
        variant: 'info',
        showSnackbarState: false,

        openRemoveOrganizationDialog:false,
        organizationDetails:{}
    };



    componentDidMount() {
        this.setState({ dataList: this.getRows(3) });
    }

    getRows(num) {

        let organizations = [
            {name:'Organization 1',details:''},
            {name:'Organization 2',details:''},
            {name:'Organization 3',details:''}
        ];

        let cloudAccounts = [
            'AWS',
            'Slack',
            'Azure'
        ]

        return [...Array(num).keys()].map(a => ({
            cloudAccounts: [cloudAccounts[Math.floor(Math.random() * 3)], cloudAccounts[Math.floor(Math.random() * 3)]],
            organizations: organizations[Math.floor(Math.random() * 3)],
        }));

    }



    // --------------- Table helper method start---------------

    _isRowLoaded = ({ index }) => {
        return !!this.state.dataList[index];
    }

    statusCellRenderer = ({ rowData, cellData, rowIndex }) => {
        let boxClass = ["switch-green"];
        if (cellData === undefined || cellData === 'active' || cellData === null) {
            boxClass.push('active');
        }
        return (
            <div>
                <Switch className={boxClass.join(' ')} checked={cellData === undefined || cellData === null || cellData === 'active' ? true : false} onChange={() => this.statusChangeDialog(rowIndex, cellData, rowData.id)} />
            </div>
        );
    };


    actionCellRenderer = ({ rowData, cellData }) => {
        return (<div>
            <span className="fnt-16 text-gray mrR10" style={{ cursor: "pointer" }} onClick={() => this.props.openEditOrganization(rowData.organizations)}>
                <i className="fa fa-pencil" aria-hidden="true"></i>
            </span>
            <span className="fnt-16 text-gray" style={{ cursor: "pointer" }} onClick={() => this.openRemoveOrganization(rowData)}>
                <i className="fa fa-trash-o" aria-hidden="true"></i>
            </span>
        </div>
        )
    }


    openRemoveOrganization = (organizationDetails) => {
        this.setState({ openRemoveOrganizationDialog: true, organizationDetails })
    }

    closeRemoveOrganization = () => {
        this.setState({ openRemoveOrganizationDialog: false, organizationDetails: {} })
    }


    _loadMoreRows = ({ startIndex, stopIndex }) => {
        // console.log(" load more ....", startIndex, stopIndex);
    }

    isSortEnabled = () => {
        const list = this.state.dataList;
        const rowCount = this.state.rowCount;
        return rowCount <= list.length;
    }

    sort = ({ sortBy, sortDirection }) => {
        this.setState({ sortBy, sortDirection });
    }


    anchorCellRenderer = ({ rowData, cellData }) => {
        return (
            <div>
                <a href="javascript:void(0)" onClick={() => this.redirectToOrganizationDetails()}>{cellData.name}</a>
            </div>
        );
    };


    anchorArrayCellRenderer = ({ rowData, cellData }) => {
        return (<div title={cellData}>
            {
                cellData.map((item, index) => {
                    return <a key={item + cellData + index} href="javascript:void(0)" onClick={() => this.props.openOrganizationDetails(item)}>{item} ,</a>
                })
            }
        </div>)
    };

    redirectToOrganizationDetails=()=>{
        this.props.closeUserOrganizations(false)
        history.push('/app/organization-management')
    }





    // --------------- Table helper method End---------------



    render() {
        const {
            headerHeight,
            sortBy,
            sortDirection,
            dataList,
            openRemoveOrganizationDialog,
            variant, message, showSnackbarState
        } = this.state;

        const { userDetails } = this.props

        const sortedList = dataList;

        return (
            <Drawer className="right-sidebar width-600 security-sidebar" anchor="right" open={true}>
                <div className="container sidebar-container">
                    <div className="sidebar-header">
                        <h4>{userDetails.userName}</h4>
                        <span onClick={() => this.props.closeUserOrganizations(false)} className="sidebar-close-icon"><i className="fa fa-times-circle" aria-hidden="true"></i> Exit</span>
                        <div className="clearfix"></div>
                    </div>
                    <div
                        tabIndex={0}
                        role="button"
                        className="sidebar-body container"
                    >

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
                                                rowHeight={40}
                                                sort={this.sort}
                                                sortBy={sortBy}
                                                sortDirection={sortDirection}
                                                onRowsRendered={onRowsRendered}
                                                width={width}
                                                className="data-table table-no-border"
                                            >


                                                <Column
                                                    dataKey="sno"
                                                    label="S.No."
                                                    headerRenderer={headerRenderer}
                                                    disableSort={!this.isSortEnabled}
                                                    cellRenderer={sNoCellRenderer}
                                                    width={40}
                                                    flexGrow={1}

                                                />


                                                <Column
                                                    dataKey="organizations"
                                                    label="organizations"
                                                    headerRenderer={headerRenderer}
                                                    disableSort={!this.isSortEnabled}
                                                    cellRenderer={this.anchorCellRenderer}
                                                    width={300}
                                                    flexGrow={2}

                                                />
                                                <Column
                                                    dataKey="cloudAccounts"
                                                    label="cloudAccounts"
                                                    headerRenderer={headerRenderer}
                                                    disableSort={true}
                                                    width={100}
                                                    flexGrow={3}
                                                />


                                                <Column
                                                    dataKey="action"
                                                    label="Action"
                                                    headerRenderer={headerRenderer}
                                                    cellRenderer={this.actionCellRenderer}
                                                    disableSort={true}
                                                    width={100}
                                                    flexGrow={4}
                                                />
                                            </Table>
                                        )}
                                    </InfiniteLoader>
                                )}
                            </AutoSizer>
                        </div>

                        <ConfirmDialogBoxHOC
                            isOpen={openRemoveOrganizationDialog}
                            handleDialogClose={this.closeRemoveOrganization}
                            title={'Confirmation'}
                            content={'Are you sure you want to remove this organization ?'}
                            successDialogEvent={this.closeRemoveOrganization}
                        />
                        <SnackbarMessage
                            open={showSnackbarState}
                            message={message}
                            variant={variant}
                            handleClose={this.handleClose}
                        />

                    </div>
                </div>
            </Drawer>
        );
    }
}


export default UserOrganizations