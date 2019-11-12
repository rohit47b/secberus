/*
 * @Author: Virendra Patidar 
 * @Date: 2018-11-16 14:55:42 
 * @Last Modified by: Virendra Patidar
 * @Last Modified time: 2019-05-29 12:50:12
 */

import React, { PureComponent } from 'react';
import { BarChart } from 'react-d3-components';

import LabelWithHelper from 'hoc/Label/LabelWithHelper';


const riskType = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']
const scaleColor = ['#24BA4D', '#ECD24E', '#ECA84E', '#EC4E4E']
const riskLabelColor = ['text-gray', 'text-success', 'text-warning', 'text-orange', 'text-danger']

class RiskScore extends PureComponent {

    state = {
        search: '',
        placement: null,
        popperEl: null,
        openPopOver: false,
        planPopperEl: null,
        openPlanPopOver: false,
        data: {
            label: 'critical',
            values: [
                { x: 'Suppessed1', y: 4 },
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

    handleClick = (placement) => (event) => {
        const { currentTarget } = event;
        this.setState(state => ({
            popperEl: currentTarget,
            openPopOver: state.placement !== placement || !state.openPopOver,
            placement,
        }));
    }

    handlePlanPopper = (placement) => (event) => {
        const { currentTarget } = event;
        this.setState(state => ({
            planPopperEl: currentTarget,
            openPopperPopOver: state.placement !== placement || !state.openPopperPopOver,
            placement,
        }));
    }

    render() {
        const { data } = this.state
        // const scale = d3.scale.ordinal().range(['#24BA4D', '#24BA4D', '#24BA4D', '#ECD24E', '#ECD24E', '#ECD24E', '#ECA84E', '#ECA84E', '#ECA84E', '#fcfcfc', '#fcfcfc']);

        const { riskScore, score_calculation_date, popUpContent } = this.props


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

        for (var i = 1; i < scaleScore + 1; i++) {
            scoreColors.push(scaleColor[Math.ceil(i / 5) - 1])
        }

        for (var j = scoreColors.length; j < 20; j++) {
            scoreColors.push('#fcfcfc')
        }

        const scale = d3.scale.ordinal().range(scoreColors);

        let tooltipBarChart = function () {
            return (
                <span className="barchart-tooltip">{score_calculation_date ? score_calculation_date : '-'}</span>
            );
        };


        return (
            <div className="score-count">
                <div className="score-box">
                    <div className="mrB5">
                        <LabelWithHelper message={"Projected Risk Score"} title={"Projected Risk Score"} content={!popUpContent ? "This indicate the changes in the overall Risk Score after completing the active remediation plans." : popUpContent} />
                    </div>
                    <div className="brd-btm-yellow d-flex middle-count">
                        <div className="score-count-issue">
                            <span className={riskLabelColor[riskScoreNo] + " fnt-12"}>
                                {riskType[riskScoreValue]}
                            </span>
                            <div className="count">
                                {Math.round(riskScore)}
                            </div>
                        </div>
                        <div className="graph-text" style={{ height: '40px' }}>
                            <BarChart
                                data={data}
                                width={160}
                                height={40}
                                margin={{ top: 0, bottom: 0, left: 10, right: 10 }}
                                colorByLabel={false}
                                colorScale={scale}
                                Grid={0}
                                tooltipHtml={tooltipBarChart}
                            />
                        </div>
                        {/* <div className="count-label">
                            15  <i className="fa fa-arrow-down" aria-hidden="true"></i>
                        </div> */}
                    </div>

                </div>
            </div>
        )
    }
}

export default RiskScore; 