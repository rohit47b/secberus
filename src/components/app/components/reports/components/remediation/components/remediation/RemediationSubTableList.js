import { Grid } from '@material-ui/core';
import Switch from '@material-ui/core/Switch';
import Loader from 'global/Loader';
import RiskScore from 'global/RiskScore';
import ConfirmDialogBoxHOC from 'hoc/DialogBox';
import { HelperPopup } from 'hoc/HelperPopup';
import { cloneDeep } from "lodash";
import React, { PureComponent } from "react";
import { withRouter } from 'react-router-dom';
import { Column, InfiniteLoader, SortDirection, Table } from "react-virtualized";
import AutoSizer from "react-virtualized/dist/commonjs/AutoSizer";
import { headerRenderer } from 'TableHelper/cellRenderer';
import { calculateAgoTimeByLongFormat } from 'utils/dateFormat';
import { fetchServiceIconPath } from 'utils/serviceIcon';
import * as remediationActions from 'actions/remediationAction';
import { connect } from "react-redux";
import { bindActionCreators } from 'redux';
import { showMessage } from 'actions/messageAction'
import history from 'customHistory';
class RemediationSubTableList extends PureComponent {

    _mounted = false

    state = {
        // Table attribute
        headerHeight: 40,
        rowHeight: 25,
        rowCount: 0,
        height: 450,
        sortDirection: SortDirection.ASC,
        count: 10,
        dataList: [],
        loaded: false,
        rowIndex: 0,
        pageNo: 0,
        isMoreData: true,
        perPage: 50,
        loading: true,

        planId: this.props.planId,
        planDetails: {},

        anchorEl: null,
        open: false,
        placement: null,
        risk_score: 0,
        openStatusDialog: false,
        currentStatus: true,
        alertId: '',
        isProgress: false,

        openDeleteAlertDialog: false,
        alertId: '',
        projected_risk_score: 0
    }


    componentDidMount() {
        this.setState({ datList: this.props.datList, projected_risk_score: this.props.projected_risk_score })
    }

    componentDidUpdate = (prevProps, prevState) => {
        this.setState({ dataList: prevProps.dataList, projected_risk_score: prevProps.projected_risk_score, loading: false })
    }


    //   --------------------Table helper method Start-----------------------

    _isRowLoaded = ({ index }) => {
        return !!this.state.dataList[index];
    }

    _loadMoreRows = ({ startIndex, stopIndex }) => {
        console.log(" load more ....", startIndex, stopIndex);
    }


    sort = ({ sortBy, sortDirection }) => {

    }

    noRowsRenderer = () => {
        if (!this.state.loading) {
            return (<div className="data-not-found">
                <span>Records Not Found</span>
            </div>)
        }
        else if (this.state.loading) {
            return <Loader />
        }
    }

    statusCellRenderer = ({ cellData }) => {
        return (
            <span className="text-success">
                {cellData}
            </span>
        )
    }



    removeCellRenderer = ({ rowData, cellData }) => {
        return (<div>
            <span className="fnt-16 text-gray" style={{ cursor: "pointer" }} onClick={() => this.openDeleteAlert(rowData.id)}>
                <i className="fa fa-trash-o" aria-hidden="true"></i>
            </span>
        </div>
        )
    }

    openDeleteAlert = (alertId) => {
        this.setState({ openDeleteAlertDialog: true, alertId })
    }

    closeDeleteAlert = () => {
        this.setState({ openDeleteAlertDialog: false, alertId: '' })
    }



    alertIdAnchorCellRenderer = ({...params}) => {
        const alertId = params.rowData.asset.asset_type.cloud + '-' + params.rowData.asset.asset_type.cloud_service_name + '-' + params.rowData.id.substring(0, 6)
        console.log('toggleRowIndex-->', this.props.toggleRowIndex)
        return (
            <div>
                <a onClick={() => history.push({pathname: '/app/alerts/detail/'+params.rowData.id, state: { alert: params.rowData, backUrl: '/app/reports/remediation' }})} href="javascript:void(0)">{alertId.toUpperCase()}</a>
            </div>
        );
    };

    ageCellRenderer = ({ rowData }) => {
        return (
            <div>
                {calculateAgoTimeByLongFormat(rowData.asset.first_seen)}
            </div>
        )
    }

    regionRenderer = ({ rowData }) => {
        const region = rowData.asset.data.region ? rowData.asset.data.region : ''
        return (
            <div>
                {region.toUpperCase()}
            </div>
        )
    }


    assetNameCellRenderer = ({ cellData }) => {
        const assetName = cellData.asset_type.cloud_service_name
        return (
            <div className="service-icon" title={assetName}>
                {assetName !== undefined && <img src={fetchServiceIconPath(assetName)}/>} {cellData.data[cellData.asset_type.discriminator[0]]}
            </div>
        );
    }

    suppressCellRenderer = ({ rowData, cellData, rowIndex }) => {
        return (
            <Switch
                checked={cellData === true}
                onChange={() => this.statusChangeDialog(rowData.id, cellData, rowIndex)}
                value={cellData + ''}
                className={cellData === false ? "select-control-green active" : "select-control-red"}
            />
        )
    }

    statusChangeDialog = (alertId, cellData, rowIndex) => {
        this.setState({ openStatusDialog: true, rowIndex, currentStatus: cellData, alertId });
    }




    removeAlertConfirm = () => {
        this.props.actions.deleteAlertFromRemediationPlan(this.props.filterData.selectAccount.id,this.props.planId, [this.state.alertId]).
            then(result => {
                if (typeof result !== 'string') {

                } else {
                    console.log(' Error in fetching alerts :- ', result);
                    this.setState({ loading: false, filterProgress: false })
                }
            });

        this.props.reFetchData()
        this.closeDeleteAlert()

        let message = { message: 'You have successfully remove alert from  Remediation Plan', showSnackbarState: true, variant: 'success' }
        this.props.showMessage(message)

    }


    enableDisableSuppress = () => {

        //Already suppress alert'
        this.setState({ isProgress: true }, () => {
            if (this.state.currentStatus === true) {
                this.unSuppressAlert()
            } else {
                this.suppressAlert()
            }
        })

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
            });
        this.computeNewDataLIst()
    }


    computeNewDataLIst = () => {

        const dataList = cloneDeep(this.state.dataList)
        let newDataList = dataList.map((row, sidx) => {
            if (this.state.alertId !== row.id) {
                return row;
            } else {
                return { ...row, suppressed: !this.state.currentStatus };
            }
        });
        this.setState({ dataList: newDataList, openStatusDialog: false, isProgress: false }, () => {
        });
    }




    _rowGetter = ({ index }) => {
        return this.state.dataList[index];
    }

    handleOpenPopper = (placement) => (event) => {
        const { currentTarget } = event;
        this.setState(state => ({
            anchorEl: currentTarget,
            open: state.placement !== placement || !state.open,
            placement,
        }))
    }

    handleClosePopper = () => {
        this.setState(state => ({
            open: false
        }))
    }
    handleDialogClose = () => {
        this.setState({ openStatusDialog: false })
    }




    //   ----------------Table helper method End-----------------------

    render() {
        const {
            headerHeight,
            sortBy,
            sortDirection,
            dataList,
            anchorEl,
            open,
            placement,
            openStatusDialog,
            currentStatus,
            isProgress,
            openDeleteAlertDialog,
            projected_risk_score
        } = this.state;

        const sortedList = dataList;
        return (
            <Grid container spacing={24}>
                <Grid item xs={9} sm={9} className="pdR0">
                <div style={{ height: "100%", maxHeight: "100%" }}>
                    <AutoSizer style={{ height: "100%", maxHeight: "100%" }}>
                        {({ width, height }) => (
                            <InfiniteLoader
                                isRowLoaded={() => this._isRowLoaded}
                                loadMoreRows={this._loadMoreRows}
                                rowCount={5}
                                height={height}
                                threshold={10}
                            >
                                {({ onRowsRendered, registerChild }) => (
                                    <Table
                                        headerHeight={headerHeight}
                                        height={height}
                                        rowCount={dataList.length}
                                        rowGetter={({ index }) => sortedList[index]}
                                        rowHeight={48}
                                        sort={this.sort}
                                        sortBy={sortBy}
                                        sortDirection={sortDirection}
                                        onRowsRendered={onRowsRendered}
                                        width={width}
                                        noRowsRenderer={this.noRowsRenderer}
                                        className="data-table table-no-border table-ellipse"
                                    >

                                        <Column
                                            dataKey="alert_id"
                                            label="Alert ID"
                                            headerRenderer={headerRenderer}
                                            cellRenderer={this.alertIdAnchorCellRenderer}
                                            disableSort={true}
                                            width={100}
                                            flexGrow={1}
                                        />

                                        <Column
                                            dataKey="summary"
                                            label="Alert Description"
                                            headerRenderer={headerRenderer}
                                            disableSort={false}
                                            width={200}
                                            flexGrow={2}
                                        />
                                        <Column
                                            dataKey="first_seen"
                                            label="Age"
                                            headerRenderer={headerRenderer}
                                            disableSort={false}
                                            cellRenderer={this.ageCellRenderer}
                                            width={70}
                                            flexGrow={2}
                                        />


                                        <Column
                                            dataKey="asset"
                                            label=" Asset type"
                                            headerRenderer={headerRenderer}
                                            cellRenderer={this.assetNameCellRenderer}
                                            disableSort={false}
                                            width={200}
                                            flexGrow={6}
                                        />

                                        {/* 
                                        <Column
                                            dataKey="suppressed"
                                            label="Active/Supress"
                                            headerRenderer={headerRenderer}
                                            cellRenderer={this.suppressCellRenderer}
                                            disableSort={false}
                                            width={60}
                                            flexGrow={6}
                                        /> */}


                                        <Column
                                            dataKey="status"
                                            label="Status"
                                            headerRenderer={headerRenderer}
                                            cellRenderer={this.statusCellRenderer}
                                            disableSort={false}
                                            width={70}
                                            flexGrow={3}
                                        />

                                        <Column
                                            dataKey="remove"
                                            label="Action"
                                            headerRenderer={headerRenderer}
                                            cellRenderer={this.removeCellRenderer}
                                            disableSort={false}
                                            width={70}
                                            flexGrow={3}
                                        />

                                    </Table>
                                )}
                            </InfiniteLoader>
                        )}
                    </AutoSizer>
                    </div>
                </Grid>
                <Grid item  xs={3} sm={3} className="pdL0">
                    <div className="box-score">
                        <div className="box-header">
                            <span className="box-title">Projection</span>
                            <span onClick={this.handleOpenPopper('bottom-start')} className={open === true ? "alert-icon active" : 'alert-icon'}><i className="fa fa-question-circle" aria-hidden="true"></i></span>
                        </div>
                        <div className="box-body">
                            <RiskScore riskScore={projected_risk_score} popUpContent="This indicate the projected Risk Score after completing this remediation plan." />
                            <HelperPopup title={"Message"} content={"These scores reflect the projected scores after this plan is completed."} anchorEl={anchorEl} open={open} placement={placement} handleClosePopper={this.handleClosePopper} />
                        </div>
                    </div>
                </Grid>
                <ConfirmDialogBoxHOC
                    isProgress={isProgress}
                    isOpen={openStatusDialog}
                    handleDialogClose={this.handleDialogClose}
                    title={'Confirmation'}
                    cancelBtnLabel={"CANCEL"}
                    confirmBtnLabel={currentStatus === false ? "SUPPRESS" : "ACTIVE"}
                    content={currentStatus === false ? 'Suppressing an Alert, will remove it from reports and our calculated risk score.' : 'Are you sure you want to activate this alert?'}
                    successDialogEvent={this.enableDisableSuppress} />

                <ConfirmDialogBoxHOC
                    isOpen={openDeleteAlertDialog}
                    handleDialogClose={this.closeDeleteAlert}
                    title={'Confirmation'}
                    cancelBtnLabel={"CANCEL"}
                    confirmBtnLabel={"Confirm"}
                    content={'Please confirm you want this alert remove from this remediation plan ?'}
                    successDialogEvent={this.removeAlertConfirm} />


            </Grid>
        )
    }
}


const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators(Object.assign({}, remediationActions), dispatch),
        showMessage: message => {
            dispatch(showMessage(message))
        },
    };
}
const mapStateToProps = (state, ownProps) => ({
    filterData: state.uiReducer.filterData,
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(RemediationSubTableList))