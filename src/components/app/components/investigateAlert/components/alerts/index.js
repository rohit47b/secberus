/*
 * @Author: Virendra Patidar 
 * @Date: 2018-11-16 14:55:42 
 * @Last Modified by: Virendra Patidar
 * @Last Modified time: 2019-05-29 12:47:22
 */
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { setProgressBar, setActiveMenu, setActiveParentMenu, setAlertsPlan } from 'actions/commonAction';
import { showMessage } from 'actions/messageAction';
import * as remediationActions from 'actions/remediationAction';
import * as securityActions from 'actions/securityAction';
import { store } from 'client';
import AddToPlan from 'global/AddToPlan';
import CreateRemediationPlan from 'global/CreatePlan';
import { AlertCount } from 'hoc/AlertCount';
import { CardWithTitle } from 'hoc/CardWithTitle';
import LabelWithHelper from 'hoc/Label/LabelWithHelper';
import { cloneDeep, find } from "lodash";
import React, { PureComponent, Fragment } from 'react';
import { connect } from "react-redux";
import { withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import InvestigateAlertList from './InvestigateAlertList';

const alertClassName = { CRITICAL: 'alert-critical', HIGH: 'alert-high', MEDIUM: 'alert-mid', LOW: 'alert-low', SUPPRESSED: 'alert-surpress' }
import SearchField from 'global/SearchField'

class InvestigateAlert extends PureComponent {

    _mounted = false
    state = {
        search: '',
        placement: null,
        popperEl: null,
        openPopOver: false,
        data: {
            alert_count: 0
        },

        critical_alert_count: 0,
        high_alert_count: 0,
        low_alert_count: 0,
        medium_alert_count: 0,
        suppressed_alert_count: 0,

        planDataList: [],
        selectedAlertIds: [],
        openDialog: false,
        priorityTitle: '',
        loaded: true,
        search: ''
    }

    componentDidMount() {
        this._mounted = true
        this.props.setActiveParentMenu('')
        this.props.setActiveMenu('Alerts')
        const filterData = this.props.filterData
        if (filterData.selectAccount.id !== 'all' && filterData.selectAccount.id !== undefined) {
            this._mounted = false
            this.fetchAlertSummery(filterData)
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
                this.fetchAlertSummery(filterData)
            }
        }
    }

    updateAlertId = (selectedAlertIds) => {
        this.props.setAlertsPlan(selectedAlertIds)
        this.setState({ selectedAlertIds })
    }

    fetchAlertSummery(filterData) {
        let payload = { accountId: filterData.selectAccount.id }

        this.props.actions.fetchAlertSummery(payload).
            then(result => {
                this._mounted = true
                if (typeof result !== 'string') {
                    if (this._mounted) {
                        this.setState({ data: result, selectedAlertIds: this.props.alerts_plan }, () => {
                            this.setAlertCountData()
                        })
                    }
                } else {
                    console.log(' Error in fetching alert summery :- ', result);
                }
            });
    }

    setAlertCountData = () => {
        const CRITICAL = find(this.state.data.summary, { priority: 'CRITICAL' }).open;
        const MEDIUM = find(this.state.data.summary, { priority: 'MEDIUM' }).open;
        const HIGH = find(this.state.data.summary, { priority: 'HIGH' }).open;
        const LOW = find(this.state.data.summary, { priority: 'LOW' }).open;
        const suppressed = this.state.data.suppressed;
        this.setState({ critical_alert_count: CRITICAL, medium_alert_count: MEDIUM, high_alert_count: HIGH, low_alert_count: LOW, suppressed_alert_count: suppressed }, () => {
            this.props.setProgressBar(false)
        })
    }


    handleClick = (placement) => (event) => {
        const { currentTarget } = event;
        this.setState(state => ({
            popperEl: currentTarget,
            openPopOver: state.placement !== placement || !state.openPopOver,
            placement,
        }));
    };

    handleOpenDialog = () => {
        this.setState({ openDialog: true, openPopOver: false });
    };
    handelCloseDialog = () => {
        this.setState({ openDialog: false, selectedAlertIds: [] });
    };

    handleSuccess = () => {
        this.setState({ openDialog: false, selectedAlertIds: [], openPopOver: false, filterProgress: true, dataList: [], pageNo: 1 }, () => {
            //   const filterData = this.props.filterData
            //   this.fetchAlerts(filterData)
        });
    }

    resetPriority = () => {
        this.setState({ priorityTitle: '' })
    }

    toggleDrawer = (alertTitle) => {
        this.setState({ loaded: false }, () => {
            let priority = ''
            if (alertTitle !== this.state.priorityTitle) {
                priority = alertTitle
            }
            this.setState({ priorityTitle: priority }, () => {
                this.setState({ loaded: true })
            })
        })

    };

    searchHandler = name => event => {
        this.setState({ search: event.target.value })
    }

    searchHandlerClick = event => {
        this.setState({loaded: false}, () => {
            this.setState({loaded: true})
        })
    }

    render() {
        mixpanel.track("View Page", {
            "Page Name": 'Investigate Alerts',
        });
        const { selectedAlertIds, popperEl, openPopOver, placement, data, openDialog,
            critical_alert_count,
            high_alert_count,
            low_alert_count,
            medium_alert_count,
            suppressed_alert_count,
            priorityTitle,
            loaded,
            search } = this.state;
        return (
            <CardWithTitle title={<h3 className="card-heading">Alerts (Investigate)</h3>} bgImageClass={"card-inner"}>
                <Grid container spacing={24}>
                    <Grid item sm={6}>
                        <LabelWithHelper message={"Alerts"} title={"Alerts - " + data.alert_count} content={"These are the total number of outstanding cloud security alerts as of the most recent scan."} />
                    </Grid>
                    <Grid item sm={6}>
                        <div className="d-flex align-item-center justify-flex-end">
                            <LabelWithHelper message={"Remediation Plan"} content={"To create a new remediation plan, or add  alert to an existing one, select the alert and follow the respective instructions."} />
                            <Button className="btn-primary mrL10" onClick={this.handleClick('bottom-start')} disabled={selectedAlertIds.length === 0}>Create remediation plans</Button>
                        </div>

                    </Grid>

                    <Grid item sm={12}>
                        <div className="alert-count">
                            <AlertCount key={"CRITICAL"} toggleDrawer={this.toggleDrawer} borderColorClass={"alert-critical"} alertTitle={"CRITICAL"} alertCount={critical_alert_count} />
                            <AlertCount key={"HIGH"} toggleDrawer={this.toggleDrawer} borderColorClass={"alert-high"} alertTitle={"HIGH"} alertCount={high_alert_count} />
                            <AlertCount key={"MEDIUM"} toggleDrawer={this.toggleDrawer} borderColorClass={"alert-mid"} alertTitle={"MEDIUM"} alertCount={medium_alert_count} />
                            <AlertCount key={"LOW"} toggleDrawer={this.toggleDrawer} borderColorClass={"alert-low"} alertTitle={"LOW"} alertCount={low_alert_count} />
                            <AlertCount key={"suppressed"} toggleDrawer={this.toggleDrawer} borderColorClass={"alert-surpress"} alertTitle={"suppressed"} alertCount={suppressed_alert_count} />
                        </div>
                    </Grid>

                    <Grid item sm={12}>
                        <Typography component="p" className="fnt-13">
                            This page displays all open alerts from the selected cloud infrastructure, which are not currently included in a remediation plan. The default sort for alerts is by security priority. Select any alert for further  details.
                    </Typography>
                    </Grid>
                </Grid>
                {loaded &&
                <Fragment>
                    <Grid container spacing={24}>
                        <Grid item sm={12}>
                            <SearchField value={search} handleChange={this.searchHandler} handleClick={this.searchHandlerClick}/>
                        </Grid>

                    </Grid>
                    <Grid container spacing={24} className="grid-container">
                        <Grid item sm={12} className="pdT0">
                            <InvestigateAlertList updateAlertId={this.updateAlertId} alertCount={data.alert_count} priorityTitle={priorityTitle} resetPriority={this.resetPriority} search={search} />
                        </Grid>
                    </Grid>
                    </Fragment>
                  
                }
                <AddToPlan handleSuccess={this.handleSuccess} handelCloseDialog={this.handelCloseDialog} selectedAlerts={selectedAlertIds} handleOpenDialog={this.handleOpenDialog} popperEl={popperEl} openPopOver={openPopOver} placement={placement} />
                <CreateRemediationPlan selectedAlerts={selectedAlertIds} openDialog={openDialog} handleCloseDialog={this.handelCloseDialog} handleSuccess={this.handleSuccess} />
            </CardWithTitle>
        )
    }

}

const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators(Object.assign({}, securityActions, remediationActions), dispatch),
        showMessage: message => {
            dispatch(showMessage(message))
        }, setProgressBar: isProgress => {
            dispatch(setProgressBar(isProgress))
        }, setActiveMenu: activeMenu => {
            dispatch(setActiveMenu(activeMenu))
        }, setActiveParentMenu: activeParentMenu => {
            dispatch(setActiveParentMenu(activeParentMenu))
        }, setAlertsPlan: alerts_plan => {
            dispatch(setAlertsPlan(alerts_plan))
        }
    };
}

const mapStateToProps = (state, ownProps) => ({
    filterData: state.uiReducer.filterData,
    alerts_plan: state.commonReducer.alerts_plan
})


export default withRouter(connect(mapStateToProps, mapDispatchToProps)(InvestigateAlert))