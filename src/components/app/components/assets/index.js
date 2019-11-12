/*
 * @Author: Virendra Patidar 
 * @Date: 2018-11-16 14:55:42 
 * @Last Modified by: Virendra Patidar
 * @Last Modified time: 2019-05-08 09:53:40
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
import AssetsWrapperAlternative from 'global/AssetsWrapperAlternative';
import SearchField from 'global/SearchField';
import AssetList from './AssetList'
import AddNewRuleList from './AddNewRuleList'

import history from 'customHistory';

class Assets extends PureComponent {

    state = {
        search: '',
        value: 0,
        completed: 0,
        activeAssetName:'Storage Assets',
        right: false
    }

    componentDidMount() {
        this.timer = setInterval(this.progress, 10000);
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

    wrapComponentCellRenderer = (params) => {
        return (
            <CellMeasurer
              cache={this._cache}
              columnIndex={params.columnIndex}
              key={params.dataKey}
              parent={params.parent}
              rowIndex={params.rowIndex}>
              <div
                className={"tableColumn"}
                style={{
                    whiteSpace: 'normal'
                }}>
                {params.component}
              </div>
            </CellMeasurer>
          );
    }

    render() {
        const { value, activeAssetName,right } = this.state
        return (
            <Card className="card-wizard card-panel card-tab card-inner">
                <div className="card-title">
                    <h3 className="mrB10 mr0 main-heading">Assets</h3>
                    <Tabs
                        value={value}
                        onChange={this.handleChangeTab}
                        indicatorColor="primary"
                        className="tabs"
                    >
                        <Tab
                            disableRipple
                            label={<div className="icon-img"><img src="/assets/service-icon/s3_transparent_icon.png" alt="S3"/> S3</div>}
                            className="tab-item mrR15"
                        />
                        <Tab
                            disableRipple
                            label={<div className="icon-img"><img src="/assets/service-icon/aurora_transparent_icon.png" alt="Aurora"/> Aurora</div>}
                            className="tab-item"
                        />

                    </Tabs>
                </div>
                <CardContent className="card-body">
                    {/* <div className="download-icon">
                       Download 
                       <Link target="_blank" className="pdL5 pdR5" to=""><i className="fa fa-file-pdf-o" aria-hidden="true" ></i></Link>
                       <Link to=""><i className="fa fa-file-excel-o" aria-hidden="true" ></i></Link>
                    </div> */}
                    <div className="assets-wrapper mrB20 header-50">
                        <AssetsWrapperAlternative message={"Storage Assets"} content={"Lorem Ipsum is simply dummy text of the printing and typesetting industry."} activeAssetName={activeAssetName} filterAssets={this.filterAssets} progressBarColorClass={"asset-progress-bar-red"} addClass={"asset-border-red"} title={"TOTAL ASSETS"} assetName={"Storage Assets"} assetCount={countAssets.totalAssets} />
                        <AssetsWrapperAlternative message={"MFA Delete Disabled"} content={"Lorem Ipsum is simply dummy text of the printing and typesetting industry."} activeAssetName={activeAssetName} filterAssets={this.filterAssets} progressBarColorClass={"asset-progress-bar-red"} addClass={"asset-border-red"} title={"FAILED ASSETS"} assetName={"MFA Delete Disabled"} assetCount={countAssets.totalAssets} />
                        <AssetsWrapperAlternative message={"Logging Disabled"} content={"Lorem Ipsum is simply dummy text of the printing and typesetting industry."} activeAssetName={activeAssetName} filterAssets={this.filterAssets} progressBarColorClass={"asset-progress-bar-red"} addClass={"asset-border-red"} title={""} assetName={"Logging Disabled"} assetCount={countAssets.totalAssets} />
                        <AssetsWrapperAlternative message={"Unencrypted"} content={"Lorem Ipsum is simply dummy text of the printing and typesetting industry."} activeAssetName={activeAssetName} filterAssets={this.filterAssets} progressBarColorClass={"asset-progress-bar-red"} addClass={"asset-border-red"} assetName={"Unencrypted"} assetCount={countAssets.totalAssets} />
                        <AssetsWrapperAlternative message={"Public Access"} content={"Lorem Ipsum is simply dummy text of the printing and typesetting industry."} activeAssetName={activeAssetName} filterAssets={this.filterAssets} progressBarColorClass={"asset-progress-bar-red"} addClass={"asset-border-red"} assetName={"Public Access"} assetCount={countAssets.totalAssets} />
                        {/* <div className="assets-box text-center">
                            <div className="assets-item add-asset">
                                <div className="add-icon mrB5 text-primary"  onClick={this.toggleDrawer('right', true)}>
                                    <i className="fa fa-plus" aria-hidden="true"></i>
                                </div>
                                <div className="asset-item-title">Add New Rule</div>
                            </div>
                        </div> */}
                    </div>
                    <Typography component="p" className="fnt-13">
                    This page shows all assets deployed within your cloud infrastructure, as well as their tags,
                    owner and region. On this page you can also adjust the assets' weight,
                    which will increase is critically within the Cumulus Risk Engine and produce a SIR Score more aligned with your organizational goals.
                    You should increase the weight of assets that you feel are of a higher security priority. You can suppress an asset if you wish to no
                    longer receive alerts for that asset.
                    </Typography>
                    <Grid container spacing={24}>
                        <Grid item xs={12} sm={12}>
                            <div className="d-flex justify-flex-end">
                                <SearchField handleChange={this.searchHandler} />
                            </div>
                        </Grid>
                    </Grid>
                    <Grid container spacing={24} className="grid-container">
                        <Grid item xs={12} sm={12}>
                           <AssetList/>
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


export default Assets; 