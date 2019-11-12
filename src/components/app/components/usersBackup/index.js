/*
 * @Author: Virendra Patidar 
 * @Date: 2018-11-16 14:55:42 
 * @Last Modified by: Virendra Patidar
 * @Last Modified time: 2019-03-12 10:21:08
 */
import React, { PureComponent } from 'react'
import { Link } from 'react-router-dom'
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Drawer from '@material-ui/core/Drawer'
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Grid from '@material-ui/core/Grid';

import AssetsWrapper from 'global/AssetsWrapper';
import SearchField from 'global/SearchField';
import UserList from './UserList'

import AddNewRuleList from './AddNewRuleList'

class Users extends PureComponent {
    state = {
        search: '',
        value: 0,
        completed: 0,
        activeAssetName:'Total',
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

    filterAssets=(assetName)=>{ 
    this.setState({activeAssetName:assetName}) 
    }

    render() {
        const { value, activeAssetName,right } = this.state
        return (
            <Card className="card-wizard card-panel card-tab card-inner">
                <div className="card-title">
                    <h3 className="mrB10 mr0 main-heading">Users</h3>
                    <Tabs
                        value={value}
                        onChange={this.handleChangeTab}
                        indicatorColor="primary"
                        className="tabs tab-policies"
                    >
                        <Tab
                            disableRipple
                            label="Users"
                            className="tab-item mrR20"
                        />
                        <Tab
                            disableRipple
                            label="Groups"
                            className="tab-item mrR20"
                        />
                        <Tab
                            disableRipple
                            label="Roles"
                            className="tab-item mrR20"
                        />
                        <Tab
                            disableRipple
                            label="Access Keys"
                            className="tab-item"
                        />
                        

                    </Tabs>
                </div>
                <CardContent className="card-body">
                    <div className="download-icon">
                       Download 
                       <Link className="pdL5 pdR5" to=""><i className="fa fa-file-pdf-o" aria-hidden="true" ></i></Link>
                       <Link to=""><i className="fa fa-file-excel-o" aria-hidden="true" ></i></Link>
                    </div>
                    <div className="assets-wrapper mrB20">
                        <AssetsWrapper isHelper={false} activeAssetName={activeAssetName} filterAssets={this.filterAssets} progressBarColorClass={"asset-progress-bar-red"} addClass={"asset-border-red"}  assetName={"Total"} assetCount={"19"} />
                        <AssetsWrapper message={"MFA Disabled"} content={"Lorem Ipsum is simply dummy text of the printing and typesetting industry."} activeAssetName={activeAssetName} filterAssets={this.filterAssets} progressBarColorClass={"asset-progress-bar-red"} addClass={"asset-border-red"}  assetName={"MFA Disabled"} assetCount={"13"} />
                        <AssetsWrapper message={"Inactive"} content={"Lorem Ipsum is simply dummy text of the printing and typesetting industry."} activeAssetName={activeAssetName} filterAssets={this.filterAssets} progressBarColorClass={"asset-progress-bar-red"} addClass={"asset-border-red"} title={""} assetName={"Inactive"} assetCount={"1"} />
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
                        <Grid item sm={12}>
                            <div className="d-flex justify-flex-end">
                                <SearchField handleChange={this.searchHandler} />
                            </div>
                        </Grid>
                    </Grid>
                    <Grid container spacing={24} className="grid-container">
                        <Grid item sm={12}>
                           <UserList/>
                        </Grid>
                    </Grid>
                </CardContent>
                <Drawer className="right-sidebar sidebar" anchor="right" open={right}>
                   <AddNewRuleList toggleDrawer={this.toggleDrawer}/>
                </Drawer>
            </Card>
        )
    }
}


export default Users