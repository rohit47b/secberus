/*
 * @Author: Virendra Patidar 
 * @Date: 2018-11-16 14:55:42 
 * @Last Modified by: Virendra Patidar
 * @Last Modified time: 2019-03-12 10:21:08
 */
import React, { PureComponent } from 'react';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import ComplianceChart from './ComplianceChart'
import ComplianceReportSubList from './ComplianceReportSubList'
import LineChart from './LineChart'

import { Link } from 'react-router-dom';

import ComplianceReportList from './ComplianceReportList'

class Compliance extends PureComponent {


    render() {

        return (
            <div>
                <div className="report-details d-flex align-item-center mrB40">
                    <div className="report-info">
                        <span className="highligh-text"><strong>Claim Ruler</strong></span>
                        <span><strong>Plan ID</strong> : 001</span>
                        <span><strong>Cloud Account</strong> : AWS-Production001</span>
                        <span><strong>Date</strong> : 07/23/19</span>
                        <span><strong>Time</strong> : 22:36:12</span>
                    </div>
                    <div className="pdR30">
                        Download
                     <Link to="/" className="pdL10 pdR10">
                            <i className="fa fa-file-pdf-o" aria-hidden="true" ></i>
                        </Link>
                        <Link to="/">
                            <i className="fa fa-file-excel-o" aria-hidden="true" ></i>
                        </Link>
                    </div>
                </div>

                <Grid container spacing={16}>
                    <Grid item md={12}>
                        <Typography className="mrB15" variant="h3" component="h3">
                            Current Organization Compliance Posture Overview
                         </Typography>
                    </Grid>
                </Grid>
                <Grid container spacing={16} className="mrB30">
                    <Grid item md={6} className="compliance-pie-chart-data d-flex align-item-center">
                        <Grid container spacing={16}>
                            <Grid item md={6}>
                                <div className="compliance-chart-status d-flex align-item-center">
                                    <div className="status-bar-sub-heading pdR15">
                                        PCI Posture <br />
                                        (Projected)
                                    </div>
                                    <ComplianceChart />
                                </div>
                                <div className="light-text mrL90">Remediation Plan in Progress : 3</div>
                            </Grid>
                            <Grid item md={6}>
                                <div className="compliance-chart-status d-flex align-item-center">
                                    <div className="status-bar-sub-heading pdR15">
                                        PCI Posture <br />
                                        (Current)
                                    </div>
                                    <ComplianceChart />
                                </div>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item md={6}>
                        <div className="report-line-chart">
                            <LineChart lineColor={"#ECA84E"} />
                        </div>
                    </Grid>
                </Grid>
                <Grid container spacing={16} className="mrB30">
                    <Grid item md={12}>
                        <ComplianceReportList />
                    </Grid>
                </Grid>
                <Grid container spacing={16}>
                    <Grid item md={12}>
                        <Typography className="mrB15" variant="h3" component="h3">
                            Compliance Posture Overview By Cloud Account
                         </Typography>
                    </Grid>
                </Grid>
                <Grid container spacing={16} className="mrB30 compliance-pie-chart-data">
                    <Grid item md={4}>
                        <div className="compliance-chart-status d-flex align-item-center">
                            <div className="status-bar-sub-heading pdR15">
                                Cloud Account: <br />
                                <span className="font-normal">AWS-Production001</span>
                            </div>
                            <ComplianceChart />
                        </div>
                        <div className="light-text mrL25p">Projection :   <span className="chip chip-success">12 <i className="fa fa-arrow-down" aria-hidden="true"></i></span></div>
                    </Grid>
                    <Grid item md={4}>
                        <div className="compliance-chart-status d-flex align-item-center">
                            <div className="status-bar-sub-heading pdR15">
                                Cloud Account: <br />
                                <span className="font-normal">AWS-Staging001</span>
                            </div>
                            <ComplianceChart />
                        </div>
                        <div className="light-text mrL25p">Projection :   <span className="chip chip-success">12 <i className="fa fa-arrow-down" aria-hidden="true"></i></span></div>
                    </Grid>
                    <Grid item md={4}>
                        <div className="compliance-chart-status d-flex align-item-center">
                            <div className="status-bar-sub-heading pdR15">
                                Cloud Account: <br />
                                <span className="font-normal">AWS-Development001</span>
                            </div>
                            <ComplianceChart />
                        </div>
                        <div className="light-text mrL25p">Projection :   <span className="chip chip-success">12 <i className="fa fa-arrow-down" aria-hidden="true"></i></span></div>
                    </Grid>
                </Grid>
                <Grid container spacing={16}>
                    <Grid item md={12}>
                        <Typography className="mrB15" variant="h3" component="h3">
                            Account Compliance Posture : <span className="font-normal">AWS-Production001</span>
                         </Typography>
                    </Grid>
                </Grid>
                <Grid container spacing={16} className="mrB30">
                    <Grid item md={6} className="compliance-pie-chart-data d-flex align-item-center">
                        <Grid container spacing={16}>
                            <Grid item md={6}>
                                <div className="compliance-chart-status d-flex align-item-center">
                                    <div className="status-bar-sub-heading pdR15">
                                        PCI Posture <br />
                                        (Current)
                                    </div>
                                    <ComplianceChart />
                                </div>
                            </Grid>
                            <Grid item md={6}>
                                <div className="compliance-chart-status d-flex align-item-center">
                                    <div className="status-bar-sub-heading pdR15">
                                        PCI Posture <br />
                                        (Projected)
                                    </div>
                                    <ComplianceChart />
                                </div>
                                <div className="light-text mrL90">Remediation Plan in Progress : 3</div>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item md={6}>
                        <div className="report-line-chart">
                            <LineChart lineColor={"#ECA84E"} />
                        </div>
                    </Grid>
                </Grid>
                <Grid container spacing={16} className="mrB30">
                    <Grid item md={12}>
                        <ComplianceReportList />
                    </Grid>
                </Grid>
                <Grid container spacing={16}>
                    <Grid item md={12}>
                        <Typography className="mrB15" variant="h3" component="h3">
                            Account Compliance Posture : <span className="font-normal">AWS-Production001</span>
                         </Typography>
                    </Grid>
                </Grid>
                <Grid container spacing={16}>
                    <Grid item md={12}>
                        <ComplianceReportSubList />
                    </Grid>
                </Grid>
            </div>
        )
    }
}


export default Compliance