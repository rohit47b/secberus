/*
 * @Author: Virendra Patidar 
 * @Date: 2018-11-16 14:55:42 
 * @Last Modified by: Virendra Patidar
 * @Last Modified time: 2019-04-19 13:02:01
 */
import React, { PureComponent } from 'react';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { BarChart } from 'react-d3-components'
import { Link } from 'react-router-dom';
import { AlertCount } from 'hoc/AlertCount';
import LineChart from './LineChart'
import AreaChart from '../compliance/AreaChart'

class Security extends PureComponent {
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
        }
    }

    render() {
        const { data } = this.state
        const scale = d3.scale.ordinal().range(['#24BA4D', '#24BA4D', '#24BA4D', '#ECD24E', '#ECD24E', '#ECD24E', '#ECA84E', '#ECA84E', '#ECA84E', '#fcfcfc', '#fcfcfc']);
        let tooltipBarChart = function () {
            return (
                <span className="barchart-tooltip">{score_calculation_date}</span>
            );
        };
        return (
            <div>
                <div className="report-details mrB40">
                        <Grid container className="align-item-center">
                            <Grid item md={1} className="report-text highligh-text">
                                <span><strong>Claim Ruler</strong></span>
                            </Grid>
                            <Grid item md={11} className="report-text-info pdL30">
                                <span className="pdR30"><strong>Report Type</strong> : Cloud Infrastructure Security Posture</span>
                                <span className="pdR30"><strong>Cloud Account</strong> : AWS-Production001</span>
                                <span className="pdR30"><strong>Date</strong> : 07/23/19</span>
                                <span><strong>Time</strong> : 22:36:12</span>
                            </Grid>
                        </Grid>
                        <Grid container className="align-item-center">
                            <Grid item md={1} className="report-text">
                                <span><strong>Quick Links:</strong></span>
                            </Grid>
                            <Grid item md={11} className="report-text-info pdL30">
                                <span className="link-hrf  pdR30">Organization Level Cloud Infrastructure Security Posture</span>
                                <span className="link-hrf pdR30">Organization Level Statistics</span>
                                <span className="link-hrf pdR30">Organization Cloud Infrastructure Details</span>
                                <span className="link-hrf pdR30">Account Level Information</span>
                                <span className="link-hrf">Account Infrastructure Details</span>
                            </Grid>
                        </Grid>
                  

                    <div className="download-links">
                        Download
                        <Link to="/" className="pdL10">
                            <i className="fa fa-file-pdf-o" aria-hidden="true" ></i>
                        </Link>
                    </div>
                </div>

                <Grid container spacing={24} className="mrB15">
                    <Grid item md={2} className="col-20">
                        <div className="status-report mrB50">
                            <div className="status-bar-sub-heading">Risk Posture (Current)</div>
                            <div className="status-bar">
                                <div className="status-bar-title">CRITICAL</div>
                                <div className="graph-text">
                                    <div className="status-bar-count">82</div>

                                    <BarChart
                                        data={data}
                                        width={150}
                                        height={40}
                                        margin={{ top: 0, bottom: 0, left: 0, right: 20 }}
                                        colorByLabel={false}
                                        colorScale={scale}
                                        Grid={0}
                                        tooltipHtml={tooltipBarChart}
                                    // onClick={() => this.props.toggleDrawer('right', true, data)}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="status-report">
                            <div className="status-bar-sub-heading">Risk Posture (Projected)</div>
                            <div className="status-bar">
                                <div className="status-bar-title">CRITICAL</div>
                                <div className="graph-text">
                                    <div className="status-bar-count">82</div>

                                    <BarChart
                                        data={data}
                                        width={150}
                                        height={40}
                                        margin={{ top: 0, bottom: 0, left: 0, right: 20 }}
                                        colorByLabel={false}
                                        colorScale={scale}
                                        Grid={0}
                                        tooltipHtml={tooltipBarChart}
                                    // onClick={() => this.props.toggleDrawer('right', true, data)}
                                    />
                                </div>
                            </div>
                        </div>
                    </Grid>
                    <Grid item md={5} className="col-40">
                        <div className="area-chart">
                            <AreaChart />
                            {/* <img src="/assets/images/areachart.png"/> */}
                        </div>
                    </Grid>
                    <Grid item md={5} className="col-60">
                        <Grid container spacing={0} className="report-schedule">
                            <Grid item xs={6}>
                                <div className="report-schedule-info">
                                    <div className="report-schedule-desc d-flex align-item-start">
                                        <span className="report-schedule-title fnt-12"><strong>Remediation Aptitude</strong></span>
                                        <span className="fnt-11"><b className="fnt-16">:</b> <strong className="fnt-16 mrL5">15</strong> Alerts / day</span>
                                    </div>
                                    <div className="report-schedule-desc d-flex align-item-start">
                                        <span className="report-schedule-title fnt-12"><strong>Security Dept</strong></span>
                                        <span className="fnt-11"><b className="fnt-16">:</b> <strong className="fnt-16 mrL5">13</strong> Outstanding Alerts</span>
                                    </div>
                                    <div className="report-schedule-desc d-flex align-item-start">
                                        <span className="report-schedule-title fnt-12"><strong>Security Dept Capacity</strong></span>
                                        <span className="fnt-11"><b className="fnt-16">:</b> <strong className="fnt-16 mrL5">2</strong> Alerts</span>
                                    </div>
                                    <div className="d-flex align-item-start">
                                        <span className="report-schedule-title fnt-12"><strong>Average Alert Exposure</strong></span>
                                        <span className="fnt-11"><b className="fnt-16">:</b> <strong className="fnt-16 mrL5">2</strong> Days <strong className="fnt-16 mrL5 mrR5">3</strong> Hrs <strong className="fnt-16">21</strong> Secs </span>
                                    </div>
                                </div>
                            </Grid>
                            <Grid item xs={6}>
                                <div className="report-schedule-info schedule-count">
                                    <div className="report-schedule-desc d-flex align-item-start">
                                        <span className="report-schedule-title fnt-12">
                                            <strong>Security Policies</strong><br />
                                            <span className="fnt-11">(Enabled/Suppressed)</span>
                                        </span>
                                        <span className="fnt-16">
                                            <b>:</b>
                                            <span className="text-success mrL5">7 </span> /
                                            <span className="text-danger">2</span>
                                        </span>
                                    </div>
                                    <div className="report-schedule-desc d-flex align-item-start">
                                        <span className="report-schedule-title fnt-12">
                                            <strong>Security Rules</strong><br />
                                            <span className="fnt-11">(Enabled/Suppressed)</span>
                                        </span>
                                        <span className="fnt-16">
                                            <b>:</b>
                                            <span className="text-success mrL5">149 </span> /
                                            <span className="text-danger">3</span>
                                        </span>
                                    </div>
                                    <div className="report-schedule-desc d-flex align-item-start">
                                        <span className="report-schedule-title fnt-12">
                                            <strong>Infrastructure Scan Schedule</strong><br />
                                            <span className="fnt-11">Median Time to Detect</span>
                                        </span>
                                        <span className="fnt-16">
                                            <b>:</b>
                                            <span className=" mrL5"><b>1</b> </span>
                                            <span className="fnt-11">Minute</span>
                                        </span>
                                    </div>
                                    <div className="d-flex align-item-start">
                                        <span className="report-schedule-title fnt-12">
                                            <strong>Remediation Plans</strong><br />
                                            <span className="fnt-11">Closed/Active Since Last Report</span>
                                        </span>
                                        <span className="fnt-16">
                                            <b>:</b>
                                            <span className="mrL5"><b>23</b> </span> /
                                            <span className="text-success">2</span>
                                        </span>
                                    </div>
                                </div>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid container spacing={24} className="mrB15">
                    <Grid item md={6}>
                        <div className="report-attack-count">
                            <div className="status-bar-sub-heading pdL30">Attack Surface (Current)</div>
                            <AlertCount alertTitle={"CRITICAL"} borderColorClass={"alert-critical"} alertCount={"47"} />
                            <AlertCount alertTitle={"HIGH"} borderColorClass={"alert-high"} alertCount={"26"} />
                            <AlertCount alertTitle={"MEDIUM"} borderColorClass={"alert-mid"} alertCount={"58"} />
                            <AlertCount alertTitle={"LOW"} borderColorClass={"alert-low"} alertCount={"7"} />
                            <AlertCount alertTitle={"SUPPRESSED"} borderColorClass={"alert-surpress"} alertCount={"12"} />
                        </div>
                    </Grid>
                    <Grid item md={6}>
                        <div className="report-attack-count">
                            <div className="status-bar-sub-heading">Attack Surface (Projected)</div>
                            <AlertCount alertTitle={"CRITICAL"} borderColorClass={"alert-critical"} alertCount={"47"} />
                            <AlertCount alertTitle={"HIGH"} borderColorClass={"alert-high"} alertCount={"26"} />
                            <AlertCount alertTitle={"MEDIUM"} borderColorClass={"alert-mid"} alertCount={"58"} />
                            <AlertCount alertTitle={"LOW"} borderColorClass={"alert-low"} alertCount={"7"} />
                            <AlertCount alertTitle={"SUPPRESSED"} borderColorClass={"alert-surpress"} alertCount={"12"} />
                        </div>
                    </Grid>
                </Grid>
                <Grid container spacing={24}>
                    <Grid item md={12}>
                        <Typography className="mrB15 heading-h3" component="h3">
                            Cloud Infrastructure Details
                        </Typography>
                    </Grid>
                </Grid>
                <Grid container spacing={24}>
                    <Grid item md={6}>
                        <div className="status-bar-sub-heading fnt-14">Cloud Accounts (3)</div>
                        <div className="report-line-chart">
                            <LineChart lineColor={"#225BDE"} />
                        </div>
                    </Grid>
                    <Grid item md={6}>
                        <div className="status-bar-sub-heading fnt-14">Cloud Assets (363)</div>
                        <div className="report-line-chart">
                            <LineChart lineColor={"#225BDE"} />
                        </div>
                    </Grid>
                </Grid>
            </div>
        )
    }
}


export default Security