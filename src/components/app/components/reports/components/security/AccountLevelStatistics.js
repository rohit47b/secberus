/*
 * @Author: Virendra Patidar 
 * @Date: 2018-11-16 14:55:42 
 * @Last Modified by: Virendra Patidar
 * @Last Modified time: 2019-05-30 20:03:52
 */
import { BarChart } from 'react-d3-components'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import React, { PureComponent } from 'react'
import Typography from '@material-ui/core/Typography'
import LabelWithHelper from 'hoc/Label/LabelWithHelper'
import { calculateDaysFromTimeByLongFormat } from 'utils/dateFormat'
class AccountLevelStatistics extends PureComponent {


    state = {
        days: 0,
        hours: 0,
        minutes: 0,

        scan_schedule_days: 0,
        scan_schedule_hours: 0,
        scan_schedule_minutes: 0,
        scan_schedule_seconds: 0,

    }

    componentDidMount() {
        // this.calculateDaysHourMinute()
    }


    componentDidUpdate = (prevProps, prevState) => {
        if (this.props !== prevProps) {
            this.calculateDaysHourMinute()
            this.calculateInfrastructureScanSchedule()
        }
    }

    calculateDaysHourMinute() {
        var seconds = parseInt(this.props.avg_exposure, 10);

        var days = Math.floor(seconds / (3600 * 24));
        seconds -= days * 3600 * 24;
        var hrs = Math.floor(seconds / 3600);
        seconds -= hrs * 3600;
        var mnts = Math.floor(seconds / 60);
        seconds -= mnts * 60;
        this.setState({ days, hours: hrs, minutes: mnts })
    }


    calculateInfrastructureScanSchedule() {
        var seconds = parseInt(this.props.cloud_account.scan_interval / 2, 10);

        var days = Math.floor(seconds / (3600 * 24));
        seconds -= days * 3600 * 24;
        var hrs = Math.floor(seconds / 3600);
        seconds -= hrs * 3600;
        var mnts = Math.floor(seconds / 60);
        seconds -= mnts * 60;
        this.setState({ scan_schedule_days: days, scan_schedule_hours: hrs, scan_schedule_minutes: mnts, scan_schedule_seconds: seconds })
    }


    render() {
        const { remediation_summary, rule_summary, outstanding_count,remediation_aptitude } = this.props
        const { days, hours, minutes, scan_schedule_days, scan_schedule_hours, scan_schedule_minutes, scan_schedule_seconds } = this.state

        return (
            <Grid container spacing={24} className="mrB40">
                <Grid item  xs={12} sm={12} md={3}>
                    <Paper elevation={1} className="paper-box text-center paper-report">
                        <LabelWithHelper message={"Remediation Aptitude"} content={"Remediation Aptitude is the Alert Remediation rate of your Organization measured over the past 30 days."} />
                        <Typography className="mrB20 report-title heading-h4" component="h4">
                            Remediation Aptitude
                    </Typography>
                        <div className="report-content d-flex align-item-center justify-content-center flex-direction-col">
                            <Typography className="mrB10 report-count heading-h3" component="h3">
                                {Math.ceil(remediation_aptitude)}
                    </Typography>
                            <div>Alerts / day</div>
                        </div>
                    </Paper>
                </Grid>
                <Grid item  xs={12} sm={12} md={3}>
                    <Paper elevation={1} className="paper-box text-center paper-report">
                        <LabelWithHelper message={"Remediation Aptitude"} content={"Security Debt is the number of current outstanding Alerts, it is the total size of your Attack Surface."} />
                        <Typography className="mrB20 report-title heading-h4" component="h4">
                            Security Debt
                    </Typography>
                        <div className="report-content d-flex align-item-center justify-content-center flex-direction-col">
                            <Typography className="mrB10 report-count heading-h3" component="h3">
                                {outstanding_count}
                    </Typography>
                            <div>Outstanding Alerts</div>
                        </div>
                    </Paper>
                </Grid>
                {/* <Grid item md={3}>
                    <Paper elevation={1} className="paper-box text-center paper-report">
                        <LabelWithHelper message={" Security Debt Capacity"} content={"Security Debt Capacity is the difference between your Security debt and your Remediation Aptitude."} />
                        <Typography className="mrB20 report-title heading-h4" component="h4">
                            Security Debt Capacity
                    </Typography>
                        <div className="report-content d-flex align-item-center justify-content-center flex-direction-col">
                            <Typography className="mrB10 report-count heading-h3" component="h3">
                                2
                        </Typography>
                            <div>Alerts</div>
                        </div>
                    </Paper>
                </Grid> */}
                <Grid item  xs={12} sm={12} md={3}>
                    <Paper elevation={1} className="paper-box text-center paper-report">
                        <LabelWithHelper message={" Average Alert Exposure"} content={"Average Alert Exposure is the average amount of time Assets remain exposed to a Data Breach. Also known as your Median Time to Remediate."} />
                        <Typography className="mrB20 report-title heading-h4" component="h4">
                            Average Alert Exposure
                    </Typography>
                        <div className="report-content d-flex align-item-center justify-content-center">
                            <Typography className="mrB10 report-count" component="div">
                                {days}
                                <div className="small-fnt">Days</div>
                            </Typography>
                            <Typography className="mrB10 report-count pdL15 pdR15" component="div">
                                {hours}
                                <div className="small-fnt">Hrs</div>
                            </Typography>
                            <Typography className="mrB10 report-count" component="div">
                                {minutes}
                                <div className="small-fnt">Minutes</div>
                            </Typography>
                        </div>
                    </Paper>
                </Grid>
                {/* <Grid item md={3}>
                    <Paper elevation={1} className="paper-box text-center paper-report">
                        <LabelWithHelper message={" Security Policies"} content={"Enabled Security Policies will generate Alerts, Suppressed Policies will Suppress Alerts,but will still be considered in your Risk Posture score. Reports can be generated for all Security Policies including suppressed policies."} />
                        <Typography className="mrB20 report-title heading-h4" component="h4">
                            Security Policies
                       <div className="font-normal">(Enabled / Suppressed)</div>
                        </Typography>
                        <div className="report-content d-flex align-item-center justify-content-center">
                            <Typography className="mrB10 report-count" component="div">
                                <span className="text-green">7</span> / <span className="text-danger">2</span>
                            </Typography>
                        </div>
                    </Paper>
                </Grid> */}
                <Grid item  xs={12} sm={12} md={3}>
                    <Paper elevation={1} className="paper-box text-center paper-report">
                        <LabelWithHelper message={"Security Rules"} content={"Enabled Security Rules will generate Alerts, suppressed rules will suppress alerts, but will still be considered in your risk posture score. You can create unlimited rules which will automatically impact your risk posture score."} />
                        <Typography className="mrB20 report-title heading-h4" component="h4">
                            Security Rules
                       <div className="font-normal">(Enabled / Suppressed)</div>
                        </Typography>
                        <div className="report-content d-flex align-item-center justify-content-center">
                            <Typography className="mrB10 report-count" component="div">
                                <span className="text-green">{rule_summary.count ? rule_summary.count : 0}</span> / <span className="text-danger">{rule_summary.suppressed ? rule_summary.suppressed : 0}</span>
                            </Typography>
                        </div>
                    </Paper>
                </Grid>
                <Grid item  xs={12} sm={12} md={3}>
                    <Paper elevation={1} className="paper-box text-center paper-report">
                        <LabelWithHelper message={"Infrastructure Scan Schedule"} content={"The Infrastructure scan schedule is the user-determined schedule that Secberus runs scans of your Infrastructure for misconfigurations. This is your median time to detect misconfigurations."} />
                        <Typography className="mrB20 report-title heading-h4" component="h4">
                            Infrastructure Scan Schedule
                       <div className="font-normal">(Median Time to Detect)</div>
                        </Typography>
                        <div className="report-content d-flex align-item-center justify-content-center">

                            {scan_schedule_days > 0 && <Typography className="mrB10 report-count" component="div">
                                {scan_schedule_days}
                                <div className="small-fnt">Days</div>
                            </Typography>}
                            {scan_schedule_hours > 0 && <Typography className="mrB10 report-count pdL15 pdR15" component="div">
                                {scan_schedule_hours}
                                <div className="small-fnt">Hrs</div>
                            </Typography>}
                            <Typography className="mrB10 report-count pdR15" component="div">
                                <span className="text-green">{scan_schedule_minutes}</span>
                                <div className="small-fnt">Minutes</div>
                            </Typography>
                            {scan_schedule_seconds > 0 && <Typography className="mrB10 report-count" component="div">
                                <span className="text-green">{scan_schedule_seconds}</span>
                                <div className="small-fnt">Seconds</div>
                            </Typography>}


                        </div>
                    </Paper>
                </Grid>
                <Grid item  xs={12} sm={12} md={3}>
                    <Paper elevation={1} className="paper-box text-center paper-report">
                        <LabelWithHelper message={"Remediation Plans"} content={"This shows the number of Remediation Plans since the last report and the number of current active Remediation Plans."} />
                        <Typography className="mrB20 report-title heading-h4" component="h4">
                            Remediation Plans
                       <div className="font-normal">(Closed / Active Since Last Report)</div>
                        </Typography>
                        <div className="report-content d-flex align-item-center justify-content-center">
                            <Typography className="mrB10 report-count" component="div">
                                <span>{remediation_summary.archived_plan_count ? remediation_summary.archived_plan_count : 0}</span> / <span className="text-green">{remediation_summary.active_plan_count ? remediation_summary.active_plan_count : 0}</span>
                            </Typography>
                        </div>
                    </Paper>
                </Grid>
            </Grid>
        )
    }
}


export default AccountLevelStatistics