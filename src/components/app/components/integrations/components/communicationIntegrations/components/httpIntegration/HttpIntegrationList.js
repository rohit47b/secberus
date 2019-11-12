import React, { PureComponent, Fragment } from "react";
import Loader from 'global/Loader';
import EditIcon  from '@material-ui/icons/Edit';
import DeleteIcon  from '@material-ui/icons/Delete';

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import { Column, InfiniteLoader, SortDirection, Table, CellMeasurerCache, CellMeasurer} from "react-virtualized";
import AutoSizer from "react-virtualized/dist/commonjs/AutoSizer";
import { headerRenderer } from 'TableHelper/cellRenderer'
import * as integrationActions from 'actions/integrationAction'
import { showMessage } from 'actions/messageAction'
import { setProgressBar } from 'actions/commonAction'

import ConfirmDialogBoxHOC from 'hoc/DialogBox'

class HttpIntegrationList extends PureComponent {
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
        openStatusDialog: false,
        currentIntegration: undefined
    };

    currentValue = this.props.filterData

    componentDidMount() {
        this._mounted = true
        this.props.setProgressBar(true)
        this.fetchIntegrationList()
    }

    fetchIntegrationList() {
        this.props.actions.fetchIntegrationsHttp().
          then(result => {
            if (typeof result !== 'string') {
                this.setState({ dataList: result })
            } else {
                console.log(' Error in fetching integrations :- ', result);
            }
          });
      }

    getRows(num) {
        let integrationName = [
            "SLACK",
            "JIRA",
            "Service now"
          ];
          let createdBy=[
            "Oldin Bataku",
            "Jason Hensley"
          ]
        return [...Array(num).keys()].map(a => ({
            integration_name: integrationName[Math.floor(Math.random() * 3)],
            created_by: createdBy[Math.floor(Math.random() * 2)],
            date: `5/08/19`,
        }));
    }

    //   --------------------Table helper method Start-----------------------

    _isRowLoaded = ({ index }) => {
        return !!this.state.dataList[index];
    }

    _loadMoreRows = ({ startIndex, stopIndex }) => {
        console.log(" load more ....", startIndex, stopIndex);
        //this.setState({ dataList: this.getRows(startIndex + 3) });
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
  
   
    actionCellRender = ({rowData, rowIndex}) => {
        return (
            <Fragment>
                 <EditIcon className="pdR10 icon-action" onClick={() => this.props.showCurrent(rowData.id)}/>
                 <DeleteIcon className="icon-action" onClick={() => this.statusChangeDialog(rowData, rowIndex)}/>
            </Fragment>
        )
    }

    filterOptions = (event) => {

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

    handleDialogClose = () => {
        this.setState({ openStatusDialog: false })
    }

    statusChangeDialog = (rowData) => {
        this.setState({ openStatusDialog: true, currentIntegration: rowData });
    }

    enableDisableSuppress = () => {
        this.props.removeIntegration(this.state.currentIntegration.id)
    }

    //   --------------------Table helper method End-----------------------


    render() {
        const {
            headerHeight,
            sortBy,
            sortDirection,
            dataList,
            openStatusDialog
        } = this.state;

        const sortedList = dataList;

        return (

            <div className="table-container" style={{ height: "100%", maxHeight: "100%" }}>
                <AutoSizer>
                    {({ height, width }) => (
                        <InfiniteLoader
                            isRowLoaded={this._isRowLoaded}
                            loadMoreRows={this._loadMoreRows}
                            rowCount={3}
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
                                        dataKey="name"
                                        label="Integration Name"
                                        headerRenderer={headerRenderer}
                                        disableSort={true}
                                        width={600}
                                        flexGrow={1}
                                    />

                                    <Column
                                        dataKey="enabled"
                                        label="Enabled"
                                        headerRenderer={headerRenderer}
                                        cellRenderer={this.yesNoIconCellRenderer}
                                        disableSort={true}
                                        width={300}
                                        flexGrow={1}
                                    />

                                    {/* <Column
                                        dataKey="created_by"
                                        label="Created By"
                                        headerRenderer={headerRenderer}
                                        disableSort={false}
                                        width={300}
                                        flexGrow={2}
                                    />

                                    <Column
                                        dataKey="date"
                                        label="Date Created"
                                        headerRenderer={headerRenderer}
                                        disableSort={true}
                                        width={300}
                                        flexGrow={3}
                                    /> */}

                                    <Column
                                        dataKey="event_name"
                                        label="Action"
                                        headerRenderer={headerRenderer}
                                        cellRenderer={this.actionCellRender}
                                        disableSort={true}
                                        width={150}
                                        flexGrow={4}
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
                    cancelBtnLabel={"NO"}
                    confirmBtnLabel={"YES"}
                    content={'Are you sure you want to Delete this Integration?'}
                    successDialogEvent={this.enableDisableSuppress} />
            </div>

        )
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
      actions: bindActionCreators(Object.assign({}, integrationActions), dispatch),
      showMessage: message => {
        dispatch(showMessage(message))
      }, setProgressBar: isProgress => {
        dispatch(setProgressBar(isProgress))
      }
    };
  }
  
export default withRouter((connect(null, mapDispatchToProps)(HttpIntegrationList)));