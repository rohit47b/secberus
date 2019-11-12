import React, { PureComponent, Fragment } from "react";
import Loader from 'global/Loader';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import Chip from '@material-ui/core/Chip'
import { Column, InfiniteLoader, SortDirection, Table, CellMeasurerCache,CellMeasurer } from "react-virtualized";
import AutoSizer from "react-virtualized/dist/commonjs/AutoSizer";
import { headerRenderer } from 'TableHelper/cellRenderer'
import { Checkbox,Switch} from '@material-ui/core';
import { calculateAgoTimeByLongFormat } from 'utils/dateFormat'
import history from 'customHistory';
import { withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from "react-redux";
import { setActiveMenu, setActiveParentMenu, setProgressBar } from 'actions/commonAction';

const PriorityColorClass = { CRITICAL: 'text-danger', HIGH: 'text-orange', MEDIUM: 'text-warning', LOW: 'text-success', SUPPESSED: 'text-gray', WARNING: 'text-warning' }
const StatusColorClass = { fail: 'text-danger', pass: 'text-success', suppressed: 'text-gray'}

class CurrentStateList extends PureComponent {
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
        isEnable:false
    };

    currentValue = this.props.filterData

    componentDidMount() {
        this.setState({ dataList: this.props.alerts ? this.props.alerts : [] });
    }

    getRows(num) {
        let priority = [
            "High",
            "Critical",
            "Medium",
            "Low"
        ];
        let alert_description = [
            "Logging Enable",
            "MFA Delete is Enabled",
            "Encryption is Enabled",
            "Object Versioning is not enabled",
            "S3 bucket is public"
        ];
        let status = [
            "Pass",
            "Suppressed",
            "Fail"
        ];
        return [...Array(num).keys()].map(a => ({
            priority: priority[Math.floor(Math.random() * 4)],
            alert_description: alert_description[Math.floor(Math.random() * 5)],
            status: status[Math.floor(Math.random() * 3)],
            alert_id: `S3-AWS-6EFEB4`,
            exposure_time: `4d 3h 21m`,
            region: `UKWest`
        }));
    }

    //   --------------------Table helper method Start-----------------------

    _isRowLoaded = ({ index }) => {
        return !!this.state.dataList[index];
    }

    _loadMoreRows = ({ startIndex, stopIndex }) => {
        console.log(" load more ....", startIndex, stopIndex);
        //this.setState({ dataList: this.getRows(startIndex + 10) });
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

    alertIdAnchorCellRenderer = ({...params}) => {
        const alertId = params.rowData.asset.asset_type.cloud + '-' + params.rowData.asset.asset_type.cloud_service_name + '-' + params.rowData.id.substring(0, 6)
        let component = (
            <div>
                <a onClick={() => history.push({pathname: '/app/alerts/detail/'+params.rowData.id, state: { alert: params.rowData, backUrl: '/app/assets/detail/' + this.props.asset.id }})} href="javascript:void(0)">{alertId.toUpperCase()}</a>
            </div>
        );
    
        params['component'] = component
        return this.wrapComponentCellRenderer(params)
    };

    priorityCellRenderer = ({...params}) => {
        const priority = params.rowData.rule.priority ? params.rowData.rule.priority.name : ''
        let component = (
        <div>
            {priority !== undefined && <span className={PriorityColorClass[priority.toUpperCase()] + ' mrR5'}><i className="fa fa-circle"></i></span>}
            {priority}
        </div>
        );
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

    ageCellRenderer = ({...params}) => {
        let component = (
            <div>
            {calculateAgoTimeByLongFormat(params.rowData.asset.first_seen)}
            </div>
        );

        params['component'] = component
        return this.wrapComponentCellRenderer(params)
    }

    statusCellRenderer = ({...params}) => {
        const status = params.rowData.status
        let component = (
            <div>
                {status !== undefined && <span className={StatusColorClass[status.toUpperCase()] + ' mrR5'}></span>}
                {status}
            </div>
        )

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
        history.push({pathname: '/app/rules/detail/', state: { rule: rowData.rule, asset_type: assetName, backUrl: '/app/assets/detail/' + this.props.asset.id }})
    }

    workflowCellRenderer =({...params})=>{
        const remediation = params.rowData.remediation_plan_id
        return(
            <span className="text-success">{remediation !== undefined ? 'In Remediation' : ' -- '}</span>
        )
    }

    filterOptions = (event) => {

    }

    //   --------------------Table helper method End-----------------------


    render() {
        const {
            headerHeight,
            sortBy,
            sortDirection,
            dataList,
        } = this.state;

        const sortedList = dataList;

        return (
            <div className="table-container" style={{ height: "100%", maxHeight: "100%" }}>
            <AutoSizer>
                {({height, width }) => (
                    <InfiniteLoader
                        isRowLoaded={this._isRowLoaded}
                        loadMoreRows={this._loadMoreRows}
                        rowCount={10}
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
                                    dataKey="alert_id"
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
                                    width={150}
                                    flexGrow={2}
                                />

                                <Column
                                    dataKey="summary"
                                    label="Alert Description"
                                    cellRenderer={this.validateCellData}
                                    headerRenderer={this.headerRenderer}
                                    disableSort={false}
                                    width={200}
                                    flexGrow={3}
                                />
                                <Column
                                    dataKey="exposure_time"
                                    label="Exposure Time"
                                    headerRenderer={this.headerRenderer}
                                    cellRenderer={this.ageCellRenderer}
                                    disableSort={false}
                                    width={200}
                                    flexGrow={4}
                                />

                                <Column
                                    dataKey="rule"
                                    label=" Rule"
                                    headerRenderer={this.headerRenderer}
                                    cellRenderer={this.ruleCellRenderer}
                                    disableSort={false}
                                    width={200}
                                    flexGrow={5}
                                />
                                <Column
                                    dataKey="status"
                                    label="Status"
                                    headerRenderer={this.headerRenderer}
                                    cellRenderer={this.statusCellRenderer}
                                    disableSort={false}
                                    width={200}
                                    flexGrow={6}
                                />
                                <Column
                                    dataKey="workflow"
                                    label="Workflow"
                                    headerRenderer={this.headerRenderer}
                                    cellRenderer={this.workflowCellRenderer}
                                    disableSort={false}
                                    width={200}
                                    flexGrow={7}
                                />
                                
                            </Table>
                        )}
                    </InfiniteLoader>
                )}
            </AutoSizer>
            </div>
        )
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators(Object.assign({}), dispatch),
        showMessage: message => {
            dispatch(showMessage(message))
        }, setProgressBar: isProgress => {
            dispatch(setProgressBar(isProgress))
        }, setActiveMenu: activeMenu => {
            dispatch(setActiveMenu(activeMenu))
        }, setActiveParentMenu: activeMenu => {
            dispatch(setActiveParentMenu(activeMenu))
        }
    };
}


export default withRouter(connect(null, mapDispatchToProps)(CurrentStateList))