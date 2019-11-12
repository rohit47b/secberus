/*
 * @Author: Virendra Patidar 
 * @Date: 2018-09-27 09:03:40 
 * @Last Modified by: Virendra Patidar
 * @Last Modified time: 2018-11-19 12:00:51
 */
import React, { PureComponent } from 'react'

import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import Grid from '@material-ui/core/Grid'
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import FormControl from '@material-ui/core/FormControl';
import NativeSelect from '@material-ui/core/NativeSelect';


import { withRouter } from 'react-router-dom'

import { connect } from "react-redux"
import { store } from 'client'
import { bindActionCreators } from 'redux'
import { cloneDeep, maxBy } from "lodash"

import ErrorBoundary from 'global/ErrorBoundary'

import * as dashboardActions from 'actions/dashboardAction'
import { showMessage } from 'actions/messageAction'
import { setProgressBar } from 'actions/commonAction'

import SecurityIssueBreakdownItem from './SecurityIssueBreakdownItem'


import DashboardContext from "context/DashboardContext"
const DashboardContextConsumer = DashboardContext.Consumer


class SecurityAlert extends PureComponent {
    _mounted = false
    state = {
        openDrawer: false,
        assets_inventory: {},
        graphData: [],
        securityIssue: this.props.securityIssue,
        value: 0
    }


    // currentValue = this.props.filterData

    // componentDidMount() {
    //     this._mounted = true
    //     const filterData = this.props.filterData
    //     if (filterData.selectAccount.id !== 'all' && filterData.selectAccount.id !== undefined) {
    //         this.fetchAssetInventory(filterData);
    //     } else {
    //     }
    //     this.unsubscribe = store.subscribe(this.receiveFilterData)
    // }

    // componentWillUnmount() {
    //     this._mounted = false
    // }

    // receiveFilterData = data => {

    //     const currentState = store.getState()
    //     const previousValue = this.currentValue
    //     this.currentValue = currentState.uiReducer.filterData

    //     if (
    //         this.currentValue &&
    //         (previousValue.selectAccount.id !== this.currentValue.selectAccount.id ||
    //             previousValue.selectCloud.id !== this.currentValue.selectCloud.id)
    //     ) {
    //         const filterData = cloneDeep(currentState.uiReducer.filterData)
    //         if (filterData.selectAccount.id !== 'all' && this._mounted) {
    //             this.fetchAssetInventory(filterData);
    //         }
    //     }
    // }


    // --------------- Cusotm Logic Method Start----------------------
    toggleDrawer = (side, isOpen) => {
        this.setState({
            openDrawer: isOpen
        });
    };

    static getDerivedStateFromProps(nextProps, state) {
        return { assets_inventory: nextProps.assets_inventory }
    }


    componentDidUpdate = (prevProps, prevState) => {
        if (this.props.assets_inventory !== prevProps.assets_inventory) {
            this.setState({ assets_inventory: prevProps.assets_inventory }, () => {
                this.setData()
            })
        }
    }

    setData = () => {
        const data = this.state.assets_inventory
        let graphData = []
        Object.keys(data).forEach(function (key, index) {
            const obj = { name: key, uv: index * 25, Pass: data[key].assets, Fail: data[key].offenders, total: data[key].assets + data[key].offenders }
            graphData.push(obj)
        });
        this.setState({ graphData })
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
            if (this._mounted) {
                if (result.success) {
                    const data = result.data.count
                    let graphData = []
                    /**
                     * Fetch max value of sum(asset+offenders) for showing no of Y-axis
                     */
                    const maxBothValue = maxBy(Object.values(data), function (o) { return o.assets + o.offenders; });
                    const multipleOf = Math.ceil(this.round40(maxBothValue.assets + maxBothValue.offenders) / Object.keys(data).length)
                    Object.keys(data).forEach(function (key, index) {
                        const obj = { name: key, service_name: data[key].service_name, uv: index * multipleOf, Assets: data[key].assets, Offenders: data[key].offenders, total: data[key].assets + '/' + data[key].offenders }
                        graphData.push(obj)
                    });
                    this.setState({ assets_inventory: result.data.count, graphData }, () => {

                    })
                } else {
                    let message = { message: result, showSnackbarState: true, variant: 'error' }
                    this.props.showMessage(message)
                }
            }
        });
    }

    round40(x) {
        return Math.ceil(x / 40) * 40;
    }

    handleTabChange = (event, value) => {
        this.setState({ value });
    };

    render() {
        const { data } = this.props
        const { value } = this.state
        return (
            <div className="container">
                <Card className="card-wizard mrB20 card-sec-alert" id="container_asset_invetory">
                    <div className="card-head card-title">
                        <Grid container spacing={24}>
                            <Grid item sm={6}>
                                <Typography component="h5" className="pdT5">
                                    Security Alerts
                            </Typography>
                            </Grid>
                            <Grid item sm={6}>
                                <Tabs
                                    value={value}
                                    onChange={this.handleTabChange}
                                    className="tab-wrapper"
                                >
                                    <Tab
                                        disableRipple
                                        label="Services"
                                        className="tab-btn tab1"
                                    />
                                    <Tab
                                        disableRipple
                                        label="Type"
                                        className="tab-btn tab2"
                                    />
                                </Tabs>
                            </Grid>
                        </Grid>
                    </div>
                    <CardContent className="card-audit card-body">
                        <ErrorBoundary error="error-boundary">
                            {value === 0 && <div>
                                <Grid container spacing={24}>
                                    <Grid item sm={3} className="pdR0">
                                        <List className="side-tab" component="nav">
                                            <ListItem className="active">
                                                <a href="javascript:void(0)">Cloud ab (5)</a>
                                            </ListItem>
                                            <ListItem>
                                                <a href="javascript:void(0)">Cloud Secure (8)</a>
                                            </ListItem>
                                            <ListItem>
                                                <a href="javascript:void(0)">Data EC (2)</a>
                                            </ListItem>
                                            <ListItem>
                                                <a href="javascript:void(0)">Service ab (15)</a>
                                            </ListItem>

                                        </List>
                                    </Grid>
                                    <Grid item sm={9} className="pdL0">
                                        <Grid container spacing={24} className="filter-sec">
                                                <Grid item sm={6} className="pdT0 pdB0">
                                                    <span className="service-title">Cloud ab</span>
                                                </Grid>
                                                <Grid item sm={6} className="pdT0 pdB0 text-right">
                                                    <div className="filter-box">
                                                        <FormControl className="single-select">
                                                            <NativeSelect
                                                                className="select-text"
                                                                value="age"
                                                                name="age"
                                                            //onChange={this.handleChange('age')}
                                                            >
                                                                <option value={10}>Sort by</option>
                                                                <option value={20}>2</option>
                                                                <option value={30}>3</option>
                                                            </NativeSelect>
                                                        </FormControl>
                                                    </div>
                                                </Grid>
                                            </Grid>
                                        <div className="service-body">
                                            {data.map((issueBreakdown) => <SecurityIssueBreakdownItem toggleDrawer={this.toggleDrawer} key={issueBreakdown.service} issueBreakdown={issueBreakdown} />)}
                                        </div>
                                    </Grid>
                                </Grid>
                            </div>
                            }

                            {value === 1 && <div>
                                <Grid container spacing={24}>
                                    <Grid item sm={3} className="pdR0">
                                        <List className="side-tab" component="nav">
                                            <ListItem className="active">
                                                <a href="javascript:void(0)">Server (5)</a>
                                            </ListItem>
                                            <ListItem>
                                                <a href="javascript:void(0)">Network (8)</a>
                                            </ListItem>
                                            <ListItem>
                                                <a href="javascript:void(0)">Data Storage (2)</a>
                                            </ListItem>
                                        </List>
                                    </Grid>
                                    <Grid item sm={9} className="pdL0">
                                        <Grid container spacing={24} className="filter-sec">    
                                            <Grid item sm={6} className="pdT0 pdB0">
                                                <span className="service-title">Server</span>
                                            </Grid>
                                            <Grid item sm={6} className="pdT0 pdB0 text-right">
                                                <div className="filter-box">
                                                    <FormControl className="single-select">
                                                        <NativeSelect
                                                            className="select-text"
                                                            value="age"
                                                            name="age"
                                                        //onChange={this.handleChange('age')}
                                                        >
                                                            <option value={10}>Sort by</option>
                                                            <option value={20}>2</option>
                                                            <option value={30}>3</option>
                                                        </NativeSelect>
                                                    </FormControl>
                                                </div>
                                            </Grid>
                                        </Grid>
                                        <div className="service-body">
                                            {data.map((issueBreakdown) => <SecurityIssueBreakdownItem toggleDrawer={this.toggleDrawer} key={issueBreakdown.service} issueBreakdown={issueBreakdown} />)}
                                        </div>
                                    </Grid>
                                </Grid>
                            </div>
                            }

                        </ErrorBoundary>
                    </CardContent>
                </Card>
            </div >

        );
    }

}


// const mapDispatchToProps = (dispatch) => {
//     return {
//         actions: bindActionCreators(Object.assign({}, dashboardActions), dispatch),
//         showMessage: message => {
//             dispatch(showMessage(message))
//         }, setProgressBar: isProgress => {
//             dispatch(setProgressBar(isProgress))
//         }
//     };
// }

// const mapStateToProps = (state, ownProps) => ({
//     filterData: state.uiReducer.filterData,
// })

// const AssetInventoryRedux = withRouter(connect(mapStateToProps, mapDispatchToProps)(SecurityAlert))

// export default AssetInventoryRedux;

export default props => (
    <DashboardContextConsumer>
        {dashboardData => <SecurityAlert {...props} securityIssue={dashboardData.securityIssue} data={dashboardData.securityIssueByService.data} count={dashboardData.securityIssueByService.count} />}
    </DashboardContextConsumer>
);
