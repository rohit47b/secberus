/*
 * @Author: Virendra Patidar 
 * @Date: 2018-09-04 13:39:18 
 * @Last Modified by: Virendra Patidar
 * @Last Modified time: 2019-04-23 16:35:25
 */
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import { setProgressBar } from 'actions/commonAction';
import { showMessage } from 'actions/messageAction';
import * as securityIssueActions from 'actions/securityIssueAction';
import * as uiActions from 'actions/uiAction';
import { store } from 'client';
import Loader from 'global/Loader';
import { cloneDeep, debounce, filter, includes } from "lodash";
import React, { PureComponent } from "react";
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Column, SortDirection, Table } from "react-virtualized";
import AutoSizer from "react-virtualized/dist/commonjs/AutoSizer";
import { bindActionCreators } from 'redux';
import { headerRenderer } from 'TableHelper/cellRenderer';
import WithDrawer from 'TableHelper/with-drawer';




class SecurityIssueTable extends PureComponent {
  _mounted = false
  state = {
    // Tabel Attribute
    headerHeight: 40,
    rowHeight: 60,
    rowCount: 0,
    height: 450,
    sortBy: "time_detected",
    sortDirection: SortDirection.DESC,
    dataList: [

    ],

    //Filter Attribute
    ruleCategoryList: [],
    category: ['Select Category'],
    issueType: this.props.issueType,
    search: '',
    service: this.props.service ? this.props.service : ['Select Service'],
    filterProgress: false,
    // selectServices: ['Select Service'],

    // Pagination Attribute
    pageNo: 0,
    totalCount: 0,
    perPage: 50,
    isMoreRecords: true,
    isRequestForData: false,

    popoverEl: null

  };

  fetchSecurityIssueSearch = debounce(this.fetchSecurityIssueSearch, 1000);

  currentValue = this.props.filterData

  componentDidMount() {
    this._mounted = true
    this.unsubscribe = store.subscribe(this.receiveFilterData)
    this.setState({ dataList: this.getRows(20) });
  }

  componentWillUnmount() {
    this._mounted = false
  }

  componentDidUpdate = (prevProps, prevState) => {
    if (this.props.issueType !== prevProps.issueType || this.props.service !== prevProps.service) {
      this.setState({ filterProgress: true, issueType: this.props.issueType, service: this.props.service, dataList: [], pageNo: 1 }, () => {
        const filterData = this.props.filterData
       // this.fetchSecurityIssue(filterData)
        
      })
    }
  }

  /**
   * Method called when search bar filter change in header
   */

  getRows(num) {
    let regions = [
      'us-east-1',
      'us-east-2',
      'us-west-1',
      'us-west-2',
      'ca-central-1',
      'eu-central-1',
      'eu-west-1',
      'eu-west-2',
      'eu-west-3',
      'eu-north-1',
      'ap-northeast-1',
      'ap-northeast-2',
      'ap-northeast-3',
      'ap-southeast-1',
      'ap-southeast-2',
      'ap-south-1',
      'sa-east-1'
    ];
    let priority = ['Critical', 'High', 'Mid', 'Low', 'Suppessed'];
    let AlertDescription = [
      {alert: 'S3 Bucket has Global ACL Permissions enabled', asset: 's3'},
      {alert: 'S3 Logging Enabled', asset: 's3'},
      {alert: 'S3 Bucket has Global GET Permissions enabled via bucket policy', asset: 's3'},
      {alert: 'S3 Object Versioning Not Enabled', asset: 's3'},
      {alert: 'S3 Server Side Encryption Not Enabled', asset: 's3'},
      {alert: 'S3 Bucket has Global List Permissions enabled via bucket policy', asset: 's3'},
      {alert: 'Too Few IAM Users with Administrator Privilege', asset: 'iam'},
      {alert: 'IAM password policy require at least one lowercase letter', asset: 'iam'},
      {alert: 'ELB POODLE Vulnerability Detected', asset: 'iam'},
      {alert: 'Global Service Port Access - PostgreSQL (TCP Port 5432) Detected', asset: 'ec2'},
      {alert: 'Global ICMP (Ping) Access Detected', asset: 'ec2'},
      {alert: 'Nearing limits of On-Demand EC2 instances', asset: 'ec2'}
    ]
    let randomAlerts = [];
    for(var i=1 ; i<=20 ; i++){
 
      randomAlerts.push(Math.floor(Math.random() * 12));

    }
    return [...Array(num).keys()].map(
      a => ({
      alert_id: `Alert- `+a,
      AlertDescription: AlertDescription[randomAlerts[a]].alert,
      priority: priority[Math.floor(Math.random() * 5)],
      age: Math.floor(Math.random() * 24) + ` Hours`,
      asset_name: AlertDescription[randomAlerts[a]].asset,
      region: regions[Math.floor(Math.random() * 17)],
 
    }));
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
      if (this._mounted) {
       // this.fetchSecurityIssue(filterData)
      }
    }
  }


  fetchSecurityIssueSearch(filterData) {
   // this.fetchSecurityIssue(filterData);
  }


  //  ----------------API Call Method Start----------------------

  fetchSecurityIssue(filterData) {

    this.setState({ isRequestForData: true });

    const { service, sortDirection, search, sortBy, issueType, pageNo, category } = this.state

    let payload = {
      "sort": sortDirection === SortDirection.ASC,
      "search": search,
      "account": filterData.selectAccount.id,
      "sort_by": sortBy,
      "state": issueType,
      "page": pageNo,
      "cloud": filterData.selectCloud.id === 'all' ? '' : filterData.selectCloud.id
    }
    if (category[0] !== 'Select Category') {
      payload.category = category
    }

    if (service && service[0] !== 'Select Service') {
      let filtered_services = filter(this.props.serviceList, function (p) {
        return includes(service, p.service_name);
      });
      const filtered_services_names = filtered_services.map(service => service.service);
      payload.service = filtered_services_names
    }


    this.props.actions.fetchSecurityIssue(payload).
      then(result => {
        if (this._mounted) {
          if (result.success) {
            this.props.setProgressBar(false);
            this.setState({ isRequestForData: false, filterProgress: false, dataList: this.state.dataList.concat(result.data), loaded: true, isMoreRecords: result.data.length > 0 });
          } else {
            this.props.setProgressBar(false);
            this.setState({ isRequestForData: false, filterProgress: false, dataList: [], loaded: true });
            let message = { message: result.message, showSnackbarState: true, variant: 'error' }
            this.props.showMessage(message)
          }
          this.updateFilterReducer()
        }
      });
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

  _loadMoreRows({ startIndex, stopIndex }) {
    console.log(" load more ....", startIndex, stopIndex);
    this.setState({ dataList: this.getRows(startIndex + 10) });
  }


  actionCellRenderer = ({ cellData }) => {
    return (
     <span className="link-hrf">View</span>
    )
  }

  servicesCellRenderer=({ cellData }) => {
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


  sort = ({ sortBy, sortDirection }) => {
    this.setState({ filterProgress: true, dataList: [], pageNo: 0, sortBy, sortDirection }, () => {
      const filterData = this.props.filterData
     // this.fetchSecurityIssue(filterData)
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
         // this.fetchSecurityIssue(filterData)
        });
      }
    }
  }

  assetNameCellRenderer = (asset) => {
    if (asset.cellData == 'ec2'){
      return (
          <div className="service-icon" title="EC2">
              <img alt="EC2" src="/assets/service-icon/vpc.png" /> EC2
          </div>
      )
    }
    if (asset.cellData == 's3'){
      return (
          <div className="service-icon" title="S3">
              <img alt="S3" src="/assets/service-icon/s3.png" /> S3
          </div>
      )
    }
    if (asset.cellData == 'iam'){
      return (
          <div className="service-icon" title="IAM">
              <img alt="IAM" src="/assets/service-icon/iam.png" /> IAM
          </div>
      )
    }
    return (
      <div className="service-icon" title="EC2">
          <img alt="EC2" src="/assets/service-icon/vpc.png" /> EC2
      </div>
  )
}

  //  ----------------Table Helper Method End----------------------

  //  ----------------Custom Logic Method Start----------------------
  handleCheckbox = name => event => {
    this.setState({ [name]: event.target.checked });
  };

  handleChange = name => event => {
    let value = event.target.value;
    if (value.length === 0) {
      value[0] = 'Select Category'
    }
    else if (value[0] === 'Select Category') {
      value.splice(0, 1)
    }
    this.setState({ filterProgress: true, pageNo: 0, [name]: value, dataList: [] }, () => {
      const filterData = this.props.filterData
     // this.fetchSecurityIssueSearch(filterData)
      this.updateFilterReducer()
    });
  };

  handleServiceChange = name => event => {
    let value = event.target.value;
    if (value.length === 0) {
      value[0] = 'Select Service'
    }
    else if (value[0] === 'Select Service') {
      value.splice(0, 1)
    }
    this.setState({ filterProgress: true, pageNo: 0, [name]: value, dataList: [] }, () => {
      const filterData = this.props.filterData
     // this.fetchSecurityIssueSearch(filterData)
      this.updateFilterReducer()
    });
  };




  handleChangeSearch = name => event => {
    this.setState({ filterProgress: true, pageNo: 0, [name]: event.target.value, dataList: [] }, () => {
      const filterData = this.props.filterData
     // this.fetchSecurityIssueSearch(filterData)
      this.updateFilterReducer()
    });
  };


  updateFilterReducer = () => {

    let securityIssueFilter = {}

    const { category, service, search } = this.state

    if (category[0] !== 'Select Category') {
      securityIssueFilter.category = category
    }

    if (service && service[0] !== 'Select Service') {
      let filtered_services = filter(this.props.serviceList, function (p) {
        return includes(service, p.service_name);
      });
      const filtered_services_names = filtered_services.map(service => service.service);
      securityIssueFilter.service = filtered_services_names
    }

    if (search.trim().length > 0) {
      securityIssueFilter.search = search
    }

    this.props.actions.setSecurityIssueFilter(securityIssueFilter)
  }

  updateIssueType = (issueType, totalCount) => {
    this.setState({ filterProgress: true, pageNo: 0, issueType, totalCount, dataList: [] }, () => {
      const filterData = this.props.filterData
    });
  }

  handleActionChange = name => event => {
    this.setState({ [name]: event.target.value });
  };

  handlePopover = event => {
    this.setState({
      popoverEl: event.currentTarget,
    });
  };

  handlePopoverClose = () => {
    this.setState({
      popoverEl: null,
    });
  };

  //  ----------------Custom Logic Method End----------------------


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

  renderOffernders = (offenders) => {
    return (offenders.map((offender, index) => {
      return <div key={'offender_' + index} className="issue-info">
        <span className="issue-title">{JSON.stringify(offender)}</span>
      </div>
    })
    )
  }

  renderExcludedAsset = (excluded_assets) => {
    return excluded_assets !== null ? (
      excluded_assets.map((excluded_asset) => {
        return <div key={excluded_asset} className="issue-info">
          <span className="issue-title"> {JSON.stringify(excluded_asset)}</span>
        </div>
      })
    ) : ''
  }


  render() {
    const {
      sortBy,
      sortDirection,
      dataList,
      category,
      issueType,
      service,
      totalCount,
    } = this.state;

    const { securityIssue } = this.props

    return (
      <div className="container sidebar-container">
        <div className="sidebar-header">
          <h4>Alerts</h4>
          <span>
              <FormControl className="mrR15">
                <Input
                    className="rounded-search"
                    placeholder="Search"
                />
            </FormControl>
          </span>
          <span onClick={this.props.toggleDrawer} className="sidebar-close-icon"><i className="fa fa-times-circle-o" aria-hidden="true"></i></span>
          
        </div>
        <div
          tabIndex={0}
          role="button"
          className="sidebar-body"
        >
          {/* <Grid container spacing={24} className="mrB5">
            <Grid item sm={5} className="side-filter">
              <FilterButton updateIssueType={this.updateIssueType} securityIssue={securityIssue} issueType={issueType} />
            </Grid>
            <Grid item sm={2} className="pdR0">
              <ServiceFilter selectServices={service} selectHandler={this.handleServiceChange} />
            </Grid>
            <Grid item sm={2} className="pdR0">
              <CategoryFilter category={category} selectHandler={this.handleChange} />
            </Grid>
            <Grid item sm={3}>
              <SearchField handleChange={this.handleChangeSearch} />
            </Grid>
          </Grid> */}

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

                      <Table
                        ref={setTableRef}
                        headerHeight={30}
                        height={470}
                        sortBy={sortBy}
                        sort={this.sort}
                        sortDirection={sortDirection}
                        loadMoreRows={this._loadMoreRows}
                        width={width}
                        rowCount={dataList.length}
                        rowGetter={this._rowGetter}
                        rowHeight={rowHeight}
                        rowRenderer={rowRenderer}
                        noRowsRenderer={this.noRowsRenderer}
                        onScroll={this.scrollEvent}
                        className='data-table table-expand table-sec table-ellipse table-border'
                      >

                       
                        <Column
                          dataKey="alert_id"
                          label="Alert ID"
                          headerRenderer={headerRenderer}
                          disableSort={false}
                          width={100}
                          flexGrow={1}
                          className="table-td"

                        />

                        <Column
                          dataKey="AlertDescription"
                          label="Alert Description"
                          headerRenderer={headerRenderer}
                          disableSort={false}
                          width={400}
                          flexGrow={1}
                          className="table-td"

                        />

                          <Column
                          dataKey="priority"
                          label="Priority"
                          headerRenderer={headerRenderer}
                          disableSort={false}
                          width={200}
                          flexGrow={2}
                        />

                      
                        <Column
                          dataKey="age"
                          label="Age"
                          headerRenderer={headerRenderer}
                          disableSort={false}
                          width={100}
                          flexGrow={3}
                        />

                        <Column
                          dataKey="asset_name"
                          label="Asset Name"
                          headerRenderer={headerRenderer}
                          cellRenderer={this.assetNameCellRenderer}
                          disableSort={false}
                          width={100}
                          flexGrow={4}
                        />

                          <Column
                          dataKey="region"
                          label="Region"
                          headerRenderer={headerRenderer}
                          disableSort={false}
                          width={150}
                          flexGrow={5}
                        />

                      </Table>
                    )}

                </AutoSizer>
              </div>
            )}
          </WithDrawer>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(Object.assign({}, securityIssueActions, uiActions), dispatch),
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
})

export default withRouter((connect(mapStateToProps, mapDispatchToProps)(SecurityIssueTable)));