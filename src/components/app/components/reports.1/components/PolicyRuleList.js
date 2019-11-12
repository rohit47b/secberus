/*
 * @Author: Virendra Patidar 
 * @Date: 2018-09-10 10:54:33 
 * @Last Modified by: Virendra Patidar
 * @Last Modified time: 2019-01-09 16:47:41
 */
import React, { PureComponent } from 'react'

import Grid from '@material-ui/core/Grid'
import Chip from '@material-ui/core/Chip'

import {
    Table,
    Column,
    CellMeasurer,
    CellMeasurerCache
} from "react-virtualized"
import AutoSizer from "react-virtualized/dist/commonjs/AutoSizer"

import { convertDateFormatWithTime } from 'utils/dateFormat'

import Loader from 'global/Loader'

import { wrapTextCellRenderer, timeAgoCellRenderer } from 'TableHelper/cellRenderer'
import WithDrawer from 'TableHelper/with-drawer'


const cache = new CellMeasurerCache({
    fixedWidth: true,
    minHeight: 100,
});


class PolicyRuleList extends PureComponent {

    state = {
        height: 100,
        toggleRuleIndex: -1,
        isProgress: true,
        pageNo: 1
    }


    componentDidMount() {
        this.setState({ isProgress: false })
    }


    static getDerivedStateFromProps(nextProps, state) {
        return { dataList: nextProps.dataList }
    }


    componentDidUpdate = (prevProps, prevState) => {
        if (this.props.dataList !== prevProps.dataList) {
            this.setState({ isProgress: false })
        }
        this.setState({ isProgress: false })
    }

    ruleRenderer = (rowData) => {
        return (
            <Grid container spacing={24}>
                <Grid item sm={7}>
                    <div className="panel-desc">
                        <h4 className="mrT0 mrB5">Description:</h4>
                        <div>
                            {rowData.description}
                        </div>
                    </div>
                </Grid>
                <Grid item sm={5}>
                    <div className="host-name">
                        <div className="update-time">
                            Last Update:{convertDateFormatWithTime(rowData.executed_at)}
                        </div>
                        <div className="chip-host">
                            {
                                rowData.offender_attr !== null && rowData.offenders.map((offender, index) => {
                                    return <Chip key={offender} label={rowData.offender_attr[offender].Identifier} className="chip-gray mrB5" />
                                })
                            }
                        </div>
                    </div>
                </Grid>
            </Grid>
        );
    }


    _rowGetter = ({ index }) => {
        return this.props.dataList[index];
    }

    _loadMoreRows({ startIndex, stopIndex }) {
        const filterData = this.props.filterData
        this.fetchPolicyDetailReport(filterData)
    }

    _isRowLoaded({ index }) {
        return !!this.props.dataList[index];
    }


    policyCellRender = ({ cellData, columnIndex, key, parent, rowIndex, style }) => {
        return (
            <CellMeasurer
                cache={cache}
                columnIndex={columnIndex}
                key={key}
                parent={parent}
                rowIndex={rowIndex}
            >
                <div
                    style={{
                        ...style,
                        whiteSpace: 'normal'
                    }}>
                    <span className="rule-name">{cellData}</span>
                </div>
            </CellMeasurer>
        );
    };

    severityCellRender = ({ cellData }) => {
        const severityClass = cellData === 'MEDIUM' ? 'text-warning' : cellData === 'LOW' ? 'text-gray' : cellData === 'HIGH' ? 'text-success' : 'text-danger'
        return (
            <div className="pdR40">
                 <span className={severityClass}><i className="fa fa-circle"></i></span> 
            </div>
        );
    };

    complianceCellRender = ({ cellData }) => {
        return (
            <div className="pdR40">
                {cellData.toUpperCase()}
            </div>
        );
    };


    noRowsRenderer = () => {
        if (!this.props.filterProgress) {
            return (<div className="data-not-found">
                <span>Records Not Found</span>
            </div>)
        }
        else if (this.props.filterProgress) {
            return <Loader />
        }
    }

    policyTagCellRender = ({ cellData }) => {
        return (
            cellData.map((policy) => {
                return <div key={policy.id}>
                    <Chip label={policy.name} className="chip-gray" />
                </div>
            })
        );
    };

    accountCellRender = ({ cellData }) => {
        return (
            <div>
                Account
                </div>
        );
    };



    scrollEvent = ({ clientHeight, scrollHeight, scrollTop }) => {
        if (this.props.dataList.length % 50 >= 0 && scrollTop > 0 && clientHeight > 0) {
            this.props.fetchNextPageData()
        }
    }


    isActiveClassHandle = (rowIndex) => {
        if (rowIndex !== this.state.toggleRuleIndex) {
            this.setState({ toggleRuleIndex: rowIndex });
        } else {
            this.setState({ toggleRuleIndex: -1 });
        }
    }


    wrapTextCellRenderer = ({ cellData, columnIndex, key, parent, rowIndex, style }) => {
        return (
            <CellMeasurer
                cache={cache}
                columnIndex={columnIndex}
                key={key}
                parent={parent}
                rowIndex={rowIndex}
            >
                <div
                    style={{
                        ...style,
                        whiteSpace: 'normal'
                    }}>
                    {cellData}
                </div>
            </CellMeasurer>
        );
    }

    render() {
        const { dataList } = this.props
        const { height, toggleRuleIndex, isProgress } = this.state
        return (
            <div className="container">
                {isProgress && <Loader />}
                <WithDrawer
                    drawerContent={(rowProps) => {
                        return (<div className="sub-table">{this.ruleRenderer(rowProps.rowData)}</div>);
                    }}
                    rowsDimensions={dataList.map((dataItem) => ({ collapsedHeight: 40, expandedHeight: 250 }))}
                >
                    {({ rowHeight, rowRenderer, toggleDrawer, toggleDrawerWithAnimation, setTableRef }) => (

                        <AutoSizer disableHeight>
                            {({ width }) => (

                                <Table
                                    ref={setTableRef}
                                    headerHeight={40}
                                    height={480}
                                    width={width}
                                    rowCount={dataList.length}
                                    rowGetter={this._rowGetter}
                                    rowHeight={rowHeight}
                                    rowRenderer={rowRenderer}
                                    className="data-table table-sec table-aws-rule table-ellipse table-border"
                                    noRowsRenderer={this.noRowsRenderer}
                                    onScroll={this.scrollEvent}
                                >

                                    <Column
                                        className="table-td toggle-row"
                                        label="Rule ID"
                                        dataKey="rule_id"
                                        width={150}
                                        flexGrow={1}
                                        headerRenderer={this.headerRenderer}
                                        cellRenderer={
                                            ({ cellData, rowIndex }) => {
                                                return (
                                                    <div onClick={() => this.isActiveClassHandle(rowIndex)} className={rowIndex === toggleRuleIndex ? 'active' : ''}>
                                                        <a href="javascript:void(0)" onClick={() => toggleDrawerWithAnimation(rowIndex)}>
                                                            {cellData}
                                                        </a>
                                                    </div>
                                                );
                                            }
                                        }
                                    />
                                    <Column
                                        className="table-td"
                                        dataKey="priority"
                                        label="Severity"
                                        cellRenderer={this.severityCellRender}
                                        disableSort={true}
                                        width={75}
                                        flexGrow={2}
                                    />
                                    <Column
                                        className="table-td"
                                        dataKey="description"
                                        label="Description"
                                        cellRenderer={wrapTextCellRenderer}
                                        disableSort={!this.isSortEnabled}
                                        width={150}
                                        flexGrow={3}

                                    />
                                    <Column
                                        className="table-td"
                                        dataKey="rule_type"
                                        label="Type"
                                        cellRenderer={wrapTextCellRenderer}
                                        disableSort={!this.isSortEnabled}
                                        width={200}
                                        flexGrow={4}
                                    />
                                    <Column
                                        className="table-td"
                                        dataKey="policy_name"
                                        label="Policy Tag"
                                        cellRenderer={this.policyTagCellRender}
                                        disableSort={!this.isSortEnabled}
                                        width={150}
                                        flexGrow={5}

                                    />
                                    <Column
                                        className="table-td"
                                        dataKey="executed_at"
                                        label="Last Seen"
                                        cellRenderer={timeAgoCellRenderer}
                                        disableSort={!this.isSortEnabled}
                                        width={100}
                                        flexGrow={6}

                                    />
                                    {/* <Column
                                        className="table-td"
                                        dataKey="account"
                                        label="Account"
                                        //cellRenderer={this.accountCellRender}
                                        disableSort={!this.isSortEnabled}
                                        width={100}
                                        flexGrow={7}
                                    /> */}
                                    <Column
                                        className="table-td"
                                        dataKey="compliance"
                                        label="Compliance"
                                        cellRenderer={this.complianceCellRender}
                                        disableSort={!this.isSortEnabled}
                                        width={100}
                                        flexGrow={8}

                                    />
                                </Table>
                            )}
                        </AutoSizer>

                    )}
                </WithDrawer>
            </div>
        )
    }
}
export default PolicyRuleList;
