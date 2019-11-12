import { Checkbox, List, ListItem, ListItemText } from '@material-ui/core';
import Fade from '@material-ui/core/Fade';
import Grid from '@material-ui/core/Grid';
import Popper from '@material-ui/core/Popper';
import AddIcon from '@material-ui/icons/Add';
import NoteIcon from '@material-ui/icons/Description';

import * as alertsActions from 'actions/alertsAction';
import { setActiveMenu, setActiveParentMenu, setProgressBar, setAlertsPlan } from 'actions/commonAction';
import { showMessage } from 'actions/messageAction';
import { store } from 'client';
import history from 'customHistory';
import Loader from 'global/Loader';
import { cloneDeep, debounce, pull } from "lodash";
import React, { Fragment, PureComponent } from "react";
import { connect } from "react-redux";
import { withRouter } from 'react-router-dom';
import { Column, InfiniteLoader, SortDirection, SortIndicator, Table, CellMeasurerCache, CellMeasurer } from "react-virtualized";
import AutoSizer from "react-virtualized/dist/commonjs/AutoSizer";
import { bindActionCreators } from 'redux';
import { chipArrayCellRenderer, wrapTextCellRenderer } from 'TableHelper/cellRenderer';
import { calculateAgoTimeByLongFormat } from 'utils/dateFormat';
import { fetchServiceIconPath } from 'utils/serviceIcon';
import Switch from '@material-ui/core/Switch';
import ConfirmDialogBoxHOC from 'hoc/DialogBox'

import AddNoteDialogBox from './AddNoteDialogBox'

const PriorityColorClass = { CRITICAL: 'text-danger', HIGH: 'text-orange', MEDIUM: 'text-warning', LOW: 'text-success', SUPPESSED: 'text-gray', WARNING: 'text-warning' }

class InvestigateAlertList extends PureComponent {

    _mounted = false

    _cache = new CellMeasurerCache({
        fixedWidth: true,
        minHeight: 60
    });

    state = {

        // Table attribute
        headerHeight: 40,
        rowHeight: 25,
        rowCount: 0,
        height: 450,
        sortBy: "create_timestmp",
        sortDirection: SortDirection.ASC,
        search: '',

        count: 10,
        dataList: [],

        pageNo: 0,
        isMoreData: true,
        perPage: 10,
        filterProgress: true,

        anchorEl: null,
        open: false,
        placement: null,
        popperEl: null,
        openPopOver: false,
        checked: [0],
        selectedRegionFilter: '',
        selectedPriorityFilter: '',
        selectedAlertIds: [],
        isMoreRecord: true,

        priorityFilterList: [
            { field: 'priority', name: 'CRITICAL', value: 'CRITICAL' },
            { field: 'priority', name: 'HIGH', value: 'HIGH' },
            { field: 'priority', name: 'MID', value: 'MID' },
            { field: 'priority', name: 'LOW', value: 'LOW' },
            { field: 'priority', name: 'SURPRESSED', value: 'SURPRESSED' }
        ],
        complianceFilterList: [{ name: 'PCI', value: 'PCI' }, { name: 'CIS', value: 'CIS' }, { name: 'HIPAA', value: 'HIPAA' }],
        regionFilterList: [
            { field: 'region', name: 'us-east-1', value: 'us-east-1' },
            { field: 'region', name: 'us-east-2', value: 'us-east-2' },
            { field: 'region', name: 'us-west-1', value: 'us-west-1' },
            { field: 'region', name: 'us-west-2', value: 'us-west-2' },
            { field: 'region', name: 'ca-central-1', value: 'ca-central-1' },
            { field: 'region', name: 'eu-central-1', value: 'eu-central-1' },
            { field: 'region', name: 'eu-west-1', value: 'eu-west-1' },
            { field: 'region', name: 'eu-west-2', value: 'eu-west-2' },
            { field: 'region', name: 'eu-west-3', value: 'eu-west-3' },
            { field: 'region', name: 'eu-north-1', value: 'eu-north-1' },
            { field: 'region', name: 'ap-northeast-1', value: 'ap-northeast-1' },
            { field: 'region', name: 'ap-northeast-2', value: 'ap-northeast-2' },
            { field: 'region', name: 'ap-northeast-3', value: 'ap-northeast-3' },
            { field: 'region', name: 'ap-southeast-1', value: 'ap-southeast-1' },
            { field: 'region', name: 'ap-southeast-2', value: 'ap-southeast-2' },
            { field: 'region', name: 'ap-south-1', value: 'ap-south-1' },
            { field: 'region', name: 'sa-east-1', value: 'sa-east-1' },
        ],
        filterList: [],
        searchKeywords: { alertId: '' },
        selectedItems: { alertId: [] },

        openStatusDialog: false,
        currentStatus: true,
        alertId: '',
        isProgress: false,
        openNoteDialog:false,
        selectedAlert: undefined,
        isEnableNote: false,
        selectedRowIndex: 0
    };

    currentValue = this.props.filterData

    fetchAlerts = debounce(this.fetchAlerts, 1000);

    componentDidMount() {
        this._mounted = true
        const filterData = this.props.filterData
        if (filterData.selectAccount.id !== 'all' && filterData.selectAccount.id !== undefined) {
            this._mounted = false
            this.fetchAlerts(filterData)
        } else {
            this.setState({ filterProgress: false })
        }
        this.unsubscribe = store.subscribe(this.receiveFilterData)
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
                this.setState({ dataList: [], pageNo: 0, filterProgress: true }, () => {
                    this.fetchAlerts(filterData)
                })
            }
        }
    }


    fetchAlerts(filterData) {
        let priorityFilter = ''
        if (this.props.priorityTitle !== ''){
            priorityFilter = this.props.priorityTitle.toLowerCase()
        } else {
            priorityFilter = this.state.selectedPriorityFilter
        }
        let payload = { accountId: filterData.selectAccount.id, sort_by: this.state.sortBy, sort_order: this.state.sortDirection, limit: this.state.perPage, offset: this.state.pageNo, priority: priorityFilter, region: this.state.selectedRegionFilter }
        payload['status'] = 'OPEN'
        if (this.props.rule_id !== null) {
            payload['rule_id'] = this.props.rule_id
          }
          if (this.props.asset_id !== null) {
            payload['asset_type'] = this.props.asset_type
          }
        this.props.actions.fetchAlerts(payload).
            then(result => {
                this._mounted = true
                if (typeof result !== 'string') {
                    let resultList = []
                    if (this.props.search !== '') {
                        result.map(alert => {
                            if (JSON.stringify(alert).toLowerCase().indexOf(this.props.search.toLowerCase()) !== -1) {
                                resultList.push(alert)
                            }
                        })
                    } else {
                        resultList = result
                    }
                    this.setState({ dataList: this.state.dataList.concat(resultList), loading: false, filterProgress: false, isMoreRecord: result.length >= this.state.perPage, selectedAlertIds: this.props.alerts_plan })
                } else {
                    console.log(' Error in fetching alerts :- ', result);
                    this.setState({ loading: false, filterProgress: false })
                }
            });
    }

    SuppressAlerts(type, data) {
        if (type === 'suppress') {
            this.props.actions.suppressAlert(data).
                then(result => {
                    if (this._mounted) {
                        if (result && (typeof result === 'string')) {
                            this.setState((pre) => ({ isEnableNote:!pre.isEnableNote }))
                            let message = { message: result, showSnackbarState: true, variant: 'error' }
                            this.props.showMessage(message)
                        } else {
                            mixpanel.track("Suppress", {
                                "Item Type": "Alert",
                                "Name of Item": data.id,
                            });
                        }
                    }
                })
        } else if (type === 'unsuppress') {
            this.props.actions.unSuppressAlert(data).
                then(result => {
                    if (this._mounted) {
                        if (result && (typeof result === 'string')) {
                            this.setState((pre) => ({ isEnableNote:!pre.isEnableNote }))
                            let message = { message: result, showSnackbarState: true, variant: 'error' }
                            this.props.showMessage(message)
                        }
                    }
                })
        }
    }

    //   --------------------Table helper method Start-----------------------

    _isRowLoaded = ({ index }) => {
        return !!this.state.dataList[index];
    }

    _loadMoreRows = ({ startIndex, stopIndex }) => {
        if (this.state.isMoreRecord) {
            console.log(" load more ....", startIndex, stopIndex);
            let pageNo = Math.floor((startIndex) / this.state.perPage)
            if ((pageNo + this.state.perPage) !== this.state.pageNo) {
                this.setState({ pageNo: this.state.pageNo + this.state.perPage, filterProgress: true }, () => {
                    const filterData = this.props.filterData
                    this.fetchAlerts(filterData)
                });
            }
        }
    }


    sort = ({ sortBy, sortDirection }) => {
        if (sortBy !== 'region' && sortBy !== 'priority') {
            this.setState({ sortBy, sortDirection, filterProgress: true, dataList: [], pageNo: 0 }, () => {
                const filterData = this.props.filterData
                this.fetchAlerts(filterData)
            });
        }
    }

    anchorCellRenderer = ({ rowData, cellData }) => {
        return (
            <div>
                <a href="javascript:void(0)">{cellData}</a>
            </div>
        );
    };

    alertIdAnchorCellRenderer = ({...params}) => {
        const alertId = params.rowData.asset.asset_type.cloud + '-' + params.rowData.asset.asset_type.cloud_service_name + '-' + params.rowData.id.substring(0, 6)
        let component = (
            <div>
                <a onClick={() => history.push({pathname: '/app/alerts/detail/'+params.rowData.id, state: { alert: params.rowData }})} href="javascript:void(0)">{alertId.toUpperCase()}</a>
            </div>
        );

        params['component'] = component
        return this.wrapComponentCellRenderer(params)
    };

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

    priorityCellRenderer = ({...params}) => {
        const priority = params.rowData.rule.priority ? params.rowData.rule.priority.name : ''
        let component = (
            <div>
                {priority !== undefined && <span className={PriorityColorClass[priority.toUpperCase()] + ' mrR5'}><i className="fa fa-circle"></i></span>}
                {priority}
            </div>
        )

        params['component'] = component
        return this.wrapComponentCellRenderer(params)
    }

    complianceRenderer = ({ cellData }) => {
        return (
            <div>
                {cellData.map((item, index) => {
                    return (<div className="padding-tag"><span key={item + '- ' + index} className="chip-white mrR5">{item}</span></div>)
                })}
                {/*cellData.length > 2 && <span className="link-hrf">+{cellData.length - 2}</span>*/}
            </div>
        )
    }

    suppressCellRenderer = ({ cellData, rowIndex }) => {
        return (
            <Switch
                checked={cellData === false}
                onChange={() => this.statusChangeDialog(cellData, rowIndex)}
                value={cellData+''}
                className={cellData === false ? "select-control-green active" : "select-control-red"}
            />
        )
    }

    exposureTimeCellRenderer = ({...params}) => {
        let component = (
            <div>
                {calculateAgoTimeByLongFormat(params.rowData.asset.first_seen)}
            </div>
        )
        params['component'] = component
        return this.wrapComponentCellRenderer(params)
    }

    regionRenderer = ({...params}) => {
        const region = params.rowData.asset.data.region ? params.rowData.asset.data.region : 'N/A'
        let component = (
            <div>
                {region.toUpperCase()}
            </div>
        )

        params['component'] = component
        return this.wrapComponentCellRenderer(params)
    }

    validateCellData = ({...params}) => {
        let cellData = params.cellData
        if (cellData === undefined || cellData === null || cellData === '' || cellData.length === 0) {
            cellData = 'N/A'
        } 
        params['component'] = cellData
        return this.wrapComponentCellRenderer(params)
    }

    assetNameCellRenderer = ({...params}) => {
        const assetName = params.cellData.asset_type.cloud_service_name
        let component = (
            <div className="service-icon" title={assetName}>
                {assetName !== undefined && <img src={fetchServiceIconPath(assetName)}/>} {params.cellData.data[params.cellData.asset_type.discriminator[0]]}
            </div>
        );

        params['component'] = component
        return this.wrapComponentCellRenderer(params)
    }

    ruleCellRenderer = ({...params}) => {
        let component = (
            <div>
                <a href="javascript:void(0)" onClick={() => this.redirectToRulePage(params.rowData)}>{params.rowData.rule.label}</a>
            </div>
        );

        params['component'] = component
        return this.wrapComponentCellRenderer(params)
    }

    redirectToRulePage = (rowData) => {
        let assetName = (rowData.asset.asset_type.name).split('_')[0]
        this.props.setActiveMenu('Security Rules')
        this.props.setActiveParentMenu('Governance')
        history.push({pathname: '/app/rules/detail/', state: { rule: rowData.rule, asset_type: assetName, backUrl: '/app/alerts' }})
    }


    addToPlanChangeHandler = (alertId, isChecked) => {
        const selectedAlertIds = cloneDeep(this.state.selectedAlertIds)
        if (isChecked) {
            const newAlertIds = pull(selectedAlertIds, alertId)
            this.setState({ selectedAlertIds: newAlertIds }, () => {
                this.props.updateAlertId(this.state.selectedAlertIds)
            })
        } else {
            selectedAlertIds.push(alertId)
            this.setState({ selectedAlertIds: selectedAlertIds }, () => {
                this.props.updateAlertId(this.state.selectedAlertIds)
            })
        }
    };

    addToPlanCellRenderer = ({ rowData }) => {
        const isChecked = this.state.selectedAlertIds.indexOf(rowData.id) > -1;
        return (
                (!rowData.remediation_plan_id || rowData.remediation_plan_id==='') ? <Checkbox
                    tabIndex={-1}
                    onChange={() => this.addToPlanChangeHandler(rowData.id, isChecked)}
                    checked={isChecked}
                    disableRipple
                    className="filter-checkbox"
                    color="primary"
                /> : <Checkbox
                        tabIndex={-1}
                        checked={true}
                        disabled={true}
                        disableRipple
                        className="filter-checkbox green-checkbox"
                    />
            )
    }

    notesCellRenderer=({cellData, rowData, rowIndex})=>{
        return (
            <a onClick={() => this.handleNoteDialogOpen(rowData, rowIndex)} className="add-icon" href="javascript:void(0)">
                {cellData.length > 0 ? <NoteIcon/> : <AddIcon/> } 
            </a>
        )
    }

    handleClick = (placement, dataKey) => (event) => {
        const { currentTarget } = event;

        if (dataKey === 'priority') {
            this.setState(state => ({
                popperEl: currentTarget,
                openPopOver: state.placement !== placement || !state.openPopOver,
                placement,
                filterList: state.priorityFilterList
            }));
            /*} else if (dataKey === 'compliance_tags') {
                this.setState(state => ({
                    popperEl: currentTarget,
                    openPopOver: state.placement !== placement || !state.openPopOver,
                    placement,
                    filterList: state.complianceFilterList
                })); */
        } else if (dataKey === 'region') {
            this.setState(state => ({
                popperEl: currentTarget,
                openPopOver: state.placement !== placement || !state.openPopOver,
                placement,
                filterList: state.regionFilterList
            }));
        } else {
            this.setState(state => ({
                popperEl: null,
                openPopOver: false,
                placement: null,
                filterList: []
            }));
        }

    };

    updateHeaderFilter = (filterValue, dataKey) => {
        const value = filterValue.toLowerCase()
        let selectedFilter = null
        if (dataKey === 'priority') {
            selectedFilter = this.state.selectedPriorityFilter
        } else {
            selectedFilter = this.state.selectedRegionFilter
        }

        const isChecked = (selectedFilter === value)
        let newFilter = ''
        if (!isChecked) {
            newFilter = value
        }

        if (dataKey === 'priority') {
            this.props.resetPriority()
            this.setState({ selectedPriorityFilter: newFilter, dataList: [], pageNo: 0, filterProgress: true, openPopOver: false }, () => {
                const filterData = this.props.filterData
                this.fetchAlerts(filterData)
            })
        } else {
            this.setState({ selectedRegionFilter: newFilter, dataList: [], pageNo: 0, filterProgress: true, openPopOver: false }, () => {
                const filterData = this.props.filterData
                this.fetchAlerts(filterData)
            })
        }
    }

    headerRenderer = ({ dataKey, label, sortBy, sortDirection }) => {

        let selectedFilter = []
        if (dataKey === 'priority') {
            selectedFilter = this.state.selectedPriorityFilter
        } else {
            selectedFilter = this.state.selectedRegionFilter
        }

        const { popperEl, openPopOver, placement, filterList } = this.state;
        return (
            <div className="table-td" key={dataKey}>
                <span onClick={this.handleClick('bottom-start', dataKey)}>  {label}
                    {sortBy === dataKey && <SortIndicator sortDirection={sortDirection} />}
                    {(dataKey === 'priority' || dataKey === 'region') && <i className="fa fa-filter mrL5" aria-hidden="true"></i>}
                </span>


                {(dataKey === 'priority' || dataKey === 'region') && <Popper key={dataKey} style={{ zIndex: '10', marginTop: '10px' }} open={openPopOver} anchorEl={popperEl} placement={placement} transition>
                    {({ TransitionProps }) => (
                        <Fade {...TransitionProps} timeout={0}>
                            <div>
                                <List className="list-filter">
                                    <ListItem className="list-search-filter">
                                        <input placeholder="Search" autoFocus type="text" />
                                    </ListItem>
                                    {filterList.map(item => (
                                        <ListItem className="list-filter-item" key={item.value} role={undefined} dense button>
                                            <Checkbox
                                                tabIndex={-1}
                                                onChange={() => this.updateHeaderFilter(item.value, item.field)}
                                                checked={this.state.selectedPriorityFilter === item.value.toLowerCase() || this.state.selectedRegionFilter === item.value.toLowerCase()}
                                                disableRipple
                                                className="filter-checkbox"
                                                color="primary"
                                            />
                                            <ListItemText className="list-filter-text" primary={item.value} />

                                        </ListItem>
                                    ))}
                                </List>
                            </div>
                        </Fade>
                    )}
                </Popper>}
            </div>
        );
    }

    searchHandler = name => event => {
        this.setState({ search: event.target.value, filterProgress: true }, () => {
            const filterData = this.props.filterData
            this.fetchAlerts(filterData)
        })
    }

    handleDialogClose = () => {
        this.setState((pre) => ({ isEnableNote:!pre.isEnableNote, openStatusDialog: false }))
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
                this.SuppressAlerts(type, { id: row.id, cloud_account_id: this.props.filterData.selectAccount.id })
                this.setState({selectedAlert: { ...row, suppressed: !currentStatus }});
                return { ...row, suppress: !currentStatus, suppressed: !currentStatus };
            }
        });
        this.setState({ dataList: newDataList, openStatusDialog: false }, () => {
        });
    }

    suppressAlert = () => {
        this.props.actions.suppressAlert(this.props.filterData.selectAccount.id, this.state.alertId).
            then(result => {
                if (typeof result !== 'string') {

                } else {
                    console.log(' Error in fetching alerts :- ', result);
                    this.setState({ loading: false, filterProgress: false })
                }
                this.computeNewDataLIst()
            });
    }

    unSuppressAlert = () => {
        this.props.actions.unSuppressAlert(this.props.filterData.selectAccount.id, this.state.alertId).
            then(result => {
                if (typeof result !== 'string') {

                } else {
                    console.log(' Error in fetching alerts :- ', result);
                    this.setState({ loading: false, filterProgress: false })
                }
                this.computeNewDataLIst()
            });
    }


    computeNewDataLIst = () => {

        const dataList = cloneDeep(this.state.dataList)
        console.log('alertId', this.state.alertId)
        let newDataList = dataList.map((row, sidx) => {
            if (this.state.alertId !== row.id) {
                return row;
            } else {
                this.setState({selectedAlert: { ...row, suppressed: !this.state.currentStatus }});
                return { ...row, suppressed: !this.state.currentStatus };
            }
        });
        this.setState({ dataList: newDataList, openStatusDialog: false, isProgress: false }, () => {
        });
    }

    //   --------------------Table helper method End-----------------------

    wrapComponentCellRenderer = (params) => {
        return (
            <CellMeasurer
              cache={this._cache}
              columnIndex={params.columnIndex}
              key={params.dataKey}
              parent={params.parent}
              rowIndex={params.rowIndex}>
              <div
                className={"tableColumn"}
                style={{
                    whiteSpace: 'normal'
                }}>
                {params.component}
              </div>
            </CellMeasurer>
          );
    }

    handleNoteDialogOpen = (alert, rowIndex) => {
        this.setState({
            isEnableNote: alert.suppressed ? alert.suppressed : false,
            selectedRowIndex: rowIndex,
            selectedAlert: alert,
            openNoteDialog: true,
        });
      };

    addComment = (alert, comment) => {
        const profile = JSON.parse(store.getState().userReducer.profile);
        const data = {
            "email": profile.email,
            "timestamp": Date.now(),
            "comment": comment
          }
        this.props.actions.addCommentAlert(this.props.filterData.selectAccount.id, alert, data).
            then(result => {
                if (typeof result !== 'string') {
                    this.setState({ openNoteDialog: false }, () => {
                        let message = { message: 'Saved Note', showSnackbarState: true, variant: 'success' }
                        this.props.showMessage(message)
                        let alternativeDataList = cloneDeep(this.state.dataList)
                        alternativeDataList[this.state.selectedRowIndex].comments.push(data)
                        this.setState({dataList: alternativeDataList})
                    });
                } else {
                    console.log(' Error in fetching alerts :- ', result);
                    this.setState({ openNoteDialog: false }, () => {
                        let message = { message: result, showSnackbarState: true, variant: 'error' }
                        this.props.showMessage(message)
                    });
                }
            });
        //this.setState({ openNoteDialog: false });
    };

    enableDisableNote=()=>{
        this.setState((pre) => ({ isEnableNote:!pre.isEnableNote }), () => {
            this.statusChangeDialog(this.state.selectedAlert.suppressed, this.state.selectedRowIndex)
        })
    }
    
    handleNoteDialogClose = () => {
        this.setState({ openNoteDialog: false });
    };

    render() {
        const {
            headerHeight,
            sortBy,
            sortDirection,
            dataList,
            openStatusDialog,
            currentStatus,
            isProgress,
            openNoteDialog,
            selectedAlert,
            isEnableNote
        } = this.state;

        const { alertCount } = this.props
        const sortedList = dataList;
        return (
            <Fragment>
                {/* <Grid container spacing={24}>
                <Grid item sm={12} className="pdT0">
                    <div className="d-flex justify-flex-end">
                        <SearchField handleChange={this.searchHandler} />
                    </div>
                </Grid>
            </Grid> */}
                <Grid container spacing={24} className="grid-container">
                    <Grid item xs={12} sm={12}>
                    <div className="table-container" style={{ height: "100%", maxHeight: "100%" }}>
                            <AutoSizer>
                                {({ height, width }) => (
                                    <InfiniteLoader
                                        isRowLoaded={this._isRowLoaded}
                                        loadMoreRows={this._loadMoreRows}
                                        rowCount={alertCount}
                                        height={height}
                                        threshold={10}
                                    >
                                        {({ onRowsRendered, registerChild }) => (
                                            <Table
                                                headerHeight={headerHeight}
                                                height={height}
                                                rowCount={dataList.length}
                                                rowGetter={({ index }) => sortedList[index]}
                                                rowHeight={this._cache.rowHeight}
                                                sort={this.sort}
                                                sortBy={sortBy}
                                                sortDirection={sortDirection}
                                                onRowsRendered={onRowsRendered}
                                                noRowsRenderer={this.noRowsRenderer}
                                                width={width}
                                                className="data-table table-no-border"
                                            >

                                                <Column
                                                    dataKey="id"
                                                    label="Alert ID"
                                                    headerRenderer={this.headerRenderer}
                                                    cellRenderer={this.alertIdAnchorCellRenderer}
                                                    disableSort={false}
                                                    width={150}
                                                    flexGrow={1}
                                                />

                                                <Column
                                                    dataKey="priority"
                                                    label="Priority"
                                                    headerRenderer={this.headerRenderer}
                                                    cellRenderer={this.priorityCellRenderer}
                                                    disableSort={false}
                                                    width={100}
                                                    flexGrow={2}

                                                />

                                                <Column
                                                    dataKey="summary"
                                                    label="Alert Description"
                                                    headerRenderer={this.headerRenderer}
                                                    cellRenderer={this.validateCellData}
                                                    disableSort={false}
                                                    width={300}
                                                    flexGrow={3}
                                                />

                                                <Column
                                                    dataKey="first_seen"
                                                    label="Exposure Time"
                                                    headerRenderer={this.headerRenderer}
                                                    cellRenderer={this.exposureTimeCellRenderer}
                                                    disableSort={false}
                                                    width={80}
                                                    flexGrow={4}
                                                />

                                                <Column
                                                    dataKey="asset"
                                                    label=" Asset"
                                                    headerRenderer={this.headerRenderer}
                                                    cellRenderer={this.assetNameCellRenderer}
                                                    disableSort={false}
                                                    width={200}
                                                    flexGrow={5}
                                                />

                                                <Column
                                                    dataKey="region"
                                                    label="Region"
                                                    headerRenderer={this.headerRenderer}
                                                    cellRenderer={this.regionRenderer}
                                                    disableSort={false}
                                                    width={100}
                                                    flexGrow={6}
                                                />

                                                <Column
                                                    dataKey="rule"
                                                    label="Rule"
                                                    headerRenderer={this.headerRenderer}
                                                    cellRenderer={this.ruleCellRenderer}
                                                    disableSort={false}
                                                    width={100}
                                                    flexGrow={7}
                                                />

                                                <Column
                                                    dataKey="suppressed"
                                                    label="Active"
                                                    headerRenderer={this.headerRenderer}
                                                    cellRenderer={this.suppressCellRenderer}
                                                    disableSort={false}
                                                    width={100}
                                                    flexGrow={8}
                                                />

                                                <Column
                                                    dataKey="addToPlan"
                                                    label="Add to Plan"
                                                    headerRenderer={this.headerRenderer}
                                                    cellRenderer={this.addToPlanCellRenderer}
                                                    disableSort={false}
                                                    width={80}
                                                    flexGrow={9}
                                                    className="justify-content-center"
                                                />
                                                 <Column
                                                    dataKey="comments"
                                                    label="Notes"
                                                    headerRenderer={this.headerRenderer}
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
                        </div>
                    </Grid>
                </Grid>
                <ConfirmDialogBoxHOC
                    isOpen={openStatusDialog}
                    handleDialogClose={this.handleDialogClose}
                    title={'Confirmation'}
                    cancelBtnLabel={"CANCEL"}
                    confirmBtnLabel={currentStatus === true ? "ACTIVE" : "SUPPRESS"}
                    content={(currentStatus === true) ? 'Are you sure you want to Active this Alert ?' : 'Are you sure you want to Suppress this Alert ?'}
                    successDialogEvent={this.enableDisableSuppress} />

                    <AddNoteDialogBox isOpen={openNoteDialog} alert={selectedAlert} isEnableNote={isEnableNote}
                    enableDisableNote={this.enableDisableNote}
                    addComment={this.addComment}
                    handleNoteDialogClose={this.handleNoteDialogClose}
                    />

            </Fragment>
        );
    }
}


const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators(Object.assign({}, alertsActions), dispatch),
        showMessage: message => {
            dispatch(showMessage(message))
        }, setProgressBar: isProgress => {
            dispatch(setProgressBar(isProgress))
        }, setActiveMenu: activeMenu => {
            dispatch(setActiveMenu(activeMenu))
        }, setActiveParentMenu: activeMenu => {
            dispatch(setActiveParentMenu(activeMenu))
        }, setAlertsPlan: alerts_plan => {
            dispatch(setAlertsPlan(alerts_plan))
        }
    };
}

const mapStateToProps = (state, ownProps) => ({
    filterData: state.uiReducer.filterData,
    isProgress: state.commonReducer.isProgress,
    alerts_plan: state.commonReducer.alerts_plan
})


export default withRouter(connect(mapStateToProps, mapDispatchToProps)(InvestigateAlertList))