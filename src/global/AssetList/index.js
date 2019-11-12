/*
 * @Author: Virendra Patidar 
 * @Date: 2018-09-04 14:38:12 
 * @Last Modified by: Virendra Patidar
 * @Last Modified time: 2019-01-08 11:15:23
 */
import React, { PureComponent } from "react"

import {
  Table,
  Column,
  SortDirection
} from "react-virtualized"
import AutoSizer from "react-virtualized/dist/commonjs/AutoSizer"

import Grid from '@material-ui/core/Grid'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Paper from '@material-ui/core/Paper'
import Switch from '@material-ui/core/Switch'
import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import Typography from '@material-ui/core/Typography'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'

import { CardTitle } from 'hoc/Card/CardTitle'

import Loader from 'global/Loader'
import SearchField from 'global/SearchField'
import DevsChart from 'global/DevsChart'
import ErrorBoundary from 'global/ErrorBoundary'

import SecurityIssueBreakdownItem from './SecurityIssueBreakdownItem'
import { sNoCellRenderer, arrayCellRenderer, serviceCellRenderer, headerRenderer, wrapTextCellRenderer, emptyCellRenderer, dateCellRenderer } from 'TableHelper/cellRenderer'

import WithDrawer from 'TableHelper/with-drawer'

import { store } from 'client'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { cloneDeep, debounce } from "lodash"

import * as assetsActions from 'actions/assetsAction'
import * as ruleActions from 'actions/ruleAction'
import * as dashboardActions from 'actions/dashboardAction'
import ConfirmDialogBoxHOC from 'hoc/DialogBox'

import { showMessage } from 'actions/messageAction'
import { setProgressBar } from 'actions/commonAction'

import { PieChart } from 'react-d3-components'

const serviceColumns = {
  'acm': [
    { label: 'S.No.', key: 'S.No.', cellRenderer: sNoCellRenderer, width: 20, customClass: '' },
    { label: 'Name', key: 'name', cellRenderer: emptyCellRenderer, width: 200, customClass: 'truncate-column' },
    { label: 'Domain Name', key: 'domain_name', cellRenderer: emptyCellRenderer, width: 110, customClass: '' },
    { label: 'Status', key: 'status', cellRenderer: emptyCellRenderer, width: 50, customClass: 'truncate-column' },
    { label: 'Region', key: 'region', cellRenderer: emptyCellRenderer, width: 50, customClass: '' },
    { label: 'Security Violations', key: 'security_violations', cellRenderer: emptyCellRenderer, width: 50, customClass: '' }
  ],
  'cloud-formation': [
    { label: 'Stack Name', key: 'name', cellRenderer: emptyCellRenderer, width: 200, customClass: 'truncate-column' },
    { label: 'Stack Id', key: 'stack_id', cellRenderer: emptyCellRenderer, width: 180, customClass: 'truncate-column' },
    { label: 'Created Time', key: 'creation_time', cellRenderer: dateCellRenderer, width: 80, customClass: '' },
    { label: 'Region', key: 'region', cellRenderer: emptyCellRenderer, width: 50, customClass: '' },
    { label: 'status', key: 'status', cellRenderer: emptyCellRenderer, width: 50, customClass: '' }
  ],
  'cloud-front': [
    { label: 'S.No.', key: 'S.No.', cellRenderer: sNoCellRenderer, width: 50, customClass: '' },
    { label: 'ID', key: 'id', cellRenderer: emptyCellRenderer, width: 50, customClass: '' },
    { label: 'Delivery method', key: 'delievery_method', cellRenderer: emptyCellRenderer, width: 50, customClass: '' },
    { label: 'State', key: 'state', cellRenderer: emptyCellRenderer, width: 50, customClass: '' },
    { label: 'Status', key: 'status', cellRenderer: emptyCellRenderer, width: 50, customClass: '' },
    { label: 'Security Violations', key: 'security_violations', cellRenderer: emptyCellRenderer, width: 50, customClass: '' }
  ],
  'cloud-trail': [
    { label: 'S.No.', key: 'S.No.', cellRenderer: sNoCellRenderer, width: 30, customClass: '' },
    { label: 'Name', key: 'name', cellRenderer: emptyCellRenderer, width: 100, customClass: 'truncate-column' },
    { label: 'S3 bucket', key: 'bucket_name', cellRenderer: emptyCellRenderer, width: 100, customClass: 'truncate-column' },
    { label: 'Log Group', key: 'cloud_watch_log_group', cellRenderer: emptyCellRenderer, width: 250, customClass: 'truncate-column' },
    { label: 'Region', key: 'region', cellRenderer: emptyCellRenderer, width: 100, customClass: 'truncate-column' },
    { label: 'Security Violations', key: 'security_violations', cellRenderer: emptyCellRenderer, width: 50, customClass: '' }
  ],
  'cloud-watch': [
    { label: 'Alarms name', key: 'name', cellRenderer: emptyCellRenderer, width: 200, customClass: 'truncate-column' },
    { label: 'Metric Name', key: 'metric_name', cellRenderer: emptyCellRenderer, width: 200, customClass: 'truncate-column' },
    { label: 'Alarm status', key: 'status', cellRenderer: emptyCellRenderer, width: 100, customClass: '' },
    { label: 'Region', key: 'region', cellRenderer: emptyCellRenderer, width: 50, customClass: '' },
  ],
  'ec2': [
    { label: 'S.No.', key: 'S.No.', cellRenderer: sNoCellRenderer, width: 50, customClass: '' },
    { label: 'Instance name', key: 'name', cellRenderer: emptyCellRenderer, width: 200, customClass: 'truncate-column' },
    { label: 'IP Address', key: 'ip_address', cellRenderer: emptyCellRenderer, width: 150, customClass: 'truncate-column' },
    { label: 'Status', key: 'status', cellRenderer: emptyCellRenderer, width: 50, customClass: '' },
    { label: 'Region', key: 'region', cellRenderer: emptyCellRenderer, width: 100, customClass: 'truncate-column' },
    { label: 'Security Violations', key: 'security_violations', cellRenderer: emptyCellRenderer, width: 50, customClass: '' }
  ],
  'elasticsearch': [
    { label: 'S.No.', key: 'S.No.', cellRenderer: sNoCellRenderer, width: 30, customClass: '' },
    { label: 'Domain Name', key: 'domain_name', cellRenderer: emptyCellRenderer, width: 70, customClass: 'truncate-column' },
    { label: 'Elastic version', key: 'elastic_version', cellRenderer: emptyCellRenderer, width: 40, customClass: '' },
    { label: 'Endpoint', key: 'endpoint', cellRenderer: emptyCellRenderer, width: 300, customClass: 'truncate-column' },
    { label: 'Region', key: 'region', cellRenderer: emptyCellRenderer, width: 50, customClass: '' },
    { label: 'Security Violations', key: 'security_violations', cellRenderer: emptyCellRenderer, width: 50, customClass: '' }
  ],
  'iam': [
    { label: 'Users', key: 'user', cellRenderer: emptyCellRenderer, width: 150, customClass: 'truncate-column' },
    { label: 'Group', key: 'groups', cellRenderer: arrayCellRenderer, width: 150, customClass: '' },
    { label: 'Access Key Age', key: 'access_key_age', cellRenderer: emptyCellRenderer, width: 50, customClass: '' },
    { label: 'Password Age', key: 'password_age', cellRenderer: emptyCellRenderer, width: 30, customClass: '' },
    { label: 'MFA', key: 'mfa_enabled', cellRenderer: emptyCellRenderer, width: 30, customClass: '' }
  ],
  'iam_group': [
    { label: 'Group', key: 'name', cellRenderer: emptyCellRenderer, width: 300, customClass: '' },
    { label: 'Users', key: 'users', cellRenderer: arrayCellRenderer, width: 300, customClass: '' },
    { label: 'Policy', key: 'policies', cellRenderer: emptyCellRenderer, width: 50, customClass: '' },
  ],
  'lambda': [
    { label: 'S.No.', key: 'S.No.', cellRenderer: sNoCellRenderer, width: 50, customClass: '' },
    { label: 'Function Name', key: 'name', cellRenderer: emptyCellRenderer, width: 250, customClass: 'truncate-column' },
    { label: 'Runtime', key: 'run_time', cellRenderer: emptyCellRenderer, width: 50, customClass: '' },
    { label: 'Code Size', key: 'code_size', cellRenderer: emptyCellRenderer, width: 60, customClass: '' },
    { label: 'Region', key: 'region', cellRenderer: emptyCellRenderer, width: 50, customClass: '' },
    { label: 'Security Violations', key: 'security_violations', cellRenderer: emptyCellRenderer, width: 50, customClass: '' }
  ],
  'rds': [
    { label: 'Engine', key: 'engine', cellRenderer: emptyCellRenderer, width: 50, customClass: '' },
    { label: 'DB Instance', key: 'name', cellRenderer: emptyCellRenderer, width: 50, customClass: '' },
    { label: 'Subnet Group', key: 'subnet_group', cellRenderer: emptyCellRenderer, width: 100, customClass: '' },
    { label: 'Clusters', key: 'clusters', cellRenderer: emptyCellRenderer, width: 50, customClass: '' },
    { label: 'Region', key: 'region', cellRenderer: emptyCellRenderer, width: 50, customClass: '' },
    { label: 'Class', key: 'class', cellRenderer: emptyCellRenderer, width: 50, customClass: '' }
  ],
  'redshift': [
    { label: 'Cluster Name', key: 'cluster_name', cellRenderer: emptyCellRenderer, width: 100, customClass: '' },
    { label: 'Cluster Status', key: 'cluster_status', cellRenderer: emptyCellRenderer, width: 50, customClass: '' },
    { label: 'Region', key: 'region', cellRenderer: emptyCellRenderer, width: 50, customClass: '' },
    { label: 'Release status', key: 'release_status', cellRenderer: emptyCellRenderer, width: 50, customClass: '' }
  ],
  'route53': [
    { label: 'S.No.', key: 'S.No.', cellRenderer: sNoCellRenderer, width: 50, customClass: '' },
    { label: 'Domain Name', key: 'domain_name', cellRenderer: emptyCellRenderer, width: 50, customClass: '' },
    { label: 'Comment', key: 'comment', cellRenderer: emptyCellRenderer, width: 50, customClass: '' },
    { label: 'Type', key: 'type', cellRenderer: emptyCellRenderer, width: 50, customClass: '' },
    { label: 'Record Set Count', key: 'record_set_count', cellRenderer: emptyCellRenderer, width: 50, customClass: '' },
    { label: 'Security Violations', key: 'security_violations', cellRenderer: emptyCellRenderer, width: 50, customClass: '' }
  ],
  's3': [
    { label: 'Bucket Name', key: 'name', cellRenderer: emptyCellRenderer, width: 200, customClass: 'truncate-column' },
    { label: 'Access', key: 'access', cellRenderer: emptyCellRenderer, width: 50, customClass: '' },
    { label: 'Date Created', key: 'created_at', cellRenderer: dateCellRenderer, width: 90, customClass: '' },
    { label: 'Region', key: 'region', cellRenderer: emptyCellRenderer, width: 50, customClass: '' },
    { label: 'Security Violations', key: 'security_violations', cellRenderer: emptyCellRenderer, width: 50, customClass: '' }
  ],
  'sns': [
    { label: 'Topic Name', key: 'topic', cellRenderer: emptyCellRenderer, width: 200, customClass: 'truncate-column' },
    { label: 'ARN', key: 'arn', cellRenderer: emptyCellRenderer, width: 50, customClass: '' },
    { label: 'Application', key: 'application', cellRenderer: emptyCellRenderer, width: 50, customClass: '' },
    { label: 'Subscription ', key: 'subscriptions', cellRenderer: emptyCellRenderer, width: 50, customClass: '' },
    { label: 'Region', key: 'region', cellRenderer: emptyCellRenderer, width: 50, customClass: '' },
    { label: 'Security Violations', key: 'security_violations', cellRenderer: emptyCellRenderer, width: 50, customClass: '' }
  ],
  'sqs': [
    { label: 'S.No.', key: 'S.No.', cellRenderer: sNoCellRenderer, width: 30, customClass: '' },
    { label: 'Name', key: 'name', cellRenderer: emptyCellRenderer, width: 100, customClass: '' },
    { label: 'Queue Type', key: 'queue_type', cellRenderer: emptyCellRenderer, width: 50, customClass: '' },
    { label: 'Time Created ', key: 'created_at', cellRenderer: emptyCellRenderer, width: 50, customClass: '' },
    { label: 'Region', key: 'region', cellRenderer: emptyCellRenderer, width: 50, customClass: '' },
    { label: 'Security Violations', key: 'security_violations', cellRenderer: emptyCellRenderer, width: 50, customClass: '' }
  ],
  'vpc': [
    { label: 'VPC Name', key: 'name', cellRenderer: emptyCellRenderer, width: 250, customClass: 'truncate-column' },
    { label: 'VPC ID', key: 'vpc_id', cellRenderer: emptyCellRenderer, width: 150, customClass: 'truncate-column' },
    { label: 'CIDR Block ', key: 'cidr_block', cellRenderer: emptyCellRenderer, width: 50, customClass: '' },
    { label: 'Region', key: 'region', cellRenderer: emptyCellRenderer, width: 50, customClass: '' },
  ]
}

class AssetList extends PureComponent {
  _mounted = false
  state = {
    // Table attribute
    headerHeight: 39,
    rowHeight: 25,
    rowCount: 0,
    height: 450,
    sortBy: "status",
    sortDirection: SortDirection.DESC,
    dataList: [],
    groupdataList: [],
    sgdataList: [],
    volumesdataList: [],
    asgdataList: [],
    lbdataList: [],

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
    filterProgress: false,

    // Display attribute
    graphData: '',
    openGraphBreakdown: false,
    pieChartData: [],
    description: '',
    sum: 0,
    count: 10,
    securityIssueByService: { count: 0, data: [] },

    openDialog: false,

    assetValue: '',
    assetKey: '',
    excluded: false,
    service: '',
    service_name: ''
  };

  //Set current search bar filter data 
  currentValue = this.props.filterData

  //Debounce due to search
  fetchAssets = debounce(this.fetchAssets, 500);

  componentDidMount() {
    this._mounted = true
    this.props.setProgressBar(true);
    const filterData = this.props.filterData
    if (filterData.selectAccount.id !== 'all' && filterData.selectAccount.id !== undefined) {
      this._mounted = false
      this.fetchIssues(filterData)
      this.fetchIssuesByService(filterData)
    } else {
      this.props.setProgressBar(false);
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
      this.props.setProgressBar(true);
      const filterData = cloneDeep(currentState.uiReducer.filterData)
      if (filterData.selectAccount.id !== 'all' && this._mounted) {
        this.setState({
          securityIssueByService: { count: 0, data: [] }, graphData: '',
          openGraphBreakdown: false,
          pieChartData: [],
          description: '',
          sum: 0,
          count: 10,
          service: '',
          dataList: []
        }, () => {
          this.fetchIssues(filterData)
          this.fetchIssuesByService(filterData)
        })
      } else {
        this.props.setProgressBar(false);
      }
    }
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
        this._mounted = true
        if (result.success) {
          this.setState({ IssuesdData: result.data }, () => {
            this.setDataIssue();
          })
        } else {
          let message = { message: result, showSnackbarState: true, variant: 'error' }
          this.props.showMessage(message)
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
        this._mounted = true
        if (result.success) {
          this.setState({ IssuerServiceData: result.data }, () => {
            this.setDataIssueService();
            this.props.setProgressBar(false);
          })
        } else {
          let message = { message: result, showSnackbarState: true, variant: 'error' }
          this.props.showMessage(message)
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

    let payload1 = {
      "sort": this.state.sortDirection === SortDirection.ASC,
      "search": this.state.search,
      "account_id": filterData.selectAccount.id,
      "sort_by": this.state.sortBy,
      "page": this.state.pageNo,
    }

    let payload = {
      "account_id": filterData.selectAccount.id,
      "service": this.state.service,
    }


    if (this.state.category[0] !== 'Select Asset Type') {
      payload1['service'] = this.state.service
    }
    this.setState({ filterProgress: true })
    this.props.actions.fetchServiceAssets(payload).
      then(result => {
        if (this._mounted) {
          if (result.success) {
            this.props.setProgressBar(false);
            if (this.state.service === 'iam') {
              this.iamServiceDataSet(result.data)
            }
            // else if (this.state.service === 'ec2') {
            //   this.ec2ServiceDataSet(result.data)
            // } 
            else {
              this.setState({ filterProgress: false, dataList: this.state.dataList.concat(result.data), loaded: true, isMoreData: result.data.length > 0 });
            }

          } else {
            this.props.setProgressBar(false);
            this.setState({ filterProgress: false, loaded: true });
            if (typeof result === 'string') {
              let message = { message: result, showSnackbarState: true, variant: 'error' }
              this.props.showMessage(message)
            }
          }
        }
      });
  }

  iamServiceDataSet = (data) => {
    if (data[0].users_data !== undefined) {
      this.setState({ filterProgress: false, dataList: data[0].users_data, groupdataList: data[0].group_data, loaded: true });
    }
  }

  ec2ServiceDataSet = (data) => {
    if (data[0].instance !== undefined) {
      this.setState({
        filterProgress: false,
        dataList: data[0].instance,
        sgdataList: data[0].SG,
        volumesdataList: data[0].volumes,
        asgdataList: data[0].auto_scaling_group,
        lbdataList: data[0].load_balancer,
        loaded: true
      });
    }
  }

  setDataIssue = () => {
    const data = this.state.IssuesdData;
    this.setState({ securityIssue: { count: data.count, data: data.data } })
  }

  setDataIssueService = () => {
    const data = this.state.IssuerServiceData;
    this.setState({ securityIssueByService: { count: data.count, data: data.data } }, () => {

    })
  }

  //  ------------------- API Call end----------------------


  //  -------------------Table helper method----------------------

  noRowsRenderer = () => {
    if (!this.state.filterProgress) {
      return (<div className="data-not-found">
        <span>No assets for this service in Cloud Environment</span>
      </div>)
    } else if (this.state.filterProgress && !this.props.isProgress) {
      return <Loader />
    }
  }

  _isRowLoaded = ({ index }) => {
    return !!this.state.dataList[index];
  }


  actionCellRenderer = ({ cellData }) => {
    return (
      <div>
        <select className="custom-select">
          <option>Action</option>
          <option>Add</option>
          <option>Update</option>
        </select>
      </div>
    );
  };


  nameCellRenderer = ({ cellData }) => {
    return (
      <div>
        <a href="javascript:void(0)"> {cellData}</a>
      </div>
    );
  };


  _loadMoreRows = ({ startIndex, stopIndex }) => {
    let pageNo = Math.floor((stopIndex) / this.state.perPage)
    if (pageNo + 1 !== this.state.pageNo && this.state.isMoreData) {
      this.setState({ pageNo: pageNo + 1 }, () => {
        const filterData = this.props.filterData
        // this.fetchAssets(filterData)
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
    this.setState({ sortBy, sortDirection, pageNo: 0, dataList: [], isMoreData: true }, () => {
      const filterData = this.props.filterData
      this.fetchAssets(filterData)
    });
  }

  statusCellRenderer = ({ rowData, cellData, rowIndex }) => {
    let boxClass = ["switch-green"];
    if (cellData === undefined || cellData === true || cellData === null || cellData === true) {
      boxClass.push('active');
    }
    const isChecked = cellData === undefined || cellData === null || cellData === 'true' || cellData === true ? true : false
    if (rowData.value === undefined || rowData.key === undefined) {
      return (
        <div>
          <Switch className={boxClass.join(' ')} checked={isChecked} disabled />
        </div>
      );
    } else {
      return (
        <div>
          <Switch className={boxClass.join(' ')} checked={isChecked} onChange={() => this.statusChangeDialog(cellData, rowIndex, rowData.value, rowData.key)} />
        </div>
      );
    }
  };

  //  ------------------- Table helper method end----------------------

  //  ------------------- Logic method start----------------------

  statusChangeDialog = (excluded, rowIndex, assetValue, assetKey) => {
    this.setState({ excluded, openDialog: true, rowIndex, assetValue, assetKey });
  }

  handleDialogClose = () => {
    this.setState({ openDialog: false });
  };

  assetAlertChange = () => {
    this.assetAlertChangeUpdate()
    this.setState({ openDialog: false });
  }

  assetAlertChangeUpdate() {

    let payload = {
      "value": this.state.assetValue,
      "excluded": !(this.state.excluded === null ? true : this.state.excluded),
      "account_id": this.props.filterData.selectAccount.id,
      "key": this.state.assetKey
    }

    this.props.setProgressBar(true);
    this.props.actions.assetAlertChangeUpdate(payload).
      then(result => {
        if (this._mounted) {
          if (result.success) {
            let message = { message: result.message, showSnackbarState: true, variant: 'success' }
            this.props.showMessage(message)
            if (this.state.service === 'iam') {
              const filterData = this.props.filterData
              this.fetchAssets(filterData)
            } else {
              const newDataList = this.state.dataList.map((row, sidx) => {
                if (this.state.assetValue !== row.value) {
                  return row;
                } else {
                  const currentStatus = row.excluded === undefined || row.excluded === null ? true : row.excluded;
                  return { ...row, excluded: !currentStatus };
                }
              });
              this.setState({ dataList: newDataList, schdulerId: 0, rowIndex: 0, openDialog: false });

            }
          } else {
            let message = { message: result.message, showSnackbarState: true, variant: 'error' }
            this.props.showMessage(message)
          }
        }
        this.props.setProgressBar(false);
      });
  }

  handleSelectbox = name => event => {
    this.setState({ pageNo: 0, [name]: event.target.value, dataList: [], filterProgress: true, isMoreData: true }, () => {
      const filterData = this.props.filterData
      this.fetchAssets(filterData)
    });
  };

  handleCategorySelect = name => event => {
    let value = event.target.value;
    if (value.length === 0) {
      value[0] = 'Select Asset Type'
    }
    else if (value[0] === 'Select Asset Type') {
      value.splice(0, 1)
    }

    this.setState({ pageNo: 0, category: value, dataList: [], filterProgress: true, isMoreData: true }, () => {
      const filterData = this.props.filterData
      this.fetchAssets(filterData)
    });
  };



  updateIssueType = (issueType) => {
    this.props.setProgressBar(true);
    this.setState({ issueType, pageNo: 0, dataList: [], isMoreData: true }, () => {
      const filterData = this.props.filterData
      this.fetchAssets(filterData)
    });

  }

  toggleDrawer = (data, description, sum, service, graphData, service_name) => {
    this.setState(prevState => ({
      service: service,
      service_name: service_name,
      openGraphBreakdown: true || prevState.openGraphBreakdown === false,
      pieChartData: data[0], description, sum, graphData, filterProgress: true,
      dataList: [], pageNo: 1
    }), () => {
      this.fetchAssets(this.props.filterData)
    });
  }


  renderColumn = (service) => {
    if (service) {
      return (serviceColumns[service].map((column, index) => {
        return <Column key={column.key}
          className={column.customClass}
          dataKey={column.key}
          label={column.label}
          headerRenderer={headerRenderer}
          cellRenderer={column.cellRenderer}
          disableSort={true}
          width={column.width}
          flexGrow={index}
        />
      })
      )
    } else {
      return []
    }
  }


  detailRenderer = (details) => {
    return (
      <div className="scroll-bar">{JSON.stringify(details)}</div>
    );
  }
  //  ------------------- Logic method end----------------------

  render() {
    const {
      headerHeight,
      height,
      sortBy,
      sortDirection,
      dataList,
      category,
      perPage,
      securityIssueByService,
      openGraphBreakdown,
      pieChartData,
      description,
      sum,
      graphData,
      service,
      service_name,
      openDialog,
      excluded,
      groupdataList,
      sgdataList,
      volumesdataList,
      asgdataList,
      lbdataList,
    } = this.state;
    const sortedList = dataList;
    const groupSortedList = groupdataList;
    const securityGroupSortedList = sgdataList;
    const volumesSortedList = volumesdataList;
    const autoScalingGroupSortedList = asgdataList;
    const loadBalancerSortedList = lbdataList;

    const scale = d3.scale.ordinal().range(['#6E6E6E', '#ec4e4e', '#19c681']);

    const dialogMessage = excluded === null || excluded === true ? 'Do you want to exclude this asset from every alert ?' : 'Do you want to include this asset to every alert ?'

    return (
      <div className="container">
        <Grid container spacing={24} className="mrB5">
          <Grid item sm={12} className="pdB10">
            <h3 className="mr0 main-heading">Assets</h3>
          </Grid>
        </Grid>
        <Grid container spacing={24} className="mrB15">
          <Grid item sm={3}>
            <ErrorBoundary error="error-boundary">
              {/* <ExpansionPanel className="expand-panel">
                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography >Database</Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails> */}
                  <Typography>
                    {securityIssueByService.data.map((issueBreakdown, index) => <div key={issueBreakdown.service}><SecurityIssueBreakdownItem index={index} toggleDrawer={this.toggleDrawer} key={issueBreakdown.issueType} issueBreakdown={issueBreakdown} activeService={service} /> </div>)}
                  </Typography>
                {/* </ExpansionPanelDetails>
              </ExpansionPanel> */}
            </ErrorBoundary>
          </Grid>
          <Grid item sm={9}>
            <Card className="card-wizard card-assets-info card-panel">
              <CardTitle text={<span> Security Issue Breakdown by Assets & Services - {service_name ? service_name : service}</span>} />
              <CardContent className="card-body">
                <Grid container spacing={24}>
                  <Grid item sm={5}>
                    <ErrorBoundary error="error-boundary">
                      {openGraphBreakdown &&
                        <div>
                          <div className="chart-info">
                            <h5 className="mrT0 mrB5">Security Issue Breakdown - {sum}</h5>
                            <div className="text-center">
                              <PieChart
                                data={pieChartData}
                                width={350}
                                height={250}
                                hideLabels={false}
                                margin={{ top: 10, bottom: 10, left: 20, right: 50 }}
                                colorScale={scale}

                              />
                            </div>
                          </div>
                          <div className="chart-desc">
                            <h3 className="mrB5">{service_name ? service_name : service}</h3>
                            {description}
                          </div>
                        </div>
                      }
                    </ErrorBoundary>
                  </Grid>
                  <Grid item sm={7}>
                    <Paper elevation={1} className="gray-box">
                      {(service && service !== '') && <ErrorBoundary error="error-boundary">
                        <DevsChart service={service} />
                      </ErrorBoundary>
                      }
                    </Paper>
                  </Grid>
                </Grid>

                <Grid container spacing={24} className="grid-container mrB5" justify="flex-end">
                  <Grid item sm={3} className="pdB0">
                     <div className="d-flex">
                        <SearchField handleChange={this.handleSelectbox} />
                     </div> 
                  </Grid>
                  <Grid item sm={12}>
                    <ErrorBoundary error="error-boundary">
                      {service === 'iam' && <h4 className="mrT0 mrB5">User Section</h4>}
                      {service === 'ec2' && <h4 className="mrT0 mrB5">Instance Section</h4>}
                      <WithDrawer
                        drawerContent={(rowProps) => {
                          return (<div className="sub-table">{this.detailRenderer(rowProps.rowData.asset_detail)}</div>);
                        }}
                        rowsDimensions={dataList.map((dataItem) => ({ collapsedHeight: 1, expandedHeight: 1 }))}
                      >
                        {({ rowHeight, rowRenderer, toggleDrawer, toggleDrawerWithAnimation, setTableRef }) => (

                          <AutoSizer disableHeight >
                            {({ width }) => (
                              <Table
                                ref={setTableRef}
                                headerHeight={headerHeight}
                                height={480}
                                rowCount={dataList.length}
                                rowGetter={({ index }) => sortedList[index]}
                                rowHeight={rowHeight}
                                sort={this.sort}
                                sortBy={sortBy}
                                sortDirection={sortDirection}
                                rowRenderer={rowRenderer}
                                noRowsRenderer={this.noRowsRenderer}
                                width={width}
                                className="table-border data-table table-sec table-truncate table-expand table-custom"
                              >
                                {this.renderColumn(service)}

                                <Column
                                  dataKey="excluded"
                                  label="Excluded"
                                  headerRenderer={headerRenderer}
                                  cellRenderer={this.statusCellRenderer}
                                  disableSort={true}
                                  width={40}
                                  flexGrow={7}
                                />

                                <Column
                                  label="detail"
                                  dataKey="detail"
                                  width={20}
                                  headerRenderer={headerRenderer}
                                  flexGrow={8}
                                  cellRenderer={
                                    ({ cellData, rowIndex }) => {
                                      return (
                                        <div>
                                          <a title="View Details" href="javascript:void(0)" onClick={() => toggleDrawerWithAnimation(rowIndex)}> <i className="fa fa-eye" aria-hidden="true"></i></a>
                                        </div>
                                      );
                                    }
                                  }
                                />
                              </Table>
                            )}
                          </AutoSizer>

                        )}
                      </WithDrawer>
                    </ErrorBoundary>
                  </Grid>
                </Grid>


                {service === 'iam' && <Grid container spacing={24}>
                  <Grid item sm={12}>
                    <ErrorBoundary error="error-boundary">
                      <h4 className="mrT0 mrB5">Group Section</h4>
                      <WithDrawer
                        drawerContent={(rowProps) => {
                          return (<div className="sub-table">{this.detailRenderer(rowProps.rowData.asset_detail)}</div>);
                        }}
                        rowsDimensions={groupdataList.map((dataItem) => ({ collapsedHeight: 39, expandedHeight: 200 }))}
                      >
                        {({ rowHeight, rowRenderer, toggleDrawer, toggleDrawerWithAnimation, setTableRef }) => (

                          <AutoSizer disableHeight>
                            {({ width }) => (
                              <Table
                                ref={setTableRef}
                                headerHeight={headerHeight}
                                height={480}
                                rowCount={groupdataList.length}
                                rowGetter={({ index }) => groupSortedList[index]}
                                rowHeight={rowHeight}
                                sort={this.sort}
                                sortBy={sortBy}
                                sortDirection={sortDirection}
                                rowRenderer={rowRenderer}
                                noRowsRenderer={this.noRowsRenderer}
                                width={width}
                                className="data-table table-sec table-truncate table-custom"
                              >
                                {this.renderColumn('iam_group')}

                                <Column
                                  dataKey="excluded"
                                  label="Excluded"
                                  headerRenderer={headerRenderer}
                                  cellRenderer={this.statusCellRenderer}
                                  disableSort={true}
                                  width={40}
                                  flexGrow={7}
                                />

                                <Column
                                  label="detail"
                                  dataKey="detail"
                                  width={20}
                                  headerRenderer={headerRenderer}
                                  flexGrow={8}
                                  cellRenderer={
                                    ({ cellData, rowIndex }) => {
                                      return (
                                        <div>
                                          <a title="View Details" href="javascript:void(0)" onClick={() => toggleDrawerWithAnimation(rowIndex)}> <i className="fa fa-eye" aria-hidden="true"></i></a>
                                        </div>
                                      );
                                    }
                                  }
                                />
                              </Table>
                            )}
                          </AutoSizer>

                        )}
                      </WithDrawer>
                    </ErrorBoundary>
                  </Grid>
                </Grid>
                }
                <ConfirmDialogBoxHOC
                  isOpen={openDialog}
                  handleDialogClose={this.handleDialogClose}
                  title={'Confirmation'}
                  content={dialogMessage}
                  successDialogEvent={this.assetAlertChange}
                />

              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(Object.assign({}, assetsActions, ruleActions, dashboardActions), dispatch),
    showMessage: message => {
      dispatch(showMessage(message))
    }, setProgressBar: isProgress => {
      dispatch(setProgressBar(isProgress))
    }
  };
}

const mapStateToProps = (state, ownProps) => ({
  filterData: state.uiReducer.filterData,
  isProgress: state.commonReducer.isProgress
})

export default withRouter((connect(mapStateToProps, mapDispatchToProps)(AssetList)));