/*
 * @Author: Virendra Patidar 
 * @Date: 2019-04-03 10:40:37 
 * @Last Modified by: Virendra Patidar
 * @Last Modified time: 2019-04-19 10:16:38
 */
import { Button, Grid } from '@material-ui/core';
import history from 'customHistory';
import Loader from 'global/Loader';
import SearchField from 'global/SearchField';
import { BorderBox } from 'hoc/Box/BorderBox';
import ConfirmDialogBoxHOC from 'hoc/DialogBox';
import React, { PureComponent } from "react";
import { Column, InfiniteLoader, SortDirection, Table } from "react-virtualized";
import AutoSizer from "react-virtualized/dist/commonjs/AutoSizer";
import { headerRenderer, sNoCellRenderer } from 'TableHelper/cellRenderer';
import AddEditUser from '../usersMgmt/AddEditUser';
import UserOrganizations from '../usersMgmt/UserOrganizations';
import AddEditOrganization from '../usersMgmt/AddEditOrganization';


class Users extends PureComponent {

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

        checkedA: true,

        pageNo: 0,
        isMoreData: true,
        perPage: 50,

        filterProgress: false,
        anchorEl: null,

        //Used for open filter dialog
        placement: null,
        popperEl: null,
        openPopOver: false,
        checked: [0],

        // Used for header filter list
        filterList: [],


        openDeleteUserDialog:false,
        organizationDetails:{},
        openAddEditOrganizationPopUp:false,

        openUserPopUp: false, 
        userDetails:{},

        openUserOrganizationsPopUp: false,
    };


    componentDidMount() {
        this.setState({ dataList: this.getRows(15) });
    }

    getRows(num) {
        let users = [
            'Virat Kohli',
            'Virendra',
            'Rohit',
            'Devendra Singh',
           'John Smith'
        ];


        let cloudAccounts = [
            'AWS',
            'Slack',
            'Azure'
        ];

        return [...Array(num).keys()].map(a => ({
            userName: users[Math.floor(Math.random() * 5)],
            cloudAccounts:[cloudAccounts[Math.floor(Math.random() * 3)],cloudAccounts[Math.floor(Math.random() * 3)]],
        }));
    }

    //   --------------------Table helper method Start-----------------------

    _isRowLoaded = ({ index }) => {
        return !!this.state.dataList[index];
    }

    _loadMoreRows = ({ startIndex, stopIndex }) => {
        console.log(" load more ....", startIndex, stopIndex);
        this.setState({ dataList: this.getRows(startIndex + 10) });
    }


    sort = ({ sortBy, sortDirection }) => {
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


    statusCellRenderer = ({ cellData }) => {
        return (
            <div>
                <span className="chip-sm chip-green">Active</span>
            </div>
        )
    }

    actionCellRenderer  = ({ rowData, cellData }) => {
        return (<div>
            <span className="fnt-16 text-gray mrR10" style={{ cursor: "pointer" }} onClick={() => this.openUserDetails(rowData)}>
                <i className="fa fa-pencil" aria-hidden="true"></i>
            </span>
            <span className="fnt-16 text-gray" style={{ cursor: "pointer" }} onClick={() => this.openDeleteUser(rowData)}>
                <i className="fa fa-trash-o" aria-hidden="true"></i>
            </span>
        </div>
        )
    }


    openDeleteUser = (userDetails) => {
        this.setState({ openDeleteUserDialog: true, userDetails })
    }

    closeDeleteUser = () => {
        this.setState({ openDeleteUserDialog: false, organizationDetails:{} })
    }
    

    openEditOrganization = (organizationDetails) => {
        this.setState({ openAddEditOrganizationPopUp: true, organizationDetails })
    }

    closeEditOrganization = () => {
        this.setState({ openAddEditOrganizationPopUp: false, organizationDetails: {} })
    }

    

    openUserOrganizations = (userDetails) => {
        this.setState({ openUserOrganizationsPopUp: true, userDetails })
    }

    closeUserOrganizations = () => {
        this.setState({ openUserOrganizationsPopUp: false, userDetails: {} })
    }
 


    anchorArrayCellRenderer = ({ rowData, cellData }) => {
        return (<div title={cellData}>
            {
                cellData.map((item, index) => {
                    return <a key={item + cellData + index} href="javascript:void(0)" onClick={() => history.push('/app/organization-management')}>{item} ,</a>
                })
            }
        </div>)
    };

    openUserDetails = (userDetails) => {
        this.setState({ openUserPopUp: true, userDetails })
    }

    toggleDrawerUser = () => {
        this.setState({ openUserPopUp: false, userDetails: {} })
    }




    handleClick = (placement, dataKey) => (event) => {
        const { currentTarget } = event;
        if (dataKey === 'status') {
            this.setState(state => ({
                popperEl: currentTarget,
                openPopOver: state.placement !== placement || !state.openPopOver,
                placement,
                filterList: state.enableDisableFilterList
            }));
        } else {
            this.setState(state => ({
                popperEl: null,
                openPopOver: false,
                placement: null,
            }));
        }
    };

    searchHandler = name => event => {
        this.setState({ search: event.target.value })
    }

    anchorCellRenderer = ({ rowData, cellData }) => {
        return (
            <div>
                <a href="javascript:void(0)" onClick={() => this.openUserOrganizations(rowData)}>{cellData}</a>
            </div>
        );
    };


    //   --------------------Table helper method End-----------------------

    render() {
        const {
            headerHeight,
            sortBy,
            sortDirection,
            dataList,
            openDeleteUserDialog,
            openUserPopUp,
            userDetails,
            openUserOrganizationsPopUp,
            openAddEditOrganizationPopUp,
            organizationDetails
        } = this.state;

        const sortedList = dataList;

        return (
            <div className="container">
               <Grid container spacing={24} className="mrB0">
                    <Grid item xs={12} md={2}>
                        <BorderBox content={<span className="d-flex align-item-center">Total Users <span className="count mrL15">15</span></span>} />
                    </Grid>
                    <Grid item xs={12} md={10} className="d-flex align-item-flex-end justify-flex-end">
                        <div className="d-flex justify-flex-end">
                            <Button
                                className="btn btn-primary mrR10"
                                variant="contained"
                                color="primary"
                                onClick={()=>this.openUserDetails({})}
                            >
                                Add User
                        </Button>
                            <SearchField handleChange={this.searchHandler} />
                        </div>
                    </Grid>
                </Grid>

                <div style={{ height: "100%", maxHeight: "100%" }}>
                    <AutoSizer>
                        {({ height, width }) => (
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
                                        rowHeight={60}
                                        //sort={this.sort}
                                        sortBy={sortBy}
                                        sortDirection={sortDirection}
                                        onRowsRendered={onRowsRendered}
                                        noRowsRenderer={this.noRowsRenderer}
                                        width={width}
                                        className="data-table table-no-border"
                                    >


                                        <Column
                                            dataKey="S.No."
                                            label="S.No."
                                            headerRenderer={headerRenderer}
                                            cellRenderer={sNoCellRenderer}
                                            disableSort={true}
                                            width={100}
                                            flexGrow={1}
                                        />



                                        <Column
                                            dataKey="userName"
                                            label="Name"
                                            headerRenderer={headerRenderer}
                                            cellRenderer={this.anchorCellRenderer}
                                            disableSort={true}
                                            width={100}
                                            flexGrow={2}
                                        />

                                        <Column
                                            dataKey="cloudAccounts"
                                            label="Cloud Accounts"
                                            headerRenderer={headerRenderer}
                                            disableSort={false}
                                            width={100}
                                            flexGrow={3}

                                        />


                                        <Column
                                            dataKey="action"
                                            label="Action"
                                            headerRenderer={headerRenderer}
                                            cellRenderer={this.actionCellRenderer}
                                            disableSort={false}
                                            width={100}
                                            flexGrow={5}
                                        />

                                    </Table>
                                )}
                            </InfiniteLoader>
                        )}
                    </AutoSizer>

                    {openUserPopUp === true && <AddEditUser userDetails={userDetails} toggleDrawerUser={this.toggleDrawerUser} />}
                    {openUserOrganizationsPopUp === true && <UserOrganizations userDetails={userDetails} closeUserOrganizations={this.closeUserOrganizations} openEditOrganization={this.openEditOrganization}/>}
                    {openAddEditOrganizationPopUp === true && <AddEditOrganization organizationDetails={organizationDetails} closeEditOrganization={this.closeEditOrganization} />}

                    <ConfirmDialogBoxHOC
                        isOpen={openDeleteUserDialog}
                        handleDialogClose={this.closeDeleteUser}
                        title={'Confirmation'}
                        content={'Are you sure you want to delete this user ?'}
                        successDialogEvent={this.closeDeleteUser}
                    />
                </div>
            </div>
        );
    }
}


export default Users