/*
 * @Author: Virendra Patidar 
 * @Date: 2018-09-19 17:26:44 
 * @Last Modified by: Virendra Patidar
 * @Last Modified time: 2019-04-23 14:31:02
 */
import React, { PureComponent } from 'react'

import Button from '@material-ui/core/Button'
import ClickAwayListener from '@material-ui/core/ClickAwayListener'
import Grow from '@material-ui/core/Grow'
import Paper from '@material-ui/core/Paper'
import Popper from '@material-ui/core/Popper'
import MenuList from '@material-ui/core/MenuList'
import Avatar from '@material-ui/core/Avatar'

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
        const total = state.ERROR + state.FAIL + state.PASS
        let data = [{
            label: service,
            values: [{ x: 'ERROR - ' + state.ERROR, y: state.ERROR }, { x: 'FAIL - ' + state.FAIL, y: state.FAIL }, { x: 'PASS - ' + state.PASS, y: state.PASS }]
        }];
        const scale = d3.scale.ordinal().range(['#6E6E6E', '#ec4e4e', '#19c681']);

        const securityIssue = {
            count: total,
            data: [{ ERROR: state.ERROR, FAIL: state.FAIL, PASS: state.PASS }]
        }
        const { offenders } = this.props
        const securityIssueFilterData = { count: total, data: [state] }

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
                            onClick={() => this.handleToggle(data)}
                            className="btn-icon mrB10"
                        >
                            <span className="icon-text"> <img src={fetchServiceIconPath(service)} alt={service_name}/>{service_name ? service_name : service}
                                <Avatar className='issue-circle circle-warning' title="Offenders">{offenders ? offenders : '0'}</Avatar>
                            </span>


                            <BarChart
                                data={data}
                                width={30}
                                height={20}
                                margin={{ top: 0, bottom: 0, left: 0, right: 0 }}
                                colorByLabel={false}
                                colorScale={scale}
                            // onClick={() => this.props.toggleDrawer('right', true, data)}
                            />
                        </Button>
                }
                <Popper open={open} anchorEl={this.anchorEl} transition disablePortal className="dropdown-menu">
                    {({ TransitionProps, placement }) => (
                        <Grow
                            {...TransitionProps}
                            id="menu-list-grow"
                            style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
                        >
                            <Paper>
                                <ClickAwayListener onClickAway={this.handleClose}>
                                    <MenuList>
                                        <IssueTypeMenuItem toggleDrawer={this.props.toggleDrawer} securityIssue={securityIssue} handleClose={this.handleClose} issueType={'error'} count={state.ERROR} data={securityIssueFilterData} toggleDrawer={this.props.toggleDrawer} serviceName={service_name} />
                                        <IssueTypeMenuItem securityIssue={securityIssue} handleClose={this.handleClose} issueType={'fail'} count={state.FAIL} data={securityIssueFilterData} toggleDrawer={this.props.toggleDrawer} serviceName={service_name} />
                                        <IssueTypeMenuItem securityIssue={securityIssue} handleClose={this.handleClose} issueType={'pass'} count={state.PASS} data={securityIssueFilterData} toggleDrawer={this.props.toggleDrawer} serviceName={service_name} />
                                    </MenuList>
                                </ClickAwayListener>
                            </Paper>
                        </Grow>
                    )}
                </Popper>
            </span>
        );
    }
}

const mapStateToProps = (state, ownProps) => ({
    filterData: state.uiReducer.filterData,
})

export default withRouter((connect(mapStateToProps, null)(SecurityIssueBreakdownItem)));