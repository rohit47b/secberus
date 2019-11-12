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

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import * as integrationActions from 'actions/integrationAction'
import { showMessage } from 'actions/messageAction'
import { setProgressBar } from 'actions/commonAction'

import { cloneDeep, find } from "lodash"


class AlertNotificationList extends PureComponent {
    _mounted = false
    validEvents = ['NewAlert', 'AlertClosed']
    descriptions = {
        'NewAlert': 'Triggers when an asset fails a rule and there is no existing open alert for the asset/rule pair.', 
        'AlertClosed': 'Triggers when an open/pending alert is closed.'
    }

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
        eventList: [],
        loaded: false,
        rowIndex: 0,
        notificationType: [],
        selectedNotificationType: [],
        checked: []
    };

    currentValue = this.props.filterData

    componentDidMount() {
        let eventList = []
        this.props.eventList.map(event => {
            if (this.validEvents.indexOf(event.event_name) !== -1) {
                eventList.push(
                    {
                        event_name: event.event_name,
                        event_description: this.descriptions[event.event_name],
                        notification_type: ['Select Recipients'],
                        isEnable:true
                    }
                )
            }
        })
        this.setState({ eventList: eventList, notificationType: this.props.integrationList.map(integration => {return integration.name}) });
        //this.setState({ eventList: this.getRows() })
    }

    getRows() {
        return [
            {
                event_name: 'New Alert',
                event_description: 'Triggers when an asset fails a rule and there is no existing open alert for the asset/rule pair.',
                notification_type: ['Select Recipients'],
                isEnable:false
            },
            {
                event_name: 'Alert Closed',
                event_description: 'Triggers when an open/pending alert is closed.',
                notification_type: ['Select Recipients'],
                isEnable:false
            },
            {
                event_name: 'New Remediation Plan',
                event_description: 'Triggers when a new remediation plan is created.',
                notification_type: ['Select Recipients'],
                isEnable:false
            },
            {
                event_name: 'Remediation Plan Closed',
                event_description: 'Triggers when a remediation plan is closed',
                notification_type: ['Select Recipients'],
                isEnable:false
            }
        ];
    }

    //   --------------------Table helper method Start-----------------------

    _isRowLoaded = ({ index }) => {
        return !!this.state.eventList[index];
    }

    _loadMoreRows = ({ startIndex, stopIndex }) => {
        console.log(" load more ....", startIndex, stopIndex);
        //this.setState({ eventList: this.getRows(startIndex + 3) });
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

        var newEventList = this.state.eventList.filter(function (item, rowIndex) {
            if (index === rowIndex) {
                 item.notification_type = notificationType
            }
            return item
        })

        const integration = find(this.props.integrationList, {name: notificationType[0]})
        if (integration !== undefined){
            let integrationDetails = undefined
            if (integration.type === 'http') {
                this.props.actions.fetchIntegrationHttp(integration.id).
                    then(result => {
                        if (typeof result !== 'string') {
                            integrationDetails = result
                            const payload = {
                                event_name: this.state.eventList[index].event_name,
                                integration: {
                                    name: integrationDetails.name,
                                    url: integrationDetails.url,
                                    verb: integrationDetails.verb
                                }  
                            }
                            if (Object.keys(integrationDetails.headers).length > 0){
                                payload['integration']['headers'] = integrationDetails.headers
                            }
                            if (integrationDetails.auth_scheme !== null) {
                                payload['integration']['auth_scheme'] = integrationDetails.auth_scheme
                            }
                            if (integrationDetails.auth_details !== null) {
                                payload['integration']['auth_details'] = integrationDetails.auth_details
                            }
                            console.log('payload-->', payload)
                            this.notificationMapping(payload)
                        } else {
                            console.log(' Error in fetching integration :- ', result);
                        }
                    });
            } else {
                this.props.actions.fetchIntegrationSmtp(integration.id).
                    then(result => {
                        if (typeof result !== 'string') {
                            integrationDetails = result
                            const payload = {
                                event_name: this.state.eventList[index].event_name,
                                integration: {
                                    name: integrationDetails.name,
                                    cc: integrationDetails.cc,
                                    to: integrationDetails.to,
                                    bcc: integrationDetails.bcc
                                }
                            }
                            if (integrationDetails.cc.length > 0){
                                payload['integration']['cc'] = integrationDetails.cc
                            }
                            if (integrationDetails.bcc.length > 0){
                                payload['integration']['bcc'] = integrationDetails.bcc
                            }
                            this.notificationMapping(payload)
                        } else {
                            console.log(' Error in fetching integration :- ', result);
                        }
                    });
            }
        }
        this.setState({eventList:newEventList})
    }

    notificationMapping(payload) {
        this.props.actions.fetchNotificationMapping(payload).
            then(result => {
                console.log('result-->', result)
                /* if (typeof result !== 'string') {
                    this.setState({ integrationList: result, loadedIntegrations: true })
                } else {
                    console.log(' Error in fetching integrations :- ', result);
                } */
            });
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
                            <Checkbox checked={cellData.indexOf(item) !== -1} color="primary" className="select-item-checkbox" />
                        </MenuItem>
                    ))}

                </Select>
            </FormControl>
        )
    }

    handleChangeDisableEnable = (index) => {
        var newEventList = this.state.eventList.filter(function (item, rowIndex) {
            if (index === rowIndex) {
                 item.isEnable = !item.isEnable
            }
            return item
        })
        this.setState({eventList:newEventList})

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
            eventList,
        } = this.state;

        const sortedList = eventList;

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
                                    rowCount={eventList.length}
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

const mapDispatchToProps = (dispatch) => {
    return {
      actions: bindActionCreators(Object.assign({}, integrationActions), dispatch),
      showMessage: message => {
        dispatch(showMessage(message))
      }, setProgressBar: isProgress => {
        dispatch(setProgressBar(isProgress))
      }
    };
  }
  
export default withRouter((connect(null, mapDispatchToProps)(AlertNotificationList)));