/*
 * @Author: Virendra Patidar 
 * @Date: 2018-09-26 10:34:57 
 * @Last Modified by: Virendra Patidar
 * @Last Modified time: 2019-04-23 14:29:14
 */
import React, { PureComponent } from 'react'

import Grid from '@material-ui/core/Grid'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import Drawer from '@material-ui/core/Drawer'
import Switch from '@material-ui/core/Switch'
import Button from '@material-ui/core/Button'

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
import * as slackIntegrationActions from 'actions/slackIntegrationAction'
import { showMessage } from 'actions/messageAction'
import { setProgressBar } from 'actions/commonAction'
import { setHeaderFilterData } from 'actions/commonAction'

import ConfirmDialogBoxHOC from 'hoc/DialogBox'
import { CardWithTitle } from 'hoc/CardWithTitle'
import LabelWithHelper from 'hoc/Label/LabelWithHelper';
import SlackIntegration from './SlackIntegration'
import IntegrationList from './IntegrationList'

import AppConfig from 'constants/Config'

class Comunication extends PureComponent {

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
        }
    }


    currentValue = this.props.filterData

    componentDidMount() {
        this._mounted = true
        this.props.setProgressBar(true);
        this.fetchClouds();
        const filterData = this.props.filterData
        if (filterData.selectAccount.id !== 'all' && filterData.selectAccount.id !== undefined) {
            this._mounted = false
            this.fetchSlack(filterData)
        }
        this.unsubscribe = store.subscribe(this.receiveFilterData)
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
                this.setState({cloudList: []}, () => {
                    this.fetchSlack(filterData)
                })
            }
        }
    }


    //---------------------- API method START -------------------
    fetchClouds() {
        // if (this.props.awsList.length === 0) {
        this.props.actions.fetchIntegrationList().
            then(result => {
                if (this._mounted) {
                    if (result.success) {
                        this.props.setProgressBar(false);
                        this.setState({ clouds: result.data, loaded: true }, () => {
                            if (this.state.clouds.length === 0) {
                                let filterData = { selectAccount: { name: 'All Account', id: 'all' }, selectCloud: { name: 'All Clouds', id: 'all', cloudIcon: '/assets/images/aws.png' } }
                                this.props.setHeaderFilterData(filterData)
                            } else {
                                let awsItems = [];
                                let gcpItems = [];
                                let cloudItems = [];
                                this.state.clouds.forEach(function (cloudItem) {
                                    cloudItems.push(cloudItem)
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
                                this.setState({ cloudList: cloudItems })
                            }
                        })
                    } else {
                        this.props.setProgressBar(false);
                        this.setState({ clouds: [], loaded: true })
                        let message = { message: result, showSnackbarState: true, variant: 'error' }
                        this.props.showMessage(message)
                    }
                }
            });
        // } else {
        //     // this.setState({ clouds: this.props.awsList, loaded: true })
        // }
    }

    fetchSlack(filterData) {
        let payload = { account_id: filterData.selectAccount.id }


        this.props.actions.fetchSlackDetails(payload).
            then(result => {
                this._mounted = true
                if (result.success) {
                    this.props.setProgressBar(false);
                    const slackConfig = { account_id: result.data.account_id, services: result.data.services, webhook_url: result.data.webhook_url, is_active: result.data.is_active }
                    this.setState({ slackConfig }, () => {
                    })
                } else {
                    this.props.setProgressBar(false);
                    let message = { message: result, showSnackbarState: true, variant: 'error' }
                    this.props.showMessage(message)
                }
            });
    }

    slackStatusChange = () => {
        this.props.setProgressBar(true);
        this.handleDialogClose()
        let payload = {
            services: this.state.slackConfig.services,
            webhook_url: this.state.slackConfig.webhook_url,
            is_active: !this.state.slackConfig.is_active,
            account_id: this.state.slackConfig.account_id
        }
        this.props.actions.slackWebHookIntegrate(payload).
            then(result => {
                this.props.setProgressBar(false);
                if (this._mounted) {
                    if (!result.success) {
                        if (typeof result === 'string') {
                            let message = { message: result, showSnackbarState: true, variant: 'error' }
                            this.props.showMessage(message)
                        }

                    } else if (result.success) {
                        let message = { message: result.message, showSnackbarState: true, variant: 'success' }
                        this.props.showMessage(message)
                        this.setState({ slackConfig: payload })
                    }
                }

            });
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
        const { clouds, cloudList, awsClouds, gcpClouds, loaded, openDrawer, accountList, openStatusDialog, openSlackDialog, slackConfig } = this.state;
        let boxClass = ["switch-green"];
        if (slackConfig.is_active) {
            boxClass.push('active');
        }
        return (
            <CardWithTitle title={<span>Comunication</span>} bgImageClass={"card-inner"}>
                <Grid container spacing={24} className="mobile-container">
                    <Grid item sm={6}>
                        <LabelWithHelper message={"Communications"} title={"Communications - " + cloudList.length} content={"Total number of actived clouds."} />
                    </Grid>
                    <Grid item sm={6} className="pdB10 text-right">
                        <DeleteUser />
                    </Grid>
                 </Grid >
                    {loaded && <Grid container spacing={24} className="mr0 mobile-container">
                        <ErrorBoundary error="error-boundary">
                            {clouds.map((cloud, index) => (
                                <Grid item xs={12} md={3} key={cloud.cloud} className="pdL0">
                                    <Card className="card-wizard text-center card-intg">
                                        <CardContent className="intg-services">
                                            {/* <div className="switch-control">
                                            <Switch className={boxClass.join(' ')} onChange={() => this.statusChangeDialog()} />
                                        </div> */}
                                            <div className="services-img">
                                                <img alt="Cloud" src={AppConfig.cloudStaticData[cloud.cloud] ? AppConfig.cloudStaticData[cloud.cloud].cloudIconPath : '/assets/images/aws.png'} />
                                            </div>
                                            <div className="src-title"> {AppConfig.cloudStaticData[cloud.cloud] ? AppConfig.cloudStaticData[cloud.cloud].name : cloud.cloud}</div>
                                        </CardContent>
                                        <CardActions className="card-footer">
                                            <a href="javascript:void(0)" onClick={() => this.toggleDrawer(cloud.cloud)} className="float-left">Active Accounts: {cloud.accounts.length}</a>
                                            <span className="float-right">
                                                <a href="javascript:void(0)" onClick={() => this.openOnBoard(cloud.cloud)}><i className="fa fa-plus-circle"></i></a>
                                            </span>
                                            <div className="clearfix"></div>
                                        </CardActions>
                                    </Card>
                                </Grid>
                            ))}

                            <Grid item xs={12} md={3} key={'slack'}>
                                <Card className="card-wizard text-center card-intg">
                                    <CardContent className="intg-services">
                                        {slackConfig.webhook_url !== '' && <div className="switch-control">
                                            <Switch className={boxClass.join(' ')} checked={slackConfig.is_active} onChange={() => this.statusChangeDialog()} />
                                        </div>}
                                        <div className="services-img">
                                            <img alt="Slack" src={AppConfig.cloudStaticData['slack'] ? AppConfig.cloudStaticData['slack'].cloudIconPath : '/assets/images/slack.png'} />
                                        </div>
                                        <div className="src-title"> {AppConfig.cloudStaticData['slack'] ? AppConfig.cloudStaticData['slack'].name : 'slack'}</div>
                                    </CardContent>
                                    <CardActions className="card-footer">
                                        {slackConfig.is_active === true && <a href="javascript:void(0)" className="float-left" onClick={() => this.handleSlackDialogOpen()}>Slack Configuration</a>}
                                        {slackConfig.is_active === false && <span className="float-right">
                                            <a href="javascript:void(0)" onClick={() => this.handleSlackDialogOpen()}><i className="fa fa-plus-circle"></i></a>
                                        </span>}
                                        <div className="clearfix"></div>
                                    </CardActions>
                                </Card>
                            </Grid>


                        </ErrorBoundary>
                        <Drawer className="right-sidebar" anchor="right" open={openDrawer}>
                            <AccountListSideBar dataList={accountList} toggleDrawer={this.toggleDrawer} />
                        </Drawer>
                    </Grid>
                    }
                    <ConfirmDialogBoxHOC successDialogEvent={this.slackStatusChange} isOpen={openStatusDialog} handleDialogClose={this.handleDialogClose} title={'Confirmation'} content={slackConfig.is_active === true ? 'Are you sure you want to disable slack for this account ?' : 'Are you sure you want to enable slack for this account ?'} />

                    {openSlackDialog && <SlackIntegration handleCloseSlackDialog={this.handleCloseSlackDialog} slackConfig={slackConfig} />}
                    <Grid container spacing={24}  className="pdB10 mobile-container">
                        <Grid item sm={12}>
                        <h3 className="mr0 main-heading">Active Comunications</h3>
                        </Grid>
                    </Grid>
                    <Grid container spacing={24} className="grid-container mobile-container">
                        <Grid item sm={12} className="pdT0">
                            <ErrorBoundary error="error-boundary">
                                <IntegrationList dataList={cloudList} />
                            </ErrorBoundary>
                        </Grid>
                    </Grid>
               
            </CardWithTitle>
        );
    }
}

const mapStateToProps = (state, ownProps) => ({
    awsList: state.commonReducer.awsList,
    filterData: state.uiReducer.filterData,
})

const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators(Object.assign({}, integrationActions, slackIntegrationActions), dispatch),
        showMessage: message => {
            dispatch(showMessage(message))
        }, setProgressBar: isProgress => {
            dispatch(setProgressBar(isProgress))
        }, setHeaderFilterData: filterData => {
            dispatch(setHeaderFilterData(filterData))
        },
    };
}
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Comunication))