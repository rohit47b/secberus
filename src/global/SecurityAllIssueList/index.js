/*
 * @Author: Virendra Patidar 
 * @Date: 2018-09-04 14:42:25 
 * @Last Modified by: Virendra Patidar
 * @Last Modified time: 2018-11-26 12:52:03
 */
import React, { PureComponent } from "react"
import {
  Table,
  Column,
  SortDirection,
  InfiniteLoader
} from "react-virtualized"
import AutoSizer from "react-virtualized/dist/commonjs/AutoSizer"

import Grid from '@material-ui/core/Grid'

import Loader from 'global/Loader'
import FilterButton from 'global/FilterButton'
import CategoryFilter from 'global/CategoryFilter'
import SearchField from 'global/SearchField'
import { sNoCellRenderer, headerRenderer, dateCellRenderer, wrapTextCellRenderer } from 'TableHelper/cellRenderer'

import { store } from 'client'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { cloneDeep, debounce } from "lodash"
import { withRouter } from 'react-router-dom'

import * as securityIssueActions from 'actions/securityIssueAction'
import * as dashboardActions from 'actions/dashboardAction'
import { showMessage } from 'actions/messageAction'
import { setProgressBar } from 'actions/commonAction'

class DataTable extends PureComponent {

  _mounted = false

  state = {
    headerHeight: 40,
    rowHeight: 25,
    rowCount: 0,
    height: 450,
    sortBy: "time_detected",
    sortDirection: SortDirection.DESC,
    count: 10,
    dataList: [],
    checkedA: false,
    category: ['Select Category'],
    perPage: 50,
    filterProgress: false,
    pageNo: 0,
    totalCount: 0,
    issueType: ''
  };

  currentValue = this.props.filterData
  fetchSecurityIssue = debounce(this.fetchSecurityIssue, 1000);

  componentDidMount() {
    this._mounted = true
    this.props.setProgressBar(true);
    this._mounted = false
    const filterData = this.props.filterData
    this.fetchSecurityIssue(filterData)
    this.fetchIssues(filterData)
    this.unsubscribe = store.subscribe(this.receiveFilterData)
  }

  componentWillUnmount() {
    this._mounted = false
  }

  receiveFilterData = data => {
    const currentState = store.getState()
    const previousValue = this.currentValue
    this.currentValue = currentState.uiReducer.filterData

    if (
      this.currentValue &&
      previousValue !== this.currentValue
    ) {
      const filterData = cloneDeep(currentState.uiReducer.filterData)
      this.props.setProgressBar(true);
      if (this._mounted) {
        this.setState({ pageNo: 0, issueType: '', dataList: [] }, () => {
          this.fetchSecurityIssue(filterData)
          this.fetchIssues(filterData)
        });
      }
    }
  }


  fetchIssues(filterData) {
    let payload = {}
    if (filterData.selectAccount.id !== 'all' && filterData.selectAccount.id !== undefined) {
      payload['account'] = filterData.selectAccount.id
    }

    if (filterData.selectCloud.id !== 'all') {
      payload['cloud'] = filterData.selectCloud.id
    }

    this.props.actions.fetchIssues(payload).
      then(result => {
        this._mounted = true
        if (result.success) {
          this.setState({ IssueData: result.data }, () => {
            this.setData();
          })
        } else {
          let message = { message: result, showSnackbarState: true, variant: 'error' }
          this.props.showMessage(message)
        }
      });
  }


  setData = () => {
    const data = this.state.IssueData;
    this.setState({ securityIssue: { count: data.count, data: data.data }, totalCount: data.count })
  }

  fetchSecurityIssue(filterData) {
    let payload = {
      "sort": this.state.sortDirection === SortDirection.ASC,
      "search": this.state.search,
      "account": filterData.selectAccount.id,
      "sort_by": this.state.sortBy,
      "state": this.state.issueType,
      "page": this.state.pageNo,
      "cloud": filterData.selectCloud.id === 'all' ? '' : filterData.selectCloud.id
    }

    if (this.state.category[0] !== 'Select Category') {
      payload.category = this.state.category
    }
    this.props.actions.fetchSecurityIssue(payload).
      then(result => {
        this._mounted = true
        if (result.success) {
          this.props.setProgressBar(false);
          this.setState({ dataList: this.state.dataList.concat(result.data), loaded: true, filterProgress: false });
        } else {
          this.props.setProgressBar(false);
          this.setState({ dataList: [], loaded: true, filterProgress: false });
          let message = { message: result, showSnackbarState: true, variant: 'error' }
          this.props.showMessage(message)
        }
      });
  }


  _isRowLoaded = ({ index }) => {
    return !!this.state.dataList[index];
  }

  actionCellRenderer = ({ cellData }) => {
    return (
      <div>
        <select className="custom-select">
          <option>Select</option>
          <option>Add</option>
          <option>Update</option>
        </select>
      </div>
    );
  };

  statusCellRenderer = ({ cellData }) => {
    return (
      <div>
        <span className={cellData === 'fail' ? 'text-warning' : cellData === 'pass' ? 'text-success' : 'text-danger'}><i className="fa fa-circle"></i></span>
      </div>
    );
  };



  IdCellRenderer = ({ rowData, cellData }) => {
    return (
      <div>
        <a href="javascript:void(0)" onClick={this.props.toggleSecurityIsssueDetails('right', true, rowData.result_id, rowData.id)}> {cellData}</a>
      </div>
    );
  };

  _loadMoreRows = ({ startIndex, stopIndex }) => {
    let pageNo = Math.floor((startIndex) / this.state.perPage)
    if ((pageNo + 1) !== this.state.pageNo) {
      this.setState({ pageNo: pageNo + 1, filterProgress: true }, () => {
        const filterData = this.props.filterData
        this.fetchSecurityIssue(filterData)
      });
    }
  }

  isSortEnabled = () => {
    const list = this.state.dataList;
    const rowCount = this.state.rowCount;
    return rowCount <= list.length;
  }

  sort = ({ sortBy, sortDirection }) => {
    this.props.setProgressBar(true);
    this.setState({ sortBy, sortDirection, dataList: [], pageNo: 1 }, () => {
      const filterData = this.props.filterData
      this.fetchSecurityIssue(filterData)
    });
  }



  updateIssueType = (issueType, totalCount) => {
    this.setState({ pageNo: 0, issueType, totalCount, dataList: [], filterProgress: true }, () => {
      const filterData = this.props.filterData
      this.fetchSecurityIssue(filterData)
    });
  }

  handleChange = name => event => {
    this.setState({ pageNo: 0, [name]: event.target.value, dataList: [], filterProgress: true }, () => {
      const filterData = this.props.filterData
      this.fetchSecurityIssue(filterData)
    });
  };

  handleCategoryChange = name => event => {
    let value = event.target.value;
    if (value.length === 0) {
      value[0] = 'Select Category'
    }
    else if (value[0] === 'Select Category') {
      value.splice(0, 1)
    }
    this.setState({ pageNo: 0, [name]: value, dataList: [], filterProgress: true }, () => {
      const filterData = this.props.filterData
      this.fetchSecurityIssue(filterData)
    });
  };


  noRowsRenderer = () => {
    if (this.state.filterProgress) {
      return (<div className="data-not-found">
        <span> Records Not Found</span>
      </div>)
    }
    else if (this.state.filterProgress) {
      return <Loader />
    }
  }



  render() {
    const {
      headerHeight,
      height,
      sortBy,
      sortDirection,
      dataList,
      issueType,
      securityIssue,
      category,
      totalCount
    } = this.state;
    const sortedList = dataList;

    return (
      <div>
        <Grid container spacing={24} className="mrB5">
          <Grid item sm={8}>
            <h4 className="main-heading mr0">Security Issue</h4>
            <FilterButton updateIssueType={this.updateIssueType} securityIssue={securityIssue} issueType={issueType} />
            <div className="clearfix"></div>
          </Grid>
          <Grid item sm={4}>
            <Grid container spacing={24}>
              <Grid item sm={6} className="pdB0">
                <CategoryFilter category={category} selectHandler={this.handleCategoryChange} />
              </Grid>
              <Grid item sm={6}>
                <SearchField handleChange={this.handleChange} />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <AutoSizer disableHeight>
          {({ width }) => (
            <InfiniteLoader
              isRowLoaded={this._isRowLoaded}
              loadMoreRows={this._loadMoreRows}
              rowCount={totalCount}
              height={height}
              threshold={40}
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
                  className="data-table"
                  noRowsRenderer={this.noRowsRenderer}
                >

                  <Column
                    dataKey="sno"
                    label="S.No."
                    headerRenderer={headerRenderer}
                    disableSort={true}
                    cellRenderer={sNoCellRenderer}
                    width={20}
                    flexGrow={1}
                  />

                  <Column
                    dataKey="id"
                    label="Id"
                    headerRenderer={headerRenderer}
                    cellRenderer={this.IdCellRenderer}
                    disableSort={true}
                    width={80}
                    flexGrow={2}
                  />

                  <Column
                    dataKey="name"
                    label="Description"
                    headerRenderer={headerRenderer}
                    cellRenderer={wrapTextCellRenderer}
                    disableSort={!this.isSortEnabled}
                    width={400}
                    flexGrow={3}
                  />

                  <Column
                    dataKey="section"
                    label="Command Section"
                    headerRenderer={headerRenderer}
                    isableSort={!this.isSortEnabled}
                    width={40}
                    flexGrow={5}
                    className="table-td"
                  />

                  <Column
                    dataKey="category"
                    label="Category"
                    headerRenderer={headerRenderer}
                    isableSort={!this.isSortEnabled}
                    width={210}
                    flexGrow={6}
                    className="table-td"
                  />

                  <Column
                    dataKey="time_detected"
                    label="Time Detected"
                    headerRenderer={headerRenderer}
                    isableSort={!this.isSortEnabled}
                    cellRenderer={dateCellRenderer}
                    width={120}
                    flexGrow={7}
                    className="table-td"
                  />

                  <Column
                    dataKey="state"
                    label="Status"
                    headerRenderer={headerRenderer}
                    cellRenderer={this.statusCellRenderer}
                    disableSort={true}
                    width={30}
                    flexGrow={8}
                    className="table-td"
                  />

                  {/* <Column
                      dataKey="Action"
                      label="Action"
                      headerRenderer={headerRenderer}
                      cellRenderer={this.actionCellRenderer}
                      disableSort={true}
                      width={220}
                      flexGrow={9}

                    /> */}
                </Table>
              )}
            </InfiniteLoader>
          )}
        </AutoSizer>
      </div>
    );
  }
}


const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(Object.assign({}, securityIssueActions, dashboardActions), dispatch),
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

export default withRouter((connect(mapStateToProps, mapDispatchToProps)(DataTable)));