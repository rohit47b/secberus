/*
 * @Author: Virendra Patidar 
 * @Date: 2019-04-03 10:40:37 
 * @Last Modified by: Virendra Patidar
 * @Last Modified time: 2019-05-30 11:57:54
 */
import React, { PureComponent } from "react";
import { Column, InfiniteLoader, Table, CellMeasurerCache, CellMeasurer } from "react-virtualized";
import AutoSizer from "react-virtualized/dist/commonjs/AutoSizer";
import { headerRenderer } from 'TableHelper/cellRenderer';

class ComplianceControlList extends PureComponent {

    //   --------------------Table helper method Start-----------------------

    _cache = new CellMeasurerCache({
        fixedWidth: true,
        minHeight: 60
    });

    _isRowLoaded = ({ index }) => {
        return !!this.props.data.compliance.requirements[index];
    }

    _loadMoreRows = ({ startIndex, stopIndex }) => {
        console.log(" load more ....", startIndex, stopIndex);
    }

    noRowsRenderer = () => {
        return <div className="data-not-found">
            <span>Records Not Found</span>
        </div>
    }

    failedCellRenderer = ({ rowData }) => {
        return (
            <div>
                <span className="text-danger">{rowData.total_count - rowData.passed_count}</span> / <span className="text-success">{rowData.passed_count}</span>
            </div>
        );
    };

    validateCellData = ({...params}) => {
        let cellData = params.cellData
        if (cellData === undefined || cellData === null || cellData === '' || cellData.length === 0) {
            cellData = 'N/A'
        } 
        params['component'] = cellData
        return this.wrapComponentCellRenderer(params)
    }

    changeCellRenderer = ({ rowData }) => {
        return (
            <div>
                <span className={rowData.passed_delta < 0 ? "chip chip-danger" : "chip chip-success"}>
                    {Math.abs(rowData.passed_delta)} <i className={rowData.passed_delta < 0 ? 'fa fa-arrow-down' : 'fa fa-arrow-up'} aria-hidden="true"></i>
                </span>
            </div>
        );
    };

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
        const dataList = this.props.data.compliance.requirements
        const sortedList = dataList;

        return (
            <div className="container">
                <div style={{ height: "100%", maxHeight: "100%"}}>
                    <AutoSizer>
                        {({ height, width }) => (
                            <InfiniteLoader
                                isRowLoaded={this._isRowLoaded}
                                loadMoreRows={this._loadMoreRows}
                                rowCount={dataList.length}
                                height={height}
                                threshold={10}
                            >
                                {({ onRowsRendered, registerChild }) => (
                                    <Table
                                        headerHeight={0}
                                        height={height}
                                        rowCount={dataList.length}
                                        rowGetter={({ index }) => sortedList[index]}
                                        rowHeight={this._cache.rowHeight}
                                        onRowsRendered={onRowsRendered}
                                        noRowsRenderer={this.noRowsRenderer}
                                        width={width}
                                        className="data-table table-no-border"
                                    >


                                        {/* <Column
                                            dataKey="icon"
                                            label="icon"
                                            headerRenderer={headerRenderer}
                                            disableSort={true}
                                            width={5}
                                            flexGrow={1}
                                        /> */}


                                        <Column
                                            dataKey="identifier"
                                            label="Name"
                                            headerRenderer={headerRenderer}
                                            cellRenderer={this.validateCellData}
                                            disableSort={true}
                                            className={"mrL20"}
                                            width={180}
                                            flexGrow={1}
                                            className="font-bold"
                                        />


                                        {/* <Column
                                            dataKey="description"
                                            label="description"
                                            headerRenderer={headerRenderer}
                                            cellRenderer={this.validateCellData}
                                            disableSort={true}
                                            width={250}
                                            flexGrow={2}
                                        /> */}

                                        <Column
                                            dataKey="failed"
                                            label="failed"
                                            headerRenderer={headerRenderer}
                                            cellRenderer={this.failedCellRenderer}
                                            disableSort={true}
                                            width={80}
                                            flexGrow={3}
                                            className="justify-content-center"
                                        />

                                        <Column
                                            dataKey="change"
                                            label="Change"
                                            headerRenderer={headerRenderer}
                                            cellRenderer={this.changeCellRenderer}
                                            disableSort={true}
                                            width={90}
                                            flexGrow={4}
                                            className="justify-content-center"
                                        />


                                    </Table>
                                )}
                            </InfiniteLoader>
                        )}
                    </AutoSizer>

                </div>
            </div>
        );
    }
}


export default ComplianceControlList