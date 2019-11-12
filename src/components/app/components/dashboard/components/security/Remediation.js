/*
 * @Author: Virendra Patidar 
 * @Date: 2018-09-27 09:03:40 
 * @Last Modified by: Virendra Patidar
 * @Last Modified time: 2019-05-21 12:48:04
 */
import React, { PureComponent, Fragment } from 'react';

import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Fade from '@material-ui/core/Fade';
import Popper from '@material-ui/core/Popper';
import { List, ListItem, ListItemText, Checkbox } from '@material-ui/core'
import ClickAwayListener from '@material-ui/core/ClickAwayListener';

import { RoundButton } from 'hoc/Button/RoundButton';
import LabelWithHelper from 'hoc/Label/LabelWithHelper';

import { withRouter } from 'react-router-dom'

import { connect } from "react-redux"
import { bindActionCreators } from 'redux'
import { store } from 'client'
import { cloneDeep } from "lodash"

import * as securityActions from 'actions/securityAction'
import { showMessage } from 'actions/messageAction'
import { setProgressBar, setActiveMenu, setActiveParentMenu } from 'actions/commonAction'

import history from 'customHistory'
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import RemediationPlanList from "./RemediationPlanList"
import SuccessMessageDialogHoc from 'hoc/SuccessMessageDialog';

class Remediation extends PureComponent {

    state = {
        placement: null,
        popperEl: null,
        openPopOver: false,

        mean_time_to_detect: '1 minute',
        mean_time_to_resolve: '24 hours',

        data: {},
        openDrawer: false,
        openDialog: false,
    }

    componentDidMount() {
        this._mounted = true
        const filterData = this.props.filterData
        if (filterData.selectAccount.id !== 'all' && filterData.selectAccount.id !== undefined) {
            this._mounted = false
            this.fetchRemediation(filterData)
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
                this.fetchRemediation(filterData)
            }
        }
    }


    fetchRemediation(filterData) {
        let payload = { accountId: filterData.selectAccount.id }

        this.props.actions.fetchRemediation(payload).
            then(result => {
                this._mounted = true
                if (typeof result !== 'string') {
                    this.setState({ data: result })
                } else {
                    console.log(' Error in fetching remediation :- ', result);
                }
            });
    }


    handleClick = (placement) => (event) => {
        const { currentTarget } = event;
        this.setState(state => ({
            popperEl: currentTarget,
            openPopOver: state.placement !== placement || !state.openPopOver,
            placement,
        }));
    };

    handleClickAway = () => {
        this.setState({
            openPopOver: false,
        });
    };

    toggleDrawer = () => {
        this.setState(prevState => ({
            openDrawer: !prevState.openDrawer,
        }));
    };


    showDialog = () => {
        this.setState({ openDialog: true })
    }

    getMttd = (mttd) => {
        switch (mttd.toString()) {
            case '900':
              return '7.5 Minutes'
              break;
            case '3600':
              return '30 Minutes';
              break;
            case '86400':
              return '12 Hours';
              break;
            case '60200':
              return '3.5 Days';
              break;
            default:
                return '7.5 Minutes'
          }
    }

    handelCloseDialog = () => {
        this.setState({ openDialog: false })
    }

    redirectToAlertPage = () => {
        this.props.setActiveMenu('Alerts')
        history.push('/app/alerts')
    }

    redirectToCloudScannerPage = () => {
        this.props.setActiveParentMenu('Settings')
        this.props.setActiveMenu('Detection')
        history.push('/app/setting/cloud-scanner')

    }

    render() {
        const { popperEl, openPopOver, placement, data, openDrawer, openDialog,mean_time_to_detect,mean_time_to_resolve } = this.state;
        const { mttd } = this.props
        return (
            <div>
                <Fragment>
                    <ClickAwayListener onClickAway={this.handleClickAway}>
                        <Paper className="white-paper" elevation={1}>
                            <div className="white-paper-head">
                                <LabelWithHelper message={"Remediation"}
                                    content={"<div><p>Displayed below are your security aptitude statistics over the previous 30 days.</p> <p>Your team's security aptitude illustrates its ability to remediate cloud security alerts. An organizations security aptitude is one of the many inputs used within the Cumulus Risk Engine to calculate your Security Infrastructure Risk Score. </p> <p>You can improve your organizations security aptitude by increasing your team's security efficiency, thus decreasing your MTTR.</p> </div>"}
                                    title={"Remediation"} />
                            </div>
                            <div className="mrB20 paper-content">
                                <Typography component="p">
                                    <span className="link-hrf" onClick={() => this.redirectToCloudScannerPage('Detection', )}>MTTD: {this.getMttd(mttd)}</span>
                                </Typography>
                                {/* <Typography component="p">
                                    <span>MTTR: {mean_time_to_resolve} </span>
                                </Typography> */}
                                <Typography component="p">
                                    <span className="link-hrf" onClick={() => this.toggleDrawer()}>Active Remediation Plans: {data.active_plan_count ? data.active_plan_count:0}</span>
                                </Typography>
                            </div>
                            <RoundButton handlePopper={this.handleClick('bottom')} buttonName={"Create Remediation Plan"} />
                        </Paper>
                    </ClickAwayListener>
                    <Popper className={'remediation-plan-popper'} style={{ zIndex: '10' }} open={openPopOver} anchorEl={popperEl} placement={placement} transition>
                        {({ TransitionProps }) => (
                            <Fade {...TransitionProps} timeout={350}>
                                <div>
                                    <List className="list-filter width-auto list-plan">
                                        <ListItem className="list-filter-item" >
                                            {/* <ListItemText className="list-filter-text" onClick={this.showDialog} primary={"Auto generated"} /> */}
                                            <ListItemText className="list-filter-text" onClick={() => history.push('/app/remediation/auto-generated')} primary={"Auto generated"} />
                                        </ListItem>
                                        <ListItem className="list-filter-item" onClick={this.redirectToAlertPage}>
                                            <ListItemText className="list-filter-text" primary={"Manual"} />
                                        </ListItem>
                                    </List>
                                </div>
                            </Fade>
                        )}
                    </Popper>
                </Fragment>

                <SuccessMessageDialogHoc isOpen={openDialog} handelCloseDialog={this.handelCloseDialog} content={'Unfortunately our Auto-generated plans are not available yet. They are built by our system selecting the most mission critical alerts using a multi-criteria decision approach. This will be available in our next software release.'} />
                <SwipeableDrawer onOpen={this.toggleDrawer} onClose={this.toggleDrawer} className="right-sidebar" anchor="bottom" open={openDrawer}>
                    <RemediationPlanList toggleDrawer={this.toggleDrawer} />
                </SwipeableDrawer>
            </div>
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
        }, setActiveMenu: activeMenu => {
            dispatch(setActiveMenu(activeMenu))
        }, setActiveMenu: activeMenu => {
            dispatch(setActiveMenu(activeMenu))
        }, setActiveParentMenu: activeParentMenu => {
            dispatch(setActiveParentMenu(activeParentMenu))
        },
    };
}

const mapStateToProps = (state, ownProps) => ({
    filterData: state.uiReducer.filterData,
    mttd: state.commonReducer.mttd
})


export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Remediation))