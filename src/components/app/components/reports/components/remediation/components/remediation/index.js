/*
 * @Author: Virendra Patidar 
 * @Date: 2018-11-16 14:55:42 
 * @Last Modified by: Virendra Patidar
 * @Last Modified time: 2019-05-23 14:47:52
 */
import { List, ListItem, ListItemText, Typography } from '@material-ui/core';
import Fade from '@material-ui/core/Fade';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Popper from '@material-ui/core/Popper';
import { setProgressBar, setActiveMenu, setActiveParentMenu } from 'actions/commonAction';
import { showMessage } from 'actions/messageAction';
import * as remediationActions from 'actions/remediationAction';
import * as securityActions from 'actions/securityAction';
import { store } from 'client';
import history from 'customHistory';
import RiskScore from 'global/RiskScore';
import { AlertCount } from 'hoc/AlertCount';
import LabelWithHelper from 'hoc/Label/LabelWithHelper';
import { ScoreBox } from 'hoc/ScoreBox';
import { cloneDeep } from "lodash";
import React, { PureComponent } from 'react';
import { connect } from "react-redux";
import { withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import RemediationList from './RemediationList';


class Remediation extends PureComponent {

    state = {
        search: '',
        placement: null,
        planPopperEl: null,
        openPopperPopOver: false,

        data: {},

        total_alerts: 0,
        critical_alert_count: { open: 0, closed: 0 },
        high_alert_count:  { open: 0, closed: 0 },
        low_alert_count:  { open: 0, closed: 0 },
        medium_alert_count:  { open: 0, closed: 0 },
        suppressed_alert_count:  0,

        active_plan_count: 0,
        archived_plan_count: 0,
        projected_risk_score: 0,

        cloud_risk_score: 0,
        plan_risk_score: 0,

        remediation_plans:[]
    }


    componentDidMount() {
        this.props.setActiveParentMenu('Reports')
        this.props.setActiveMenu('Remediation')
        const filterData = this.props.filterData
        if (filterData.selectAccount.id !== 'all' && filterData.selectAccount.id !== undefined) {
            this._mounted = false
            this.fetchRemediationFull(filterData)
        }

        this.unsubscribe = store.subscribe(this.receiveFilterData)
    }

    receiveFilterData = data => {
        const currentState = store.getState()
        const previousValue = this.currentValue
        this.currentValue = currentState.uiReducer.filterData
        if (
            this.currentValue && previousValue !== this.currentValue
        ) {
            const filterData = cloneDeep(currentState.uiReducer.filterData)
            if (filterData.selectAccount.id !== 'all' && this._mounted) {
                this.fetchRemediationFull(filterData)
            }
        }
    }


    reFetchData=()=>{
        const filterData = this.props.filterData
        if (filterData.selectAccount.id !== 'all' && filterData.selectAccount.id !== undefined) {
            this.fetchRemediationFull(filterData)
        }

    }

    fetchRemediationFull(filterData) {
        this.props.actions.fetchRemediationFull(filterData.selectAccount.id).
            then(result => {
                this._mounted = true
                if (typeof result !== 'string') {
                    this.setState({ data: result,remediation_plans:[] }, () => {
                        this.setData()
                    })
                } else {
                    console.log(' Error in fetching Remediation Full summery :- ', result);
                }
            });
    }


    setData = () => {
        let CRITICAL = { open: 0, closed: 0 }, MEDIUM ={ open: 0, closed: 0 }, HIGH = { open: 0, closed: 0 }, LOW ={ open: 0, closed: 0 }, suppressed = 0;
        this.state.data.alert_summary.summary.map((item, index) => {
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
        this.setState({ total_alerts:this.state.data.alert_summary.alert_count, remediation_plans:this.state.data.remediation_plans, projected_risk_score:this.state.data.projected_risk_score, active_plan_count: this.state.data.active_plan_count, archived_plan_count: this.state.data.archived_plan_count, critical_alert_count: CRITICAL, medium_alert_count: MEDIUM, high_alert_count: HIGH, low_alert_count: LOW, suppressed_alert_count: this.state.data.alert_summary.suppressed })
    }



    handlePlanPopper = (placement) => (event) => {
        const { currentTarget } = event;
        this.setState(state => ({
            planPopperEl: currentTarget,
            openPopperPopOver: state.placement !== placement || !state.openPopperPopOver,
            placement,
        }));
    };

    toggleDrawer=()=>{
        
    }

    render() {
        mixpanel.track("View Page", {
            "Page Name": 'Report Remediation',
        });
        const { placement, openPopperPopOver, planPopperEl, cloud_risk_score, plan_risk_score, total_alerts,
            critical_alert_count,
            high_alert_count,
            low_alert_count,
            medium_alert_count,
            suppressed_alert_count,
            active_plan_count,
            archived_plan_count,
            projected_risk_score,
            remediation_plans
        } = this.state;

 

        const planId=this.props.location.state !==undefined ?this.props.location.state.planId :'';
        return (
            <div className="container">
                <Card className="card-wizard card-panel card-tab card-inner">
                    <div className="card-title">
                        <h3 className="mrB10 mr0 main-heading">Reports</h3>
                    </div>
                    <CardContent className="card-body">
                        <Typography component="div" className="container" >
                            <Grid container spacing={24}>
                                <Grid item xs={12} md={12}>
                                    <Typography className="heading-h3" component="h3">
                                        <strong> Remediation</strong>
                                    </Typography>
                                </Grid>
                            </Grid>

                            <Grid container spacing={24} className="mrB5">
                                <Grid item xs={12} sm={12}>
                                    <LabelWithHelper message={"Status"} title={"Status - " + total_alerts} content={"Total number of outstanding cloud security alerts detected."} />
                                </Grid>
                            </Grid>
                            <Grid container spacing={24}>
                                <Grid item xs={12} sm={12} md={5} className="col-38 remediation-status-layer">
                                    <div className="alert-count mrR20 report-remediation-status">
                                        <AlertCount key={"CRITICAL"} toggleDrawer={this.toggleDrawer} borderColorClass={"alert-critical"} alertTitle={"CRITICAL"} alertCount={<span>{critical_alert_count.open}<span className="fnt-11">/{critical_alert_count.closed}</span></span>} />
                                        <AlertCount key={"MEDIUM"} toggleDrawer={this.toggleDrawer} borderColorClass={"alert-mid"} alertTitle={"MEDIUM"} alertCount={<span>{medium_alert_count.open}<span className="fnt-11">/{medium_alert_count.closed}</span></span>} />
                                        <AlertCount key={"HIGH"} toggleDrawer={this.toggleDrawer} borderColorClass={"alert-high"} alertTitle={"HIGH"} alertCount={<span>{high_alert_count.open}<span className="fnt-11">/{high_alert_count.closed}</span></span>} />
                                        <AlertCount key={"LOW"} toggleDrawer={this.toggleDrawer} borderColorClass={"alert-low"} alertTitle={"LOW"} alertCount={<span>{low_alert_count.open}<span className="fnt-11">/{low_alert_count.closed}</span></span>} />
                                        <AlertCount key={"suppressed"} toggleDrawer={this.toggleDrawer} borderColorClass={"alert-surpress"} alertTitle={"suppressed"} alertCount={<span>{suppressed_alert_count}</span>} />

                                    </div>
                                </Grid>
                                <Grid item xs={12} sm ={12} md={7} className="col-62 remediation-status-layer">
                                    <div className="d-flex align-item-start text-wrap">
                                        <RiskScore score_calculation_date={'-'} riskScore={projected_risk_score} popUpContent="This indicates the projected Risk Score after completing the active remediation plans." />
                                        <ScoreBox addClass={"brd-btm-green"} title={<span className="font-bold">Active (Open)</span>} count={active_plan_count} />
                                        <ScoreBox addClass={"brd-btm-gray"} title={<span className="font-bold">Archived (closed)</span>} count={archived_plan_count} />
                                    </div>
                                </Grid>
                            </Grid>
                            <Grid container spacing={24}>
                                <Grid item xs={12} sm={12}>
                                    <Typography component="p" className="fnt-13">
                                        This page shows all active remediation plans used to track in real-time the remediation alerts. Click on the ">" arrow to review the details of the projected risk score and compliance improvement percentage.
                                        Click on "Generate Report" icon to export the remediation plan which included the remediation steps to solve the selected cloud security risks
                                    </Typography>
                                </Grid>
                            </Grid>
                            <RemediationList reFetchData={this.reFetchData} dataList={remediation_plans}  updatePageLocation={this.props.updatePageLocation} planId={planId}/>

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
                        </Typography>
                    </CardContent>
                </Card>
            </div>
        )
    }

}

const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators(Object.assign({}, remediationActions, securityActions), dispatch),
        showMessage: message => {
            dispatch(showMessage(message))
        }, setProgressBar: isProgress => {
            dispatch(setProgressBar(isProgress))
        }, setActiveMenu: activeMenu => {
            dispatch(setActiveMenu(activeMenu))
        },setActiveParentMenu: activeParentMenu => {
            dispatch(setActiveParentMenu(activeParentMenu))
        },
    };
}
const mapStateToProps = (state, ownProps) => ({
    filterData: state.uiReducer.filterData,
})


export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Remediation))