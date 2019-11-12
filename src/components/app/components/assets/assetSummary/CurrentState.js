/*
 * @Author: Virendra Patidar 
 * @Date: 2018-11-16 14:55:42 
 * @Last Modified by: Virendra Patidar
 * @Last Modified time: 2019-05-22 13:59:11
 */
import React, { PureComponent } from 'react'
import Grid from '@material-ui/core/Grid'
import AssetsWrapperAlternative from 'global/AssetsWrapperAlternative'
import { AlertCount } from 'hoc/AlertCount'
import CurrentStateList from './CurrentStateList'
import Typography from '@material-ui/core/Typography'


class CurrentState extends PureComponent {
    state={
        data:{
            "region": "us-east-1" ,
            "is_public": false,
            "db_snapshot_identifier": "snapshot-test",
            "db_instance_identifier": "lolpppp",
            "snapshot_create_time": "2019-05-23 18:36:08.348000+00:00",
            "engine": "sqlserver-se",
            "allocated_storage": 200,
            "status": "available",
            "port": 1433,
            "availability_zone": "us-east-1b",
            "vpc_id": "vpc-b82b64de",
            "instance_create_time":  "2019-05-23 18:36:08.348000+00:00",
            "master_username": "dezmund",
            "engine_version": "12.00.5571.0.v1",
            "licence_model": "licence-included",
            "snapshot_type": "manual",
            "option_group_name": "default:sqlserver-se-12-00",
            "percent_progress": 100,
            "storage_type": "standard",
            "encrypted": false,
            "db_snapshot_arn": "arn:aws:rds:us",
            "east-1:106512308171":"snapshot:snapshot-test",
            "iam_database_authentication_enabled": false,
            "dbi_resource_id": "db-U6WKHQ6A3GFFG4DNPXAKIDW6PI"
        },
        rules_passed: 0,
        rules_failed: 0,
        count_critical: 0,
        count_high: 0,
        count_medium: 0,
        count_low: 0,
        count_suppressed: 0
    }

    componentDidMount() {
        let count_critical = 0
        let count_high = 0
        let count_medium = 0
        let count_low = 0
        let count_suppressed = 0
        this.props.alerts.map(alert => {
            if (alert.suppressed) {
                count_suppressed++
            }
            if (alert.rule.priority !== undefined) {
                if (alert.rule.priority.name.toLowerCase() === 'critical') {
                    count_critical++
                }
                if (alert.rule.priority.name.toLowerCase() === 'high') {
                    count_high++
                }
                if (alert.rule.priority.name.toLowerCase() === 'medium') {
                    count_medium++
                }
                if (alert.rule.priority.name.toLowerCase() === 'low') {
                    count_low++
                }
            }
        })
        this.setState({ rules_failed: this.props.alerts.length, count_critical, count_high, count_medium, count_low, count_suppressed });
    }

    render() {
        const {data, rules_passed, rules_failed, count_critical, count_high, count_medium, count_low, count_suppressed}=this.state
        const {asset, alerts}=this.props
        return (
            <Grid container spacing={16} className="height-100">
                <Grid item md={12} className="height-100">
                    <Grid container spacing={32} className="mrB15">
                        {/* <Grid item md={2}>
                            <div className="assets-wrapper assets-wrapper-passed">
                                <AssetsWrapperAlternative progressBarColorClass={"asset-progress-bar-green"}  assetName={"Rule Passed"} assetCount={rules_passed} />
                            </div>
                        </Grid> */}
                        <Grid item md={3}>
                            <div className="assets-wrapper assets-wrapper-failed">
                                <AssetsWrapperAlternative progressBarColorClass={"asset-progress-bar-red"}  assetName={"Rule Failed"} assetCount={rules_failed} />
                            </div>
                        </Grid>
                        <Grid item md={6}>
                            <div className="alert-count justify-content-center">
                                <AlertCount key={"CRITICAL"}  borderColorClass={"alert-critical"} alertTitle={"CRITICAL"} alertCount={count_critical} />
                                <AlertCount key={"HIGH"} borderColorClass={"alert-high"} alertTitle={"HIGH"} alertCount={count_high} />
                                <AlertCount key={"MEDIUM"} borderColorClass={"alert-mid"} alertTitle={"MEDIUM"} alertCount={count_medium} />
                                <AlertCount key={"LOW"}  borderColorClass={"alert-low"} alertTitle={"LOW"} alertCount={count_low} />
                                <AlertCount key={"suppressed"}  borderColorClass={"alert-surpress"} alertTitle={"suppressed"} alertCount={count_suppressed} />
                            </div>
                        </Grid>
                        <Grid item md={3}>
                            <div className="assets-wrapper text-center assets-wrapper-weight">
                                <AssetsWrapperAlternative  progressBar={false} assetName={"Asset Weight"} assetCount={asset.score} />
                            </div>
                        </Grid>
                    </Grid>
                    <Grid container spacing={32} className="height-100">
                        <Grid item md={12}>
                            <CurrentStateList alerts={alerts} asset={asset}/>
                        </Grid>
                    </Grid>
                </Grid>
                {/* <Grid item md={4}>
                <Typography component="p" className="mrB5">
                    Last Seen Raw Data:
                </Typography>
                    <div className="raw-data-box">
                        <pre>
                            { JSON.stringify(data,null, 2)}
                        </pre>
                
                    </div>
                </Grid> */}
            </Grid>
        )
    }
}

export default CurrentState