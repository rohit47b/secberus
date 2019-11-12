/*
 * @Author: Virendra Patidar 
 * @Date: 2018-09-04 13:39:18 
 * @Last Modified by: Virendra Patidar
 * @Last Modified time: 2019-05-28 15:56:43
 */
import { Button, Checkbox } from '@material-ui/core';
import * as alertsActions from 'actions/alertsAction';
import { setProgressBar, setAlertsPlan } from 'actions/commonAction';
import { showMessage } from 'actions/messageAction';
import * as remediationActions from 'actions/remediationAction';
import { store } from 'client';
import AddToPlan from 'global/AddToPlan';
import CreateRemediationPlan from 'global/CreatePlan';
import Loader from 'global/Loader';
import { cloneDeep, debounce, pull } from "lodash";
import React, { PureComponent } from "react";
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Column, SortDirection, Table, InfiniteLoader, CellMeasurerCache, CellMeasurer } from "react-virtualized";
import AutoSizer from "react-virtualized/dist/commonjs/AutoSizer";
import { bindActionCreators } from 'redux';
import { headerRenderer } from 'TableHelper/cellRenderer';
import WithDrawer from 'TableHelper/with-drawer';
import { fetchServiceIconPath } from 'utils/serviceIcon';
import { calculateAgoTimeByLongFormat } from 'utils/dateFormat'

import history from 'customHistory';
import { chipArrayCellRenderer } from 'TableHelper/cellRenderer';
import Switch from '@material-ui/core/Switch';
import ConfirmDialogBoxHOC from 'hoc/DialogBox'

const PriorityColorClass = { CRITICAL: 'text-danger', HIGH: 'text-orange', MEDIUM: 'text-warning', LOW: 'text-success', SUPPESSED: 'text-gray', WARNING: 'text-warning' }

class AlertList extends PureComponent {
  _mounted = false

  _cache = new CellMeasurerCache({
    fixedWidth: true,
    minHeight: 40
  });

  state = {
    // Tabel Attribute
    headerHeight: 40,
    rowHeight: 25,
    rowCount: 0,
    height: 450,
    sortBy: "priority",
    sortDirection: SortDirection.DESC,
    dataList: [],

    //Filter Attribute
    filterProgress: true,
    // selectServices: ['Select Service'],

    // Pagination Attribute
    pageNo: 0,
    totalCount: 0,
    perPage: 10,
    isMoreRecord: true,
    isRequestForData: false,

    popoverEl: null,
    selectedAlertIds: [],
    openDialog: false,

    placement: null,
    popperEl: null,
    openPopOver: false,

    planDataList: [],
    openStatusDialog: false,
    currentStatus: true,
    alertId: ''

  };

  fetchAlerts = debounce(this.fetchAlerts, 1000);

  currentValue = this.props.filterData

  componentDidMount() {
    this._mounted = true

    const filterData = this.props.filterData
    if (filterData.selectAccount.id !== 'all' && filterData.selectAccount.id !== undefined) {
      this._mounted = false
      this.fetchAlerts(filterData)
    } else {
      this.setState({ filterProgress: false })
    }
    // this.setState({ dataList: this.getRows(20) });
    this.unsubscribe = store.subscribe(this.receiveFilterData)
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
      const filterData = cloneDeep(currentState.uiReducer.filterData)
      if (filterData.selectAccount.id !== 'all' && this._mounted) {
        this.setState({dataList: []}, () => {
          this.fetchAlerts(filterData)
        })
      }
    }
  }

  //  ----------------API Call Method Start----------------------

  fetchAlerts(filterData) {
    let payload = { accountId: filterData.selectAccount.id, sort_by: this.state.sortBy, sort_order: this.state.sortDirection, limit: this.state.perPage, offset: this.state.pageNo, priority: this.props.alertTitle ? this.props.alertTitle : '' }
    if (this.props.rule_id !== null) {
      payload['rule_id'] = this.props.rule_id
    }
    if (this.props.asset_id !== null) {
      payload['asset_type'] = this.props.asset_type
    }
    payload['status'] = 'OPEN'
    this.props.actions.fetchAlerts(payload).
      then(result => {
        this._mounted = true
        if (typeof result !== 'string') {
          this.setState({ dataList: this.state.dataList.concat(result), loading: false, filterProgress: false, isMoreRecord: result.length >= this.state.perPage, selectedAlertIds: this.props.alerts_plan })
        } else {
          console.log(' Error in fetching alerts :- ', result);
          this.setState({ loading: false, filterProgress: false })
        }
      });
  }

  SuppressAlerts(type, data) {
      if (type === 'suppress') {
          this.props.actions.suppressAlert(data).
              then(result => {
                  if (this._mounted) {
                      if (result && (typeof result === 'string')) {
                          let message = { message: result, showSnackbarState: true, variant: 'error' }
                          this.props.showMessage(message)
                      } else {
                        mixpanel.track("Suppress", {
                            "Item Type": "Alert",
                            "Name of Item": data.id,
                        });
                    }
                  }
              })
      } else if (type === 'unsuppress') {
          this.props.actions.unSuppressAlert(data).
              then(result => {
                  if (this._mounted) {
                      if (result && (typeof result === 'string')) {
                          let message = { message: result, showSnackbarState: true, variant: 'error' }
                          this.props.showMessage(message)
                      }
                  }
              })
      }
  }

  //  ----------------API Call Method End----------------------

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

  _loadMoreRows = ({ startIndex, stopIndex }) => {
      if (this.state.isMoreRecord) {
          console.log(" load more ....", startIndex, stopIndex);
          let pageNo = Math.floor((startIndex) / this.state.perPage)
          if ((pageNo + this.state.perPage) !== this.state.pageNo) {
              this.setState({ pageNo: this.state.pageNo + this.state.perPage, filterProgress: true }, () => {
                  const filterData = this.props.filterData
                  this.fetchAlerts(filterData)
              });
          }
      }
  }


  sort = ({ sortBy, sortDirection }) => {
      if (sortBy !== 'region' && sortBy !== 'priority') {
          this.setState({ sortBy, sortDirection, filterProgress: true, dataList: [], pageNo: 0 }, () => {
              const filterData = this.props.filterData
              this.fetchAlerts(filterData)
          });
      }
  }


  actionCellRenderer = ({ cellData }) => {
    return (
      <span className="link-hrf">View</span>
    )
  }

  servicesCellRenderer = ({ cellData }) => {
    return (
      <div className="service-icon" title="EC2">
        <img src="/assets/service-icon/vpc.png" /> EC2
      </div>
    )
  }

  IdCellRenderer = ({ cellData }) => {
    return (
      <div>
        <a href="javascript:void(0)"> {cellData}</a>
      </div>
    );
  };

  _rowGetter = ({ index }) => {
    return this.state.dataList[index];
  }

  scrollEvent = ({ clientHeight, scrollHeight, scrollTop }) => {
    if (this.state.isMoreRecords && scrollTop > 0 && clientHeight > 0 && !this.state.isRequestForData) {
      const totalPages = Math.floor(this.state.totalCount / this.state.perPage)

      if (this.state.pageNo <= totalPages) {
        this.setState({ pageNo: this.state.pageNo + 1 }, () => {
          const filterData = this.props.filterData
          // this.fetchSecurityIssue(filterData)
        });
      }
    }
  }

  alertIdAnchorCellRenderer = ({...params}) => {
    const alertId = params.rowData.asset.asset_type.cloud + '-' + params.rowData.asset.asset_type.cloud_service_name + '-' + params.rowData.id.substring(0, 6)
    let component = (
        <div>
            <a onClick={() => history.push({pathname: '/app/alerts/detail/'+params.rowData.id, state: { alert: params.rowData, backUrl: '/app/dashboard/home', backUrlState: {openDrawer: true, alertTitle: this.props.alertTitle} }})} href="javascript:void(0)">{alertId.toUpperCase()}</a>
        </div>
    );

    params['component'] = component
    return this.wrapComponentCellRenderer(params)
};

  priorityCellRenderer = ({...params}) => {
    const priority = params.rowData.rule.priority ? params.rowData.rule.priority.name : ''
    let component = (
      <div>
        {priority !== undefined && <span className={PriorityColorClass[priority.toUpperCase()] + ' mrR5'}><i className="fa fa-circle"></i></span>}
        {priority}
      </div>
    );
    params['component'] = component
    return this.wrapComponentCellRenderer(params)
  }

  regionRenderer = ({...params}) => {
    const region = params.rowData.asset.data.region ? params.rowData.asset.data.region : 'N/A'
    let component = (
        <div>
            {region.toUpperCase()}
        </div>
    )

    params['component'] = component
    return this.wrapComponentCellRenderer(params)
  }

  validateCellData = ({...params}) => {
    let cellData = params.cellData
    if (cellData === undefined || cellData === null || cellData === '' || cellData.length === 0) {
        cellData = 'N/A'
    } 
    params['component'] = cellData
    return this.wrapComponentCellRenderer(params)
  }

  suppressCellRenderer = ({ cellData, rowIndex }) => {
    return (
      <Switch
        checked={cellData === true}
        onChange={() => this.statusChangeDialog(cellData, rowIndex)}
        value={cellData+''}
        className={cellData === true ? "select-control-red" : "select-control-green active"}
      />
    );
  }

  assetNameCellRenderer = ({...params}) => {
    const assetName = params.cellData.asset_type.cloud_service_name
    let component = (
        <div className="service-icon" title={assetName}>
            {assetName !== undefined && <img src={fetchServiceIconPath(assetName)}/>}
            {params.cellData.data[params.cellData.asset_type.discriminator[0]]}
        </div>
    );

    params['component'] = component
    return this.wrapComponentCellRenderer(params)
}

  addToPlanCellRenderer = ({ rowData }) => {
    const isChecked = this.state.selectedAlertIds.indexOf(rowData.id) > -1;
    return (
      ( !rowData.remediation_plan_id || rowData.remediation_plan_id==='') ? 
      <Checkbox
        tabIndex={-1}
        onChange={() => this.addToPlanChangeHandler(rowData.id, isChecked)}
        checked={isChecked}
        disableRipple
        className="filter-checkbox"
        color="primary"
      /> :<Checkbox
      tabIndex={-1}
      checked={true}
      disabled={true}
      disableRipple
      className="filter-checkbox green-checkbox"
      />)
  }

  addToPlanChangeHandler = (alertId, isChecked) => {
    const selectedAlertIds = cloneDeep(this.state.selectedAlertIds)
    if (isChecked) {
      const newAlertIds = pull(selectedAlertIds, alertId)
      this.props.setAlertsPlan(newAlertIds)
      this.setState({ selectedAlertIds: newAlertIds }, () => {
      })
    } else {
      selectedAlertIds.push(alertId)
      this.props.setAlertsPlan(selectedAlertIds)
      this.setState({ selectedAlertIds: selectedAlertIds }, () => {
      })
    }
  };

  handelCloseDialog = () => {
    this.setState({ openDialog: false, selectedAlertIds: [], openPopOver: false });
  };

  handleSuccess = () => {
    this.setState({ openDialog: false, selectedAlertIds: [], openPopOver: false, filterProgress: true, dataList: [], pageNo: 1 }, () => {
      const filterData = this.props.filterData
      this.fetchAlerts(filterData)
    });
  }



  ageCellRenderer = ({...params}) => {
    let component = (
      <div>
        {calculateAgoTimeByLongFormat(params.rowData.asset.first_seen)}
      </div>
    );

    params['component'] = component
    return this.wrapComponentCellRenderer(params)
  }



  //  ----------------Table Helper Method End----------------------


  ruleRenderer = (state, description, excluded_assets, offenders, fail_reason, remediation) => {
    let label = state === 'pass' && excluded_assets !== null ? 'Excluded assets' : state === 'fail' ? 'Affected assets' : state === 'Error' ? 'Error Message' : ''
    return (
      <div className="desc">
        <div>
          <div className="float-left">
            <h4 className="mrB5"> Description</h4>
            <p className="mrT0">
              {description}
            </p>
          </div>
          <div className="clearfix"></div>
        </div>
        <h4 className="mrB5"> {label}</h4>
        {state === 'fail' ? this.renderOffernders(offenders) : state === 'pass' ? this.renderExcludedAsset(excluded_assets) : fail_reason
        }

        {state === 'fail' && <div className="remediation-info mrT25">
          <h4 className="mrB5">REMEDIATION</h4>
          {remediation !== null && <div dangerouslySetInnerHTML={{ __html: remediation.replace(/\n/g, '<br />') }} />}
        </div>
        }

      </div>
    );
  }

  handleClick = (placement) => (event) => {
    const { currentTarget } = event;
    this.setState(state => ({
      popperEl: currentTarget,
      openPopOver: state.placement !== placement || !state.openPopOver,
      placement,
    }));
  };

  handleOpenDialog = () => {
    this.setState({ openDialog: true, openPopOver: false });
  };

  handleDialogClose = () => {
    this.setState({ openStatusDialog: false })
  }

  statusChangeDialog = (cellData, rowIndex) => {
    this.setState({ openStatusDialog: true, rowIndex, currentStatus: cellData });
  }

  enableDisableSuppress = () => {
      const dataList = cloneDeep(this.state.dataList)
      let newDataList = dataList.map((row, sidx) => {
        if (this.state.rowIndex !== sidx) {
            return row;
        } else {
          const currentStatus = this.state.currentStatus;
          let type = 'suppress'
          if (currentStatus) {
              type = 'unsuppress'
          }
          this.SuppressAlerts(type, { id: row.id, cloud_account_id: this.props.filterData.selectAccount.id })
          return { ...row, suppress: !currentStatus, suppressed: !currentStatus };
        }
      });
      this.setState({ dataList: newDataList, openStatusDialog: false }, () => {
      });
  }

  suppressAlert = () => {
    this.props.actions.suppressAlert(this.props.filterData.selectAccount.id, this.state.alertId).
      then(result => {
        if (typeof result !== 'string') {

        } else {
          console.log(' Error in fetching alerts :- ', result);
          this.setState({ loading: false, filterProgress: false })
        }
        this.computeNewDataLIst()
      });
  }

  unSuppressAlert = () => {
    this.props.actions.unSuppressAlert(this.props.filterData.selectAccount.id, this.state.alertId).
      then(result => {
        if (typeof result !== 'string') {

        } else {
          console.log(' Error in fetching alerts :- ', result);
          this.setState({ loading: false, filterProgress: false })
        }
      });
    this.computeNewDataLIst()
  }


  computeNewDataLIst = () => {

    const dataList = cloneDeep(this.state.dataList)
    let newDataList = dataList.map((row, sidx) => {
      if (this.state.alertId !== row.id) {
        return row;
      } else {
        return { ...row, suppressed: !this.state.currentStatus };
      }
    });
    this.setState({ dataList: newDataList, openStatusDialog: false, isProgress: false }, () => {
    });
  }

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
            whiteSpace: 'normal'
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
      dataList,
      selectedAlertIds,
      openDialog,
      popperEl, openPopOver, placement,

      openStatusDialog,
      currentStatus
    } = this.state;

    const { dimentions } = this.props
    const tableHeight = dimentions.bodyHeight - 40

    return (
      <div className="container sidebar-container">
        <div className="sidebar-header">
          <h4> Alerts</h4>
          {/* <span>
            <FormControl className="mrR15">
              <Input
                className="rounded-search"
                placeholder="Search"
              />
            </FormControl>
          </span> */}

          <Button className="btn-primary mrR10 pull-right" onClick={this.handleClick('bottom-start')} disabled={selectedAlertIds.length === 0}>Create remediation plan</Button>

          <span onClick={this.props.toggleDrawer} className="sidebar-close-icon"><i className="fa fa-times-circle-o" aria-hidden="true"></i> Exit</span>

        </div>
        <div
          tabIndex={0}
          role="button"
          className="sidebar-body"
        >

          <WithDrawer
            drawerContent={(rowProps) => {
              return (<div className="sub-table">{this.ruleRenderer(rowProps.rowData.state, rowProps.rowData.description, rowProps.rowData.excluded_assets, rowProps.rowData.offenders, rowProps.rowData.fail_reason, rowProps.rowData.remediation)}</div>);
            }}
            rowsDimensions={dataList.map((dataItem) => ({ collapsedHeight: 40, expandedHeight: 270 }))}
          >
            {({ rowHeight, rowRenderer, toggleDrawer, toggleDrawerWithAnimation, setTableRef }) => (
              <div style={{ height: "100%", maxHeight: "100%" }}>
                <AutoSizer disableHeight>
                  {
                    ({ height, width }) => (
                      <InfiniteLoader
                          isRowLoaded={this._isRowLoaded}
                          loadMoreRows={this._loadMoreRows}
                          rowCount={200}
                          height={tableHeight}
                          threshold={10}
                      >
                        {({ onRowsRendered, registerChild }) => (
                          <Table
                            headerHeight={30}
                            height={tableHeight}
                            rowCount={dataList.length}
                            rowGetter={this._rowGetter}
                            rowHeight={this._cache.rowHeight}
                            sort={this.sort}
                            sortBy={sortBy}
                            sortDirection={sortDirection}
                            onRowsRendered={onRowsRendered}
                            noRowsRenderer={this.noRowsRenderer}
                            width={width}
                            className="data-table table-expand table-sec table-border"
                          >


                            <Column
                              dataKey="alert_id"
                              label="Alert ID"
                              headerRenderer={headerRenderer}
                              cellRenderer={this.alertIdAnchorCellRenderer}
                              disableSort={false}
                              width={150}
                              flexGrow={1}
                              className="table-td"

                            />

                            <Column
                              dataKey="priority"
                              label="Priority"
                              headerRenderer={headerRenderer}
                              cellRenderer={this.priorityCellRenderer}
                              disableSort={true}
                              width={90}
                              flexGrow={2}
                            />

                            <Column
                              dataKey="summary"
                              label="Alert Description"
                              headerRenderer={headerRenderer}
                              cellRenderer={this.validateCellData}
                              disableSort={false}
                              width={350}
                              flexGrow={3}
                              className="table-td"
                            />

                            <Column
                              dataKey="first_seen"
                              label="Age"
                              headerRenderer={headerRenderer}
                              cellRenderer={this.ageCellRenderer}
                              disableSort={false}
                              width={100}
                              flexGrow={4}
                            />

                            <Column
                              dataKey="asset"
                              label="Asset"
                              headerRenderer={headerRenderer}
                              cellRenderer={this.assetNameCellRenderer}
                              disableSort={false}
                              width={150}
                              flexGrow={5}
                            />

                            <Column
                              dataKey="region"
                              label="Region"
                              headerRenderer={headerRenderer}
                              cellRenderer={this.regionRenderer}
                              disableSort={false}
                              width={100}
                              flexGrow={6}
                            />

                            <Column
                              dataKey="suppressed"
                              label="Active"
                              headerRenderer={headerRenderer}
                              cellRenderer={this.suppressCellRenderer}
                              disableSort={false}
                              width={50}
                              flexGrow={7}
                            />


                            <Column
                              dataKey="addToPlan"
                              label="Add to Plan"
                              headerRenderer={headerRenderer}
                              cellRenderer={this.addToPlanCellRenderer}
                              disableSort={false}
                              width={100}
                              flexGrow={8}
                            />
                          </Table>
                          )}
                          </InfiniteLoader>
                    )}

                </AutoSizer>
              </div>
            )}
          </WithDrawer>
        </div>
        <AddToPlan handleSuccess={this.handleSuccess} handelCloseDialog={this.handelCloseDialog} selectedAlerts={selectedAlertIds} handleOpenDialog={this.handleOpenDialog} popperEl={popperEl} openPopOver={openPopOver} placement={placement} />
        <CreateRemediationPlan selectedAlerts={selectedAlertIds} openDialog={openDialog} handleCloseDialog={this.handelCloseDialog} handleSuccess={this.handleSuccess} />

        <ConfirmDialogBoxHOC
          isOpen={openStatusDialog}
          handleDialogClose={this.handleDialogClose}
          title={'Confirmation'}
          cancelBtnLabel={"CANCEL"}
          confirmBtnLabel={currentStatus === true ? "ACTIVE" : "SUPPRESS"}
          content={currentStatus === true ? 'Are you sure you want to Active this Alert ?' : 'Are you sure you want to Suppress this Alert ?'}
          successDialogEvent={this.enableDisableSuppress} />

      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(Object.assign({}, alertsActions, remediationActions), dispatch),
    showMessage: message => {
      dispatch(showMessage(message))
    }, setProgressBar: isProgress => {
      dispatch(setProgressBar(isProgress))
    }, setAlertsPlan: alerts_plan => {
      dispatch(setAlertsPlan(alerts_plan))
  }
  };
}

const mapStateToProps = (state, ownProps) => ({
  filterData: state.uiReducer.filterData,
  serviceList: state.commonReducer.serviceList,
  dimentions: state.uiReducer.dimentions,
  alerts_plan: state.commonReducer.alerts_plan
})

export default withRouter((connect(mapStateToProps, mapDispatchToProps)(AlertList)));