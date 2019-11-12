/*
 * @Author: Virendra Patidar 
 * @Date: 2018-09-27 09:03:40 
 * @Last Modified by: Virendra Patidar
 * @Last Modified time: 2019-05-29 12:50:00
 */
import React, { PureComponent } from 'react';

import Paper from '@material-ui/core/Paper';
import LabelWithHelper from 'hoc/Label/LabelWithHelper';
import { BarChart } from 'react-d3-components';

import { withRouter } from 'react-router-dom'

import { connect } from "react-redux"
import { bindActionCreators } from 'redux'
import { store } from 'client'
import { cloneDeep } from "lodash"

import * as securityActions from 'actions/securityAction'
import { showMessage } from 'actions/messageAction'
import { setProgressBar, setReportTabValue, setActiveMenu, setActiveParentMenu, setRiskScores } from 'actions/commonAction'

import history from 'customHistory'
import moment from 'moment'

const riskType = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']
const scaleColor = ['#24BA4D', '#ECD24E', '#ECA84E', '#EC4E4E']
const riskLabelColor = ['text-success', 'text-warning', 'text-orange', 'text-danger']

class RiskScore extends PureComponent {

    list_score = []
    state = {
        chartData: {
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
        },
        data: {}
    }

    componentDidMount() {
        this._mounted = true
        const filterData = this.props.filterData
        /* if (filterData.selectAccount.id !== 'all') {
            this.fetchRiskScoreSummery(filterData)
        } */
        let selectedAccounts = []
        if (filterData.selectCloud.id !== 'all'){
            this.props.accountList.map(account => {
                if (filterData.selectCloud.id === account.cloud) {
                    selectedAccounts.push(account)
                }
            })
        } else {
            selectedAccounts = this.props.accountList
        }
        this._mounted = false;
        this.fetchRiskScoreSummery(selectedAccounts)
        this.unsubscribe = store.subscribe(this.receiveFilterData)
    }


    receiveFilterData = data => {

        const currentState = store.getState()
        const previousValue = this.currentValue
        this.currentValue = currentState.uiReducer.filterData
        if (
            this.currentValue && previousValue !== this.currentValue && this._mounted
        ) {
            const filterData = cloneDeep(currentState.uiReducer.filterData)
            /* if (filterData.selectAccount.id !== 'all' && this._mounted) {
                this.fetchRiskScoreSummery(filterData)
            } */
            this.setState({ data: {}}, () => {
                let selectedAccounts = []
                if (filterData.selectCloud.id !== 'all'){
                    this.props.accountList.map(account => {
                        if (filterData.selectCloud.id === account.cloud) {
                            selectedAccounts.push(account)
                        }
                    })
                } else {
                    selectedAccounts = this.props.accountList
                }

                this.fetchRiskScoreSummery(selectedAccounts)
            })
        }
    }


    fetchRiskScoreSummery(selectedAccounts) {
        selectedAccounts.map(account => {
            let payload = { accountId: account.id }

            this.props.actions.fetchRiskScoreSummery(payload).
                then(result => {
                    if (typeof result !== 'string') {
                        let score = {}
                        score[account.id] = result.risk_score
                        this.props.setRiskScores(score)
                        let total_score = 0
                        this.list_score.push(result.risk_score)
                        this.list_score.map(item_score => {
                            total_score += item_score
                        })
                        let average = Math.round(total_score/this.list_score.length)
                        this.setState({ data: {risk_score: average} });
                    } else {
                        console.log(' Error in fetching risk score summery :- ', result);
                    }
                });
        })
    }

    viewSecurityPage = () => {
        history.push('/app/reports/security')
        this.props.setReportTabValue(1)
        this.props.setActiveMenu('Security')
        this.props.setActiveParentMenu('Reports')
    }


    render() {
        const { chartData, data } = this.state
        let riskScore = 0
        if (data.risk_score >= 25 && data.risk_score <= 49) {
            riskScore = 1
        }
        if (data.risk_score >= 50 && data.risk_score <= 79) {
            riskScore = 2
        }
        if (data.risk_score >= 80) {
            riskScore = 3
        }
        //const riskScore = Math.round((data.risk_score ? data.risk_score : 0) / 20);
        //const scaleScore = Math.round((data.risk_score ? data.risk_score : 0) / 4);

        //const riskScore = 20;
        //const scaleScore = 20;

        let scoreColors = []

        for (var i = 0; i < 20; i++) {
            let c = i * 5
            if (c <= 24 && c <= data.risk_score) {
                scoreColors.push(scaleColor[0])
            } else if (c >= 25 && c <= 49 && c <= data.risk_score) {
                scoreColors.push(scaleColor[1])
            } else if (c >= 50 && c <= 79 && c <= data.risk_score) {
                scoreColors.push(scaleColor[2])
            } else if (c >= 80 && c <= data.risk_score) {
                scoreColors.push(scaleColor[3])
            } else {
                scoreColors.push('#fcfcfc')
            }
        }

         /* for(var j=scoreColors.length;j < 20;j++){
            scoreColors.push('#fcfcfc')
        } */

        const scale = d3.scale.ordinal().range(scoreColors);
        const score_calculation_date = moment(new Date()).format("hh:mm A");
        let tooltipBarChart = function () {
            return (
                <span className="barchart-tooltip">{score_calculation_date}</span>
            );
        };

        return (

            <Paper className="white-paper" elevation={1}>
                <div className="white-paper-head">
                    <LabelWithHelper message={"Infrastructure Risk Score"} title={"Risk Score"} content={'<div><p>The Secberus Infrastructure Risk Score is a multi-faceted, real-time assessment of you cloud infrastructure.</p> <p>The SIR Score is generated via the Cumulus Risk Engine, which incorporates your security aptitude, the nature of the assets deployed in your infrastructure and the severity of the rules being violated.</p></div>'} />
                    {/* <div>
                        <div className="fnt-12">Last scan: {score_calculation_date}</div>
                    </div> */}

                </div>
                <div className="paper-content">
                    <div className={riskLabelColor[riskScore] + " mrB5"}>
                        {riskType[riskScore]}
                    </div>
                    <div className="graph-text">

                        <span className="count-data" style={{ flexGrow: 1 }}>
                            {data.risk_score !== undefined ? Math.round(data.risk_score) : '0'}
                        </span>
                        <span>
                            <BarChart
                                data={chartData}
                                width={150}
                                height={40}
                                margin={{ top: 0, bottom: 0, left: 0, right: 20 }}
                                colorByLabel={false}
                                colorScale={scale}
                                Grid={0}
                                tooltipHtml={tooltipBarChart}
                            // onClick={() => this.props.toggleDrawer('right', true, data)}
                            />
                        </span>
                    </div>
                </div>
            </Paper>
        );
    }
}


const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators(Object.assign({}, securityActions), dispatch),
        showMessage: message => {
            dispatch(showMessage(message))
        }, setProgressBar: isProgress => {
            dispatch(setProgressBar(isProgress))
        }, setReportTabValue: reportTabValue => {
            dispatch(setReportTabValue(reportTabValue))
        }, setActiveMenu: activeMenu => {
            dispatch(setActiveMenu(activeMenu))
        }, setActiveParentMenu: activeParentMenu => {
            dispatch(setActiveParentMenu(activeParentMenu))
        }, setRiskScores: riskScores => {
            dispatch(setRiskScores(riskScores))
        }
    };
}

const mapStateToProps = (state, ownProps) => ({
    filterData: state.uiReducer.filterData,
    accountList: state.commonReducer.cloud_accounts
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(RiskScore))