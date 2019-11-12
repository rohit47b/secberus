/*
 * @Author: Virendra Patidar 
 * @Date: 2018-11-16 14:55:42 
 * @Last Modified by: Virendra Patidar
 * @Last Modified time: 2019-04-20 11:31:21
 */
import Grid from '@material-ui/core/Grid'
import { Typography, Button } from '@material-ui/core'
import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import ExpandMoreIcon from '@material-ui/icons/ArrowDropDown'
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

import history from 'customHistory';

import React, { PureComponent } from 'react'
import { Link } from 'react-router-dom'
import { withRouter } from 'react-router-dom'
import { store } from 'client'
import { connect } from "react-redux"
import { bindActionCreators } from 'redux'
import { cloneDeep } from "lodash"
import Loader from 'global/Loader';

import * as remediationActions from 'actions/remediationAction';
import * as accountMgmtAction from 'actions/accountMgmtAction'

import RuleViolationList from "./RuleViolationList"
import RuleViolation from "./RuleViolation"

import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

class RemediationPlan extends PureComponent {
    _mounted = false

    state = {
        alertList: [],
        loading: true,
        date: '',
        time: '',
        remediationList: {},
        companyAccount: '',
        backUrl: undefined,
        backUrlState: undefined,
        selectedPlan: {},
        backUrl: undefined,
        backUrlState: undefined
    };

    componentDidMount() {
        this._mounted = true
        const location = window.location.href.split('/')
        const planId = location[location.length - 1]
        const filterData = this.props.filterData
        if (this.props.location.state !== undefined) {
            this.setState({ backUrl: this.props.location.state.backUrl, backUrlState: this.props.location.state.backUrlState })
        }
        this.fetchAccount()
        if (filterData.selectAccount.id !== 'all' && filterData.selectAccount.id !== undefined) {
            this.fetchRemediationPlanAlerts(filterData, planId)
            this.getDate()
        } else {
            this.setState({ filterProgress: false, loading: false })
        }
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

    fetchRemediationPlanAlerts(filterData, planId) {
        let violations = []
        let alertList = []
        let ruleList = []
        let remediationList = {}
        let accountId = undefined
        if (filterData.selectAccount.id === 'all' || filterData.selectAccount.id === undefined) {
            if (this.props.location.state !== undefined && this.props.location.state.alert !== undefined) {
                accountId = this.props.location.state.alert.cloud_account_id
            } else {
                history.push('/app/multi-tenancy-dashboard/home')
            }
        } else {
            accountId = filterData.selectAccount.id
        }
        this.props.actions.fetchRemediationPlanDetails(accountId, planId).
            then(result => {
                if (typeof result !== 'string') {
                    this.setState({selectedPlan: result})
                    result.alerts.forEach(alert => {
                        if (ruleList.indexOf(alert.rule.label) === -1) {
                            let steps = []
                            let next = true
                            let numberStep = 1
                            let stringSteps = alert.rule.remediation_steps
                            if (stringSteps !== undefined && stringSteps !== null) {
                                while (next) {
                                    let pos1 = stringSteps.toString().indexOf(numberStep + '.')
                                    let pos2 = stringSteps.toString().indexOf((numberStep + 1) + '.')
                                    if (pos1 === -1) {
                                        next = false
                                    } else {
                                        if (pos2 !== -1) {
                                            steps.push(stringSteps.toString().substr(pos1 + 3, pos2 - pos1 - 4))
                                        } else {
                                            steps.push(stringSteps.toString().substr(pos1 + 3))
                                            next = false
                                        }
                                    }
                                    numberStep++
                                }
                            }
                            remediationList[alert.rule.label] = steps
                            ruleList.push(alert.rule.label)
                            alertList.push(alert)
                        }
                    });
                    this.setState({ alertList, violations, remediationList, loading: false })
                } else {
                    console.log(' Error in fetching alerts :- ', result);
                    this.setState({ loading: false, filterProgress: false })
                }
            })
    }


    print = () => {
        const filename = 'ThisIsYourPDFFilename.pdf';

        html2canvas(document.querySelector('#remediationPDF')).then(canvas => {
            let pdf = new jsPDF('p', 'mm', 'a4');
            pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, 211, 298);
            pdf.save(filename);
        });
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
            "Page Name": 'Report Remediation Plan',
        });
        const { alertList, loading, date, time, remediationList, companyAccount, selectedPlan, backUrl, backUrlState } = this.state;
        return (
            <div className="container">
                <Card className="card-wizard card-panel card-tab card-inner">
                    <div className="card-title">
                        <h3 className="mrB10 mr0 main-heading">Reports</h3>
                    </div>
                    <CardContent className="card-body">
                        <div className="container" id="remediationPDF">
                            <div className="report-details mrB40">
                                <Grid container className="align-item-center">
                                    <Grid item md={1} className="report-text highligh-text">
                                        <span><strong>{companyAccount}</strong></span>
                                    </Grid>
                                    <Grid item md={11} className="report-text-info pdL30" id="report-info">
                                        <span className="pdR30 responsive-text-report"><strong>Report Name</strong> : {selectedPlan.name}</span>
                                        <span className="pdR30 responsive-text-report"><strong>Cloud Account</strong> : {this.props.filterData.selectAccount.name}</span>
                                        <span className="pdR30 responsive-text-report"><strong>Date</strong> : {date}</span>
                                        <span><strong>Time</strong> : {time}</span>
                                    </Grid>
                                </Grid>
                                <Grid container className="align-item-center">
                                    <Grid item md={1} className="report-text">
                                        <span><strong>Quick Links:</strong></span>
                                    </Grid>
                                    <Grid item md={11} className="report-text-info pdL30">
                                        {alertList.map(function (alert, index) { return (<a href={"#" + alert.rule.label} className="link-hrf  pdR30">{alert.rule.label}</a>) })}
                                    </Grid>
                                </Grid>


                                <div className="download-links">
                                    <Button
                                        className="btn btn-primary mrR10"
                                        variant="contained"
                                        color="primary"
                                        onClick={() => history.push({pathname: backUrl !== undefined ? backUrl : '/app/reports/remediation', state: { backUrlState }})}
                                    >
                                        <i className="fa fa-arrow-left mrR5"></i> Back
                                    </Button>
                                    Download
                                    <span onClick={this.print} className="link-hrf pdL10">
                                        <i className="fa fa-file-pdf-o" aria-hidden="true" ></i>
                                    </span>
                                </div>
                            </div>

                            {alertList.map(function (alert, index) {
                                return (<div id={alert.rule.label}>
                                    <ExpansionPanel className="expand-panel mrB20" defaultExpanded>
                                        <ExpansionPanelSummary
                                            expandIcon={<ExpandMoreIcon />}
                                            aria-controls="panel1bh-content"
                                            id="panel1bh-header"
                                            className="expansion-panel-summary"
                                        >
                                            <Typography><strong>Rule ID : </strong> {alert.rule.label}</Typography>

                                        </ExpansionPanelSummary>
                                        <ExpansionPanelDetails className="expansion-panel-details">
                                            <Grid container spacing={16}>
                                                <Grid item md={12}>
                                                    <Typography id="rule_information" className="heading-h3 mrB10" component="h3">
                                                        <strong>Rule Information</strong>
                                                    </Typography>
                                                </Grid>
                                            </Grid>
                                            <Grid container spacing={16} className="mrB10">
                                                <Grid item md={12}>
                                                    <p className="mrT0"><strong>Rule ID : </strong> {alert.rule.label}</p>
                                                    <p><strong>Rule Name : </strong>{alert.rule.description}</p>
                                                    <p><strong>Rule Description : </strong>{alert.rule.details}</p>
                                                </Grid>
                                            </Grid>
                                            <Grid container spacing={16}>
                                                <Grid item md={12}>
                                                    <Typography className="mrB0 heading-h3" id="remediation_steps" component="h3">
                                                        <strong>Remediation Steps</strong>
                                                    </Typography>
                                                </Grid>
                                            </Grid>

                                            <Grid container spacing={16} className="remediation-steps mrB20">
                                                <Grid item md={12}>
                                                    <ol className="order-list">
                                                        {remediationList[alert.rule.label].map(function (step, index) {
                                                            return <li><span>{step}</span></li>
                                                        })}
                                                    </ol>
                                                </Grid>
                                            </Grid>
                                            <Grid container spacing={16}>
                                                <Grid item md={12} >
                                                    <Typography className="mrB15 heading-h3" id="rule_violation" component="h3">
                                                        <strong>Rule Violations - <RuleViolation plan={selectedPlan} rule={alert.rule.id} /></strong>
                                                    </Typography>
                                                </Grid>
                                            </Grid>
                                            <Grid container spacing={16}>
                                                <Grid item md={12}>
                                                    <RuleViolationList plan={selectedPlan} rule={alert.rule.id} />
                                                </Grid>
                                            </Grid>
                                        </ExpansionPanelDetails>
                                    </ExpansionPanel>

                                </div>)
                            })}
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators(Object.assign({}, remediationActions, accountMgmtAction), dispatch),
        setHeaderFilterData: filterData => {
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(RemediationPlan)) 