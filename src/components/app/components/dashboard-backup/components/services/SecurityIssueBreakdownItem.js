/*
 * @Author: Virendra Patidar 
 * @Date: 2018-09-19 17:26:44 
 * @Last Modified by: Virendra Patidar
 * @Last Modified time: 2019-04-23 14:31:45
 */
import React, { PureComponent } from 'react'

import Button from '@material-ui/core/Button'
import ClickAwayListener from '@material-ui/core/ClickAwayListener'
import Grow from '@material-ui/core/Grow'
import Paper from '@material-ui/core/Paper'
import Popper from '@material-ui/core/Popper'
import MenuList from '@material-ui/core/MenuList'

import { BarChart } from 'react-d3-components'
import { IssueTypeMenuItem } from 'hoc/MenuItem/IssueTypeMenuItem'

import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'


import { fetchServiceIconPath } from 'utils/serviceIcon'

class SecurityIssueBreakdownItem extends PureComponent {
    state = {
        open: false,
        loaded: false
    };

    handleToggle = () => {
        this.setState(prevState => ({
            open: !prevState.open
        }));
    };


    toggleDrawer = (position, openDrawer, issueType, service) => {
        // this.handleToggle()

        this.props.toggleDrawer(position, openDrawer, issueType, service)
    }
    handleClose = event => {
        if (this.anchorEl.contains(event.target)) {
            return;
        }
        this.setState({ open: false });
    };

    render() {
        const { open } = this.state;
        const { service, state, service_name } = this.props.issueBreakdown;
        let data = [{
            label: service,
            values: [{ x: 'ERROR - ' + state.ERROR, y: state.ERROR }, { x: 'FAIL - ' + state.FAIL, y: state.FAIL }, { x: 'PASS - ' + state.PASS, y: state.PASS }]
        }];
        const scale = d3.scale.ordinal().range(['#6E6E6E', '#ec4e4e', '#19c681']);

        const securityIssue = {
            count: state.ERROR + state.FAIL + state.PASS,
            data: [{ ERROR: state.ERROR, FAIL: state.FAIL, PASS: state.PASS }]
        }

        return (
            <span className="asset-item" key={service}>
                {
                    (localStorage.getItem('isRunDefaultPolicy') === 'false' && localStorage.getItem('temp_account_name') === this.props.filterData.selectAccount.account_name) ?
                        '' : <Button
                            buttonRef={node => {
                                this.anchorEl = node;
                            }}
                            aria-owns={open ? 'menu-list-grow' : null}
                            aria-haspopup="true"
                            className="btn-icon mrB10"
                        >
                            <span className="icon-text"> <img src={fetchServiceIconPath(service)} alt={service_name}/>{service_name ? service_name : service}</span>
                            <div className="issue-count">
                                <span className="text-danger">{state.ERROR}</span>
                                <span className="text-warning">{state.FAIL}</span>
                                <span className="text-success">{state.PASS}</span>
                            </div>
                        </Button>
                }
            </span>
        );
    }
}

const mapStateToProps = (state, ownProps) => ({
    filterData: state.uiReducer.filterData,
})

export default withRouter((connect(mapStateToProps, null)(SecurityIssueBreakdownItem)));