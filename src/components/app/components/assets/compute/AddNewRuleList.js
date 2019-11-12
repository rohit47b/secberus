import React, { PureComponent } from "react";

import Loader from 'global/Loader';
import { Checkbox} from '@material-ui/core'

import { Column, InfiniteLoader, SortDirection, Table, CellMeasurerCache, CellMeasurer } from "react-virtualized";
import AutoSizer from "react-virtualized/dist/commonjs/AutoSizer";

class AddNewRuleList extends PureComponent {
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
        checkedA: true,
        loaded: false,
        openDialog: false,
        rowIndex: 0,
        schdulerId: 0,
        pageNo: 0,
        isMoreData: true,
        perPage: 50,
    };

    currentValue = this.props.filterData

    componentDidMount() {
        this.setState({ dataList: this.getRows(15) });
    }

    getRows(num) {
        return [...Array(num).keys()].map(a => ({
            ruleId: `ID1`,
            ruleName: `Rule1`,
            failedAssets: `1`
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

    checkboxCellRenderer = () => {
        return (
            <Checkbox
                //checked={this.state.checked.indexOf(value) !== -1}
                tabIndex={-1}
                disableRipple
                className="filter-checkbox"
                color="primary"
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
        } = this.state;

        const sortedList = dataList;

        return (

            <div className="container sidebar-container">
                <div className="sidebar-header">
                    <h4>Add Rules</h4>
                    <span onClick={this.props.toggleDrawer('right', false)} className="sidebar-close-icon"><i className="fa fa-times-circle" aria-hidden="true"></i> Exit</span>
                </div>
                <div
                    tabIndex={0}
                    role="button"
                    className="sidebar-body"
                >
                     <div className="table-container" style={{ height: "100%", maxHeight: "100%" }}>
                        <AutoSizer>
                            {({ height, width }) => (
                                <InfiniteLoader
                                    isRowLoaded={this._isRowLoaded}
                                    loadMoreRows={this._loadMoreRows}
                                    rowCount={15}
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
                                                dataKey="checked"
                                                //headerRenderer={this.headerRenderer}
                                                cellRenderer={this.checkboxCellRenderer}
                                                disableSort={false}
                                                width={50}
                                                flexGrow={1}
                                            />

                                            <Column
                                                dataKey="ruleId"
                                                label="Rule ID"
                                                //headerRenderer={this.headerRenderer}
                                                cellRenderer={this.validateCellData}
                                                disableSort={false}
                                                width={200}
                                                flexGrow={2}
                                            />

                                            <Column
                                                dataKey="ruleName"
                                                label="Rule Name"
                                                //headerRenderer={this.headerRenderer}
                                                cellRenderer={this.validateCellData}
                                                disableSort={false}
                                                width={200}
                                                flexGrow={3}
                                            />

                                            <Column
                                                dataKey="failedAssets"
                                                label="Failed Assets"
                                                //headerRenderer={this.headerRenderer}
                                                cellRenderer={this.validateCellData}
                                                disableSort={false}
                                                width={200}
                                                flexGrow={4}
                                            />

                                        </Table>
                                    )}
                                </InfiniteLoader>
                            )}
                        </AutoSizer>
                    </div>
            </div>
            </div>
        );
    }
}


export default AddNewRuleList;