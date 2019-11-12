/*
 * @Author: Virendra Patidar 
 * @Date: 2018-09-26 11:24:36 
 * @Last Modified by: Virendra Patidar
 * @Last Modified time: 2018-09-26 17:17:41
 */
import React from 'react'

import {
    Table,
    Column,
    InfiniteLoader
} from "react-virtualized"
import AutoSizer from "react-virtualized/dist/commonjs/AutoSizer"

import { headerRenderer, sNoCellRenderer } from 'TableHelper/cellRenderer'


const InfiniteScrollTable = (props) => {
    const { columns, sort, sortBy, sortDirection, threshold, height, headerHeight, tableHeight, rowHeight, dataList, rowCount, _loadMoreRows, noRowsRenderer, _isRowLoaded } = props
    const sortedList = dataList;
    return (<AutoSizer disableHeight>
        {({ width }) => (
            <InfiniteLoader
                isRowLoaded={_isRowLoaded}
                loadMoreRows={_loadMoreRows}
                rowCount={rowCount}
                height={height}
                threshold={threshold}
            >
                {({ onRowsRendered, registerChild }) => (
                    <Table
                        headerHeight={headerHeight}
                        height={tableHeight}
                        rowCount={dataList.length}
                        rowGetter={({ index }) => sortedList[index]}
                        rowHeight={rowHeight}
                        sort={sort}
                        sortBy={sortBy}
                        sortDirection={sortDirection}
                        onRowsRendered={onRowsRendered}
                        noRowsRenderer={noRowsRenderer}
                        width={width}
                        className="data-table"
                    >

                        {columns.map((column, index) => {
                            return <Column key={column.dataKey}
                                dataKey={column.dataKey}
                                label={column.label}
                                headerRenderer={headerRenderer}
                                cellRenderer={column.cellRenderer}
                                disableSort={column.isDisabled}
                                width={column.width}
                                flexGrow={index}
                                className={column.className}
                            />
                        })}

                    </Table>
                )}
            </InfiniteLoader>
        )}
    </AutoSizer>)
}

export default InfiniteScrollTable;