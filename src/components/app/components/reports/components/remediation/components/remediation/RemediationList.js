import { LinearProgress } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import Loader from 'global/Loader';
import SearchField from 'global/SearchField';
import React, { Fragment, PureComponent } from "react";
import { withRouter } from 'react-router-dom';
import { Column, InfiniteLoader, SortDirection, Table, CellMeasurerCache, CellMeasurer } from "react-virtualized";
import AutoSizer from "react-virtualized/dist/commonjs/AutoSizer";
import { headerRenderer, longDateCellRenderer } from 'TableHelper/cellRenderer';
import WithDrawer from 'TableHelper/with-drawer';
import RemediationSubTableList from './RemediationSubTableList';
import ConfirmDialogBoxHOC from 'hoc/DialogBox';
import * as remediationActions from 'actions/remediationAction';
import { connect } from "react-redux";
import { bindActionCreators } from 'redux';
import { showMessage } from 'actions/messageAction'
import history from 'customHistory';

class RemediationList extends PureComponent {

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
        sortBy: "status",
        sortDirection: SortDirection.ASC,
        search: '',

        dataList: [],
        rowIndex: 0,
        loading: true,
        completed: 25,

        offset: 0,
        perPage: 20,
        openDeletePlanDialog: false,
        planId: '',
        toggleRowIndex: -1
    };

    componentDidMount() {
        this.setState({ dataList: this.props.dataList })
    }

    componentDidUpdate = (prevProps, prevState) => {
        if (prevProps.dataList !== this.props.dataList) {
            this.setState({ dataList: this.props.dataList, loading: false })
        }
    }

    deletePlanConfirm = () => {
        this.props.actions.deleteRemediationPlan(this.props.filterData.selectAccount.id, this.state.planId).
            then(result => {
                if (typeof result !== 'string') {

                } else {
                    console.log(' Error in fetching alerts :- ', result);
                    this.setState({ loading: false, filterProgress: false })
                }
            });

        this.props.reFetchData()
        this.closeDeletePlan()

        let message = { message: 'You have successfully deleted Remediation Plan', showSnackbarState: true, variant: 'success' }
        this.props.showMessage(message)

    }



    //   --------------------Table helper method Start-----------------------

    _isRowLoaded = ({ index }) => {
        return !!this.state.dataList[index];
    }

    _loadMoreRows = ({ startIndex, stopIndex }) => {
        console.log(" load more ....", startIndex, stopIndex);
    }


    sort = ({ sortBy, sortDirection }) => {
        this.setState({ sortBy, sortDirection, filterProgress: true }, () => {
            const filterData = this.props.filterData
            // this.fetchRemediationPlans(filterData)
        });
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

    progressCellRenderer = ({ cellData }) => {
        return (
            <div className="progress-bar progress-warning" style={{ flexGrow: "1" }}>
                <LinearProgress variant="determinate" value={cellData ? cellData : 0} valueBuffer={cellData ? cellData : 0}/>
            </div>
        )
    }

    alertCountCellRenderer = ({ cellData }) => {
        return (
            <div>
                {cellData.length}
            </div>
        )
    }

    statusCellRender = ({ cellData }) => {
        return (
            <div>
                {cellData === true ? 'Open' : 'Archived'}
            </div>
        )
    }

    generateReportRenderer = ({ rowData, cellData }) => {
        if (rowData.alerts.length > 0) {
            return (
                <span className="link-hrf" onClick={() => history.push({pathname: '/app/reports/plan/'+rowData.id, state: { selectedPlan: rowData, backUrl: '/app/reports/remediation' }})}><i className="fa fa-file-pdf-o" aria-hidden="true" ></i></span>
            )
        } else {
            return (
                <span>{"Alerts not found"}</span>
            )
        }
        
    }

    deletePlantRenderer = ({ rowData, cellData }) => {
        return (<div>
            {rowData.active === true && <span className="fnt-16 text-gray" style={{ cursor: "pointer" }} onClick={() => this.openDeletePlan(rowData.id)}>
                <i className="fa fa-archive" aria-hidden="true"></i>
            </span>}
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

    openDeletePlan = (planId) => {
        this.setState({ openDeletePlanDialog: true, planId })
    }

    closeDeletePlan = () => {
        this.setState({ openDeletePlanDialog: false, planId: '' })
    }



    toggleActiveClass = (toggleRowIndex) => {
        if (this.state.toggleRowIndex !== toggleRowIndex) {
            this.setState({ toggleRowIndex })
        } else {
            this.setState({ toggleRowIndex: -1 })
        }
    }

    ruleRenderer = (index, alerts, projected_risk_score, planId) => {
        return (<RemediationSubTableList reFetchData={this.props.reFetchData} dataList={alerts} projected_risk_score={projected_risk_score} planId={planId} toggleRowIndex={this.state.toggleRowIndex}/>);
    }

    _rowGetter = ({ index }) => {
        return this.state.dataList[index];
    }

    searchHandler = name => event => {
        this.setState({ search: event.target.value })
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
            dataList,
            toggleRowIndex,
            sortBy,
            sortDirection,
            openDeletePlanDialog
        } = this.state;

        return (
            <Fragment>
                <Grid container spacing={24}>
                    <Grid item xs={12} sm={12}>
                        <div className="d-flex justify-flex-end">
                            <SearchField handleChange={this.searchHandler} />
                        </div>
                    </Grid>
                </Grid>
                <Grid container spacing={24} className="grid-container">
                    <Grid item xs={12} sm={12}>
                        <div className="container">
                            <WithDrawer
                                drawerContent={(rowProps) => {
                                    return (<div className="sub-table">{this.ruleRenderer(rowProps.index, rowProps.rowData.alerts, rowProps.rowData.projected_risk_score, rowProps.rowData.id)}</div>);
                                }}
                                rowsDimensions={dataList.map((dataItem) => ({ collapsedHeight: 38, expandedHeight: 300 }))}
                            >
                                {({ rowHeight, rowRenderer, toggleDrawerWithAnimation, setTableRef }) => (
                                     <div className="table-container table-collapse" style={{ height: "100%", maxHeight: "100%" }}>
                                        <AutoSizer style={{ height: "100%", maxHeight: "100%" }}>
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
                                                            ref={setTableRef}
                                                            headerHeight={39}
                                                            height={height}
                                                            width={width}
                                                            rowCount={dataList.length}
                                                            rowGetter={this._rowGetter}
                                                            rowHeight={this._cache.rowHeight}
                                                            sort={this.sort}
                                                            sortBy={sortBy}
                                                            sortDirection={sortDirection}
                                                            rowRenderer={rowRenderer}
                                                            noRowsRenderer={this.noRowsRenderer}
                                                            className="data-table table-no-border table-report-list"
                                                        >

                                                            <Column
                                                                className="col-td toggle-row"
                                                                label=""
                                                                dataKey="resource"
                                                                width={20}
                                                                flexGrow={1}
                                                                headerRenderer={headerRenderer}
                                                                cellRenderer={
                                                                    ({ cellData, rowIndex }) => {
                                                                        return (
                                                                            <div onClick={() => { this.toggleActiveClass(rowIndex) }} className={rowIndex === toggleRowIndex ? 'arrow-down' : ''}>
                                                                                <span style={{ cursor: "pointer" }} onClick={() => toggleDrawerWithAnimation(rowIndex)}>
                                                                                    <i className="fa fa-angle-right"></i>
                                                                                </span>
                                                                            </div>
                                                                        );
                                                                    }
                                                                }
                                                            />

                                                            <Column
                                                                dataKey="name"
                                                                label="Plan Name"
                                                                headerRenderer={headerRenderer}
                                                                cellRenderer={this.validateCellData}
                                                                disableSort={true}
                                                                width={300}
                                                                flexGrow={1}
                                                            />

                                                            <Column
                                                                dataKey="plan_complete_percentage"
                                                                label="Progress"
                                                                headerRenderer={headerRenderer}
                                                                cellRenderer={this.progressCellRenderer}
                                                                disableSort={true}
                                                                width={300}
                                                                flexGrow={2}

                                                            />

                                                            <Column
                                                                dataKey="active"
                                                                label="Status"
                                                                headerRenderer={headerRenderer}
                                                                cellRenderer={this.statusCellRender}
                                                                disableSort={true}
                                                                width={70}
                                                                flexGrow={3}
                                                            />


                                                            <Column
                                                                dataKey="alerts"
                                                                label="Alerts"
                                                                headerRenderer={headerRenderer}
                                                                cellRenderer={this.alertCountCellRenderer}
                                                                disableSort={true}
                                                                width={50}
                                                                flexGrow={4}
                                                            />

                                                            <Column
                                                                dataKey="create_timestamp"
                                                                label="Created"
                                                                headerRenderer={headerRenderer}
                                                                cellRenderer={longDateCellRenderer}
                                                                disableSort={true}
                                                                width={150}
                                                                flexGrow={4}
                                                            />


                                                            <Column
                                                                dataKey="generateReport"
                                                                label="Generate Report"
                                                                headerRenderer={headerRenderer}
                                                                cellRenderer={this.generateReportRenderer}
                                                                disableSort={true}
                                                                width={100}
                                                                flexGrow={5}

                                                            />

                                                            <Column
                                                                dataKey="id"
                                                                label="Action"
                                                                headerRenderer={headerRenderer}
                                                                cellRenderer={this.deletePlantRenderer}
                                                                disableSort={true}
                                                                width={70}
                                                                flexGrow={5}

                                                            />

                                                        </Table>
                                                    )}
                                                </InfiniteLoader>
                                            )}
                                        </AutoSizer>
                                    </div>
                                )}
                            </WithDrawer>
                            <ConfirmDialogBoxHOC
                                isOpen={openDeletePlanDialog}
                                handleDialogClose={this.closeDeletePlan}
                                title={'Confirmation'}
                                cancelBtnLabel={"CANCEL"}
                                confirmBtnLabel={"Confirm"}
                                content={'Please confirm you want to archive this remediation plan'}
                                successDialogEvent={this.deletePlanConfirm} />



                        </div>
                    </Grid>
                </Grid>
            </Fragment>
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(RemediationList))