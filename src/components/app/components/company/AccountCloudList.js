/*
 * @Author: Virendra Patidar 
 * @Date: 2018-11-19 16:29:33 
 * @Last Modified by: Virendra Patidar
 * @Last Modified time: 2019-01-28 12:27:53
 */
import React, { PureComponent } from "react"

import Checkbox from '@material-ui/core/Checkbox'
import Switch from '@material-ui/core/Switch'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import Chip from '@material-ui/core/Chip'

import {
  Table,
  Column,
  SortDirection,
  InfiniteLoader,
  SortIndicator
} from "react-virtualized"
import AutoSizer from "react-virtualized/dist/commonjs/AutoSizer"

import { dateCellRenderer } from 'TableHelper/cellRenderer'

import { cloneDeep } from "lodash"

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { debounce, pull } from "lodash"

import history from 'customHistory'

import * as accountMgmtActions from 'actions/accountMgmtAction'
import { showMessage } from 'actions/messageAction'
import { setProgressBar } from 'actions/commonAction'
import * as integrationActions from 'actions/integrationAction'

import Loader from 'global/Loader'
import SearchField from 'global/SearchField'
import ConfirmDialogBoxHOC from 'hoc/DialogBox'

class AccountCloudList extends PureComponent {

  _mounted = false

  //Debounce due to search
  fetchAccountList = debounce(this.fetchAccountList, 500);

  state = {
    //Table UI attribute
    headerHeight: 40,
    rowHeight: 70,
    rowCount: 0,
    height: 450,

    //Table pagination attribute
    sortBy: "name",
    pageNo: 0,
    sortDirection: SortDirection.ASC,
    count: 10,
    perPage: 50,
    dataList: [],
    search: '',
    isMoreRecord: false,
    filterProgress: false,
    companyId: '',
    openStatusDialog: false,
    accountId: 0,
    currentStatus: '',
    selectAccounts: [],
    openSelectDialog: false,
    status: '',
    isAllServiceSelect: false,
    allAccounts: [],
    openDeleteDialog: false
  }

  componentDidMount() {
    this._mounted = true
    this.props.setProgressBar(true)
    this.fetchAccountList()
  }

  componentWillUnmount() {
    this._mounted = false
  }


  //  ------------------- API Call start----------------------
  fetchAccountList() {

    const payload = {
      "sort": this.state.sortDirection === SortDirection.ASC,
      "search": this.state.search,
      "page": this.state.pageNo,
      "sort_by": this.state.sortBy,
      "company": this.props.location.state.id
    }
    this.props.actions.fetchAccountList(payload).
      then(result => {
        if (this._mounted) {
          if (result.success) {

            let allAccounts = []
            result.data.map((account, index) => {
              allAccounts.push(account.account_id)
            })

            this.setState({ allAccounts, filterProgress: false, dataList: this.state.dataList.concat(result.data), isMoreRecord: result.data.length >= this.state.perPage }, () => {
              this.props.setProgressBar(false)
            })
          } else {
            let message = { message: result, showSnackbarState: true, variant: 'error' }
            this.props.showMessage(message)
          }
        }
      });
  }

  enableDisableAccount = () => {
    this.handleDialogClose();
    this.setState({ isProgress: true })
    let payload = {
      account_ids: this.state.selectAccounts,
    }

    if (this.state.currentStatus) {
      this.props.actions.disableAccountByAdmin(payload).
        then(result => {
          if (this._mounted) {
            if (result.success) {
              this.props.showMessage({ message: result.message, showSnackbarState: true, variant: 'success' });
              this.setState({pageNo:1,dataList:[],selectAccounts:[],isAllServiceSelect:false},()=>{
                this.fetchAccountList()
              })
            } else {
              if (typeof result === 'string') {
                this.props.showMessage({ message: result, showSnackbarState: true, variant: 'error' });
              }
            }
          }
          this.setState({ isProgress: false })
        });
    } else {
      this.props.actions.enableAccountByAdmin(payload).
        then(result => {
          if (this._mounted) {
            if (result.success) {
              this.props.showMessage({ message: result.message, showSnackbarState: true, variant: 'success' });
              this.setState({pageNo:1,dataList:[],selectAccounts:[],isAllServiceSelect:false},()=>{
                this.fetchAccountList()
              })
            } else {
              if (typeof result === 'string') {
              this.props.showMessage({ message: result, showSnackbarState: true, variant: 'error' })
              }
            }
          }
          this.setState({ isProgress: false })
        });
    }
  }


  deleteAccount = () => {
    this.handleDialogClose();
    this.props.setProgressBar(true);
    let payload = {
      account_id: this.state.selectAccounts
    }
    this.props.actions.deleteAwsAccount(payload).
      then(result => {
        if (this._mounted) {
          if (result.success) {
            let message = { message: result.message, showSnackbarState: true, variant: 'success' }
            this.props.showMessage(message)
            this.setState({pageNo:1,dataList:[],selectAccounts:[],isAllServiceSelect:false},()=>{
              this.fetchAccountList()
            })
          } else {
            if (typeof result === 'string') {
              let message = { message: result, showSnackbarState: true, variant: 'error' }
              this.props.showMessage(message)
            }
          }
        }
        this.props.setProgressBar(false);
      });
  }



  //  ------------------- API Call END----------------------

  // ----------------------- Table helper method START ----------------------------- 

  _isRowLoaded = ({ index }) => {
    return !!this.state.dataList[index];
  }

  _rowGetter = ({ index }) => {
    return this.state.dataList[index];
  }

  _loadMoreRows = ({ startIndex, stopIndex }) => {
    this.fetchAccountList()
  }

  isSortEnabled = () => {
    const list = this.state.dataList;
    const rowCount = this.state.rowCount;
    return rowCount <= list.length;
  }

  sort = ({ sortBy, sortDirection }) => {
    this.setState({ sortBy, sortDirection, pageNo: 0, dataList: [], filterProgress: true }, () => {
      this.fetchAccountList()
    });
  }

  noRowsRenderer = () => {
    if (!this.state.filterProgress) {
      return (<div className="data-not-found">
        <span>Record Not Found</span>
      </div>)
    } else if (this.state.filterProgress) {
      return <Loader />
    }
  }

  majorIssueRenderer = ({ rowData }) => {
    return (
      <div>
        <span className="issue-wrapper wrapper-success">{rowData.major_security_issues.pass}</span>
        <span className="issue-wrapper wrapper-danger">{rowData.major_security_issues.fail}</span>
        <span className="issue-wrapper wrapper-gray">{rowData.major_security_issues.error}</span>
      </div>
    );
  };

  scrollEvent = ({ clientHeight, scrollHeight, scrollTop }) => {
    if (this.state.isMoreRecord && scrollTop > 0 && clientHeight > 0) {
      this.setState({ pageNo: this.state.pageNo + 1 }, () => {
        this.fetchAccountList()
      });
    }
  }

  accountTypeCellRenderer = ({ cellData }) => {
    return (<div className="acc-icon">
      {/* <img src="/assets/images/aws.png" width="30" /> */}
      <a href="javascript:void(0)" onClick={() => history.push({ pathname: '/app/users', state: { companyId: this.props.location.state.id, name: this.props.location.state.name } })}> {cellData}</a>
    </div>
    )
  }

  statusCellRenderer = ({ rowData, cellData, rowIndex }) => {
    let boxClass = ["switch-green"];
    if (cellData === undefined || cellData === true || cellData === null) {
      boxClass.push('active');
    }
    return (
      <div>
        <Switch className={boxClass.join(' ')} checked={cellData === undefined || cellData === null || cellData === true ? true : false} onChange={() => this.statusChangeDialog(rowIndex, cellData, rowData.account_id)} />
      </div>
    );
  };


  checkBoxCellRenderer = ({ rowData }) => {
    const isChecked = this.state.selectAccounts.indexOf(rowData.account_id) > -1
    return (
      <div>
        <Checkbox
          checked={isChecked}
          onChange={() => this.handleCheckbox(rowData.account_id, isChecked)}
          value="checkedA"
          className="mt-checkbox checkbox-success"
        />
      </div>
    );
  };


  headerRenderer = ({ dataKey, label, sortBy, sortDirection }) => {
    const { isAllServiceSelect } = this.state
    return (
      <div className="table-td">
        {dataKey === 'checkbox' &&
          <Checkbox
            checked={isAllServiceSelect}
            className="mt-checkbox white-checkbox"
            onChange={() => this.allCheckBoxEvent()}
          />}
        {dataKey !== 'checkbox' && label}
        {sortBy === dataKey && <SortIndicator sortDirection={sortDirection} />}
      </div>
    );
  }

  // ----------------------- Table helper method END -----------------------------*

  // ----------------------- Custom logic method START -----------------------------*



  handleCheckbox = (newAccount, isChecked) => {
    const selectAccounts = cloneDeep(this.state.selectAccounts)
    if (isChecked) {
      const newAccounts = pull(selectAccounts, newAccount)
      this.setState({ selectAccounts: newAccounts })
    } else {
      selectAccounts.push(newAccount)
      this.setState({ selectAccounts: selectAccounts })
    }
  };


  allCheckBoxEvent = () => {
    if (this.state.isAllServiceSelect) {
      this.setState({ selectAccounts: [] })
    } else {
      const allAccounts = cloneDeep(this.state.allAccounts)
      this.setState({ selectAccounts: allAccounts })
    }

    this.setState(prevState => ({
      isAllServiceSelect: !prevState.isAllServiceSelect
    }));
  }

  handleSelectBox = name => event => {
    this.setState({ pageNo: 0, search: event.target.value, dataList: [], filterProgress: true, isMoreRecord: true }, () => {
      this.fetchAccountList()
    });
  };

  statusChangeDialog = (rowIndex, currentStatus, accountId) => {
    this.setState({ openStatusDialog: true, rowIndex, currentStatus, selectAccounts:[accountId] });
  }

  handleDialogClose = () => {
    this.setState({ openStatusDialog: false, openSelectDialog: false, openDeleteDialog: false })
  }

  resetDataList = () => {
    const dataList = cloneDeep(this.state.dataList)
    let newDataList = dataList.map((row, sidx) => {
      if (this.state.accountId !== row.account_id) {
        return row;
      } else {
        const currentStatus = this.state.currentStatus;
        return { ...row, status: !currentStatus };
      }
    });
    this.setState({ dataList: newDataList }, () => {
    });
  }


  selectStatusChangeDialog = (currentStatus) => {
    this.setState({ openSelectDialog: true, currentStatus });
  }

  deleteAccounts = () => {
    this.setState({ openDeleteDialog: true });
  }


  // ----------------------- Custom logic method END -----------------------------*
  render() {
    const {
      headerHeight,
      height,
      rowHeight,
      sortBy,
      sortDirection,
      dataList,
      openStatusDialog,
      currentStatus,
      selectAccounts,
      openSelectDialog,
      openDeleteDialog
    } = this.state;

    const sortedList = dataList;
    const name = this.props.location.state ? this.props.location.state.name : ''

    const enableDisableDialogContent=currentStatus? 'Are you sure you want to disable selected accounts ?':'Are you sure you want to enable selected accounts ?'

    return (
      <div className="table-caption container-cloud page-wrapper">
        <Grid container spacing={24}>
          <Grid item sm={2}>
            <h3 className="mr0 main-heading">Account Clouds</h3>
          </Grid>
          <Grid item sm={10}>
            <Grid container spacing={24}>

              <Grid item sm={9} className="text-right pdR0">
                <Chip className="white-chip" label={name} />
                <Button
                  className="btn btn-primary mrR10"
                  variant="contained"
                  color="primary"
                  onClick={() => history.push('/app/companies')}
                >
                  <i className="fa fa-arrow-left mrR5"></i> Back
                </Button>
                <Button
                  variant="contained"
                  className="btn btn-success btn-sm-success mrR10"
                  onClick={() => this.selectStatusChangeDialog(false)}
                  disabled={selectAccounts.length === 0}
                >
                  Enable
                </Button>
                <Button
                  variant="contained"
                  className="btn btn-red mrR10"
                  onClick={() => this.selectStatusChangeDialog(true)}
                  disabled={selectAccounts.length === 0}
                >
                  Disable
                </Button>

                <Button
                  variant="contained"
                  className="btn btn-red"
                  onClick={() => this.deleteAccounts()}
                  disabled={selectAccounts.length === 0}
                >
                  Delete
                </Button>
              </Grid>
              
              <Grid item sm={3}>
                <SearchField handleChange={this.handleSelectBox} />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid container spacing={24} className="grid-container">
          <Grid item sm={12} className="pdB10">
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
                        headerHeight={39}
                        height={height}
                        sortBy={sortBy}
                        sort={this.sort}
                        sortDirection={sortDirection}
                        rowCount={dataList.length}
                        rowGetter={this._rowGetter}
                        rowHeight={rowHeight}
                        width={width}
                        onRowsRendered={onRowsRendered}
                        noRowsRenderer={this.noRowsRenderer}
                        onScroll={this.scrollEvent}
                        className='data-table table-account'
                      >

                        <Column
                          dataKey="checkbox"
                          label=""
                          headerRenderer={this.headerRenderer}
                          cellRenderer={this.checkBoxCellRenderer}
                          disableSort={true}
                          width={10}
                          flexGrow={1}
                        />


                        <Column
                          dataKey="type"
                          label="Account Type"
                          headerRenderer={this.headerRenderer}
                          cellRenderer={this.accountTypeCellRenderer}
                          disableSort={false}
                          width={150}
                          flexGrow={2}
                        />

                        <Column
                          dataKey="name"
                          label="Name"
                          headerRenderer={this.headerRenderer}
                          disableSort={false}
                          width={80}
                          flexGrow={3}
                        />

                        <Column
                          dataKey="majorIssue"
                          label="Major Security Issues"
                          headerRenderer={this.headerRenderer}
                          cellRenderer={this.majorIssueRenderer}
                          disableSort={true}
                          width={250}
                          flexGrow={5}
                        />
                        <Column
                          dataKey="creation_date"
                          label="Creation Date"
                          headerRenderer={this.headerRenderer}
                          cellRenderer={dateCellRenderer}
                          disableSort={false}
                          width={120}
                          flexGrow={6}
                        />

                        <Column
                          dataKey="no_of_assets_pulled"
                          label="No of assets pulled"
                          headerRenderer={this.headerRenderer}
                          disableSort={true}
                          width={120}
                          flexGrow={7}
                        />

                        <Column
                          dataKey="no_of_risk management"
                          label="No of risk management"
                          headerRenderer={this.headerRenderer}
                          disableSort={true}
                          width={120}
                          flexGrow={8}
                        />

                        <Column
                          dataKey="no_of_current_high"
                          label="No of current high"
                          headerRenderer={this.headerRenderer}
                          disableSort={true}
                          width={150}
                          flexGrow={9}
                        />
                        <Column
                          dataKey="status"
                          label="Status"
                          headerRenderer={this.headerRenderer}
                          cellRenderer={this.statusCellRenderer}
                          disableSort={true}
                          width={50}
                          flexGrow={10}
                        />

                      </Table>
                    )}
                  </InfiniteLoader>
                )}
              </AutoSizer>

            </div>
          </Grid>
        </Grid>

        <ConfirmDialogBoxHOC
          isOpen={openStatusDialog}
          handleDialogClose={this.handleDialogClose}
          title={'Confirmation'}
          content={currentStatus === 'active' ? 'Are you sure you want to disable this account ?' : 'Are you sure you want to enable this account ?'}
          successDialogEvent={this.enableDisableAccount} />

        <ConfirmDialogBoxHOC
          isOpen={openSelectDialog}
          handleDialogClose={this.handleDialogClose}
          title={'Confirmation'}
          content={enableDisableDialogContent}
          successDialogEvent={this.enableDisableAccount}
        />

        <ConfirmDialogBoxHOC
          isOpen={openDeleteDialog}
          handleDialogClose={this.handleDialogClose}
          title={'Confirmation'}
          content={'Are you sure you want to delete selected account ? All information will be completely destroyed.'}
          successDialogEvent={this.deleteAccount}
        />


      </div>
    );
  }
}


const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(Object.assign({}, accountMgmtActions, integrationActions), dispatch),
    showMessage: message => {
      dispatch(showMessage(message))
    }, setProgressBar: isProgress => {
      dispatch(setProgressBar(isProgress))
    }
  };
}

export default withRouter((connect(null, mapDispatchToProps)(AccountCloudList)));
