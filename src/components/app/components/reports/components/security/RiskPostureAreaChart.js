/*
 * @Author: Virendra Patidar 
 * @Date: 2018-11-16 14:55:42 
 * @Last Modified by: Virendra Patidar
 * @Last Modified time: 2019-05-30 20:12:12
 */
import { BarChart } from 'react-d3-components'
import Paper from '@material-ui/core/Paper'
import React, { PureComponent } from 'react'
import Typography from '@material-ui/core/Typography'
import LabelWithHelper from 'hoc/Label/LabelWithHelper'
import LineChart from './LineChart';
import Grid from '@material-ui/core/Grid'
import { ResponsiveLine, CustomSymbol } from 'nivo';


import { Link, withRouter } from 'react-router-dom';
import { store } from 'client';
import { cloneDeep, uniqBy } from "lodash";
import { bindActionCreators } from 'redux';
import { connect } from "react-redux";
import * as securityActions from 'actions/securityAction';
import moment from 'moment'
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';


class RiskPostureAreaChart extends PureComponent {
    _mounted = false

    state = {
        area_chart_data: [{ id: "Risk Score", data: [] }],
        period: 'day',
        dayNames: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        hourNames: [
            '1am', '2am', '3am', '4am', '5am', '6am', '7am', '8am', '9am', '10am', '11am', '12pm',
            '1pm', '2pm', '3pm', '4pm', '5pm', '6pm', '7pm', '8pm', '9pm', '10pm', '11pm', '12am'
        ]
    }
    componentDidMount() {
        this._mounted = true
        const filterData = this.props.filterData
        if (filterData.selectAccount.id !== 'all' && filterData.selectAccount.id !== undefined) {
            this._mounted = false
            this.fetchSecurityRiskTrend(filterData)
        } else {
            this.setState({ filterProgress: false, loading: false })
        }
        this.unsubscribe = store.subscribe(this.receiveFilterData)
    }

    receiveFilterData = data => {

        const currentState = store.getState()
        const previousValue = this.currentValue
        this.currentValue = currentState.uiReducer.filterData
        if (
            this.currentValue && previousValue !== this.currentValue
        ) {
            const filterData = cloneDeep(currentState.uiReducer.filterData)
            if (filterData.selectAccount.id !== 'all' && this._mounted) {
                this.fetchSecurityRiskTrend(filterData)
            }
        }
    }
    fetchSecurityRiskTrend(filterData) {
        const payload = {cloud_account_id: filterData.selectAccount.id, period: this.state.period}
        this.props.actions.fetchSecurityRiskTrend(payload).
            then(result => {
                this._mounted = true
                if (typeof result !== 'string') {
                    const newData = this.getXandY(result)
                    // const newData = result.map(({ timestamp, value }) => ({ x: moment.unix(timestamp).format("MMM/DD hh"), y: value }))
                    this.setState({ area_chart_data: [{ id: "Risk Score", data: newData }], loading: false })
                } else {
                    console.log(' Error in fetching fetchSecurityRiskTrend :- ', result);
                    this.setState({ loading: false, filterProgress: false })
                }
            });

    }



    getXandY(values) {
        let result = []
        let groups = {}
        const hourNames = this.state.hourNames
        const dayNames = this.state.dayNames
        const period = this.state.period
        switch (period) {
            case 'day':
                for (var i = 0; i < values.length; i++) {
                    if (i > 0) {
                        if (values[i].timestamp < values[i-1].timestamp) {
                        }
                    }
                    let times = this.parseTimestamp(values[i].timestamp)
                    groups[hourNames[times.hour]] = values[i].value
                }
                Object.keys(groups).forEach(function (key) {
                    result.push({ x: key, y: groups[key] })
                })
                break;
            case 'week':
                for (var i = 0; i < values.length; i++) {
                    let times = this.parseTimestamp(values[i].timestamp)
                    groups[dayNames[times.day]] = values[i].value
                }
                Object.keys(groups).forEach(function (key) {
                    result.push({ x: key, y: groups[key] })
                })
                break;
            case '30-day':
                for (var i = 0; i < values.length; i++) {
                    let times = this.parseTimestamp(values[i].timestamp)
                    groups[(times.month + 1) + '/' + (times.dayMonth)] = values[i].value
                }
                Object.keys(groups).forEach(function (key) {
                    result.push({ x: key, y: groups[key] })
                })
                break;
        }
        return result
    }

    parseTimestamp(timeStamp) {
        //const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', ' Sep', 'Oct', 'Nov', 'Dec']
        var date = new Date(timeStamp * 1000);
        //var year    = date.getFullYear();
        var month = date.getMonth();
        var day = date.getDay();
        var dayMonth = date.getDate();
        var hour = date.getHours();
        //var minute  = date.getMinutes();
        //var seconds = date.getSeconds();

        return { month: month, day: day, dayMonth: dayMonth, hour: hour }
    }

    setPeriod = event => {
        this.setState({ period: event.target.value }, () => {
            let filterData = this.props.filterData
            this.fetchSecurityRiskTrend(filterData)
        })
    }


    render() {
        const { area_chart_data, period } = this.state
        const { title, content } = this.props
        let periodName = 'Last 24 hours'
        if (period == 'day') {
            periodName = 'Last 24 hours'
        }
        if (period == 'week') {
            periodName = 'Last 7 days'
        }
        if (period == '30-day') {
            periodName = 'Last 30 days'
        }
        return (
            // <LineChart content={"Risk Posture History shows the last 12 months of Risk Posture Scores for your Organization and the projected Risk Posture Score after all Remediation Plans that are in progress are completed. "} title={"Risk Posture Trend"} lineColor={"#FE9A2E"} classStyle={"paper-box"}/>
            <div className="nivo-line-chart-container paper-box">
                <LabelWithHelper message={"Risk Posture Trend"} content={"Risk Posture History shows the last 12 months of Risk Posture Scores for your Organization and the projected Risk Posture Score after all Remediation Plans that are in progress are completed. "} />

                <Grid container spacing={16}>
                    <Grid item sm={6}>
                        <Typography className="mrB20 report-title heading-h4" component="h4">
                            <strong>Risk Posture Trend</strong>
                        </Typography>
                    </Grid>
                    <Grid item sm={6} className="text-right responsive-left">
                        <div className="select-data pdR15">
                            <span className="fnt-11 pdR10">Data Range</span>
                            <FormControl className="multi-select single-select">
                                <Select
                                    value={[periodName]}
                                    onChange={this.setPeriod}
                                    input={<Input id="select-multiple" />}
                                    renderValue={selected => selected.join(', ')}
                                    className="select-feild"
                                    MenuProps={{
                                        className: 'risk-posture-select'
                                    }}
                                >
                                    <MenuItem className="select-item select-item-text" key={'day'} value={'day'}>
                                        <span>Last 24 hours</span>
                                    </MenuItem>
                                    <MenuItem className="select-item select-item-text" key={'week'} value={'week'}>
                                        <span>Last 7 days</span>
                                    </MenuItem>
                                    <MenuItem className="select-item select-item-text" key={'30-day'} value={'30-day'}>
                                        <span>Last 30 days</span>
                                    </MenuItem>

                                </Select>
                            </FormControl>
                        </div>
                    </Grid>

                </Grid>
                <ResponsiveLine

                    title={"Risk Posture Trend"}
                    margin={{
                        top: 10,
                        right: 10,
                        bottom: 25,
                        left: 30
                    }}
                    data={area_chart_data}
                    animate
                    yScale={{ type: 'linear', stacked: true }}
                    axisBottom={{
                        "orient": "bottom",
                        "tickSize": 0,
                        "tickPadding": 5,
                        "tickRotation": -45,
                        "format": (x, index) => { return x }
                      }}
                    curve="monotoneX"
                    dotSymbol={CustomSymbol}
                    dotSize={8}
                    dotBorderWidth={1}
                    dotBorderColor="inherit:darker(0.3)"
                    axisLeft={{ tickSize: 10 }}
                    tooltipFormat={function (e) { return e.toFixed(2) + "%" }}
                    height={150}
                />
            </div>
        )
    }
}



const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators(Object.assign({}, securityActions), dispatch),
        setHeaderFilterData: filterData => {
            dispatch(setHeaderFilterData(filterData))
        }, setProgressBar: isProgress => {
            dispatch(setProgressBar(isProgress))
        }
    };
}

const mapStateToProps = (state, ownProps) => ({
    filterData: state.uiReducer.filterData,
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(RiskPostureAreaChart)) 