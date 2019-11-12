/*
 * @Author: Virendra Patidar 
 * @Date: 2018-11-16 14:55:42 
 * @Last Modified by: Virendra Patidar
 * @Last Modified time: 2019-05-30 13:08:11
 */
import Grid from '@material-ui/core/Grid';
import { setActiveMenu, setActiveParentMenu } from 'actions/commonAction';
import Typography from '@material-ui/core/Typography';

import { store } from 'client';
import { cloneDeep } from "lodash";
import { bindActionCreators } from 'redux';

import React, { Fragment, PureComponent } from 'react';
import { connect } from "react-redux";
import { Link, withRouter } from 'react-router-dom';

import * as securityActions from 'actions/securityAction';
import * as accountMgmtAction from 'actions/accountMgmtAction'

import AccountLevelStatistics from "./AccountLevelStatistics";
import AccountType from "./AccountType";
import AttackSurface from "./AttackSurface";
import CloudAssetTypes from "./CloudAssetTypes";
import LineChart from './LineChart';
import RiskPostureAreaChart from "./RiskPostureAreaChart";
import RiskPostureCurrentBarChart from "./RiskPostureCurrentBarChart";
import RiskPostureProjectedBarChart from "./RiskPostureProjectedBarChart";
import { convertDateFormatWithTime,convertDateFormatWithDate1 } from 'utils/dateFormat'
import AccountGrowthChart from './AccountGrowthChart'
import html2canvas  from 'html2canvas'
import jsPDF from 'jspdf'
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

class Security extends PureComponent {
    _mounted = false

    state = {
        data: {
            label: 'critical',
            values: [{ x: 'Low1', y: 4 },
            { x: 'Low2', y: 5 },
            { x: 'Low3', y: 6 },
            { x: 'Mid1', y: 7 },
            { x: 'Mid2', y: 8 },
            { x: 'Mi3', y: 9 },
            { x: 'High1', y: 10 },
            { x: 'High2', y: 11 },
            { x: 'High3', y: 12 },
            { x: 'Critical1', y: 13 },
            { x: 'Critical2', y: 14 },
            ]
        },
        cloud_accounts: [
            'AWS-Production-001',
            'AWS-Stating-001',
            'AWS-Dev-001'
        ],
        //selected_cloud_account: '',
        company_account: 'Company-12345',
        loading: true,
        date: '',
        time: '',
        selectedCloudAccount: {},
        security_report_data: {},
        companyAccount: ''
    }

    componentDidMount() {
        this._mounted = true
        this.props.setActiveParentMenu('Reports')
        this.props.setActiveMenu('Security')
        const filterData = this.props.filterData
        this.setState({selectedCloudAccount: filterData.selectAccount})
        this.fetchAccount()
        if (filterData.selectAccount.id !== 'all' && filterData.selectAccount.id !== undefined) {
            this._mounted = false
            this.getDate()
            this.fetchSecurityReport(filterData)
        } else {
            this.setState({ filterProgress: false, loading: false })
        }
        this.unsubscribe = store.subscribe(this.receiveFilterData)
    }

    getDate = () => {
        var today = new Date();
        var time = '';
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0');
        var yyyy = today.getFullYear();
        var HH = today.getHours()
        var MM = today.getMinutes()
        var SS = today.getSeconds()

        today = mm + '/' + dd + '/' + yyyy;
        time = HH + ':' + MM + ':' + SS;

        this.setState({ date: today, time: time })
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
                this.fetchSecurityReport(filterData)
            }
        }
    }

    fetchSecurityReport(filterData) {
        this.props.actions.fetchSecurityReport(filterData.selectAccount.id).
            then(result => {
                this._mounted = true
                if (typeof result !== 'string') {
                    this.setState({ security_report_data: result, loading: false })
                } else {
                    console.log(' Error in fetching alerts :- ', result);
                    this.setState({ loading: false, filterProgress: false })
                }
            });

    }

    selectCloudAccount = (selected_cloud_account) => {
        this.setState({ selected_cloud_account })
    }

    print=(securityPDF)=> {
		// const filename  = 'ThisIsYourPDFFilename.pdf';

		// html2canvas(document.querySelector('#securityPDF')).then(canvas => {
		// 	let pdf = new jsPDF('p', 'mm', 'a4');
		// 	pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, 211, 298);
		// 	pdf.save(filename);
        // });
        var mainContent= document.body.innerHTML;
        var targetContent = document.getElementById('securityPDF').innerHTML
        document.body.innerHTML =targetContent
        window.open()
        window.print()
        document.body.innerHTML =mainContent
    }
    
    fetchAccount(filterData=null) {
        this.props.actions.fetchAccount().
            then(result => {
                if (result) {
                    this.setState({ companyAccount: result.company_name })
                } else {
                    let message = { message: result, showSnackbarState: true, variant: 'error' }
                    this.props.showMessage(message)
                }
            });
    }

    render() {
        mixpanel.track("View Page", {
            "Page Name": 'Report Security',
        });
        const { cloud_accounts, time, date, security_report_data, selectedCloudAccount, companyAccount } = this.state
        const scale = d3.scale.ordinal().range(['#24BA4D', '#24BA4D', '#24BA4D', '#ECD24E', '#ECD24E', '#ECD24E', '#ECA84E', '#ECA84E', '#ECA84E', '#fcfcfc', '#fcfcfc']);
        let tooltipBarChart = function () {
            return (
                <span className="barchart-tooltip">{score_calculation_date}</span>
            );
        };
        return (
            <div className="container" >
                <Card className="card-wizard card-panel card-tab card-inner">
                    <div className="card-title">
                        <h3 className="mrB10 mr0 main-heading">Reports</h3>
                    </div>
                    <CardContent className="card-body">
                        <div id="securityPDF">
                            <div className="report-details mrB40">
                                <Grid container className="align-item-center">
                                    <Grid item xs={12} sm={12} md={1} className="report-text highligh-text">
                                        <span><strong>{companyAccount}</strong></span>
                                    </Grid>
                                    <Grid item  xs={12} sm={12} md={11} className="report-text-info pdL30">
                                        <span className="pdR30"><strong>Report Type</strong> : Cloud Infrastructure Security Posture</span>
                                        <span className="pdR30"><strong>Cloud Account</strong> : {this.props.filterData.selectAccount.name}</span>
                                        <span className="pdR30"><strong>Date</strong> : {security_report_data.cloud_account ? convertDateFormatWithDate1(security_report_data.cloud_account.last_scan_date) :date}</span>
                                        <span><strong>Time</strong> : {security_report_data.cloud_account ? convertDateFormatWithTime(security_report_data.cloud_account.last_scan_date) : time}</span>
                                    </Grid>
                                </Grid>
                                <Grid container className="align-item-center">
                                    <Grid item  xs={12} sm={12} md={1} className="report-text">
                                        <span><strong>Quick Links:</strong></span>
                                    </Grid>
                                    <Grid item  xs={12} sm={12} md={11} className="report-text-info pdL30">
                                        <a href="#account_information" className="link-hrf  pdR30">Account Information</a>
                                        <a href="#account_level_statistics" className="link-hrf pdR30">Account Level Statistics</a>
                                        <a href="#account_level_infraestructure_details" className="link-hrf pdR30">Account Level Infrastructure Details</a>
                                    </Grid>
                                </Grid>
                                {/* <div className="download-links">
                                    Download
                                    <span onClick={this.print} className="link-hrf pdL10">
                                        <i className="fa fa-file-pdf-o" aria-hidden="true" ></i>
                                    </span>
                                </div> */}
                            </div>
                            {/* <Grid container spacing={24}>
                                <Grid item md={12}>
                                    <Typography className="heading-h3" id="global_overview" component="h3">
                                        <strong>Global Overview</strong>
                                    </Typography>
                                </Grid>
                            </Grid>
                            <Grid container spacing={24} className="mrB15">
                                <Grid item md={3}>
                                    <RiskPostureCurrentBarChart />
                                </Grid>
                                <Grid item md={6}>
                                    <RiskPostureAreaChart />
                                </Grid>
                                <Grid item md={3}>
                                    <RiskPostureProjectedBarChart />
                                </Grid>
                            </Grid>

                            <Grid container spacing={24} className="mrB30">
                                <Grid item md={6}>
                                    <AttackSurface content={"Your current Attack Surface shows the breakdown of Alerts and the criticality of those alerts based on the nature of the Asset that is misconfigured, the nature of the rule that is failed, and any upweighting that your security has assigned to the Asset and/ or Rule. "} title={"Attack Surface (Current)"} />
                                </Grid>
                                <Grid item md={6}>
                                    <AttackSurface content={"The projected Attack Surface shows the breakdown of Alerts after all Remediation Plans in progress are completed."} title={"Attack Surface (Projected)"} />
                                </Grid>
                            </Grid>
                            <Grid container spacing={24}>
                                <Grid item md={12}>
                                    <Typography className="heading-h3" id="global_statistics" component="h3">
                                        <strong>Global Statistics</strong> 
                                    </Typography>
                                </Grid>
                            </Grid>
                            <AccountLevelStatistics />
                            <Grid container spacing={24}>
                                <Grid item md={12}>
                                    <Typography className="heading-h3" id="global_details" component="h3">
                                        <strong> Global Details</strong> 
                                    </Typography>
                                </Grid>
                            </Grid> 
                            <Grid container spacing={24} className="mrB15">
                                <Grid item md={4}>
                                    <CloudAccount />
                                </Grid>
                                <Grid item md={8}>
                                    <LineChart content={"Account growth shows the 12-month growth history of your Cloud Accounts monitored by Secberus."} title={"Account growth"} lineColor={"#225BDE"} />
                                </Grid>
                            </Grid>
                            <Grid container spacing={24} className="mrB40">
                                <Grid item md={4}>
                                    <CloudAssets />
                                </Grid>
                                <Grid item md={8}>
                                    <LineChart content={"Account growth shows the 12-month growth history of the Cloud Assets in the Cloud Accounts that Secberus monitors."} title={"Asset growth"} lineColor={"#225BDE"} />
                                </Grid>
                            </Grid>
                            <Grid container spacing={24}>
                                <Grid item md={12}>
                                    <Typography className="heading-h3" id="cloud_accounts" component="h3">
                                    <strong> Cloud Accounts</strong> 
                                    </Typography>
                                </Grid>
                            </Grid>

                            <Grid container spacing={24} className="mrB20">
                                {
                                    cloud_accounts.map(cloud_account => {
                                        return <Grid item md={3} key={cloud_account} className={selected_cloud_account === cloud_account ? 'active' : ''}>
                                            <AccountSecurityPosture  selectCloudAccount={this.selectCloudAccount} cloud_account={cloud_account} />
                                        </Grid>
                                    })
                                }
                            </Grid> */}

                            {selectedCloudAccount.id !== 'all' &&

                                <Fragment>
                                    <hr className="mrB20" />
                                    <Grid container spacing={24}>
                                        <Grid item  xs={12} sm={12} md={12}>
                                            <Typography className="heading-h3" component="h3" id="account_information">
                                                <strong>Account Information:</strong> {selectedCloudAccount.name}
                                            </Typography>
                                        </Grid>
                                    </Grid>

                                    <Grid container spacing={24} className="mrB15">
                                        <Grid item  xs={12} sm={12} md={3}>
                                            <RiskPostureCurrentBarChart riskScore={security_report_data.risk_score_summary ? security_report_data.risk_score_summary.risk_score : 0} />
                                        </Grid>
                                        <Grid item  xs={12} sm={12} md={6}>
                                            <RiskPostureAreaChart />
                                        </Grid>
                                        <Grid item  xs={12} sm={12} md={3}>
                                            <RiskPostureProjectedBarChart remediation_plans={security_report_data.risk_score_summary ? security_report_data.risk_score_summary.remediation_plans.length : 0} riskScore={security_report_data.risk_score_summary ? security_report_data.risk_score_summary.projected_risk_score : 0} />
                                        </Grid>
                                    </Grid>

                                    <Grid container spacing={24} className="mrB30">
                                        <Grid item  xs={12} sm={12} md={6}>
                                            <AttackSurface alert_summary={security_report_data.alert_summary ? security_report_data.alert_summary : {}} content={"Your current Attack Surface shows the breakdown of Alerts and the criticality of those alerts based on the nature of the Asset that is misconfigured, the nature of the rule that is failed, and any upweighting that your security has assigned to the Asset and/ or Rule. "} title={"Attack Surface (Current)"} />
                                        </Grid>
                                        <Grid item  xs={12} sm={12} md={6}>
                                            <AttackSurface alert_summary={security_report_data.projected_alert_summary ? security_report_data.projected_alert_summary : {}} content={"The projected Attack Surface shows the breakdown of Alerts after all Remediation Plans in progress are completed."} title={"Attack Surface (Projected)"} />
                                        </Grid>
                                    </Grid>

                                    <Grid container spacing={24}>
                                        <Grid item  xs={12} sm={12} md={12}>
                                            <Typography className="heading-h3" component="h3" id="account_level_statistics">
                                                <strong> Account Level Statistics</strong>
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                    <AccountLevelStatistics remediation_aptitude={security_report_data.remediation_aptitude ?security_report_data.remediation_aptitude:0} outstanding_count={security_report_data.outstanding_count?security_report_data.outstanding_count:0} cloud_account={security_report_data.cloud_account ? security_report_data.cloud_account : {}}  avg_exposure={security_report_data.avg_exposure ?security_report_data.avg_exposure :0 } rule_summary={security_report_data.rule_summary ? security_report_data.rule_summary : {}} remediation_summary={security_report_data.remediation_summary ? security_report_data.remediation_summary : {}} />
                                    <Grid container spacing={24}>
                                        <Grid item  xs={12} sm={12} md={12}>
                                            <Typography className="heading-h3" component="h3" id="account_level_infraestructure_details">
                                                <strong> Account Level Infrastructure Details</strong>
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                    <Grid container spacing={24} className="mrB15">
                                        <Grid item  xs={12} sm={12} md={4}>
                                            <AccountType cloud_account={security_report_data.cloud_account ? security_report_data.cloud_account : {}} />
                                        </Grid>
                                        <Grid item  xs={12} sm={12} md={8}>
                                            <AccountGrowthChart />
                                        </Grid>
                                    </Grid>
                                    <Grid container spacing={24} className="mrB40">
                                        <Grid item  xs={12} sm={12} md={12}>
                                            <CloudAssetTypes asset_summary={security_report_data.asset_summary ? security_report_data.asset_summary : []} />
                                        </Grid>
                                    </Grid>
                                </Fragment>
                            }
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators(Object.assign({}, securityActions, accountMgmtAction), dispatch),
        setHeaderFilterData: filterData => {
            dispatch(setHeaderFilterData(filterData))
        }, setProgressBar: isProgress => {
            dispatch(setProgressBar(isProgress))
        }, setActiveMenu: activeMenu => {
            dispatch(setActiveMenu(activeMenu))
        },setActiveParentMenu: activeParentMenu => {
            dispatch(setActiveParentMenu(activeParentMenu))
        },
    };
}

const mapStateToProps = (state, ownProps) => ({
    filterData: state.uiReducer.filterData,
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Security)) 