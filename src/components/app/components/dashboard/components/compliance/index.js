/*
 * @Author: Virendra Patidar 
 * @Date: 2018-09-27 09:03:40 
 * @Last Modified by: Virendra Patidar
 * @Last Modified time: 2019-05-13 10:49:26
 */

import React, { PureComponent } from 'react';
import ReactDOM from 'react-dom';
import Grid from '@material-ui/core/Grid'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'

import { CardWithTitle } from 'hoc/CardWithTitle'
import { RoundButton } from 'hoc/Button/RoundButton'
import { RectangleButton } from 'hoc/Button/RectangleButton'

import ComplianceChart from './ComplianceChart'
import ComplianceTrend from './ComplianceTrend'
import ComplianceControl from './ComplianceControl'


import { withRouter } from 'react-router-dom'

import { connect } from "react-redux"
import { bindActionCreators } from 'redux'

import * as complianceActions from 'actions/complianceAction'
import { showMessage } from 'actions/messageAction'
import { setProgressBar } from 'actions/commonAction'
import { store } from 'client'
import { cloneDeep } from "lodash"

import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Input from '@material-ui/core/Input';
import MenuItem from '@material-ui/core/MenuItem';
import LabelWithHelper from 'hoc/Label/LabelWithHelper'
import { finished } from 'stream';

class Compliance extends PureComponent {

    state = {
        search: '',
        value: 0,
        data: {},
        PCIData: {},
        HIPAAData: {},
        CISData: {},
        ISO27001Data: {},

        PCITrendChartData: [],
        HIPAATrendChartData: [],
        CISTrendChartData: [],
        ISO27001TrendChartData: [],

        allTrendChartData: [],


        PCIControlData: {compliance: "PCI", controls: []},
        HIPAAControlData: {compliance: "HIPAA", controls: []},
        CISControlData: {compliance: "CIS", controls: []},
        ISO27001ControlData: {compliance: "ISO 2700", controls: []},

        allControlData: [],

        period: 'day',
        dayNames: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        hourNames: [
            '1am','2am','3am','4am','5am','6am','7am','8am','9am','10am','11am','12pm',
            '1pm','2pm','3pm','4pm','5pm','6pm','7pm','8pm','9pm','10pm','11pm','12am'
        ],
        showTrend: false
    }

    handleTabChange = (event, value) => {
        this.setState({ value }, () => {
            this.setTableControlData(this.state.value)
            this.setAllTrendChartData(this.state.value)
        });
    }

    setTableControlData = (value) => {
        let data = []
        if (value === 0) {
            data = [
                { key: 'PCI', data: this.state.PCIControlData },
                { key: 'HIPAA', data: this.state.HIPAAControlData },
                { key: 'CIS', data: this.state.CISControlData },
            ]

            if (this.state.ISO27001ControlData.compliance !== undefined) {
                data.push({ key: 'ISO 2700', data: this.state.ISO27001ControlData})
            }
        } else if (value === 1) {
            data = [
                { key: 'CIS', data: this.state.CISControlData }
            ]
        } else if (value === 2) {
            data = [
                { key: 'HIPAA', data: this.state.HIPAAControlData }
            ]
        } else if (value === 3) {
            data = [
                { key: 'PCI', data: this.state.PCIControlData }
            ]
        } else if (value === 4 ) {
            data = [
                { key: 'ISO 2700', data: this.state.ISO27001ControlData}
            ]
        }
        this.setState({ allControlData: data }, () => {
            this.setChartData()
        })
    }

    setAllTrendChartData = (value) => {
        const countLength = this.state.CISTrendChartData.length + this.state.HIPAATrendChartData.length + this.state.PCITrendChartData.length + this.state.ISO27001TrendChartData.length
        let data = []
        if (countLength > 0) {
            if (value === 0) {
                data = [
                    { id: 'CIS', color:'#e8c1a0', data: this.state.CISTrendChartData },
                    { id: 'HIPAA', color:'#f47560', data: this.state.HIPAATrendChartData },
                    { id: 'PCI', color:'#f1e15b', data: this.state.PCITrendChartData },
                    { id: 'ISO 2700', color:'#04B404', data: this.state.ISO27001TrendChartData },
                ]
            } else if (value === 1) {
                data = [
                    { id: 'CIS', color:'#e8c1a0', data: this.state.CISTrendChartData }
                ]
            } else if (value === 2) {
                data = [
                    { id: 'HIPAA', color:'#f47560', data: this.state.HIPAATrendChartData }
                ]
            } else if (value === 3) {
                data = [
                    { id: 'PCI', color:'#f1e15b', data: this.state.PCITrendChartData }
                ]
            } else if (value === 4) {
                data = [
                    {id: 'ISO 2700', color:'#04B404', data: this.state.ISO27001TrendChartData}
                ]
            }
        }
        this.setState({ allTrendChartData: data })
    }

    componentDidMount() {
        this._mounted = true
        this.setAllTrendChartData(this.state.value)
        const filterData = this.props.filterData
        if (filterData.selectAccount.id !== 'all' && filterData.selectAccount.id !== undefined) {
            this._mounted = false
            //this.fetchComplianceSummery(filterData)
            this.fetchComplianceTrend(filterData)
            this.fetchComplianceDetails(filterData)
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
                //this.fetchComplianceSummery(filterData)
                this.fetchComplianceTrend(filterData)
                this.setAllTrendChartData(this.state.value)
                this.fetchComplianceDetails(filterData)
            }
        }
    }

    fetchComplianceSummery(filterData) {
        let payload = {accountId:filterData.selectAccount.id}
        this.props.actions.fetchComplianceSummery(payload).
            then(result => {
                this._mounted = true
                if (typeof result !== 'string') {
                    this.setState({ data: result }, () => {
                        this.setChartData()
                    })
                } else {
                    console.log(' Error in fetching compliance summery :- ', result);
                }
            });
    }

    fetchComplianceTrend(filterData) {
        let payload = {accountId:filterData.selectAccount.id, period:this.state.period}

        this.props.actions.fetchComplianceTrend(payload).
            then(result => {
                this._mounted = true
                if (typeof result !== 'string') {
                    console.log('fetchComplianceTrend-->', result)
                    this.setTrendChartData(result)
                } else {
                    console.log(' Error in fetching compliance trend :- ', result);
                    this.setTrendChartData([])
                }
            });
    }

    fetchComplianceDetails(filterData) {
        let payload = {accountId:filterData.selectAccount.id}

        this.props.actions.fetchComplianceDetails(payload).
            then(result => {
                this._mounted = true
                if (typeof result !== 'string') {
                    this.setControlData(result)
                } else {
                    console.log(' Error in fetching compliance trend :- ', result);
                }
            });
    }

    setControlData = (trendData) => {
        let PCIControlData = {}, HIPAAControlData = {}, CISControlData = {}, ISO27001ControlData = {}
        trendData.map(chartData => {
            if (chartData.compliance.name.indexOf('PCI') !== -1) {
                PCIControlData = chartData
            } else if (chartData.compliance.name.indexOf('HIPAA') !== -1) {
                HIPAAControlData = chartData
            } else if (chartData.compliance.name.indexOf('CIS') !== -1) {
                CISControlData = chartData
            } else if (chartData.compliance.name.indexOf('ISO 2700') !== -1) {
                ISO27001ControlData = chartData
            }
        })
        this.setState({ PCIControlData, HIPAAControlData, CISControlData, ISO27001ControlData }, () => {
            this.setTableControlData(0)
        })
    }

    parseTimestamp(timeStamp) {
        var date = new Date(timeStamp * 1000);
        var month   = date.getMonth();
        var day     = date.getDay();
        var dayMonth = date.getDate();
        var hour    = date.getHours();

        return {month:month, day:day, dayMonth:dayMonth, hour:hour}
    }

    getXandY(values) {
        let result = []
        let groups = {}
        const hourNames = this.state.hourNames
        const dayNames = this.state.dayNames
        const period = this.state.period
        switch (period) {
            case 'day':
                for (var i=0; i < values.length; i++){
                    groups[hourNames[values[i].timestamp]] = values[i].value 
                }
                Object.keys(groups).forEach(function(key){
                    result.push({x: key, y: groups[key]})
                })
                break;
            case 'week':
                for (var i=0; i < values.length; i++){
                    groups[dayNames[values[i].timestamp]] = values[i].value 
                }
                Object.keys(groups).forEach(function(key){
                    result.push({x: key, y: groups[key]})
                })
                break;
            case '30-day':
                for (var i=0; i < values.length; i++){
                    groups[values[i].timestamp+1] = values[i].value 
                }
                Object.keys(groups).forEach(function(key){
                    result.push({x: key, y: groups[key]})
                })
                break;
        }
        return result
    }


    fillTrendData = (PCITrendChartData, HIPAATrendChartData, CISTrendChartData, ISO27001TrendChartData) => {
        let PCIData = []
        let HIPAAData = []
        let CISData = []
        let ISO27001Data = []
        let bigger = []
        if (PCITrendChartData.length > bigger.length) {
            bigger = PCITrendChartData
        }
        if (HIPAATrendChartData.length > bigger.length) {
            bigger = HIPAATrendChartData
        }
        if (CISTrendChartData.length > bigger.length) {
            bigger = CISTrendChartData
        }
        if (ISO27001TrendChartData.length > bigger.length) {
            bigger = ISO27001TrendChartData
        }
        bigger.map(item => {
            const currentPCI = PCITrendChartData.find(z => z.x === item.x)
            if (currentPCI !== undefined) {
                PCIData.push(currentPCI)
            } else {
                PCIData.push({x: item.x, y: 0 })
            }
            const currentHIPAA = HIPAATrendChartData.find(z => z.x === item.x)
            if (currentHIPAA !== undefined) {
                HIPAAData.push(currentHIPAA)
            } else {
                HIPAAData.push({x: item.x, y: 0 })
            }
            const currentCIS = CISTrendChartData.find(z => z.x === item.x)
            if (currentCIS !== undefined) {
                CISData.push(currentCIS)
            } else {
                CISData.push({x: item.x, y: 0 })
            }
            const currentISO27001 = ISO27001TrendChartData.find(z => z.x === item.x)
            if (currentISO27001 !== undefined) {
                ISO27001Data.push(currentISO27001)
            } else {
                ISO27001Data.push({x: item.x, y: 0 })
            }
        })
        return PCIData, HIPAAData, CISData, ISO27001Data
    }

    setTrendChartData = (trendData) => {
        console.log('trendData--->', trendData)
        let PCITrendChartData = [], HIPAATrendChartData = [], CISTrendChartData = [], ISO27001TrendChartData = []
        trendData.map(chartData => {
            if (chartData.compliance_name.indexOf('PCI') !== -1) {
                PCITrendChartData = this.getXandY(chartData.series)
            } else if (chartData.compliance_name.indexOf('HIPAA') !== -1) {
                HIPAATrendChartData = this.getXandY(chartData.series)
            } else if (chartData.compliance_name.indexOf('CIS') !== -1) {
                CISTrendChartData = this.getXandY(chartData.series)
            } else if (chartData.compliance_name.indexOf('ISO 2700') !== -1) {
                ISO27001TrendChartData = this.getXandY(chartData.series)
            }
        })

        PCITrendChartData, HIPAATrendChartData, CISTrendChartData, ISO27001TrendChartData = this.fillTrendData(PCITrendChartData, HIPAATrendChartData, CISTrendChartData, ISO27001TrendChartData)

        this.setState({ PCITrendChartData, HIPAATrendChartData, CISTrendChartData, ISO27001TrendChartData }, () => {
            this.setAllTrendChartData(this.state.value)
        })
    }

    setChartData = () => {
        let PCIData = {
            "compliance": "PCI",
            "passed": 0,
            "failed": 0,
            "percent": 0,
            "percent_change": 0
        }, 
        HIPAAData = {
            "compliance": "HIPAA",
            "passed": 0,
            "failed": 0,
            "percent": 0,
            "percent_change": 0
        }, 
        CISData = {
            "compliance": "CIS",
            "passed": 0,
            "failed": 0,
            "percent": 0,
            "percent_change": 0

        }, 
        ISO27001Data = {
            "compliance": "ISO27001",
            "passed": 0,
            "failed": 0,
            "percent": 0,
            "percent_change": 0
        }
        let showTrend = false
        let dataList = []
        this.state.allControlData.map(chartData => {
            if (chartData.key.indexOf('PCI') !== -1) {
                PCIData.passed = chartData.data.compliance.passed_count
                PCIData.failed = chartData.data.compliance.total_count - chartData.data.compliance.passed_count 
                PCIData.percent = chartData.data.percent.toFixed(2)
                PCIData.percent_change = chartData.data.percent_delta.toFixed(2)
                showTrend = true
            } else if (chartData.key.indexOf('HIPAA') !== -1) {
                HIPAAData.passed = chartData.data.compliance.passed_count
                HIPAAData.failed = chartData.data.compliance.total_count - chartData.data.compliance.passed_count 
                HIPAAData.percent = chartData.data.percent.toFixed(2)
                HIPAAData.percent_change = chartData.data.percent_delta.toFixed(2)
                showTrend = true
            } else if (chartData.key.indexOf('CIS') !== -1) {
                CISData.passed = chartData.data.compliance.passed_count
                CISData.failed = chartData.data.compliance.total_count - chartData.data.compliance.passed_count 
                CISData.percent = chartData.data.percent.toFixed(2)
                CISData.percent_change = chartData.data.percent_delta.toFixed(2)
                showTrend = true
            } else if (chartData.key.indexOf('ISO 2700') !== -1) {
                    ISO27001Data.passed = chartData.data.compliance.passed_count
                    ISO27001Data.failed = chartData.data.compliance.total_count - chartData.data.compliance.passed_count
                    ISO27001Data.percent = chartData.data.percent.toFixed(2)
                    ISO27001Data.percent_change = chartData.data.percent_delta.toFixed(2)
                    showTrend = true
            }
        })
        if (PCIData.compliance !== undefined){
            dataList.push(PCIData)
        }
        if (HIPAAData.compliance !== undefined){
            dataList.push(HIPAAData)
        }
        if (CISData.compliance !== undefined){
            dataList.push(CISData)
        }
        if (ISO27001Data.compliance !== undefined){
            dataList.push(ISO27001Data)
        }

        let data = { ...this.state.data }
        data.summary = dataList;
        this.setState({ PCIData, HIPAAData, CISData, ISO27001Data, data, showTrend })
    }

    setPeriod = event => {
        this.setState({ period: event.target.value }, () => {
            let filterData = this.props.filterData
            this.fetchComplianceTrend(filterData)
        })
    }

    render() {
        const { value, data, PCIData, HIPAAData, CISData, ISO27001Data, allTrendChartData, allControlData, period, showTrend } = this.state
        return (
            <CardWithTitle title={"Compliance"} bgImageClass={"card-compliance"} left={<FormControl className="multi-select single-select pull-right">
                <Select
                    value={['Cloud Infrastructure']}
                    //onChange={this.handleChange}
                    input={<Input id="select-multiple" />}
                    renderValue={selected => selected.join(', ')}
                    className="select-feild select-compliance"
                    MenuProps={{
                        className: 'select-compliance-select'
                    }}
                >
                    <MenuItem className="select-item select-item-text" key={'All'} value={'All'}>
                        <span>All</span>
                    </MenuItem>
                    <MenuItem className="select-item select-item-text" key={'Cloud_Infrastructure'} value={'Cloud Infrastructure'}>
                        <span>Cloud Infrastructure</span>
                    </MenuItem>

                </Select>
            </FormControl>}>

                <div className="pdLR-30 pdT30">
                     <div className="label-compliance"><LabelWithHelper message={"Compliance"}  content={"<p>The compliance module displays your current compliance performance as of the most recent infrastucture scan. The percentage displayed next to each standard represents the percentage of rules your infrastucture is currently compliant with, while the percentage displayed within each standard represents the percentage change in compliance since the previous scan.</p> <p>By Default, the compliance status for all applied standards is displayed here, but you can isolate a standard by selecting its name from the menu above. </p>"} /></div>
                    <Tabs
                        value={value}
                        onChange={this.handleTabChange}
                        className="nav-tab"
                    >
                        <Tab
                            disableRipple
                            label="All"
                            className="tab-btn compliance-taps-custom"
                        />
                        <Tab
                            disableRipple
                            label="CIS"
                            className="tab-btn tab-btn-cis compliance-taps-custom"
                        />
                        <Tab
                            disableRipple
                            label="HIPAA"
                            className="tab-btn tab-btn-hipaa compliance-taps-custom"
                        />
                        <Tab
                            disableRipple
                            label="PCI"
                            className="tab-btn tab-btn-pci compliance-taps-custom"
                        />
                        <Tab
                            disableRipple
                            label="ISO 27001"
                            className="tab-btn tab-btn-iso iso-taps-custom"
                        />

                    </Tabs>
                    <div ref={"complianceCard"} className="tab-content">
                        {
                            value === 0 &&
                            <div className="tab-pane">
                              
                                <div className="chart-container">
                                    {data.summary && data.summary.map(summery => <ComplianceChart key={summery.compliance} title={summery.compliance} passed={summery.passed} failed={summery.failed} percantage={summery.percent_change ? summery.percent_change : 0}/>)}
                                </div>

                                <ComplianceTrend allTrendChartData={allTrendChartData} setPeriod={this.setPeriod} period={period} showTrend={showTrend}/>
                                <ComplianceControl allControlData={allControlData} tabIndex={value}/>
                            </div>
                        }

                        {
                            (value === 1 && CISData.compliance !== undefined) &&
                            <div className="tab-pane ">
                                <div className="d-flex">
                                    {CISData.compliance && <ComplianceChart title={CISData.compliance} passed={CISData.passed} failed={CISData.failed} percantage={CISData.percent_change ? CISData.percent_change : 0}/>}
                                </div>
                                <ComplianceTrend allTrendChartData={allTrendChartData} setPeriod={this.setPeriod} period={period} showTrend={showTrend}/>
                                <ComplianceControl allControlData={allControlData} tabIndex={value}/>
                            </div>
                        }

                        {
                            (value === 2 && HIPAAData.compliance !== undefined) &&
                            <div className="tab-pane ">
                                <div className="d-flex">
                                    {HIPAAData.compliance && <ComplianceChart title={HIPAAData.compliance} passed={HIPAAData.passed} failed={HIPAAData.failed} percantage={HIPAAData.percent_change ? HIPAAData.percent_change : 0}/>}
                                </div>
                                <ComplianceTrend allTrendChartData={allTrendChartData} setPeriod={this.setPeriod} period={period} showTrend={showTrend}/>
                                <ComplianceControl allControlData={allControlData} tabIndex={value}/>
                            </div>
                        }

                        {
                            (value === 3 && PCIData.compliance !== undefined) &&
                            <div className="tab-pane ">
                                <div className="d-flex">
                                    {PCIData.compliance &&<ComplianceChart title={PCIData.compliance} passed={PCIData.passed} failed={PCIData.failed} percantage={PCIData.percent_change ? PCIData.percent_change : 0}/>}
                                </div>
                                <ComplianceTrend allTrendChartData={allTrendChartData} setPeriod={this.setPeriod} period={period} showTrend={showTrend}/>
                                <ComplianceControl allControlData={allControlData} tabIndex={value}/>
                            </div>
                        }

                        {
                            (value === 4 && ISO27001Data.compliance !== undefined) &&
                            <div className="tab-pane ">
                                <div className="d-flex">
                                    {ISO27001Data.compliance &&<ComplianceChart title={ISO27001Data.compliance} passed={ISO27001Data.passed} failed={ISO27001Data.failed} percantage={ISO27001Data.percent_change ? ISO27001Data.percent_change : 0}/>}
                                </div>
                                <ComplianceTrend allTrendChartData={allTrendChartData} setPeriod={this.setPeriod} period={period} showTrend={showTrend}/>
                                <ComplianceControl allControlData={allControlData} tabIndex={value}/>
                            </div>
                        }

                        {
                            (value === 4 && ISO27001Data.compliance === undefined) &&
                            <div className="data-not-found">
                                <span>Records Not Found</span>
                            </div>
                        }
                    </div>
                </div>
            </CardWithTitle>
        );
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators(Object.assign({}, complianceActions), dispatch),
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Compliance))