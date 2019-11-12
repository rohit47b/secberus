/*
 * @Author: Virendra Patidar 
 * @Date: 2018-09-27 09:03:40 
 * @Last Modified by: Virendra Patidar
 * @Last Modified time: 2018-11-19 12:00:51
 */
import React, { PureComponent } from 'react'

import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import Tooltip from '@material-ui/core/Tooltip'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, LabelList, Legend, Label, ResponsiveContainer } from 'recharts'

import { withRouter } from 'react-router-dom'

import { connect } from "react-redux"
import { store } from 'client'
import { bindActionCreators } from 'redux'
import { cloneDeep, maxBy } from "lodash"

import { fetchServiceIconPath } from 'utils/serviceIcon'

import ErrorBoundary from 'global/ErrorBoundary'
import { CardTitle } from 'hoc/Card/CardTitle'

import * as dashboardActions from 'actions/dashboardAction'
import { showMessage } from 'actions/messageAction'
import { setProgressBar } from 'actions/commonAction'

import HighBarChart from './HighBarChart'

const CustomXAxisLabel = (props) => {
    const serviceKey = props.payload.value.split(',')[0]
    const serviceName = props.payload.value.split(',')[1]

    return (
        <g width={100} transform={`translate(${props.x},${props.y})`} title={serviceName}>
            <Tooltip placement="bottom" title={serviceName}>
                <image xlinkHref={fetchServiceIconPath(serviceKey)} x={-10} y={0} height="15px" width="20px" textAnchor="start" fill="#666" >
                </image>
            </Tooltip>
        </g>
    )
}

const renderCustomizedLabel = (props) => {
    const { x, y, width, height, value } = props;
    const radius = 17;
    const pass = value.split('/')[0]
    const fail = value.split('/')[1]
    return (
        <g transform={`translate(0,-1)`}>
            <circle dx={10} cx={x + width / 2} cy={y - radius} r={radius} fill="#F1F2F5" />
            <text fontSize="9" x={x + width / 2} y={y - radius} fill="#000" textAnchor="middle" dominantBaseline="middle">
                <tspan fill="green"> {pass}</tspan>
                <tspan> /</tspan>
                <tspan fill="red"> {fail}</tspan>
            </text>
        </g>
    );
};



class AssetInventory extends PureComponent {
    _mounted = false
    state = {
        openDrawer: false,
        assets_inventory: {},
        graphData: []
    }


    currentValue = this.props.filterData

    componentDidMount() {
        this._mounted = true
        const filterData = this.props.filterData
        if (filterData.selectAccount.id !== 'all' && filterData.selectAccount.id !== undefined) {
            this._mounted = false
            this.fetchAssetInventory(filterData);
        } else {
        }
        this.unsubscribe = store.subscribe(this.receiveFilterData)
    }

    componentWillUnmount() {
        this._mounted = false
    }

    receiveFilterData = data => {

        const currentState = store.getState()
        const previousValue = this.currentValue
        this.currentValue = currentState.uiReducer.filterData

        if (
            this.currentValue &&
            (previousValue.selectAccount.id !== this.currentValue.selectAccount.id ||
                previousValue.selectCloud.id !== this.currentValue.selectCloud.id)
        ) {
            const filterData = cloneDeep(currentState.uiReducer.filterData)
            if (filterData.selectAccount.id !== 'all' && this._mounted) {
                this.fetchAssetInventory(filterData);
            }
        }
    }


    // --------------- Cusotm Logic Method Start----------------------
    toggleDrawer = (side, isOpen) => {
        this.setState({
            openDrawer: isOpen
        });
    };

    static getDerivedStateFromProps(nextProps, state) {
        return { assets_inventory: nextProps.assets_inventory }
    }


    componentDidUpdate = (prevProps, prevState) => {
        if (this.props.assets_inventory !== prevProps.assets_inventory) {
            this.setState({ assets_inventory: prevProps.assets_inventory }, () => {
                this.setData()
            })
        }
    }

    setData = () => {
        const data = this.state.assets_inventory
        let graphData = []
        Object.keys(data).forEach(function (key, index) {
            const obj = { name: key, uv: index * 25, Pass: data[key].assets, Fail: data[key].offenders, total: data[key].assets + data[key].offenders }
            graphData.push(obj)
        });
        this.setState({ graphData })
    }


    fetchAssetInventory = (filterData) => {
        let payload = {
        }

        if (filterData.selectAccount.id !== 'all' && filterData.selectAccount.id !== undefined) {
            payload['account'] = filterData.selectAccount.id
        }

        if (filterData.selectCloud.id !== 'all') {
            payload['cloud'] = filterData.selectCloud.id
        }


        this.props.actions.fetchAssetInventory(payload).then(result => {
            this._mounted = true
            if (result.success) {
                const data = result.data.count
                let graphData = []
                /**
                 * Fetch max value of sum(asset+offenders) for showing no of Y-axis
                 */
                const maxBothValue = maxBy(Object.values(data), function (o) { return o.assets + o.offenders; });
                const multipleOf = Math.ceil(this.round40(maxBothValue.assets + maxBothValue.offenders) / Object.keys(data).length)
                Object.keys(data).forEach(function (key, index) {
                    const obj = { name: key, service_name: data[key].service_name, uv: index * multipleOf, Assets: data[key].assets, Offenders: data[key].offenders, total: data[key].assets + '/' + data[key].offenders }
                    graphData.push(obj)
                });
                this.setState({ assets_inventory: result.data.count, graphData }, () => {

                })
            } else {
                let message = { message: result, showSnackbarState: true, variant: 'error' }
                this.props.showMessage(message)
            }
        });
    }

    round40(x) {
        return Math.ceil(x / 40) * 40;
    }

    render() {
        const { graphData } = this.state;

        return (
                <Card className="card-wizard card-panel card-pd mrB15 card-barchart" id="container_asset_invetory">
                    <CardTitle text={<span>  Asset Inventory </span>} />
                    <CardContent className="card-audit card-body">
                        <ErrorBoundary error="error-boundary">
                            {/* <div id="container">
                                <ResponsiveContainer>
                                    <BarChart data={graphData} barCategoryGap={5} barSize ={5}
                                        margin={{ top: 50, right: 5, left: 5, bottom: 30 }} >
                                        <CartesianGrid stroke="#ddd" vertical={false} />
                                        <XAxis padding={{ left: 5 }} fontSize="12" interval={0} dataKey={((x) => { return [x.name + ',' + x.service_name] })} tick={<CustomXAxisLabel />}>
                                            <Label fontSize="13" value="Services" offset={-20} position="insideBottom" />
                                        </XAxis>
                                        <YAxis fontSize="12" dataKey="uv">
                                            <Label dx={-10} fontSize="13" angle={-90} value="Number of Assets" position="center" />
                                        </YAxis>
                                        <Legend wrapperStyle={{ bottom: 0, fontSize: 12 }} verticalAlign="bottom" />
                                        <Bar dataKey="Assets" stackId="a" fill="#19c681" onClick={() => this.toggleDrawer('right', true)} />
                                        <Bar dataKey="Offenders" stackId="a" fill="#ec4e4e" onClick={() => this.toggleDrawer('right', true)} >
                                            <LabelList dataKey="total" content={renderCustomizedLabel} />
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div> */}
                            <HighBarChart/>
                        </ErrorBoundary>
                    </CardContent>
                </Card>
        );
    }

}


const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators(Object.assign({}, dashboardActions), dispatch),
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

const AssetInventoryRedux = withRouter(connect(mapStateToProps, mapDispatchToProps)(AssetInventory))

export default AssetInventoryRedux;