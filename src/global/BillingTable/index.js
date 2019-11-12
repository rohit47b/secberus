/*
 * @Author: Virendra Patidar 
 * @Date: 2018-11-20 10:25:56 
 * @Last Modified by: Virendra Patidar
 * @Last Modified time: 2018-11-20 10:26:40
 */
import React, { PureComponent } from "react"
import {
  Table,
  Column,
  SortDirection,
  InfiniteLoader
} from "react-virtualized"
import AutoSizer from "react-virtualized/dist/commonjs/AutoSizer"

import { store } from 'client'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { cloneDeep, debounce } from "lodash"
import { withRouter } from 'react-router-dom'

import ConfirmDialogBoxHOC from 'hoc/DialogBox'

import { sNoCellRenderer, headerRenderer } from 'TableHelper/cellRenderer'

import { convertDateFormatWithDate } from 'utils/dateFormat'

import * as subscriptionsActions from 'actions/subscriptionsAction'
import { showMessage } from 'actions/messageAction'
import { setProgressBar } from 'actions/commonAction'

class BillingTable extends PureComponent {
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
    subscription_id: '',
    openDialog: false
  };


  currentValue = this.props.filterData

  componentDidMount() {
    this._mounted = true
    this.props.setProgressBar(true);
    this.unsubscribe = store.subscribe(this.receiveFilterData)
    if (this.props.filterData.selectAccount.id !== 'all') {
      this._mounted = false
      this.fetchSubscriptionsHistorySubscriptions(this.props.filterData)
    }

  }

  componentWillUnmount() {
    this._mounted = false
  }

  /**
   * Method called when search bar filter change in header
   */
  receiveFilterData = data => {
    const currentState = store.getState()
    const previousValue = this.currentValue
    this.currentValue = currentState.uiReducer.filterData

    if (
      this.currentValue &&
      previousValue !== this.currentValue
    ) {
      if (this.currentValue.selectAccount.id !== 'all' && this._mounted) {
        this.setState({ dataList: [] }, () => {
          this.props.setProgressBar(true);
          const filterData = cloneDeep(currentState.uiReducer.filterData)
          this.fetchSubscriptionsHistorySubscriptions(filterData)
        })
      }
    }
  }


  //  ----------------API Call Method Start----------------------

  fetchSubscriptionsHistorySubscriptions(filterData) {
    let payload = {
      "company_id": localStorage.getItem('companyId'),
      "account_id": filterData.selectAccount.id,
    }

    this.props.actions.fetchSubscriptionsHistorySubscriptions(payload).
      then(result => {
        this._mounted = true
        if (result.success) {
          this.props.setProgressBar(false);
          this.setState({ filterProgress: false, dataList: result.data, loaded: true, }, () => {
            this.sumDueAmount()
          });


        } else {
          this.props.setProgressBar(false);
          this.setState({ filterProgress: false, dataList: [], loaded: true });
          // let message = { message: result, showSnackbarState: true, variant: 'error' }
          // this.props.showMessage(message)
        }
      });
  }

  sumDueAmount = () => {
    let due = 0
    let nextBilling = ''
    this.state.dataList.map((item, index) => {
      due = due + item.amount_due
      if (index === 0) {
        nextBilling = convertDateFormatWithDate(item.current_period_end * 1000)
      }
    })
    this.props.updateNextBillingDetails(nextBilling, due / 100)
  }


  subscribeCancel = () => {
    let payload = {
      "subscription_id": this.state.subscription_id,
    }
    this.props.setProgressBar(true);
    this.handleDialogClose()
    this.props.actions.subscribeCancel(payload).
      then(result => {
        if (this._mounted) {
          if (result.success) {
            this.props.setProgressBar(false);
            this.setState({ filterProgress: false, dataList: [] });
            let message = { message: result.message, showSnackbarState: true, variant: 'success' }
            this.props.showMessage(message)
          } else {
            this.props.setProgressBar(false);
            this.setState({ filterProgress: false, dataList: [], loaded: true });
            let message = { message: result, showSnackbarState: true, variant: 'error' }
            this.props.showMessage(message)
          }
        }

        this.fetchSubscriptionsHistorySubscriptions(this.props.filterData)
      });
  }

  //  ----------------API Call Method End----------------------


  //  ----------------Cusotm logic Method End----------------------

  openSubscribeCancelDialog = (subscription_id) => {
    this.setState({ openDialog: true, subscription_id });
  }

  handleDialogClose = () => {
    this.setState({ openDialog: false });
  };


  //  ----------------Cusotm logic Method End----------------------


  //  ----------------Table Helper Method Start----------------------

  _isRowLoaded = ({ index }) => {
    return !!this.state.dataList[index];
  }

  actionCellRenderer = ({ rowData, columnIndex, key, parent, rowIndex, style }) => {
    return (
      <div className="icon-action">
        <a href="javascript:void(0)" href={rowData.invoice_pdf} target="_blank"><i className="fa fa-file-pdf-o"></i></a>
        {/* <a href="javascript:void(0)" className="mrL10"><i className="fa fa-pencil"></i></a> */}
        {rowData.status !== 'canceled' && <a href="javascript:void(0)" className="mrL10" onClick={() => this.openSubscribeCancelDialog(rowData.subscription_id)}><i className="fa fa-times-circle"></i></a>}
      </div>
    );
  };

  cloudCellRenderer = ({ rowData }) => {
    return (
      <div>
        {rowData.cloud}
      </div>
    );
  };

  accountCellRenderer = ({ rowData }) => {
    return (
      <div>
        {rowData.account_name}
      </div>
    );
  };


  subscriptionNameCellRenderer = ({ rowData }) => {
    return (
      <div>
        {rowData.plan_name}
      </div>
    );
  };


  purchasedTimeCellRenderer = ({ rowData }) => {
    return (
      <div>
        {convertDateFormatWithDate(rowData.current_period_start * 1000)}
      </div>
    );
  };


  nextBIllingCycleCellRenderer = ({ rowData }) => {
    return (
      <div>
        {convertDateFormatWithDate(rowData.current_period_end * 1000)}
      </div>
    );
  };


  statusCellRenderer = ({ rowData }) => {
    return (
      <div>
        {rowData.status}
      </div>
    );
  };


  noRowsRenderer = () => {
    return (<div className="data-not-found">
      <span>Subscription not found</span>
    </div>)
  }

  _loadMoreRows = ({ startIndex, stopIndex }) => {
    this.fetchSubscriptionsHistorySubscriptions(this.props.filterData)
  }

  isSortEnabled = () => {
    const list = this.state.dataList;
    const rowCount = this.state.rowCount;
    return rowCount <= list.length;
  }

  sort = ({ sortBy, sortDirection }) => {
    this.setState({ sortBy, sortDirection });
  }

  //  ----------------Table Helper Method End----------------------


  render() {
    const {
      headerHeight,
      height,
      rowHeight,
      sortBy,
      sortDirection,
      dataList,
      openDialog
    } = this.state;

    const sortedList = dataList;

    return (
      <div style={{ height: "100%", maxHeight: "100%" }}>
        <AutoSizer>
          {({ width, height }) => (
            <InfiniteLoader
              isRowLoaded={this._isRowLoaded}
              loadMoreRows={this._loadMoreRows}
              rowCount={1}
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
                  noRowsRenderer={this.noRowsRenderer}
                  width={width}
                  className="data-table"
                >

                  <Column
                    dataKey="sno"
                    label="S.No."
                    headerRenderer={headerRenderer}
                    cellRenderer={sNoCellRenderer}
                    disableSort={!this.isSortEnabled}
                    width={200}
                    flexGrow={1}

                  />

                  <Column
                    dataKey="subscription.metadata.cloud"
                    label="Cloud accounts (ARN)"
                    headerRenderer={headerRenderer}
                    cellRenderer={this.cloudCellRenderer}
                    disableSort={true}
                    width={200}
                    flexGrow={2}

                  />

                  <Column
                    dataKey="subscription.metadata.accountName"
                    label="Account Name"
                    headerRenderer={headerRenderer}
                    cellRenderer={this.accountCellRenderer}
                    disableSort={!this.isSortEnabled}
                    width={200}
                    flexGrow={3}

                  />
                  <Column
                    dataKey="subscription.metadata.plan_name"
                    label="Subscription Name"
                    headerRenderer={headerRenderer}
                    cellRenderer={this.subscriptionNameCellRenderer}
                    disableSort={true}
                    width={200}
                    flexGrow={4}
                    className="table-td"
                  />
                  <Column
                    dataKey="subscription.start"
                    label="Purchased Time"
                    headerRenderer={headerRenderer}
                    cellRenderer={this.purchasedTimeCellRenderer}
                    disableSort={true}
                    width={200}
                    flexGrow={5}

                  />
                  <Column
                    dataKey="nextBillingCycle"
                    label="Next billing cycle"
                    headerRenderer={headerRenderer}
                    cellRenderer={this.nextBIllingCycleCellRenderer}
                    disableSort={true}
                    width={200}
                    flexGrow={6}
                  />

                  <Column
                    dataKey="nextBillingCycle"
                    label="Status"
                    headerRenderer={headerRenderer}
                    cellRenderer={this.statusCellRenderer}
                    disableSort={true}
                    width={200}
                    flexGrow={7}
                  />

                  <Column
                    dataKey="Action"
                    label="Action"
                    headerRenderer={headerRenderer}
                    cellRenderer={this.actionCellRenderer}
                    disableSort={true}
                    width={200}
                    flexGrow={8}
                  />
                </Table>
              )}
            </InfiniteLoader>
          )}
        </AutoSizer>


        {/* Dialog Box for status reset password */}

        <ConfirmDialogBoxHOC
          isOpen={openDialog}
          title={'Confirmation'}
          content={'Are you sure you want to cancel this subscription ?'}
          handleDialogClose={this.handleDialogClose}
          successDialogEvent={this.subscribeCancel}
        />
      </div>
    );
  }
}



const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(Object.assign({}, subscriptionsActions), dispatch),
    showMessage: message => {
      dispatch(showMessage(message))
    }, setProgressBar: isProgress => {
      dispatch(setProgressBar(isProgress))
    }
  };
}

const mapStateToProps = (state, ownProps) => ({
  filterData: state.uiReducer.filterData,
})

export default withRouter((connect(mapStateToProps, mapDispatchToProps)(BillingTable)));

