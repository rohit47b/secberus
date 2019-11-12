import Loader from 'global/Loader'
import React, { PureComponent } from "react"
import { Column, InfiniteLoader, SortDirection, Table } from "react-virtualized"
import AutoSizer from "react-virtualized/dist/commonjs/AutoSizer"
import { headerRenderer } from 'TableHelper/cellRenderer'
import WithDrawer from 'TableHelper/with-drawer'


class RemediationSubTableList extends PureComponent {

    _mounted = false

    state = {
        // Table attribute
        headerHeight: 40,
        rowHeight: 25,
        rowCount: 0,
        height: 450,
        sortBy: "service",
        sortDirection: SortDirection.ASC,

        dataList: [],
        rowIndex: 0,
        loading: true,
    };


    componentDidMount() {
        this.setState({ dataList: this.getRows(2) });
      }


    getRows = (num)=> {
        return [...Array(num).keys()].map(a => ({
          name: `S3 BucketName01`,
          region: `US-East 01`
        }));
      }

  
    //   --------------------Table helper method Start-----------------------

    _isRowLoaded = ({ index }) => {
        return !!this.state.dataList[index];
    }

    _loadMoreRows = ({ startIndex, stopIndex }) => {
        console.log(" load more ....", startIndex, stopIndex);
        this.setState({ dataList: this.getRows(startIndex + 2) });
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


    toggleActiveClass = (toggleRowIndex) => {
        if (this.state.toggleRowIndex !== toggleRowIndex) {
            this.setState({ toggleRowIndex })
        } else {
            this.setState({ toggleRowIndex: -1 })
        }
    }

    ruleRenderer = (index, planId) => {
        return (
        <RemediationSubTableList/>
        );
    }

    _rowGetter = ({ index }) => {
        return this.state.dataList[index];
    }

    //   --------------------Table helper method End-----------------------

    render() {
        const {
            dataList,
            toggleRowIndex,
        } = this.state;

        return (

                <WithDrawer
                    drawerContent={(rowProps) => {
                        return (<div className="sub-table">{this.ruleRenderer(rowProps.index, rowProps.rowData.plan_id)}</div>);
                    }}
                    rowsDimensions={dataList.map((dataItem) => ({ collapsedHeight: 38, expandedHeight: 100 }))}
                >
                    {({ rowHeight, rowRenderer, toggleDrawerWithAnimation, setTableRef }) => (
                        <div style={{ height: "100%", maxHeight: "100%" }}>
                            <AutoSizer>
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
                                                height={height}
                                                width={width}
                                                rowCount={dataList.length}
                                                rowGetter={this._rowGetter}
                                                rowHeight={rowHeight}
                                                rowRenderer={rowRenderer}
                                                noRowsRenderer={this.noRowsRenderer}
                                                className="data-table table-no-border"
                                            >

                                            <Column
                                                    dataKey="-"
                                                    disableSort={true}
                                                    width={400}
                                                    flexGrow={1}
                                                />
                                              
                                            <Column
                                                    dataKey="name"
                                                    disableSort={true}
                                                    width={500}
                                                    flexGrow={2}
                                                />

                                             

                                            </Table>
                                        )}
                                    </InfiniteLoader>
                                )}
                            </AutoSizer>
                        </div>
                    )}
                </WithDrawer>
        )
    }
}




export default RemediationSubTableList