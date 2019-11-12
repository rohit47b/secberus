/*
 * @Author: Virendra Patidar 
 * @Date: 2018-11-16 14:55:42 
 * @Last Modified by: Virendra Patidar
 * @Last Modified time: 2019-05-28 16:03:55
 */
import { BarChart } from 'react-d3-components'
import Paper from '@material-ui/core/Paper'
import React, { PureComponent } from 'react'
import Typography from '@material-ui/core/Typography'
import { AlertCount } from 'hoc/AlertCount'
import LabelWithHelper from 'hoc/Label/LabelWithHelper'

class AttackSurface extends PureComponent {

    state = {
        total_alerts: 0,
        critical_alert_count: { open: 0, closed: 0 },
        high_alert_count: { open: 0, closed: 0 },
        low_alert_count: { open: 0, closed: 0 },
        medium_alert_count: { open: 0, closed: 0 },
        suppressed_alert_count: 0,
    }


    componentDidMount(){
        // if (this.props.alert_summary.summary) {
        //     this.setData()
        // }
    }
    
    componentDidUpdate = (prevProps, prevState) => {
        if (this.props.alert_summary.summary!==prevProps.alert_summary.summary) {
            this.setData()
        }
    }


    setData = () => {
        let CRITICAL = { open: 0, closed: 0 }, MEDIUM = { open: 0, closed: 0 }, HIGH = { open: 0, closed: 0 }, LOW = { open: 0, closed: 0 }, suppressed = 0;
        this.props.alert_summary.summary.map((item, index) => {
            if (item.priority === 'CRITICAL') {
                CRITICAL = { open: item.open, closed: item.closed }
            } else if (item.priority === 'MEDIUM') {
                MEDIUM = { open: item.open, closed: item.closed }
            } else if (item.priority === 'HIGH') {
                HIGH = { open: item.open, closed: item.closed }
            } else if (item.priority === 'LOW') {
                LOW = { open: item.open, closed: item.closed }
            }
        })
        this.setState({ critical_alert_count: CRITICAL, medium_alert_count: MEDIUM, high_alert_count: HIGH, low_alert_count: LOW, suppressed_alert_count: this.props.alert_summary.suppressed })
    }

    toggleDrawer=()=>{
        
    }

    render() {
        const { title, content } = this.props
        const { critical_alert_count,
            high_alert_count,
            low_alert_count,
            medium_alert_count,
            suppressed_alert_count } = this.state
        return (
            <Paper elevation={1} className="paper-box pdT15">
                <LabelWithHelper message={title} content={content} />
                <Typography className="mrB20 report-title text-center heading-h4" component="h4">
                <strong>{title}</strong>
                </Typography>
                <div className="report-attack-count justify-content-center">
                    <AlertCount toggleDrawer={this.toggleDrawer} alertTitle={"CRITICAL"} borderColorClass={"alert-critical"} alertCount={critical_alert_count.open} />
                    <AlertCount toggleDrawer={this.toggleDrawer} alertTitle={"HIGH"} borderColorClass={"alert-high"} alertCount={high_alert_count.open} />
                    <AlertCount toggleDrawer={this.toggleDrawer} alertTitle={"MEDIUM"} borderColorClass={"alert-mid"} alertCount={medium_alert_count.open} />
                    <AlertCount toggleDrawer={this.toggleDrawer} alertTitle={"LOW"} borderColorClass={"alert-low"} alertCount={low_alert_count.open} />
                    <AlertCount toggleDrawer={this.toggleDrawer} alertTitle={"SUPPRESSED"} borderColorClass={"alert-surpress"} alertCount={suppressed_alert_count} />
                </div>
            </Paper>
        )
    }
}


export default AttackSurface