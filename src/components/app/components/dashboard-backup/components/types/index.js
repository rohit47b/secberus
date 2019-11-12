/*
 * @Author: Virendra Patidar 
 * @Date: 2018-09-27 09:03:40 
 * @Last Modified by: Virendra Patidar
 * @Last Modified time: 2019-01-17 11:59:30
 */
import React, { PureComponent } from 'react'

import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import Input from '@material-ui/core/Input';


import { PieChart } from 'react-d3-components'

import ErrorBoundary from 'global/ErrorBoundary'

import SecurityIssueBreakdownItem from './SecurityIssueBreakdownItem'

import Graph from './Graph';

import DashboardContext from "context/DashboardContext"
const DashboardContextConsumer = DashboardContext.Consumer



class Types extends PureComponent {
    state = {
        pieChartData: {
            "label": "s3",
            "values": [
                {
                    "x": "Critical",
                    "y": 10
                },
                {
                    "x": "High",
                    "y": 2
                },
                {
                    "x": "Medium",
                    "y": 10
                },
                {
                    "x": "Low",
                    "y": 2
                },
            ]
        },
        name: ['Identity & Asset Management']
    }

    handleChange = event => {
        this.setState({ name: event.target.value });
    }

    render() {
        const { pieChartData, name } = this.state
        const scale = d3.scale.ordinal().range(['#ec4e4e', '#ECD24E', "#24BA4D", "#ECA84E"]);
        return (
            <Card className="card-wizard card-panel card-d3chart height-100">
                <div className="card-title">
                    <Grid container spacing={24}>
                        <Grid item sm={3}>
                            <Typography component="h5" className="pdT5">
                                Type
                            </Typography>
                        </Grid>
                        <Grid item sm={9} className="text-right">
                            <FormControl className="multi-select single-select">
                                <Select
                                    value={name}
                                    //onChange={this.handleChange}
                                    input={<Input id="select-multiple" />}
                                    renderValue={selected => selected.join(', ')}
                                    className="select-feild"
                                    MenuProps={{
                                        style: {
                                            top: '38px'
                                        }
                                    }}
                                >
                                    <MenuItem className="select-item select-item-text"  key={'Identity & Asset Management'} value={'Identity & Asset Management'}>
                                        <span>Identity & Asset Management</span>
                                    </MenuItem>
                                     <MenuItem className="select-item select-item-text">
                                        <span>Networking</span>
                                    </MenuItem>
                                    <MenuItem className="select-item select-item-text">
                                        <span>Database</span>
                                    </MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>

                </div>

                <CardContent className="card-audit card-body">
                    <div className="d-flex">
                        <ErrorBoundary error="error-boundary">
                            {/* <PieChart
                                data={pieChartData}
                                width={180}
                                height={145}
                                hideLabels={true}
                                innerRadius={0}
                                outerRadius={72}
                                margin={{ top: 10, bottom: 10, left: 10, right: 10 }}
                                colorScale={scale}

                            /> */}
                            <Graph/>
                            {/* <div className="issue-item">
                                <ul>
                                    <li>
                                        <span className="line line-red"></span>
                                        <span className="issue-text">Critical</span>
                                        <span className="issue-count" >09</span>
                                    </li>
                                    <li>
                                        <span className="line line-orange"></span>
                                        <span className="issue-text">High</span>
                                        <span className="issue-count" >15</span>
                                    </li>
                                    <li>
                                        <span className="line line-yellow"></span>
                                        <span className="issue-text">Medium</span>
                                        <span className="issue-count" >18</span>
                                    </li>
                                    <li>
                                        <span className="line line-green"></span>
                                        <span className="issue-text">Low</span>
                                        <span className="issue-count" >60</span>
                                    </li>
                                </ul>
                            </div> */}
                        </ErrorBoundary>
                    </div>
                </CardContent>
            </Card>
        );
    }

}

export default props => (
    <DashboardContextConsumer>
        {dashboardData => <Types {...props} securityIssue={dashboardData.securityIssue} data={dashboardData.securityIssueByService.data} count={dashboardData.securityIssueByService.count} />}
    </DashboardContextConsumer>
);
