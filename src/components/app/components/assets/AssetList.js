import React, { PureComponent } from "react";

import Fade from '@material-ui/core/Fade';
import Popper from '@material-ui/core/Popper';
import Loader from 'global/Loader';
import { List, ListItem, ListItemText, Checkbox } from '@material-ui/core'
import Switch from '@material-ui/core/Switch';

import { Column, InfiniteLoader, SortDirection, Table, CellMeasurerCache, CellMeasurer } from "react-virtualized";
import AutoSizer from "react-virtualized/dist/commonjs/AutoSizer";
import { sNoCellRenderer } from 'TableHelper/cellRenderer';

import { withRouter } from 'react-router-dom'

import { connect } from "react-redux"
import { bindActionCreators } from 'redux'

import * as assetsActions from 'actions/assetsAction'
import { showMessage } from 'actions/messageAction'
import { setProgressBar, setCountAssets } from 'actions/commonAction'


class AssetList extends PureComponent {

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
        checked: [],

        // Used for header filter list
        enableDisableFilterList: [{ name: 'Enabled', value: 'enabled' }, { name: 'Disabled', value: 'Disabled' }],
        yesNoFilterList: [{ name: 'Yes', value: 'yes' }, { name: 'No', value: 'no' }],
        filterList: [],
    };

    currentValue = this.props.filterData

    componentDidMount() {
        this.setState({ dataList: this.getRows(15) });
        this.fetchAssets()
        this.fetchAssetsExcludedList()
    }

    getRows(num) {
        let owners = [
            'F.LendeBorg',
            'J.Zazueta',
            'J.Diaz',
            'A.Smith',
            'B.Johnson',
            'C.Wiliams',
            'D.Brown',
            'E.Jones',
            'F.García',
            'G.Miller',
            'H.Davis',
            'I.Rodríguez',
            'L.Martínez',
            'M.Rivera',
            'O.Taylor'
        ]
        let regions = [
            'us-east-1',
            'us-east-2',
            'us-west-1',
            'us-west-2',
            'ca-central-1',
            'eu-central-1',
            'eu-west-1',
            'eu-west-2',
            'eu-west-3',
            'eu-north-1',
            'ap-northeast-1',
            'ap-northeast-2',
            'ap-northeast-3',
            'ap-southeast-1',
            'ap-southeast-2',
            'ap-south-1',
            'sa-east-1'
            ];
        let bin = ['Yes', 'No']
        return [...Array(num).keys()].map(a => ({
            bucketName: `Bucket 1234`,
            tags: [`Prod Dev`],
            encrypted: bin[Math.floor(Math.random() * 2)],
            isPublic: bin[Math.floor(Math.random() * 2)],
            owner: owners[Math.floor(Math.random() * 15)],
            region: regions[Math.floor(Math.random() * 17)],
            assetWeight: String(Math.floor(Math.random() * 10))
        }));
    }

    //   --------------------Table helper method Start-----------------------

    _isRowLoaded = ({ index }) => {
        return !!this.state.dataList[index];
    }

    fetchAssets() {
        let payload = {}

        this.props.actions.fetchAssets(payload).
            then(result => {
                if (typeof result !== 'string') {
                    
               } else {
                   console.log(' Error in fetching Assets :- ',result);
               }
            });
    }


    SetScoreAssets(data) {
        this.props.actions.setScoreAssets(data).
                then(result => {
                    if (this._mounted) {
                        if (result && !(typeof result === 'string')) {
                            let message = { message: result, showSnackbarState: true, variant: 'error' }
                            this.props.showMessage(message)
                        }
                    }
                })
    }

    SetMaxScoreAssets(data) {
        this.props.actions.setMaxScoreAssets(data).
                then(result => {
                    if (this._mounted) {
                        if (result && !(typeof result === 'string')) {
                            this.props.actions.setScoreAssets(data).
                                then(result => {
                                    if (this._mounted) {
                                        if (result && (typeof result === 'string')) {
                                            let message = { message: result, showSnackbarState: true, variant: 'error' }
                                            this.props.showMessage(message)
                                        }
                                    }
                                })
                        } else {
                            let message = { message: result, showSnackbarState: true, variant: 'error' }
                            this.props.showMessage(message)
                        }
                    }
                })
    }

    fetchAssetsExcludedList() {
        let payload = {}

        this.props.actions.fetchAssetsExcludedList(payload).
            then(result => {
                if (typeof result !== 'string') {
                   
               } else {
                   console.log(' Error in fetching AssetsExcludedList :- ',result);
               }
            });
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

    priorityCellRenderer = () => {
        return (
            <div>
                <span className="text-danger mrR5"><i className="fa fa-circle"></i></span>
                Critical
            </div>
        )
    }

    policyNameRenderer = () => {
        return (
            <div>
                <span className="chip-white mrR5">abcd</span>
                <span className="chip-white">p123</span>
            </div>
        )
    }

    mfaDeleteCellRenderer = () => {
        return (
            <div>
                <span>
                    Disabled <span className="text-danger"><i className="fa fa-times-circle fnt-16" aria-hidden="true"></i></span>
                </span>
            </div>
        )
    }

    loggingCellRenderer = () => {
        return (
            <div>
                <span>
                    Enabled <span className="text-success"><i className="fa fa-check-circle fnt-16" aria-hidden="true"></i></span>
                </span>
            </div>
        )
    }

    encryptedCellRenderer = ({ cellData }) => {
        const chipClassName = cellData === 'Yes' ? 'chip-green' : 'chip-red'
        return (
            <div>
                <span className={"chip-sm " + chipClassName}>{cellData}</span>
            </div>
        )
    }

    publicCellRenderer = ({ cellData }) => {
        const chipClassName = cellData === 'Yes' ? 'chip-green' : 'chip-red'
        return (
            <div>
                <span className={"chip-sm " + chipClassName}>{cellData}</span>
            </div>
        )
    }

    tagCellRenderer = ({ cellData }) => {
        return (
            <div>
                {cellData.map((item, index) => {
                    return (<div className="padding-tag"><span key={item.key + '- ' + index} className="chip-white mrR5">{item.key === 'no tags' ? item.value : item.key + '=' + item.value}</span></div>)
                })}
                {/*cellData.length > 2 && <span className="link-hrf">+{cellData.length - 2}</span>*/}
            </div>
        )
    }


     validateCellData = ({...params}) => {
        let cellData = params.cellData
        if (cellData === undefined || cellData === null || cellData === '' || cellData.length === 0) {
            cellData = 'N/A'
        } 
        params['component'] = cellData
        return this.wrapComponentCellRenderer(params)
    }


    adjustWeightCellRenderer = () => {
        return (
            <div className="icon-box">
                <div className="icon-up-down">
                    <span><i className="fa fa-caret-up" aria-hidden="true"></i> </span>
                    <span><i className="fa fa-caret-down" aria-hidden="true"></i> </span>
                </div>

            </div>
        )
    }

    suppressCellRenderer = () => {
        const { checkedA } = this.state
        return (
            <Switch
                checked={checkedA}
                onChange={this.handleSwitchChange('checkedA')}
                value="checkedA"
            />
        )
    }

    handleSwitchChange = name => event => {
        this.setState({ [name]: event.target.checked });
    }

    handleClick = (placement, dataKey) => (event) => {
        const { currentTarget } = event;
        if (dataKey === 'mfa' || dataKey === 'logging') {
            this.setState(state => ({
                popperEl: currentTarget,
                openPopOver: state.placement !== placement || !state.openPopOver,
                placement,
                filterList: state.enableDisableFilterList
            }));
        } else if (dataKey === 'encrypted' || dataKey === 'isPublic') {
            this.setState(state => ({
                popperEl: currentTarget,
                openPopOver: state.placement !== placement || !state.openPopOver,
                placement,
                filterList: state.yesNoFilterList
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
                {(dataKey === 'mfa' || dataKey === 'logging' || dataKey === 'encrypted' || dataKey === 'isPublic') ? <span onClick={this.handleClick('bottom-start', dataKey)}>{label}  <i className="fa fa-filter" aria-hidden="true"></i> </span> : <span>{label}</span>}
                {(dataKey === 'mfa' || dataKey === 'logging' || dataKey === 'encrypted' || dataKey === 'isPublic') && <Popper style={{ zIndex: '10', marginTop: '10px' }} open={openPopOver} anchorEl={popperEl} placement={placement} transition>
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
        const {
            headerHeight,
            sortBy,
            sortDirection,
            dataList,
        } = this.state;

        const sortedList = dataList;

        return (
            <div style={{ height: "100%", maxHeight: "100%" }}>
                <SnackbarMessage
                        open={showSnackbarState}
                        message={message}
                        variant={variant}
                        handleClose={this.handleClose}
                    />
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
                                        dataKey="bucketName"
                                        label="Bucket Name"
                                        headerRenderer={this.headerRenderer}
                                        cellRenderer={sNoCellRenderer}
                                        disableSort={false}
                                        width={50}
                                        flexGrow={1}
                                    />

                                    <Column
                                        dataKey="tags"
                                        label={<span>Tags <i className="fa fa-plus fnt-10 mrL5" aria-hidden="true"></i></span>}
                                        headerRenderer={this.headerRenderer}
                                        cellRenderer={this.tagCellRenderer}
                                        disableSort={false}
                                        width={100}
                                        flexGrow={2}

                                    />

                                    <Column
                                        dataKey="region"
                                        label="Region"
                                        headerRenderer={this.headerRenderer}
                                        cellRenderer={this.validateCellData}
                                        disableSort={false}
                                        width={100}
                                        flexGrow={4}
                                    />

                                    <Column
                                        dataKey="mfa"
                                        label="MFA Delete"
                                        headerRenderer={this.headerRenderer}
                                        cellRenderer={this.mfaDeleteCellRenderer}
                                        disableSort={false}
                                        width={150}
                                        flexGrow={5}

                                    />

                                    <Column
                                        dataKey="logging"
                                        label="Logging"
                                        headerRenderer={this.headerRenderer}
                                        cellRenderer={this.loggingCellRenderer}
                                        disableSort={false}
                                        width={150}
                                        flexGrow={6}
                                    />

                                    <Column
                                        dataKey="encrypted"
                                        label="Encrypted"
                                        headerRenderer={this.headerRenderer}
                                        cellRenderer={this.encryptedCellRenderer}
                                        disableSort={false}
                                        width={100}
                                        flexGrow={7}
                                    />

                                    <Column
                                        dataKey="isPublic"
                                        label="Public"
                                        headerRenderer={this.headerRenderer}
                                        cellRenderer={this.publicCellRenderer}
                                        disableSort={false}
                                        width={60}
                                        flexGrow={8}
                                    />

                                    <Column
                                        dataKey="score"
                                        label="Asset Weight"
                                        headerRenderer={this.headerRenderer}
                                        cellRenderer={this.assetWeightCellRenderer}
                                        disableSort={false}
                                        width={100}
                                        flexGrow={9}
                                    />
                                    <Column
                                        dataKey="adjustWeight"
                                        label="Adjust Weight"
                                        headerRenderer={this.headerRenderer}
                                        cellRenderer={this.adjustWeightCellRenderer}
                                        disableSort={false}
                                        width={100}
                                        flexGrow={10}
                                    />
                                    <Column
                                        dataKey="suppressed"
                                        label="Suppress"
                                        headerRenderer={this.headerRenderer}
                                        cellRenderer={this.suppressCellRenderer}
                                        disableSort={false}
                                        width={100}
                                        flexGrow={11}
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


const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators(Object.assign({}, assetsActions), dispatch),
        showMessage: message => {
            dispatch(showMessage(message))
        }, setProgressBar: isProgress => {
            dispatch(setProgressBar(isProgress))
        }
    };
}



export default withRouter(connect(null, mapDispatchToProps)(AssetList))