import { Checkbox, List, ListItem, ListItemText } from '@material-ui/core';
import Fade from '@material-ui/core/Fade';
import Popper from '@material-ui/core/Popper';
import Switch from '@material-ui/core/Switch';
import * as assetsActions from 'actions/assetsAction';
import { setProgressBar, setCountAssets } from 'actions/commonAction';
import { showMessage } from 'actions/messageAction';
import { store } from 'client';
import SnackbarMessage from 'global/SnackbarMessage';
import Loader from 'global/Loader';
import ConfirmDialogBoxHOC from 'hoc/DialogBox';
import { cloneDeep } from "lodash";
import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { withRouter } from 'react-router-dom';
import { Column, InfiniteLoader, SortDirection, Table, CellMeasurerCache, CellMeasurer } from "react-virtualized";
import AutoSizer from "react-virtualized/dist/commonjs/AutoSizer";
import { bindActionCreators } from 'redux';
import LabelWithHelper from 'hoc/Label/LabelWithHelper';
import history from 'customHistory'

class ClusterSnapshotAssetList extends PureComponent {

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
        sortBy: "service",
        sortDirection: SortDirection.ASC,
        fieldFilter: [],
        count: 10,
        dataList: [],
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
        checked: [],
        // Used for header filter list
        enableDisableFilterList: [{ name: 'Enabled', value: 'enabled' }, { name: 'Disabled', value: 'disabled' }],
        yesNoFilterList: [{ name: 'Yes', value: 'yes' }, { name: 'No', value: 'no' }],
        publicFilterList: [
            { field: 'is_public', name: 'Yes', value: 'yes' },
            { field: 'is_public', name: 'No', value: 'no' },
            { field: 'is_public', name: 'Undefined', value: 'undefined' }
        ],
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
            { field: 'region', name: 'sa-east-1', value: 'sa-east-1' }],
        tagFilterList: [],
        ownerFilterList: [],
        bucketFilterList: [],
        filterList: [],
        searchKeywords: { alertId: '' },
        selectedItems: { alertId: [] },
        mfaDeleteFilter: [],
        loggingFilter: [],
        publicFilter: [],
        openStatusDialog: false,
        currentStatus: true,
        rowIndex: 0,
        selectedASsetIds: [],
        isMoreRecord: true,
        showSnackbarState: false,
        message: '',
        variant: 'info',
    };

    currentValue = this.props.filterData

    componentDidMount() {
        this._mounted = true
        const filterData = this.props.filterData
        if (filterData.selectAccount.id !== 'all' && filterData.selectAccount.id !== undefined) {
            this._mounted = false
            this.fetchAssets(filterData)
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
                this.setState({dataList: []}, () => {
                    this.fetchAssets(filterData)
                })
            }
        }
    }

    //   --------------------Table helper method Start-----------------------

    _isRowLoaded = ({ index }) => {
        return !!this.state.dataList[index];
    }

    fetchAssets(filterData) {
        let assetType = null
        this.props.actions.fetchAssetTypes().
            then(result => {
                if (typeof result !== 'string') {
                    result.forEach(function (type) {
                        if (type.name === 'rds_cluster_snapshot') {
                            assetType = type.id
                        }
                    });

                    if (assetType) {
                        let payload = { accountId: filterData.selectAccount.id, sort_by: this.state.sortBy, sort_order: this.state.sortDirection, asset_type: assetType, limit: this.state.perPage, offset: this.state.pageNo }
                        if (this.state.checked.length > 0) {
                            this.state.checked.forEach(function (check) {
                                let values = check.split('%')
                                payload[values[0]] = values[1]
                            })
                        }

                        this.props.actions.fetchAssets(payload).
                            then(result => {
                                if (typeof result !== 'string') {
                                    let results = []
                                    let totalAuthtenticationAssets = 0
                                    let totalEncryptedAssets = 0
                                    let totalPublicAssets = 0
                                    result.forEach(function (item) {
                                        Object.keys(item.data).forEach(function (key) {
                                            if (key !== 'id') {
                                                item[key] = item.data[key]
                                            } else {
                                                item['identifier'] = item.data[key]
                                            }
                                        })
                                        if (item.iam_database_authentication_enabled === false) {
                                            totalAuthtenticationAssets++;
                                        }
                                        if (item.encrypted === false) {
                                            totalEncryptedAssets++;
                                        }
                                        if (item.public === true) {
                                            totalPublicAssets++;
                                        }
                                        results.push(item)
                                    })
                                    this.setState({ dataList: this.state.dataList.concat(results), loading: false, filterProgress: false, isMoreRecord: result.length >= this.state.perPage })
                                    this.props.setCountAssets({
                                        totalAssets: this.state.dataList.length,
                                        totalAuthtenticationAssets: totalAuthtenticationAssets,
                                        totalEncryptedAssets: totalEncryptedAssets,
                                        totalPublicAssets: totalPublicAssets
                                    })
                                } else {
                                    console.log(' Error in fetching alerts :- ', result);
                                    this.setState({ loading: false, filterProgress: false })
                                }
                            });
                    }
                } else {
                    console.log(' Error in fetching alerts :- ', result);
                    this.setState({ loading: false, filterProgress: false })
                }
            });
    }


    SuppressAssets(type, data, name) {
        if (type === 'suppress') {
            this.props.actions.suppressAssets(data).
                then(result => {
                    if (this._mounted) {
                        if (result && (typeof result === 'string')) {
                            let message = { message: result, showSnackbarState: true, variant: 'error' }
                            this.props.showMessage(message)
                        } else {
                            mixpanel.track("Suppress", {
                                "Item Type": "Asset",
                                "Name of Item": name,
                            });
                        }
                    }
                })
        } else if (type === 'unsuppress') {
            this.props.actions.unsuppressAssets(data).
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

    SetScoreAssets(data) {
        this.props.actions.setScoreAssets(data).
            then(result => {
                if (this._mounted) {
                    if (result && !(typeof result === 'string')) {
                        let message = { message: result, showSnackbarState: true, variant: 'error' }
                        this.props.showMessage(message)
                    }
                }
            })
    }

    SetMaxScoreAssets(data) {
        this.props.actions.setMaxScoreAssets(data).
            then(result => {
                if (this._mounted) {
                    if (result && !(typeof result === 'string')) {
                        this.props.actions.setScoreAssets(data).
                            then(result => {
                                if (this._mounted) {
                                    if (result && (typeof result === 'string')) {
                                        let message = { message: result, showSnackbarState: true, variant: 'error' }
                                        this.props.showMessage(message)
                                    }
                                }
                            })
                    } else {
                        let message = { message: result, showSnackbarState: true, variant: 'error' }
                        this.props.showMessage(message)
                    }
                }
            })
    }

    fetchAssetsExcludedList() {
        let payload = {}

        this.props.actions.fetchAssetsExcludedList(payload).
            then(result => {
                if (typeof result !== 'string') {

                } else {
                    console.log(' Error in fetching AssetsExcludedList :- ', result);
                }
            });
    }

    _loadMoreRows = ({ startIndex, stopIndex }) => {
        if (this.state.isMoreRecord) {
            console.log(" load more ....", startIndex, stopIndex);
            let pageNo = Math.floor((startIndex) / this.state.perPage)
            if ((pageNo + 1) !== this.state.pageNo) {
                this.setState({ pageNo: this.state.pageNo + this.state.perPage, filterProgress: true }, () => {
                    const filterData = this.props.filterData
                    this.fetchAssets(filterData)
                });
            }
        }
    }


    sort = ({ sortBy, sortDirection }) => {
        if (sortBy === 'score' || sortBy === 'cluster_identifier') {
            this.setState({ sortBy, sortDirection, filterProgress: true, dataList: [], pageNo: 0, isMoreRecord: true }, () => {
                const filterData = this.props.filterData
                this.fetchAssets(filterData)
            });
        }
    }

    anchorCellRenderer = ({...params}) => {
        let component = (
            <div>
                <a  onClick={() => history.push({pathname: '/app/assets/detail/' + params.rowData.id, state: {backUrl: '/app/assets-storage', backUrlState: {value: this.props.value}}})} href="javascript:void(0)">{params.cellData}</a>
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

    priorityCellRenderer = () => {
        return (
            <div>
                <span className="text-danger mrR5"><i className="fa fa-circle"></i></span>
                Critical
            </div>
        )
    }

    policyNameRenderer = () => {
        return (
            <div>
                <span className="chip-white mrR5">abcd</span>
                <span className="chip-white">p123</span>
            </div>
        )
    }

    enabledDisabledCellRenderer = ({...params}) => {
        let cellData = params.cellData
        let component = null
        if (!cellData) {
            component = (<div>
                <span>
                    Disabled <span className="text-danger"><i className="fa fa-times-circle fnt-16" aria-hidden="true"></i></span>
                </span>
            </div>)
        } else {
            component = (<div>
                <span>
                    Enabled <span className="text-success"><i className="fa fa-check-circle fnt-16" aria-hidden="true"></i></span>
                </span>
            </div>)
        }
        params['component'] = component
        return this.wrapComponentCellRenderer(params)
    }

    assetWeightCellRenderer = ({ cellData, rowIndex }) => {
        return <span>{cellData}</span>
    }

    yesNoIconCellRenderer = ({ cellData }) => {
        if (cellData === undefined || cellData === null) {
            cellData = 'Undefined'
        } else if (cellData) {
            cellData = 'Yes'
        } else {
            cellData = 'No'
        }
        const chipClassName = cellData === 'Yes' ? 'chip-green' : 'chip-red'
        return (
            <div>
                <span className={"chip-sm " + chipClassName}>{cellData}</span>
            </div>
        )
    }

    publicPrivateCellRenderer = ({...params}) => {
        let cellData = params.cellData
        if (cellData === undefined || cellData === null) {
            cellData = 'N/A'
        } else if (cellData) {
            cellData = 'Yes'
        } else {
            cellData = 'No'
        }
        const chipClassName = cellData === 'No' ? 'chip-green' : 'chip-red'
        let component = (
            <div>
                <span className={"chip-sm " + chipClassName}>{cellData}</span>
            </div>
        )
        params['component'] = component
        return this.wrapComponentCellRenderer(params)
    }

    tagCellRenderer = ({...params}) => {
        let cellData = params.cellData
        if (cellData === undefined || cellData === null || cellData.length === 0) {
            cellData = [{key: 'no tags', value: 'no tags'}]
        } else {
            cellData = cellData
        }
        let component = (
            <div>
                {cellData.map((item, index) => {
                    return (<div className="padding-tag"><span key={item.key + '- ' + index} className="chip-white mrR5">{item.key === 'no tags' ? item.value : item.key + '=' + item.value}</span></div>)
                })}
                {/*cellData.length > 2 && <span className="link-hrf">+{cellData.length - 2}</span>*/}
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


    handleClose = () => {
        this.setState({ message: '', showSnackbarState: false })
    }

    handleAdjustWeight = (value, rowIndex) => {
        const dataList = cloneDeep(this.state.dataList)
        let newScore = 0
        let oldScore = 0
        let newDataList = dataList.map((row, sidx) => {
            if (rowIndex !== sidx) {
                return row;
            } else {
                newScore = row.score;
                oldScore = row.score;
                if (value === 'up') {
                    newScore++;
                } else if (value === 'down') {
                    newScore--;
                }
                if (row.max_score <= 0) {
                    this.SetMaxScoreAssets({ id: row.id, cloud_account_id: this.props.filterData.selectAccount.id, max_score: 4, score: newScore })
                } else {
                    this.SetScoreAssets({ id: row.id, cloud_account_id: this.props.filterData.selectAccount.id, score: newScore })
                }
                mixpanel.track("Adjust Weight", {
                    "Item Type": "Asset",
                    "Name of Item": row.data[row.asset_type.discriminator[0]],
                });
                return { ...row, score: newScore };
            }
        });
        this.setState({ dataList: newDataList }, () => {
            this.setState({ message: 'Asset weight changed from ' + oldScore + ' to ' + newScore + '.', showSnackbarState: true, variant: 'success' });
        });
    }

    adjustWeightCellRenderer = ({ cellData, rowIndex }) => {
        return (
            <div className="icon-box">
                <div className="icon-up-down">
                    {cellData < 4 ? <span onClick={() => this.handleAdjustWeight('up', rowIndex)}><i className="fa fa-caret-up" aria-hidden="true"></i> </span> : <span><i className="fa fa-caret-up" aria-hidden="true"></i> </span>}
                    {cellData > 0 ? <span onClick={() => this.handleAdjustWeight('down', rowIndex)}><i className="fa fa-caret-down" aria-hidden="true"></i> </span> : <span><i className="fa fa-caret-down" aria-hidden="true"></i> </span>}
                </div>

            </div>
        )
    }

    suppressCellRenderer = ({ cellData, rowIndex }) => {
        return (
            <Switch
                checked={cellData === true}
                onChange={() => this.statusChangeDialog(cellData, rowIndex)}
                value={cellData === true}
                className={cellData === true ? "select-control-red" : "select-control-green active"}
            />
        )
    }

    handleDialogClose = () => {
        this.setState({ openStatusDialog: false })
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
                this.SuppressAssets(type, { id: row.id, cloud_account_id: this.props.filterData.selectAccount.id }, row.data[row.asset_type.discriminator[0]])
                return { ...row, suppress: !currentStatus, suppressed: !currentStatus };
            }
        });
        this.setState({ dataList: newDataList, openStatusDialog: false }, () => {
        });
    }

    handleSwitchChange = name => event => {
        this.setState({ [name]: event.target.checked });
    }

    handleClick = (placement, dataKey) => (event) => {
        const { currentTarget } = event;
        if (dataKey === 'is_public') {
            this.setState(state => ({
                popperEl: currentTarget,
                openPopOver: state.placement !== placement || !state.openPopOver,
                placement,
                filterList: state.publicFilterList
            }));
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
            }));
        }
    };

    handleChange = value => event => {
        let newChecked = cloneDeep(this.state.checked)
        let position = newChecked.indexOf(value)
        let values = value.split("%")
        if (newChecked.length > 0) {
            if (position === -1) {
                newChecked.forEach(function (check, index) {
                    if (check.indexOf(values[0]) === -1) {
                        newChecked.push(value)
                    } else {
                        newChecked.splice(index, 1)
                    }
                })
            } else {
                newChecked.splice(position, 1)
            }
        } else {
            newChecked.push(value)
        }
        this.setState({ checked: newChecked, openPopOver: false, dataList: [], pageNo: 0, isMoreRecord: true }, () => {
            const filterData = this.props.filterData
            this.fetchAssets(filterData)
        });
    };

    headerRenderer = ({ dataKey, label, sortBy, sortDirection }) => {

        const { popperEl, openPopOver, placement, filterList } = this.state;
        let directionClass = 'fa fa-sort-desc'
        let caseRender = '';
        if (sortDirection === SortDirection.ASC) {
            directionClass = 'fa fa-sort-asc'
        }

        if (dataKey === 'cluster_identifier') {
            if (sortBy === dataKey) {
                caseRender = 'isCurrentSort'
            } else {
                caseRender = 'isSort'
            }
        } else if (dataKey === 'is_public' || dataKey === 'region') {
            caseRender = 'isFilter'
        }
        return (
            <div className="table-td">
                {caseRender === 'isSort' && <span>{label}  <i className="fa fa-sort " aria-hidden="true"></i> </span>}
                {caseRender === 'isCurrentSort' && <span>{label}  <i className={directionClass} aria-hidden="true"></i> </span>}
                {caseRender === 'isFilter' && <span onClick={this.handleClick('bottom-start', dataKey)}>{label}  <i className="fa fa-filter" aria-hidden="true"></i> </span>}
                {label === 'Adjust Weight' && dataKey === 'score' && <span className="d-flex align-item-center">{label} <LabelWithHelper isHelper={true} textColor={''} message={'Adjust Weight'} content={"Increase the weight of an Asset up to 4 points based on your organization's Security Appetite for this specific Asset."} /> </span>}
                {caseRender === '' && label !== 'Adjust Weight' && <span>{label}</span>}
                {caseRender === 'isFilter' && <Popper style={{ zIndex: '10', marginTop: '10px' }} open={openPopOver} anchorEl={popperEl} placement={placement} transition>
                    {({ TransitionProps }) => (
                        <Fade {...TransitionProps} timeout={350}>
                            <div>
                                <List className="list-filter">
                                    <ListItem className="list-search-filter">
                                        <input placeholder="Search" autoFocus type="text" />
                                    </ListItem>
                                    {filterList.map(item => (
                                        <ListItem className="list-filter-item" key={item.name} role={undefined} dense button>
                                            <Checkbox
                                                checked={this.state.checked.indexOf(item.field + '%' + item.value) !== -1}
                                                onChange={this.handleChange(item.field + '%' + item.value)}
                                                tabIndex={-1}
                                                disableRipple
                                                className="filter-checkbox"
                                                color="primary"
                                            />
                                            <ListItemText className="list-filter-text" primary={item.name} />

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

    render() {
        const {
            headerHeight,
            sortBy,
            sortDirection,
            dataList,
            openStatusDialog,
            currentStatus,
            showSnackbarState,
            message,
            variant
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
                                        dataKey="cluster_identifier"
                                        label="Identifier"
                                        headerRenderer={this.headerRenderer}
                                        cellRenderer={this.anchorCellRenderer}
                                        disableSort={false}
                                        width={300}
                                        flexGrow={1}
                                    />

                                    <Column
                                        dataKey="tags"
                                        label={<span>Tags <i className="fa fa-plus fnt-10 mrL5" aria-hidden="true"></i></span>}
                                        headerRenderer={this.headerRenderer}
                                        cellRenderer={this.tagCellRenderer}
                                        disableSort={false}
                                        width={200}
                                        flexGrow={2}

                                    />

                                    <Column
                                        dataKey="region"
                                        label="Region"
                                        headerRenderer={this.headerRenderer}
                                        cellRenderer={this.validateCellData}
                                        disableSort={false}
                                        width={120}
                                        flexGrow={4}
                                    />

                                    {/* <Column
                                        dataKey="iam_database_authentication_enabled"
                                        label="Iam DB Authentication Enabled"
                                        headerRenderer={this.headerRenderer}
                                        cellRenderer={this.validateCellData}
                                        disableSort={false}
                                        width={120}
                                        flexGrow={4}
                                    />

                                    <Column
                                        dataKey="is_public"
                                        label="Public"
                                        headerRenderer={this.headerRenderer}
                                        cellRenderer={this.validateCellData}
                                        disableSort={false}
                                        width={50}
                                        flexGrow={4}
                                    />

                                    <Column
                                        dataKey="storage_encrypted"
                                        label="Encrypted"
                                        headerRenderer={this.headerRenderer}
                                        cellRenderer={this.validateCellData}
                                        disableSort={false}
                                        width={50}
                                        flexGrow={4}
                                    />

                                    <Column
                                        dataKey="kms_key_id"
                                        label="Kms Key"
                                        headerRenderer={this.headerRenderer}
                                        cellRenderer={this.validateCellData}
                                        disableSort={false}
                                        width={50}
                                        flexGrow={4}
                                    /> */}

                                    <Column
                                        dataKey="score"
                                        label="Asset Weight"
                                        headerRenderer={this.headerRenderer}
                                        cellRenderer={this.assetWeightCellRenderer}
                                        disableSort={false}
                                        width={50}
                                        flexGrow={9}
                                    />
                                    <Column
                                        dataKey="score" // i need this, don't touch it
                                        label="Adjust Weight"
                                        headerRenderer={this.headerRenderer}
                                        cellRenderer={this.adjustWeightCellRenderer}
                                        disableSort={true}
                                        width={50}
                                        flexGrow={10}
                                    />
                                    <Column
                                        dataKey="suppressed"
                                        label="Active/ Suppressed"
                                        headerRenderer={this.headerRenderer}
                                        cellRenderer={this.suppressCellRenderer}
                                        disableSort={false}
                                        width={100}
                                        flexGrow={11}
                                    />

                                </Table>
                            )}
                        </InfiniteLoader>
                    )}
                </AutoSizer>
                <SnackbarMessage
                    open={showSnackbarState}
                    message={message}
                    variant={variant}
                    handleClose={this.handleClose}
                />

                <ConfirmDialogBoxHOC
                    isOpen={openStatusDialog}
                    handleDialogClose={this.handleDialogClose}
                    title={'Confirmation'}
                    cancelBtnLabel={"CANCEL"}
                    confirmBtnLabel={currentStatus === true ? "ACTIVE" : "SUPPRESS"}
                    content={currentStatus === true ? 'Are you sure you want to Active this Assets ?' : 'Are you sure you want to Suppress this Asset ?'}
                    successDialogEvent={this.enableDisableSuppress} />
            </div>
        );
    }
}


const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators(Object.assign({}, assetsActions), dispatch),
        showMessage: message => {
            dispatch(showMessage(message))
        }, setProgressBar: isProgress => {
            dispatch(setProgressBar(isProgress))
        }, setCountAssets: cloudAccounts => {
            dispatch(setCountAssets(cloudAccounts))
        }
    };
}

const mapStateToProps = (state, ownProps) => ({
    filterData: state.uiReducer.filterData,
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ClusterSnapshotAssetList))