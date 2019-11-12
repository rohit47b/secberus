/*
 * @Author: Virendra Patidar 
 * @Date: 2018-09-13 12:53:57 
 * @Last Modified by: Virendra Patidar
 * @Last Modified time: 2018-11-16 17:11:59
 */
import React, { PureComponent } from 'react'

import Grid from '@material-ui/core/Grid'
import FormControl from '@material-ui/core/FormControl'
import NativeSelect from '@material-ui/core/NativeSelect'

import PolicyList from './PolicyList'
import ErrorBoundary from 'global/ErrorBoundary'
import { CountBox } from 'hoc/Box/CountBox'

import { cloneDeep } from "lodash"
import { store } from 'client'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import * as integrationActions from 'actions/integrationAction'
import * as securityPolicyActions from 'actions/securityPolicyAction'
import { showMessage } from 'actions/messageAction'

class Policies extends PureComponent {

    _mounted = false

    state = {
        assets: '',
        region: '',
        account: '',
        value: 0,
        right: false,
        popoverEl: null,
        cisCount: 0,

        runningPolicy: 0,
        totalPolicy: 0,
        stoppedPolicy: 0,
        accountDataList: []
    };


    currentValue = this.props.filterData

    componentDidMount() {
        this._mounted = true
        const filterData = this.props.filterData
        if (filterData.selectAccount.id !== 'all' && filterData.selectAccount.id !== undefined) {
            this._mounted = false
            this.fetchAccountData(filterData)
            this.fetchPolicyCount(filterData)
        } else {
            // this.props.setProgressBar(false);
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
            this.currentValue && previousValue !== this.currentValue
        ) {
            const filterData = cloneDeep(currentState.uiReducer.filterData)
            if (filterData.selectAccount.id !== 'all' && this._mounted) {
                this.fetchAccountData(filterData)
                this.fetchPolicyCount(filterData)
            }
        }
    }



    // ------------------------------API method's START------------------------------

    fetchAccountData() {
        if (this.props.awsList.length === 0) {
            this.props.actions.fetchIntegrationList().
                then(result => {
                    this._mounted = true
                    if (result.success) {
                        this.setState({ accountDataList: result.data[0].accounts }, () => {
                        })
                    } else {
                        let message = { message: result, showSnackbarState: true, variant: 'error' }
                        this.props.showMessage(message)
                    }
                });
        } else {
            this.setState({ accountDataList: this.props.awsList.accountList })
        }
    }

    fetchPolicyCount() {
        let payload = {}

        if (this.state.account !== '') {
            payload['account_id'] = this.state.account
        }

        this.props.actions.fetchPolicyCount(payload).
            then(result => {
                this._mounted = true
                if (result.success) {
                    this.setState({ stoppedPolicy: 0, runningPolicy: 0, totalPolicy: 0 })
                    result.data.map((item, index) => {
                        if (item.state === 'stopped') {
                            this.setState({ stoppedPolicy: item.count })
                        } else if (item.state === 'running') {
                            this.setState({ runningPolicy: item.count })
                        } else if (item.state === 'total') {
                            this.setState({ totalPolicy: item.count })
                        }
                    })
                } else {
                    let message = { message: result, showSnackbarState: true, variant: 'error' }
                    this.props.showMessage(message)
                }
            });
    }

    // ------------------------------API method's END------------------------------

    // ------------------------------Custom logic method's START-------------------

    handleChange = name => event => {
        this.setState({ [name]: event.target.value }, () => {
            this.fetchPolicyCount();
        })
    };


    handleTabChange = (event, value) => {
        this.setState({ value });
    };


    updatePolicyCount = () => {
        this.fetchPolicyCount()
    }

    // ------------------------------Custom logic method's START-------------------


    render() {
        const { account, value, accountDataList, totalPolicy, runningPolicy, stoppedPolicy } = this.state;
        return (
            <div className="page-wrapper page-content">
                <Grid container spacing={24} className="mrB15">
                    <Grid item sm={12} className="pdB0">
                        <h3 className="mr0 main-heading">Policies</h3>
                    </Grid>
                </Grid>

                <Grid container spacing={24} className="mrB15 mtAuto">
                    <ErrorBoundary error="error-boundary">
                        <Grid item sm={4} className="pdT0">
                            <CountBox title={'Total'} nextLineTitle={''} cssClass={''} count={totalPolicy} />
                        </Grid>
                        <Grid item sm={4} className="pdT0">
                            <CountBox nextLineTitle={''} title={'Active'} cssClass={'text-success'} count={runningPolicy} />
                        </Grid>
                        <Grid item sm={4} className="pdT0">
                            <CountBox nextLineTitle={''} title={'Inactive'} cssClass={'text-danger'} count={stoppedPolicy} />
                        </Grid>
                    </ErrorBoundary>
                </Grid>
                <Grid container spacing={24} className="mtAuto mrB10">
                    <Grid item sm={10} className="pdT0">
                        <h5 className="mr0">Policies Available</h5>
                    </Grid>
                    <Grid item sm={2} className="pdT0 pdB0">
                        <FormControl className="select-box">
                            <NativeSelect
                                value={account}
                                name="account"
                                onChange={this.handleChange('account')}
                                className="select-feild"
                            >
                                <option value=''>All Account</option>
                                {
                                    accountDataList.map(function (account, index) {
                                        return <option key={account.account_name} value={account.id}>{account.account_name}</option>
                                    })
                                }
                            </NativeSelect>
                        </FormControl>
                    </Grid>
                    {/* <Grid item sm={3} className="pdT0 pdR0">
                                        <SearchField handleChange={this.handleChange}/>
                                    </Grid> */}

                </Grid>
                <Grid container spacing={24} className="grid-container">
                    <Grid item sm={12} className="pdT0">
                        <ErrorBoundary error="error-boundary">
                            <PolicyList account={account} updatePolicyCount={this.updatePolicyCount} />
                        </ErrorBoundary>
                    </Grid>
                </Grid>

            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => ({
    awsList: state.commonReducer.awsList,
    filterData: state.uiReducer.filterData,
})

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(Object.assign({}, integrationActions, securityPolicyActions), dispatch),
        showMessage: message => {
            dispatch(showMessage(message))
        }
    };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Policies));