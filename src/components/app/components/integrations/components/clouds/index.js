/*
 * @Author: Virendra Patidar 
 * @Date: 2018-09-26 10:34:57 
 * @Last Modified by: Virendra Patidar
 * @Last Modified time: 2019-05-15 11:43:25
 */
import React, { PureComponent } from 'react'

import Grid from '@material-ui/core/Grid'
import { setActiveMenu, setActiveParentMenu } from 'actions/commonAction';
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import Drawer from '@material-ui/core/Drawer'
import Switch from '@material-ui/core/Switch'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography';

import history from 'customHistory'

import { store } from 'client'
import { connect } from "react-redux"
import { bindActionCreators } from 'redux'
import { withRouter } from 'react-router-dom'
import { filter, cloneDeep } from "lodash"

import SearchField from 'global/SearchField'
import AccountListSideBar from 'global/AccountListSideBar'
import ErrorBoundary from 'global/ErrorBoundary'
import DeleteUser from 'global/DeleteUser'

import * as integrationActions from 'actions/integrationAction'
import { showMessage } from 'actions/messageAction'
import { setProgressBar } from 'actions/commonAction'
import { setHeaderFilterData, setAutoRefresh } from 'actions/commonAction'
import { setCloudAccounts } from 'actions/loginAction'

import ConfirmDialogBoxHOC from 'hoc/DialogBox'
import { CardWithTitle } from 'hoc/CardWithTitle'
import LabelWithHelper from 'hoc/Label/LabelWithHelper';
import IntegrationList from './IntegrationList'

import AppConfig from 'constants/Config'

class CloudIntegration extends PureComponent {

    _mounted = false
    state = {
        loaded: false,
        clouds: [],
        cloudList: [],
        awsClouds: [],
        gcpClouds: [],
        openDrawer: false,
        accountList: [],
        openDialog: false,
        openStatusDialog: false,
        openSlackDialog: false,
        slackConfig: {
            services: [],
            webhook_url: '',
            is_active: false,
            account_id: ''
        },
        changeFilter: false
    }


    currentValue = this.props.filterData

    componentDidMount() {
        this._mounted = true
        this.props.setActiveParentMenu('Integration')
        this.props.setActiveMenu('Clouds')
        this.props.setProgressBar(true);
        //this.fetchClouds();
        this._mounted = false
        const filterData = this.props.filterData
        this.fetchClouds(filterData)
        this.unsubscribe = store.subscribe(this.receiveFilterData)
    }

    static getDerivedStateFromProps(nextState, prevState) {
        if(prevState.filterData && JSON.stringify(prevState.filterData) !== JSON.stringify(nextState.filterData)) {
            return {changeFilter: true}
        }

        return { filterData: nextState.filterData }
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
                this.fetchClouds(filterData)
            }
        }
    }


    //---------------------- API method START -------------------
    fetchClouds(filterData=null) {
        // if (this.props.awsList.length === 0) {
        this.props.actions.fetchIntegrationList().
            then(result => {
                this._mounted = true
                if (result) {
                    this.setState({ clouds: result }, () => {
                        if (this.state.clouds.length === 0) {
                            let filterData = { selectAccount: { name: 'All Account', id: 'all' }, selectCloud: { name: 'All Clouds', id: 'all', cloudIcon: '/assets/images/aws.png' } }
                            this.setState({ cloudList: [], loaded: true })
                            this.props.setCloudAccounts([])
                            this.props.setHeaderFilterData(filterData)
                            this.props.setProgressBar(false);
                            this.setState({ loaded: true })
                            this.props.setProgressBar(false);
                        } else {
                            let cloudItems = [];
                            let awsItems = [];
                            let gcpItems = [];
                            this.state.clouds.forEach(function (cloudItem) {
                                let detained = false
                                /* if (filterData) {
                                    if (filterData.selectCloud.id !== 'all') {
                                        if (cloudItem.cloud !== filterData.selectCloud.id) {
                                            detained = true
                                        }
                                    }
                                    if (filterData.selectAccount.id !== 'all' && filterData.selectAccount.id !== undefined) {
                                        if (cloudItem.id !== filterData.selectAccount.id) {
                                            detained = true
                                        }
                                    }
                                } */

                                if (detained == false) {
                                    if (cloudItem.credentials.role_arn) {
                                        cloudItem['role_arn'] = cloudItem.credentials.role_arn
                                    }
                                    if (cloudItem.enabled) {
                                        cloudItem['status'] = 'Enable'
                                    } else { 
                                        cloudItem['status'] = 'Disable'
                                    }
                                    cloudItems.push(cloudItem)
                                }

                                switch (cloudItem.cloud) {
                                    case "aws":
                                        awsItems.push(cloudItem);
                                        break;
                                    case "gcp":
                                        gcpItems.push(cloudItem);
                                        break;
                                }
                            });
                            this.setState({ awsClouds: awsItems, gcpClouds: gcpItems })
                            this.setState({ cloudList: cloudItems, loaded: true })
                            this.props.setCloudAccounts(this.state.clouds)
                            this.props.setAutoRefresh('LoadRows')
                            this.props.setProgressBar(false);
                        }
                    })
                } else {
                    this.props.setProgressBar(false);
                    this.setState({ clouds: [], loaded: true })
                    let message = { message: result, showSnackbarState: true, variant: 'error' }
                    this.props.showMessage(message)
                }
            });
        // } else {
        //     // this.setState({ clouds: this.props.awsList, loaded: true })
        // }
    }

    autoRefresh() {
        if (this.props.autoRefresh === 'LoadTable') {
            this.fetchClouds(this.props.filterData)
        }
    }

    //---------------------- API method END -------------------

    //---------------------- Custom logic method START -------------------

    filterAccount = (cloudName) => {
        const foundAccount = filter(this.state.clouds, { 'cloud': cloudName })
        this.setState({ accountList: foundAccount[0].accounts })
    }

    handleChange = () => {
        console.log('  search');
    }

    openOnBoard = (cloudType) => {
        history.push({
            pathname: '/app/onboard',
            state: { backUrl: '/app/integrations/clouds', selectedCloud: cloudType }
        })
    }

    toggleDrawer = (cloudName) => {
        this.setState(prevState => ({
            openDrawer: !prevState.openDrawer
        }), () => {
            if (this.state.openDrawer === true) { this.filterAccount(cloudName) }
            this.fetchClouds()
        });
    }

    statusChangeDialog = () => {
        this.setState({ openStatusDialog: true });
    }

    handleDialogClose = () => {
        this.setState({ openDialog: false, openStatusDialog: false, openSlackDialog: false })
    }

    handleSlackDialogOpen = () => {
        this.setState({ openSlackDialog: true });
    };

    handleCloseSlackDialog = (isSuccess) => {
        this.setState({ openSlackDialog: false }, () => {
            if (isSuccess && isSuccess === true) {
                let message = { message: 'Slack Details Updated Successfully', showSnackbarState: true, variant: 'success' }
                this.props.showMessage(message)
                this.fetchSlack(this.props.filterData)
            }
        });
    };

    //---------------------- Custom logic method END -------------------

    render() {
        mixpanel.track("View Page", {
            "Page Name": 'Integrations',
        });
        const { clouds, cloudList, awsClouds, gcpClouds, loaded, openDrawer, accountList, openStatusDialog, openSlackDialog, slackConfig, changeFilter} = this.state;
        const { filterData } =this.props;
        let boxClass = ["switch-green"];
        if (slackConfig.is_active) {
            boxClass.push('active');
        }

        if(changeFilter) {
            this.setState({filterData: filterData, changeFilter: false})
            this.fetchClouds(filterData)
        }
        
        return (
            <CardWithTitle title={<h3 className="card-heading">Integrations</h3>} bgImageClass={"card-inner"}>
                    <Grid container spacing={24} className="mobile-container">
                        <Grid item sm={12}>
                            <LabelWithHelper message={"Clouds"} title={"Clouds - " + clouds.length} content={"Total number of actived clouds."} />
                            
                        </Grid> 
                    </Grid >

                    <Grid container spacing={24} className="mobile-container">
                         <Grid item sm={12}>
                           <Typography component="p" className="fnt-13">
                             To add cloud accounts you would like Secberus to monitor, click on the "+" sign in the specific cloud  and follow the short steps. You can disable a cloud account or delete a connection entirely in the Active Integration section below.   
                          </Typography>
                        </Grid>
                    </Grid >
                    {loaded && <Grid container spacing={24} className="mr0 mobile-container">
                        <ErrorBoundary error="error-boundary">
                            <Grid item xs={12} md={3} key={'amazon'}>
                                <Card className="card-wizard text-center card-intg">
                                    <CardContent className="intg-services">
                                        <div className="services-img">
                                            <img alt="AWS" src={AppConfig.cloudStaticData['aws'] ? AppConfig.cloudStaticData['aws'].cloudIconPath : '/assets/images/aws.png'} />
                                        </div>
                                        <div className="src-title"> {AppConfig.cloudStaticData['aws'] ? AppConfig.cloudStaticData['aws'].name : 'aws'}</div>
                                    </CardContent>
                                    <CardActions className="card-footer">
                                        <a href="javascript:void(0)" className="float-left">Active Accounts: {awsClouds.length}</a>
                                        <span className="float-right">
                                            <a href="javascript:void(0)" onClick={() => this.openOnBoard('aws')}><i className="fa fa-plus-circle"></i></a>
                                        </span>
                                        <div className="clearfix"></div>
                                    </CardActions>
                                </Card>
                            </Grid>
                            {/* <Grid item xs={12} md={3} key={'gcp'}>
                                <Card className="card-wizard text-center card-intg">
                                    <CardContent className="intg-services">
                                        <div className="services-img">
                                            <img alt="Google Cloud" src={AppConfig.cloudStaticData['gcp'] ? AppConfig.cloudStaticData['gcp'].cloudIconPath : '/assets/images/google-cloud.png'} />
                                        </div>
                                        <div className="src-title"> {AppConfig.cloudStaticData['gcp'] ? AppConfig.cloudStaticData['gcp'].name : 'gcp'}</div>
                                    </CardContent>
                                    <CardActions className="card-footer">
                                        <a href="javascript:void(0)" className="float-left">Active Accounts: {gcpClouds.length}</a>
                                        <span className="float-right">
                                            <a href="javascript:void(0)" onClick={() => this.openOnBoard('gcp')}><i className="fa fa-plus-circle"></i></a>
                                        </span>
                                        <div className="clearfix"></div>
                                    </CardActions>
                                </Card>
                            </Grid> */}
                        </ErrorBoundary>
                        <Drawer className="right-sidebar sidebar-width" anchor="right" open={openDrawer}>
                            <AccountListSideBar dataList={accountList} toggleDrawer={this.toggleDrawer} />
                        </Drawer>
                    </Grid>
                    }

                    <Grid container spacing={24} className="pdB10 mobile-container">
                         <Grid item sm={12}>
                            <h3 className="mr0 main-heading">Active Integrations</h3>
                        </Grid>
                    </Grid>
                    {loaded && <Grid container spacing={24} className="grid-container mobile-container">
                        <Grid item xs={12} md={12} className="pdT0">
                            <ErrorBoundary error="error-boundary">
                                <IntegrationList cloudList={cloudList} autoRefresh={this.autoRefresh()}/>
                            </ErrorBoundary>
                        </Grid>
                    </Grid>
                    }
               
            </CardWithTitle>
        );
    }
}

const mapStateToProps = (state, ownProps) => ({
    awsList: state.commonReducer.awsList,
    filterData: state.uiReducer.filterData,
    autoRefresh: state.commonReducer.autoRefresh
})  

const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators(Object.assign({}, integrationActions), dispatch),
        showMessage: message => {
            dispatch(showMessage(message))
        }, setProgressBar: isProgress => {
            dispatch(setProgressBar(isProgress))
        }, setHeaderFilterData: filterData => {
            dispatch(setHeaderFilterData(filterData))
        }, setAutoRefresh: autoRefresh => {
            dispatch(setAutoRefresh(autoRefresh))
        }, setCloudAccounts: cloudAccounts => {
            dispatch(setCloudAccounts(cloudAccounts))
        }, setActiveMenu: activeMenu => {
            dispatch(setActiveMenu(activeMenu))
        },setActiveParentMenu: activeParentMenu => {
            dispatch(setActiveParentMenu(activeParentMenu))
        },
    };
}
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CloudIntegration))