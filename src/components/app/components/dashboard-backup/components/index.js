/*
 * @Author: Virendra Patidar 
 * @Date: 2018-08-09 11:36:17 
 * @Last Modified by: Virendra Patidar
 * @Last Modified time: 2019-02-04 15:33:53
 */
import React, { PureComponent } from 'react'

import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'

import { withRouter } from 'react-router-dom'

import { connect } from "react-redux"
import { store } from 'client'
import { bindActionCreators } from 'redux'
import { cloneDeep } from "lodash"

import LastUpdateTime from 'global/LastUpdateTime'
import ErrorBoundary from 'global/ErrorBoundary'
import CreateReportDialog from 'global/CreateReport'

import SecurityAlertStatus from './securityAlertStatus'
import AssetInventory from './assetInventory'
import SecurityAlertByRegion from './securityAlertByRegion'
import ComplianceStatusAssets from './complianceStatusAssets'
import Services from './services'
import Types from './types'

import * as securityPolicyActions from 'actions/securityPolicyAction'
import * as dashboardActions from 'actions/dashboardAction'
import * as integrationActions from 'actions/integrationAction'
import { showMessage } from 'actions/messageAction'
import { setProgressBar } from 'actions/commonAction'
import { setDashboardLayout } from 'actions/uiAction'

import GridLayout, { WidthProvider } from 'react-grid-layout'

import DashboardContext from "context/DashboardContext"
const ResponsiveGridLayout = WidthProvider(GridLayout)

class Home extends PureComponent {

    _mounted = false
    
    state = {
        direction: '',
        dashboardData: [],
        securityIssue: { count: 0, data: [] },
        totalAccounts: { count: 0, data: [] },
        totalAssets: { count: 0, data: [] },
        securityGroups: { count: 0, data: [] },
        externalIps: { count: 0, data: [] },
        securityIssueByService: { count: 0, data: [] },
        securityAlerts: [],
        assets_inventory: {},
        alert_region: {},
        openDialog: false,
        regionName: 'us-west-2',
        alertList: [],
        isRunPolicy: false,

        gridKey: ['SecurityAlertStatus', 'Types', 'Services', 'ComplianceStatusAssets', 'AssetInventory', 'SecurityAlertByRegion'],
        layout: this.props.layout,
    };

    currentValue = this.props.filterData

    componentDidMount() {
        window.dispatchEvent(new Event("resize"))
        this._mounted = true
        // Need to reset show message, may be last page or last time we got some error.
        let message = { message: '', showSnackbarState: false, variant: 'error' }
        this.props.showMessage(message)

        this.props.setProgressBar(true);
        const filterData = this.props.filterData
        if (filterData.selectAccount.id !== 'all' && filterData.selectAccount.id !== undefined) {
            this._mounted = false
            this.fetchIssues(filterData)
            this.fetchIssuesByService(filterData)
            this.fetchAssetInventory(filterData)
        } else {
            this.props.setProgressBar(false);
        }
        this.unsubscribe = store.subscribe(this.receiveFilterData)
        this.props.actions.resetOnbaordForm();
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
            (previousValue.selectAccount.id !== this.currentValue.selectAccount.id ||
                previousValue.selectCloud.id !== this.currentValue.selectCloud.id)
        ) {
            const filterData = cloneDeep(currentState.uiReducer.filterData)
            if (filterData.selectAccount.id !== 'all' && this._mounted) {
                this.props.setProgressBar(true);
                this.fetchIssues(filterData)
                this.fetchIssuesByService(filterData)
                this.fetchAssetInventory(filterData)
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
                    this.setState({ IssuesData: result.data }, () => {
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
                    this.setState({ IssuesServiceData: result.data }, () => {
                        this.setDataIssueByService();
                    })
                } else {
                    this.props.setProgressBar(false);
                    let message = { message: result, showSnackbarState: true, variant: 'error' }
                    this.props.showMessage(message)
                }
            });
    }


    fetchAssetInventory = (filterData) => {
        let payload = {
        }

        if (filterData.selectAccount.id !== 'all' && filterData.selectAccount.id !== undefined) {
            payload['account'] = filterData.selectAccount.id
        }

        if (filterData.selectCloud.id !== 'all') {
            payload['cloud'] = filterData.selectCloud.id
        }

        this.props.actions.fetchAssetInventory(payload).then(result => {
            this._mounted = true
            if (result.success) {
                this.setState({ assets_inventory: result.data.count }, () => {

                })
            } else {
                let message = { message: result, showSnackbarState: true, variant: 'error' }
                this.props.showMessage(message)
            }
        });
    }

    //  ------------------- API Call END----------------------

    // ----------------------- Custom logic method START -----------------------------*

    setDataIssue = () => {
        const data = this.state.IssuesData;
        let securityIssue;
        securityIssue = { count: data.count, data: data.data }
        this.setState({ securityIssue })
    }

    setDataIssueByService = () => {
        const data = this.state.IssuesServiceData;
        let securityIssueByService;
        securityIssueByService = { count: data.count, data: data.data }
        this.props.setProgressBar(false);
        this.setState({ securityIssueByService })
    }

    handleChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    };

    openReportDialog = () => {
        this.setState({ openDialog: true })
    }

    handleDialogClose = () => {
        this.setState({ openDialog: false })
    }

    updateRegion = (regionName, alertList) => {
        this.setState({ regionName, alertList })
    }

    onLayoutChange(dashboardLayout) {
        dashboardLayout.forEach(layout => {
            layout.y = layout.y < 0 ? 0 : layout.y
        })
        if (JSON.stringify(this.state.layouts) !== JSON.stringify(dashboardLayout)) {
            this.setState({ layouts: dashboardLayout })
            this.props.setDashboardLayout(dashboardLayout)
        }

    }

    renderWidgetComponent = key => {
        let component
        const { regionName, alertList } = this.state
        switch (key) {
            case "SecurityAlertStatus":
                component = (
                    <ErrorBoundary error="error-boundary">
                        <SecurityAlertStatus />
                    </ErrorBoundary>
                )
                break
            case "AssetInventory":
                component = (
                    <ErrorBoundary error="error-boundary"> <AssetInventory /></ErrorBoundary>
                )
                break
            case "SecurityAlertByRegion":
                component = (
                    <ErrorBoundary error="error-boundary"><SecurityAlertByRegion regionName={regionName} alertList={alertList} /></ErrorBoundary>
                )
                break
            case "ComplianceStatusAssets":
                component = (
                    <ErrorBoundary error="error-boundary"><ComplianceStatusAssets /></ErrorBoundary>
                )
                break
            case "Services":
                component = <ErrorBoundary error="error-boundary"><Services /></ErrorBoundary>
                break
            case "Types":
                component = (
                    <ErrorBoundary error="error-boundary"> <Types /></ErrorBoundary>
                )
                break
            default:
                component = (
                    <ErrorBoundary error="error-boundary"><Types /></ErrorBoundary>
                )
        }
        return component
    }


    generateDOM() {
        return this.state.gridKey.map(key => {

            return (
                <div key={key}>
                    {this.renderWidgetComponent(key)}
                </div>
            );
        });
    }


    // ----------------------- Custom logic method END -----------------------------*

    render() {
        const localState = this.state
        const { openDialog, layout } = this.state

        const responsiveGridDashboard = {
            position: "sticky",
            zIndex: "97",
            width: `100%`,
            height: "100%"
        }
        window.dispatchEvent(new Event("resize"))

        return (
            <div className="container-fluid page-dashboard page-content">
                <Grid container spacing={24} className="pdR10 pdL10">
                    <Grid item sm={6} className="pdB0">
                        <h3 className="mr0 main-heading">Dashboard</h3>
                    </Grid>
                    <Grid item sm={6} className="pdB0 text-right">
                        <LastUpdateTime />
                        <Button onClick={this.openReportDialog} variant="outlined" className="btn-blue-outline btn-ouline-sm mrL10"> Create Report </Button>
                        <DashboardContext.Provider value={localState}>
                            <CreateReportDialog openDialog={openDialog} handleDialogClose={this.handleDialogClose} />
                        </DashboardContext.Provider>
                    </Grid>
                </Grid>
                <div style={{ height: `calc(100vh - 70px)` }}>
                    <div style={responsiveGridDashboard}>
                        <DashboardContext.Provider value={localState}>
                            <ResponsiveGridLayout
                                layout={layout}
                                items={15}
                                rowHeight={60}
                                margin={[10,30]}
                                cols={2}
                                autoSize={true}
                                className="layout dashboard-Quad"
                                onLayoutChange={this.onLayoutChange.bind(this)}
                                isResizable={false}
                                measureBeforeMount={false}
                                useCSSTransforms={true}
                            >
                                {this.generateDOM()}
                            </ResponsiveGridLayout>
                        </DashboardContext.Provider>
                    </div>
                </div>
            </div>
        )
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators(Object.assign({}, dashboardActions, integrationActions, securityPolicyActions), dispatch),
        showMessage: message => {
            dispatch(showMessage(message))
        }, setProgressBar: isProgress => {
            dispatch(setProgressBar(isProgress))
        }, setDashboardLayout: dashboardLayout => {
            dispatch(setDashboardLayout(dashboardLayout))
        }
    };
}

const mapStateToProps = (state, ownProps) => ({
    filterData: state.uiReducer.filterData,
    token: state.userReducer.token,
    layout: state.uiReducer.dashboardLayout
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Home))