/*
 * @Author: Virendra Patidar 
 * @Date: 2018-09-27 09:03:40 
 * @Last Modified by: Virendra Patidar
 * @Last Modified time: 2019-05-21 12:48:04
 */
import React, { PureComponent, Fragment } from 'react';

import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { withRouter } from 'react-router-dom'

import { SortDirection } from "react-virtualized";

import { connect } from "react-redux"
import { bindActionCreators } from 'redux'
import { store } from 'client'
import { cloneDeep, find } from "lodash"

import * as assetsActions from 'actions/assetsAction'
import * as alertsActions from 'actions/alertsAction';
import { showMessage } from 'actions/messageAction'
import { setProgressBar, setAccountAssets, setAccountFailedAssets } from 'actions/commonAction'

import { RoundButton } from 'hoc/Button/RoundButton';
import LabelWithHelper from 'hoc/Label/LabelWithHelper';



class AssestResult extends PureComponent {
    _mounted = false
    count_total = 0
    count_failed = 0
    failed_assets = {}

    state = {
        total_assets: 0,
        failed_assets: 0,
        sortBy: "service",
        sortDirection: SortDirection.ASC,
    }
    componentDidMount() {
        this._mounted = true
        const filterData = this.props.filterData
        /* if (filterData.selectAccount.id !== 'all') {
            this.fetchAlertSummery(filterData)
            this.fetchLatestScan(filterData)
        } */
        let selectedAccounts = []
        if (filterData.selectCloud.id !== 'all'){
            this.props.accountList.map(account => {
                if (filterData.selectCloud.id === account.cloud) {
                    selectedAccounts.push(account)
                }
            })
        } else {
            selectedAccounts = this.props.accountList
        }
        this._mounted = false;
        this.fetchAssets(selectedAccounts)
        this.fetchAlerts(selectedAccounts)
        this.unsubscribe = store.subscribe(this.receiveFilterData)
    }

    receiveFilterData = data => {

        const currentState = store.getState()
        const previousValue = this.currentValue
        this.currentValue = currentState.uiReducer.filterData
        if (
            this.currentValue && previousValue !== this.currentValue && this._mounted
        ) {
            const filterData = cloneDeep(currentState.uiReducer.filterData)
            /* if (filterData.selectAccount.id !== 'all' && this._mounted) {
                this.fetchAlertSummery(filterData)
                this.fetchLatestScan(filterData)
            } */
            this.setState({ total_assets: 0 }, () => {
                let selectedAccounts = []
                if (filterData.selectCloud.id !== 'all'){
                    this.props.accountList.map(account => {
                        if (filterData.selectCloud.id === account.cloud) {
                            selectedAccounts.push(account)
                        }
                    })
                } else {
                    selectedAccounts = this.props.accountList
                }
                this.fetchAssets(selectedAccounts)
                this.fetchAlerts(selectedAccounts)
            })
        }
    }

    fetchAssets(selectedAccounts) {
        this.count_total = 0
        selectedAccounts.map(account => {
            let payload = { accountId: account.id, sort_by: this.state.sortBy, sort_order: this.state.sortDirection }
            this.props.actions.fetchAssets(payload).
                then(result => {
                    this._mounted = true
                    if (typeof result !== 'string') {
                        let accountAssets = {}
                        accountAssets[account.id] = result.length
                        this.props.setAccountAssets(accountAssets)
                        this.count_total += result.length
                        this.setState({total_assets: this.count_total})
                    } else {
                        console.log(' Error in fetching count assets :- ', result);
                        this.setState({ loading: false, filterProgress: false })
                    }
                });
        })
    }

    fetchAlerts(selectedAccounts) {
        this.count_failed = 0
        selectedAccounts.map(account => {
          let payload = { accountId: account.id, sort_by: this.state.sortBy, sort_order: this.state.sortDirection, limit: this.state.perPage, offset: this.state.pageNo, priority: this.props.alertTitle ? this.props.alertTitle : '' }
          if (this.props.rule_id !== null) {
            payload['rule_id'] = this.props.rule_id
          }
          if (this.props.asset_id !== null) {
            payload['asset_type'] = this.props.asset_type
          }
          payload['status'] = 'OPEN'
          this.props.actions.fetchAlerts(payload).
            then(result => {
              if (typeof result !== 'string') {
                  result.map(alert => {
                    if (this.failed_assets[account.id] === undefined){
                        this.failed_assets[account.id] = []
                    }
                    if (this.failed_assets[account.id].indexOf(alert.asset.id) === -1){
                        this.count_failed++
                        this.failed_assets[account.id].push(alert.asset.id)
                    }
                  })
                  this.props.setAccountFailedAssets(this.failed_assets)
                  this.setState({failed_assets: this.count_failed})
              } else {
                console.log(' Error in fetching alerts :- ', result);
                this.setState({ loading: false, filterProgress: false })
              }
            });
        })
      }

    render() {
        const { total_assets, failed_assets } = this.state
        return (
            <Paper className="white-paper text-center" elevation={1}>
            <div className="white-paper-head mrB20">
               <strong>Assets (Fail/Total)</strong>
            </div>
            <div className="paper-content">
               <div className="fnt-18">
                    <span className="text-danger">{failed_assets}</span>
                    <span> / {total_assets}</span>
               </div>
            </div>
        </Paper>
        );
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators(Object.assign({}, assetsActions, alertsActions), dispatch),
        showMessage: message => {
            dispatch(showMessage(message))
        }, setProgressBar: isProgress => {
            dispatch(setProgressBar(isProgress))
        }, setAccountAssets: accountAssets => {
            dispatch(setAccountAssets(accountAssets))
        }, setAccountFailedAssets: accountFailedAssets => {
            dispatch(setAccountFailedAssets(accountFailedAssets))
        }
    };
}

const mapStateToProps = (state, ownProps) => ({
    filterData: state.uiReducer.filterData,
    accountList:state.commonReducer.cloud_accounts
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AssestResult))