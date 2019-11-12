/*
 * @Author: Virendra Patidar 
 * @Date: 2018-09-19 11:14:25 
 * @Last Modified by: Virendra Patidar
 * @Last Modified time: 2018-12-07 17:31:26
 */
import React, { PureComponent, Fragment } from "react"
import {
  Table,
  Column,
  SortDirection,
  InfiniteLoader
} from "react-virtualized"
import AutoSizer from "react-virtualized/dist/commonjs/AutoSizer"


import Button from '@material-ui/core/Button'
import Switch from '@material-ui/core/Switch'

import { bindActionCreators } from 'redux'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'

import { sNoCellRenderer, headerRenderer } from 'TableHelper/cellRenderer'
import Loader from 'global/Loader'

import { showMessage } from 'actions/messageAction'
import * as userActions from 'actions/userAction'
import { setProgressBar } from 'actions/commonAction'

import ConfirmDialogBoxHOC from 'hoc/DialogBox'

class UserList extends PureComponent {

  _mounted = false
  
  state = {
    // Attribute for react virtulized table
    headerHeight: 40,
    rowHeight: 25,
    rowCount: 0,
    height: 450,
    sortBy: "name",
    sortDirection: SortDirection.ASC,
    dataList: [],

    // Pagination attribute
    count: 10,
    pageNo: 0,

    openDialog: false,
    rowIndex: 0,
    userId: 0,
    currentStatus: false,
    openResetPasswordDialog: false,
    user: '',
    newDataList: [],
    filterProgress: false,

  };

  componentDidMount() {
    this._mounted = true
    this.props.setProgressBar(true);
    this.fetchUserList()
  }

  componentWillUnmount() {
    this._mounted = false
  }

  /**
   * Fetch user list if user search or change user type from filter
   */
  componentDidUpdate = (prevProps, prevState) => {
    if (this.props.selectedUserType !== prevProps.selectedUserType || this.props.search !== prevProps.search) {
      this.setState({ filterProgress: true })
      this.fetchUserList()
    }
  }

  // ----------- API Call Start--------------

  fetchUserList() {
    let payload = {
      state: this.props.selectedUserType,
      search: this.props.search,
      page: this.state.pageNo,
      order: this.state.sortDirection === SortDirection.ASC,
      sort_by: this.state.sortBy
    }

    if (this.props.companyId !== null) {
      payload.company = this.props.companyId
    }

    this.props.actions.fetchUserList(payload).
      then(result => {
        if (this._mounted) {
          if (result.success) {
            this.props.setProgressBar(false);
            this.setState({ dataList: result.data, filterProgress: false });
          } else {
            this.props.setProgressBar(false);
            this.setState({ dataList: [], filterProgress: false });
            let message = { message: result, showSnackbarState: true, variant: 'error' }
            this.props.showMessage(message)
          }
        }
      });
  }


  resetPasswordSendMail = () => {
    let payload = {
      user_id: this.state.userId,
    }
    this.props.actions.resetPasswordSendMail(payload).
      then(result => {
        if (this._mounted) {
          if (!result.success) {
            let message = { message: result, showSnackbarState: true, variant: 'error' }
            this.props.showMessage(message)
          } else {
            let message = { message: result.message, showSnackbarState: true, variant: 'success' }
            this.props.showMessage(message)
            this.setState({ openResetPasswordDialog: false })
          }
        }
      });
  }


  userActiveDeactive(status) {
    let payload = {
      user_id: this.state.userId,
      state: status
    }
    this.props.actions.userActiveDeactive(payload).
      then(result => {
        if (this._mounted) {
          if (!result.success) {
            let message = { message: result, showSnackbarState: true, variant: 'error' }
            this.props.showMessage(message)
          } else {
            let message = { message: result.message, showSnackbarState: true, variant: 'success' }
            this.props.showMessage(message)
            this.setState({ dataList: this.state.newDataList })
          }
        }
      });
  }

  // --------------------API Call End--------------


  // ------------------ Logic method start -------------------

  statusChangeDialog = (rowIndex, userId, currentStatus) => {
    this.setState({ openDialog: true, rowIndex, userId, currentStatus });
  }

  handleDialogClose = () => {
    this.setState({ openDialog: false, openResetPasswordDialog: false });
  };

  statusChange = () => {
    let currentStatus = false
    const newDataList = this.state.dataList.map((row, sidx) => {
      if (this.state.rowIndex !== sidx) {
        return row;
      } else {
        currentStatus = row.status === undefined || row.status === null ? true : row.status;
        this.userActiveDeactive(!currentStatus)
        return { ...row, status: !currentStatus };
      }
    });
    this.setState({ currentStatus: !currentStatus, newDataList, user_id: 0, rowIndex: 0, openDialog: false });
  }

  resetPasswordDialog = (userId, user) => {
    this.setState({ openResetPasswordDialog: true, userId, user });
  }

  // ------------------ Logic method end -------------------

  // ------------------ Table helper method start-------------------

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

  actionCellRenderer = ({ rowData }) => {
    return (
      <div className="actions-icon">
        <Button className="btn-primary" variant="contained" color="primary" onClick={() => this.resetPasswordDialog(rowData.user_id, rowData.name)}> Reset Password </Button>
      </div>
    );
  };

  nameCellRenderer = ({ cellData }) => {
    return (
      <div>
        <a href="javascript:void(0)" onClick={this.props.onClickEvent('right', true)}> {cellData}</a>
      </div>
    );
  };


  statusCellRenderer = ({ rowData, cellData, rowIndex }) => {
    let boxClass = ["switch-green"];
    if (cellData === undefined || cellData === true || cellData === null) {
      boxClass.push('active');
    }
    return (
      <div>
        <Switch className={boxClass.join(' ')} checked={cellData === undefined ? true : cellData} onChange={() => this.statusChangeDialog(rowIndex, rowData.user_id, cellData)} />
      </div>
    );
  };


  _loadMoreRows = ({ startIndex, stopIndex }) => {
    this.fetchUserList()
  }

  isSortEnabled = () => {
    const list = this.state.dataList;
    const rowCount = this.state.rowCount;
    return rowCount <= list.length;
  }

  sort = ({ sortBy, sortDirection }) => {
    this.setState({ sortBy, sortDirection }, () => {
      this.fetchUserList()
    });
  }

  // ------------------ Table helper method end-------------------


  render() {
    const {
      headerHeight,
      height,
      sortBy,
      sortDirection,
      dataList,
      openDialog,
      currentStatus,
      openResetPasswordDialog,
      user
    } = this.state;

    const sortedList = dataList;
    const { companyId } = this.props

    return (
      <div className="container">
        <AutoSizer disableHeight className="auto-container">
          {({ width }) => (
            <InfiniteLoader
              isRowLoaded={() => this._isRowLoaded}
              loadMoreRows={this._loadMoreRows}
              rowCount={100}
              height={height}
              threshold={10}
            >
              {({ onRowsRendered, registerChild }) => (
                <Table
                  headerHeight={headerHeight}
                  height={480}
                  rowCount={dataList.length}
                  rowGetter={({ index }) => sortedList[index]}
                  rowHeight={40}
                  sort={this.sort}
                  sortBy={sortBy}
                  sortDirection={sortDirection}
                  onRowsRendered={onRowsRendered}
                  width={width}
                  noRowsRenderer={this.noRowsRenderer}
                  className="data-table table-border"
                >

                  <Column
                    dataKey="sno"
                    label="S.No."
                    headerRenderer={headerRenderer}
                    disableSort={true}
                    cellRenderer={sNoCellRenderer}
                    width={50}
                    flexGrow={1}

                  />

                  <Column
                    dataKey="name"
                    label="Name"
                    headerRenderer={headerRenderer}
                    disableSort={!this.isSortEnabled}
                    // cellRenderer={this.nameCellRenderer}
                    width={200}
                    flexGrow={2}

                  />
                  <Column
                    dataKey="role"
                    label="Role"
                    headerRenderer={headerRenderer}
                    disableSort={!this.isSortEnabled}
                    width={200}
                    flexGrow={3}
                    className="table-td"
                  />
                  <Column
                    dataKey="permission"
                    label="Permission"
                    headerRenderer={headerRenderer}
                    disableSort={!this.isSortEnabled}
                    width={200}
                    flexGrow={4}
                    className="table-td"
                  />

                  {companyId === null && <Column
                    dataKey="status"
                    label="Active/Inactive"
                    headerRenderer={headerRenderer}
                    disableSort={!this.isSortEnabled}
                    cellRenderer={this.statusCellRenderer}
                    width={200}
                    flexGrow={5}

                  />}

                  {companyId === null && <Column
                    dataKey="action"
                    label="Action"
                    headerRenderer={headerRenderer}
                    cellRenderer={this.actionCellRenderer}
                    disableSort={true}
                    width={200}
                    flexGrow={6}
                  />

                  }

                </Table>
              )}
            </InfiniteLoader>
          )}
        </AutoSizer>

        {/* Dialog Box for status change */}

        <ConfirmDialogBoxHOC
          isOpen={openDialog}
          title={'Confirmation'}
          content={!currentStatus ? 'Are you sure you want to Active this user ?' : 'Are you sure you want to Inactive this user ?'}
          handleDialogClose={this.handleDialogClose}
          successDialogEvent={this.statusChange}
        />

        {/* Dialog Box for status reset password */}

        <ConfirmDialogBoxHOC
          isOpen={openResetPasswordDialog}
          title={'Confirmation'}
          content={'Are you sure you want to reset password for ' + user + ' ?'}
          handleDialogClose={this.handleDialogClose}
          successDialogEvent={this.resetPasswordSendMail}
        />

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
export default withRouter((connect(null, mapDispatchToProps)(UserList)));