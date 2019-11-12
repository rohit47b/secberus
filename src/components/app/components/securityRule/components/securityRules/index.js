/*
 * @Author: Virendra Patidar 
 * @Date: 2018-09-13 12:53:57 
 * @Last Modified by: Virendra Patidar
 * @Last Modified time: 2018-11-16 17:46:01
 */
import React, { PureComponent } from 'react'

import Grid from '@material-ui/core/Grid'

import RuleList from './RuleList'
import ErrorBoundary from 'global/ErrorBoundary'
import { CountBox } from 'hoc/Box/CountBox'

import { store } from 'client'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import { cloneDeep } from "lodash"

import * as ruleActions from 'actions/ruleAction'
import { showMessage } from 'actions/messageAction'
import { setProgressBar } from 'actions/commonAction'

class SecurityRule extends PureComponent {

    _mounted = false

    state = {
        assets: '',
        region: '',
        account: '',

        value: 0,
        right: false,
        popoverEl: null,
        cisCount: 0,
        checkedA: false,

        inactive: 0,
        active: 0,
        total: 0,
    };

    componentDidMount() {
        this._mounted = true
        const filterData = this.props.filterData
        if (filterData.selectAccount.id !== 'all' && filterData.selectAccount.id !== undefined) {
            this.fetchRuleCount(filterData)
        }
        this.unsubscribe = store.subscribe(this.receiveFilterData)
    }

    componentWillUnmount() {
        this._mounted = false
    }

    receiveFilterData = data => {
        const currentState = store.getState()
        const previousValue = this.currentValue
        this.currentValue = currentState.uiReducer.filterData

        if (
            this.currentValue &&
            previousValue !== this.currentValue
        ) {
            this.props.setProgressBar(true);
            const filterData = cloneDeep(currentState.uiReducer.filterData)
            if (filterData.selectAccount.id !== 'all' && this._mounted) {
                this.fetchRuleCount(filterData)
                this.props.setProgressBar(false);
            }
            this.props.setProgressBar(false);
        }
    }

    handleChange = name => event => {
        this.setState({ [name]: event.target.value }, () => {
            this.fetchPolicyCount();
        })
    };


    handleTabChange = (event, value) => {
        this.setState({ value });
    };

    updateFetchRuleCount = () => {
        this.fetchRuleCount(this.props.filterData)
    }

    fetchRuleCount = (filterData) => {
        let payload = {
            account_id: filterData.selectAccount.id
        }
        /* this.props.actions.fetchRuleCount(payload).
            then(result => {
                if (this._mounted) {
                    if (result.success) {
                        this.setState({ inactive: result.data.inactive, active: result.data.active, total: result.data.total, })
                    } else {
                        let message = { message: result, showSnackbarState: true, variant: 'error' }
                        this.props.showMessage(message)
                    }
                }
            }); */
            this.setState({ inactive: 0, active: 0, total: 0, })
    }


    render() {
        mixpanel.track("View Page", {
            "Page Name": 'Security Rule',
        });
        const { inactive, active, total } = this.state;
        return (
            <div className="page-wrapper page-content">
                <Grid container spacing={24} className="mrB15">
                    <Grid item sm={12} className="pdB0">
                        <h3 className="mr0 main-heading">Security Rules</h3>
                    </Grid>
                </Grid>

                <Grid container spacing={24} className="mrB15 mtAuto">
                    <ErrorBoundary error="error-boundary">
                        <Grid item sm={4} className="pdT0">
                            <CountBox title={'Total'} nextLineTitle={''} cssClass={''} count={total} />
                        </Grid>
                        <Grid item sm={4} className="pdT0">
                            <CountBox nextLineTitle={''} title={'Active'} cssClass={'text-success'} count={active} />
                        </Grid>
                        <Grid item sm={4} className="pdT0">
                            <CountBox nextLineTitle={''} title={'Inactive'} cssClass={'text-danger'} count={inactive} />
                        </Grid>
                    </ErrorBoundary>
                </Grid>

                <Grid container spacing={24} className="grid-container">
                    <Grid item sm={12}>
                        <RuleList fetchRuleCount={this.updateFetchRuleCount} />
                    </Grid>
                </Grid>
            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => ({
    filterData: state.uiReducer.filterData
})

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(Object.assign({}, ruleActions), dispatch),
        showMessage: message => {
            dispatch(showMessage(message))
        }, setProgressBar: isProgress => {
            dispatch(setProgressBar(isProgress))
        }
    };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SecurityRule));