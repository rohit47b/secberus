/*
 * @Author: Virendra Patidar 
 * @Date: 2018-11-16 14:55:42 
 * @Last Modified by: Virendra Patidar
 * @Last Modified time: 2019-05-29 12:50:11
 */
import { BarChart } from 'react-d3-components'
import Paper from '@material-ui/core/Paper'
import React, { PureComponent } from 'react'
import Typography from '@material-ui/core/Typography'
import LabelWithHelper from 'hoc/Label/LabelWithHelper'

const riskType = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']
const scaleColor = ['#24BA4D', '#ECD24E', '#ECA84E', '#EC4E4E']
const riskLabelColor = ['text-gray', 'text-success', 'text-warning', 'text-orange', 'text-danger']

class RiskPostureProjectedBarChart extends PureComponent {
    state = {
        data: {
            label: 'critical',
            values: [                { x: 'Suppessed1', y: 4 },
            { x: 'Suppessed2', y: 5 },
            { x: 'Suppessed3', y: 6 },
            { x: 'Suppessed4', y: 7 },
            { x: 'Suppessed45', y: 8 },
            { x: 'Low1', y: 9 },
            { x: 'Low2', y: 10 },
            { x: 'Low3', y: 11 },
            { x: 'Low4', y: 12 },
            { x: 'Low5', y: 13 },
            { x: 'Mid1', y: 14 },
            { x: 'Mid2', y: 15 },
            { x: 'Mid3', y: 16 },
            { x: 'Mid4', y: 17 },
            { x: 'Mid5', y: 18 },
            { x: 'High1', y: 19 },
            { x: 'High2', y: 20 },
            { x: 'High3', y: 21 },
            { x: 'High4', y: 22 },
            { x: 'High5', y: 23 },
            ]
        }
    }

    render() {
        const { data } = this.state
        const { riskScore,remediation_plans } = this.props

        let tooltipBarChart = function () {
            return (
                <span className="barchart-tooltip">{'05:00 PM'}</span>
            );
        };

        let riskScoreValue = 0
        if (riskScore >= 25 && riskScore <= 49) {
            riskScoreValue = 1
        }
        if (riskScore >= 50 && riskScore <= 79) {
            riskScoreValue = 2
        }
        if (riskScore >= 80) {
            riskScoreValue = 3
        }

        const riskScoreNo = Math.round((riskScore ? riskScore : 0) / 20);
        const scaleScore = Math.round((riskScore ? riskScore : 0) / 5);

        let scoreColors = []

        for (var i = 0; i < 20; i++) {
            let c = i * 5
            if (c <= 24 && c <= riskScore) {
                scoreColors.push(scaleColor[0])
            } else if (c >= 25 && c <= 49 && c <= riskScore) {
                scoreColors.push(scaleColor[1])
            } else if (c >= 50 && c <= 79 && c <= riskScore) {
                scoreColors.push(scaleColor[2])
            } else if (c >= 80 && c <= riskScore) {
                scoreColors.push(scaleColor[3])
            } else {
                scoreColors.push('#fcfcfc')
            }
        }

        const scale = d3.scale.ordinal().range(scoreColors);

        return (
            <Paper elevation={1} className="paper-box"> 
            <LabelWithHelper message={"Risk Posture (Projected)"}  content={"The Projected Risk Posture Score is the Score after all Remediation Plans in progress are completed. It does NOT account for any new misconfigurations."} />
                <Typography className="mrB20 report-title text-center heading-h4" component="h4">
                <strong>Risk Posture (Projected)</strong>
                </Typography>
                <div className="status-report">
                    <div className="status-bar">
                    <div className={riskLabelColor[riskScoreNo] + " fnt-12"}>      {riskType[riskScoreValue]}</div>
                        <div className="graph-text mrB15">
                            <div className="status-bar-count">{Math.round(riskScore)}</div>

                            <BarChart
                                data={data}
                                width={150}
                                height={40}
                                margin={{ top: 0, bottom: 0, left: 0, right: 20 }}
                                colorByLabel={false}
                                colorScale={scale}
                                Grid={0}
                                // tooltipHtml={tooltipBarChart}
                            // onClick={() => this.props.toggleDrawer('right', true, data)}
                            />
                        </div>
                        <div className="fnt-11">Remediation Plans in Progress : {remediation_plans}</div>
                    </div>
                </div>
            </Paper>
        )
    }
}


export default RiskPostureProjectedBarChart