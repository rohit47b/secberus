// import "react-virtualized/styles.css";
import Checkbox from '@material-ui/core/Checkbox';
import React, { PureComponent } from "react";
import { Column, InfiniteLoader, SortDirection, SortIndicator, Table } from "react-virtualized";
import AutoSizer from "react-virtualized/dist/commonjs/AutoSizer";
import WithDrawer from 'TableHelper/with-drawer';

import ComplianceControlList from './ComplianceControlList'
import LabelWithHelper from 'hoc/Label/LabelWithHelper';

class ComplianceControl extends PureComponent {

  constructor(props) {
    super(props);

    this.state = {
      headerHeight: 40,
      rowHeight: 25,
      rowCount: 0,
      height: 450,
      sortBy: "columnone",
      sortDirection: SortDirection.ASC,
      count: 10,
      dataList: [],
      checkedA: false,
      toggleRowIndex: -1,
      spinner: true
    };

    this.headerRenderer = this.headerRenderer.bind(this);
    this.sort = this.sort.bind(this);

    this._clearData = this._clearData.bind(this);
    this._isRowLoaded = this._isRowLoaded.bind(this);
    this._loadMoreRows = this._loadMoreRows.bind(this);
    this.actionCellRenderer = this.actionCellRenderer.bind(this);
  }

  componentDidMount() {
    this.timer = setInterval(this.hideSpinner, 5000);
    if (this.props.tabIndex !== 0) {
      this.setState({ toggleRowIndex: 0 })
    }
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  hideSpinner = () => {
    this.setState({spinner: false}, () => {
      clearInterval(this.timer);
    })
  }

  _clearData() {
    this.setState({
      loadedRowCount: 0,
      loadedRowsMap: {},
      loadingRowCount: 0
    });
  }

  _isRowLoaded({ index }) {
    return !!this.state.dataList[index];
  }

  actionCellRenderer = ({ columnIndex, key, parent, rowIndex, style }) => {
    return (
      <div>
        <select className="custom-select">
          <option>Action</option>
          <option>Add</option>
          <option>Update</option>
        </select>
      </div>
    );
  };

  keyCellRenderer = ({ cellData }) => {
    return (
      <div className="d-flex align-item-center text-wrap">
        <span className={"line-indicator line-indicator-" + cellData.toLowerCase()}></span><LabelWithHelper message={cellData + " Controls"} content={"These are the audited rules that apply to the " + cellData + " framework. This will show the compliance status and change since the last audit."} title={cellData.toUpperCase() + " Controls"} />
      </div>
    );
  };

  FailedCellRenderer = ({ cellData }) => {
    return (
      <div className="d-flex align-item-center text-wrap">
        <span>Failed</span><span>/</span><span>Passed</span>
      </div>
    );
  };

  fixedCellRenderer = ({ cellData,columnData }) => {
    return (
      <div>
        {columnData}
      </div>
    );
  };

  _loadMoreRows({ startIndex, stopIndex }) {
    console.log(" load more ....", startIndex, stopIndex);
  }

  isSortEnabled() {
    const list = this.state.dataList;
    const rowCount = this.state.rowCount;
    return rowCount <= list.length;
  }

  sort({ sortBy, sortDirection }) {
    this.setState({ sortBy, sortDirection });
  }

  headerRenderer({ dataKey, label, sortBy, sortDirection }) {
    return (
      <div className="table-td">
        {dataKey === 'checkbox' &&
          <Checkbox
            checked={this.state.checkedA}
            onChange={this.handleCheckbox('checkedA')}
            value="checkedA"
            className="mt-checkbox white-checkbox"
          />}
        {dataKey !== 'checkbox' && label}
        {sortBy === dataKey && <SortIndicator sortDirection={sortDirection} />}
      </div>
    );
  }

  handleCheckbox = name => event => {
    this.setState({ [name]: event.target.checked });
  };

  toggleActiveClass = (toggleRowIndex) => {
    if (this.state.toggleRowIndex !== toggleRowIndex) {
      this.setState({ toggleRowIndex })
    } else {
      this.setState({ toggleRowIndex: -1 })
    }
  }

  noRowsRenderer = () => {
    return <div className="data-not-found-compliance">
        {
          this.state.spinner ? <i className="fa fa-spin fa-fw fa-circle-o-notch spinner-compliance"></i> 
        :
          <span className="data-not-found" >Data Not Found</span>
        }
    </div>
  }

  ruleRenderer = (control) => {
    return (<ComplianceControlList key={control.key + ' Control'} title={control.key} data={control.data} addClass={"line-indicator-" + control.key.toLowerCase()} />);
  }

  render() {
    const {
      headerHeight,
      height,
      rowHeight,
      sortBy,
      sortDirection,
      toggleRowIndex
      // dataList
    } = this.state;
    const {tabIndex} = this.props;
    let dataList = this.props.allControlData;
    const sortedList = dataList;

    return (
      <div>
      {dataList.length > 0 ? <WithDrawer
        drawerContent={(rowProps) => {
          return (<div className="sub-table">{this.ruleRenderer(rowProps.rowData)}</div>);
        }}
        rowsDimensions={dataList.map((dataItem) => ({ collapsedHeight: 50, expandedHeight: 300 }))}
        isExpanded={tabIndex > 0 ? true : false}
      >
        {({ rowHeight, rowRenderer, toggleDrawerWithAnimation, setTableRef, toggleDrawer }) => (
          <div className="table-container" style={{ height: "100%", maxHeight: "100%" }}>
            <AutoSizer disableHeight>
              {({ width }) => (
                <InfiniteLoader
                  isRowLoaded={this._isRowLoaded}
                  loadMoreRows={this._loadMoreRows}
                  rowCount={dataList.length}
                  height={height}
                  threshold={10}
                >
                  {({ onRowsRendered, registerChild }) => (
                    <Table
                      ref={setTableRef}
                      headerHeight={0}
                      height={480}
                      rowCount={dataList.length}
                      rowGetter={({ index }) => sortedList[index]}
                      rowHeight={rowHeight}
                      sort={this.sort}
                      sortBy={sortBy}
                      rowRenderer={rowRenderer}
                      sortDirection={sortDirection}
                      onRowsRendered={onRowsRendered}
                      noRowsRenderer={this.noRowsRenderer}
                      width={width}
                      className="data-table table-no-border table-compliance-report"
                    >

                      <Column
                        className="col-td toggle-row"
                        label=""
                        dataKey="key"
                        width={5}
                        flexGrow={1}
                        headerRenderer={this.headerRenderer}
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
                        dataKey="key"
                        label="key"
                        headerRenderer={this.headerRenderer}
                        cellRenderer={this.keyCellRenderer}
                        disableSort={true}
                        // className={"d-flex align-item-center"}
                        width={180}
                        flexGrow={1}
                      />

                      {/* <Column
                        dataKey="description"
                        label="Description."
                        columnData={"Description"}
                        className={"description-control"}
                        headerRenderer={this.headerRenderer}
                        cellRenderer={this.fixedCellRenderer}
                        disableSort={true}
                        width={300}
                        flexGrow={2}
                      /> */}

                      <Column
                        dataKey="Failed/Passed"
                        label="Failed/Passed"
                        columnData={"Failed/Passed"}
                        className={"failed-control"}
                        headerRenderer={this.headerRenderer}
                        cellRenderer={this.FailedCellRenderer}
                        disableSort={true}
                        width={120}
                        flexGrow={3}
                      />

                      <Column
                        dataKey="Change"
                        label="Change."
                        columnData={"Change"}
                        className={"change-control"}
                        headerRenderer={this.headerRenderer}
                        cellRenderer={this.fixedCellRenderer}
                        disableSort={true}
                        width={100}
                        flexGrow={4}
                      />

                    </Table>
                  )}
                </InfiniteLoader>
              )}
            </AutoSizer>
          </div>
        )}
      </WithDrawer>
      : 
      <div className="data-not-found-compliance">
        {
          this.state.spinner ? <i className="fa fa-spin fa-fw fa-circle-o-notch spinner-compliance"></i> 
        :
          <span className="data-not-found" >Data Not Found</span>
        }
      </div> }</div>
    );
  }
}

export default ComplianceControl;