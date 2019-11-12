/*
 * @Author: Virendra Patidar 
 * @Date: 2018-11-16 14:55:42 
 * @Last Modified by: Virendra Patidar
 * @Last Modified time: 2019-03-14 12:27:15
 */
import React, { PureComponent } from 'react';

import { List, ListItem, ListItemText, Typography } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Fade from '@material-ui/core/Fade';
import Grid from '@material-ui/core/Grid';
import Popper from '@material-ui/core/Popper';

import history from 'customHistory';

import { ScoreBox } from 'hoc/ScoreBox';
import { AlertCount } from 'hoc/AlertCount';
import { CardWithTitle } from 'hoc/CardWithTitle';
import LabelWithHelper from 'hoc/Label/LabelWithHelper';

import RiskScore from 'global/RiskScore';
import SearchField from 'global/SearchField';


import RemediationList from './RemediationList';

import { withRouter } from 'react-router-dom'
import { connect } from "react-redux"
import { bindActionCreators } from 'redux'

import * as remediationActions from 'actions/remediationAction'
import * as securityActions from 'actions/securityAction'
import { showMessage } from 'actions/messageAction'
import { setProgressBar } from 'actions/commonAction'

import { convertDateFormatWithTime } from 'utils/dateFormat'

const alertClassName = { CRITICAL: 'alert-critical', HIGH: 'alert-high', MEDIUM: 'alert-mid', LOW: 'alert-low', SUPPRESSED: 'alert-surpress' }


class Remediation extends PureComponent {

    state = {
        search: '',
        placement: null,
        planPopperEl: null,
        openPopperPopOver:false,

        alert_summery_list: [
            { type: "CRITICAL", count: 0 },
            { type: "HIGH", count: 0 },
            { type: "MEDIUM", count: 0 },
            { type: "LOW", count: 0 },
            { type: "SUPPRESSED", count: 0 }
        ],
        total_alerts: 0,
        risk_score_data:{},
        planCountData:{active: 0, archived: 0}
    }


    componentDidMount() {
        this.fetchRiskScoreSummery()
        this.fetchAlertSummery()
        // this.fetchOverAllProjectedRiskScore()
        this.fetchRemediationPlanCount()
    }

    fetchRiskScoreSummery() {
        let payload = {}

        this.props.actions.fetchRiskScoreSummery(payload).
            then(result => {
                if (typeof result !== 'string') {
                        this.setState({ risk_score_data: result });
               } else {
                   console.log(' Error in fetching risk score summery :- ',result);
               }
            });
    }

    fetchRemediationPlanCount() {
        let payload = {}

        this.props.actions.fetchRemediationPlanCount(payload).
            then(result => {
                if (typeof result !== 'string') {
                    this.setState({ planCountData: result });
               } else {
                   console.log(' Error in fetching risk score summery :- ',result);
               }
            });
    }


    fetchAlertSummery() {
        let payload = {}

            let result = {
                list: [
                    { type: "CRITICAL", count: 47 }, 
                    { type: "HIGH", count: 26 },
                    { type: "MEDIUM", count: 58 },
                    { type: "LOW", count: 7 },
                    { type: "SUPPRESSED", count: 12 }
                ],
                total_alerts: 151
            }
           
                this.setState({ alert_summery_list: result.list, total_alerts: result.total_alerts })
            

    }
    
    fetchOverAllProjectedRiskScore() {
        let payload = {}
        this.props.actions.fetchOverAllProjectedRiskScore(payload).
            then(result => {
                if (typeof result !== 'string') {
                     //this.setState({ alert_summery_list: result.list, total_alerts: result.total_alerts })
                } else {
                    console.log(' Error in fetching over all projected risk score :- ',result);
                }
            });
    }


    searchHandler = name => event => {
        this.setState({ search: event.target.value })
    }


    handlePlanPopper = (placement) => (event) => {
        const { currentTarget } = event;
        this.setState(state => ({
            planPopperEl: currentTarget,
            openPopperPopOver: state.placement !== placement || !state.openPopperPopOver,
            placement,
        }));
    };

    render() {
        const { planCountData,placement, openPopperPopOver, planPopperEl, alert_summery_list, total_alerts,risk_score_data } = this.state;

        return (
            <CardWithTitle title={"Remediation"} bgImageClass={"card-inner card-remediation"}>
                <Grid container spacing={24}>
                <Grid item sm={12}> 
                        <LabelWithHelper message={"Status"} title={"Status - "+total_alerts} content={"Total number of outstanding cloud security detected."} />
                    </Grid>
                    
                    <Grid item sm={12}>
                        <div className="d-flex align-item-center d-block-mob">
                            <div className="alert-count mrR20">
                                {alert_summery_list.map(alert => <AlertCount key={alert.type} toggleDrawer={this.toggleDrawer} borderColorClass={alertClassName[alert.type]} alertTitle={alert.type} alertCount={<span>{alert.count}<span className="fnt-11">/{total_alerts}</span></span>} />)}
                            </div>
                            <RiskScore score_calculation_date={risk_score_data.score_calculation_date?convertDateFormatWithTime(risk_score_data.score_calculation_date):'-'} riskScore={risk_score_data.risk_score ? risk_score_data.risk_score:0} />
                            <ScoreBox addClass={"brd-btm-green"} title={<LabelWithHelper message={"Active"} content={"Choose between viewing the active remediation plans and the archived (completed) remediation plans."} title={<span>Active - <span className="font-normal pdR10">Open</span> <i className="fa fa-angle-down font-bold"></i></span>} />} count={planCountData.active} />
                            <ScoreBox addClass={"brd-btm-gray"} title={<span className="font-bold">Archived (closed)</span>} count={planCountData.archived} />
                        </div>
                    </Grid>
                    <Grid item sm={12}>
                        <Typography component="p" className="fnt-13">
                            This page shows all active remediation plans used to track in real-time the remediation alerts. Click on the ">" arrow to review the details of the projected risk score and compliance improvement percentage.
                            Click on "Generate Report" icon to export the remediation plan which included the remediation steps to solve the selected cloud security risks
                        </Typography>
                    </Grid>
                </Grid>
                <Grid container spacing={24}>
                    <Grid item sm={12}>
                        <div className="d-flex justify-flex-end">
                            <SearchField handleChange={this.searchHandler} />
                        </div>
                    </Grid>
                </Grid>
                <Grid container spacing={24} className="grid-container">
                    <Grid item sm={12}>
                        <RemediationList />
                    </Grid>
                </Grid>
                <Popper style={{ zIndex: '10' }} open={openPopperPopOver} anchorEl={planPopperEl} placement={placement} transition>
                    {({ TransitionProps }) => (
                        <Fade {...TransitionProps} timeout={350}>
                            <div>
                                <List className="list-filter width-auto list-plan">
                                    <ListItem className="list-filter-item">
                                        <ListItemText onClick={() => history.push('/app/remediation/auto-generated')} className="list-filter-text" primary={"Auto generated"} />
                                    </ListItem>
                                    <ListItem className="list-filter-item">
                                        <ListItemText className="list-filter-text" primary={"Manual"} />
                                    </ListItem>
                                </List>
                            </div>
                        </Fade>
                    )}
                </Popper>
            </CardWithTitle>
        )
    }

}

const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators(Object.assign({}, remediationActions,securityActions), dispatch),
        showMessage: message => {
            dispatch(showMessage(message))
        }, setProgressBar: isProgress => {
            dispatch(setProgressBar(isProgress))
        }
    };
}

export default withRouter(connect(null, mapDispatchToProps)(Remediation))