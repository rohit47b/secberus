import React, { PureComponent } from "react";

import Switch from '@material-ui/core/Switch';
import Loader from 'global/Loader';
import { Column, InfiniteLoader, SortDirection, Table } from "react-virtualized";
import AutoSizer from "react-virtualized/dist/commonjs/AutoSizer";
import { headerRenderer } from 'TableHelper/cellRenderer'
import { setActiveMenu,setActiveParentMenu } from 'actions/commonAction';
import * as securityPolicyActions from 'actions/securityPolicyAction'
import { connect } from 'react-redux';
import history from 'customHistory';
import { bindActionCreators } from 'redux'
import ConfirmDialogBoxHOC from 'hoc/DialogBox'
import { cloneDeep } from "lodash"

class PolicyList extends PureComponent {

    _mounted = false

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
        checkedA: false,

        loaded: false,
        openDialog: false,
        rowIndex: 0,
        pageNo: 0,
        isMoreData: true,
        perPage: 50,

        openStatusDialog:false,
        currentStatus:true,
        filterProgress:true
    };

    componentDidMount() {
        this.fetchPolicyList()
    }

    fetchPolicyList() {
        let payload = {
        }

        this.props.actions.fetchPolicyList(payload).
            then(result => {
                if (typeof result !== 'string') {
                    this.setState({ dataList: result });
                  } else {
                    console.log(' Error in fetching policies :- ', result);
                  }
                  this.setState({filterProgress:false})
       
            });
    }

    //   --------------------Table helper method Start-----------------------

    _isRowLoaded = ({ index }) => {
        return !!this.state.dataList[index];
    }

    _loadMoreRows = ({ startIndex, stopIndex }) => {
        console.log(" load more ....", startIndex, stopIndex);
        //this.setState({ dataList: this.getRows(startIndex + 10) });
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

    handleSwitchChange = name => event => {
        this.setState({ [name]: event.target.checked });
    }

    enableCellRenderer  = ({ cellData,rowIndex }) => {
        const cellValue=cellData===true
        return (
            <Switch
                checked={cellData===true}
                onChange={()=>this.statusChangeDialog(cellData,rowIndex)}
                value={cellValue+""}
                className={cellData === true ? "select-control-green active" : "select-control-red"}
            />
        )
    }


    redirectToRulePage = () => {
        this.props.setActiveMenu('Security Rules')
        this.props.setActiveParentMenu('Governance')
        history.push('/app/rules')
    }

    anchorCellRenderer = ({ cellData }) => {
        return (
            <div>
                <a href="javascript:void(0)" onClick={() => this.redirectToRulePage()}>{cellData}</a>
            </div>
        );
    };

    suppressedCountCellRenderer = ({ cellData }) => {
        return (
            <div>
                {cellData > 0 ? <span className="text-danger mrR5">{cellData}</span>:cellData}
            </div>
        );
    };

    ruleCountCellRenderer = ({ rowData }) => {
        return (
            <div>
                {rowData.rules.length === 0 ? <span className="text-danger mrR5">{rowData.rules.length}</span>:rowData.rules.length}
            </div>
        );
    };

    
    reportIconCellRender = ({ cellData }) => {
        return (
            <div>
                <span className="link-hrf"><i className="fa fa-file-pdf-o" aria-hidden="true" ></i></span>
            </div>
        );
    };


  handleDialogClose = () => {
    this.setState({ openStatusDialog: false })
  }


  statusChangeDialog = (cellData,rowIndex ) => {
    this.setState({ openStatusDialog: true, rowIndex,currentStatus:cellData });
  }




  enableDisablePolicy = () => {
    const dataList = cloneDeep(this.state.dataList)
    let newDataList = dataList.map((row, sidx) => {
      if (this.state.rowIndex !== sidx) {
        return row;
      } else {
        const currentStatus = this.state.currentStatus;
        return { ...row, enable: !currentStatus };
      }
    });
    this.setState({ dataList: newDataList,openStatusDialog: false }, () => {
    });
  }


    //   --------------------Table helper method End-----------------------

    render() {
        const {
            headerHeight,
            sortBy,
            sortDirection,
            dataList,
            openStatusDialog,
            currentStatus
        } = this.state;

        const sortedList = dataList;

        return (
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
                                    headerHeight={headerHeight}
                                    height={height}
                                    rowCount={dataList.length}
                                    rowGetter={({ index }) => sortedList[index]}
                                    rowHeight={40}
                                    //sort={this.sort}
                                    sortBy={sortBy}
                                    sortDirection={sortDirection}
                                    onRowsRendered={onRowsRendered}
                                    noRowsRenderer={this.noRowsRenderer}
                                    width={width}
                                    className="data-table table-no-border"
                                >

                                    <Column
                                        dataKey="name"
                                        label="Name"
                                        headerRenderer={headerRenderer}
                                        cellRenderer={this.anchorCellRenderer}
                                        disableSort={true}
                                        width={200}
                                        flexGrow={1}
                                    />

                                    <Column
                                        dataKey="totalRules"
                                        label="Total Rules"
                                        headerRenderer={headerRenderer}
                                        cellRenderer={this.ruleCountCellRenderer}
                                        disableSort={false}
                                        width={100}
                                        flexGrow={2}
                                    />

                                    <Column
                                        dataKey="suppressedRules"
                                        label="Suppressed Rules"
                                        headerRenderer={headerRenderer}
                                        cellRenderer={this.suppressedCountCellRenderer}
                                        disableSort={false}
                                        width={100}
                                        flexGrow={3}
                                    /> 

                                    <Column
                                        dataKey="created_by"
                                        label="Author"
                                        headerRenderer={headerRenderer}
                                        disableSort={false}
                                        width={100}
                                        flexGrow={4}
                                    />

                                    <Column
                                        dataKey="create_date"
                                        label="Update On"
                                        headerRenderer={headerRenderer}
                                        disableSort={true}
                                        width={100}
                                        flexGrow={5}

                                    />

                                    <Column
                                        dataKey="enable"
                                        label="Enable / Disable"
                                        headerRenderer={headerRenderer}
                                        cellRenderer={this.enableCellRenderer}
                                        disableSort={false}
                                        width={150}
                                        flexGrow={6}
                                    />

                                    <Column
                                        dataKey="enable"
                                        label="Generate Compliance Report"
                                        headerRenderer={headerRenderer}
                                        cellRenderer={this.reportIconCellRender}
                                        disableSort={false}
                                        width={200}
                                        flexGrow={7} 
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
                    cancelBtnLabel={"CANCEL"}
                    confirmBtnLabel={currentStatus === true ? "DISABLE":"ENABLE"}
                    content={currentStatus === true ? 'Disabling a Policy will terminate reports for this policy. If the disabled Policy is a Compliance Policy (ie. HIPAA, PCI, CIS, etc.), it will no longer appear in your dashboard.' : 'Are you sure you want to enable this policy ?'}
                    successDialogEvent={this.enableDisablePolicy} />
            </div>
        );
    }
}


const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators(Object.assign({}, securityPolicyActions), dispatch),
        setActiveMenu: activeMenu => {
            dispatch(setActiveMenu(activeMenu))
        },  setActiveParentMenu: activeMenu => {
            dispatch(setActiveParentMenu(activeMenu))
        }
    };
}


export default connect(null, mapDispatchToProps)(PolicyList);