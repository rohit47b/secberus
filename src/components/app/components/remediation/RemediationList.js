import React, { PureComponent } from "react"
import { Link } from 'react-router-dom'
import WithDrawer from 'TableHelper/with-drawer'

import Loader from 'global/Loader';
import { LinearProgress } from '@material-ui/core';

import { Column, InfiniteLoader, SortDirection, Table } from "react-virtualized";
import AutoSizer from "react-virtualized/dist/commonjs/AutoSizer";
import { sNoCellRenderer, dateCellRenderer, headerRenderer } from 'TableHelper/cellRenderer';

import RemediationSubTableList from './RemediationSubTableList'

import { withRouter } from 'react-router-dom'
import { connect } from "react-redux"
import { bindActionCreators } from 'redux'


import * as remediationActions from 'actions/remediationAction'
import { showMessage } from 'actions/messageAction'
import { setProgressBar } from 'actions/commonAction'

class RemediationList extends PureComponent {

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
        completed: 25,
    };


    componentDidMount() {
        this.fetchRemediationPlans()
    }


    fetchRemediationPlans() {
        let payload = {}

        /* this.props.actions.fetchRemediationPlans(payload).
            then(result => {
                if (typeof result !== 'string') {
                    this.setState({ dataList: result.remediation_plans, loading: false })
               } else {
                   console.log(' Error in fetching remediation plans :- ',result);
               }
            }); */
            let result = []
            let status = ['Progress', 'Canceled', 'Stoped']
            let dates = [
                '02-01-2019 11:14 AM',
                '02-02-2019 09:09 PM',
                '02-03-2019 06:14 AM',
                '02-04-2019 05:43 PM',
                '02-05-2019 07:57 AM',
                '02-06-2019 03:55 PM',
                '02-07-2019 09:51 AM',
                '02-08-2019 11:03 PM',
                '02-09-2019 04:50 AM',
                '02-10-2019 05:39 PM',
                '02-11-2019 05:10 AM',
                '02-12-2019 08:57 PM',
                '02-13-2019 06:52 AM',
                '02-14-2019 07:59 PM',
                '02-15-2019 08:53 AM',
                '02-16-2019 03:15 PM',
                '02-17-2019 05:27 AM',
                '02-18-2019 08:31 PM',
                '02-19-2019 07:06 AM',
                '02-20-2019 04:17 PM'
            ];
            for (var i = 0; i < 20; i++) { 
                result[i] = {
                    planId: i,
                    progress: Math.floor(Math.random() * 100),
                    status: status[Math.floor(Math.random() * 3)],
                    created_at: dates[Math.floor(Math.random() * 20)]

                }
            }

            this.setState({ dataList: result, loading: false })
    }

    progress = () => {
        const { completed } = this.state;
        if (completed === 100) {
            this.setState({ completed: 0 })
        } else {
            const diff = Math.random() * 10
            this.setState({ completed: Math.min(completed + diff, 100) })
        }
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

    progressCellRenderer = () => {
        const { completed } = this.state
        return (
            <div className="progress-bar progress-warning" style={{ flexGrow: "1" }}>
                <LinearProgress variant="determinate" value={completed} />
            </div>
        )
    }

    generateReportRenderer = () => {
        return (
            <Link target="_blank" to="/remediation-report"><i className="fa fa-file-pdf-o" aria-hidden="true" ></i></Link>
        )
    }

    toggleActiveClass = (toggleRowIndex) => {
        if (this.state.toggleRowIndex !== toggleRowIndex) {
            this.setState({ toggleRowIndex })
        } else {
            this.setState({ toggleRowIndex: -1 })
        }
    }

    ruleRenderer = (index, planId) => {
        return (<RemediationSubTableList planId={planId} />);
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

            <div className="container">
                <WithDrawer
                    drawerContent={(rowProps) => {
                        return (<div className="sub-table">{this.ruleRenderer(rowProps.index, rowProps.rowData.plan_id)}</div>);
                    }}
                    rowsDimensions={dataList.map((dataItem) => ({ collapsedHeight: 38, expandedHeight: 300 }))}
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
                                                headerHeight={39}
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
                                                    dataKey="planId"
                                                    label="Plan ID"
                                                    headerRenderer={headerRenderer}
                                                    cellRenderer={sNoCellRenderer}
                                                    disableSort={true}
                                                    width={100}
                                                    flexGrow={1}
                                                />

                                                <Column
                                                    dataKey="progress"
                                                    label="Progress"
                                                    headerRenderer={headerRenderer}
                                                    cellRenderer={this.progressCellRenderer}
                                                    disableSort={false}
                                                    width={300}
                                                    flexGrow={2}

                                                />

                                                <Column
                                                    dataKey="status"
                                                    label="Status"
                                                    headerRenderer={headerRenderer}
                                                    disableSort={false}
                                                    width={200}
                                                    flexGrow={3}
                                                />

                                                <Column
                                                    dataKey="created_at"
                                                    label="Created"
                                                    headerRenderer={headerRenderer}
                                                    cellRenderer={dateCellRenderer}
                                                    disableSort={false}
                                                    width={200}
                                                    flexGrow={4}
                                                />

                                                <Column
                                                    dataKey="generateReport"
                                                    label="Generate Report"
                                                    headerRenderer={headerRenderer}
                                                    cellRenderer={this.generateReportRenderer}
                                                    disableSort={true}
                                                    width={150}
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

            </div>
        )
    }
}


const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators(Object.assign({}, remediationActions), dispatch),
        showMessage: message => {
            dispatch(showMessage(message))
        }, setProgressBar: isProgress => {
            dispatch(setProgressBar(isProgress))
        }
    };
}

export default withRouter(connect(null, mapDispatchToProps)(RemediationList))