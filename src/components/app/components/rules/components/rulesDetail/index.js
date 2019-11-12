/*
 * @Author: Virendra Patidar 
 * @Date: 2018-11-16 14:55:42 
 * @Last Modified by: Virendra Patidar
 * @Last Modified time: 2019-04-23 16:24:12
 */
import React, { PureComponent } from 'react'
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import { Typography } from '@material-ui/core';
import { connect } from "react-redux";
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import { store } from 'client';

import AssetsWrapper from 'global/AssetsWrapper';
import Button from '@material-ui/core/Button'
import history from 'customHistory'
import * as assetsActions from 'actions/assetsAction';
import { setProgressBar, setCountAssets } from 'actions/commonAction';
import { showMessage } from 'actions/messageAction';
import * as alertsActions from 'actions/alertsAction';
import { cloneDeep } from "lodash"
import { fetchServiceIconPath } from 'utils/serviceIcon';

class RuleDetail extends PureComponent {
    state = {
        search: '',
        value: 0,
        completed: 0,
        activeAssetName: 'Total',
        right: false,
        currentRule: {},
        currentAssetType: '',
        totalAssets: 0,
        resourcesFailed: 0,
        resourcesPassed: 0,
        resourcesFailedList: [],
        steps: [],
        backUrl: undefined,
        backUrlState: undefined
    }

    componentDidMount() {
        this._mounted = true
        //this.timer = setInterval(this.progress, 500);
        const filterData = this.props.filterData
        if (this.props.location.state !== undefined) {
            this.setState({backUrl: this.props.location.state.backUrl, backUrlState: this.props.location.state.backUrlState})
            if (this.props.location.state.rule !== undefined) {
                this.setState({ currentRule: this.props.location.state.rule, currentAssetType: this.props.location.state.asset_type })
                this.buildSteps(this.props.location.state.rule.remediation_steps)
                if (filterData.selectAccount.id !== 'all' && filterData.selectAccount.id !== undefined) {
                    this._mounted = false
                    this.fetchAssets(filterData)
                } else {
                    this.setState({ filterProgress: false })
                }
            }
        }

        this.unsubscribe = store.subscribe(this.receiveFilterData)
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
                this.fetchAssets(filterData)
            }
        }
    }

    buildSteps(blob) {
        if (blob) {
            const steps = blob.toString().split(/\s*\d+\.\s*/).filter(s => !!s)
            this.setState({ steps })
        }
    }

    componentWillUnmount() {
        clearInterval(this.timer);
    }

    searchHandler = name => event => {
        this.setState({ search: event.target.value })
    }

    progress = () => {
        const { completed } = this.state;
        if (completed === 100) {
            this.setState({ completed: 0 });
        } else {
            const diff = Math.random() * 10;
            this.setState({ completed: Math.min(completed + diff, 100) });
        }
    };

    handleChangeTab = (event, value) => {
        this.setState({ value });
    }

    toggleDrawer = (side, open) => () => {
        this.setState({
            [side]: open,
        });
    };

    filterAssets = (assetName) => {
        this.setState({ activeAssetName: assetName })
    }

    fetchAlerts(filterData) {
        let payload = { accountId: filterData.selectAccount.id, sort_by: 'priority', sort_order: 'ASC', status: 'OPEN', rule_id: this.props.location.state.rule.id }
        this.props.actions.fetchAlerts(payload).
            then(result => {
                if (typeof result !== 'string') {
                    let failed = []
                    let resourcesFailedList = []
                    result.forEach(function (alert) {
                        if (failed.indexOf(alert.asset.id) === -1) {
                            failed.push(alert.asset.id)
                            resourcesFailedList.push(alert.asset)
                        }
                    });
                    this.setState({ resourcesFailed: failed.length, resourcesPassed: this.state.totalAssets - failed.length, resourcesFailedList })
                } else {
                    console.log(' Error in fetching alerts :- ', result);
                    this.setState({ loading: false, filterProgress: false })
                }
            });
    }

    fetchAssets(filterData) {
        let payload = { accountId: filterData.selectAccount.id, sort_by: 'priority', sort_order: 'ASC', asset_type: this.props.location.state.rule.asset_type_id }

        this.props.actions.fetchAssets(payload).
            then(result => {
                this._mounted = true
                if (typeof result !== 'string') {
                    let resourcesFailed = 0
                    let resourcesPassed = 0
                    this.setState({ totalAssets: result.length })
                    this.fetchAlerts(filterData)
                } else {
                    console.log(' Error in fetching alerts :- ', result);
                    this.setState({ loading: false, filterProgress: false })
                }
            });
    }

    render() {
        const { value, activeAssetName, right, currentRule, resourcesFailed, resourcesPassed, resourcesFailedList, currentAssetType, steps, backUrl, backUrlState } = this.state
        return (

            <Card className="card-wizard card-panel card-inner card-rule">
                <div className="card-title">
                    <span>
                        <h3 className="card-heading"><strong>Rules</strong>/{currentRule.label}</h3>
                    </span>
                    <Button
                        className="btn btn-primary min-width-80 mrT10"
                        variant="contained"
                        color="primary"
                        onClick={() => history.push({pathname: backUrl !== undefined ? backUrl : '/app/rules', state: { backUrlState }})}
                    >
                        <i className="fa fa-arrow-left mrR5"></i> Back
                            </Button>
                </div>
                <CardContent className="card-body">
                    <Grid container spacing={24}>

                        <Grid item sm={12}>
                            <div className="assets-wrapper mrB20">
                                <AssetsWrapper activeAssetName={activeAssetName} filterAssets={this.filterAssets} progressBarColorClass={"asset-progress-bar-green"} addClass={"asset-border-green"} assetName={"Resource(s) Passed "} assetCount={resourcesPassed} />
                                <AssetsWrapper activeAssetName={activeAssetName} filterAssets={this.filterAssets} progressBarColorClass={"asset-progress-bar-red"} addClass={"asset-border-red"} title={""} assetName={"Resource(s) Failed"} assetCount={resourcesFailed} />
                            </div>
                        </Grid>
                        <Grid item sm={12}>
                            <div className="d-flex">
                                <Typography component="span" className="fnt-13 mrR25">
                                    <strong>Compliance Section </strong> : 4.1
                                    </Typography>

                                <Typography component="span" className="fnt-13 mrR25">
                                    <strong> Resource Type </strong> : {currentAssetType}
                                </Typography>

                                <Typography component="span" className="fnt-13 mrR25">
                                    <span className="service-icon" title="EC2">
                                        <img src={fetchServiceIconPath(currentAssetType.split(' ')[0])} /> {currentAssetType.split(' ')[0].toUpperCase()}
                                    </span>
                                </Typography>
                            </div>
                        </Grid>
                    </Grid>
                    <hr />

                    <Grid container spacing={24}>

                        <Grid item sm={12} className="mrT20">
                            <Typography component="h4" className="fnt-13">
                                <strong> Description :</strong>
                            </Typography>
                            <Typography component="p" className="fnt-13">
                                {currentRule.description}
                            </Typography>
                        </Grid>

                        <Grid item sm={12} className="mrT20">
                            <Typography component="h4" className="fnt-13">
                                <strong> Details :</strong>
                            </Typography>
                            <Typography component="p" className="fnt-13">
                                {currentRule.summary}
                            </Typography>
                        </Grid>

                        <Grid item sm={12}>
                            <Typography component="h4" className="fnt-13">
                                <strong> Resource(s) Failed :</strong>
                            </Typography>
                            <ul className="list-item pdL10 mrT5">
                                {resourcesFailedList.map(function (resource, index) {
                                    return <li><span>{resource.category + ' (' + resource.data[resource.asset_type.discriminator[0]] + ')'} </span></li>
                                })}
                            </ul>
                        </Grid>

                        <Grid item sm={12}>
                            <Typography component="h4" className="fnt-13">
                                <strong>Recommendations :</strong>
                            </Typography>
                            <ol className="list-item pdL10 mrT5">
                                {steps.map(function (step, index) {
                                    return <li><span>{step}</span></li>
                                })}
                            </ol>
                        </Grid>

                    </Grid>
                </CardContent>
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
        }, setCountAssets: cloudAccounts => {
            dispatch(setCountAssets(cloudAccounts))
        }
    };
}

const mapStateToProps = (state, ownProps) => ({
    filterData: state.uiReducer.filterData,
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(RuleDetail))