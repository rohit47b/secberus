/*
 * @Author: Virendra Patidar 
 * @Date: 2018-10-09 11:08:57 
 * @Last Modified by: Virendra Patidar
 * @Last Modified time: 2018-11-23 14:30:13
 */
import React, { PureComponent } from "react"

import {
    Table,
    Column,
    SortDirection,
    InfiniteLoader,
    CellMeasurer,
    CellMeasurerCache
} from "react-virtualized"
import AutoSizer from "react-virtualized/dist/commonjs/AutoSizer"
import Checkbox from '@material-ui/core/Checkbox'
import Grid from '@material-ui/core/Grid'
import Chip from '@material-ui/core/Chip'
import Button from '@material-ui/core/Button'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'

import { connect } from "react-redux"
import { bindActionCreators } from 'redux'
import { withRouter } from 'react-router-dom'

import ErrorBoundary from 'global/ErrorBoundary'

import { showMessage } from 'actions/messageAction'
import { setProgressBar } from 'actions/commonAction'

import * as reportScheduleActions from 'actions/reportScheduleAction'

import StatusList from './StatusList'
import AlertList from './AlertList'


const cache = new CellMeasurerCache({
    fixedWidth: true,
    minHeight: 100,
});

class ScheduleReport extends PureComponent {
    _mounted = false
    state = {
        search: '',
        value: 0,
    }
   
    //   --------------------Custom logic method Start-----------------------

    handleChange = name => event => {
        this.setState({ search: event.target.value })
    }

    handleTabChange = (event, value) => {
        this.setState({ value });
    };

    render() {
        const { 
            search,
             value,
             } = this.state

        return (
            <div className="page-wrapper">
                <Grid container spacing={24}>
                    <Grid item sm={12}>
                        <h3 className="mr0 main-heading">Report Schedule</h3>
                    </Grid>
                    <Grid item sm={12}>
                        <Tabs
                            value={value}
                            onChange={this.handleTabChange}
                            className="tab-wrapper mrB15"
                        >
                            <Tab
                                disableRipple
                                label="Status"
                                className="tab-btn"
                            />
                            <Tab
                                disableRipple
                                label="Alert"
                                className="tab-btn"
                            />
                        </Tabs>
                    </Grid>
                </Grid>
                <Grid container spacing={24} className="grid-container">
                 <Grid item sm={12} className="pdB0 pdT0">
                        <div className="tab-container">
                           
                            <ErrorBoundary error="error-boundary">
                                {value === 0 &&
                                    <StatusList search={search} />
                                }
                            </ErrorBoundary>
                            <ErrorBoundary error="error-boundary">
                                {value === 1 &&
                                    <AlertList search={search} />
                                }
                            </ErrorBoundary>
                        </div>
                    </Grid>
                </Grid>
            </div>
        );
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators(reportScheduleActions, dispatch),
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
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ScheduleReport));