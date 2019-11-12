/*
 * @Author: Virendra Patidar 
 * @Date: 2018-09-27 09:03:40 
 * @Last Modified by: Virendra Patidar
 * @Last Modified time: 2019-05-13 10:49:26
 */

import React, { PureComponent } from 'react';
import { CardWithTitle } from 'hoc/CardWithTitle'
import ComplianceChart from './ComplianceChart'
import { withRouter } from 'react-router-dom'
import { connect } from "react-redux"
import { bindActionCreators } from 'redux'
import * as complianceActions from 'actions/complianceAction'
import { showMessage } from 'actions/messageAction'
import { setProgressBar, setCompliancePercent } from 'actions/commonAction'
import { store } from 'client'
import { cloneDeep } from "lodash"


class Compliance extends PureComponent {

    PCIDataList = { compliance: "PCI", passed: 0, failed: 0, percent_changed: 0, percent: 0 }
    PCIPercentChanged = {total: 0, changed:0}
    HIPAADataList = { compliance: "HIPAA", passed: 0, failed: 0, percent_changed: 0, percent: 0 }
    HIPAAPercentChanged = {total: 0, changed:0}
    CISDataList = { compliance: "CIS", passed: 0, failed: 0, percent_changed: 0, percent: 0 }
    CISPercentChanged = {total: 0, changed:0}
    ISO27001DataList = { compliance: "ISO 2700", passed: 0, failed: 0, percent_changed: 0, percent: 0 }
    ISO27001PercentChanged = {total: 0, changed:0}

    state = {
       
        value: 0,
        data: [],
        PCIData: { compliance: "PCI", passed: 0, failed: 0, percent_changed: 0 },
        HIPAAData: { compliance: "HIPAA", passed: 0, failed: 0, percent_changed: 0 },
        CISData: { compliance: "CIS", passed: 0, failed: 0, percent_changed: 0 },
        ISO27001Data: { compliance: "ISO 2700", passed: 0, failed: 0, percent_changed: 0 },
        
        PCITrendChartData: [],
        HIPAATrendChartData: [],
        CISTrendChartData: [],
        ISO27001TrendChartData: [],

        allTrendChartData: [],


        PCIControlData: [],
        HIPAAControlData: [],
        CISControlData: [],
        ISO27001ControlData: [],

        allControlData: [],

        period: 'day',
        dayNames: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        hourNames: [
            '1am', '2am', '3am', '4am', '5am', '6am', '7am', '8am', '9am', '10am', '11am', '12pm',
            '1pm', '2pm', '3pm', '4pm', '5pm', '6pm', '7pm', '8pm', '9pm', '10pm', '11pm', '12am'
        ],
        loadingCompliance: true
    }

    setTableControlData = (value, PCIControlData, HIPAAControlData, CISControlData, ISO27001ControlData, accountId) => {
        let data = []
        if (value === 0) {
            data = [
                { key: 'PCI', data: PCIControlData },
                { key: 'HIPAA', data: HIPAAControlData },
                { key: 'CIS', data: CISControlData },
                { key: 'ISO 27001', data: ISO27001ControlData },

            ]
        } else if (value === 1) {
            data = [
                { key: 'CIS', data: CISControlData }
            ]
        } else if (value === 2) {
            data = [
                { key: 'HIPAA', data: HIPAAControlData }
            ]
        } else if (value === 3) {
            data = [
                { key: 'PCI', data: PCIControlData }
            ]
        } else if (value === 4 ) {
            data = [
                { key: 'ISO 2700', data: ISO27001ControlData}
            ]
        }
        this.setChartData(data, accountId)
        /* this.setState({ allControlData: data }, () => {
            this.setChartData()
        }) */
    }



    setAllTrendChartData = (value) => {
        const countLength = this.state.CISTrendChartData.length + this.state.HIPAATrendChartData.length + this.state.PCITrendChartData.length + this.state.ISO27001TrendChartData.length
        let data = []
        if (countLength > 0) {
            if (value === 0) {
                data = [
                    { id: 'CIS', color: '#e8c1a0', data: this.state.CISTrendChartData },
                    { id: 'HIPAA', color: '#f47560', data: this.state.HIPAATrendChartData },
                    { id: 'PCI', color: '#f1e15b', data: this.state.PCITrendChartData },
                    { id: 'ISO 2700', color:'#04B404', data: this.state.ISO27001TrendChartData },
                ]
                if (this.state.ISO27001TrendChartData.length > 0){
                    data.push({ id: 'ISO 2700', color:'#04B404', data: this.state.ISO27001TrendChartData})
                }
            } else if (value === 1) {
                data = [
                    { id: 'CIS', color: '#e8c1a0', data: this.state.CISTrendChartData }
                ]
            } else if (value === 2) {
                data = [
                    { id: 'HIPAA', color: '#f47560', data: this.state.HIPAATrendChartData }
                ]
            } else if (value === 3) {
                data = [
                    { id: 'PCI', color: '#f1e15b', data: this.state.PCITrendChartData }
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
        /* if (filterData.selectAccount.id !== 'all') {
            this.fetchComplianceSummery(filterData)
        } */
        let selectedAccounts = []
        if (filterData.selectCloud.id !== 'all'){
            this.props.accountList.map(account => {
                if (filterData.selectCloud.id === account.cloud) {
                    selectedAccounts.push(account)
                }
            })
        } else {
            selectedAccounts = this.props.accountList
        }
        this._mounted = false;
        this.fetchComplianceDetails(selectedAccounts)
        this.timer = setInterval(this.updateState, 5000);
        this.unsubscribe = store.subscribe(this.receiveFilterData)
    }

    componentWillUnmount() {
        clearInterval(this.timer);
    }

    updateState = () => {
        this.setState({state: this.state})
    }


    receiveFilterData = data => {

        const currentState = store.getState()
        const previousValue = this.currentValue
        this.currentValue = currentState.uiReducer.filterData
        if (
            this.currentValue && previousValue !== this.currentValue && this._mounted
        ) {
            const filterData = cloneDeep(currentState.uiReducer.filterData)
            /* if (filterData.selectAccount.id !== 'all' && this._mounted) {
                this.fetchComplianceSummery(filterData)
            } */
            this.setState({data: []}, () => {
                let selectedAccounts = []
                if (filterData.selectCloud.id !== 'all'){
                    this.props.accountList.map(account => {
                        if (filterData.selectCloud.id === account.cloud) {
                            selectedAccounts.push(account)
                        }
                    })
                } else {
                    selectedAccounts = this.props.accountList
                }
                this.fetchComplianceDetails(selectedAccounts)
            })
        }
    }

    fetchComplianceDetails(selectedAccounts) {
        const totalAccounts = selectedAccounts.length
        let countRequets = 0
        selectedAccounts.map(account => {
            let payload = { accountId: account.id }
            this.props.actions.fetchComplianceDetails(payload).
                then(result => {
                    this._mounted = true
                    if (typeof result !== 'string') {
                        this.setControlData(result, account.id)
                    } else {
                        console.log(' Error in fetching compliance trend :- ', result);
                    }
                    countRequets++
                    if (countRequets >= totalAccounts) {
                        this.setState({loadingCompliance: false})
                    }
                });
            })
    }


    fetchComplianceSummery(selectedAccounts) {
        const totalAccounts = selectedAccounts.length
        let countRequets = 0
        selectedAccounts.map(account => {
            let payload = { accountId: account.id }
            this.props.actions.fetchComplianceSummery(payload).
                then(result => {
                    if (typeof result !== 'string') {
                        let percents = {}
                        percents[account.id] = result
                        this.props.setCompliancePercent(percents)
                        this.setState({ data: result }, () => {
                            this.setChartData()
                        })
                    } else {
                        console.log(' Error in fetching compliance summery :- ', result);
                    }
                    countRequets++
                    if (countRequets >= totalAccounts) {
                        this.setState({loadingCompliance: false})
                    }
                });
        })
    }

    setControlData = (trendData, accountId) => {
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
        this.setTableControlData(0, PCIControlData, HIPAAControlData, CISControlData, ISO27001ControlData, accountId)
        /* this.setState({ PCIControlData, HIPAAControlData, CISControlData, ISO27001ControlData }, () => {
            this.setTableControlData(0)
        }) */
    }

    parseTimestamp(timeStamp) {
        var date = new Date(timeStamp * 1000);
        var month = date.getMonth();
        var day = date.getDay();
        var dayMonth = date.getDate();
        var hour = date.getHours();

        return { month: month, day: day, dayMonth: dayMonth, hour: hour }
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

    setTrendChartData = (trendData) => {
        let PCITrendChartData = {}, HIPAATrendChartData = {}, CISTrendChartData = {}, GPDRTrendChartData = {}, ISO27001TrendChartData = {}
        trendData.map(chartData => {
            if (chartData.compliance.indexOf('PCI') !== -1) {
                PCITrendChartData = this.getXandY(chartData.values)
            } else if (chartData.compliance.indexOf('HIPAA') !== -1) {
                HIPAATrendChartData = this.getXandY(chartData.values)
            } else if (chartData.compliance.indexOf('CIS') !== -1) {
                CISTrendChartData = this.getXandY(chartData.values)
            } else if (chartData.compliance.indexOf('ISO 2700') !== -1) {
                ISO27001TrendChartData = this.getXandY(chartData.values)
            }
        })
        this.setState({ PCITrendChartData, HIPAATrendChartData, CISTrendChartData, GPDRTrendChartData, ISO27001TrendChartData }, () => {
            this.setAllTrendChartData(this.state.value)
        })
    }

    setChartData = (data, accountId) => {
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
        console.log('data--->', data)

        data.map(chartData => {
            if (chartData.key.indexOf('PCI') !== -1) {
                if (chartData.data.compliance !== undefined) {
                    PCIData = chartData.data
                    this.PCIDataList.passed += PCIData.compliance.passed_count
                    this.PCIDataList.failed += PCIData.compliance.total_count - PCIData.compliance.passed_count
                    this.PCIDataList.percent = PCIData.percent.toFixed(2)
                    this.PCIDataList.percent_change = PCIData.percent_delta.toFixed(2)
                }
            } else if (chartData.key.indexOf('HIPAA') !== -1) {
                if (chartData.data.compliance !== undefined) {
                    HIPAAData = chartData.data
                    this.HIPAADataList.passed += HIPAAData.compliance.passed_count
                    this.HIPAADataList.failed += HIPAAData.compliance.total_count - HIPAAData.compliance.passed_count
                    this.HIPAADataList.percent = HIPAAData.percent.toFixed(2)
                    this.HIPAADataList.percent_change = HIPAAData.percent_delta.toFixed(2)
                }
            } else if (chartData.key.indexOf('CIS') !== -1) {
                if (chartData.data.compliance !== undefined) {
                        CISData = chartData.data
                        this.CISDataList.passed += CISData.compliance.passed_count
                        this.CISDataList.failed += CISData.compliance.total_count - CISData.compliance.passed_count
                        this.CISDataList.percent = CISData.percent.toFixed(2)
                        this.CISDataList.percent_change = CISData.percent_delta.toFixed(2)
                }
            } else if (chartData.key.indexOf('ISO 2700') !== -1) {
                if (chartData.data.compliance !== undefined) {
                    ISO27001Data = chartData.data
                    this.ISO27001DataList.passed += ISO27001Data.compliance.passed_count
                    this.ISO27001DataList.failed += ISO27001Data.compliance.total_count - ISO27001Data.compliance.passed_count
                    this.ISO27001DataList.percent = ISO27001Data.percent.toFixed(2)
                    this.ISO27001DataList.percent_change = ISO27001Data.percent_delta.toFixed(2)
                }
            }
        })
        let percents = {}
        percents[accountId] = [
            {compliance: 'PCI', percent: this.PCIDataList.percent},
            {compliance: 'HIPAA', percent: this.HIPAADataList.percent},
            {compliance: 'CIS', percent: this.CISDataList.percent},
            {compliance: 'ISO 27001', percent: this.ISO27001DataList.percent}
        ]
        
        this.props.setCompliancePercent(percents)
        this.setState({ PCIData: this.PCIDataList, HIPAAData: this.HIPAADataList, CISData: this.CISDataList, ISO27001Data: this.ISO27001DataList })
    }


    render() {
        const { PCIData, HIPAAData, CISData, ISO27001Data, loadingCompliance } = this.state
        return (
            <CardWithTitle title={"Compliance"} bgImageClass={"card-compliance mrB10"}>
                {!loadingCompliance ?
                    <div className="chart-container">
                        <ComplianceChart title={"PCI"} passed={PCIData.passed} failed={PCIData.failed} percantage={PCIData.percent_change ? PCIData.percent_change : 0} />
                        <ComplianceChart title={"HIPAA"} passed={HIPAAData.passed} failed={HIPAAData.failed} percantage={HIPAAData.percent_change ? HIPAAData.percent_change : 0} />
                        <ComplianceChart title={"CIS"} passed={CISData.passed} failed={CISData.failed} percantage={CISData.percent_change ? CISData.percent_change : 0} />
                        <ComplianceChart title={"ISO 2700"} passed={ISO27001Data.passed} failed={ISO27001Data.failed} percantage={ISO27001Data.percent_change ? ISO27001Data.percent_change : 0} />
                    </div>
                    :
                    <div className="data-compliance">
                        <i className="fa fa-spin fa-fw fa-circle-o-notch spinner-compliance"></i> 
                    </div>
                }
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
        }, setCompliancePercent: compliancePercent => {
            dispatch(setCompliancePercent(compliancePercent))
        }
    };
}

const mapStateToProps = (state, ownProps) => ({
    filterData: state.uiReducer.filterData,
    accountList:state.commonReducer.cloud_accounts
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Compliance))