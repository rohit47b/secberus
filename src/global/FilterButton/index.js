/*
 * @Author: Virendra Patidar 
 * @Date: 2018-09-19 13:35:31 
 * @Last Modified by: Virendra Patidar
 * @Last Modified time: 2018-12-06 18:06:57
 */
import React, { PureComponent } from 'react'

import { Radio } from '@material-ui/core'

import { withRouter } from 'react-router-dom'

import { connect } from "react-redux"
import { store } from 'client'
import { bindActionCreators } from 'redux'
import { cloneDeep } from "lodash"

import * as dashboardActions from 'actions/dashboardAction'

class FilterButton extends PureComponent {

    _mounted = false
    currentValue = this.props.securityIssueFilter

    state = {
        addClass: false,
        securityIssue: {
            count: 0, data: [
                {
                    FAIL: 0,
                    ERROR: 0,
                    PASS: 0
                }
            ]
        },
        issueType: ''
    }

    componentDidMount() {
        this._mounted = true
        if (this.props.securityIssue) {
            this.setState({ securityIssue: this.props.securityIssue, issueType: this.props.issueType })
            let count = 0;
            if (this.props.issueType === '') {
                count = this.props.securityIssue.count;
            } else if (this.props.issueType === 'pass') {
                count = this.props.securityIssue.data[0].PASS;
            } else if (this.props.issueType === 'fail') {
                count = this.props.securityIssue.data[0].FAIL;
            } else {
                count = this.props.securityIssue.data[0].ERROR;
            }
            this.props.updateIssueType(this.props.issueType, count)
        }

        this.unsubscribe = store.subscribe(this.receiveFilterData)
    }

    componentWillUnmount() {
        this._mounted = false
    }


    componentDidUpdate = (prevProps, prevState) => {
        if (this.props.securityIssue !== prevProps.securityIssue) {
            this.setState({ securityIssue: this.props.securityIssue })
        }
        if (this.props.issueType !== prevProps.issueType) {
            this.setState({ issueType: this.props.issueType })
        }
    }


    receiveFilterData = data => {

        const currentState = store.getState()
        const previousValue = this.currentValue
        this.currentValue = currentState.uiReducer.securityIssueFilter

        if (
            this.currentValue &&
            (previousValue !== this.currentValue)
        ) {
            const securityIssueFilter = cloneDeep(currentState.uiReducer.securityIssueFilter)
            if (this._mounted) {
                this.fetchIssues(this.props.filterData, securityIssueFilter)
            }
        }
    }


    fetchIssues(filterData,securityIssueFilter) {
        let payload = {}
        if (filterData.selectAccount.id !== 'all' && filterData.selectAccount.id !== undefined) {
            payload['account'] = filterData.selectAccount.id
        }

        if (filterData.selectCloud.id !== 'all') {
            payload['cloud'] = filterData.selectCloud.id
        }

        if(securityIssueFilter.search){
            payload['search'] = securityIssueFilter.search
        }

        if(securityIssueFilter.service){
            payload['service'] = securityIssueFilter.service
        }

        if(securityIssueFilter.category){
            payload['category'] = securityIssueFilter.category
        }


        this.props.actions.fetchIssues(payload).
            then(result => {
                if (this._mounted) {
                    if (result.success) {
                        this.setState({ IssuesData: result.data }, () => {
                            this.setDataIssue();
                        })
                    } else {
                        let message = { message: result, showSnackbarState: true, variant: 'error' }
                        this.props.showMessage(message)
                    }
                }
            });
    }


    setDataIssue = () => {
        const data = this.state.IssuesData;
        let securityIssue;
        securityIssue = { count: data.count, data: data.data }
        this.setState({ securityIssue })
    }

    handleChange = (event, count) => {
        this.props.updateIssueType(event.target.value, count)
    };


    renderFilterButton = (label, count, value) => {
        const { issueType } = this.props
        return (
            <span className="filter-btn">
                {label}-{count}
                <Radio
                    checked={issueType === value}
                    onChange={(e) => this.handleChange(e, count)}
                    value={value}
                    className="radio-hide"
                />
                <span className={issueType === value ? 'active' : ''}></span>
            </span>)
    }

    render() {
        const { securityIssue } = this.state
        return (
            <div className="filter">
                {this.renderFilterButton('All', securityIssue.count, '')}
                {this.renderFilterButton('Pass', securityIssue.data[0].PASS, 'pass')}
                {this.renderFilterButton('Fail', securityIssue.data[0].FAIL, 'fail')}
                {this.renderFilterButton('Error', securityIssue.data[0].ERROR, 'error')}
            </div>
        );
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators(Object.assign({}, dashboardActions), dispatch),
    };
}

const mapStateToProps = (state, ownProps) => ({
    filterData: state.uiReducer.filterData,
    securityIssueFilter: state.uiReducer.securityIssueFilter
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(FilterButton))