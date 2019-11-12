/*
 * @Author: Virendra Patidar 
 * @Date: 2018-11-19 16:29:33 
 * @Last Modified by: Virendra Patidar
 * @Last Modified time: 2019-04-23 16:30:53
 */
import React, { PureComponent } from "react"

import Switch from '@material-ui/core/Switch'
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'

import {
  Table,
  Column,
  SortDirection,
  InfiniteLoader
} from "react-virtualized";
import AutoSizer from "react-virtualized/dist/commonjs/AutoSizer"
import DatePicker from "react-datepicker"

import { headerRenderer, dateCellRenderer } from 'TableHelper/cellRenderer'

import ConfirmDialogBoxHOC from 'hoc/DialogBox'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { sumBy, debounce } from "lodash"

import history from 'customHistory'

import * as companyMgmtActions from 'actions/companyMgmtAction'

import { showMessage } from 'actions/messageAction'
import { setProgressBar } from 'actions/commonAction'
import {setLoginAsCompanyDetails} from 'actions/userAction'
import { setActiveMenu } from 'actions/commonAction'
import {resetHeaderFilterData} from 'actions/loginAction'
import {checkIsTailPeriodFinishedAndNotSubsribed} from 'actions/subscriptionsAction'

import Loader from 'global/Loader'
import SearchField from 'global/SearchField'

import moment from 'moment'

class CompanyList extends PureComponent {

  _mounted = false

  //Debounce due to search
  fetchCompanyList = debounce(this.fetchCompanyList, 500);

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
    totalCount: 0,
    dataList: [],
    search: '',
    isMoreRecord: false,
    filterProgress: false,
    isRequestForData: false,

    openConfirmDialog: false,
    openPermanentDialog: false,
    openDatePicker: false,
    openConfirmLoginDialog: false,
    companyId: '',
    company:{},
    isPermanent: false,
    currentStatus: true,
    expiryDate: new Date()

  };

  componentDidMount() {
    this._mounted = true
    this.props.setProgressBar(true)
    this.setState({ totalCount: this.props.companyCount })
    this.fetchCompanyList()
  }

  componentWillUnmount() {
    this._mounted = false
  }


  // static getDerivedStateFromProps(nextProps, state) {
  //   return { companyCount: nextProps.companyCount }
  // }


  componentDidUpdate = (prevProps, prevState) => {
    this.setState({ totalCount: prevProps.companyCount })
  }


  //  ------------------- API Call start----------------------
  fetchCompanyList() {

    this.setState({ isRequestForData: true })

    const payload = {
      "sort": this.state.sortDirection === SortDirection.ASC,
      "search": this.state.search,
      "page": this.state.pageNo,
      "sort_by": this.state.sortBy
    }
    this.props.actions.fetchCompanyList(payload).
      then(result => {
        if (this._mounted) {
          if (result.success) {
            this.setState({ isRequestForData: false, filterProgress: false, dataList: this.state.dataList.concat(result.data), isMoreRecord: result.data.length >= this.state.perPage }, () => {
              this.props.setProgressBar(false)
            })
          } else {
            this.setState({ isRequestForData: false })
            let message = { message: result, showSnackbarState: true, variant: 'error' }
            this.props.showMessage(message)
          }
        }
      });
  }

  companyStatusChange = () => {
    this.handleCloseDialog()
    this.props.setProgressBar(true)
    const payload = {
      "status": this.state.currentStatus === 'Stopped' ? true : false,
      "company": this.state.companyId
    }

    this.props.actions.toggleCompanyStatus(payload).
      then(result => {
        if (this._mounted) {
          if (result.success) {
            let message = { message: result.message, showSnackbarState: true, variant: 'success' }
            this.props.showMessage(message)
            const newDataList = this.state.dataList.map((row, sidx) => {
              if (this.state.companyId !== row.id) {
                return row;
              } else {
                const currentStatus = row.status === 'Stopped' ? 'Running' : 'Stopped';
                return { ...row, status: currentStatus };
              }
            });
            this.setState({ dataList: newDataList, companyId: '' })

          } else {
            let message = { message: result, showSnackbarState: true, variant: 'error' }
            this.props.showMessage(message)
          }
          this.props.setProgressBar(false)
        }
      });
  }

  extendCompanyExpiryDate = () => {
    const payload = {
      "expiry_date": moment(this.state.expiryDate).format("YYYY-MM-DD"),
      "company": this.state.companyId
    }

    this.props.actions.extendCompanyExpiryDate(payload).
      then(result => {
        if (this._mounted) {
          this.handleCloseDialog()
          if (result.success) {
            let message = { message: result.message, showSnackbarState: true, variant: 'success' }
            this.props.showMessage(message)

          } else {
            let message = { message: result, showSnackbarState: true, variant: 'error', }
            this.props.showMessage(message)
          }
          this.props.setProgressBar(false)
        }
      });
  }

  permanentStatusChange = () => {
    this.handleCloseDialog()
    this.props.setProgressBar(true)
    const payload = {
      "permanent": !this.state.isPermanent,
      "company": this.state.companyId
    }

    this.props.actions.toggleCompanyPermanent(payload).
      then(result => {
        if (this._mounted) {
          if (result.success) {
            let message = { message: result.message, showSnackbarState: true, variant: 'success' }
            this.props.showMessage(message)

            const newDataList = this.state.dataList.map((row, sidx) => {
              if (this.state.companyId !== row.id) {
                return row;
              } else {
                const currentStatus = row.is_permanent;
                return { ...row, is_permanent: !currentStatus };
              }
            });
            this.setState({ dataList: newDataList, companyId: '' })

          } else {
            let message = { message: result, showSnackbarState: true, variant: 'error' }
            this.props.showMessage(message)
          }
          this.props.setProgressBar(false)
        }
      });
  }


  loginAsInCompany = () => {

    const {company}=this.state
    const payload = {
      "company": company.id
    }

    this.props.actions.loginAsInCompany(payload).
      then(result => {
        if (this._mounted) {
          this.handleCloseDialog()
          if (result.success) {
            this.props.setProgressBar(true)
            const loginAsDetails={isLoginAs:true,company:company}
            this.props.setLoginAsCompanyDetails(loginAsDetails)
            this.props.resetHeaderFilterData()
            this.props.setActiveMenu('Dashboard')
            this.props.checkIsTailPeriodFinishedAndNotSubsribed()
            history.push(`/app/dashboard/home`)
          } else {
            let message = { message: result, showSnackbarState: true, variant: 'error', }
            this.props.showMessage(message)
            this.props.setProgressBar(false)
          }
       
        }
      });
  }


  //  ------------------- API Call END----------------------

  // ----------------------- Table helper method START ----------------------------- 

  _isRowLoaded = ({ index }) => {
    return !!this.state.dataList[index];
  }


  isActiveCellRenderer = ({ rowData, cellData, index, status }) => {
    let boxClass = ["switch-green"];
    if (cellData === undefined || cellData !== 'Stopped') {
      boxClass.push('active');
    }
    return (
      <div className="action-icon">
        <Switch className={boxClass.join(' ')} checked={cellData === undefined || cellData !== 'Stopped'} onChange={() => this.companyStatusChangeDialog(index, rowData.id, cellData)} />
      </div>
    );
  };

  isPermanentCellRenderer = ({ rowData, cellData, index, status }) => {
    let boxClass = ["switch-green"];
    if (cellData === undefined || cellData !== false) {
      boxClass.push('active');
    }
    return (
      <div className="action-icon">
        <Switch className={boxClass.join(' ')} checked={cellData === undefined || cellData !== false} onChange={() => this.isPermanentDialog(index, rowData.id, cellData)} />
      </div>
    );
  };

  extendDateCellRenderer = ({ rowData, cellData, index, status }) => {
    return (
      <div className="action-icon">
        {rowData.is_permanent === true ? '-' : <a href="javascript:void(0)" disabled={rowData.is_permanent} onClick={() => this.handleOpenDatePicker(rowData.id, cellData)} className="mrR10" ><i className="fa fa-calendar"></i></a>}
      </div>
    );
  };


  companyNameRenderer = () => {
    return (
      <div className="cmny-logo">
        <img alt="Company Logo" src="/assets/images/clogo.png" className="img-responsive" />
      </div>
    );
  };


  _rowGetter = ({ index }) => {
    return this.state.dataList[index];
  }


  loginAsCellRenderer = ({ rowData }) => {
    return (
      <div>
        <a href="javascript:void(0)" className="fnt-20" onClick={() => this.loginStatusChangeDialog(rowData)}>
          <i className="fa fa-sign-in"></i>
        </a>
      </div>
    );
  }

  _loadMoreRows = ({ startIndex, stopIndex }) => {
    // this.fetchCompanyList()
  }

  isSortEnabled = () => {
    const list = this.state.dataList;
    const rowCount = this.state.rowCount;
    return rowCount <= list.length;
  }

  sort = ({ sortBy, sortDirection }) => {
    this.setState({ sortBy, sortDirection, pageNo: 0, dataList: [], filterProgress: true }, () => {
      this.fetchCompanyList()
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

  accountCloudRenderer = ({ rowData, cellData }) => {
    return (
      <div>
        <a href="javascript:void(0)" onClick={() =>
          history.push({
            pathname: '/app/companies/cloud',
            state: { id: rowData.id, name: rowData.name }
          })
        }>
          {cellData}
        </a>
      </div>
    )
  }
  companyNameCellRenderer = (rowIndex) => {
    return (
      <div className="cmny-logo">
        <a href="javascript:void(0)" onClick={() => toggleDrawerWithAnimation(rowIndex)}>
          <img alt="Company Logo" src="/assets/images/clogo.png" className="img-responsive" />
        </a>
      </div>
    );
  }

  scrollEvent = ({ clientHeight, scrollHeight, scrollTop }) => {
    if (this.state.isMoreRecord && scrollTop > 0 && clientHeight > 0 && !this.state.isRequestForData) {
      const totalPages = Math.floor(this.state.totalCount / this.state.perPage)
      if (this.state.pageNo <= totalPages) {
        this.setState({ pageNo: this.state.pageNo + 1, isRequestForData: true }, () => {
          this.fetchCompanyList()
        });
      }
    }
  }

  // ----------------------- Table helper method END -----------------------------*

  // ----------------------- Custom logic method START -----------------------------*
  companyStatusChangeDialog = (index, companyId, currentStatus) => {
    this.setState({ openConfirmDialog: true, index, companyId, currentStatus });
  }

  isPermanentDialog = (index, companyId, isPermanent) => {
    this.setState({ openPermanentDialog: true, index, companyId, isPermanent });
  }

  loginStatusChangeDialog = (company) => {
    this.setState({ openConfirmLoginDialog: true, company });
  }

  handleOpenDatePicker = (companyId, expiryDate) => {
    this.setState({ openDatePicker: true, companyId, expiryDate: expiryDate !== null ? new Date(expiryDate) : this.state.expiryDate });
  };

  handleCloseDialog = () => {
    this.setState({ openConfirmDialog: false, openConfirmLoginDialog: false, openDatePicker: false, openPermanentDialog: false, });
  }

  dateChangeHandler = (d) => {
    this.setState({ expiryDate: d });
  }

  handleSelectBox = name => event => {
    this.setState({ pageNo: 0, search: event.target.value, dataList: [], filterProgress: true, isMoreRecord: true }, () => {
      this.fetchCompanyList()
    });
  };

  // ----------------------- Custom logic method END -----------------------------*
  render() {
    const {
      rowHeight,
      sortBy,
      sortDirection,
      dataList,
      openConfirmDialog,
      openConfirmLoginDialog,
      openPermanentDialog,
      openDatePicker,
      currentStatus,
      expiryDate,
      isPermanent,
    } = this.state;


    const sortedList = dataList;
    const companyStatusContent = 'Are you sure you want to ' + (currentStatus === 'Running' ? 'disable ' : 'enable ') + 'this Company ?'
    const permanentStatusChange = !isPermanent ? 'Are you sure want to make this Company permanent ?' : 'Are you sure want to remove this Company from permanent ?'
    return (
      <div className="table-caption container page-wrapper">
        <Grid container spacing={24} className="container-search mrB5">
          <Grid item sm={12} className="">
            <SearchField handleChange={this.handleSelectBox} />
          </Grid>
        </Grid>
        <Grid container spacing={24} className="container">
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
                          dataKey="name"
                          label="Company Name"
                          headerRenderer={headerRenderer}
                          // cellRenderer={this.companyNameCellRenderer}
                          disableSort={false}
                          width={300}
                          flexGrow={2}
                        />

                        <Column
                          dataKey="accounts"
                          label="Total Accounts"
                          headerRenderer={headerRenderer}
                          cellRenderer={this.accountCloudRenderer}
                          disableSort={false}
                          width={100}
                          flexGrow={3}
                        />

                        <Column
                          dataKey="since"
                          label="Activate Since"
                          headerRenderer={headerRenderer}
                          cellRenderer={dateCellRenderer}
                          disableSort={false}
                          width={200}
                          flexGrow={5}
                        />
                        <Column
                          dataKey="status"
                          label="Status"
                          headerRenderer={headerRenderer}
                          disableSort={false}
                          width={100}
                          flexGrow={6}
                        />
                        <Column
                          dataKey="loginAs"
                          label="login As"
                          headerRenderer={headerRenderer}
                          cellRenderer={this.loginAsCellRenderer}
                          disableSort={true}
                          width={40}
                          flexGrow={7}
                        />

                        <Column
                          dataKey="expire_date"
                          label="Extend Date"
                          headerRenderer={headerRenderer}
                          cellRenderer={this.extendDateCellRenderer}
                          disableSort={true}
                          width={100}
                          flexGrow={8}
                        />

                        <Column
                          dataKey="is_permanent"
                          label="Is Permanent"
                          headerRenderer={headerRenderer}
                          cellRenderer={this.isPermanentCellRenderer}
                          disableSort={true}
                          width={100}
                          flexGrow={9}
                        />

                        <Column
                          dataKey="status"
                          label="Is Active"
                          headerRenderer={headerRenderer}
                          cellRenderer={this.isActiveCellRenderer}
                          disableSort={false}
                          width={100}
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
          isOpen={openConfirmDialog}
          handleDialogClose={this.handleCloseDialog}
          title={'Confirmation'}
          content={companyStatusContent}
          successDialogEvent={this.companyStatusChange}
        />

        <ConfirmDialogBoxHOC
          isOpen={openPermanentDialog}
          handleDialogClose={this.handleCloseDialog}
          title={'Confirmation'}
          content={permanentStatusChange}
          successDialogEvent={this.permanentStatusChange}
        />

        <ConfirmDialogBoxHOC
          isOpen={openConfirmLoginDialog}
          handleDialogClose={this.handleCloseDialog}
          title={'Confirmation'}
          content={'Are you sure you want to Login ?'}
          successDialogEvent={this.loginAsInCompany}
        />
        <Dialog
          open={openDatePicker}
          onClose={this.handleCloseDialog}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          className="dialog-datepicker confirm-dialog"
        >
          <DialogTitle id="alert-dialog-title">Extend customer account</DialogTitle>
          <DialogContent>

            <form >
              <DatePicker
                selected={expiryDate}
                onChange={this.dateChangeHandler}
                className="custom-datepicker"
                dateFormat="YYYY-MM-dd"
                minDate={expiryDate}
              />
              <span></span>
              <div className="dialog-datepicker-foo text-left">
                <Button onClick={this.handleCloseDialog} className="btn btn-outline-blue mrR10">
                  Cancel
                </Button>
                <Button onClick={this.extendCompanyExpiryDate} className="btn btn-primary">
                  Save
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    );
  }
}


const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(Object.assign({}, companyMgmtActions), dispatch),
    showMessage: message => {
      dispatch(showMessage(message))
    }, setProgressBar: isProgress => {
      dispatch(setProgressBar(isProgress))
    }, setLoginAsCompanyDetails: loginAsDetails => {
      dispatch(setLoginAsCompanyDetails(loginAsDetails))
    },  setActiveMenu: activeMenu => {
      dispatch(setActiveMenu(activeMenu))
    }, resetHeaderFilterData() {
      dispatch(resetHeaderFilterData())
    },checkIsTailPeriodFinishedAndNotSubsribed(){
      dispatch(checkIsTailPeriodFinishedAndNotSubsribed())
    }
  };
}

export default withRouter((connect(null, mapDispatchToProps)(CompanyList)));
