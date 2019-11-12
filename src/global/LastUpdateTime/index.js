/*
 * @Author: Virendra Patidar 
 * @Date: 2018-09-06 14:39:09 
 * @Last Modified by: Virendra Patidar
 * @Last Modified time: 2018-11-26 13:09:53
 */
import React, { PureComponent } from 'react'

import { connect } from "react-redux"
import { store } from 'client'
import { bindActionCreators } from 'redux'
import { cloneDeep } from "lodash"

import { convertDateFormatWithTime } from 'utils/dateFormat'

import { showMessage } from 'actions/messageAction'
import * as userActions from 'actions/userAction'

class LastUpdateTime extends PureComponent {
    _mounted = false
    state = {
        lastUpdateTime: '',
        loader: false
    }

    componentDidMount() {
        this._mounted = true
        const filterData = this.props.filterData
        if (filterData.selectAccount.id !== 'all' && filterData.selectAccount.id !== undefined) {
            this._mounted = false
            //this.fetchLastUpdateTime(filterData);
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
            const filterData = cloneDeep(currentState.uiReducer.filterData)
            if (filterData.selectAccount.id !== 'all' && this._mounted) {
                this.fetchLastUpdateTime(filterData);
            }
        }
    }


    fetchLastUpdateTime(filterData) {
        let payload = {
        }

        if (filterData.selectAccount.id !== 'all' && filterData.selectAccount.id !== undefined) {
            payload['account_id'] = filterData.selectAccount.id
        }

        if (payload.account_id) {
            this.props.actions.fetchLastUpdateTime(payload).
                then(result => {
                    this._mounted = true
                    if (result.success) {
                        this.setState({ lastUpdateTime: result.data, loader: false }, () => {
                            localStorage.setItem('lastUpdateTime', result.data)
                        })
                    } else {
                        let message = { message: result, showSnackbarState: true, loader: true, variant: 'error' }
                        this.props.showMessage(message)
                    }
                });
        }
    }

    fetchUpdateTime = () => {
        const filterData = this.props.filterData
        if (filterData.selectAccount) {
            this.fetchLastUpdateTime(filterData);
            this.setState({ loader: true })
        }
    }


    render() {
        let { lastUpdateTime, loader } = this.state
        lastUpdateTime = lastUpdateTime ? lastUpdateTime : localStorage.getItem('lastUpdateTime')
        return (
            <div className="pdB0 update-time">
                <p className="mr0 text-right fnt-13"> {loader && <span className="text-primary"><i className="fa fa-spin fa-fw fa-spinner"></i></span>}  <a href="javascript:void(0)" className="mrR5" onClick={this.fetchUpdateTime}><i className="fa fa-repeat" aria-hidden="true"></i></a> Last Updated : {convertDateFormatWithTime(lastUpdateTime)}</p>
            </div>
        )
    }
}


const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators(Object.assign({}, userActions), dispatch),
        showMessage: message => {
            dispatch(showMessage(message))
        }
    };
}

const mapStateToProps = (state, ownProps) => ({
    filterData: state.uiReducer.filterData,
})

export default connect(mapStateToProps, mapDispatchToProps)(LastUpdateTime)