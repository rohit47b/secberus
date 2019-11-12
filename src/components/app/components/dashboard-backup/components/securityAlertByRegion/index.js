/*
 * @Author: Virendra Patidar 
 * @Date: 2018-09-04 14:10:15 
 * @Last Modified by: Virendra Patidar
 * @Last Modified time: 2019-02-04 15:11:23
 */
import React, { PureComponent } from "react"

import {
  Table,
  Column,
  SortDirection,
  InfiniteLoader
} from "react-virtualized"
import AutoSizer from "react-virtualized/dist/commonjs/AutoSizer"

import Chip from '@material-ui/core/Chip'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import Input from '@material-ui/core/Input';
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button';

import { serviceCellRenderer, headerRenderer, dateCellRenderer, wrapTextCellRenderer } from 'TableHelper/cellRenderer'

import SecurityIssueDetail from 'global/SecurityIssueDetail'
import Loader from 'global/Loader'


import { withRouter } from 'react-router-dom'
import { store } from 'client'
import { connect } from "react-redux"
import { bindActionCreators } from 'redux'
import { cloneDeep } from "lodash"

import * as dashboardActions from 'actions/dashboardAction'
import { showMessage } from 'actions/messageAction'
import { setProgressBar } from 'actions/commonAction'

import STATIC_DATA from 'data/StaticData'

import DashboardContext from "context/DashboardContext"
const DashboardContextConsumer = DashboardContext.Consumer

class SecurityAlertByRegion extends PureComponent {

  state = {

    //Table helper attribute
    headerHeight: 40,
    rowHeight: 25,
    rowCount: 0,
    height: 150,
    tableHeigth: 0,
    tableWidth: 0,
    fullSize: 0,

    //Table pagination attribute
    sortBy: "service",
    sortDirection: SortDirection.ASC,
    count: 10,
    dataList: [],

    ruleCategoryList: [],
    category: '',
    issueType: this.props.issueType,
    open: false,
    resultId: 0,
    regionName: 'us-west-2',
    filterProgress: false
  };




  currentValue = this.props.filterData

  componentDidMount() {
    this._mounted = true
    const filterData = this.props.filterData
    if (filterData.selectAccount.id !== 'all' && filterData.selectAccount.id !== undefined) {
      this._mounted = false
      this.fetchAssetByRegion(filterData);
    } else {
    }
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
      (previousValue.selectAccount.id !== this.currentValue.selectAccount.id ||
        previousValue.selectCloud.id !== this.currentValue.selectCloud.id)
    ) {
      const filterData = cloneDeep(currentState.uiReducer.filterData)
      if (filterData.selectAccount.id !== 'all' && this._mounted) {
        this.fetchAssetByRegion(filterData);
      }
    }
  }

  fetchAssetByRegion = (filterData) => {
    let payload = {
      region: this.state.regionName
    }

    if (filterData.selectAccount.id !== 'all' && filterData.selectAccount.id !== undefined) {
      payload['account'] = filterData.selectAccount.id
    }

    if (filterData.selectCloud.id !== 'all') {
      payload['cloud'] = filterData.selectCloud.id
    }

    this.props.actions.fetchAssetByRegion(payload).then(result => {
      this._mounted = true
      if (result.success) {
        this.setState({ filterProgress: false, dataList: result.data }, () => {
        })
      } else {
        this.setState({ filterProgress: false })
        let message = { message: result, showSnackbarState: true, variant: 'error' }
        this.props.showMessage(message)
      }
    });
  }

  // -------------- Table Helper Method start--------------------

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
      <div>
        <a href="javascript:void(0)" onClick={this.toggleDrawer('right', true, rowData.result_id, rowData.rule_id)}>View</a>
      </div>
    );
  };

  priorityCellRenderer = ({ cellData }) => {
    const severityClass = cellData === 'MEDIUM' ? 'text-warning' : cellData === 'LOW' ? 'text-gray' : cellData === 'HIGH' ? 'text-success' : 'text-danger'
    return (
      <div>
        <a href="javascript:void(0)" className={severityClass}> {cellData}</a>
      </div>
    );
  };

  _loadMoreRows = ({ startIndex, stopIndex }) => {
    this.fetchSecurityAlert()
  }

  isSortEnabled = () => {
    const list = this.state.dataList;
    const rowCount = this.state.rowCount;
    return rowCount <= list.length;
  }

  sort = ({ sortBy, sortDirection }) => {
    this.setState({ sortBy, sortDirection });
    const reverse = sortDirection === 'ASC' ? false : true
    const isNumericSort = false
    this.setState({ dataList: this.sortProperties(this.state.dataList, sortBy, isNumericSort, reverse) });

  }

  // -------------- Table Helper Method End --------------------


  // -------------- Custom Logic Method Start--------------------

  toggleDrawer = (side, open, resultId, id) => () => {
    this.setState({
      open,
      resultId,
      id
    });
  };

  fetchSecurityAlert(filterData) {
    // this.setState({ dataList: this.props.alertList, loaded: true });
  }


  /**
   * Used for custom sorting in client side
   * @param {*} obj - Data list which need to sort
   * @param {*} sortedBy - Sort by columm
   * @param {*} isNumericSort - If column is numeric then true , else false
   * @param {*} reverse - Soring order
   */
  sortProperties(obj, sortedBy, isNumericSort, reverse) {
    sortedBy = sortedBy || 1; // by default first key
    isNumericSort = isNumericSort || false; // by default text sort
    reverse = reverse || false; // by default no reverse

    let reversed = (reverse) ? -1 : 1;

    const sortedData = []
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        sortedData.push(obj[key])
      }
    }
    if (isNumericSort)
      sortedData.sort(function (a, b) {
        return reversed * (a[sortedBy] - b[sortedBy]);
      });
    else
      sortedData.sort(function (a, b) {
        let x = a[sortedBy].toLowerCase(),
          y = b[sortedBy].toLowerCase();
        return x < y ? reversed * -1 : x > y ? reversed : 0;
      });
    return sortedData; // array in format [ [ key1, val1 ], [ key2, val2 ], ... ]
  }

  handleCheckbox = name => event => {
    this.setState({ [name]: event.target.checked });
  };


  handleRegionChange = name => event => {
    this.setState({ [name]: event.target.value, dataList: [], filterProgress: true }, () => {
      this.fetchAssetByRegion(this.props.filterData)
    });
  };


  updateIssueType = (issueType) => {
    this.setState({ issueType }, () => {
      const filterData = this.props.filterData
      this.fetchSecurityIssue(filterData)
    });
  }

  // -------------- Custom Login Method End --------------------

  render() {
    const {
      headerHeight,
      sortBy,
      sortDirection,
      dataList,
      resultId,
      open,
      id,
      regionName
    } = this.state;

    const sortedList = dataList;

    return (
      <Card className="card-wizard mrB15 card-map card-panel card-region" style={{ height: "100%", maxHeight: "100%" }} id="container_security_alerts_by_region">
        <div className="card-head card-title">
          <Grid container spacing={24}>
            <Grid item sm={6} className="pdR0">
              <Typography component="h5" className="pdT5">
                Security Alerts by Region
          </Typography>
            </Grid>
            <Grid item sm={6} className="text-right">
            <FormControl className="multi-select single-select">
                    <Select
                        value={regionName}
                        name="regionName"
                        onChange={this.handleRegionChange('regionName')}
                        input={<Input id="select-multiple" />}
                        className="select-feild"
                        MenuProps={{
                            style: {
                                top: '137px'
                            }
                        }}
                    >
                      {
                        STATIC_DATA.REGION_LIST.map(function (region, index) {
                          return (<MenuItem className="select-item select-item-text" key={region.region_code} value={region.region_code}>
                            <span>{region.region_code.toUpperCase()}</span>
                            <Chip label={dataList.length} className="badge-round badge-red mrL5 mrR5" />
                        </MenuItem>)
                          })
                      }
                    </Select>
                </FormControl>

              {/* <FormControl className="single-select">
                <NativeSelect
                  className="select-text"
                  value={regionName}
                  name="regionName"
                  onChange={this.handleRegionChange('regionName')}
                >
                  {
                    STATIC_DATA.REGION_LIST.map(function (region, index) {
                      return (<option key={region.region_code} value={region.region_code}>{region.region_code.toUpperCase()}</option>)
                    })
                  }
                </NativeSelect>
              </FormControl> */}
              

            </Grid>
          </Grid>

        </div>
        <CardContent className="card-body" style={{ height: "100%", maxHeight: "100%" }}>
          <div className="filter-btn-2">
              <Button variant="contained" className="btn btn-filter">
                  All - 24
              </Button> 
              <Button variant="contained" className="btn btn-filter btn-ft-red btn-wht mrL5">
                  Critical - 11
              </Button>
              <Button variant="contained" className="btn btn-filter btn-ft-orange btn-wht mrL5">
                  High - 6
              </Button>
              <Button variant="contained" className="btn btn-filter btn-ft-yellow btn-wht mrL5">
                  Med - 3
              </Button>
              <Button variant="contained" className="btn btn-filter btn-ft-green btn-wht mrL5">
                  Low - 4
              </Button>
          </div>    
          <div className="table-body-security" style={{ height: "100%", maxHeight: "100%" }}>
            <div
              className="table-wrapper"
              style={{ height: "100%", maxHeight: "100%" }}
            >
              <div style={{ height: "100%", maxHeight: "100%" }}>
                <AutoSizer>
                  {({ width,height}) => (
                    <InfiniteLoader
                      isRowLoaded={this._isRowLoaded}
                      loadMoreRows={this._loadMoreRows}
                      rowCount={100}
                      height={height}
                      threshold={10}
                    >
                      {({ onRowsRendered }) => (
                        <Table
                          headerHeight={headerHeight}
                          height={height}
                          rowCount={dataList.length}
                          rowGetter={({ index }) => sortedList[index]}
                          rowHeight={90}
                          sort={this.sort}
                          sortBy={sortBy}
                          sortDirection={sortDirection}
                          onRowsRendered={onRowsRendered}
                          noRowsRenderer={this.noRowsRenderer}
                          width={width}
                          className="data-table table-sec-alert"
                        >

                          <Column
                            dataKey="service"
                            label="Services"
                            headerRenderer={headerRenderer}
                            cellRenderer={serviceCellRenderer}
                            disableSort={false}
                            width={150}
                            flexGrow={1}
                          />

                          <Column
                            dataKey="priority"
                            label="Priority"
                            headerRenderer={headerRenderer}
                            cellRenderer={this.priorityCellRenderer}
                            disableSort={false}
                            width={70}
                            flexGrow={2}
                          />

                          <Column
                            dataKey="name"
                            label="Name"
                            headerRenderer={headerRenderer}
                            disableSort={!this.isSortEnabled}
                            cellRenderer={wrapTextCellRenderer}
                            width={200}
                            flexGrow={3}
                          />

                          <Column
                            dataKey="time_detected"
                            label="Last Ran Check"
                            headerRenderer={headerRenderer}
                            cellRenderer={dateCellRenderer}
                            disableSort={!this.isSortEnabled}
                            width={150}
                            flexGrow={4}
                          />

                          <Column
                            dataKey="Detail"
                            label="Detail"
                            headerRenderer={headerRenderer}
                            cellRenderer={this.actionCellRenderer}
                            disableSort={true}
                            width={70}
                            flexGrow={5}
                          />
                        </Table>
                      )}
                    </InfiniteLoader>
                  )}
                </AutoSizer>
              </div>
            </div>
            <SecurityIssueDetail id={id} resultId={resultId} open={open} region={regionName} toggleDrawer={this.toggleDrawer} />
          </div>
        </CardContent>

      </Card>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  filterData: state.uiReducer.filterData,
})

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(Object.assign({}, dashboardActions), dispatch),
    showMessage: message => {
      dispatch(showMessage(message))
    }, setProgressBar: isProgress => {
      dispatch(setProgressBar(isProgress))
    }
  };
}


const SecurityAlertRedux = withRouter(connect(mapStateToProps, mapDispatchToProps)(SecurityAlertByRegion))

export default props => (
  <DashboardContextConsumer>
    {dashboardData => <SecurityAlertRedux {...props} data={dashboardData.securityAlerts} />}
  </DashboardContextConsumer>
);