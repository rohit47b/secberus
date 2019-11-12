/*
 * @Author: Virendra Patidar 
 * @Date: 2018-09-26 10:01:52 
 * @Last Modified by: Virendra Patidar
 * @Last Modified time: 2019-04-23 16:19:36
 */
import React, { PureComponent } from "react"

import {
    Table,
    Column,
    SortDirection,
    InfiniteLoader
} from "react-virtualized"
import AutoSizer from "react-virtualized/dist/commonjs/AutoSizer"

import WithDrawer from 'TableHelper/with-drawer'

import Switch from '@material-ui/core/Switch'
import Chip from '@material-ui/core/Chip'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { debounce } from "lodash"
import { withRouter } from 'react-router-dom'

import Loader from 'global/Loader'
import ConfirmDialogBoxHOC from 'hoc/DialogBox'
import EditPolicy from './EditPolicy'

import { headerRenderer, dateCellRenderer } from 'TableHelper/cellRenderer'

import { showMessage } from 'actions/messageAction'
import * as securityPolicyActions from 'actions/securityPolicyAction'
import { setProgressBar } from 'actions/commonAction'
import { fetchServiceIconPath } from 'utils/serviceIcon'

class PolicyList extends PureComponent {

    _mounted = false

    state = {
        // Table helper attribute
        headerHeight: 40,
        rowHeight: 25,
        rowCount: 0,
        height: 450,
        sortBy: "columnone",
        sortDirection: SortDirection.ASC,
        count: 10,
        dataList: [],
        checkedA: false,
        openPolicyDialog: false,
        policyIndex: 0,
        policyId: 0,
        openRuleDialog: false,
        policyIndex: 0,
        ruleIndex: 0,
        ruleId: 0,
        toggleRowIndex: -1,
        filterProgress: false,

        //For edit policy name
        policyName:'',
        policyId:'',
        openEditDialog:false
    };

    fetchPolicyList = debounce(this.fetchPolicyList, 1000);

    componentDidMount() {
        this._mounted = true
        this.props.setProgressBar(true);
        this.setState({ dataList: [] }, () => {
            this.fetchPolicyList()
        })
    }

    componentWillUnmount() {
        this._mounted = false
    }

    componentDidUpdate = (prevProps, prevState) => {
        if (this.props.account !== prevProps.account) {
            this.setState({ dataList: [], filterProgress: true }, () => {
                this.fetchPolicyList()
            })
        }
    }


    fetchPolicyList() {
        let payload = {
        }

        if (this.props.account !== '') {
            payload['account_id'] = this.props.account
        }

        this.props.actions.fetchPolicyList(payload).
            then(result => {
                if (this._mounted) {
                    if (result.success) {
                        this.props.setProgressBar(false);
                        this.setState({ dataList: result.data, loaded: true, filterProgress: false });
                    } else {
                        this.props.setProgressBar(false);
                        this.setState({ dataList: [], loaded: true, filterProgress: false });
                        let message = { message: result, showSnackbarState: true, variant: 'error' }
                        this.props.showMessage(message)
                    }
                }
            });
    }


    // ---------------- Table helper method start------------------

    _rowGetter = ({ index }) => {
        return this.state.dataList[index];
    }

    _isRowLoaded = ({ index }) => {
        return !!this.state.dataList[index];
    }

    accountCellRenderer = ({ cellData }) => {
        return (
            cellData.map((accountName, index) => {
                return <div key={accountName}>
                    <Chip label={accountName} className="chip-gray" />
                </div>
            })
        );
    };

    activeRuleCellRenderer = ({ rowData }) => {
        let activeRule = 0
        let stoopedRule = 0
        rowData.rules.map((item, index) => {
            if (item.rules_state) {
                activeRule = item.count
            } else {
                stoopedRule = item.count
            }
        })
        return (
            <div>
                <span className='text-success fnt-14'>{activeRule}</span> / {stoopedRule}
            </div>
        );
    };

    policyNameCellRenderer = ({ cellData }) => {
        return (
            <div>
                <a href="javascript:void(0)">{cellData}</a>
            </div>
        );
    };

    switchCellRenderer = ({ rowData, cellData, rowIndex }) => {
        let boxClass = ["switch-green"];
        if (cellData === undefined || cellData === true) {
            boxClass.push('active');
        }
        return (
            <div>
                <Switch className={boxClass.join(' ')} checked={cellData === undefined ? true : cellData} onChange={() => this.policyStatusChangeDialog(rowIndex, rowData.id)} />
            </div>
        );
    };


    _loadMoreRows = ({ startIndex, stopIndex }) => {
        const filterData = this.props.filterData
    }

    isSortEnabled = () => {
        const list = this.state.dataList;
        const rowCount = this.state.rowCount;
        return rowCount <= list.length;
    }

    sort = ({ sortBy, sortDirection }) => {
        this.setState({ sortBy, sortDirection });
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

    actionCellRenderer = ({ columnIndex, key, parent, rowIndex, style, rowData }) => {
        return (
            <div className="icon-action">
                <a href="javascript:void(0)" onClick={() => this.openEditPolicyName(rowData.name,rowData.id)} ><i className="fa fa-pencil" ></i></a>
            </div>
        );
    };

    
    // ---------------- Table helper method End------------------


    // ---------------- Custom logic method Start------------------

    openEditPolicyName = (policyName,policyId) => {
        this.setState({ openEditDialog: true, policyName,policyId })
    }

    handleDialogClose=()=>{
        this.setState({ openEditDialog: false})
    }

    policyNameEditSuccess=(newPolicyName)=>{
        const newDataList = this.state.dataList.map((row, sidx) => {
            if (this.state.policyId !== row.id) {
                return row;
            } else {
                return { ...row, name: newPolicyName };
            }
        });
        this.setState({dataList:newDataList,openEditDialog:false})        
    }

    policyStatusChangeDialog = (policyIndex, policyId) => {
        this.setState({ openPolicyDialog: true, policyIndex, policyId });
    }

    handlePolicyDialogClose = () => {
        this.setState({ openPolicyDialog: false });
    };

    policyStatusChange = () => {
        this.state.dataList.map((row, sidx) => {
            if (this.state.policyIndex !== sidx) {
                return row;
            } else {
                const currentStatus = row.active === undefined || row.active === null ? true : row.active;
                this.policyEnableDisable(currentStatus === true ? 'deactivate' : 'activate')
                this.props.setProgressBar(true);
                this.setState({ openPolicyDialog: false });
                return { ...row, active: !currentStatus };
            }
        });

    }

    policyEnableDisable = (status) => {
        let payload = {
            policy_id: this.state.policyId,
            state: status
        }
        this.props.actions.enableDisablePolicy(payload).
            then(result => {
                if (this._mounted) {
                    if (result.success) {
                        let message = { message: result.message, showSnackbarState: true, variant: 'success' }
                        this.props.showMessage(message)

                        const newDataList = this.state.dataList.map((row, sidx) => {
                            if (this.state.policyIndex !== sidx) {
                                return row;
                            } else {
                                const currentStatus = row.active === undefined || row.active === null ? true : row.active;
                                return { ...row, active: !currentStatus };
                            }
                        });
                        this.props.setProgressBar(false);
                        this.setState({ dataList: newDataList, policyIndex: 0, openPolicyDialog: false });

                        this.props.updatePolicyCount()
                    } else {
                        let message = { message: result, showSnackbarState: true, variant: 'error' }
                        this.props.showMessage(message)
                        this.props.setProgressBar(false);
                        this.setState({ policyIndex: 0, openPolicyDialog: false });
                    }
                }
            });
    }

    renderRuleStatus = (policyIndex, ruleIndex, status, policyId, ruleId) => {
        let boxClass = ["switch-green"];
        if (status === undefined || status === true) {
            boxClass.push('active');
        }
        return (
            <div>
                <Switch className={boxClass.join(' ')} checked={status === undefined ? true : status} onChange={() => this.ruleStatusChangeDialog(policyIndex, ruleIndex, policyId, ruleId)} />
            </div>
        );
    }

    ruleStatusChangeDialog = (policyIndex, ruleIndex, policyId, ruleId) => {
        this.setState({ openRuleDialog: true, policyIndex, ruleIndex, policyId, ruleId });
    }

    handleRunDialogClose = () => {
        this.setState({ openRuleDialog: false });
    };


    ruleStatusChange = () => {
        this.state.dataList.map((row, sidx) => {
            if (this.state.policyIndex !== sidx) {
                return row;
            } else {
                const ruleList = row.rules_list.map((ruleRow, ridx) => {
                    if (this.state.ruleIndex !== ridx) {
                        return ruleRow;
                    } else {
                        const currentStatus = ruleRow.active === undefined || ruleRow.active === null ? true : ruleRow.active;
                        this.ruleEnableDisable(currentStatus === true ? 'deactivate' : 'activate')
                        this.props.setProgressBar(false);
                        this.setState({ openRuleDialog: false });
                        return { ...ruleRow, active: !currentStatus };
                    }
                });
                return { ...row, rules_list: ruleList };
            }
        });
    }

    ruleEnableDisable(status) {
        let payload = {
            policy_id: this.state.policyId,
            rule_id: this.state.ruleId,
            state: status
        }
        this.props.actions.enableDisableRule(payload).
            then(result => {
                if (this._mounted) {
                    if (result.success) {
                        let message = { message: result.message, showSnackbarState: true, variant: 'success' }
                        this.props.showMessage(message)

                        const newDataList = this.state.dataList.map((row, sidx) => {
                            if (this.state.policyIndex !== sidx) {
                                return row;
                            } else {
                                let currentStatus = true
                                /**
                                 * Logic for change status of rule
                                 */
                                const ruleList = row.rules_list.map((ruleRow, ridx) => {
                                    if (this.state.ruleIndex !== ridx) {
                                        return ruleRow;
                                    } else {
                                        currentStatus = ruleRow.active === undefined || ruleRow.active === null ? true : ruleRow.active;
                                        return { ...ruleRow, active: !currentStatus };
                                    }
                                });

                                /**
                                 * Logic for update active/inactive rule count
                                 */

                                //---- Start------
                                let rules = row.rules
                                let activeRule = 0
                                let stoopedRule = 0
                                row.rules.map((item, index) => {
                                    if (item.rules_state) {
                                        activeRule = item.count
                                    } else {
                                        stoopedRule = item.count
                                    }
                                })

                                if (currentStatus === true) {
                                    rules = [{ count: stoopedRule + 1, rules_state: false }, { count: activeRule - 1, rules_state: true }]
                                } else {
                                    rules = [{ count: stoopedRule - 1, rules_state: false }, { count: activeRule + 1, rules_state: true }]
                                }
                                //---- End------

                                return { ...row, rules_list: ruleList, rules: rules };
                            }
                        });

                        this.props.setProgressBar(false);
                        this.setState({ dataList: newDataList, policyIndex: 0, ruleIndex: 0, ruleId: 0, policyId: 0, openRuleDialog: false });
                    } else {
                        let message = { message: result, showSnackbarState: true, variant: 'error' }
                        this.props.showMessage(message)
                        this.props.setProgressBar(false);
                        this.setState({ policyIndex: 0, ruleIndex: 0, ruleId: 0, policyId: 0, openRuleDialog: false });
                    }
                }
            });
    }


    ruleRenderer = (policyIndex, rules, policyId) => {
        return (
            <table className="table-inner">
                <tbody>
                    {rules.map((rule, ruleIndex) => {
                        return <tr key={rule.service + ruleIndex}>
                            <td>{ruleIndex + 1}</td>
                            <td width="400">{rule.name}</td>
                            <td width="200">
                                <div className="service-name">
                                    <span className="sr-icon">
                                        <img alt={rule.service_name} src={fetchServiceIconPath(rule.service)} />
                                    </span>
                                    <span className="sr-name">{rule.service_name}</span>
                                </div>
                            </td>
                            <td>
                                {this.renderRuleStatus(policyIndex, ruleIndex, rule.active, policyId, rule.id)}
                            </td>
                        </tr>
                    })
                    }
                </tbody>
            </table>
        );
    }

    toggleActiveClass = (toggleRowIndex) => {
        if (this.state.toggleRowIndex !== toggleRowIndex) {
            this.setState({ toggleRowIndex })
        } else {
            this.setState({ toggleRowIndex: -1 })
        }
    }

    // ---------------- Custom logic method end------------------


    render() {
        const {
            height,
            dataList,
            openPolicyDialog,
            openRuleDialog,
            toggleRowIndex,
            policyName,policyId,
            openEditDialog
        } = this.state;

        return (
            <div className="container">
                <WithDrawer
                    drawerContent={(rowProps) => {
                        return (<div className="sub-table">{this.ruleRenderer(rowProps.index, rowProps.rowData.rules_list, rowProps.rowData.id)}</div>);
                    }}
                    rowsDimensions={dataList.map((dataItem) => ({ collapsedHeight: 38, expandedHeight: 300 }))}
                >
                    {({ rowHeight, rowRenderer, toggleDrawerWithAnimation, setTableRef }) => (
                        <div className="container-level1">
                            <AutoSizer className="auto-container">
                                {({ width, height }) => (
                                    <InfiniteLoader
                                        isRowLoaded={this._isRowLoaded}
                                        loadMoreRows={this._loadMoreRows}
                                        rowCount={100}
                                        height={height}
                                        threshold={10}
                                    >
                                        {({ onRowsRendered, registerChild }) => (
                                            <Table
                                                ref={setTableRef}
                                                headerHeight={39}
                                                height={height}
                                                width={width}
                                                rowCount={dataList.length}
                                                rowGetter={this._rowGetter}
                                                rowHeight={rowHeight}
                                                rowRenderer={rowRenderer}
                                                noRowsRenderer={this.noRowsRenderer}
                                                className="data-table table-policy table-expand table-border"
                                            >

                                                <Column
                                                    className="col-td toggle-row"
                                                    label=""
                                                    dataKey="resource"
                                                    width={50}
                                                    flexGrow={1}
                                                    headerRenderer={headerRenderer}
                                                    cellRenderer={
                                                        ({ cellData, rowIndex }) => {
                                                            return (
                                                                <div onClick={() => { this.toggleActiveClass(rowIndex) }} className={rowIndex === toggleRowIndex ? 'arrow-down' : ''}>
                                                                    <a href="javascript:void(0)" onClick={() => toggleDrawerWithAnimation(rowIndex)}>
                                                                        <i className="fa fa-angle-right"></i>
                                                                    </a>
                                                                </div>
                                                            );
                                                        }
                                                    }
                                                />
                                                <Column
                                                    className="col-td"
                                                    dataKey="name"
                                                    label="Policy Name"
                                                    headerRenderer={headerRenderer}
                                                    disableSort={!this.isSortEnabled}
                                                    cellRenderer={this.policyNameCellRenderer}
                                                    width={350}
                                                    flexGrow={2}

                                                />

                                                <Column
                                                    className="col-td"
                                                    dataKey="activeRule"
                                                    label="Active Rule"
                                                    headerRenderer={headerRenderer}
                                                    disableSort={!this.isSortEnabled}
                                                    cellRenderer={this.activeRuleCellRenderer}
                                                    width={350}
                                                    flexGrow={3}
                                                />

                                                <Column
                                                    className="col-td"
                                                    dataKey="account_name"
                                                    label="Account"
                                                    headerRenderer={headerRenderer}
                                                    cellRenderer={this.accountCellRenderer}
                                                    disableSort={true}
                                                    width={350}
                                                    flexGrow={4}
                                                />

                                                <Column
                                                    className="col-td"
                                                    dataKey="last_executed"
                                                    label="Last Run"
                                                    headerRenderer={headerRenderer}
                                                    disableSort={!this.isSortEnabled}
                                                    cellRenderer={dateCellRenderer}
                                                    width={350}
                                                    flexGrow={5}
                                                />
                                                <Column
                                                    className="col-td"
                                                    dataKey="active"
                                                    label="Status"
                                                    headerRenderer={headerRenderer}
                                                    disableSort={true}
                                                    cellRenderer={this.switchCellRenderer}
                                                    width={350}
                                                    flexGrow={6}
                                                    className="table-td"
                                                />

                                                   <Column
                                                    dataKey="action"
                                                    label="Edit"
                                                    headerRenderer={headerRenderer}
                                                    cellRenderer={this.actionCellRenderer}
                                                    disableSort={true}
                                                    width={80}
                                                    flexGrow={8}
                                                />
                                            
                                            </Table>
                                        )}
                                    </InfiniteLoader>
                                )}
                            </AutoSizer>
                        </div>
                    )}
                </WithDrawer>

                <EditPolicy editSuccess={this.policyNameEditSuccess} handleDialogClose={this.handleDialogClose} policyId={policyId} name={policyName} openDialog={openEditDialog}/>

                <ConfirmDialogBoxHOC
                    isOpen={openPolicyDialog}
                    handleDialogClose={this.handlePolicyDialogClose}
                    title={'Confirmation'}
                    content={'Are you sure you want to change the status of this security policy ?'}
                    successDialogEvent={this.policyStatusChange}
                />

                <ConfirmDialogBoxHOC
                    isOpen={openRuleDialog}
                    handleDialogClose={this.handleRunDialogClose}
                    title={'Confirmation'}
                    content={'Are you sure you want to change status of this Rule ?'}
                    successDialogEvent={this.ruleStatusChange}
                />

            </div>
        );
    }
}


function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(Object.assign({}, securityPolicyActions), dispatch),
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(PolicyList));