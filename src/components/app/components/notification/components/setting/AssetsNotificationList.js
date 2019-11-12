import React, { PureComponent } from "react";

import Loader from 'global/Loader';
import { Checkbox } from '@material-ui/core'
import Switch from '@material-ui/core/Switch'
import Input from '@material-ui/core/Input';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import ListItemText from '@material-ui/core/ListItemText';
import Select from '@material-ui/core/Select';
import ArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';

import { Column, InfiniteLoader, SortDirection, Table, CellMeasurerCache, CellMeasurer } from "react-virtualized";
import AutoSizer from "react-virtualized/dist/commonjs/AutoSizer";
import { headerRenderer } from 'TableHelper/cellRenderer'


class AssetsNotificationList extends PureComponent {
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
        notificationType: [
            "slack",
            "Jira"
        ],
        selectedNotificationType: [],
        checked: []
    };

    currentValue = this.props.filterData

    componentDidMount() {
        this.setState({ dataList: this.getRows() });
    }

    getRows() {
        return [
            {
                event_name: 'New Assets',
                event_description: 'Triggers when a new asset is discovered in the customer cloud infraestructure.',
                notification_type: ['Select Recipients'],
                isEnable:false
            },
            {
                event_name: 'Asset Expired',
                event_description: 'Triggers when an asset is no  longer seen in the customer cloud infraestructure.',
                notification_type: ['Select Recipients'],
                isEnable:false
            },
            {
                event_name: 'Asset Changed',
                event_description: 'Triggers when an asset configuration has been changed in the customer cloud infraestructure.',
                notification_type: ['Select Recipients'],
                isEnable:false
            }
        ]
    }

    //   --------------------Table helper method Start-----------------------

    _isRowLoaded = ({ index }) => {
        return !!this.state.dataList[index];
    }

    _loadMoreRows = ({ startIndex, stopIndex }) => {
        console.log(" load more ....", startIndex, stopIndex);
        //this.setState({ dataList: this.getRows(startIndex + 3) });
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

    handleChange = (index) => (event) => {
        let { notificationType } = this.state
        notificationType = event.target.value;
        
        if(notificationType[0]==='Select Recipients' && notificationType.length > 1){
            notificationType.shift()
        } else if(notificationType.length === 0){
            notificationType[0]='Select Recipients';
        }

        var newDataList = this.state.dataList.filter(function (item, rowIndex) {
            if (index === rowIndex) {
                 item.notification_type = notificationType
            }
            return item
        })
        this.setState({dataList:newDataList})
    }

    notificationTypeCellRenderer = ({ cellData, rowIndex }) => {
        const { notificationType } = this.state
        return (
            <FormControl className="form-control-multiple-select" fullWidth={true}>
                <Select
                    multiple
                    name={'notificationType'}
                    value={cellData}
                    onChange={this.handleChange(rowIndex)}
                    input={<Input id="select-multiple-checkbox" />}
                    renderValue={selected => selected.join(', ')}
                    className="multiple-select-box"
                    MenuProps={{
                        style: {
                            top: '39px'
                        }
                    }}
                >
                    {notificationType.map((item, index) => (
                        <MenuItem className="multiple-select-box-menu" key={index} value={item} name={item}>
                            <ListItemText primary={item} className="multiple-select-box-menu-item" />
                            <Checkbox  color="primary" className="select-item-checkbox" />
                        </MenuItem>
                    ))}

                </Select>
            </FormControl>
        )
    }

    handleChangeDisableEnable = (index) => {
        var newDataList = this.state.dataList.filter(function (item, rowIndex) {
            if (index === rowIndex) {
                 item.isEnable = !item.isEnable
            }
            return item
        })
        this.setState({dataList:newDataList})

    }

    disableEnableCellRender = ({cellData, rowIndex}) => {
        return (
            <Switch
                checked={cellData === true}
                onChange={()=>this.handleChangeDisableEnable(rowIndex)}
                value={cellData}
                className={cellData === true ? "select-control-red" : "select-control-green active"}
            />
        )
    };

    filterOptions = (event) => {

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

            <div className="table-container" style={{ height: "100%", maxHeight: "100%" }}>
                <AutoSizer>
                    {({ height, width }) => (
                        <InfiniteLoader
                            isRowLoaded={this._isRowLoaded}
                            loadMoreRows={this._loadMoreRows}
                            rowCount={3}
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
                                        dataKey="event_name"
                                        label="Event Name"
                                        headerRenderer={headerRenderer}
                                        disableSort={true}
                                        width={300}
                                        flexGrow={1}
                                    />

                                    <Column
                                        dataKey="event_description"
                                        label="Event Description"
                                        headerRenderer={headerRenderer}
                                        disableSort={false}
                                        width={400}
                                        flexGrow={2}
                                        className="justify-content-start"
                                    />

                                    {/* <Column
                                        dataKey="trigger"
                                        label={<span style={{cursor:"pointer"}}>Trigger <ArrowDownIcon className="icon-down-arrow"/></span>}
                                        headerRenderer={headerRenderer}
                                        disableSort={true}
                                        width={150}
                                        flexGrow={3}
                                    /> */}

                                    <Column
                                        dataKey="notification_type"
                                        label="Integration Type"
                                        headerRenderer={headerRenderer}
                                        cellRenderer={this.notificationTypeCellRenderer}
                                        disableSort={true}
                                        width={300}
                                        flexGrow={4}
                                    />

                                    {/* <Column
                                        dataKey="frequency"
                                        label={<span style={{cursor:"pointer"}}>Frequency <ArrowDownIcon className="icon-down-arrow"/></span>}
                                        headerRenderer={headerRenderer}
                                        disableSort={true}
                                        width={200}
                                        flexGrow={5}
                                    /> */}

                                    <Column
                                        dataKey="isEnable"
                                        label="Disable/Enable"
                                        headerRenderer={headerRenderer}
                                        cellRenderer={this.disableEnableCellRender}
                                        disableSort={false}
                                        width={50}
                                        flexGrow={6}
                                    />

                                </Table>
                            )}
                        </InfiniteLoader>
                    )}
                </AutoSizer>
            </div>

        )
    }
}


export default AssetsNotificationList;