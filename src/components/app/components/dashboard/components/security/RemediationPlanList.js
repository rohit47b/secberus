/*
 * @Author: Virendra Patidar 
 * @Date: 2018-09-04 13:39:18 
 * @Last Modified by: Virendra Patidar
 * @Last Modified time: 2019-05-21 12:49:11
 */
import { setProgressBar } from 'actions/commonAction';
import { showMessage } from 'actions/messageAction';
import * as remediationActions from 'actions/remediationAction';
import { store } from 'client';
import Loader from 'global/Loader';
import { cloneDeep } from "lodash";
import React, { PureComponent } from "react";
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Column, SortDirection, Table, CellMeasurerCache, CellMeasurer } from "react-virtualized";
import AutoSizer from "react-virtualized/dist/commonjs/AutoSizer";
import { bindActionCreators } from 'redux';
import { headerRenderer } from 'TableHelper/cellRenderer';

class RemediationPlanList extends PureComponent {
  _mounted = false

  _cache = new CellMeasurerCache({
    fixedWidth: true,
    minHeight: 40
  });

  state = {
    // Tabel Attribute
    headerHeight: 40,
    rowHeight: 60,
    rowCount: 0,
    height: 450,
    sortBy: "name",
    sortDirection: SortDirection.DESC,
    dataList: [
    ],
    //Filter Attribute
    search: '',
    filterProgress: true,
    // selectServices: ['Select Service'],
    // Pagination Attribute
    pageNo: 0,
    totalCount: 0,
    perPage: 50,
    isMoreRecords: true,
    isRequestForData: false,
    openDialog: false,
    selectedAlerts: [],
    popoverEl: null,

    selectedPlans: [],

    placement: null,
    popperEl: null,
    openPopOver: false,
    successDialog: false

  };

  currentValue = this.props.filterData

  componentDidMount() {
    this._mounted = true

    const filterData = this.props.filterData
    if (filterData.selectAccount.id !== 'all' && filterData.selectAccount.id !== undefined) {
      this._mounted = false
      this.fetchRemediationPlans(filterData)
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
      this.currentValue && previousValue !== this.currentValue
    ) {
      const filterData = cloneDeep(currentState.uiReducer.filterData)
      if (filterData.selectAccount.id !== 'all' && this._mounted) {
        this.fetchRemediationPlans(filterData)
      }
    }
  }

  fetchRemediationPlans(filterData) {
    let payload = { account_id: filterData.selectAccount.id, sort_by: this.state.sortBy, sort_order: this.state.sortDirection, limit: this.state.perPage, offset: this.state.pageNo }

    this.props.actions.fetchRemediationPlans(payload).
      then(result => {
        this._mounted = true
        if (typeof result !== 'string') {
          this.setState({ dataList: result, filterProgress: false })
        } else {
          console.log(' Error in fetching remediation plans :- ', result);
        }
        this.setState({ filterProgress: false })
      });
  }

  //  ----------------Table Helper Method Start----------------------

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

  _loadMoreRows({ startIndex, stopIndex }) {
    console.log(" load more ....", startIndex, stopIndex);
  }

  sort = ({ sortBy, sortDirection }) => {
    this.setState({ filterProgress: true, dataList: [], pageNo: 0, sortBy, sortDirection }, () => {
      const filterData = this.props.filterData
      this.fetchRemediationPlans(filterData)
    });

  }

  _rowGetter = ({ index }) => {
    return this.state.dataList[index];
  }

  scrollEvent = ({ clientHeight, scrollHeight, scrollTop }) => {
    if (this.state.isMoreRecords && scrollTop > 0 && clientHeight > 0 && !this.state.isRequestForData) {
      const totalPages = Math.floor(this.state.totalCount / this.state.perPage)

      if (this.state.pageNo <= totalPages) {
        this.setState({ pageNo: this.state.pageNo + 1 }, () => {
          const filterData = this.props.filterData
          this.fetchRemediationPlans(filterData)
        });
      }
    }
  }

  validateCellData = ({...params}) => {
    let cellData = params.cellData
    if (cellData === undefined || cellData === null || cellData === '' || cellData.length === 0) {
        cellData = 'N/A'
    } 
    params['component'] = cellData
    return this.wrapComponentCellRenderer(params)
  }

  alertCellRenderer = ({ cellData }) => {
    return (
      <div>
        {cellData.length}
      </div>
    );
  }

  activeCellRenderer = ({  cellData }) => {
    return (<div>
      {cellData===true ?'Yes':'No'}
    </div>
    );
  };

  //  ----------------Table Helper Method End----------------------

  //  ----------------Custom Logic Method Start----------------------

  handleOpenDialog = () => {
    this.setState({ openDialog: true, openPopOver: false });
  };
  handleCloseDialog = () => {
    this.setState({ openDialog: false });
  };

  selectAlertEvent = (selectedAlerts) => {
    this.setState({ selectedAlerts })

  }

  //  ----------------Custom Logic Method End----------------------

  wrapComponentCellRenderer = (params) => {
    return (
      <CellMeasurer
        cache={this._cache}
        columnIndex={params.columnIndex}
        key={params.dataKey}
        parent={params.parent}
        rowIndex={params.rowIndex}>
        <div
          className={"tableColumn"}
          style={{
            whiteSpace: 'normal',
          }}>
          {params.component}
        </div>
      </CellMeasurer>
    );
  }

  render() {
    const {
      sortBy,
      sortDirection,
      dataList
    } = this.state;

    const { alert_id, dimentions } = this.props
    const tableHeight = dimentions.bodyHeight - 40

    return (
      <div className="container sidebar-container">
        <div className="sidebar-header">
          <h4>Remediation Plans</h4>

          {/* <span>
              <FormControl className="mrR15">
                <Input
                    className="rounded-search"
                    placeholder="Search"
                />
            </FormControl>
          </span> */}
          <span onClick={this.props.toggleDrawer} className="sidebar-close-icon"><i className="fa fa-times-circle-o" aria-hidden="true"></i> Exit</span>
        </div>
        <div
          tabIndex={0}
          role="button"
          className="sidebar-body"
        >

          <div style={{ height: "100%", maxHeight: "100%" }}>
            <AutoSizer disableHeight>
              {
                ({ width }) => (

                  <Table
                    headerHeight={30}
                    height={tableHeight}
                    rowHeight={this._cache.rowHeight}
                    sortBy={sortBy}
                    sort={this.sort}
                    sortDirection={sortDirection}
                    width={width}
                    rowCount={dataList.length}
                    rowGetter={this._rowGetter}
                    noRowsRenderer={this.noRowsRenderer}
                    onScroll={this.scrollEvent}
                    className='data-table table-expand table-sec table-border'
                  >


                    <Column
                      dataKey="id"
                      label="Plan Id"
                      headerRenderer={headerRenderer}
                      cellRenderer={this.validateCellData}
                      disableSort={false}
                      width={600}
                      flexGrow={1}
                      className="table-td"

                    />

                    <Column
                      dataKey="name"
                      label="Plan Name"
                      headerRenderer={headerRenderer}
                      cellRenderer={this.validateCellData}
                      disableSort={false}
                      width={600}
                      flexGrow={2}
                      className="table-td"
                    />

                    <Column
                      dataKey="alerts"
                      label="Alerts"
                      headerRenderer={headerRenderer}
                      cellRenderer={this.alertCellRenderer}
                      disableSort={false}
                      width={100}
                      flexGrow={3}
                      className="table-td"
                    />

                    <Column
                      dataKey="active"
                      label="Is Active"
                      headerRenderer={headerRenderer}
                      cellRenderer={this.activeCellRenderer}
                      disableSort={false}
                      width={100}
                      flexGrow={3}
                      className="table-td"
                    />

                  </Table>
                )}

            </AutoSizer>
          </div>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(Object.assign({}, remediationActions), dispatch),
    showMessage: message => {
      dispatch(showMessage(message))
    }, setProgressBar: isProgress => {
      dispatch(setProgressBar(isProgress))
    }
  };
}

const mapStateToProps = (state, ownProps) => ({
  filterData: state.uiReducer.filterData,
  serviceList: state.commonReducer.serviceList,
  dimentions: state.uiReducer.dimentions,
})

export default withRouter((connect(mapStateToProps, mapDispatchToProps)(RemediationPlanList)));