/*
 * @Author: Virendra Patidar 
 * @Date: 2018-09-06 14:38:43 
 * @Last Modified by: Virendra Patidar
 * @Last Modified time: 2019-04-23 16:20:05
 */
import React, { PureComponent } from 'react'

import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import Card from '@material-ui/core/Card'
import Typography from '@material-ui/core/Typography'
import Checkbox from '@material-ui/core/Checkbox'
import CardContent from '@material-ui/core/CardContent'
import CreateReportDialog from 'global/CreateReport'


import { cloneDeep } from "lodash"
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { store } from 'client'

import ErrorBoundary from 'global/ErrorBoundary'

import * as ruleActions from 'actions/ruleAction'
import * as securityPolicyActions from 'actions/securityPolicyAction'

import { fetchServiceIconPath } from 'utils/serviceIcon'

import DashboardContext from "context/DashboardContext"

class SecurityIssueBreakdownByAssets extends PureComponent {

    _mounted = false

    state = {
        ruleServiceList: [],
        openDialog: false
    }


    componentDidMount() {
        this._mounted = true
        const filterData = this.props.filterData
        this.unsubscribe = store.subscribe(this.receiveFilterData)
        if (filterData.selectAccount.id !== 'all' && filterData.selectAccount.id !== undefined) {
            this._mounted = false
            this.fetchRuleServiceList()
        } else {

        }
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
            previousValue !== this.currentValue
        ) {
            const filterData = cloneDeep(currentState.uiReducer.filterData)
            if (filterData.selectAccount.id !== 'all' && this._mounted) {
                this.fetchRuleServiceList()
            } else {

            }
        }
    }


    fetchRuleServiceList() {
        this.props.actions.fetchRuleServiceList().
            then(result => {
                this._mounted = true
                if (result.success) {
                    this.setState({ ruleServiceList: result.data, selectServices: [] }, () => {
                    })
                } else {
                    console.log('Please try after some time');
                }
            });
    }

    openReportDialog = () => {
        this.setState({ openDialog: true })
    }

    handleDialogClose = () => {
        this.setState({ openDialog: false })
    }

    render() {
        const localState = this.state
        const { ruleServiceList, openDialog } = this.state
        const { selectServices } = this.props
        return (
            <Grid item sm={12} className="pdT0 pdB0">
                <Card className="card-wizard card-panel">
                    <div className="card-head card-title">
                        <Grid container spacing={24}>
                            <Grid item lg={6}>
                                <Typography component="h5">
                                    Security Issue Breakdown by Assets & Services
                                </Typography>
                            </Grid>
                            <Grid item lg={6} className="text-right">
                                <Button onClick={this.openReportDialog} variant="outlined" className="btn-blue-outline btn-ouline-sm mrL10">
                                    Create Report
                                </Button>
                                <DashboardContext.Provider value={localState}>
                                    <CreateReportDialog openDialog={openDialog} handleDialogClose={this.handleDialogClose} />
                                </DashboardContext.Provider>
                            </Grid>
                        </Grid>
                    </div>
                    <CardContent className="assets-content">
                        <ErrorBoundary error="error-boundary">
                            <div
                                className="btn-icon mrR10 btn-checkbox mrB10"
                            >
                                <span className="icon-text">
                                    <Checkbox
                                        onChange={this.props.serviceChange('selectService')}
                                        value={''}
                                        checked={selectServices.length === 0 || selectServices[0] === ''}
                                        color="primary"
                                        className="checkbox-select"
                                    />
                                </span>
                                <span className="bar-icon">
                                    All
                                </span>
                            </div>

                            {
                                ruleServiceList.map((ruleService, index) => {
                                    return <div
                                        className="btn-icon mrR10 btn-checkbox mrB10" key={ruleService.service}
                                    >
                                        <span className="icon-text">
                                            <Checkbox
                                                onChange={this.props.serviceChange('selectService')}
                                                value={ruleService.service}
                                                checked={selectServices[0] !== '' && selectServices.indexOf(ruleService.service) > -1}
                                                color="primary"
                                                className="checkbox-select"
                                            />
                                        </span>
                                        <span className="bar-icon">
                                            <img alt={ruleService.service_name} src={fetchServiceIconPath(ruleService.service)} /> {ruleService.service_name} ({ruleService.count} )
                                    </span>
                                    </div>
                                })
                            }
                        </ErrorBoundary>
                    </CardContent>
                </Card>
            </Grid>
        )
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators(Object.assign({}, ruleActions, securityPolicyActions), dispatch)
    };
}

const mapStateToProps = (state, ownProps) => ({
    filterData: state.uiReducer.filterData,
})

export default (connect(mapStateToProps, mapDispatchToProps)(SecurityIssueBreakdownByAssets));