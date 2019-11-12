/*
 * @Author: Virendra Patidar 
 * @Date: 2018-09-27 09:03:40 
 * @Last Modified by: Virendra Patidar
 * @Last Modified time: 2019-04-23 14:31:20
 */
import React, { PureComponent } from 'react'

import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'


import { PieChart } from 'react-d3-components'
import PieGraph from './PieGraph';

import ErrorBoundary from 'global/ErrorBoundary'


import DashboardContext from "context/DashboardContext"
const DashboardContextConsumer = DashboardContext.Consumer



class Services extends PureComponent {
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
        name: ['EC2']
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
                                Services
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
                                    <MenuItem className="select-item select-item-text" key={'EC2'} value={'EC2'}>
                                        <img src="/assets/service-icon/ec2.png" alt="EC2" width="15" />
                                        <span className="mrL5">EC2</span>
                                    </MenuItem>
                                    <MenuItem className="select-item select-item-text">
                                        <img src="/assets/service-icon/s3.png" alt="S3" width="15" />
                                        <span className="mrL5">S3</span>
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
                                innerRadius={70}
                                outerRadius={-10}
                                margin={{ top: 10, bottom: 10, left: 10, right: 10 }}
                                colorScale={scale}

                            /> */}
                            <PieGraph/>
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
        {dashboardData => <Services {...props} securityIssue={dashboardData.securityIssue} data={dashboardData.securityIssueByService.data} count={dashboardData.securityIssueByService.count} />}
    </DashboardContextConsumer>
);
