/*
 * @Author: Virendra Patidar 
 * @Date: 2018-09-04 13:39:18 
 * @Last Modified by: Virendra Patidar
 * @Last Modified time: 2019-05-06 14:39:05
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
    this.setState({ dataList: this.getRows(16) });
  }

  componentWillUnmount() {
    this._mounted = false
  }

  componentDidUpdate = (prevProps, prevState) => {
    if (this.props.issueType !== prevProps.issueType || this.props.service !== prevProps.service) {
      this.setState({ filterProgress: true, issueType: this.props.issueType, service: this.props.service, dataList: [], pageNo: 1 }, () => {
        const filterData = this.props.filterData
        this.fetchSecurityIssue(filterData)
        
      })
    }
  }

  /**
   * Method called when search bar filter change in header
   */

  getRows(num) {
    let dates = [
        '01-02-2019 11:14 AM',
        '02-02-2019 09:09 PM',
        '03-02-2019 06:14 AM',
        '04-02-2019 05:43 PM',
        '05-02-2019 07:57 AM',
        '06-02-2019 03:55 PM',
        '07-02-2019 09:51 AM',
        '08-02-2019 11:03 PM',
        '09-02-2019 04:50 AM',
        '10-02-2019 05:39 PM',
        '11-02-2019 05:10 AM',
        '12-02-2019 08:57 PM',
        '13-02-2019 06:52 AM',
        '14-02-2019 07:59 PM',
        '15-02-2019 08:53 AM',
        '16-02-2019 03:15 PM',
        '17-02-2019 05:27 AM',
        '18-02-2019 08:31 PM',
        '19-02-2019 07:06 AM',
        '20-02-2019 04:17 PM'
    ];
    let services = [
        "s3",
        "sqs",
        "elasticsearch",
        "iam",
        "lambda",
        "acm",
        "ec2",
        "cloud-front",
        "cloud-trail",
        "cloud-watch",
        "sns",
        "rds",
        "redshift",
        "cloud-formation",
        "route53",
        "vpc"
      ]

    return [...Array(num).keys()].map(a => ({
      service: services[a],
      time_scan: dates[Math.floor(Math.random() * 20)],
      assets_discovered: Math.floor(Math.random() * 100),
      assets_modified: Math.floor(Math.random() * 75),
      assets_deleted: Math.floor(Math.random() * 25),
      alerts_discovered: Math.floor(Math.random() * 50),
      alerts_remediated: Math.floor(Math.random() * 50),
 
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
        this.setState({dataList: []}, () => {
          this.fetchSecurityIssue(filterData)
        })
      }
    }
  }


  fetchSecurityIssueSearch(filterData) {
    this.fetchSecurityIssue(filterData);
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
        <img alt="" src="/assets/service-icon/vpc.png" /> EC2
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
      this.fetchSecurityIssue(filterData)
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
          this.fetchSecurityIssue(filterData)
        });
      }
    }
  }

  viewCellRenderer = (asset) => {
    return (<span className="link-hrf fnt-13" onClick={this.toggleDrawerLogs} >View</span>)
  }

  assetNameCellRenderer = (asset) => {
    if (asset.cellData == 's3'){
      return (
          <div className="service-icon" title="S3">
              <img alt="S3" src="/assets/service-icon/s3.png" /> S3
          </div>
      )
    }
    if (asset.cellData == 'sqs'){
      return (
          <div className="service-icon" title="SQS">
              <img alt="SQS" src="/assets/service-icon/sqs.png" /> SQS
          </div>
      )
    }
    if (asset.cellData == 'elasticsearch'){
      return (
          <div className="service-icon" title="ElasticSearch">
              <img alt="ElasticSearch" src="/assets/service-icon/elastic-search.png" /> ElasticSearch
          </div>
      )
    }
    if (asset.cellData == 'IAM'){
        return (
            <div className="service-icon" title="IAM">
                <img alt="IAM" src="/assets/service-icon/iam.png" /> IAM
            </div>
        )
      }
      if (asset.cellData == 'lambda'){
        return (
            <div className="service-icon" title="Lambda">
                <img alt="Lambda" src="/assets/service-icon/lambda.png" /> Lambda
            </div>
        )
      }
      if (asset.cellData == 'ACM'){
        return (
            <div className="service-icon" title="ACM">
                <img alt="ACM" src="/assets/service-icon/acm.png" /> ACM
            </div>
        )
      }if (asset.cellData == 'ec2'){
        return (
            <div className="service-icon" title="EC2">
                <img alt="EC2" src="/assets/service-icon/vpc.png" /> EC2
            </div>
        )
      }
      if (asset.cellData == 'cloud-front'){
        return (
            <div className="service-icon" title="Cloud-Front">
                <img alt="Cloud-Front" src="/assets/service-icon/cloud-front.png" /> Cloud-Front
            </div>
        )
      }
      if (asset.cellData == 'cloud-trail'){
        return (
            <div className="service-icon" title="Cloud-Trail">
                <img alt="Cloud-Trail" src="/assets/service-icon/cloud-trail.png" /> Cloud-Trail
            </div>
        )
      }if (asset.cellData == 'cloud-watch'){
        return (
            <div className="service-icon" title="Cloud-Watch">
                <img alt="Cloud-Watch" src="/assets/service-icon/cloud-watch.png" /> Cloud-Watch
            </div>
        )
      }
      if (asset.cellData == 'sns'){
        return (
            <div className="service-icon" title="SNS">
                <img alt="SNS" src="/assets/service-icon/sns.png" /> SNS
            </div>
        )
      }
      if (asset.cellData == 'rds'){
        return (
            <div className="service-icon" title="RDS">
                <img alt="RDS" src="/assets/service-icon/rds.png" /> RDS
            </div>
        )
      }if (asset.cellData == 'redshift'){
        return (
            <div className="service-icon" title="Redshift">
                <img alt="Redshift" src="/assets/service-icon/redshift.png" /> Redshift
            </div>
        )
      }
      if (asset.cellData == 'cloud-formation'){
        return (
            <div className="service-icon" title="Cloud-Formation">
                <img alt="Cloud-Formation" src="/assets/service-icon/cloudformation.png" /> Cloud-Formation
            </div>
        )
      }
      if (asset.cellData == 'route53'){
        return (
            <div className="service-icon" title="Route53">
                <img alt="Route53" src="/assets/service-icon/route53.png" /> Route53
            </div>
        )
      }
      if (asset.cellData == 'vpc'){
        return (
            <div className="service-icon" title="VPC">
                <img alt="VPC" src="/assets/service-icon/vpc.png" /> VPC
            </div>
        )
      }
    return (
      <div className="service-icon" title="EC2">
          <img alt="EC2" src="/assets/service-icon/ec2.png" /> EC2
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
      this.fetchSecurityIssueSearch(filterData)
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
      this.fetchSecurityIssueSearch(filterData)
      this.updateFilterReducer()
    });
  };




  handleChangeSearch = name => event => {
    this.setState({ filterProgress: true, pageNo: 0, [name]: event.target.value, dataList: [] }, () => {
      const filterData = this.props.filterData
      this.fetchSecurityIssueSearch(filterData)
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
      this.fetchSecurityIssue(filterData)
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
      <div className="container sidebar-container mrL20">
        <div className="sidebar-header">
          <h4>System Analysis Activity</h4>
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
                        height={450}
                        sortBy={sortBy}
                        sort={this.sort}
                        sortDirection={sortDirection}
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
                          dataKey="service"
                          label="Service"
                          headerRenderer={headerRenderer}
                          cellRenderer={this.assetNameCellRenderer}
                          disableSort={false}
                          width={300}
                          flexGrow={1}
                          className="table-td"

                        />

                        <Column
                          dataKey="time_scan"
                          label="Time of Scan"
                          headerRenderer={headerRenderer}
                          disableSort={false}
                          width={300}
                          flexGrow={2}
                          className="table-td"

                        />

                          <Column
                          dataKey="assets_discovered"
                          label="Assets Discovered"
                          headerRenderer={headerRenderer}
                          disableSort={false}
                          width={100}
                          flexGrow={3}
                        />

                      
                        <Column
                          dataKey="assets_modified"
                          label="Assets Modified"
                          headerRenderer={headerRenderer}
                          disableSort={false}
                          width={100}
                          flexGrow={4}
                        />

                        <Column
                          dataKey="assets_deleted"
                          label="Assets Deleted"
                          headerRenderer={headerRenderer}
                          disableSort={false}
                          width={100}
                          flexGrow={5}
                        />

                        <Column
                          dataKey="alerts_discovered"
                          label="Alerts Discovered"
                          headerRenderer={headerRenderer}
                          disableSort={false}
                          width={100}
                          flexGrow={6}
                        />

                        <Column
                          dataKey="alerts_remediated"
                          label="Alerts Remediated"
                          headerRenderer={headerRenderer}
                          disableSort={false}
                          width={100}
                          flexGrow={7}
                        />

                        <Column
                           dataKey=""
                           label="Action"
                          headerRenderer={headerRenderer}
                          cellRenderer={this.viewCellRenderer}
                          disableSort={false}
                          width={200}
                          flexGrow={8}
                          className="table-td"

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