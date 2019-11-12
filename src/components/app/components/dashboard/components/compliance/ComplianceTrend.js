import React, { PureComponent } from 'react';
import Grid from '@material-ui/core/Grid'
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';

import LabelWithHelper from 'hoc/Label/LabelWithHelper'

import {ResponsiveLine, CustomSymbol} from 'nivo';

class ComplianceTrend extends PureComponent {
    state={
        chartData:{
            datasets: [{
                borderColor: 'rgb(255, 99, 132)',
                data: [],
            }]
        },
        options: {
            scales: {
                xAxes: [{
                    type: 'time',
                    time: {
                        unit: 'month'
                    }
                }]
            },
            elements: {
                line: {
                    tension: 0, // disables bezier curves
                }
            }
        },
        period: 'day'
    }
    
        
    static getDerivedStateFromProps(nextProps, state) {
        return { allTrendChartData: nextProps.allTrendChartData}
    }
  

    /* componentDidUpdate = (prevProps, prevState) => {
      if (this.props.allTrendChartData !== prevProps.allTrendChartData) {
        this.setChartData(this.props.allTrendChartData)
      }
    } */

    render() {
        const {allTrendChartData, setPeriod, period, showTrend}=this.props
        let SetColors = []
        allTrendChartData.forEach(function(item){
            SetColors.push(item.color)
        })
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
            <div>
                {showTrend && (
                <div className="mrB40">
                <hr className="line-divider"/>
                    <Grid container spacing={24} className="mrB20">
                        <Grid item sm={5}>
                            <LabelWithHelper title={"Compliance Trend"} content={"The Compliance Trend Chart displays your cloud infrastructure compliance posture over time. Select the date range to observe different periods."} />
                        </Grid>
                        <Grid item sm={7} className="text-right responsive-left">
                            <span className="fnt-11 pdR10">Data Range</span>
                            <FormControl className="multi-select single-select">
                                <Select
                                    value={[periodName]}
                                    onChange={setPeriod}
                                    input={<Input id="select-multiple" />}
                                    renderValue={selected => selected.join(', ')}
                                    className="select-feild"
                                    MenuProps={{
                                        className: 'compliance-data-range'
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
                        </Grid>
                    </Grid>
                    {(allTrendChartData.length > 0) ? (
                    <Grid container spacing={24}>
                        <Grid className="nivo-container-conatiner" item sm={12}>
                            <div className="nivo-container">
                                <ResponsiveLine
                                    margin={{
                                        top: 10,
                                        right: 20,
                                        bottom: 25,
                                        left: 30
                                    }}
                                    data={allTrendChartData}
                                    animate
                                    yScale={{type: 'linear',stacked: true}}
                                    axisBottom={{
                                        "orient": "bottom",
                                        "tickSize": 0,
                                        "tickPadding": 5,
                                        "tickRotation": -45,
                                        "format": (x, index) => { return x }
                                    }}
                                    curve="monotoneX"
                                    dotSize={8}
                                    dotBorderWidth={1}
                                    dotBorderColor="inherit:darker(0.3)"
                                    axisLeft={{tickSize: 9}}
                                    tooltipFormat={function(e){return e.toFixed(2) + "%"}}
                                    colors={SetColors}
                                    />
                            </div>
                        </Grid>
                    </Grid>
                    ): (
                        <Grid container spacing={24}>
                            <Grid className="nivo-container-conatiner" item sm={12}>
                                <div className="data-not-found-compliance-trend">
                                    <span className="data-not-found" >No data found for this range</span>
                                </div>
                            </Grid>
                        </Grid>
                    )}
                </div>
                )}
            </div>
        );
    }
}

export default ComplianceTrend