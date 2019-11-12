import React, { PureComponent, Fragment } from "react";
import Loader from 'global/Loader';
import Grid from '@material-ui/core/Grid'
import { Column, InfiniteLoader, SortDirection, Table, CellMeasurerCache } from "react-virtualized";
import AutoSizer from "react-virtualized/dist/commonjs/AutoSizer";
import { headerRenderer } from 'TableHelper/cellRenderer'

import SearchField from 'global/SearchField'

class AssetHistory extends PureComponent {
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
        search: '',
    };

    currentValue = this.props.filterData

    componentDidMount() {
        this.setState({ dataList: this.getRows(10) });
    }

    getRows(num) {
        let integrationName = [
            "SLACK",
            "JIRA",
            "Service now"
        ];
        let createdBy = [
            "Oldin Bataku",
            "Jason Hensley"
        ]
        return [...Array(num).keys()].map(a => ({
            integration_name: integrationName[Math.floor(Math.random() * 3)],
            created_by: createdBy[Math.floor(Math.random() * 2)],
            scan: `5/23/19, 14:00`,
            region: `US-EAST-2`,
            asset_weight: `4`
        }));
    }

    //   --------------------Table helper method Start-----------------------

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


    mfaDeleteCellRender = ({ }) => {
        return (
            <span className="text-success">Enabled</span>
        )
    }

    loggingCellRender = ({ }) => {
        return (
            <span className="text-danger">Disabled</span>
        )
    }

    encryptedCellRender = ({ }) => {
        return (
            <span className="text-success">Enabled</span>
        )
    }

    publicCellRender = ({ }) => {
        return (
            <span className="text-success">yes</span>
        )
    }

    activeCellRender = ({ }) => {
        return (
            <span className="text-success">Active</span>
        )
    }

    filterOptions = (event) => {

    }

    searchHandler = name => event => {
        this.setState({ search: event.target.value })
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
            <Fragment>
                <Grid container spacing={16}>
                    <Grid item md={12} className="pdR0">
                        <SearchField handleChange={this.searchHandler} />
                    </Grid>
                </Grid>
                <Grid container spacing={16} className="grid-container">
                    <Grid item md={12}>
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
                                                    dataKey="scan"
                                                    label="Scan"
                                                    headerRenderer={headerRenderer}
                                                    disableSort={true}
                                                    width={100}
                                                    flexGrow={1}
                                                />

                                                <Column
                                                    dataKey="region"
                                                    label="Region"
                                                    headerRenderer={headerRenderer}
                                                    disableSort={false}
                                                    width={100}
                                                    flexGrow={2}
                                                />

                                                <Column
                                                    dataKey="mga_delete"
                                                    label="MFA Delete"
                                                    headerRenderer={headerRenderer}
                                                    cellRenderer={this.mfaDeleteCellRender}
                                                    disableSort={true}
                                                    width={100}
                                                    flexGrow={3}
                                                />

                                                <Column
                                                    dataKey="logging"
                                                    label="Logging"
                                                    headerRenderer={headerRenderer}
                                                    cellRenderer={this.loggingCellRender}
                                                    disableSort={true}
                                                    width={100}
                                                    flexGrow={4}
                                                />
                                                <Column
                                                    dataKey="encrypted"
                                                    label="Encrypted"
                                                    headerRenderer={headerRenderer}
                                                    cellRenderer={this.encryptedCellRender}
                                                    disableSort={true}
                                                    width={100}
                                                    flexGrow={5}
                                                />
                                                <Column
                                                    dataKey="public"
                                                    label="Public"
                                                    headerRenderer={headerRenderer}
                                                    cellRenderer={this.publicCellRender}
                                                    disableSort={true}
                                                    width={100}
                                                    flexGrow={6}
                                                />
                                                <Column
                                                    dataKey="asset_weight"
                                                    label="Asset Weight"
                                                    headerRenderer={headerRenderer}
                                                    disableSort={true}
                                                    width={100}
                                                    flexGrow={7}
                                                />
                                                <Column
                                                    dataKey="asset_weight"
                                                    label="Active/Suppressed"
                                                    headerRenderer={headerRenderer}
                                                    cellRenderer={this.activeCellRender}
                                                    disableSort={true}
                                                    width={100}
                                                    flexGrow={7}
                                                />


                                            </Table>
                                        )}
                                    </InfiniteLoader>
                                )}
                            </AutoSizer>
                        </div>
                    </Grid>
                </Grid>
            </Fragment>
        )
    }
}

export default AssetHistory