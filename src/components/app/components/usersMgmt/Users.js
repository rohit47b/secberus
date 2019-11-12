/*
 * @Author: Virendra Patidar 
 * @Date: 2019-04-03 10:40:37 
 * @Last Modified by: Virendra Patidar
 * @Last Modified time: 2019-05-28 16:38:27
 */
import { Button, Grid } from '@material-ui/core';
import { setProgressBar } from 'actions/commonAction';
import { showMessage } from 'actions/messageAction';
import * as userActions from 'actions/userAction';
import history from 'customHistory';
import Loader from 'global/Loader';
import SearchField from 'global/SearchField';
import { BorderBox } from 'hoc/Box/BorderBox';
import ConfirmDialogBoxHOC from 'hoc/DialogBox';
import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { withRouter } from 'react-router-dom';
import { Column, InfiniteLoader, SortDirection, Table } from "react-virtualized";
import AutoSizer from "react-virtualized/dist/commonjs/AutoSizer";
import { bindActionCreators } from 'redux';
import { headerRenderer, sNoCellRenderer } from 'TableHelper/cellRenderer';
import AddEditOrganization from './AddEditOrganization';
import AddEditUser from './AddEditUser';
import { RoleBasedPrivileges } from './RoleBasedPrivileges';
import UserOrganizations from './UserOrganizations';
import ViewUser from './ViewUser';


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

        filterProgress: true,
        anchorEl: null,

        //Used for open filter dialog
        placement: null,
        popperEl: null,
        openPopOver: false,
        checked: [0],

        // Used for header filter list
        filterList: [],


        openDeleteUserDialog: false,
        organizationDetails: {},
        openAddEditOrganizationPopUp: false,

        openUserPopUp: false,
        userDetails: {},

        openUserOrganizationsPopUp: false,
        openRoleBasedPrivileges: false,

        anchorElRoleBased: null,
        openRoleBasedPrivileges: false,
        placementRoleBased: null,

        openViewUserPopUp: false
    };


    componentDidMount() {
        this.fetchUsers()
    }
    

    fetchUsers() {
        let payload = {}
        this.props.actions.fetchUserList(payload).
            then(response => {
                this.setState({ dataList: response,filterProgress:false })
            });
    }
    

    addSuccess=()=>{
        this.setState({openUserPopUp:false},()=>{
            this.fetchUsers()
            this.props.showMessage({ message: 'User Added Successfully', showSnackbarState: true, variant: 'success' });
        })
    }

    deleteUserSubmit=()=>{
        this.setState({openDeleteUserDialog:false,filterProgress:true})
        this.props.actions.DeleteUser(this.state.userDetails.id).
        then(response => {
               this.fetchUsers()
        });
    }

    //   --------------------Table helper method Start-----------------------

    _isRowLoaded = ({ index }) => {
        return !!this.state.dataList[index];
    }

    _loadMoreRows = ({ startIndex, stopIndex }) => {
        console.log(" load more ....", startIndex, stopIndex);
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

    actionCellRenderer = ({ rowData, cellData }) => {
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
        this.setState({ openDeleteUserDialog: false, organizationDetails: {} })
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
        this.setState({ openViewUserPopUp: true, userDetails })
    }

    openAddEditUser = (userDetails) => {
        this.setState({ openUserPopUp: true, userDetails })
    }

    toggleDrawerUser = () => {
        this.setState({ openUserPopUp: false, openViewUserPopUp: false, userDetails: {} })
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
                <a href="javascript:void(0)" onClick={() => this.openUserDetails(rowData)}>{rowData.first_name} {rowData.last_name}</a>
            </div>
        );
    };

    roleCellRenderer = ({ rowData, cellData }) => {
        return (
            <div>
                Super Admin
            </div>
        );
    };

    handleOpenPopper = () => {
        this.setState(state => ({
            openRoleBasedPrivileges: !state.openRoleBasedPrivileges,
        }))
    }

    handleClosePopper = () => {
        this.setState(state => ({
            openRoleBasedPrivileges: false
        }))
    }

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
            openAddEditOrganizationPopUp,
            organizationDetails,
            openUserOrganizationsPopUp,
            openRoleBasedPrivileges,
            openViewUserPopUp
        } = this.state;

        const sortedList = dataList;

        return (
            <div className="container">
                <Grid container spacing={24} className="mrB0">
                    <Grid item xs={12} md={2}>
                        <BorderBox content={<span className="d-flex align-item-center">Total Users <span className="count mrL15">{dataList.length}</span></span>} />
                    </Grid>
                    <Grid item xs={12} md={10} className="d-flex align-item-flex-end justify-flex-end">
                        <div className="d-flex justify-flex-end">
                            <Button
                                className="btn btn-primary mrR10"
                                variant="contained"
                                color="primary"
                                onClick={() => this.openAddEditUser({})}
                            >
                                Add User
                        </Button>
                            <SearchField handleChange={this.searchHandler} />
                        </div>
                    </Grid>
                </Grid>

                <div className="table-container" style={{ height: "100%", maxHeight: "100%" }}>
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
                                            width={20}
                                            flexGrow={1}
                                        />



                                        <Column
                                            dataKey="userName"
                                            label="Users"
                                            headerRenderer={headerRenderer}
                                            cellRenderer={this.anchorCellRenderer}
                                            disableSort={true}
                                            width={120}
                                            flexGrow={2}
                                        />

                                        <Column
                                            dataKey="role"
                                            label="Role"
                                            headerRenderer={headerRenderer}
                                            cellRenderer={this.roleCellRenderer}
                                            disableSort={false}
                                            width={100}
                                            flexGrow={3}
                                        />

                                        <Column
                                            dataKey="cloud_accounts"
                                            label="Cloud Accounts"
                                            headerRenderer={headerRenderer}
                                            disableSort={false}
                                            width={200}
                                            flexGrow={4}
                                        />



                                        <Column
                                            dataKey="action"
                                            label="Action"
                                            headerRenderer={headerRenderer}
                                            cellRenderer={this.actionCellRenderer}
                                            disableSort={false}
                                            width={50}
                                            flexGrow={5}
                                        />

                                    </Table>
                                )}
                            </InfiniteLoader>
                        )}
                    </AutoSizer>

                    {openUserPopUp === true && <AddEditUser addSuccess={this.addSuccess} userDetails={userDetails} toggleDrawerUser={this.toggleDrawerUser} handleClosePopper={this.handleClosePopper} handleOpenPopper={this.handleOpenPopper} />}
                    {openViewUserPopUp === true && <ViewUser userDetails={userDetails} toggleDrawerUser={this.toggleDrawerUser} handleClosePopper={this.handleClosePopper} handleOpenPopper={this.handleOpenPopper} />}

                    {openRoleBasedPrivileges === true && <RoleBasedPrivileges open={openRoleBasedPrivileges} handleClosePopper={this.handleClosePopper} />}

                    {openUserOrganizationsPopUp === true && <UserOrganizations userDetails={userDetails} closeUserOrganizations={this.closeUserOrganizations} openEditOrganization={this.openEditOrganization} />}
                    {openAddEditOrganizationPopUp === true && <AddEditOrganization organizationDetails={organizationDetails} closeEditOrganization={this.closeEditOrganization} />}

                    <ConfirmDialogBoxHOC
                        isOpen={openDeleteUserDialog}
                        handleDialogClose={this.closeDeleteUser}
                        title={'Confirmation'}
                        content={'Are you sure you want to delete this user ?'}
                        successDialogEvent={this.deleteUserSubmit}
                    />
                </div>
            </div>
        );
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators(Object.assign({}, userActions), dispatch),
        showMessage: message => {
            dispatch(showMessage(message))
        }, setProgressBar: isProgress => {
            dispatch(setProgressBar(isProgress))
        }
    };
}


export default withRouter(connect(null, mapDispatchToProps)(Users))