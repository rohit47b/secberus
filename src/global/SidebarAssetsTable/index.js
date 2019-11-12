/*
 * @Author: Virendra Patidar 
 * @Date: 2018-09-04 14:38:12 
 * @Last Modified by: Virendra Patidar
 * @Last Modified time: 2019-04-23 16:35:47
 */
import React, { PureComponent } from "react"

import {
  Table,
  Column,
  SortDirection,
  InfiniteLoader
} from "react-virtualized"
import AutoSizer from "react-virtualized/dist/commonjs/AutoSizer"

import { sNoCellRenderer, serviceCellRenderer, headerRenderer, wrapTextCellRenderer } from 'TableHelper/cellRenderer'

import { store } from 'client'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import { cloneDeep, debounce } from "lodash"

import Loader from 'global/Loader'

import * as assetsActions from 'actions/assetsAction'
import * as ruleActions from 'actions/ruleAction'
import * as dashboardActions from 'actions/dashboardAction'
import { showMessage } from 'actions/messageAction'

class SidebarAssetsTable extends PureComponent {
  _mounted = false
  state = {
    // Table attribute
    headerHeight: 50,
    rowHeight: 60,
    rowCount: 0,
    height: 450,
    sortBy: "status",
    sortDirection: SortDirection.DESC,
    dataList: [],

    // Pagination attribute
    pageNo: 0,
    totalCount: 100,
    perPage: 50,
    isMoreData: true,

    // Filter attribute
    category: ['Select Asset Type'],
    search: '',
    ruleCategoryList: [],
    issueType: '',
    filterProgress: true,

    // Display attribute
    graphData: '',
    openGraphBreakdown: false,
    pieChartData: [],
    description: '',
    sum: 0,
    count: 10,
    securityIssueByService: { count: 0, data: [] },
  };

  //Set current search bar filter data 
  currentValue = this.props.filterData

  //Debounce due to search
  fetchAssets = debounce(this.fetchAssets, 500);

  componentDidMount() {
    this._mounted = true
    const filterData = this.props.filterData
    if (filterData.selectAccount.id !== 'all' && filterData.selectAccount.id !== undefined) {
      this._mounted = false
      this.fetchAssets(filterData)
      this.fetchDashboardData(filterData)
    }
    this.unsubscribe = store.subscribe(this.receiveFilterData)
    this.fetchRuleCategory()
  }

  componentWillUnmount() {
    this._mounted = false
  }

  /**
   * Method called when change in search bar reducer state
   */
  receiveFilterData = data => {
    const currentState = store.getState()
    const previousValue = this.currentValue
    this.currentValue = currentState.uiReducer.filterData

    if (
      this.currentValue &&
      previousValue !== this.currentValue
    ) {
      const filterData = cloneDeep(currentState.uiReducer.filterData)
      if (filterData.selectAccount.id !== 'all' && this._mounted) {
        this.setState({dataList: []}, () => {
          this.fetchAssets(filterData)
          this.fetchIssues(filterData)
          this.fetchIssuesByService(filterData)
      })
      }
    }
  }

  _clearData = () => {
    this.setState({
      loadedRowCount: 0,
      loadedRowsMap: {},
      loadingRowCount: 0
    });
  }

  _isRowLoaded = ({ index }) => {
    return !!this.state.dataList[index];
  }


  //  ------------------- API Call start----------------------
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
        if (this._mounted) {
          if (result.success) {
            this.setState({ IssueData: result.data }, () => {
              this.setDataIssue();
            })
          } else {
            let message = { message: result, showSnackbarState: true, variant: 'error' }
            this.props.showMessage(message)
          }
        }
      });
  }

  fetchIssuesByService(filterData) {
    let payload = {}
    if (filterData.selectAccount.id !== 'all' && filterData.selectAccount.id !== undefined) {
      payload['account'] = filterData.selectAccount.id
    }

    if (filterData.selectCloud.id !== 'all') {
      payload['cloud'] = filterData.selectCloud.id
    }

    this.props.actions.fetchIssuesByService(payload).
      then(result => {
        if (this._mounted) {
          if (result.success) {
            this.setState({ IssueServiceData: result.data }, () => {
              this.setDataIssueService();
            })
          } else {
            let message = { message: result, showSnackbarState: true, variant: 'error' }
            this.props.showMessage(message)
          }
        }
      });
  }

  fetchRuleCategory() {
    this.props.actions.fetchRuleCategory().
      then(result => {
        if (this._mounted) {
          if (!result.success) {
            this.setState({ loaded: true });
            let message = { message: result, showSnackbarState: true, variant: 'error' }
            this.props.showMessage(message)
          } else {
            this.setState({ ruleCategoryList: result.data, loaded: true });
          }
        }
      });
  }


  fetchAssets(filterData) {

    let payload = {
      "sort": this.state.sortDirection === SortDirection.ASC,
      "search": this.state.search,
      "account_id": filterData.selectAccount.id,
      "sort_by": this.state.sortBy,
      "page": this.state.pageNo,
    }

    if (this.state.category[0] !== 'Select Asset Type') {
      payload['service'] = this.state.category
    }

    this.props.actions.fetchAssets(payload).
      then(result => {
        this._mounted = true
        if (result.success) {
          this.setState({ filterProgress: false, dataList: this.state.dataList.concat(result.data), loaded: true, isMoreData: result.data.length > 0 });
        } else {
          this.setState({ filterProgress: false, loaded: true });
          let message = { message: result, showSnackbarState: true, variant: 'error' }
          this.props.showMessage(message)
        }
      });
  }


  setDataIssue = () => {
    const data = this.state.IssueData;
    this.setState({ securityIssue: { count: data.count, data: data.data } })
  }

  setDataIssueService = () => {
    const data = this.state.IssueServiceData;
    this.setState({ securityIssueByService: { count: data.count, data: data.data } })
  }

  //  ------------------- API Call end----------------------

  getRows = (num) => {
    return [...Array(num).keys()].map(a => ({
      sno: a,
      id: `User- ~${a}~`,
      name: `VulnerableHost`,
      ipaddress: `192.168.1.1`,
      osplatform: `Ubuntu Linux`,
      securityalerts: `15`,
      count: Math.floor(Math.random() * 100)
    }));
  }

  IdCellRenderer = ({ cellData, columnIndex, key, parent, rowIndex, style }) => {
    return (
      <div>
        <a href="javascript:void(0)" onClick={this.props.toggleDrawer('right', true)}> {cellData}</a>
      </div>
    );
  };


  serviceCellRenderer = () => {
    return (
      <div>
        <span>
          <img alt="EC2" src="/assets/service-icon/ec2.png" />
        </span>
        <span>EC2</span>
      </div>
    );
  };

  statusCellRenderer = () => {
    return (
      <div>
        <span className="text-success">
          <i className="fa fa-circle" ></i>
        </span>
      </div>
    );
  };

  _loadMoreRows = ({ startIndex, stopIndex }) => {
    console.log(" load more ....", startIndex, stopIndex);
    this.setState({ dataList: this.getRows(startIndex + 10) });
  }

  isSortEnabled = () => {
    const list = this.state.dataList;
    const rowCount = this.state.rowCount;
    return rowCount <= list.length;
  }

  sort = ({ sortBy, sortDirection }) => {
    this.setState({ sortBy, sortDirection, dataList: [], pageNo: 0, filterProgress: true }, () => {
      this.fetchAssets(this.props.filterData)
    });
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

  headerRenderer = ({ dataKey, label, sortBy, sortDirection }) => {
    return (
      <div className="table-td">
        {dataKey === 'checkbox' &&
          <Checkbox
            checked={this.state.checkedA}
            onChange={this.handleCheckbox('checkedA')}
            value="checkedA"
            className="mt-checkbox white-checkbox"
          />}
        {dataKey !== 'checkbox' && label}
        {sortBy === dataKey && <SortIndicator sortDirection={sortDirection} />}
      </div>
    );
  }

  handleCheckbox = name => event => {
    this.setState({ [name]: event.target.checked });
  };

  render() {
    const {
      headerHeight,
      rowHeight,
      height,
      sortBy,
      sortDirection,
      dataList,
      perPage,
    } = this.state;

    const sortedList = dataList;

    return (
      <div>
        <div className="sidebar-header">
          <h4>EC2 - 89</h4>
          <span onClick={() => this.props.toggleDrawer('right', false, '')} className="sidebar-close-icon"><i className="fa fa-times-circle" aria-hidden="true"></i> Exit</span>
          <div className="clearfix"></div>
        </div>
        <div
          tabIndex={0}
          role="button"
          className="sidebar-body"
        >
          <AutoSizer disableHeight>
            {({ width }) => (
              <InfiniteLoader
                isRowLoaded={this._isRowLoaded}
                loadMoreRows={this._loadMoreRows}
                rowCount={10000}
                height={height}
                threshold={perPage}
              >
                {({ onRowsRendered, registerChild }) => (
                  <Table
                    headerHeight={headerHeight}
                    height={480}
                    rowCount={dataList.length}
                    rowGetter={({ index }) => sortedList[index]}
                    rowHeight={rowHeight}
                    sort={this.sort}
                    sortBy={sortBy}
                    sortDirection={sortDirection}
                    onRowsRendered={onRowsRendered}
                    noRowsRenderer={this.noRowsRenderer}
                    width={width}
                    className="data-table table-sec"
                  >
                    <Column
                      dataKey="status"
                      label=""
                      headerRenderer={headerRenderer}
                      cellRenderer={this.statusCellRenderer}
                      disableSort={false}
                      width={50}
                      flexGrow={1}
                    />

                    <Column
                      dataKey="S.No."
                      label="S.No."
                      headerRenderer={headerRenderer}
                      cellRenderer={sNoCellRenderer}
                      disableSort={true}
                      width={30}
                      flexGrow={2}
                    />

                    <Column
                      dataKey="name"
                      label="Name"
                      headerRenderer={headerRenderer}
                      cellRenderer={wrapTextCellRenderer}
                      disableSort={false}
                      width={300}
                      flexGrow={3}
                    />

                    <Column
                      dataKey="ipv4"
                      label="Public DNS(IPV4)"
                      headerRenderer={headerRenderer}
                      cellRenderer={wrapTextCellRenderer}
                      disableSort={false}
                      width={200}
                      flexGrow={4}
                      className="table-td"
                    />
                    <Column
                      dataKey="platform"
                      label="OS/Platform"
                      headerRenderer={headerRenderer}
                      disableSort={false}
                      width={200}
                      flexGrow={5}

                    />
                    <Column
                      dataKey="service"
                      label="Service"
                      headerRenderer={headerRenderer}
                      cellRenderer={serviceCellRenderer}
                      disableSort={false}
                      width={200}
                      flexGrow={6}
                    />
                    <Column
                      dataKey="securityAlert"
                      label="Security Alert"
                      headerRenderer={headerRenderer}
                      disableSort={false}
                      width={200}
                      flexGrow={7}
                      className="table-td"
                    />
                  </Table>
                )}
              </InfiniteLoader>
            )}
          </AutoSizer>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(Object.assign({}, assetsActions, ruleActions, dashboardActions), dispatch),
    showMessage: message => {
      dispatch(showMessage(message))
    }
  };
}

const mapStateToProps = (state, ownProps) => ({
  filterData: state.uiReducer.filterData,
})



export default withRouter((connect(mapStateToProps, mapDispatchToProps)(SidebarAssetsTable)));

