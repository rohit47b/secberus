import React, { PureComponent, Fragment } from "react";
import Loader from 'global/Loader';
import { connect } from "react-redux";
import { withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { Column, InfiniteLoader, SortDirection, Table, CellMeasurerCache, CellMeasurer } from "react-virtualized";
import AutoSizer from "react-virtualized/dist/commonjs/AutoSizer";
import { Checkbox,Switch} from '@material-ui/core';
import { calculateAgoTimeByLongFormat } from 'utils/dateFormat';
import { fetchServiceIconPath } from 'utils/serviceIcon';
import ConfirmDialogBoxHOC from 'hoc/DialogBox'
import * as alertsActions from 'actions/alertsAction';
import { setProgressBar,setAlertsPlan } from 'actions/commonAction';
import { cloneDeep, debounce, pull } from "lodash";
import history from 'customHistory'

const PriorityColorClass = { CRITICAL: 'text-danger', HIGH: 'text-orange', MEDIUM: 'text-warning', LOW: 'text-success', SUPPESSED: 'text-gray', WARNING: 'text-warning' }

class SingleAlertList extends PureComponent {
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
        count: 10,
        dataList: [],
        loaded: false,
        rowIndex: 0,
        isEnable:false,
        openStatusDialog: false,
        currentStatus: true,
        selectedAlertIds: []
    };

    currentValue = this.props.filterData

    componentDidMount() {
        this.setState({isEnable: this.props.alert.suppressed, dataList: [this.props.alert], selectedAlertIds: this.props.alerts_plan});
    }

    getRows(num) {
        return [...Array(num).keys()].map(a => ({
            cloud_account: `AWS-Production01`,
            exposure_time: `Today,10:02 a.m.`,
            alert_desc: `Lorem ipsum is simply dummy`,
            asset_name: `ctBuckets0002`,
            region: `UKWest`
        }));
    }

    //   --------------------Table helper method Start-----------------------

    _isRowLoaded = ({ index }) => {
        return !!this.state.dataList[index];
    }

    _loadMoreRows = ({ startIndex, stopIndex }) => {
        console.log(" load more ....", startIndex, stopIndex);
        this.setState({ dataList: this.getRows(startIndex + 1) });
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

    handleDialogClose = () => {
        this.setState((pre) => ({ openStatusDialog: false }))
    }

    statusChangeDialog = () => {
        this.setState({ openStatusDialog: true, currentStatus: this.state.isEnable });
    }

    enableDisableSuppress = () => {
        const currentStatus = this.state.currentStatus;
        let type = 'suppress'
        if (currentStatus) {
            type = 'unsuppress'
        }
        this.SuppressAlerts(type, { id: this.props.alert.id, cloud_account_id: this.props.filterData.selectAccount.id })
        this.setState({ isEnable: !currentStatus, openStatusDialog: false });
    }

    SuppressAlerts(type, data) {
        if (type === 'suppress') {
            this.props.actions.suppressAlert(data).
                then(result => {
                    if (result && (typeof result === 'string')) {
                        let message = { message: result, showSnackbarState: true, variant: 'error' }
                        this.props.showMessage(message)
                    } else {
                        this.setState({ currentStatus: true })
                        mixpanel.track("Suppress", {
                            "Item Type": "Alert",
                            "Name of Item": data.id,
                        });
                    }
                })
        } else if (type === 'unsuppress') {
            this.props.actions.unSuppressAlert(data).
                then(result => {
                    if (result && (typeof result === 'string')) {
                        let message = { message: result, showSnackbarState: true, variant: 'error' }
                        this.props.showMessage(message)
                    } else {
                        this.setState({ currentStatus: false })
                        mixpanel.track("Unsuppress", {
                            "Item Type": "Alert",
                            "Name of Item": data.id,
                        });
                    }
                })
        }
    }

    priorityCellRenderer = ({ rowData }) => {
        const priority = rowData.rule.priority ? rowData.rule.priority.name : ''
        return (
            <div>
                {priority !== undefined && <span className={PriorityColorClass[priority.toUpperCase()] + ' mrR5'}><i className="fa fa-circle"></i></span>}
                {priority}
            </div>
        )
    }

    exposureTimeCellRenderer = ({ rowData }) => {
        return (
            <div>
                {calculateAgoTimeByLongFormat(rowData.asset.first_seen)}
            </div>
        )
    }

    assetTypeNameCellRenderer = ({ rowData }) => {
        const assetName = rowData.asset.asset_type.cloud_service_name
        return (
            <div className="service-icon" title={assetName}>
                {assetName !== undefined && <img src={fetchServiceIconPath(assetName)}/>} {assetName}
            </div>
        );
    }

    assetNameCellRenderer = ({ rowData }) => {
        console.log('rowData-->', rowData)
        const assetName = rowData.asset.asset_type.cloud_service_name
        let assetNameDiscriminator = ''
        rowData.asset.asset_type.discriminator.map(discriminator => {
            if (assetNameDiscriminator == '') {
                assetNameDiscriminator += rowData.asset.data[discriminator]
            } else {
                assetNameDiscriminator += ' ' + rowData.asset.data[discriminator]
            }
        })

        return (
            <div className="service-icon" title={assetName}>
                <a  onClick={() => history.push({pathname: '/app/assets/detail/' + rowData.asset.id, state: {backUrl: '/app/alerts/detail/' + rowData.id }})} href="javascript:void(0)">{assetNameDiscriminator !== '' ? assetNameDiscriminator : rowData.asset.id}</a>
            </div>
        );
    }

    tagsCellRenderer = ({ cellData }) => {
        if (cellData === undefined || cellData === null || cellData.length === 0) {
            cellData = ['no tags']
        } else {
            cellData = cellData
        }
        return (
            <div>
                {cellData.map((item, index) => {
                    return (<div className="padding-tag"><span key={item + '- ' + index} className="chip-white mrR5">{item}</span></div>)
                })}
            </div>
        )
    }

    regionRenderer = ({ rowData }) => {
        const region = rowData.asset.data.region ? rowData.asset.data.region : 'N/A'
        return (
            <div>
                {region.toUpperCase()}
            </div>
        )
    }

    validateCellData = ({...params}) => {
        let cellData = params.cellData
        if (cellData === undefined || cellData === null || cellData === '' || cellData.length === 0) {
            cellData = 'N/A'
        } 
        params['component'] = cellData
        return this.wrapComponentCellRenderer(params)
    }

    handleEnableDisable=()=>{
        this.setState((pre) => ({ isEnable:!pre.isEnable }))
    }

    disableEnableCellRenderer = () => {
        const {isEnable}=this.state
        return (
            <Switch
                checked={isEnable === false}
                onChange={this.statusChangeDialog}
                value={isEnable}
                className={isEnable === false ? "select-control-green active" : "select-control-red"}
            />
        )
    }

    addToPlanChangeHandler = (alertId, isChecked) => {
        const selectedAlertIds = cloneDeep(this.state.selectedAlertIds)
        if (isChecked) {
            const newAlertIds = pull(selectedAlertIds, alertId)
            this.props.setAlertsPlan(newAlertIds)
            this.setState({ selectedAlertIds: newAlertIds })
        } else {
            selectedAlertIds.push(alertId)
            this.props.setAlertsPlan(selectedAlertIds)
            this.setState({ selectedAlertIds: selectedAlertIds })
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


    filterOptions = (event) => {

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
            currentStatus
        } = this.state;
        
        const sortedList = dataList;

        return (
            <div>
                <AutoSizer disableHeight>
                    {({ width }) => (
                        <InfiniteLoader
                            isRowLoaded={this._isRowLoaded}
                            loadMoreRows={this._loadMoreRows}
                            rowCount={1}
                            height={100}
                            threshold={10}
                        >
                            {({ onRowsRendered, registerChild }) => (
                                <Table
                                    headerHeight={headerHeight}
                                    height={100}
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
                                        dataKey="priority"
                                        label="Priority"
                                        headerRenderer={this.headerRenderer}
                                        cellRenderer={this.priorityCellRenderer}
                                        disableSort={false}
                                        width={100}
                                        flexGrow={1}

                                    />

                                    <Column
                                        dataKey="summary"
                                        label="Alert Description"
                                        headerRenderer={this.headerRenderer}
                                        cellRenderer={this.validateCellData}
                                        disableSort={false}
                                        width={250}
                                        flexGrow={2}
                                    />

                                    <Column
                                        dataKey="exposure_time"
                                        label="Exposure Time"
                                        headerRenderer={this.headerRenderer}
                                        cellRenderer={this.exposureTimeCellRenderer}
                                        disableSort={false}
                                        width={200}
                                        flexGrow={3}
                                    />
                                    <Column
                                        dataKey="cloud_account_id"
                                        label="Cloud Account"
                                        headerRenderer={this.headerRenderer}
                                        cellRenderer={this.validateCellData}
                                        disableSort={false}
                                        width={200}
                                        flexGrow={4}
                                    />

                                    <Column
                                        dataKey="asset"
                                        label=" Asset Type"
                                        headerRenderer={this.headerRenderer}
                                        cellRenderer={this.assetTypeNameCellRenderer}
                                        disableSort={false}
                                        width={200}
                                        flexGrow={5}
                                    />
                                    <Column
                                        dataKey="asset_name"
                                        label=" Asset Name"
                                        headerRenderer={this.headerRenderer}
                                        cellRenderer={this.assetNameCellRenderer}
                                        disableSort={false}
                                        width={200}
                                        flexGrow={6}
                                    />
                                    <Column
                                        dataKey="tags"
                                        label=" Tags"
                                        headerRenderer={this.headerRenderer}
                                        cellRenderer={this.tagsCellRenderer}
                                        disableSort={false}
                                        width={200}
                                        flexGrow={7}
                                    />

                                    <Column
                                        dataKey="region"
                                        label="Region"
                                        headerRenderer={this.headerRenderer}
                                        cellRenderer={this.regionRenderer}
                                        disableSort={false}
                                        width={100}
                                        flexGrow={8}
                                    />

                                    <Column
                                        dataKey="suppressed"
                                        label="Disable/Enable"
                                        headerRenderer={this.headerRenderer}
                                        cellRenderer={this.disableEnableCellRenderer}
                                        disableSort={false}
                                        width={100}
                                        flexGrow={9}
                                    />

                                    <Column
                                        dataKey="addToPlan"
                                        label="Add to Plan"
                                        headerRenderer={this.headerRenderer}
                                        cellRenderer={this.addToPlanCellRenderer}
                                        disableSort={false}
                                        width={100}
                                        flexGrow={10}
                                        className="justify-content-center"
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
                    content={(currentStatus === true) ? 'Are you sure you want to Active this Alert ?' : 'Are you sure you want to Suppress this Alert ?'}
                    successDialogEvent={this.enableDisableSuppress} />
            </div>
        )
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators(Object.assign({}, alertsActions), dispatch),
        showMessage: message => {
            dispatch(showMessage(message))
        }, setProgressBar: isProgress => {
            dispatch(setProgressBar(isProgress))
        }, setAlertsPlan: alerts_plan => {
            dispatch(setAlertsPlan(alerts_plan))
        }
    };
}

const mapStateToProps = (state, ownProps) => ({
    filterData: state.uiReducer.filterData,
    alerts_plan: state.commonReducer.alerts_plan
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SingleAlertList))