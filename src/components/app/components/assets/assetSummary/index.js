/*
 * @Author: Virendra Patidar 
 * @Date: 2018-11-16 14:55:42 
 * @Last Modified by: Virendra Patidar
 * @Last Modified time: 2019-05-22 13:59:11
 */
import React, { PureComponent } from 'react'
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import Input from '@material-ui/core/Input';
import CurrentState from './CurrentState'
import AssetHistory from './AssetHistory'
import { Button } from '@material-ui/core';
import history from 'customHistory'
import * as assetsActions from 'actions/assetsAction'
import * as alertsActions from 'actions/alertsAction';
import { withRouter } from 'react-router-dom'
import { SortDirection } from "react-virtualized";

import { connect } from "react-redux"
import { bindActionCreators } from 'redux'
import { fetchServiceIconPath } from 'utils/serviceIcon';

class AssetSummary extends PureComponent {

    state={
        value:0,
        asset: {},
        loading: true,
        assetType: '', 
        assetTypeName: '',
        assetName: '',
        sortBy: "priority",
        sortDirection: SortDirection.DESC,
        alerts: [],
        mapAssetType: {
            'ec2_image': 'assets-compute',
            'acm_cetificate': 'assets-compute',
            'ec2_elastic_ip_address': 'assets-compute',
            'ec2_instance': 'assets-compute',
            'lambda_function': 'assets-compute',
            'elb_load_balancer': 'assets-compute',
            'ec2_security_group': 'assets-compute',
            'ebs_volume': 'assets-compute',
            'vpc': 'assets-compute',
            'vpc_flow_log': 'assets-compute',
            'iam_group': 'assets-identity-management',
            'kms_key': 'assets-identity-management',
            'iam_password_policy': 'assets-identity-management',
            'iam_policy': 'assets-identity-management',
            'iam_role': 'assets-identity-management',
            'iam_user': 'assets-identity-management',
            'cloudtrail': 'assets-logging-monitoring',
            'cw_alarms': 'assets-logging-monitoring',
            'rds_cluster_snapshot': 'assets-storage',
            'dynamo_table': 'assets-storage',
            'rds_event_subscription': 'assets-storage',
            'rds_instance': 'assets-storage',
            'rds_backup': 'assets-storage',
            'redshift_cluster': 'assets-storage',
            'redshift_parameter_group': 'assets-storage',
            's3_bucket': 'assets-storage',
            's3_bucket_acl': 'assets-storage',
            's3_bucket_cors': 'assets-storage',
            's3_bucket_policy_stmt': 'assets-storage',
            'rds_snapshot': 'assets-storage',
            'cf_distribution': 'assets-transit',
            'cf_distribution_behavior': 'assets-transit',
            'sqs_queue': 'assets-transit',
            'route53_zone': 'assets-transit',
            'sns_topic': 'assets-transit',
        },
        backUrl: undefined,
        assetId: '',
        backUrlState: undefined
    }

    componentDidMount() {
        this._mounted = true
        const location = window.location.href.split('/')
        const assetId = location[location.length-1]
        const filterData = this.props.filterData
        if (this.props.location.state !== undefined) {
            this.setState({backUrl: this.props.location.state.backUrl, backUrlState: this.props.location.state.backUrlState})
        }
        this.fetchAsset(filterData, assetId)
    }

    fetchAsset(filterData, assetId) {
        let accountId = undefined
        if (filterData.selectAccount.id === 'all' || filterData.selectAccount.id === undefined) {
            if (this.props.location.state !== undefined && this.props.location.state.alert !== undefined) {
                let selectedAccount = {}
                this.props.awsList.accountList.map(account => {
                    if (account.id === this.props.location.state.alert.cloud_account_id) {
                        selectedAccount = account
                        let selectedCloud = ''
                          this.state.defaultCloudList.map(cloud => {
                            if (selectedAccount.cloud === cloud.id) {
                                selectedCloud = cloud
                                this.props.setHeaderFilterData({ selectAccount: selectedAccount, selectCloud: selectedCloud })
                            }
                        })
                    }
                })
                accountId = this.props.location.state.alert.cloud_account_id
            } else {
                history.push('/app/multi-tenancy-dashboard/home')
            }
        } else {
            accountId = filterData.selectAccount.id
        }
        let payload = { cloud_account_id: accountId, id: assetId }
        this.props.actions.fetchAsset(payload).
            then(result => {
                if (typeof result !== 'string') {
                    const assetType = result.asset_type.cloud_service_name
                    const assetTypeName = result.asset_type.name
                    const assetName = result.data[result.asset_type.discriminator[0]]
                    this.setState({assetType, assetTypeName, assetName, asset: result})
                    this.fetchAlerts(accountId, result.id)
                } else {
                    console.log(' Error in fetching assets :- ', result);
                    //this.setState({ loading: false })
                }
            });
    }

    fetchAlerts(accountId, assetId) {
        let payload = { accountId: accountId, sort_by: this.state.sortBy, sort_order: this.state.sortDirection, status: 'OPEN', asset_id: assetId}
        this.props.actions.fetchAlerts(payload).
        then(result => {
            this._mounted = true
            if (typeof result !== 'string') {
                this.setState({ alerts: result, loading: false })
            } else {
                console.log(' Error in fetching alerts :- ', result);
                this.setState({ loading: false })
            }
        });
    }
  
    handleChangeTab = (event, value) => {
        this.setState({ value: event.target.value });
    }

    render() {
        const { value, asset, loading, assetType, assetTypeName, assetName, alerts, mapAssetType, backUrl, backUrlState } = this.state
        console.log('backUrl-->', backUrl)
        console.log('assetTypeName-->', assetTypeName)
        return (
            <Card className="card-wizard card-panel card-inner card-single-asset">
                <div className="card-title">
                    <div className="d-flex align-item-center width-100">
                        <h3 className="card-heading flexGrow1 ">Assets / <img src={fetchServiceIconPath(assetType)} width="12"/> { assetType.toUpperCase() } / { assetName }</h3>
                        {loading === false && <Button  
                        onClick={() => history.push({pathname: backUrl !== undefined ? backUrl : '/app/'+mapAssetType[assetTypeName], 
                        state: { backUrlState }})} 
                        className="btn btn-primary min-width-80 mrT15">
                            <i className="fa fa-arrow-left mrR5"></i>  Back</Button> 
                        }
                    </div>
                   
                    <FormControl className="multi-select single-select">
                        <Select
                            value={value}
                            name="tabs"
                            onChange={this.handleChangeTab}
                            input={<Input id="select-multiple" />}
                            className="select-feild"
                            MenuProps={{
                                className: 'select-asset-dropdown'
                            }}
                        >
                            <MenuItem className="select-item select-item-text" key={0} value={0}>
                                <span>Current State</span>
                            </MenuItem>
                            <MenuItem className="select-item select-item-text" key={1} value={1}>
                                <span>Asset History</span>
                            </MenuItem>
                        </Select>
                    </FormControl>
                </div>
                {(loading === false && value === 0) &&
                    <CardContent className="card-body">
                        <CurrentState asset={asset} alerts={alerts}/>
                    </CardContent>
                }

                {(loading === false && value === 1) &&
                    <CardContent className="card-body">
                        <AssetHistory/>
                    </CardContent>
                }
            </Card>
        )
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators(Object.assign({}, assetsActions, alertsActions), dispatch),
        showMessage: message => {
            dispatch(showMessage(message))
        }, setProgressBar: isProgress => {
            dispatch(setProgressBar(isProgress))
        }, setHeaderFilterData: filterData => {
            dispatch(setHeaderFilterData(filterData))
        },
    };
}

const mapStateToProps = (state, ownProps) => ({
    filterData: state.uiReducer.filterData,
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AssetSummary))