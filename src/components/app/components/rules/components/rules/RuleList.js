import React, { PureComponent } from "react";

import Loader from 'global/Loader';
import Switch from '@material-ui/core/Switch';

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import AddIcon from '@material-ui/icons/Add';
import NoteIcon from '@material-ui/icons/Description';
import { Column, InfiniteLoader, SortDirection, Table } from "react-virtualized";
import AutoSizer from "react-virtualized/dist/commonjs/AutoSizer";
import { sNoCellRenderer, serviceCellRenderer, headerRenderer } from 'TableHelper/cellRenderer';
import history from 'customHistory'
import ChangeSeverityForm from './ChangeSeverityForm'
import ConfirmDialogBoxHOC from 'hoc/DialogBox'
import { cloneDeep } from "lodash"
import * as ruleAction from 'actions/ruleAction'
import * as assetsActions from 'actions/assetsAction';
import { setProgressBar } from 'actions/commonAction'
import { fetchServiceIconPath } from 'utils/serviceIcon';
import { store } from 'client';
import { showMessage } from 'actions/messageAction';
import AddNoteDialogBox from './AddNoteDialogBox'

const PriorityColorClass = { critical: 'text-danger', high: 'text-orange', mid: 'text-warning', low: 'text-success', suppessed: 'text-gray', warning: 'text-warning' }

class RuleList extends PureComponent {

    _mounted = false

    state = {

        // Table attribute
        headerHeight: 40,
        rowHeight: 25,
        rowCount: 0,
        height: 450,
        sortBy: "service",
        sortDirection: SortDirection.ASC,

        count: 10,
        dataList: [],
        assetTypes: {},

        checkedA: true,

        pageNo: 0,
        isMoreData: true,
        perPage: 50,

        filterProgress: false,
        anchorEl: null,

        //Used for open filter dialog
        placement: null,
        popperEl: null,
        openPopOver: false,
        checked: [0],

        // Used for header filter list
        enableDisableFilterList: [{ name: 'Active', value: 'Active' }, { name: 'In-Active', value: 'Inactive' }],
        yesNoFilterList: [{ name: 'Yes', value: 'yes' }, { name: 'No', value: 'no' }],
        filterList: [],

        openDialog: false,
        currentSeverity: '',
        rule_details: {},
        currentStatus: false,
        openStatusDialog: false,
        openNoteDialog: false,
        isEnableNote: false
    };


    componentDidMount() {
        this._mounted = true
        const filterData = this.props.filterData
        if (filterData.selectAccount.id !== 'all' && filterData.selectAccount.id !== undefined) {
            this._mounted = false
            this.fetchAssetTypes()
            this.fetchRuleListByAccount(filterData)
        } else {
            this.setState({ dataList: [], filterProgress: false })
        }
        this.unsubscribe = store.subscribe(this.receiveFilterData)
    }

    //   --------------------Table helper method Start-----------------------

    fetchAssetTypes() {
        this.props.actions.fetchAssetTypes().
            then(result => {
                this._mounted = true
                if (result && (typeof result !== 'string')) {
                    let assetTypes = {}
                    result.forEach(function (t) {
                        assetTypes[t.id] = t.name
                    });
                    this.setState({ assetTypes })
                }
            })
    }

    fetchRuleListByAccount(filterData) {
        this.props.actions.fetchRuleListByAccount(filterData.selectAccount.id).
            then(result => {
                this._mounted = true
                if (result && (typeof result !== 'string')) {
                    this.setState({ dataList: result })
                    this.props.setTotals({ total: result.length, suppressed: 0 })
                    this.props.setProgressBar(false);
                } else {
                    this.props.setProgressBar(false);
                    this.setState({ filterProgress: false })
                    let message = { message: result, showSnackbarState: true, variant: 'error' }
                    this.props.showMessage(message)
                }
            });
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
                this.fetchRuleListByAccount(filterData)
            } else {
                this.setState({ dataList: [] })
            }
        }
    }

    SuppressRule(type, data, name) {
        if (type === 'suppress') {
            this.props.actions.suppressRule(data).
                then(result => {
                    if (this._mounted) {
                        if (result && (typeof result === 'string')) {
                            let message = { message: result, showSnackbarState: true, variant: 'error' }
                            this.props.showMessage(message)
                        } else {
                            mixpanel.track("Suppress", {
                                "Item Type": "Rule",
                                "Name of Item": name,
                            });
                        }
                    }
                })
        } else if (type === 'unsuppress') {
            this.props.actions.unsuppressRule(data).
                then(result => {
                    if (this._mounted) {
                        if (result && (typeof result === 'string')) {
                            let message = { message: result, showSnackbarState: true, variant: 'error' }
                            this.props.showMessage(message)
                        }
                    }
                })
        }
    }

    _isRowLoaded = ({ index }) => {
        return !!this.state.dataList[index];
    }

    _loadMoreRows = ({ startIndex, stopIndex }) => {
        console.log(" load more ....", startIndex, stopIndex);
        this.setState({ dataList: this.getRows(startIndex + 10) });
    }


    sort = ({ sortBy, sortDirection }) => {
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


    complianceRenderer = ({ cellData }) => {
        if (cellData !== undefined) {
            return (
                <div>
                    {cellData.map((item, index) => {
                        return (<div className="padding-tag"><span key={item + '- ' + index} className="chip-white mrR5">{item}</span></div>)
                    })}
                    {/*cellData.length > 2 && <span className="link-hrf">+{cellData.length - 2}</span>*/}
                </div>
            )
        }
    }

    priorityCellRenderer = ({ rowData, cellData }) => {
        {/* <div onClick={()=>this.openSeverityDialog(cellData.name.toLowerCase(),rowData)}> */ }
        return (
            <div>
                <span className={PriorityColorClass[cellData.name.toLowerCase()] + ' mrR5'}><i className="fa fa-circle"></i></span>
                <span /* className="link-hrf" */>  {cellData.name}</span>
            </div>
        )
    }

    statusChangeCellRenderer = ({ cellData, rowIndex }) => {
        return (
            <Switch
                checked={cellData === true}
                onChange={() => this.statusChangeDialog(cellData, rowIndex)}
                value={cellData === true}
                className={cellData === true ? "select-control-red" : "select-control-green active"}
            />
        )
    }

    handleSwitchChange = name => event => {
        this.setState({ [name]: event.target.checked });
    }


    anchorCellRenderer = ({ rowData, cellData }) => {
        return (
            <div>
                <a href="javascript:void(0)" onClick={() => history.push({
                    pathname: '/app/rules/detail/',
                    state: { rule: rowData, asset_type: this.state.assetTypes[rowData.asset_type_id].replace(/_/g, ' ') }
                })}>{cellData}</a>
            </div>
        );
    };

    descriptionCellRenderer = ({ cellData }) => {
        return (
            <div>
                <strong className="fnt-13">{cellData}</strong>
            </div>
        );
    };

    assetsFailedCellRenderer = ({ cellData }) => {
        return (
            <div>
                <span className="text-danger">{cellData}</span>
            </div>
        );
    };


    assetsPassedCellRenderer = ({ cellData }) => {
        return (
            <div>
                <span className="text-success">{cellData}</span>
            </div>
        );
    };

    assetTypeCellRenderer = ({ cellData }) => {
        let assetTypeName = this.state.assetTypes[cellData]
        let assetName = undefined
        if (assetTypeName !== undefined) {
            assetName = assetTypeName.split('_')[0]
        }
        return (
            <div className="service-icon" title={assetName}>
                {assetName !== undefined && <img src={fetchServiceIconPath(assetName)} />} {assetName.toUpperCase()}
            </div>
        );
    };

    handleClick = (placement, dataKey) => (event) => {
        const { currentTarget } = event;
        if (dataKey === 'mfaEnabled') {
            this.setState(state => ({
                popperEl: currentTarget,
                openPopOver: state.placement !== placement || !state.openPopOver,
                placement,
                filterList: state.yesNoFilterList
            }));
        } else if (dataKey === 'status') {
            this.setState(state => ({
                popperEl: currentTarget,
                openPopOver: state.placement !== placement || !state.openPopOver,
                placement,
                filterList: state.enableDisableFilterList
            }));
        } else {
            this.setState(state => ({
                popperEl: null,
                openPopOver: false,
                placement: null,
            }));
        }
    };


    handleDialogClose = () => {
        this.setState({ openDialog: false, openStatusDialog: false })
    }

    openSeverityDialog = (currentSeverity, rule_details) => {
        this.setState({ openDialog: true, currentSeverity, rule_details })
    }


    statusChangeDialog = (cellData, rowIndex) => {
        this.setState({ openStatusDialog: true, rowIndex, currentStatus: cellData });
    }


    enableDisableSuppress = () => {
        const dataList = cloneDeep(this.state.dataList)
        let newDataList = dataList.map((row, sidx) => {
            if (this.state.rowIndex !== sidx) {
                return row;
            } else {
                const currentStatus = this.state.currentStatus;
                let type = 'suppress'
                if (currentStatus) {
                    type = 'unsuppress'
                }
                this.SuppressRule(type, { id: row.id, cloud_account_id: this.props.filterData.selectAccount.id }, row.label)
                return { ...row, suppress: !currentStatus, suppressed: !currentStatus };
            }
        });
        this.setState({ dataList: newDataList, openStatusDialog: false }, () => {
        });
    }

    enableDisableRule = () => {
        const dataList = cloneDeep(this.state.dataList)
        let newDataList = dataList.map((row, sidx) => {
            if (this.state.rowIndex !== sidx) {
                return row;
            } else {
                const currentStatus = this.state.currentStatus;
                return { ...row, status: !currentStatus };
            }
        });
        this.setState({ dataList: newDataList, openStatusDialog: false }, () => {
        });
    }

    notesCellRenderer = ({ cellData, rowData, rowIndex }) => {
        return (
            // <a onClick={() => this.handleNoteDialogOpen(rowData, rowIndex)} className="add-icon" href="javascript:void(0)">
            //     {cellData.length > 0 ? <NoteIcon/> : <AddIcon/> } 
            // </a>
            <a onClick={this.handleNoteDialogOpen} className="add-icon" href="javascript:void(0)">
                <NoteIcon />
            </a>
        )
    }

    handleNoteDialogOpen = () => {
        this.setState({
            isEnableNote: true,
            // selectedRowIndex: rowIndex,
            // selectedAlert: alert,
            openNoteDialog: true,
        });
    };

    handleNoteDialogClose = () => {
        this.setState({ openNoteDialog: false });
    };

    enableDisableNote = () => {
        this.setState((pre) => ({ isEnableNote: !pre.isEnableNote }))
        // this.setState((pre) => ({ isEnableNote:!pre.isEnableNote }), () => {
        //     this.statusChangeDialog(this.state.selectedAlert.suppressed, this.state.selectedRowIndex)
        // })
    }


    //   --------------------Table helper method End-----------------------

    render() {
        const {
            headerHeight,
            sortBy,
            sortDirection,
            dataList,
            openDialog,
            currentSeverity,
            rule_details,
            openStatusDialog,
            openNoteDialog,
            currentStatus,
            isEnableNote
        } = this.state;

        const sortedList = dataList;

        return (
            <div className="table-container" style={{ height: "100%", maxHeight: "100%" }}>
                <AutoSizer>
                    {({ height, width }) => (
                        <InfiniteLoader
                            isRowLoaded={this._isRowLoaded}
                            loadMoreRows={this._loadMoreRows}
                            rowCount={100}
                            height={height}
                            threshold={10}
                        >
                            {({ onRowsRendered, registerChild }) => (
                                <Table
                                    headerHeight={headerHeight}
                                    height={height}
                                    rowCount={dataList.length}
                                    rowGetter={({ index }) => sortedList[index]}
                                    rowHeight={70}
                                    //sort={this.sort}
                                    sortBy={sortBy}
                                    sortDirection={sortDirection}
                                    onRowsRendered={onRowsRendered}
                                    noRowsRenderer={this.noRowsRenderer}
                                    width={width}
                                    className="data-table table-no-border"
                                >

                                    <Column
                                        dataKey="label"
                                        label="Rule Id"
                                        headerRenderer={headerRenderer}
                                        cellRenderer={this.anchorCellRenderer}
                                        disableSort={true}
                                        width={120}
                                        flexGrow={1}
                                    />

                                    <Column
                                        dataKey="description"
                                        label="Description"
                                        headerRenderer={headerRenderer}
                                        cellRenderer={this.descriptionCellRenderer}
                                        disableSort={false}
                                        width={600}
                                        flexGrow={2}

                                    />

                                    {/* <Column
                                        dataKey="rule_type"
                                        label="Rule Type"
                                        headerRenderer={headerRenderer}
                                        cellRenderer={serviceCellRenderer}
                                        disableSort={false}
                                        width={100}
                                        flexGrow={3}
                                    /> */}

                                    {/* <Column
                                        dataKey="compliance_requirements"
                                        label="Compliance Tags"
                                        headerRenderer={headerRenderer}
                                        cellRenderer={this.complianceRenderer}
                                        disableSort={false}
                                        width={150}
                                        flexGrow={4}
                                    /> */}



                                    {/* <Column
                                        dataKey="assets_failed"
                                        label="Assets Passed"
                                        headerRenderer={headerRenderer}
                                        cellRenderer={this.assetsPassedCellRenderer}
                                        disableSort={false}
                                        width={100}
                                        flexGrow={6}
                                    />

                                    <Column
                                        dataKey="assets_failed"
                                        label={"Assets Failed"}
                                        headerRenderer={headerRenderer}
                                        cellRenderer={this.assetsFailedCellRenderer}
                                        disableSort={false}
                                        width={100}
                                        flexGrow={7}
                                    /> */}

                                    <Column
                                        dataKey="priority"
                                        label={"Severity"}
                                        headerRenderer={headerRenderer}
                                        cellRenderer={this.priorityCellRenderer}
                                        disableSort={false}
                                        width={50}
                                        flexGrow={8}
                                    />

                                    <Column
                                        dataKey="asset_type_id"
                                        label={"Asset Type"}
                                        headerRenderer={headerRenderer}
                                        cellRenderer={this.assetTypeCellRenderer}
                                        disableSort={false}
                                        width={50}
                                        flexGrow={8}
                                    />

                                    <Column
                                        dataKey="suppressed"
                                        label="Active/ Suppressed"
                                        headerRenderer={headerRenderer}
                                        cellRenderer={this.statusChangeCellRenderer}
                                        disableSort={false}
                                        width={50}
                                        flexGrow={9}
                                    />

                                    <Column
                                        dataKey="comments"
                                        label="Notes"
                                        headerRenderer={headerRenderer}
                                        cellRenderer={this.notesCellRenderer}
                                        disableSort={false}
                                        width={80}
                                        flexGrow={10}

                                    />

                                </Table>
                            )}
                        </InfiniteLoader>
                    )}
                </AutoSizer>
                <ConfirmDialogBoxHOC
                    isOpen={openStatusDialog}
                    handleDialogClose={this.handleDialogClose}
                    title={'Confirmation'}
                    cancelBtnLabel={"CANCEL"}
                    confirmBtnLabel={currentStatus === true ? "ACTIVE" : "SUPPRESS"}
                    content={currentStatus === true ? 'Are you sure you want to Active this Rule ?' : 'Are you sure you want to Suppress this Rule ?'}
                    successDialogEvent={this.enableDisableSuppress} />

                <AddNoteDialogBox isOpen={openNoteDialog}
                    //  alert={selectedAlert} 
                    isEnableNote={isEnableNote}
                    enableDisableNote={this.enableDisableNote}
                    //  addComment={this.addComment}
                    handleNoteDialogClose={this.handleNoteDialogClose}
                />


                <ChangeSeverityForm openDialog={openDialog} currentSeverity={currentSeverity} rule_details={rule_details} handleDialogClose={this.handleDialogClose} />
            </div>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(Object.assign({}, ruleAction, assetsActions), dispatch),
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