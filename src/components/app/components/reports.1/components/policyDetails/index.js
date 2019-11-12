/*
 * @Author: Virendra Patidar 
 * @Date: 2018-11-16 17:21:06 
 * @Last Modified by: Virendra Patidar
 * @Last Modified time: 2019-01-09 16:38:11
 */
import React, { PureComponent } from 'react'

import Grid from '@material-ui/core/Grid'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import ListItemText from '@material-ui/core/ListItemText'
import Input from '@material-ui/core/Input'

import Loader from 'global/Loader'
import LastUpdateTime from 'global/LastUpdateTime'
import ErrorBoundary from 'global/ErrorBoundary'
import { StatusFilter } from 'global/StatusFilter'
import  PriorityFilter  from 'global/PriorityFilter'
import ComplianceFilter from 'global/ComplianceFilter'
import SearchField from 'global/SearchField'

import PolicyRuleList from '../PolicyRuleList'
import SecurityIssueBreakdownByAssets from '../SecurityIssueBreakdownByAssets'

import { cloneDeep, pull, debounce, filter, includes } from "lodash"
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { store } from 'client'


import * as ruleActions from 'actions/ruleAction'
import * as securityPolicyActions from 'actions/securityPolicyAction'
import { showMessage } from 'actions/messageAction'
import { setProgressBar } from 'actions/commonAction'

import STATIC_DATA from 'data/StaticData'

const RenderCount = (props) => {
    return (<Grid item sm={2} className="pd0 col-sm-width">
        <Card className={'card-smry-count ' + props.colorClass}>
            <CardContent className="card-body">
                <Typography component="p">
                    {props.label}
                </Typography>
                <Typography variant="headline" component="h2">
                    {props.count ? props.count : 0}
                </Typography>
                {props.iconName && <i className="mt-icon material-icons">
                    {props.iconName}
                </i>
                }
            </CardContent>
        </Card>
    </Grid>)
}

class PolicyDetails extends PureComponent {

    _mounted = false

    fetchPolicyReport = debounce(this.fetchPolicyReport, 1000);

    state = {
        dataList: [],
        loaded: false,

        total_rules: 0,
        total_offenders: 0,
        total_passed: 0,
        total_failed: 0,
        total_error: 0,

        policyId: '',
        policyList: [],
        selectedStatus: ['Select Status'],
        selectedPriority: ['Select Priority'],
        selectedCompliance: ['Select Compliance'],
        selectServices: [],
        search: '',
        pageNo: 0,
        isRequestForData: true,
        isMoreRecords: true
    }

    componentDidMount() {
        this._mounted = true
        const filterData = this.props.filterData
        this.unsubscribe = store.subscribe(this.receiveFilterData)
        this.props.setProgressBar(true);
        if (filterData.selectAccount.id !== 'all' && filterData.selectAccount.id !== undefined) {
            this._mounted = false
            this.fetchReportPolicyList(filterData)
        } else {
            this.props.setProgressBar(false);
            this.setState({ loaded: true })
        }
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
                this.setState({dataList: []}, () => {
                    this.fetchReportPolicyList(filterData)
                })
            } else {
                this.props.setProgressBar(false);
                this.setState({ loaded: true })
            }
        }
    }


    // ----------------------- API method's START-------------------------

    fetchPolicyReport() {

        const { policyId, pageNo, search, selectedPriority, selectServices, selectedStatus, selectedCompliance } = this.state

        let payload = {
            policy_id: policyId,
            page: pageNo
        }

        if (selectServices[0] !== '') {
            payload.service = selectServices
        }

        if (search !== '') {
            payload.search = search
        }

        // if (selectedPriority[0] !== 'Select Priority') {
            
        //     /**
        //       * Need to get value for send in request for selected priority
        //     */
        //     const filter_priority = filter(STATIC_DATA.PRIORITY_LIST, function (status) {
        //         return includes(selectedPriority, status.display_name);
        //     });
        //     const filtered_priority_values = filter_priority.map(status => status.value);
        //     payload.priority = filtered_priority_values

        // }

         if (selectedPriority[0] !== 'Select Priority') {
            payload.priority = selectedPriority
        }


        if (selectedStatus[0] !== 'Select Status') {
            /**
             * Need to get value for send in request for selected status
             */
            const filter_status = filter(STATIC_DATA.STATUS_LIST, function (status) {
                return includes(selectedStatus, status.display_name);
            });
            const filtered_status_values = filter_status.map(status => status.value);
            payload.status = filtered_status_values
        }

        if (selectedCompliance[0] !== 'Select Compliance') {
            payload.compliance = selectedCompliance
        }


        this.props.actions.fetchPolicyReport(payload).
            then(result => {
                if (this._mounted) {
                    if (result.success) {
                        this.setState({ isMoreRecords: result.data.length > 0, dataList: this.state.dataList.concat(result.data), loaded: true, filterProgress: false, isRequestForData: false }, () => {
                        })
                    } else {
                        this.setState({ allList: [], loaded: true, filterProgress: false, isRequestForData: false })
                        let message = { message: result, showSnackbarState: true, variant: 'error' }
                        this.props.showMessage(message)
                    }
                }
            });
    }

    fetchPolicyReportCount() {
        let payload = {
            policy_id: this.state.policyId
        }
        this.props.actions.fetchPolicyReportCount(payload).
            then(result => {
                if (this._mounted) {
                    if (result.success) {
                        this.setState({ total_failed: result.data[0].total_failed, total_passed: result.data[0].total_passed, total_error: result.data[0].total_error, total_rules: result.data[0].total_rules, total_offenders: result.data[0].total_offenders }, () => {
                        })
                    } else {
                        let message = { message: result, showSnackbarState: true, variant: 'error' }
                        this.props.showMessage(message)
                    }
                }
            });
    }

    fetchReportPolicyList(filterData) {
        let payload = {
            account_id: filterData.selectAccount.id
        }
        this.props.actions.fetchReportPolicyList(payload).
            then(result => {
                this._mounted = true
                if (result.success) {
                    this.props.setProgressBar(false);
                    this.setState({ policyList: result.data, policyId: result.data.length > 0 ? result.data[0].policy_id : '' }, () => {
                        if (result.data.length > 0) {
                            this.fetchPolicyReport()
                            this.fetchPolicyReportCount()
                        }
                    })
                } else {
                    this.props.setProgressBar(false);
                    let message = { message: result, showSnackbarState: true, variant: 'error' }
                    this.props.showMessage(message)
                }
            });
    }


    // ----------------------- API method's END-------------------------

    // ----------------------- Custom method's START-------------------------

    handleSelect = name => event => {
        this.setState({ [name]: event.target.value });
    };


    handleChange = name => event => {
        let oldServiceList = cloneDeep(this.state.selectServices)

        if (event.target.checked) {
            if (event.target.value.length === 0) {
                oldServiceList = ['']
            } else {
                oldServiceList = pull(oldServiceList, '')
                oldServiceList.push(event.target.value)
            }
        } else {
            oldServiceList.splice(oldServiceList.indexOf(event.target.value), 1);
        }
        this.setState({ selectServices: oldServiceList, filterProgress: true, dataList: [], allList: [], pageNo: 1 }, () => {
            this.fetchPolicyReport()
        });
    };



    fetchNextPageData = () => {
        if (!this.state.isRequestForData && this.state.isMoreRecords) {
            this.setState({ pageNo: this.state.pageNo + 1, isRequestForData: true, }, () => {
                this.fetchPolicyReport()
            })
        }

    }

    policyChangeHandler = name => event => {
        this.setState({ policyId: event.target.value }, () => {
            this.fetchPolicyReport()
            this.fetchPolicyReportCount()
        })
    }

    searchHandler = name => event => {
        this.setState({ filterProgress: true, search: event.target.value, pageNo: 0, dataList: [] }, () => {
            this.fetchPolicyReport()
        })
    }


    selectComplianceHandler = name => event => {
        let value = event.target.value;
        if (value.length === 0) {
            value[0] = 'Select Compliance'
        }
        else if (value[0] === 'Select Compliance') {
            value.splice(0, 1)
        }
        this.setState({ filterProgress: true, pageNo: 0, selectedCompliance: value, dataList: [] }, () => {
            this.fetchPolicyReport()
        });
    };


    selectStatusHandler = name => event => {
        let value = event.target.value;
        if (value.length === 0) {
            value[0] = 'Select Status'
        }
        else if (value[0] === 'Select Status') {
            value.splice(0, 1)
        }
        this.setState({ filterProgress: true, pageNo: 0, selectedStatus: value, dataList: [] }, () => {
            this.fetchPolicyReport()
        });
    };



    selectPriorityHandler = name => event => {
        let value = event.target.value;
        if (value.length === 0) {
            value[0] = 'Select Priority'
        }
        else if (value[0] === 'Select Priority') {
            value.splice(0, 1)
        }
        this.setState({ filterProgress: true, pageNo: 0, selectedPriority: value, dataList: [] }, () => {
            this.fetchPolicyReport(this.props.filterData)
        });
    };
    // ----------------------- Custom method's END-------------------------


    render() {
        const { filterProgress, policyList, total_error, selectServices, dataList, loaded, total_rules, total_offenders, total_passed, total_failed, policyId, selectedStatus, selectedPriority, selectedCompliance } = this.state;
        return (
            <div className="page-content"> 
            <Grid container spacing={24} className="container">
                <Grid item sm={12} className="pdB0">
                    <div className="mrB15">
                        <Grid container spacing={24}>
                            <Grid item sm={6} className="left-side text-left">
                                <h3 className="mr0 main-heading text-black fnt-15">Reports</h3>
                            </Grid>
                            <Grid item sm={6} className="right-update">

                                <FormControl className="multi-select">
                                    <Select
                                        value={policyId}
                                        onChange={this.policyChangeHandler('policy')}
                                        input={<Input id="select-multiple-checkbox" />}
                                        className="select-feild"
                                        MenuProps={{
                                            style: {
                                                top: '40px'
                                            }
                                        }}
                                    >
                                        {
                                            policyList.map(function (policy, index) {
                                                return <MenuItem className="select-item" key={policy.name} value={policy.policy_id} >
                                                    <ListItemText primary={policy.name} />
                                                </MenuItem>
                                            })
                                        }
                                    </Select>
                                </FormControl>
                                <LastUpdateTime />

                            </Grid>

                            <Grid container spacing={24} className="grid-count mr0">
                                <ErrorBoundary error="error-boundary">
                                    <RenderCount label={'Total Offenders'} count={total_offenders} colorClass={'card-black-border'} />

                                    <RenderCount label={'Total Rules'} count={total_rules} colorClass={'card-blue-border'} />

                                    <RenderCount label={'Rules Passed'} count={total_passed} colorClass={'card-green-border'} iconName={'done_all'} />

                                    <RenderCount label={'Rules Failed'} count={total_failed} colorClass={'card-red-border'} iconName={'warning'} />

                                    <RenderCount label={'Rules Error'} count={total_error} colorClass={'card-gray-border'} iconName={'error'} />

                                </ErrorBoundary>
                            </Grid>
                            <SecurityIssueBreakdownByAssets serviceChange={this.handleChange} selectServices={selectServices} />
                        </Grid>
                    </div>
                    <Grid container spacing={24} className="d-flex-col">
                        <Grid item sm={8} className="d-flex">
                            <StatusFilter selectHandler={this.selectStatusHandler} selectedStatus={selectedStatus} />
                            <PriorityFilter selectHandler={this.selectPriorityHandler} selectedPriority={selectedPriority} />
                            <ComplianceFilter selectHandler={this.selectComplianceHandler} selectedCompliance={selectedCompliance} />
                            <SearchField handleChange={this.searchHandler} />
                        </Grid>
                    </Grid>
                    <Grid container spacing={24}>
                        <Grid item sm={12}>
                            <ErrorBoundary error="error-boundary">
                                {loaded ?
                                    <PolicyRuleList fetchNextPageData={this.fetchNextPageData} dataList={dataList} filterProgress={filterProgress} /> : <Loader />}

                            </ErrorBoundary>
                        </Grid>
                    </Grid>

                </Grid>
            </Grid>
            </div>

        );
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(Object.assign({}, ruleActions, securityPolicyActions), dispatch),
        showMessage: message => {
            dispatch(showMessage(message))
        }, setProgressBar: isProgress => {
            dispatch(setProgressBar(isProgress))
        }
    };
}

const mapStateToProps = (state, ownProps) => ({
    filterData: state.uiReducer.filterData,
})

export default withRouter((connect(mapStateToProps, mapDispatchToProps)(PolicyDetails)));
