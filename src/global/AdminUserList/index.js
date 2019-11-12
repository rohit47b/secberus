/*
 * @Author: Virendra Patidar 
 * @Date: 2018-09-19 11:14:25 
 * @Last Modified by: Virendra Patidar
 * @Last Modified time: 2018-11-26 13:13:33
 */
import React, { PureComponent } from "react"
import {
  Table,
  Column,
  SortDirection,
  InfiniteLoader
} from "react-virtualized"
import AutoSizer from "react-virtualized/dist/commonjs/AutoSizer"


import Button from '@material-ui/core/Button'
import Switch from '@material-ui/core/Switch'
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import Grid from '@material-ui/core/Grid'


import { bindActionCreators } from 'redux'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { Field, reduxForm } from 'redux-form'

import { sNoCellRenderer, headerRenderer } from 'TableHelper/cellRenderer'
import Loader from 'global/Loader'

import { showMessage } from 'actions/messageAction'
import * as userActions from 'actions/userAction'
import { setProgressBar } from 'actions/commonAction'

import ConfirmDialogBoxHOC from 'hoc/DialogBox'

import { renderPasswordField } from 'reduxFormComponent'


const validate = values => {
  const errors = {}
  const requiredFields = [
    'new_password',
    'confirm_password'
  ]
  requiredFields.forEach(field => {
    if (!values[field]) {
      errors[field] = 'This field is required'
    }
  })


  if (
    values.new_password &&
    !/^(?=.*[A-Za-z])(?=.*\d)(?=.*[$&+,:;=?@#|'"`<>.^*()%!-~/])[A-Za-z\d$&+,:;=?@#|'"`<>.^*()%!-~/]{8,}$/i.test(values.new_password)
  ) {
    errors.new_password = 'Password is not strong (Minimum eight characters, at least one letter, one number and one special character.)'
  }


  if (
    values.new_password && values.confirm_password &&
    values.confirm_password !== values.new_password
  ) {
    errors.confirm_password = 'Not Match Password'
  }
  return errors
}


class AdminUserList extends PureComponent {
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
    user: '',
    newDataList: [],
    filterProgress: false,
    openResetPassword: false,

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

  statusChangeDialog = (rowIndex, userId) => {
    this.setState({ openDialog: true, rowIndex, userId });
  }


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
        <a title="Reset Password" href="javascript:void(0)" onClick={this.handleOpenResetPassword}><i className="fa fa-key"></i></a>
        <a title="Edit User" href="javascript:void(0)"><i className="fa fa-pencil"></i></a>
        <a title="Delete User" href="javascript:void(0)"><i className="fa fa-trash-o"></i></a>
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
        <Switch className={boxClass.join(' ')} checked={cellData === undefined ? true : cellData} onChange={() => this.statusChangeDialog(rowIndex, rowData.user_id)} />
      </div>
    );
  };

  emailIdCellRenderer = () => {
    return (
      <div>
        info@gmail.com
      </div>
    )
  }


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


  handleOpenResetPassword = () => {
    this.setState({ openResetPassword: true });
  };

  handleCloseResetPassword = () => {
    this.setState({ openResetPassword: false });
  };


  render() {
    const {
      headerHeight,
      height,
      sortBy,
      sortDirection,
      dataList,
      openResetPassword,
      user,

    } = this.state;

    const sortedList = dataList;
    const { handleSubmit, invalid, submitting, pristine } = this.props;

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
                  className="data-table"
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
                    dataKey="emailid"
                    label="Email Id"
                    headerRenderer={headerRenderer}
                    disableSort={!this.isSortEnabled}
                    cellRenderer={this.emailIdCellRenderer}
                    width={200}
                    flexGrow={3}
                    className="table-td"
                  />

                  <Column
                    dataKey="status"
                    label="Active/Inactive"
                    headerRenderer={headerRenderer}
                    disableSort={!this.isSortEnabled}
                    cellRenderer={this.statusCellRenderer}
                    width={200}
                    flexGrow={5}

                  />

                  <Column
                    dataKey="action"
                    label="Action"
                    headerRenderer={headerRenderer}
                    cellRenderer={this.actionCellRenderer}
                    disableSort={true}
                    width={200}
                    flexGrow={6}
                  />

                </Table>
              )}
            </InfiniteLoader>
          )}
        </AutoSizer>


        {/* Dialog Box for status reset password */}



        <Dialog
          open={openResetPassword}
          onClose={this.handleCloseResetPassword}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          className="modal-add network-modal modal-report"
        >
          <DialogTitle className="modal-title">Reset Password</DialogTitle>
          <DialogContent className="modal-body">
            <form className="form-qaud">
              <Grid item sm={12} className="qaud-grid mrB15">
                <Field className="text-field icon-size" component={renderPasswordField} name="new_password" type="password" controllabel="Password" />
              </Grid>
              <Grid item sm={12} className="qaud-grid mrB15">
                <Field className="text-field icon-size" component={renderPasswordField} name="confirm_password" type="password" controllabel="Confirm Password" />
              </Grid>
              <Button type="submit" disabled={invalid || submitting || pristine} variant="contained" className="btn btn-primary btn-md">Save</Button>
            </form>
          </DialogContent>
        </Dialog>

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

const connectWithRedux = withRouter((connect(null, mapDispatchToProps)(AdminUserList)));
const AdminUserRedux = reduxForm({ form: 'resetpassword', validate, destroyOnUnmount: false, })(connectWithRedux)



export default AdminUserRedux;