import React, { PureComponent, Fragment } from "react";
import { Link } from 'react-router-dom'
import Loader from 'global/Loader';
import { Checkbox } from '@material-ui/core'
import ArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import SearchIcon from '@material-ui/icons/Search';

import { Column, InfiniteLoader, SortDirection, Table, CellMeasurerCache, CellMeasurer } from "react-virtualized";
import AutoSizer from "react-virtualized/dist/commonjs/AutoSizer";
import { headerRenderer } from 'TableHelper/cellRenderer'


class AllNotificationList extends PureComponent {
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
        rowIndex: 0
    };

    currentValue = this.props.filterData

    componentDidMount() {
        this.setState({ dataList: this.getRows(3) });
    }

    getRows(num) {
        let notificationType = [
            "Asset",
            "Rule",
            "User Activity",
            "Alert",
            "Posture"
          ];
          let description =["New Cloud Account Connected","Cloud Account Deleted"]
          let eventName=[
            "New Asset",
            "Asset Expired",
            "Asset Changed",
          ]
        return [...Array(num).keys()].map(a => ({
            notification_type: notificationType[Math.floor(Math.random() * 5)],
            description: description[Math.floor(Math.random() * 2)],
            date: `5/08/19`,
            event_name: eventName[Math.floor(Math.random() * 3)],
        }));
    }

    //   --------------------Table helper method Start-----------------------

    _isRowLoaded = ({ index }) => {
        return !!this.state.dataList[index];
    }

    _loadMoreRows = ({ startIndex, stopIndex }) => {
        console.log(" load more ....", startIndex, stopIndex);
        this.setState({ dataList: this.getRows(startIndex + 3) });
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

    readUnreadCellRender = ({cellData, rowIndex}) => {
        return (
            <Fragment>
                <Checkbox
                    tabIndex={-1}
                    disableRipple
                    color="primary"
                    className="checkbox-blue"
                />
            </Fragment>
        )
    }
   
    eventReportMagnifyCellRender = ({cellData, rowIndex}) => {
        return (
            <Fragment>
                <Link to="/app/assets-compute"><SearchIcon/></Link>
            </Fragment>
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
                    {({ height, width }) => (
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
                                        dataKey="notification_type"
                                        label={<span style={{cursor:"pointer"}}>Notification Type <ArrowDownIcon className="icon-down-arrow"/></span>}
                                        headerRenderer={headerRenderer}
                                        disableSort={true}
                                        width={150}
                                        flexGrow={1}
                                    />

                                    <Column
                                        dataKey="description"
                                        label="Description"
                                        headerRenderer={headerRenderer}
                                        disableSort={false}
                                        width={200}
                                        flexGrow={2}
                                        className="justify-content-start"
                                    />

                                    <Column
                                        dataKey="date"
                                        label={<span style={{cursor:"pointer"}}>Date <ArrowDownIcon className="icon-down-arrow"/></span>}
                                        headerRenderer={headerRenderer}
                                        disableSort={true}
                                        width={150}
                                        flexGrow={3}
                                    />

                                    <Column
                                        dataKey="event_name"
                                        label={<span style={{cursor:"pointer"}}>Event Name <ArrowDownIcon className="icon-down-arrow"/></span>}
                                        headerRenderer={headerRenderer}
                                        disableSort={true}
                                        width={200}
                                        flexGrow={4}
                                    />

                                    <Column
                                        dataKey="event_report"
                                        label="Event/Report"
                                        headerRenderer={ () => {
                                            return (
                                                <div className="table-td text-center">
                                                   Event/Report
                                                </div>
                                            );
                                        }}
                                        cellRenderer={this.eventReportMagnifyCellRender}
                                        disableSort={false}
                                        width={50}
                                        flexGrow={5}
                                        className="justify-content-center"
                                    />
                                      <Column
                                        dataKey="read_unread"
                                        label="Read/Unread"
                                        headerRenderer={ () => {
                                            return (
                                                <div className="table-td text-center">
                                                   Read/Unread
                                                </div>
                                            );
                                        }}
                                        cellRenderer={this.readUnreadCellRender}
                                        disableSort={true}
                                        width={200}
                                        flexGrow={6}
                                        className="justify-content-center"
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


export default AllNotificationList;