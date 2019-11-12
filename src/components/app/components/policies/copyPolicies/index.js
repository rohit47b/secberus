/*
 * @Author: Virendra Patidar 
 * @Date: 2018-11-16 14:55:42 
 * @Last Modified by: Virendra Patidar
 * @Last Modified time: 2019-03-04 16:11:15
 */
import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom'
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Chip from '@material-ui/core/Chip';
import Drawer from '@material-ui/core/Drawer';
import FormControl from '@material-ui/core/FormControl';
import Grid from '@material-ui/core/Grid';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Button from '@material-ui/core/Button'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'

import AssetsWrapper from 'global/AssetsWrapper';
import SearchField from 'global/SearchField';

import AddNewRuleList from '../AddNewRuleList';
import CopyPoliciesList from './CopyPoliciesList';

import history from 'customHistory';

const names = [
    'Aws',
    'Soc2',
];

class CopyPolicies extends PureComponent {
    state = {
        search: '',
        value: 0,
        completed: 0,
        activeAssetName: 'Storage Assets',
        right: false,
        name: []
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

    handleChange = event => {
        this.setState({ name: event.target.value });
    }

    render() {
        const { value, activeAssetName, right } = this.state
        return (
            <Card className="card-wizard card-panel card-tab">
                <div className="card-title">
                    <h3 className="">Policies / <span className="font-normal">Copy Policy</span></h3>
                </div>
                <CardContent className="card-body">
                   <div className="download-icon">
                       Download 
                       <Link className="pdL5 pdR5" to=""><i className="fa fa-file-pdf-o" aria-hidden="true" ></i></Link>
                       <Link to=""><i className="fa fa-file-excel-o" aria-hidden="true" ></i></Link>
                    </div>
                    <div className="assets-wrapper mrB20">
                        <AssetsWrapper activeAssetName={activeAssetName} filterAssets={this.filterAssets} progressBarColorClass={"asset-progress-bar-red"} addClass={"asset-border-red"} assetName={"Total Policies"} assetCount={"48"} />
                        <hr className="vertical-divider" />
                        <AssetsWrapper activeAssetName={activeAssetName} filterAssets={this.filterAssets} progressBarColorClass={"asset-progress-bar-red"} addClass={"asset-border-red"} assetName={"Policies Active"} assetCount={"13"} />
                        <AssetsWrapper activeAssetName={activeAssetName} filterAssets={this.filterAssets} progressBarColorClass={"asset-progress-bar-red"} addClass={"asset-border-red"} title={""} assetName={"Policies Stopped"} assetCount={"19"} />
                        <div className="assets-box text-center">
                            <div className="assets-item add-asset">
                                <div className="add-icon mrB5 text-primary"  onClick={this.toggleDrawer('right', true)}>
                                    <i className="fa fa-plus" aria-hidden="true"></i>
                                </div>
                                <div className="asset-item-title">Add New Rule</div>
                            </div>
                        </div>
                    </div>
                    <Grid container spacing={24}>
                        <div className="policy-info bg-light d-flex align-item-center text-wrap">
                            <Grid item sm={3}>
                                Policy Name: SOC2 Compliance
                        </Grid>
                            <Grid item sm={3}>
                                <div className="d-flex align-item-center">
                                    <label className="mrR5">Labels:</label>
                                    <FormControl className="select-chip-control">
                                        <Select
                                            multiple
                                            className="select-chip-box"
                                            value={this.state.name}
                                            onChange={this.handleChange}
                                            input={<Input id="select-multiple-chip" />}
                                            renderValue={selected => (
                                                <div>
                                                    {selected.map(value => (
                                                        <Chip className="select-chip-item" key={value} label={value} />
                                                    ))}
                                                </div>
                                            )}

                                        >
                                            {names.map(name => (
                                                <MenuItem key={name} value={name}>
                                                    {name}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </div>
                            </Grid>
                            <Grid item sm={3} className="text-center">
                                <span>Author:System</span>
                            </Grid>
                            <Grid item sm={3} className="text-right">
                                <Button variant="contained" color="primary" className="btn-primary btn-md mrR10">
                                    Save
                                </Button>
                                <Button variant="contained" color="primary" className="btn-gray btn-md">
                                    Cancel
                                </Button>
                            </Grid>
                        </div>
                    </Grid>
                    <Grid container spacing={24}>
                        <Grid item sm={6}>
                            <span className="mrR10">Select Account: All Selected</span>
                            <span>
                                <i className="fa fa-filter" aria-hidden="true"></i>
                            </span>
                        </Grid>
                        <Grid item sm={6}>
                            <div className="d-flex align-item-center justify-flex-end">
                                <label className="mrR5">Resource Tags:</label>
                                <Input
                                    placeholder="Key"
                                    inputProps={{
                                        'aria-label': 'Description',
                                    }}
                                    className="input-control mrR10"
                                />
                                <Input
                                    placeholder="Value"
                                    inputProps={{
                                        'aria-label': 'Description',
                                    }}
                                    className="input-control mrR10"
                                />
                                <span><i className="fa fa-plus" aria-hidden="true"></i></span>
                            </div>
                        </Grid>
                    </Grid>
                    <Grid container spacing={24}>
                        <Grid item sm={12} className="pdB0">
                            <hr className="line-divider mrL0 mrR0" />
                        </Grid>
                    </Grid>

                    <Grid container spacing={24}>
                        <Grid item sm={9}>
                            <Tabs
                                value={value}
                                onChange={this.handleChangeTab}
                                indicatorColor="primary"
                                className="tabs tab-policies"
                                textColor="primary"
                            >
                                <Tab
                                    disableRipple
                                    label="CC3.0 Risk Assessment"
                                    className="tab-item tab-margin"
                                />
                                <Tab
                                    disableRipple
                                    label="CC4.0 Monitoring Activities"
                                    className="tab-item tab-margin "
                                />
                                 <Tab
                                    disableRipple
                                    label="CC6.0 Logical and Physical Access Controls"
                                    className="tab-item tab-margin"
                                />
                                 <Tab
                                    disableRipple
                                    label="System Operation"
                                    className="tab-item tab-margin"
                                />
                                 <Tab
                                    disableRipple
                                    label="All Additional Criteria for Availability"
                                    className="tab-item"
                                />

                            </Tabs>
                        </Grid>
                        <Grid item sm={3} className="text-right">
                            <div className="d-flex justify-flex-end">
                                <SearchField handleChange={this.searchHandler} />
                            </div>
                        </Grid>
                    </Grid>
                    <Grid container spacing={24} className="grid-container">
                        <Grid item sm={12}>
                            <CopyPoliciesList />
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


export default CopyPolicies