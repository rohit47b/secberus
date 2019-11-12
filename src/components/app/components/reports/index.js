/*
 * @Author: Virendra Patidar 
 * @Date: 2018-11-16 14:55:42 
 * @Last Modified by: Virendra Patidar
 * @Last Modified time: 2019-05-21 12:14:32
 */
import React, { PureComponent } from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';

import RemediationPlan from './components/remediation/components/remdiationPlan';
import Remediation from './components/remediation/components/remediation';

import * as accountMgmtAction from 'actions/accountMgmtAction'
import Security from './components/security/Security';
import Compliance from './components/compliance/Compliance';
import CustomScheduleReport from './components/custom'

import { withRouter } from 'react-router-dom'
import { store } from 'client'
import { connect } from "react-redux"
import { bindActionCreators } from 'redux'
import { cloneDeep } from "lodash"
import { setReportTabValue,setActiveMenu,setHeaderFilterData,setProgressBar } from 'actions/commonAction'

const menuName=['Remediation','Security','Compliance','Custom']

class Reports extends PureComponent {

    currentValue = this.props.reportTabValue

    _mounted = false
    state = {
        loaded: false,
        value: this.props.reportTabValue,
        isMainRemediationPage: true,
        companyAccount: '',
        selectedPlan: {},
        noRedirect: false
    }


    componentDidMount() {
        this._mounted = true
        this.props.setProgressBar(true);
        if (this.props.location.state !== undefined) {
            this.props.setReportTabValue(0)
            this.setState({value: 0})
        }
        this.unsubscribe = store.subscribe(this.receiveFilterData)
        this.fetchAccount()
    }

    receiveFilterData = data => {
        const currentState = store.getState()
        const reportTabValue = cloneDeep(currentState.uiReducer.reportTabValue)
        this.setState({ value:reportTabValue });
    }
    
    componentWillUnmount() {
        this._mounted = false
    }


    handleChangeTab = (event, value) => {
        this.setState({ value });
        this.props.setReportTabValue(value)
        this.props.setActiveMenu(menuName[value])
    }

    updatePageLocation = (isMainRemediationPage, selectedPlan) => {
        this.setState({ isMainRemediationPage, selectedPlan, noRedirect: true })
    }

    fetchAccount(filterData=null) {
        // if (this.props.awsList.length === 0) {
        this.props.actions.fetchAccount().
            then(result => {
                if (this._mounted) {
                    if (result) {
                        this.props.setProgressBar(false);
                        this.setState({ companyAccount: result.company_name, loaded: true })
                    } else {
                        this.props.setProgressBar(false);
                        this.setState({ clouds: [], loaded: true })
                        let message = { message: result, showSnackbarState: true, variant: 'error' }
                        this.props.showMessage(message)
                    }
                }
            });
    }

    render() {
        const { value, isMainRemediationPage, loaded, companyAccount, selectedPlan, noRedirect } = this.state
        const { filterData } = this.props
        return (
            <div className="container">
            {loaded && <Card className="card-wizard card-panel card-tab card-inner">
                 <div className="card-title">
                    <h3 className="mrB10 mr0 main-heading">Reports</h3>
                    <Tabs
                        value={value}
                        onChange={this.handleChangeTab}
                        indicatorColor="primary"
                        className="tabs tab-policies"
                    >
                        <Tab
                            disableRipple
                            label="Remediation"
                            className="tab-item mrR20"
                        />
                        <Tab
                            disableRipple
                            label="Security"
                            className="tab-item mrR20"
                        />
                        <Tab
                            disableRipple
                            label="Compliance"
                            className="tab-item mrR20"
                        />
                        {/* <Tab
                            disableRipple
                            label="Custom"
                            className="tab-item mrR20"
                        /> */}
                    </Tabs>
                </div>
                <CardContent className="card-body">
                    {value === 0 && isMainRemediationPage === true && <Remediation updatePageLocation={this.updatePageLocation} companyAccount={companyAccount} noRedirect={noRedirect}/>}
                    {value === 0 && isMainRemediationPage === false && <RemediationPlan updatePageLocation={this.updatePageLocation} selectedPlan={selectedPlan} companyAccount={companyAccount}/>}
                    {value === 1 && <Security selectedCloudAccount={filterData.selectAccount} companyAccount={companyAccount} />}
                    {value === 2 && <Compliance selectedCloudAccount={filterData.selectAccount} companyAccount={companyAccount} />}
                    {value === 3 && <CustomScheduleReport />}

                </CardContent>
                
            </Card>}
            </div>
        )
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators(Object.assign({}, accountMgmtAction), dispatch),
        setReportTabValue: reportTabValue => {
            dispatch(setReportTabValue(reportTabValue))
        }, setActiveMenu: activeMenu => {
            dispatch(setActiveMenu(activeMenu))
        }, setHeaderFilterData: filterData => {
            dispatch(setHeaderFilterData(filterData))
        }, setProgressBar: isProgress => {
            dispatch(setProgressBar(isProgress))
        }
    };
}


const mapStateToProps = (state, ownProps) => ({
    reportTabValue: state.uiReducer.reportTabValue,
    filterData: state.uiReducer.filterData,
})



export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Reports)) 