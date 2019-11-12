/*
 * @Author: Virendra Patidar 
 * @Date: 2018-09-24 12:58:43 
 * @Last Modified by: Virendra Patidar
 * @Last Modified time: 2018-11-26 12:46:43
 */
import React, { PureComponent } from 'react'

import { Radio } from '@material-ui/core'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import * as userActions from 'actions/userAction'
import { showMessage } from 'actions/messageAction'

class UserFilterButton extends PureComponent {
    _mounted = false
    state = {
        addClass: false,
        total: 0,
        active: 0,
        pending: 0,
        invitee: 0
    }

    componentDidMount() {
        this._mounted = true
        this.fetchUserCount()
    }

    componentWillUnmount() {
        this._mounted = false
    }

    static getDerivedStateFromProps(nextProps, state) {
        return { reloadCount: nextProps.reloadCount }
    }


    componentDidUpdate = (prevProps, prevState) => {
        if (this.props.reloadCount !== prevProps.reloadCount) {
            this.fetchUserCount()
        }
    }


    fetchUserCount() {
        let payload = { company: this.props.companyId }
        this.props.actions.fetchUserCount(payload).
            then(result => {
                if (this._mounted) {
                    if (result.success) {
                        this.setState({ total: result.total, invitee: result.invitee ? result.invitee : 0 });
                        result.data.map((item, index) => {
                            if (item.is_active) {
                                this.setState({ active: item.count });
                            } else {
                                this.setState({ pending: item.count });
                            }
                        })

                    } else {
                        // let message = { message: result, showSnackbarState: true, variant: 'error' }
                        // this.props.showMessage(message)
                    }
                }
            });
    }


    handleChange = (event, count) => {
        this.props.updateUserType(event.target.value, count)
    };

    renderFilterButton = (label, count, value) => {
        const { selectedUserType } = this.props
        return (
            <span className="filter-btn">
                {label}-{count}
                <Radio
                    checked={selectedUserType === value}
                    onChange={(e) => this.handleChange(e, count)}
                    value={value}
                    className="radio-hide"
                />
                <span className={selectedUserType === value ? 'active' : ''}></span>
            </span>)
    }

    render() {
        const { total, active, pending, invitee } = this.state
        const { companyId } = this.props

        return (
            <div className="filter">
                {this.renderFilterButton('All', total, '')}
                {this.renderFilterButton('Active', active, 'active')}
                {this.renderFilterButton('Pending', pending, 'pending')}
                {companyId === null && this.renderFilterButton('Invited', invitee, 'invited')}
            </div>
        );
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
export default withRouter((connect(null, mapDispatchToProps)(UserFilterButton)));
