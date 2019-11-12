/*
 * @Author: Virendra Patidar 
 * @Date: 2018-10-01 15:49:14 
 * @Last Modified by: Virendra Patidar
 * @Last Modified time: 2019-01-04 15:31:14
 */
import React, { PureComponent } from "react"

import {
  Table,
  Column,
  SortDirection,
  InfiniteLoader
} from "react-virtualized"
import AutoSizer from "react-virtualized/dist/commonjs/AutoSizer"

import Switch from '@material-ui/core/Switch'
import Button from '@material-ui/core/Button'
import Checkbox from '@material-ui/core/Checkbox'

import { connect } from "react-redux"
import { bindActionCreators } from 'redux'
import { withRouter } from 'react-router-dom'
import { cloneDeep } from "lodash"

import { sNoCellRenderer, headerRenderer } from 'TableHelper/cellRenderer'

import ConfirmDialogBoxHOC from 'hoc/DialogBox'
import Loader from 'global/Loader'

import * as integrationActions from 'actions/integrationAction'
import { showMessage } from 'actions/messageAction'
import { setProgressBar } from 'actions/commonAction'
import { setReloadFlagSearchBar } from 'actions/uiAction'
import * as schedulerSettingActions from 'actions/schedulerSettingAction'

import SnackbarMessage from 'global/SnackbarMessage'

class AccountListSideBar extends PureComponent {
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
    isProgress: true,
    currentStatus: '',

    message: '',
    variant: 'info',
    showSnackbarState: false
  };


  componentDidMount() {
    this._mounted = true
    this.setState({ dataList: this.props.dataList, isProgress: false }, () => {
      this.setAllAccountIds()
    });
  }

  setAllAccountIds = () => {
    let allAccountIds = []
    this.state.dataList.map((account, index) => {
      allAccountIds.push(account.id)
    })
    this.setState({ allAccountIds: allAccountIds })
  }

  componentWillUnmount() {
    this._mounted = false
  }

  // static getDerivedStateFromProps(nextProps, state) {
  //   return { dataList: nextProps.dataList }
  // }


  componentDidUpdate = (prevProps, prevState) => {
    if (this.props.dataList !== prevProps.dataList) {
      this.setState({ dataList: prevProps.dataList }, () => {
        this.setAllAccountIds()
      })
    }
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


  actionCellRenderer = ({ rowData, columnIndex, key, parent, rowIndex, style }) => {
    return (
      <div className="icon-action">
        <a href="javascript:void(0)" onClick={() => this.openDeleteAccount(rowData.id)} className="mrL10"><i className="fa fa-trash-o"></i></a>
      </div>
    );
  };


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

  handleCheckbox = (account, isChecked) => {
    const selecteAccountId = cloneDeep(this.state.selecteAccountId)
    if (isChecked) {
      const newAccount = pull(selecteAccountId, account)
      this.setState({ selecteAccountId: newAccount })
    } else {
      selecteAccountId.push(account)
      this.setState({ selecteAccountId: selecteAccountId })
    }
  };

  checkBoxCellRenderer = ({ rowData }) => {
    const isChecked = this.state.selecteAccountId.indexOf(rowData.id) > -1
    return (
      <div>
        <Checkbox
          checked={isChecked}
          onChange={() => this.handleCheckbox(rowData.id, isChecked)}
          value="checkedA"
          className="mt-checkbox checkbox-success"
        />
      </div>
    );
  };

  headerRenderer = ({ dataKey, label, sortBy, sortDirection }) => {
    const { isAllAccountSelect } = this.state
    return (
      <div className="table-td">
        {dataKey === 'checkbox' &&
          <Checkbox
            checked={isAllAccountSelect}
            className="mt-checkbox white-checkbox"
            onChange={() => this.allCheckBoxEvent()}
          />}
        {dataKey !== 'checkbox' && label}
        {sortBy === dataKey && <SortIndicator sortDirection={sortDirection} />}
      </div>
    );
  }


  // --------------- Table helper method End---------------


  // --------------- Custom method logic start---------------

  statusChangeDialog = (rowIndex, currentStatus, selecteAccountId) => {
    this.setState({  openStatusDialog: true, rowIndex, currentStatus, selecteAccountId: [selecteAccountId] });
  }

  multiStatusChangeDialog = (currentStatus) => {
    this.setState({ openSelectDialog: true,currentStatus });
  }

  handleDialogClose = () => {
    this.setState({ openDialog: false, openStatusDialog: false, openSelectDialog: false })
  }

  openDeleteAccount = (selecteAccountId) => {
    this.setState({ openDialog: true, selecteAccountId: [selecteAccountId] })
  }

  deleteAccount = () => {
    this.handleDialogClose();
    this.setState({ isProgress: true })
    let payload = {
      account_ids: this.state.selecteAccountId
    }
    this.props.actions.deleteAwsAccount(payload).
      then(result => {
        if (this._mounted) {
          if (result.success) {
            this.setState({ message: result.message, showSnackbarState: true, variant: 'success' });
            const message = { message: result.message, showSnackbarState: true, variant: 'success' }
            this.props.showMessage(message)
            const reloadSearchBar = { flag: true }
            this.props.setReloadFlagSearchBar(reloadSearchBar)
            this.handleDialogClose()
            this.props.toggleDrawer(false)
          } else {
            this.setState({ message: result, showSnackbarState: true, variant: 'error' });
          }
        }
        this.setState({ isProgress: false })
      });
  }


  enableDisableAccount = () => {
    /* this.handleDialogClose();
    let payload = {
      account_ids: this.state.selecteAccountId
    }
    this.setState({ isProgress: true,isAllAccountSelect:false,selecteAccountId:[] })
    if (this.state.currentStatus === 'active') {
      this.props.actions.disableAccount(payload).
        then(result => {
          if (this._mounted) {
            if (result.success) {
              this.setState({ message: result.message, showSnackbarState: true, variant: 'success' });
              const reloadSearchBar = { flag: true }
              this.props.setReloadFlagSearchBar(reloadSearchBar)
              this.resetDataList()
            } else {
              this.setState({ message: result, showSnackbarState: true, variant: 'error' });
            }
          }
          this.setState({ isProgress: false })
        });
    } else {
      this.props.actions.enableAccount(payload).
        then(result => {
          if (this._mounted) {
            if (result.success) {
              this.setState({ message: result.message, showSnackbarState: true, variant: 'success' });
              const reloadSearchBar = { flag: true }
              this.props.setReloadFlagSearchBar(reloadSearchBar)
              this.resetDataList()
            } else {
              this.setState({ message: result, showSnackbarState: true, variant: 'error' })
            }
          }
          this.setState({ isProgress: false })
        });
    } */
  }

  handleClose = () => {
    this.setState({ message: '', showSnackbarState: false });
  }

  resetDataList = () => {
    const dataList = cloneDeep(this.state.dataList)
    let newDataList = dataList.map((row, sidx) => {
      if (this.state.rowIndex !== sidx) {
        return row;
      } else {
        const currentStatus = this.state.currentStatus;
        return { ...row, status: currentStatus === 'active' ? 'inactive' : 'active' };
      }
    });
    this.setState({ dataList: newDataList }, () => {
    });
  }

  allCheckBoxEvent = () => {
    if (this.state.isAllAccountSelect) {
      this.setState({ selecteAccountId: [] })
    } else {
      const allAccountIds = cloneDeep(this.state.allAccountIds)
      this.setState({ selecteAccountId: allAccountIds })
    }

    this.setState(prevState => ({
      isAllAccountSelect: !prevState.isAllAccountSelect
    }));

  }

  // --------------- Custom method logic End---------------

  render() {
    const {
      headerHeight,
      height,
      sortBy,
      sortDirection,
      dataList,
      openDialog,
      openStatusDialog,
      openSelectDialog,
      isProgress,
      selecteAccountId,
      currentStatus,
      variant, message, showSnackbarState
    } = this.state;

    const sortedList = dataList;

    const multipleStatusChangeMsgContent = currentStatus === 'active' ? 'Are you sure you want to disable selected accounts ?' : 'Are you sure you want to enable selected accounts ?'
    return (
      <div className="container sidebar-container">
        <div className="sidebar-header">
          <h4>Accounts - {dataList.length}</h4>
          <span onClick={() => this.props.toggleDrawer(false)} className="sidebar-close-icon"><i className="fa fa-times-circle" aria-hidden="true"></i> Exit</span>
          <div className="clearfix"></div>
        </div>
        <div
          tabIndex={0}
          role="button"
          className="sidebar-body container"
        >
          <div className="text-right mrB10">
            <Button
              variant="contained"
              className="btn btn-success btn-sm-success mrR10"
              onClick={() => this.multiStatusChangeDialog('inactive')}
              disabled={selecteAccountId.length === 0}
            >
              Enable
            </Button>
            <Button
              variant="contained"
              className="btn btn-red"
              onClick={() => this.multiStatusChangeDialog('active')}
              disabled={selecteAccountId.length === 0}
            >
              Disable
            </Button>
          </div>
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
                        dataKey="checkbox"
                        label=""
                        headerRenderer={this.headerRenderer}
                        cellRenderer={this.checkBoxCellRenderer}
                        disableSort={true}
                        width={50}
                        flexGrow={3}
                      />

                      <Column
                        dataKey="sno"
                        label="S.No."
                        headerRenderer={headerRenderer}
                        disableSort={!this.isSortEnabled}
                        cellRenderer={sNoCellRenderer}
                        width={40}
                        flexGrow={1}

                      />

                      {/* <Column
                      dataKey="id"
                      label="Account Id"
                      headerRenderer={headerRenderer}
                      disableSort={!this.isSortEnabled}
                      width={300}
                      flexGrow={2}

                    /> */}

                      <Column
                        dataKey="account_name"
                        label="Account Name"
                        headerRenderer={headerRenderer}
                        disableSort={!this.isSortEnabled}
                        width={100}
                        flexGrow={2}

                      />
                      <Column
                        dataKey="role_arn"
                        label="Arn"
                        headerRenderer={headerRenderer}
                        disableSort={true}
                        width={350}
                        flexGrow={3}
                      />

                      <Column
                        dataKey="status"
                        label="Status"
                        headerRenderer={headerRenderer}
                        cellRenderer={this.statusCellRenderer}
                        disableSort={true}
                        width={100}
                        flexGrow={4}
                      />

                      <Column
                        dataKey="action"
                        label="Action"
                        headerRenderer={headerRenderer}
                        cellRenderer={this.actionCellRenderer}
                        disableSort={true}
                        width={100}
                        flexGrow={5}
                      />
                    </Table>
                  )}
                </InfiniteLoader>
              )}
            </AutoSizer>
          </div>

          {isProgress && <Loader />}

          <ConfirmDialogBoxHOC isOpen={openDialog} handleDialogClose={this.handleDialogClose} title={'Confirmation'} content={'Are you sure you want to delete this account ? All information will be completely destroyed.'} successDialogEvent={this.deleteAccount} />

          <ConfirmDialogBoxHOC isOpen={openStatusDialog} handleDialogClose={this.handleDialogClose} title={'Confirmation'} content={currentStatus === 'active' ? 'Are you sure you want to disable this account ?' : 'Are you sure you want to enable this account ?'} successDialogEvent={this.enableDisableAccount} />

          <ConfirmDialogBoxHOC
            isOpen={openSelectDialog}
            handleDialogClose={this.handleDialogClose}
            title={'Confirmation'}
            content={multipleStatusChangeMsgContent}
            successDialogEvent={this.enableDisableAccount}
          />
          <SnackbarMessage
            open={showSnackbarState}
            message={message}
            variant={variant}
            handleClose={this.handleClose}
          />

        </div>
      </div>
    );
  }
}


const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(Object.assign({}, integrationActions, schedulerSettingActions), dispatch),
    showMessage: message => {
      dispatch(showMessage(message))
    }, setProgressBar: isProgress => {
      dispatch(setProgressBar(isProgress))
    }, setReloadFlagSearchBar: reloadSearchBar => {
      dispatch(setReloadFlagSearchBar(reloadSearchBar))
    }
  };
}

export default withRouter(connect(null, mapDispatchToProps)(AccountListSideBar))