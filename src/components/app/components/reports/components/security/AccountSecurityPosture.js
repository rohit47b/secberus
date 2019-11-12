/*
 * @Author: Virendra Patidar 
 * @Date: 2018-11-16 14:55:42 
 * @Last Modified by: Virendra Patidar
 * @Last Modified time: 2019-04-23 16:58:55
 */
import { BarChart } from 'react-d3-components'
import Paper from '@material-ui/core/Paper'
import React, { PureComponent } from 'react'
import Typography from '@material-ui/core/Typography'

class AccountSecurityPosture extends PureComponent {
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
                <span className="barchart-tooltip">{'1 HR ago'}</span>
            );
        };
        const {cloud_account}=this.props
        return (
            <Paper elevation={1} className="paper-box" style={{cursor:"pointer"}}>
                <div className="status-report">
                    <div className="status-bar">
                        <Typography className="mrB15 report-title text-center heading-h4" component="h4">
                            {cloud_account}
                            <span className="mrL20 report-icon" onClick={()=>this.props.selectCloudAccount(cloud_account)}><img alt="Document" src="/assets/images/document_icon.png" width={15}></img></span>
                        </Typography>

                        <div className="status-bar-title">CRITICAL</div>
                        <div className="graph-text mrB15">
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
                        <div className="light-text">Projection :   <span className="chip chip-success">12 <i className="fa fa-arrow-down" aria-hidden="true"></i></span></div>
                    </div>
                </div>
            </Paper>
        )
    }
}


export default AccountSecurityPosture