/*
 * @Author: Virendra Patidar 
 * @Date: 2018-11-16 14:55:42 
 * @Last Modified by: Virendra Patidar
 * @Last Modified time: 2019-05-29 12:47:22
 */
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import { setProgressBar, setActiveMenu, setActiveParentMenu, setHeaderFilterData } from 'actions/commonAction';
import * as alertsActions from 'actions/alertsAction';
import { showMessage } from 'actions/messageAction';
import { store } from 'client';
import history from 'customHistory';


import { cloneDeep, find } from "lodash";
import React, { PureComponent, Fragment } from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { connect } from "react-redux";
import { withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import SingleAlertList from '../alertDetail/SingleAlertList'
import AlertDetail from '../alertDetail/AlertDetail'
import AlertComments from '../alertDetail/AlertComments'

class AlertInfo extends PureComponent {
    state = {
        alert: {},
        loading: true,
        defaultCloudList: [
            { name: 'All Clouds', id: 'all', cloudIcon: '/assets/images/cloud_all.png' },
            { name: 'Amazon Web Services', id: 'aws', cloudIcon: '/assets/images/cloud_aws.png' },
            { name: 'Google Cloud Platform', id: 'gcp', cloudIcon: '/assets/images/cloud_gcp.png' },
            { name: 'Azure', id: 'azure', cloudIcon: '/assets/images/cloud_azure.png' },
        ],
        backUrl: undefined,
        backUrlState: undefined
    }

    componentDidMount() {
        this.props.setActiveParentMenu('')
        this.props.setActiveMenu('Alerts')
        this._mounted = true
        const location = window.location.href.split('/')
        const alertId = location[location.length - 1]
        const filterData = this.props.filterData
        if (this.props.location.state !== undefined) {
            this.setState({ backUrl: this.props.location.state.backUrl, backUrlState: this.props.location.state.backUrlState })
        }
        this.fetchAlert(filterData, alertId)
    }

    fetchAlert(filterData, alertId) {
        let accountId = undefined
        if (filterData.selectAccount.id === 'all' || filterData.selectAccount.id === undefined) {
            if (this.props.location.state !== undefined && this.props.location.state.alert !== undefined) {
                accountId = this.props.location.state.alert.cloud_account_id
            } else {
                history.push('/app/multi-tenancy-dashboard/home')
            }
        } else {
            accountId = filterData.selectAccount.id
        }
        let payload = { cloud_account_id: accountId, id: alertId }
        this.props.actions.fetchAlert(payload).
            then(result => {
                if (typeof result !== 'string') {
                    this.setState({ alert: result, loading: false })
                } else {
                    console.log(' Error in fetching alerts :- ', result);
                    //this.setState({ loading: false })
                }
            });
    }

    addComment = (comment) => {
        const profile = JSON.parse(store.getState().userReducer.profile);
        const data = {
            "email": profile.email,
            "timestamp": Date.now(),
            "comment": comment
        }
        this.props.actions.addCommentAlert(this.props.filterData.selectAccount.id, this.state.alert.id, data).
            then(result => {
                if (typeof result !== 'string') {
                    this.setState({ openNoteDialog: false }, () => {
                        let message = { message: 'Saved Note', showSnackbarState: true, variant: 'success' }
                        this.props.showMessage(message)
                        let alternativeAlert = cloneDeep(this.state.alert)
                        alternativeAlert.comments.push(data)
                        this.setState({ alert: alternativeAlert })
                    });
                } else {
                    console.log(' Error in fetching alerts :- ', result);
                    this.setState({ openNoteDialog: false }, () => {
                        let message = { message: result, showSnackbarState: true, variant: 'error' }
                        this.props.showMessage(message)
                    });
                }
            });
    };

    render() {
        const { alert, loading, backUrl, backUrlState } = this.state
        return (
            <Fragment>
                {!loading &&
                    <Card className="card-wizard card-panel card-inner card-rule">
                        <div className="card-title">
                            <span>
                                <h3 className="card-heading">Alert : <a className="pdL5 font-normal" >{alert.id}</a> </h3>
                            </span>
                            <Button 
                            onClick={() => history.push({ pathname: backUrl !== undefined ? backUrl : '/app/alerts', state: { backUrlState } })}
                             className="btn btn-primary min-width-80 mrT10"
                             > 
                             <i className="fa fa-arrow-left mrR5"></i> Back
                             </Button>

                        </div>
                        <CardContent className="card-body">
                            <SingleAlertList alert={alert} />
                            <Grid container spacing={16}>
                                <Grid item md={6}>
                                    <AlertDetail rule={alert.rule} />
                                </Grid>
                                <Grid item md={6}>
                                    <AlertComments comments={alert.comments} addComment={this.addComment} />
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                }
            </Fragment>
        )
    }

}

const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators(Object.assign({}, alertsActions), dispatch),
        showMessage: message => {
            dispatch(showMessage(message))
        }, setProgressBar: isProgress => {
            dispatch(setProgressBar(isProgress))
        }, setActiveMenu: activeMenu => {
            dispatch(setActiveMenu(activeMenu))
        }, setActiveParentMenu: activeParentMenu => {
            dispatch(setActiveParentMenu(activeParentMenu))
        }, setHeaderFilterData: filterData => {
            dispatch(setHeaderFilterData(filterData))
        },
    };
}

const mapStateToProps = (state, ownProps) => ({
    filterData: state.uiReducer.filterData,
    awsList: state.commonReducer.awsList,
})


export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AlertInfo))