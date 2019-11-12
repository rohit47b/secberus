/*
 * @Author: Virendra Patidar 
 * @Date: 2018-08-09 10:22:57 
 * @Last Modified by: Virendra Patidar
 * @Last Modified time: 2019-02-26 13:17:32
 */
import React, { PureComponent } from 'react'

import Popover from '@material-ui/core/Popover'
import Button from '@material-ui/core/Button'
import Chip from '@material-ui/core/Chip'

import { store } from 'client'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { cloneDeep, find } from "lodash"
import { withRouter } from 'react-router-dom'
import history from 'customHistory'

import Config from 'constants/Config'

import Clouds from './Clouds'
import Accounts from './Accounts'
import Regions from './Regions';

import * as integrationActions from 'actions/integrationAction'
import { setHeaderFilterData } from 'actions/commonAction'
import { setReloadFlagSearchBar } from 'actions/uiAction'
import { setAwsList } from 'actions/commonAction'
import { showMessage } from 'actions/messageAction'
import { setCloudAccounts } from 'actions/loginAction'

import { uiReducerInitialState } from 'reducers/uiReducer'
import STATIC_DATA from 'data/StaticData'

class SearchBar extends PureComponent {
  _mounted = false
  state = {
    anchorEl: null,
    selectCloud: this.props.filterData.selectCloud,
    selectAccount: this.props.filterData.selectAccount,
    activeTab: 'all',
    popoverOpen: false,
    accountList: [],
    cloudList: [],
    defaultCloudList: [
      { name: 'All Clouds', id: 'all', cloudIcon: '/assets/images/cloud_all.png' },
      { name: 'Amazon Web Services', id: 'aws', cloudIcon: '/assets/images/cloud_aws.png' },
      { name: 'Google Cloud Platform', id: 'gcp', cloudIcon: '/assets/images/cloud_gcp.png' },
      { name: 'Azure', id: 'azure', cloudIcon: '/assets/images/cloud_azure.png' },
    ]
  };

  currentValue = this.props.reloadSearchBar

  componentDidMount() {
    this._mounted = false
    this.fetchAws()
    this.unsubscribe = store.subscribe(this.receiveFilterData)
  }

  componentWillUnmount() {
    this._mounted = false
  }

  receiveFilterData = data => {
    const currentState = store.getState()
    const previousValue = this.currentValue
    this.currentValue = currentState.uiReducer.reloadSearchBar

    if (
      this.currentValue &&
      previousValue !== this.currentValue
    ) {
      const reloadSearchBar = cloneDeep(currentState.uiReducer.reloadSearchBar)
      if (reloadSearchBar.flag && this._mounted) {
        this.fetchAws()
      }
    }
  }

  handleSearchOpen = event => {
    this.setState({
      anchorEl: event.currentTarget,
      popoverOpen: true
    });
  };

  handleSearchClose = () => {
    this.setState({
      anchorEl: null,
      popoverOpen: false
    });
  };

  changeActiveTab = (activeTab) => {
    this.setState({ activeTab });
  };

  setSelectCloud = (selectedCloud) => {
    const account = this.state.selectAccount.id !== 'all' ? this.state.selectAccount : this.props.filterData.selectAccount
    //selectedCloud = { name: 'All Clouds', id: 'all', cloudIcon: '/assets/images/cloud_all.png' }
    this.setState({ popoverOpen: false, selectCloud: selectedCloud }, () => {
      let filterData = { selectAccount: account, selectCloud: selectedCloud }
      this.props.setHeaderFilterData(filterData)
      this.changeActiveTab(selectedCloud.id)
    });
  } 

  setSelectAccount = (selectedAccount) => {
    if (!selectedAccount.enabled && selectedAccount.id !== 'all') {
      let message = { message: 'Enable account ' + selectedAccount.name + ' for view data', showSnackbarState: true, variant: 'error' }
      this.props.showMessage(message)
    } else {
      let cloud = this.state.selectCloud.id !== 'all' ? this.state.selectCloud : this.props.filterData.selectCloud
      this.state.defaultCloudList.forEach(function(cloudItem) {
        if (selectedAccount.cloud === cloudItem.id) {
          cloud = cloudItem
        }
      });

      this.setState({ selectAccount: selectedAccount, popoverOpen: false }, () => {
        let filterData = { selectAccount: selectedAccount, selectCloud: cloud }
        this.props.setHeaderFilterData(filterData)
      });
    }
  }
  
  fetchAws = () => {
    this.props.actions.fetchIntegrationList().
      then(response => {
        this._mounted = true
        if (response) {
          let accountList = []
          const cloudList = []
          response.map((item, index) => {
            
            //Find pending account which not run default policy
            const pendingRunPolicyAccount = find(item.accounts, ['default_policy_executed', null], ['default_policy_executed', false])
            if (pendingRunPolicyAccount) {
              localStorage.setItem('isRunDefaultPolicy', false)
              localStorage.setItem('temp_account_id', pendingRunPolicyAccount.id)
              localStorage.setItem('temp_account_name', pendingRunPolicyAccount.account_name)
            } else {
              localStorage.setItem('isRunDefaultPolicy', true)
            }
            accountList = response

            if (cloudList.indexOf(item.cloud) == -1) {
              cloudList.push(item.cloud)
            }
          });

          //Set account and cloud list in reducer
          const awsList = { accountList: accountList, cloudList: cloudList }
          this.props.setAwsList(awsList);
          this.props.setCloudAccounts(awsList.accountList)
          if (this.props.location.pathname === '/app/dashboard/home' && awsList.accountList.length === 0) {
            history.push(`/app/integrations/clouds`)
          }

          this.setState({ accountList: accountList, cloudList: cloudList }, () => {
            if (response.length > 0 && (this.props.filterData.selectAccount.id === 'all' || this.props.reloadSearchBar.flag === true)) {
              //Find active account in account list 
              //const activeAccount = find(accountList, ['status', 'active'])
              //If active account found then set it into header else set default settings
              /*let firstActive = 0
              accountList.forEach(function(account, index) {
                if (index !== 0) {
                  if (account.enabled) {
                    firstActive = index
                  }
                }
              })
              let cloudIndex = 0
              cloudList.forEach(function(cloud, index) {
                if (cloud.id === accountList[firstActive].cloud) {
                  cloudIndex = index
                }
              })
              let filterData = { selectAccount: accountList[firstActive], selectCloud: cloudList[cloudIndex] }
              this.props.setHeaderFilterData(filterData)*/
              /* if (activeAccount) {
                let filterData = { selectAccount: accountList[0], selectCloud: cloudList[0] }
                this.props.setHeaderFilterData(filterData)
              } else {
                this.props.setHeaderFilterData(uiReducerInitialState.filterData)
              } */
              const reloadSearchBar = { flag: false }
              this.props.setReloadFlagSearchBar(reloadSearchBar)
            }

          })
        } else {
          let message = { message: response, showSnackbarState: true, variant: 'error' }
          this.props.showMessage(message)
        }
      });
  }

  render() {
    const { anchorEl, popoverOpen, activeTab, accountList, cloudList, defaultCloudList } = this.state;
    const regionList=STATIC_DATA.REGION_LIST
    const { selectCloud, selectAccount } = this.props.filterData
    return (
      <div className="search-bar">
        {selectCloud &&
          <div>
            <div className="search-select" onClick={this.handleSearchOpen}>
              <span className="caret"><i className="fa fa-angle-down" aria-hidden="true"></i></span>

              <Chip className="white-chip mrR5 cloud-name-serch" label={selectCloud.name} />
              <Chip className="white-chip mrR5" label={selectAccount.name} />
            </div>
            <Popover
              open={popoverOpen}
              anchorEl={anchorEl}
              onClose={this.handleSearchClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              className="popover-search"
            >
              <div className="search-dropdown">
                <div className="btn-sec">
                  <Button variant="contained" className={activeTab === 'all' ? 'btn btn-tab active' : 'btn btn-tab'} onClick={() => this.setSelectCloud(defaultCloudList[0])}>
                    <img className="cloud-icon" alt="All" src='/assets/images/cloud_all.png' />
                    All Clouds
                  </Button>
                  {cloudList.indexOf('aws') !== -1 && <Button variant="contained" className={activeTab === 'aws' ? 'btn btn-tab active' : 'btn btn-tab'} onClick={() => this.setSelectCloud(defaultCloudList[1])}>
                    <img className="cloud-icon" alt="AWS" src='/assets/images/cloud_aws.png' />
                    Amazon Web Services
                  </Button>}
                  {cloudList.indexOf('gcp') !== -1 && <Button variant="contained" className={activeTab === 'gcp' ? 'btn btn-tab active' : 'btn btn-tab'} onClick={() => this.setSelectCloud(defaultCloudList[2])}>
                    <img className="cloud-icon" alt="GCP" src='/assets/images/cloud_gcp.png' />
                    Google Cloud Platform
                  </Button>}
                  {cloudList.indexOf('azure') !== -1 && <Button variant="contained" className={activeTab === 'azure' ? 'btn btn-tab active' : 'btn btn-tab'} onClick={() => this.setSelectCloud(defaultCloudList[3])}>
                    <img className="cloud-icon" alt="Azure" src='/assets/images/cloud_azure.png' />
                    Azure
                  </Button>}
                  
                </div>
                <Accounts accounts={accountList} selectAccount={selectAccount} activeTab={activeTab} setSelectAccount={this.setSelectAccount} />
                <div className="clearfix"></div>
              </div>
            </Popover>
          </div>
        }
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  filterData: state.uiReducer.filterData,
  reloadSearchBar: state.uiReducer.reloadSearchBar,
  awsList: state.commonReducer.awsList
})

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(Object.assign({}, integrationActions), dispatch),
    setHeaderFilterData: filterData => {
      dispatch(setHeaderFilterData(filterData))
    },
    setReloadFlagSearchBar: reloadSearchBar => {
      dispatch(setReloadFlagSearchBar(reloadSearchBar))
    },
    setAwsList: awsList => {
      dispatch(setAwsList(awsList))
    }, setCloudAccounts: cloudAccounts => {
      dispatch(setCloudAccounts(cloudAccounts))
    },
    showMessage: message => {
      dispatch(showMessage(message))
    }

  };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SearchBar));