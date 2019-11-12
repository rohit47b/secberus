/*
 * @Author: Virendra Patidar 
 * @Date: 2018-11-16 14:55:42 
 * @Last Modified by: Virendra Patidar
 * @Last Modified time: 2019-05-22 13:56:22
 */
import React, { PureComponent } from 'react'
import { Link } from 'react-router-dom'
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Drawer from '@material-ui/core/Drawer'
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import AssetsWrapper from 'global/AssetsWrapper';
import SearchField from 'global/SearchField';
import PolicyList from './PolicyList'

import AddNewRuleList from './AddNewRuleList'

import history from 'customHistory'

class Policies extends PureComponent {
    state = {
        search: '',
        value: 0,
        completed: 0,
        activeAssetName: 'Total Policies',
        right: false
    }

    componentDidMount() {
        this.timer = setInterval(this.progress, 500);
    }

    componentWillUnmount() {
        clearInterval(this.timer);
    }

    searchHandler = name => event => {
        this.setState({ search: event.target.value })
    }

    progress = () => {
        const { completed } = this.state;
        if (completed === 100) {
            this.setState({ completed: 0 });
        } else {
            const diff = Math.random() * 10;
            this.setState({ completed: Math.min(completed + diff, 100) });
        }
    };

    handleChangeTab = (event, value) => {
        this.setState({ value });
    }

    toggleDrawer = (side, open) => () => {
        this.setState({
            [side]: open,
        });
    };

    filterAssets = (assetName) => {
        this.setState({ activeAssetName: assetName })
    }

    render() {
        mixpanel.track("View Page", {
            "Page Name": 'Policies',
        });
        const { value, activeAssetName, right } = this.state
        return (
            <Card className="card-wizard card-panel card-inner card-tab">
                <div className="card-title">
                    <h3 className="mrB10 mr0 main-heading">Policies</h3>
                    <Tabs
                        value={value}
                        onChange={this.handleChangeTab}
                        indicatorColor="primary"
                        className="tabs tab-policies"
                    >
                        <Tab
                            disableRipple
                            label={<div className="tab-text">Out of the Box Policies <span className="chip-sm chip-sm-gray mrL5">10</span></div>}
                            className="tab-item mrR15"
                        />
                        <Tab
                            disableRipple
                            label={<div className="tab-text">Custom Policies <span className="chip-sm chip-sm-gray mrL5">10</span></div>}
                            className="tab-item"
                        />

                    </Tabs>
                </div>
                <CardContent className="card-body">
                    <div className="download-icon">
                        Download
                       <Link className="pdL5 pdR5" to="/app/policies/copy-policies"><i className="fa fa-file-pdf-o" aria-hidden="true" ></i></Link>
                        <Link to=""><i className="fa fa-file-excel-o" aria-hidden="true" ></i></Link>
                    </div>
                    <div className="assets-wrapper assets-wrapper-no-label">
                        <AssetsWrapper progressBar={false} activeAssetName={activeAssetName} filterAssets={this.filterAssets} progressBarColorClass={"asset-progress-bar-red"} addClass={"asset-border-red"} message={"Total Policies"} assetName={"Total Policies"} content={"Total number of policies detected."} assetCount={"48"} />
                        {/* <AssetsWrapper activeAssetName={activeAssetName} filterAssets={this.filterAssets} progressBarColorClass={"asset-progress-bar-red"} addClass={"asset-border-red"} message={"Active Policies"}  assetName={"Active Policies"} content={"Total number of active policies detected."} assetCount={"13"} /> */}
                        <AssetsWrapper progressBar={false} activeAssetName={activeAssetName} filterAssets={this.filterAssets} progressBarColorClass={"asset-progress-bar-red"} addClass={"asset-border-red"} message={"Disabled Policies"} title={""} content={"Total number of disabled policies detected."} assetName={"Disabled Policies"} assetCount={"19"} />
                        {/* <div className="assets-box text-center">
                            <div className="assets-item add-asset">
                                <div className="add-icon mrB5 text-primary"  onClick={this.toggleDrawer('right', true)}>
                                    <i className="fa fa-plus" aria-hidden="true"></i>
                                </div>
                                <div className="asset-item-title">Create New Policy</div>
                            </div>
                        </div> */}
                    </div>

                    {value === 0 && <Typography component="p" className="fnt-13">
                       This page shows the default Secberus Policy for all accounts and supplemental out of the box compliance policies currently available (CIS, PCI, HIPAA).
                       All Polices will generate a Report, suppressing a Policy  will only suppress the Report.
                        To create a custom policy navigate to the Custom Policies tab in the header.
                    </Typography>}
                    {value === 1 && <Typography component="p" className="fnt-13">
                        This page shows the Custom Policies you have created. All Policies will generate a Report, suppressing a Policy will only suppress the Report. New Policies can be created for any group of new or existing rules.
                    </Typography>}

                    <Grid container spacing={24}>
                        <Grid item sm={12}>
                            <div className="d-flex justify-flex-end">
                                <SearchField handleChange={this.searchHandler} />
                            </div>
                        </Grid>
                    </Grid>
                    <Grid container spacing={24} className="grid-container">
                        <Grid item sm={12}>
                            <PolicyList />
                        </Grid>
                    </Grid>
                </CardContent>
                <Drawer className="right-sidebar sidebar" anchor="right" open={right}>
                    <AddNewRuleList toggleDrawer={this.toggleDrawer} />
                </Drawer>
            </Card>
        )
    }
}


export default Policies