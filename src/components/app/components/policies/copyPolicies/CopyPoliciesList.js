/*
 * @Author: Virendra Patidar 
 * @Date: 2018-09-26 10:01:52 
 * @Last Modified by: Virendra Patidar
 * @Last Modified time: 2018-11-23 15:34:53
 */
import Chip from '@material-ui/core/Chip';
import Switch from '@material-ui/core/Switch';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import NativeSelect from '@material-ui/core/NativeSelect';
import { setProgressBar } from 'actions/commonAction';
import { showMessage } from 'actions/messageAction';
import * as securityPolicyActions from 'actions/securityPolicyAction';
import Loader from 'global/Loader';
import { debounce } from "lodash";
import React, { PureComponent } from "react";
import { Column, InfiniteLoader, SortDirection, Table } from "react-virtualized";
import AutoSizer from "react-virtualized/dist/commonjs/AutoSizer";
import { bindActionCreators } from 'redux';
import { dateCellRenderer, headerRenderer } from 'TableHelper/cellRenderer';
import WithDrawer from 'TableHelper/with-drawer';
import { fetchServiceIconPath } from 'utils/serviceIcon';

class CopyPoliciesList extends PureComponent {

    _mounted = false

    state = {
        // Table helper attribute
        headerHeight: 40,
        rowHeight: 25,
        rowCount: 0,
        height: 450,
        sortBy: "columnone",
        sortDirection: SortDirection.ASC,
        count: 10,
        dataList: [],
        checkedA: false,
        openPolicyDialog: false,
        policyIndex: 0,
        policyId: 0,
        openRuleDialog: false,
        policyIndex: 0,
        ruleIndex: 0,
        ruleId: 0,
        toggleRowIndex: -1,
        filterProgress: false,

        //For edit policy name
        policyName:'',
        policyId:'',
        openEditDialog:false,
        severity: '',
        name: 'severity',
    };


    componentDidMount() {
        this.setState({ dataList: this.getRows(15) });
    }

    getRows(num) {
        return [...Array(num).keys()].map(a => ({
            id: `CC32`,
            ruleSummary: `Risk Identification`,
            ruleId: `AR-801`,
            updateOn: `28-04-11 19:35`,
        }));
    }

    // ---------------- Table helper method start------------------

    _rowGetter = ({ index }) => {
        return this.state.dataList[index];
    }

    _isRowLoaded = ({ index }) => {
        return !!this.state.dataList[index];
    }


    _loadMoreRows = ({ startIndex, stopIndex }) => {
        const filterData = this.props.filterData
    }

    isSortEnabled = () => {
        const list = this.state.dataList;
        const rowCount = this.state.rowCount;
        return rowCount <= list.length;
    }

    sort = ({ sortBy, sortDirection }) => {
        this.setState({ sortBy, sortDirection });
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

    
    
    // ---------------- Table helper method End------------------


    // ---------------- Custom logic method Start------------------


    ruleRenderer = (policyIndex, rules, policyId) => {
        return (
            <div>
                Lorem Ipsum
            </div>
        );
    }

    toggleActiveClass = (toggleRowIndex) => {
        if (this.state.toggleRowIndex !== toggleRowIndex) {
            this.setState({ toggleRowIndex })
        } else {
            this.setState({ toggleRowIndex: -1 })
        }
    }

    handleSwitchChange = name => event => {
        this.setState({ [name]: event.target.checked });
    }
    
    handleChange = name => event => {
        this.setState({ [name]: event.target.value });
      };

    severityCellRenderer = () => {
        const { severity } = this.state
        return (
            <FormControl>
            <NativeSelect
              value={severity}
              onChange={this.handleChange('severity')}
              name="severity"
              className="select-severity"
            >
              <option value="">Low</option>
              <option value={10}>High</option>
              <option value={20}>Moderate</option>
            </NativeSelect>
          </FormControl>
        )
    }

    enableCellRenderer = () => {
        const { checkedA } = this.state
        return (
            <Switch
                checked={checkedA}
                onChange={this.handleSwitchChange('checkedA')}
                value="checkedA"
                className={checkedA===true ? "select-control-green active" :"select-control-green"}
            />
        )
    }

    gaurdrailCellRenderer = () => {
        const { checkedA } = this.state
        return (
            <Switch
                checked={checkedA}
                onChange={this.handleSwitchChange('checkedA')}
                value="checkedA"
                className={checkedA===true ? "select-control-green active" :"select-control-green"}
            />
        )
    }

    // ---------------- Custom logic method end------------------


    render() {
        const {
            height,
            dataList,
            openPolicyDialog,
            openRuleDialog,
            toggleRowIndex,
            policyName,policyId,
            openEditDialog
        } = this.state;

        return (
            <div className="container">
                <WithDrawer
                    drawerContent={(rowProps) => {
                        return (<div className="sub-table">{this.ruleRenderer(rowProps.index, rowProps.rowData.rules_list, rowProps.rowData.id)}</div>);
                    }}
                    rowsDimensions={dataList.map((dataItem) => ({ collapsedHeight: 38, expandedHeight: 300 }))}
                >
                    {({ rowHeight, rowRenderer, toggleDrawerWithAnimation, setTableRef }) => (
                         <div style={{ height: "calc(100% - 400px)", maxHeight: "100%" }}>
                            <AutoSizer height>
                                {({ width, height }) => (
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
                                                                    <span onClick={() => toggleDrawerWithAnimation(rowIndex)}>
                                                                        <i className="fa fa-plus"></i>
                                                                    </span>
                                                                </div>
                                                            );
                                                        }
                                                    }
                                                />
                                                <Column
                                                    dataKey="id"
                                                    label="#"
                                                    headerRenderer={headerRenderer}
                                                    disableSort={!this.isSortEnabled}
                                                    width={50}
                                                    flexGrow={2}

                                                />

                                                <Column
                                                    dataKey="ruleSummary"
                                                    label="Rule Summary"
                                                    headerRenderer={headerRenderer}
                                                    disableSort={!this.isSortEnabled}
                                                    width={200}
                                                    flexGrow={3}
                                                />

                                                <Column
                                                    dataKey="controlId"
                                                    label="Control ID"
                                                    headerRenderer={headerRenderer}
                                                    cellRenderer={this.controlIdCellRenderer}
                                                    disableSort={true}
                                                    width={200}
                                                    flexGrow={4}
                                                />

                                                <Column
                                                    dataKey="ruleId"
                                                    label="Rule #"
                                                    headerRenderer={headerRenderer}
                                                    disableSort={!this.isSortEnabled}
                                                    cellRenderer={dateCellRenderer}
                                                    width={200}
                                                    flexGrow={5}
                                                />
                                                <Column
                                                    dataKey="enabled"
                                                    label="Enabled"
                                                    headerRenderer={headerRenderer}
                                                    disableSort={true}
                                                    cellRenderer={this.enableCellRenderer}
                                                    width={200}
                                                    flexGrow={6}
                                                    className="table-td"
                                                />

                                                   <Column
                                                    dataKey="severity"
                                                    label="Severity"
                                                    headerRenderer={headerRenderer}
                                                    cellRenderer={this.severityCellRenderer}
                                                    disableSort={true}
                                                    width={200}
                                                    flexGrow={8}
                                                />
                                                 <Column
                                                    dataKey="gaurdRail"
                                                    label="Gaurdrail"
                                                    headerRenderer={headerRenderer}
                                                    cellRenderer={this.gaurdrailCellRenderer}
                                                    disableSort={true}
                                                    width={200}
                                                    flexGrow={8}
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
        );
    }
}


function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(Object.assign({}, securityPolicyActions), dispatch),
        showMessage: message => {
            dispatch(showMessage(message))
        }, setProgressBar: isProgress => {
            dispatch(setProgressBar(isProgress))
        }
    };
}

const mapStateToProps = (state, ownProps) => ({
    filterData: state.uiReducer.filterData,
})

export default CopyPoliciesList