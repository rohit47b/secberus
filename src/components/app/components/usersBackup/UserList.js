import React, { PureComponent } from "react";

import Fade from '@material-ui/core/Fade';
import Popper from '@material-ui/core/Popper';
import Loader from 'global/Loader';
import { List, ListItem, ListItemText, Checkbox } from '@material-ui/core'
import Switch from '@material-ui/core/Switch';

import { Column, InfiniteLoader, SortDirection, Table } from "react-virtualized";
import AutoSizer from "react-virtualized/dist/commonjs/AutoSizer";
import { sNoCellRenderer } from 'TableHelper/cellRenderer';

class UserList extends PureComponent {

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

        checkedA: true,

        pageNo: 0,
        isMoreData: true,
        perPage: 50,

        filterProgress: false,
        anchorEl: null,

        //Used for open filter dialog
        placement: null,
        popperEl: null,
        openPopOver: false,
        checked: [0],

        // Used for header filter list
        enableDisableFilterList: [{ name: 'Active', value: 'Active' }, { name: 'In-Active', value: 'Inactive' }],
        yesNoFilterList: [{ name: 'Yes', value: 'yes' }, { name: 'No', value: 'no' }],
        filterList: [],
    };


    componentDidMount() {
        this.setState({ dataList: this.getRows(15) });
    }

    getRows(num) {
        return [...Array(num).keys()].map(a => ({
            userName: `John smith`,
            account: `Acme-Production`
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


    creationOnCellRenderer = () => {
        return (
            <div>
                <div>
                    2018-05-18 00:06:31
                </div>
                <div className="font-bold">3 months ago</div>
            </div>
        )
    }

    lastLoginCellRenderer = () => {
        return (
            <div>
                <div>
                    2018-05-18 00:06:31
                </div>
                <div className="font-bold">3 months ago</div>
            </div>
        )
    }

    passwordAgeCellRenderer = () => {
        return (
            <div>
                <div>
                    2018-05-18 00:06:31
                </div>
                <div className="font-bold">3 months ago</div>
            </div>
        )
    }

    mfaEnabledCellRenderer = ({ cellData }) => {
        return (
            <div>
            <span className="chip-sm chip-red">No</span>
        </div>
        )
    }

    statusCellRenderer = ({ cellData }) => {
        return (
            <div>
                <span className="chip-sm chip-green">Active</span>
            </div>
        )
    }

    accessKeyCellRenderer = () => {
        return (
            <div>
                None
            </div>
        )
    }

    viewCellRenderer = () => {
        return (
            <span className="fnt-16 text-gray" style={{cursor:"pointer"}}>
                <i className="fa fa-history" aria-hidden="true"></i>
            </span>
        )
    }



    handleClick = (placement, dataKey) => (event) => {
        const { currentTarget } = event;
        if (dataKey === 'mfaEnabled') {
            this.setState(state => ({
                popperEl: currentTarget,
                openPopOver: state.placement !== placement || !state.openPopOver,
                placement,
                filterList: state.yesNoFilterList
            }));
        } else if (dataKey === 'status') {
            this.setState(state => ({
                popperEl: currentTarget,
                openPopOver: state.placement !== placement || !state.openPopOver,
                placement,
                filterList: state.enableDisableFilterList
            }));
        } else {
            this.setState(state => ({
                popperEl: null,
                openPopOver: false,
                placement: null,
            }));
        }
    };

    headerRenderer = ({ dataKey, label, sortBy, sortDirection }) => {

        const { popperEl, openPopOver, placement, filterList } = this.state;

        return (
            <div className="table-td">
                {(dataKey === 'mfaEnabled' || dataKey === 'status' ) ? <span onClick={this.handleClick('bottom-start', dataKey)}>{label}  <i class="fa fa-filter" aria-hidden="true"></i> </span> : <span>{label}</span>}
                {(dataKey === 'mfaEnabled' || dataKey === 'status' ) && <Popper style={{ zIndex: '10', marginTop: '10px' }} open={openPopOver} anchorEl={popperEl} placement={placement} transition>
                    {({ TransitionProps }) => (
                        <Fade {...TransitionProps} timeout={350}>
                            <div>
                                <List className="list-filter">
                                    <ListItem className="list-search-filter">
                                        <input placeholder="Search" autoFocus type="text" />
                                    </ListItem>
                                    {filterList.map(item => (
                                        <ListItem className="list-filter-item" key={item.name} role={undefined} dense button>
                                            <Checkbox
                                                checked={this.state.checked.indexOf(item.value) !== -1}
                                                tabIndex={-1}
                                                disableRipple
                                                className="filter-checkbox"
                                                color="primary"
                                            />
                                            <ListItemText className="list-filter-text" primary={item.name} />

                                        </ListItem>
                                    ))}
                                </List>
                            </div>
                        </Fade>
                    )}
                </Popper>}
            </div>
        );
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
                                    rowHeight={60}
                                    //sort={this.sort}
                                    sortBy={sortBy}
                                    sortDirection={sortDirection}
                                    onRowsRendered={onRowsRendered}
                                    noRowsRenderer={this.noRowsRenderer}
                                    width={width}
                                    className="data-table table-no-border"
                                >

                                    <Column
                                        dataKey="userName"
                                        label="User Name"
                                        headerRenderer={this.headerRenderer}
                                        disableSort={true}
                                        width={100}
                                        flexGrow={1}
                                    />

                                    <Column
                                        dataKey="account"
                                        label="Account"
                                        headerRenderer={this.headerRenderer}
                                        disableSort={false}
                                        width={100}
                                        flexGrow={2}

                                    />

                                    <Column
                                        dataKey="groups"
                                        label="Groups"
                                        headerRenderer={this.headerRenderer}
                                        disableSort={false}
                                        width={100}
                                        flexGrow={3}
                                    />

                                    <Column
                                        dataKey="creationOn"
                                        label="Creation On"
                                        headerRenderer={this.headerRenderer}
                                        cellRenderer={this.creationOnCellRenderer}
                                        disableSort={false}
                                        width={150}
                                        flexGrow={4}
                                    />

                                    <Column
                                        dataKey="passwordAge"
                                        label="Password Age"
                                        headerRenderer={this.headerRenderer}
                                        cellRenderer={this.passwordAgeCellRenderer}
                                        disableSort={true}
                                        width={150}
                                        flexGrow={5}

                                    />

                                    <Column
                                        dataKey="lastLogin"
                                        label="Last Login"
                                        headerRenderer={this.headerRenderer}
                                        cellRenderer={this.lastLoginCellRenderer}
                                        disableSort={false}
                                        width={150}
                                        flexGrow={6}
                                    />

                                    <Column
                                        dataKey="mfaEnabled"
                                        label={"MFA Enabled"}
                                        headerRenderer={this.headerRenderer}
                                        cellRenderer={this.mfaEnabledCellRenderer}
                                        disableSort={false}
                                        width={100}
                                        flexGrow={7}
                                    />

                                    <Column
                                        dataKey="status"
                                        label={"Status"}
                                        headerRenderer={this.headerRenderer}
                                        cellRenderer={this.statusCellRenderer}
                                        disableSort={false}
                                        width={60}
                                        flexGrow={8}
                                    />

                                    <Column
                                        dataKey="accessKey"
                                        label="Access Key"
                                        headerRenderer={this.headerRenderer}
                                        cellRenderer={this.accessKeyCellRenderer}
                                        disableSort={false}
                                        width={100}
                                        flexGrow={9}
                                    />
                                   
                                    <Column
                                        dataKey="view"
                                        label="View"
                                        headerRenderer={this.headerRenderer}
                                        cellRenderer={this.viewCellRenderer}
                                        disableSort={false}
                                        width={100}
                                        flexGrow={10}
                                    />

                                </Table>
                            )}
                        </InfiniteLoader>
                    )}
                </AutoSizer>
            </div>
        );
    }
}


export default UserList