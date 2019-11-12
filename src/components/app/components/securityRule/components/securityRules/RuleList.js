/*
 * @Author: Virendra Patidar 
 * @Date: 2018-09-13 13:00:18 
 * @Last Modified by: Virendra Patidar
 * @Last Modified time: 2019-04-23 16:25:57
 */
import React, { PureComponent } from 'react'

import Grid from '@material-ui/core/Grid'
import Checkbox from '@material-ui/core/Checkbox'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import ListItemText from '@material-ui/core/ListItemText'
import Switch from '@material-ui/core/Switch'

import {
    Table,
    Column
} from "react-virtualized"
import AutoSizer from "react-virtualized/dist/commonjs/AutoSizer"

import WithDrawer from 'TableHelper/with-drawer'

import Loader from 'global/Loader'
import SearchField from 'global/SearchField'
import ErrorBoundary from 'global/ErrorBoundary'
import ConfirmDialogBoxHOC from 'hoc/DialogBox'

import { cloneDeep, filter, pull } from "lodash"
import { store } from 'client'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import { showMessage } from 'actions/messageAction'
import * as ruleActions from 'actions/ruleAction'
import * as securityPolicyActions from 'actions/securityPolicyAction'
import { setProgressBar } from 'actions/commonAction'

import { serviceCellRenderer, headerRenderer, wrapTextCellRenderer } from 'TableHelper/cellRenderer'
import { fetchServiceIconPath } from 'utils/serviceIcon'

class RuleList extends PureComponent {

    _mounted = false
    
    state = {
        //Table helper attribute
        rowHeight: 80,
        height: 400,

        //Filter attribute
        ruleServiceList: [],
        filterRuleServiceList: [],
        selectServices: [],

        //Dialog box attribute
        policyId: 0,
        openPolicyDialog: false,
        ruleId: 0,
        toggleRowIndex: -1,
        currentStatus: true,
        openPolicyDialog: false,
        inactive: 0,
        active: 0,
        openRuleDialog: false,

        //Table pagination attribute
        total: 0,
        dataList: [],
        isMoreRecords: true,
        totalCount: 117,
        perPage: 50,
        pageNo: 0,
        filterProgress: false
    }


    // ------------------- React standard method start----------------------

    componentDidMount() {
        this._mounted = true
        const filterData = this.props.filterData
        this.props.setProgressBar(true);
        this.unsubscribe = store.subscribe(this.receiveFilterData)
        if (filterData.selectAccount.id !== 'all' && filterData.selectAccount.id !== undefined) {
            this._mounted = false
            this.fetchRuleList(filterData)
            this.fetchRuleServiceList()
        } else {
            this.props.setProgressBar(false);
        }
    }

    componentWillUnmount() {
        this._mounted = false
    }


    componentDidUpdate = (prevProps, prevState) => {
        if (this.props.account !== prevProps.account) {
            this.setState({ dataList: [], filterProgress: false })
        }
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
                this.setState({dataList:[],pageNo:1},()=>{
                    this.fetchRuleList(filterData)
                    this.fetchRuleServiceList()
                })
            } else {
                this.props.setProgressBar(false);
            }
        }
    }

    // ------------------- React standard method End----------------------


    // ------------------- API call method Start-------------------------

    fetchRuleList(filterData) {
        let payload = {
            "account_id": filterData.selectAccount.id,
            "page": this.state.pageNo
        }

        if (this.state.selectServices.length > 0) {
            payload['services'] = this.state.selectServices
        }

        this.props.actions.fetchRuleList(payload).
            then(result => {
                this._mounted = true
                if (result.success) {
                    const dataList = cloneDeep(this.state.dataList)
                    this.props.setProgressBar(false);
                    this.setState({ dataList: dataList.concat(result.data), isMoreRecords: result.data.length > 0, filterProgress: false })
                } else {
                    this.props.setProgressBar(false);
                    this.setState({ filterProgress: false })
                    let message = { message: result, showSnackbarState: true, variant: 'error' }
                    this.props.showMessage(message)
                }
            });
    }

    fetchRuleServiceList() {
        this.props.actions.fetchRuleServiceList().
            then(result => {
                this._mounted = true
                if (result.success) {
                    this.setState({ filterRuleServiceList: result.data, ruleServiceList: result.data })
                } else {
                    let message = { message: result, showSnackbarState: true, variant: 'error' }
                    this.props.showMessage(message)
                }
            });
    }


    policyEnableDisable = () => {
        let payload = {
            policy_id: this.state.policyId,
            state: this.state.currentStatus === true ? 'deactivate' : 'activate'
        }

        this.props.setProgressBar(true);
        this.setState({ openPolicyDialog: false })
        this.props.actions.enableDisablePolicy(payload).
            then(result => {
                if (this._mounted) {
                    if (result.success) {
                        let message = { message: result.message, showSnackbarState: true, variant: 'success' }
                        this.props.showMessage(message)
                        this.props.setProgressBar(false);
                        this.setState({ openPolicyDialog: false, policyId: 0, ruleId: 0, dataList: [], pageNo: 1 }, () => {
                            const filterData = this.props.filterData
                            this.fetchRuleList(filterData)
                            this.props.fetchRuleCount()
                        })
                    } else {
                        let message = { message: result, showSnackbarState: true, variant: 'error' }
                        this.props.showMessage(message)
                        this.props.setProgressBar(false);
                        this.setState({ openPolicyDialog: false, policyId: 0, ruleId: 0 })
                    }
                }
            });
    }

    ruleEnableDisable = () => {
        let payload = {
            policy_id: this.state.policyId,
            rule_id: this.state.ruleId,
            state: this.state.currentStatus === true ? 'deactivate' : 'activate'
        }
        this.props.actions.enableDisableRule(payload).
            then(result => {
                if (this._mounted) {
                    if (result.success) {
                        let message = { message: result.message, showSnackbarState: true, variant: 'success' }
                        this.props.showMessage(message)

                        const newDataList = this.state.dataList.map((row, sidx) => {
                            if (this.state.ruleIndex !== sidx) {
                                return row;
                            } else {
                                const currentStatus = row.active === undefined || row.active === null ? true : row.active;
                                return { ...row, active: !currentStatus };
                            }
                        });

                        this.props.setProgressBar(false);
                        this.setState({ dataList: newDataList, policyIndex: 0, ruleIndex: 0, ruleId: 0, policyId: 0, openRuleDialog: false }, () => {
                            this.props.fetchRuleCount()
                        });
                    } else {
                        this.props.setProgressBar(false);
                        this.setState({ policyIndex: 0, ruleIndex: 0, ruleId: 0, policyId: 0, openRuleDialog: false });
                    }
                }
            });
    }


    // ------------------- API call method End-------------------------


    // ------------------- Custom logic method Start-------------------------

    handleCheckboxChange = name => event => {
        let oldServiceList = cloneDeep(this.state.selectServices)
        if (event.target.checked) {
            oldServiceList.push(event.target.value)
        } else {
            pull(oldServiceList, event.target.value);
        }
        this.props.setProgressBar(true);
        this.setState({ selectServices: oldServiceList, dataList: [], pageNo: 1 }, () => {
            const filterData = this.props.filterData
            this.fetchRuleList(filterData)
        });
    };


    renderPolicyStatus = (status, policyId, ruleId) => {
        let boxClass = ["switch-green"];
        if (status === undefined || status === true) {
            boxClass.push('active');
        }
        return (
            <div>
                <Switch className={boxClass.join(' ')} checked={status === undefined ? true : status} onChange={() => this.policyStatusChange(status, policyId, ruleId)} />
            </div>
        );
    }

    handlePolicyDialogClose = () => {
        this.setState({ openPolicyDialog: false });
    };


    policyStatusChange = (currentStatus, policyId, ruleId) => {
        this.setState({ policyId, ruleId, currentStatus, openPolicyDialog: true });
    }

    statusChange = () => {
        let currentStatus = false
        const newDataList = this.state.dataList.map((row, sidx) => {
            if (this.state.rowIndex !== sidx) {
                return row;
            } else {
                currentStatus = row.status === undefined || row.status === null ? true : row.status;
                this.userActiveDeactive(!currentStatus)
                return { ...row, status: !currentStatus };
            }
        });
        this.setState({ currentStatus: !currentStatus, newDataList, user_id: 0, rowIndex: 0, openDialog: false });
    }



    ruleRenderer = (rowData) => {
        return (
            <table className="table-toggle">
                <thead>
                    <tr>
                        <td width='700'>Id</td>
                        {rowData.policies.length > 0 && <td width='200'>POLICIES</td>}
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td width='700'>
                            <p className="fnt-16 font-bold mrT0 mrB0">#{rowData.rule_id}</p>
                            <p className="fnt-12 mrT0">{rowData.description}</p>
                            <div className="service-name">

                                <span className="sr-icon">
                                    <img alt={rowData.service_name} src={fetchServiceIconPath(rowData.service)} />
                                </span>
                                <span className="sr-name">{rowData.service_name ? rowData.service_name : rowData.service}</span>
                            </div>
                        </td>
                        {rowData.policies.length > 0 && <td width='200'>
                            <List className="list-group">
                                {
                                    rowData.policies.map((policy, index) => {
                                        return <ListItem key={policy.name} className="list-group-item">
                                            <ListItemText primary={policy.name} />
                                            <ListItemSecondaryAction>
                                                {this.renderPolicyStatus(policy.status, policy.id, rowData.rule_id)}
                                            </ListItemSecondaryAction>
                                        </ListItem>
                                    })
                                }
                            </List>
                        </td>
                        }
                        <td></td>
                    </tr>
                </tbody>
            </table>
        );
    }


    handleChange = name => event => {
        const searchValue = event.target.value
        const ruleServiceList = cloneDeep(this.state.ruleServiceList)
        if (searchValue.trim().length > 0) {
            let newServiceList = filter(ruleServiceList, function (ruleService) { return ruleService.service_name.toLowerCase().indexOf(searchValue.toLowerCase())> -1; });
            this.setState({ filterRuleServiceList: newServiceList }, () => {
            })
        } else {
            this.setState({ filterRuleServiceList: ruleServiceList })
        }
    }


    toggleActiveClass = (toggleRowIndex) => {
        if (this.state.toggleRowIndex !== toggleRowIndex) {
            this.setState({ toggleRowIndex })
        } else {
            this.setState({ toggleRowIndex: -1 })
        }
    }

    ruleStatusChangeDialog = (ruleIndex, ruleId, policyId, currentStatus) => {
        this.setState({ openRuleDialog: true, ruleIndex, ruleId, policyId, currentStatus: currentStatus === null || currentStatus === undefined ? true : currentStatus });
    }

    handleRunDialogClose = () => {
        this.setState({ openRuleDialog: false });
    };

    // ------------------- Custom logic method End-------------------------


    // ------------------- Table helper method Start---------------------------

    ruleSwitchCellRenderer = ({ rowData, cellData, rowIndex }) => {
        const policyId = rowData.policies.length > 0 ? rowData.policies[0].id : 0
        let boxClass = ["switch-green"];
        if (cellData === undefined || cellData === true) {
            boxClass.push('active');
        }
        return (
            <div>
                <Switch className={boxClass.join(' ')} checked={cellData === undefined ? true : cellData} onChange={() => this.ruleStatusChangeDialog(rowIndex, rowData.id, policyId, cellData)} />
            </div>
        );
    };

    _rowGetter = ({ index }) => {
        return this.state.dataList[index];
    }

    noRowsRenderer = () => {
        if (!this.state.filterProgress) {
            return (<div className="data-not-found">
                <span>Records Not Found</span>
            </div>)
        }
        else if (this.state.filterProgress) {
            return <Loader />
        }
    }

    scrollEvent = ({ clientHeight, scrollHeight, scrollTop }) => {
        if (this.state.isMoreRecords && scrollTop > 0 && this.state.dataList.length * this.state.rowHeight === scrollHeight) {
            const totalPages = Math.floor(this.state.totalCount / this.state.perPage)
            if (this.state.pageNo <= totalPages) {
                this.setState({ pageNo: this.state.pageNo + 1 }, () => {
                    const filterData = this.props.filterData
                    this.fetchRuleList(filterData)
                });
            }
        }
    }

    // ------------------- Table helper method End-------------------------



    render() {
        const { currentStatus, openRuleDialog, dataList, height, filterRuleServiceList, openPolicyDialog, toggleRowIndex } = this.state
        // const contentStatement = " Are you sure you want to change " + currentStatus ? "Disable" : "Enable" + " this policy ?"
        const contentStatement = " Are you sure you want to ".concat(currentStatus ? "disable" : "enable").concat(" this policy ?")
        const ruleContentStatement = " Are you sure you want to ".concat(currentStatus ? "disable" : "enable").concat(" this rule ?")

        return (
            <div className="container">
                <Grid container spacing={24}>
                    <Grid item sm={3} className="pdT0">
                        <h5 className="mrT0">Filter by Resources</h5>
                    </Grid>
                    <Grid item sm={9} className="pdT0">
                        <Grid container spacing={24} className="mr-container">
                            <Grid item sm={6} className="pdT0">
                                <h5 className="mr0">Rules Available</h5>
                            </Grid>
                            <Grid item sm={6} className="pdT0 text-right">
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid container spacing={24} className="container">
                    <Grid item sm={3} className="pdT0">
                        <div className="filter-search">
                            <ErrorBoundary error="error-boundary">
                                <SearchField handleChange={this.handleChange} />
                                <div className="vrt-scroll">
                                    {
                                        filterRuleServiceList.map((ruleService, index) => {
                                            return <div key={ruleService.service} className="mrT10">
                                                <div
                                                    className="btn-icon btn-checkbox btn-bg-white"
                                                >
                                                    <span className="icon-text">
                                                        <Checkbox
                                                            onChange={this.handleCheckboxChange('checkedA')}
                                                            value={ruleService.service}
                                                            color="primary"
                                                            className="checkbox-select"
                                                        />
                                                    </span>
                                                    <span className="bar-icon">
                                                        <img alt={ruleService.service_name} src={fetchServiceIconPath(ruleService.service)} /> {ruleService.service_name} ({ruleService.count} )
                                                        </span>
                                                </div>
                                            </div>
                                        })
                                    }
                                </div>
                            </ErrorBoundary>
                        </div>
                    </Grid>
                    <Grid item sm={9} className="pdT0">
                        <Grid container spacing={24} className="mr-container grid-container">
                            <Grid item sm={12} className="pdT0">
                                <ErrorBoundary error="error-boundary">
                                    <WithDrawer
                                        drawerContent={(rowProps) => {
                                            return (<div className="sub-table">{this.ruleRenderer(rowProps.rowData)}</div>);
                                        }}
                                        rowsDimensions={dataList.map((dataItem) => ({ collapsedHeight: 80, expandedHeight: 320 }))}
                                    >
                                        {({ rowHeight, rowRenderer, toggleDrawer, toggleDrawerWithAnimation, setTableRef }) => (
                                            <div style={{ height: "100%", maxHeight: "100%" }}>
                                                <AutoSizer>
                                                    {({ height, width }) => (
                                                        <Table
                                                            ref={setTableRef}
                                                            headerHeight={0}
                                                            height={height}
                                                            width={width}
                                                            rowCount={dataList.length}
                                                            rowGetter={this._rowGetter}
                                                            rowHeight={rowHeight}
                                                            rowRenderer={rowRenderer}
                                                            className="data-table table-policy table-expand table-rule table-border"
                                                            noRowsRenderer={this.noRowsRenderer}
                                                            onScroll={this.scrollEvent}
                                                        >

                                                            <Column
                                                                className="col-td toggle-row"
                                                                label=""
                                                                dataKey="resource"
                                                                width={40}
                                                                headerRenderer={headerRenderer}
                                                                cellRenderer={
                                                                    ({ cellData, rowIndex }) => {
                                                                        return (
                                                                            <div onClick={() => this.toggleActiveClass(rowIndex)} className={rowIndex === toggleRowIndex ? 'arrow-down' : ''}>
                                                                                <a href="javascript:void(0)" onClick={() => toggleDrawerWithAnimation(rowIndex)}>
                                                                                    <i className="fa fa-angle-right"></i>
                                                                                </a>
                                                                            </div>
                                                                        );
                                                                    }
                                                                }
                                                            />
                                                            <Column
                                                                className="col-td text-center fnt-15"
                                                                dataKey="rule_id"
                                                                label="Policy Name"
                                                                headerRenderer={headerRenderer}
                                                                disableSort={!this.isSortEnabled}
                                                                width={250}
                                                                flexGrow={1}

                                                            />

                                                            <Column
                                                                className="col-td fnt-15 font-bold"
                                                                dataKey="name"
                                                                label="Account"
                                                                currentStatus headerRenderer={headerRenderer}
                                                                cellRenderer={wrapTextCellRenderer}
                                                                disableSort={true}
                                                                width={700}
                                                                flexGrow={2}
                                                            />

                                                            <Column
                                                                className="col-td"
                                                                dataKey="service"
                                                                label="Service"
                                                                headerRenderer={headerRenderer}
                                                                disableSort={!this.isSortEnabled}
                                                                cellRenderer={serviceCellRenderer}
                                                                width={300}
                                                                flexGrow={3}
                                                            />

                                                            <Column
                                                                className="col-td"
                                                                dataKey="active"
                                                                label="Status"
                                                                headerRenderer={headerRenderer}
                                                                disableSort={true}
                                                                cellRenderer={this.ruleSwitchCellRenderer}
                                                                width={350}
                                                                flexGrow={4}
                                                                className="table-td"
                                                            />

                                                        </Table>
                                                    )}
                                                </AutoSizer>
                                            </div>
                                        )}
                                    </WithDrawer>
                                </ErrorBoundary>
                                <ConfirmDialogBoxHOC
                                    isOpen={openPolicyDialog}
                                    title={'Confirmation'}
                                    content={contentStatement}
                                    handleDialogClose={this.handlePolicyDialogClose}
                                    successDialogEvent={this.policyEnableDisable}
                                />

                                <ConfirmDialogBoxHOC
                                    isOpen={openRuleDialog}
                                    title={'Confirmation'}
                                    content={ruleContentStatement}
                                    handleDialogClose={this.handleRunDialogClose}
                                    successDialogEvent={this.ruleEnableDisable}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </div>
        )
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(RuleList));