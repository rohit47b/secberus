/*
 * @Author: Virendra Patidar 
 * @Date: 2018-11-16 14:55:42 
 * @Last Modified by: Virendra Patidar
 * @Last Modified time: 2019-05-22 13:50:13
 */
import React, { PureComponent } from 'react'
import { Link } from 'react-router-dom'
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Drawer from '@material-ui/core/Drawer'
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Grid from '@material-ui/core/Grid';
import { setActiveMenu, setActiveParentMenu } from 'actions/commonAction';
import Typography from '@material-ui/core/Typography';
import { withRouter } from 'react-router-dom'
import { connect } from "react-redux"
import { bindActionCreators } from 'redux'

import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import Input from '@material-ui/core/Input';

import * as assetsActions from 'actions/assetsAction';
import AssetsWrapperAlternative from 'global/AssetsWrapperAlternative';
import AssetsWrapper from 'global/AssetsWrapperAlternative';
import SearchField from 'global/SearchField';
import S3AssetList from './S3AssetList'
import RedshiftAssetList from './RedshiftAssetList'
import RdsAssetList from './RdsAssetList'
import SnapshotAssetList from './SnapshotAssetList'
import ClusterSnapshotAssetList from './ClusterSnapshotAssetList'
import RdsBackupList from './RdsBackupList'
import EventSubscriptionAssetList from './EventSubscriptionAssetList'
import DynamoAssetList from './DynamoAssetList'
import S3BucketPolicyStmtAssetList from './S3BucketPolicyStmtAssetList'
import S3BucketAclAssetList from './S3BucketAclAssetList'
import S3BucketCorsAssetList from './S3BucketCorsAssetList'
import RedshiftParametergroupAssetList from './RedshiftParametergroupAssetList'
import AddNewRuleList from './AddNewRuleList'

import { showMessage } from 'actions/messageAction'
import { setProgressBar, setCountAssets } from 'actions/commonAction'

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
        this.props.setActiveParentMenu('Assets')
        this.props.setActiveMenu('Data Storage')
        if (this.props.location.state !== undefined) {
            if (this.props.location.state.backUrlState !== undefined) {
                if (this.props.location.state.backUrlState.value !== undefined) {
                    this.setState({value: this.props.location.state.backUrlState.value})
                }
            }
        }
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
        this.setState({ value: event.target.value });
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
        mixpanel.track("View Page", {
            "Page Name": 'Assets Storage',
        });
        const { value, activeAssetName,right } = this.state
        const { countAssets } = this.props
        return (
            <Card className="card-wizard card-panel card-inner card-tab">
                <div className="card-title">
                    <h3 className="card-heading">Data Storage Assets</h3>
                    <FormControl className="multi-select single-select">
                        <Select
                            value={value}
                            name="tabs"
                            onChange={this.handleChangeTab}
                            input={<Input id="select-multiple" />}
                            className="select-feild"
                            MenuProps={{
                                className: 'select-asset-dropdown'
                            }}
                        >
                            <MenuItem className="select-item select-item-text" key={0} value={0}>
                                <img className="select-img" src="/assets/service-icon/s3_transparent_icon.png" alt="S3"/><span>S3</span>
                            </MenuItem>
                            <MenuItem className="select-item select-item-text" key={1} value={1}>
                                <img className="select-img" src="/assets/service-icon/s3_transparent_icon.png" alt="S3 Bucket Policy Stmt"/><span>S3 Bucket Policy</span>
                            </MenuItem>
                            <MenuItem className="select-item select-item-text" key={2} value={2}>
                                <img className="select-img" src="/assets/service-icon/s3_transparent_icon.png" alt="S3 Bucket Acl"/><span>S3 Bucket Acl</span>
                            </MenuItem>
                            <MenuItem className="select-item select-item-text" key={3} value={3}>
                                <img className="select-img" src="/assets/service-icon/s3_transparent_icon.png" alt="S3 Bucket Cors"/><span>S3 Bucket Cors</span>
                            </MenuItem>
                            <MenuItem className="select-item select-item-text" key={4} value={4}>
                                <img className="select-img" src="/assets/service-icon/rds.png" alt="RDS Intance"/><span>RDS Instance</span>
                            </MenuItem>
                            <MenuItem className="select-item select-item-text" key={5} value={5}>
                                <img className="select-img" src="/assets/service-icon/rds.png" alt="RDS Snapshot"/><span>RDS Snapshot</span>
                            </MenuItem>
                            <MenuItem className="select-item select-item-text" key={6} value={6}>
                                <img className="select-img" src="/assets/service-icon/rds.png" alt="RDS Cluster Snapshots"/><span>RDS Cluster Snapshots</span>
                            </MenuItem>
                            <MenuItem className="select-item select-item-text" key={7} value={7}>
                                <img className="select-img" src="/assets/service-icon/rds.png" alt="RDS Event Subscription"/><span>RDS Event Subscription</span>
                            </MenuItem>
                            <MenuItem className="select-item select-item-text" key={8} value={8}>
                                <img className="select-img" src="/assets/service-icon/rds.png" alt="RDS Backups"/><span>RDS Backups</span>
                            </MenuItem>
                            <MenuItem className="select-item select-item-text" key={9} value={9}>
                                <img className="select-img" src="/assets/service-icon/redshift.png" alt="Redshift"/><span>Redshift</span>
                            </MenuItem>
                            <MenuItem className="select-item select-item-text" key={10} value={10}>
                                <img className="select-img" src="/assets/service-icon/redshift.png" alt="Redshift Parameter Group"/><span>Redshift Parameter Group</span>
                            </MenuItem>
                            <MenuItem className="select-item select-item-text" key={11} value={11}>
                                <img className="select-img" src="/assets/service-icon/dynamodb.png" alt="DynamoDb"/><span>Dynamo</span>
                            </MenuItem>
                        </Select>
                    </FormControl>
                    {/* <Tabs
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
                            label={<div className="icon-img"><img src="/assets/service-icon/s3_transparent_icon.png" alt="S3 Bucket Policy Stmt"/> S3 Bucket Policy</div>}
                            className="tab-item mrR15"
                        />
                        <Tab
                            disableRipple
                            label={<div className="icon-img"><img src="/assets/service-icon/rds.png" alt="RDS Intance"/> RDS Instance</div>}
                            className="tab-item mrR15"
                        />
                        <Tab
                            disableRipple
                            label={<div className="icon-img"><img src="/assets/service-icon/rds.png" alt="RDS Snapshot"/> RDS Snapshot</div>}
                            className="tab-item mrR15"
                        />
                        <Tab
                            disableRipple
                            label={<div className="icon-img"><img src="/assets/service-icon/rds.png" alt="RDS Cluster Snapshots"/> RDS Cluster Snapshots</div>}
                            className="tab-item mrR15"
                        />
                        <Tab
                            disableRipple
                            label={<div className="icon-img"><img src="/assets/service-icon/rds.png" alt="RDS Event Subscription"/> RDS Event Subscription</div>}
                            className="tab-item mrR15"
                        />
                        <Tab
                            disableRipple
                            label={<div className="icon-img"><img src="/assets/service-icon/rds.png" alt="RDS Backups"/> RDS Backups</div>}
                            className="tab-item mrR15"
                        />
                        <Tab
                            disableRipple
                            label={<div className="icon-img"><img src="/assets/service-icon/redshift.png" alt="Redshift"/> Redshift</div>}
                            className="tab-item mrR15"
                        />
                        <Tab
                            disableRipple
                            label={<div className="icon-img"><img src="/assets/service-icon/redshift.png" alt="Redshift Parameter Group"/> Redshift Parameter Group</div>}
                            className="tab-item mrR15"
                        />
                        <Tab
                            disableRipple
                            label={<div className="icon-img"><img src="/assets/service-icon/dynamodb.png" alt="DynamoDb"/> Dynamo</div>}
                            className="tab-item"
                        />

                    </Tabs> */}
                </div>
                {value === 0 &&
                    <CardContent className="card-body">
                        {/* <div className="download-icon">
                        Download 
                        <Link target="_blank" className="pdL5 pdR5" to=""><i className="fa fa-file-pdf-o" aria-hidden="true" ></i></Link>
                        <Link to=""><i className="fa fa-file-excel-o" aria-hidden="true" ></i></Link>
                        </div> */}
                        <div className="assets-wrapper">
                            <AssetsWrapperAlternative progressBar={false} message={"Storage Assets"} content={"This displays the total number of <span class='text-success'>S3</span> assets detected within your infrastructure as of the last scan."} activeAssetName={activeAssetName} filterAssets={this.filterAssets} progressBarColorClass={"asset-progress-bar-red"} addClass={"asset-border-red"} title={"TOTAL ASSETS"} assetName={"Storage Assets"} assetCount={countAssets.totalAssets} />
                            <AssetsWrapperAlternative progressBar={false} message={"MFA Delete Disabled"} content={"This displays the total number of <span class='text-success'>S3</span> assets detected with MFA delete disabled"} activeAssetName={activeAssetName} filterAssets={this.filterAssets} progressBarColorClass={"asset-progress-bar-red"} addClass={"asset-border-red"} title={"FAILED ASSETS"} assetName={"MFA Delete Disabled"} assetCount={countAssets.totalMfaAssets} />
                            <AssetsWrapperAlternative progressBar={false}  message={"Logging Disabled"} content={"Lorem Ipsum is simply dummy text of the printing and typesetting industry."} activeAssetName={activeAssetName} filterAssets={this.filterAssets} progressBarColorClass={"asset-progress-bar-red"} addClass={"asset-border-red"} title={""} assetName={"Logging Disabled"} assetCount={countAssets.totalLogingAssets} />
                            <AssetsWrapperAlternative progressBar={false} message={"Unencrypted"} content={"This displays the total number of unencrypted <span class='text-success'>S3</span> assets detected"} activeAssetName={activeAssetName} filterAssets={this.filterAssets} progressBarColorClass={"asset-progress-bar-red"} addClass={"asset-border-red"} assetName={"Unencrypted"} assetCount={countAssets.totalEncryptedAssets} />
                            <AssetsWrapperAlternative progressBar={false} message={"Public Access"} content={"This displays the total number of publicly accessible <span class='text-success'>S3</span> assets detected"} activeAssetName={activeAssetName} filterAssets={this.filterAssets} progressBarColorClass={"asset-progress-bar-red"} addClass={"asset-border-red"} assetName={"Public Access"} assetCount={countAssets.totalPublicAssets} />
                            {/* <div className="assets-box text-center">
                                <div className="assets-item add-asset">
                                    <div className="add-icon mrB5 text-primary"  onClick={this.toggleDrawer('right', true)}>
                                        <i className="fa fa-plus" aria-hidden="true"></i>
                                    </div>
                                    <div className="asset-item-title">Add New Rule</div>
                                </div>
                            </div> */}
                        </div>
                       
                        <Typography component="p" className="fnt-13 mrB15">
                        This page displays all of the <span className="text-success">Data Storage</span> assets deployed within the selected cloud infrastructure, categorized by asset type. By default, Amazon S3 instances are displayed.
                        You can view the other Data Storage assets deployed by selecting their respective sub-pages above. 
                        </Typography>

                        <Typography component="p" className="fnt-13 mrB15">
                        On this page you can adjust the asset weights,
                        which will increase an asset's criticality within the Cumulus Risk Engine, producing a SIR score more aligned with your organization goals.
                        You should increase the weight of assets that you feel are of a higher security priority. 
                        </Typography>

                        <Typography component="p" className="fnt-13 mrB15">
                        You can suppress an asset if you no longer want to receive alerts for that asset.
                        </Typography>

                        <Typography component="p" className="fnt-13">
                        For more information on asset weights and the suppression of assets, please see our <a href="http://help.secberus.com/en/articles/2869020-how-to-customize-asset-weights" target="_blank"><span className="link-hrf">Knowledge library.</span></a>.
                        </Typography>
                        
                        <Grid container spacing={24}>
                            <Grid item xs={12} sm={12}>
                                {/* <div className="d-flex justify-flex-end">
                                    <SearchField handleChange={this.searchHandler} />
                                </div> */}
                            </Grid>
                        </Grid>
                        <Grid container spacing={24} className="grid-container">
                            <Grid item xs={12} sm={12}>
                            <S3AssetList value={value}/>
                            </Grid>
                        </Grid>
                    </CardContent>
                }

                {value === 1 &&
                    <CardContent className="card-body">
                        {/* <div className="download-icon">
                        Download 
                        <Link target="_blank" className="pdL5 pdR5" to=""><i className="fa fa-file-pdf-o" aria-hidden="true" ></i></Link>
                        <Link to=""><i className="fa fa-file-excel-o" aria-hidden="true" ></i></Link>
                        </div> */}
                        <div className="assets-wrapper">
                            <AssetsWrapperAlternative progressBar={false} message={"Storage Assets"} content={"This displays the total number of RDS Instance assets detected within your infrastucture as of the last scan."} activeAssetName={activeAssetName} filterAssets={this.filterAssets} progressBarColorClass={"asset-progress-bar-red"} addClass={"asset-border-red"} title={"TOTAL ASSETS"} assetName={"S3 Bucket Policy Stmt"} assetCount={countAssets.totalAssets} />
                            {/* <div className="assets-box text-center">
                                <div className="assets-item add-asset">
                                    <div className="add-icon mrB5 text-primary"  onClick={this.toggleDrawer('right', true)}>
                                        <i className="fa fa-plus" aria-hidden="true"></i>
                                    </div>
                                    <div className="asset-item-title">Add New Rule</div>
                                </div>
                            </div> */}
                        </div>
                        <Typography component="p" className="fnt-13 mrB15">
                        This page displays all of the <span className="text-success">Data Storage</span> assets deployed within the selected cloud infrastructure, categorized by asset type. By default, Amazon S3 instances are displayed.
                        You can view the other Data Storage assets deployed by selecting their respective sub-pages above. 
                        </Typography>

                        <Typography component="p" className="fnt-13 mrB15">
                        On this page you can adjust the asset weights,
                        which will increase an asset's criticality within the Cumulus Risk Engine, producing a SIR score more aligned with your organization goals.
                        You should increase the weight of assets that you feel are of a higher security priority. 
                        </Typography>

                        <Typography component="p" className="fnt-13 mrB15">
                        You can suppress an asset if you no longer want to receive alerts for that asset.
                        </Typography>

                        <Typography component="p" className="fnt-13">
                        For more information on asset weights and the suppression of assets, please see our <a href="http://help.secberus.com/en/articles/2869020-how-to-customize-asset-weights" target="_blank"><span className="link-hrf">Knowledge library.</span></a>.
                        </Typography>
                        <Grid container spacing={24}>
                            <Grid item sm={12}>
                                {/* <div className="d-flex justify-flex-end">
                                    <SearchField handleChange={this.searchHandler} />
                                </div> */}
                            </Grid>
                        </Grid>
                        <Grid container spacing={24} className="grid-container">
                            <Grid item sm={12}>
                                <S3BucketPolicyStmtAssetList value={value}/>
                            </Grid>
                        </Grid>
                    </CardContent>
                }

                {value === 2 &&
                    <CardContent className="card-body">
                        {/* <div className="download-icon">
                        Download 
                        <Link target="_blank" className="pdL5 pdR5" to=""><i className="fa fa-file-pdf-o" aria-hidden="true" ></i></Link>
                        <Link to=""><i className="fa fa-file-excel-o" aria-hidden="true" ></i></Link>
                        </div> */}
                        <div className="assets-wrapper">
                            <AssetsWrapperAlternative progressBar={false} message={"Storage Assets"} content={"This displays the total number of RDS Instance assets detected within your infrastucture as of the last scan."} activeAssetName={activeAssetName} filterAssets={this.filterAssets} progressBarColorClass={"asset-progress-bar-red"} addClass={"asset-border-red"} title={"TOTAL ASSETS"} assetName={"S3 Bucket Acl"} assetCount={countAssets.totalAssets} />
                            {/* <div className="assets-box text-center">
                                <div className="assets-item add-asset">
                                    <div className="add-icon mrB5 text-primary"  onClick={this.toggleDrawer('right', true)}>
                                        <i className="fa fa-plus" aria-hidden="true"></i>
                                    </div>
                                    <div className="asset-item-title">Add New Rule</div>
                                </div>
                            </div> */}
                        </div>
                        <Typography component="p" className="fnt-13 mrB15">
                        This page displays all of the <span className="text-success">Data Storage</span> assets deployed within the selected cloud infrastructure, categorized by asset type. By default, Amazon S3 instances are displayed.
                        You can view the other Data Storage assets deployed by selecting their respective sub-pages above. 
                        </Typography>

                        <Typography component="p" className="fnt-13 mrB15">
                        On this page you can adjust the asset weights,
                        which will increase an asset's criticality within the Cumulus Risk Engine, producing a SIR score more aligned with your organization goals.
                        You should increase the weight of assets that you feel are of a higher security priority. 
                        </Typography>

                        <Typography component="p" className="fnt-13 mrB15">
                        You can suppress an asset if you no longer want to receive alerts for that asset.
                        </Typography>

                        <Typography component="p" className="fnt-13">
                        For more information on asset weights and the suppression of assets, please see our <a href="http://help.secberus.com/en/articles/2869020-how-to-customize-asset-weights" target="_blank"><span className="link-hrf">Knowledge library.</span></a>.
                        </Typography>
                        <Grid container spacing={24}>
                            <Grid item sm={12}>
                                {/* <div className="d-flex justify-flex-end">
                                    <SearchField handleChange={this.searchHandler} />
                                </div> */}
                            </Grid>
                        </Grid>
                        <Grid container spacing={24} className="grid-container">
                            <Grid item sm={12}>
                                <S3BucketAclAssetList value={value}/>
                            </Grid>
                        </Grid>
                    </CardContent>
                }

                {value === 3 &&
                    <CardContent className="card-body">
                        {/* <div className="download-icon">
                        Download 
                        <Link target="_blank" className="pdL5 pdR5" to=""><i className="fa fa-file-pdf-o" aria-hidden="true" ></i></Link>
                        <Link to=""><i className="fa fa-file-excel-o" aria-hidden="true" ></i></Link>
                        </div> */}
                        <div className="assets-wrapper">
                            <AssetsWrapperAlternative progressBar={false} message={"Storage Assets"} content={"This displays the total number of RDS Instance assets detected within your infrastucture as of the last scan."} activeAssetName={activeAssetName} filterAssets={this.filterAssets} progressBarColorClass={"asset-progress-bar-red"} addClass={"asset-border-red"} title={"TOTAL ASSETS"} assetName={"S3 Bucket Cors"} assetCount={countAssets.totalAssets} />
                            {/* <div className="assets-box text-center">
                                <div className="assets-item add-asset">
                                    <div className="add-icon mrB5 text-primary"  onClick={this.toggleDrawer('right', true)}>
                                        <i className="fa fa-plus" aria-hidden="true"></i>
                                    </div>
                                    <div className="asset-item-title">Add New Rule</div>
                                </div>
                            </div> */}
                        </div>
                        <Typography component="p" className="fnt-13 mrB15">
                        This page displays all of the <span className="text-success">Data Storage</span> assets deployed within the selected cloud infrastructure, categorized by asset type. By default, Amazon S3 instances are displayed.
                        You can view the other Data Storage assets deployed by selecting their respective sub-pages above. 
                        </Typography>

                        <Typography component="p" className="fnt-13 mrB15">
                        On this page you can adjust the asset weights,
                        which will increase an asset's criticality within the Cumulus Risk Engine, producing a SIR score more aligned with your organization goals.
                        You should increase the weight of assets that you feel are of a higher security priority. 
                        </Typography>

                        <Typography component="p" className="fnt-13 mrB15">
                        You can suppress an asset if you no longer want to receive alerts for that asset.
                        </Typography>

                        <Typography component="p" className="fnt-13">
                        For more information on asset weights and the suppression of assets, please see our <a href="http://help.secberus.com/en/articles/2869020-how-to-customize-asset-weights" target="_blank"><span className="link-hrf">Knowledge library.</span></a>.
                        </Typography>
                        <Grid container spacing={24}>
                            <Grid item sm={12}>
                                {/* <div className="d-flex justify-flex-end">
                                    <SearchField handleChange={this.searchHandler} />
                                </div> */}
                            </Grid>
                        </Grid>
                        <Grid container spacing={24} className="grid-container">
                            <Grid item sm={12}>
                                <S3BucketCorsAssetList value={value}/>
                            </Grid>
                        </Grid>
                    </CardContent>
                }

                {value === 4 &&
                    <CardContent className="card-body">
                        {/* <div className="download-icon">
                        Download 
                        <Link target="_blank" className="pdL5 pdR5" to=""><i className="fa fa-file-pdf-o" aria-hidden="true" ></i></Link>
                        <Link to=""><i className="fa fa-file-excel-o" aria-hidden="true" ></i></Link>
                        </div> */}
                        <div className="assets-wrapper">
                            <AssetsWrapperAlternative progressBar={false} message={"Storage Assets"} content={"This displays the total number of RDS Instance assets detected within your infrastucture as of the last scan."} activeAssetName={activeAssetName} filterAssets={this.filterAssets} progressBarColorClass={"asset-progress-bar-red"} addClass={"asset-border-red"} title={"TOTAL ASSETS"} assetName={"RDS Instance Assets"} assetCount={countAssets.totalAssets} />
                            {/* <div className="assets-box text-center">
                                <div className="assets-item add-asset">
                                    <div className="add-icon mrB5 text-primary"  onClick={this.toggleDrawer('right', true)}>
                                        <i className="fa fa-plus" aria-hidden="true"></i>
                                    </div>
                                    <div className="asset-item-title">Add New Rule</div>
                                </div>
                            </div> */}
                        </div>
                        <Typography component="p" className="fnt-13 mrB15">
                        This page displays all of the <span className="text-success">Data Storage</span> assets deployed within the selected cloud infrastructure, categorized by asset type. By default, Amazon S3 instances are displayed.
                        You can view the other Data Storage assets deployed by selecting their respective sub-pages above. 
                        </Typography>

                        <Typography component="p" className="fnt-13 mrB15">
                        On this page you can adjust the asset weights,
                        which will increase an asset's criticality within the Cumulus Risk Engine, producing a SIR score more aligned with your organization goals.
                        You should increase the weight of assets that you feel are of a higher security priority. 
                        </Typography>

                        <Typography component="p" className="fnt-13 mrB15">
                        You can suppress an asset if you no longer want to receive alerts for that asset.
                        </Typography>

                        <Typography component="p" className="fnt-13">
                        For more information on asset weights and the suppression of assets, please see our <a href="http://help.secberus.com/en/articles/2869020-how-to-customize-asset-weights" target="_blank"><span className="link-hrf">Knowledge library.</span></a>.
                        </Typography>
                        <Grid container spacing={24}>
                            <Grid item xs={12} sm={12}>
                                {/* <div className="d-flex justify-flex-end">
                                    <SearchField handleChange={this.searchHandler} />
                                </div> */}
                            </Grid>
                        </Grid>
                        <Grid container spacing={24} className="grid-container">
                            <Grid item xs={12} sm={12}>
                            <RdsAssetList value={value}/>
                            </Grid>
                        </Grid>
                    </CardContent>
                }

                {value === 5 &&
                    <CardContent className="card-body">
                        {/* <div className="download-icon">
                        Download 
                        <Link target="_blank" className="pdL5 pdR5" to=""><i className="fa fa-file-pdf-o" aria-hidden="true" ></i></Link>
                        <Link to=""><i className="fa fa-file-excel-o" aria-hidden="true" ></i></Link>
                        </div> */}
                        <div className="assets-wrapper">
                            <AssetsWrapperAlternative progressBar={false} message={"Storage Assets"} content={"This displays the total number of RDS Snapshot assets detected within your infrastucture as of the last scan."} activeAssetName={activeAssetName} filterAssets={this.filterAssets} progressBarColorClass={"asset-progress-bar-red"} addClass={"asset-border-red"} title={"TOTAL ASSETS"} assetName={"RDS Snapshot Assets"} assetCount={countAssets.totalAssets} />
                            {/* <div className="assets-box text-center">
                                <div className="assets-item add-asset">
                                    <div className="add-icon mrB5 text-primary"  onClick={this.toggleDrawer('right', true)}>
                                        <i className="fa fa-plus" aria-hidden="true"></i>
                                    </div>
                                    <div className="asset-item-title">Add New Rule</div>
                                </div>
                            </div> */}
                        </div>
                        <Typography component="p" className="fnt-13 mrB15">
                        This page displays all of the <span className="text-success">Data Storage</span> assets deployed within the selected cloud infrastructure, categorized by asset type. By default, Amazon S3 instances are displayed.
                        You can view the other Data Storage assets deployed by selecting their respective sub-pages above. 
                        </Typography>

                        <Typography component="p" className="fnt-13 mrB15">
                        On this page you can adjust the asset weights,
                        which will increase an asset's criticality within the Cumulus Risk Engine, producing a SIR score more aligned with your organization goals.
                        You should increase the weight of assets that you feel are of a higher security priority. 
                        </Typography>

                        <Typography component="p" className="fnt-13 mrB15">
                        You can suppress an asset if you no longer want to receive alerts for that asset.
                        </Typography>

                        <Typography component="p" className="fnt-13">
                        For more information on asset weights and the suppression of assets, please see our <a href="http://help.secberus.com/en/articles/2869020-how-to-customize-asset-weights" target="_blank"><span className="link-hrf">Knowledge library.</span></a>.
                        </Typography>
                        <Grid container spacing={24}>
                            <Grid item xs={12} sm={12}>
                                {/* <div className="d-flex justify-flex-end">
                                    <SearchField handleChange={this.searchHandler} />
                                </div> */}
                            </Grid>
                        </Grid>
                        <Grid container spacing={24} className="grid-container">
                            <Grid item xs={12} sm={12}>
                            <SnapshotAssetList value={value}/>
                            </Grid>
                        </Grid>
                    </CardContent>
                }

                {value === 6 &&
                    <CardContent className="card-body">
                        {/* <div className="download-icon">
                        Download 
                        <Link target="_blank" className="pdL5 pdR5" to=""><i className="fa fa-file-pdf-o" aria-hidden="true" ></i></Link>
                        <Link to=""><i className="fa fa-file-excel-o" aria-hidden="true" ></i></Link>
                        </div> */}
                        <div className="assets-wrapper">
                            <AssetsWrapperAlternative progressBar={false} message={"Storage Assets"} content={"This displays the total number of RDS Custer Snapshot assets detected within your infrastucture as of the last scan."}  activeAssetName={activeAssetName} filterAssets={this.filterAssets} progressBarColorClass={"asset-progress-bar-red"} addClass={"asset-border-red"} title={"TOTAL ASSETS"} assetName={"RDS Cluster Snapshots"} assetCount={countAssets.totalAssets} />
                            <AssetsWrapperAlternative progressBar={false} message={"MFA Delete Disabled"} content={"This displays the total number of  <span class='text-success'>RDS Custer Snapshot</span> assets detected with IAM DB Authentication disabled."} activeAssetName={activeAssetName} filterAssets={this.filterAssets} progressBarColorClass={"asset-progress-bar-red"} addClass={"asset-border-red"} title={"FAILED ASSETS"} assetName={"IAM DB Authentication Disabled"} assetCount={countAssets.totalAuthtenticationAssets} />
                            <AssetsWrapperAlternative progressBar={false} message={"Unencrypted"} content={"This displays the total number of unencrypted  <span class='text-success'>RDS Custer Snapshot</span> assets detected."} activeAssetName={activeAssetName} filterAssets={this.filterAssets} progressBarColorClass={"asset-progress-bar-red"} addClass={"asset-border-red"} assetName={"Unencrypted"} assetCount={countAssets.totalEncryptedAssets} />
                            <AssetsWrapperAlternative progressBar={false} message={"Public Access"} content={"This displays the total number of publicly accessible <span class='text-success'>RDS Custer Snapshot</span> assets detected."} activeAssetName={activeAssetName} filterAssets={this.filterAssets} progressBarColorClass={"asset-progress-bar-red"} addClass={"asset-border-red"} assetName={"Public Access"} assetCount={countAssets.totalPublicAssets} />
                            {/* <div className="assets-box text-center">
                                <div className="assets-item add-asset">
                                    <div className="add-icon mrB5 text-primary"  onClick={this.toggleDrawer('right', true)}>
                                        <i className="fa fa-plus" aria-hidden="true"></i>
                                    </div>
                                    <div className="asset-item-title">Add New Rule</div>
                                </div>
                            </div> */}
                        </div>
                        <Typography component="p" className="fnt-13 mrB15">
                        This page displays all of the <span className="text-success">Data Storage</span> assets deployed within the selected cloud infrastructure, categorized by asset type. By default, Amazon S3 instances are displayed.
                        You can view the other Data Storage assets deployed by selecting their respective sub-pages above. 
                        </Typography>

                        <Typography component="p" className="fnt-13 mrB15">
                        On this page you can adjust the asset weights,
                        which will increase an asset's criticality within the Cumulus Risk Engine, producing a SIR score more aligned with your organization goals.
                        You should increase the weight of assets that you feel are of a higher security priority. 
                        </Typography>

                        <Typography component="p" className="fnt-13 mrB15">
                        You can suppress an asset if you no longer want to receive alerts for that asset.
                        </Typography>

                        <Typography component="p" className="fnt-13">
                        For more information on asset weights and the suppression of assets, please see our <a href="http://help.secberus.com/en/articles/2869020-how-to-customize-asset-weights" target="_blank"><span className="link-hrf">Knowledge library.</span></a>.
                        </Typography>
                        <Grid container spacing={24}>
                            <Grid item xs={12} sm={12}>
                                {/* <div className="d-flex justify-flex-end">
                                    <SearchField handleChange={this.searchHandler} />
                                </div> */}
                            </Grid>
                        </Grid>
                        <Grid container spacing={24} className="grid-container">
                            <Grid item xs={12} sm={12}>
                            <ClusterSnapshotAssetList value={value}/>
                            </Grid>
                        </Grid>
                    </CardContent>
                }

                {value === 7 &&
                    <CardContent className="card-body">
                        {/* <div className="download-icon">
                        Download 
                        <Link target="_blank" className="pdL5 pdR5" to=""><i className="fa fa-file-pdf-o" aria-hidden="true" ></i></Link>
                        <Link to=""><i className="fa fa-file-excel-o" aria-hidden="true" ></i></Link>
                        </div> */}
                        <div className="assets-wrapper">
                            <AssetsWrapperAlternative progressBar={false} message={"Storage Assets"} content={"This displays the total number of RDS Event Subscription assets detected within your infrastructure as of the last scan."} activeAssetName={activeAssetName} filterAssets={this.filterAssets} progressBarColorClass={"asset-progress-bar-red"} addClass={"asset-border-red"} title={"TOTAL ASSETS"} assetName={"RDS Event Subscription"} assetCount={countAssets.totalAssets} />
                            {/* <div className="assets-box text-center">
                                <div className="assets-item add-asset">
                                    <div className="add-icon mrB5 text-primary"  onClick={this.toggleDrawer('right', true)}>
                                        <i className="fa fa-plus" aria-hidden="true"></i>
                                    </div>
                                    <div className="asset-item-title">Add New Rule</div>
                                </div>
                            </div> */}
                        </div>
                        <Typography component="p" className="fnt-13 mrB15">
                        This page displays all of the <span className="text-success">Data Storage</span> assets deployed within the selected cloud infrastructure, categorized by asset type. By default, Amazon S3 instances are displayed.
                        You can view the other Data Storage assets deployed by selecting their respective sub-pages above. 
                        </Typography>

                        <Typography component="p" className="fnt-13 mrB15">
                        On this page you can adjust the asset weights,
                        which will increase an asset's criticality within the Cumulus Risk Engine, producing a SIR score more aligned with your organization goals.
                        You should increase the weight of assets that you feel are of a higher security priority. 
                        </Typography>

                        <Typography component="p" className="fnt-13 mrB15">
                        You can suppress an asset if you no longer want to receive alerts for that asset.
                        </Typography>

                        <Typography component="p" className="fnt-13">
                        For more information on asset weights and the suppression of assets, please see our <a href="http://help.secberus.com/en/articles/2869020-how-to-customize-asset-weights" target="_blank"><span className="link-hrf">Knowledge library.</span></a>.
                        </Typography>
                        <Grid container spacing={24}>
                            <Grid item xs={12} sm={12}>
                                {/* <div className="d-flex justify-flex-end">
                                    <SearchField handleChange={this.searchHandler} />
                                </div> */}
                            </Grid>
                        </Grid>
                        <Grid container spacing={24} className="grid-container">
                            <Grid item xs={12} sm={12}>
                            <EventSubscriptionAssetList value={value}/>
                            </Grid>
                        </Grid>
                    </CardContent>
                }

                {value === 8 &&
                    <CardContent className="card-body">
                        {/* <div className="download-icon">
                        Download 
                        <Link target="_blank" className="pdL5 pdR5" to=""><i className="fa fa-file-pdf-o" aria-hidden="true" ></i></Link>
                        <Link to=""><i className="fa fa-file-excel-o" aria-hidden="true" ></i></Link>
                        </div> */}
                        <div className="assets-wrapper">
                            <AssetsWrapperAlternative progressBar={false} message={"Storage Assets"} content={"This displays the total number of RDS Backup assets detected within your infrastructure as of the last scan."} activeAssetName={activeAssetName} filterAssets={this.filterAssets} progressBarColorClass={"asset-progress-bar-red"} addClass={"asset-border-red"} title={"TOTAL ASSETS"} assetName={"RDS backup"} assetCount={countAssets.totalAssets} />
                            {/* <div className="assets-box text-center">
                                <div className="assets-item add-asset">
                                    <div className="add-icon mrB5 text-primary"  onClick={this.toggleDrawer('right', true)}>
                                        <i className="fa fa-plus" aria-hidden="true"></i>
                                    </div>
                                    <div className="asset-item-title">Add New Rule</div>
                                </div>
                            </div> */}
                        </div>
                        <Typography component="p" className="fnt-13 mrB15">
                        This page displays all of the <span className="text-success">Data Storage</span> assets deployed within the selected cloud infrastructure, categorized by asset type. By default, Amazon S3 instances are displayed.
                        You can view the other Data Storage assets deployed by selecting their respective sub-pages above. 
                        </Typography>

                        <Typography component="p" className="fnt-13 mrB15">
                        On this page you can adjust the asset weights,
                        which will increase an asset's criticality within the Cumulus Risk Engine, producing a SIR score more aligned with your organization goals.
                        You should increase the weight of assets that you feel are of a higher security priority. 
                        </Typography>

                        <Typography component="p" className="fnt-13 mrB15">
                        You can suppress an asset if you no longer want to receive alerts for that asset.
                        </Typography>

                        <Typography component="p" className="fnt-13">
                        For more information on asset weights and the suppression of assets, please see our <a href="http://help.secberus.com/en/articles/2869020-how-to-customize-asset-weights" target="_blank"><span className="link-hrf">Knowledge library.</span></a>.
                        </Typography>
                        <Grid container spacing={24}>
                            <Grid item xs={12} sm={12}>
                                {/* <div className="d-flex justify-flex-end">
                                    <SearchField handleChange={this.searchHandler} />
                                </div> */}
                            </Grid>
                        </Grid>
                        <Grid container spacing={24} className="grid-container">
                            <Grid item xs={12} sm={12}>
                            <RdsBackupList value={value}/>
                            </Grid>
                        </Grid>
                    </CardContent>
                }

                {value === 9 &&
                    <CardContent className="card-body">
                        {/* <div className="download-icon">
                        Download 
                        <Link target="_blank" className="pdL5 pdR5" to=""><i className="fa fa-file-pdf-o" aria-hidden="true" ></i></Link>
                        <Link to=""><i className="fa fa-file-excel-o" aria-hidden="true" ></i></Link>
                        </div> */}
                        <div className="assets-wrapper">
                            <AssetsWrapperAlternative progressBar={false} message={"Storage Assets"} content={"This displays the total number of Redshift assets detected within your infrastructure as of the last scan."} activeAssetName={activeAssetName} filterAssets={this.filterAssets} progressBarColorClass={"asset-progress-bar-red"} addClass={"asset-border-red"} title={"TOTAL ASSETS"} assetName={"Redshift"} assetCount={countAssets.totalAssets} />
                            {/* <div className="assets-box text-center">
                                <div className="assets-item add-asset">
                                    <div className="add-icon mrB5 text-primary"  onClick={this.toggleDrawer('right', true)}>
                                        <i className="fa fa-plus" aria-hidden="true"></i>
                                    </div>
                                    <div className="asset-item-title">Add New Rule</div>
                                </div>
                            </div> */}
                        </div>
                       
                        <Typography component="p" className="fnt-13 mrB15">
                        This page displays all of the <span className="text-success">Data Storage</span> assets deployed within the selected cloud infrastructure, categorized by asset type. By default, Amazon S3 instances are displayed.
                        You can view the other Data Storage assets deployed by selecting their respective sub-pages above. 
                        </Typography>

                        <Typography component="p" className="fnt-13 mrB15">
                        On this page you can adjust the asset weights,
                        which will increase an asset's criticality within the Cumulus Risk Engine, producing a SIR score more aligned with your organization goals.
                        You should increase the weight of assets that you feel are of a higher security priority. 
                        </Typography>

                        <Typography component="p" className="fnt-13 mrB15">
                        You can suppress an asset if you no longer want to receive alerts for that asset.
                        </Typography>

                        <Typography component="p" className="fnt-13">
                        For more information on asset weights and the suppression of assets, please see our <a href="http://help.secberus.com/en/articles/2869020-how-to-customize-asset-weights" target="_blank"><span className="link-hrf">Knowledge library.</span></a>.
                        </Typography>

                        <Grid container spacing={24}>
                            <Grid item xs={12} sm={12}>
                                {/* <div className="d-flex justify-flex-end">
                                    <SearchField handleChange={this.searchHandler} />
                                </div> */}
                            </Grid>
                        </Grid>
                        <Grid container spacing={24} className="grid-container">
                            <Grid item xs={12} sm={12}>
                            <RedshiftAssetList value={value}/>
                            </Grid>
                        </Grid>
                    </CardContent>
                }

                {value === 10 &&
                    <CardContent className="card-body">
                        {/* <div className="download-icon">
                        Download 
                        <Link target="_blank" className="pdL5 pdR5" to=""><i className="fa fa-file-pdf-o" aria-hidden="true" ></i></Link>
                        <Link to=""><i className="fa fa-file-excel-o" aria-hidden="true" ></i></Link>
                        </div> */}
                        <div className="assets-wrapper">
                            <AssetsWrapperAlternative progressBar={false} message={"Storage Assets"} content={"This displays the total number of Redshift assets detected within your infrastructure as of the last scan."} activeAssetName={activeAssetName} filterAssets={this.filterAssets} progressBarColorClass={"asset-progress-bar-red"} addClass={"asset-border-red"} title={"TOTAL ASSETS"} assetName={"Redshift Parameter Group"} assetCount={countAssets.totalAssets} />
                            {/* <div className="assets-box text-center">
                                <div className="assets-item add-asset">
                                    <div className="add-icon mrB5 text-primary"  onClick={this.toggleDrawer('right', true)}>
                                        <i className="fa fa-plus" aria-hidden="true"></i>
                                    </div>
                                    <div className="asset-item-title">Add New Rule</div>
                                </div>
                            </div> */}
                        </div>
                       
                        <Typography component="p" className="fnt-13 mrB15">
                        This page displays all of the <span className="text-success">Data Storage</span> assets deployed within the selected cloud infrastructure, categorized by asset type. By default, Amazon S3 instances are displayed.
                        You can view the other Data Storage assets deployed by selecting their respective sub-pages above. 
                        </Typography>

                        <Typography component="p" className="fnt-13 mrB15">
                        On this page you can adjust the asset weights,
                        which will increase an asset's criticality within the Cumulus Risk Engine, producing a SIR score more aligned with your organization goals.
                        You should increase the weight of assets that you feel are of a higher security priority. 
                        </Typography>

                        <Typography component="p" className="fnt-13 mrB15">
                        You can suppress an asset if you no longer want to receive alerts for that asset.
                        </Typography>

                        <Typography component="p" className="fnt-13">
                        For more information on asset weights and the suppression of assets, please see our <a href="http://help.secberus.com/en/articles/2869020-how-to-customize-asset-weights" target="_blank"><span className="link-hrf">Knowledge library.</span></a>.
                        </Typography>

                        <Grid container spacing={24}>
                            <Grid item sm={12}>
                                {/* <div className="d-flex justify-flex-end">
                                    <SearchField handleChange={this.searchHandler} />
                                </div> */}
                            </Grid>
                        </Grid>
                        <Grid container spacing={24} className="grid-container">
                            <Grid item sm={12}>
                                <RedshiftParametergroupAssetList value={value}/>
                            </Grid>
                        </Grid>
                    </CardContent>
                }

                {value === 11 &&
                    <CardContent className="card-body">
                        {/* <div className="download-icon">
                        Download 
                        <Link target="_blank" className="pdL5 pdR5" to=""><i className="fa fa-file-pdf-o" aria-hidden="true" ></i></Link>
                        <Link to=""><i className="fa fa-file-excel-o" aria-hidden="true" ></i></Link>
                        </div> */}
                        <div className="assets-wrapper">
                            <AssetsWrapperAlternative progressBar={false} message={"Storage Assets"} content={"This displays the total number of Redshift assets detected within your infrastructure as of the last scan."} activeAssetName={activeAssetName} filterAssets={this.filterAssets} progressBarColorClass={"asset-progress-bar-red"} addClass={"asset-border-red"} title={"TOTAL ASSETS"} assetName={"Dynamo DB"} assetCount={countAssets.totalAssets} />
                            {/* <div className="assets-box text-center">
                                <div className="assets-item add-asset">
                                    <div className="add-icon mrB5 text-primary"  onClick={this.toggleDrawer('right', true)}>
                                        <i className="fa fa-plus" aria-hidden="true"></i>
                                    </div>
                                    <div className="asset-item-title">Add New Rule</div>
                                </div>
                            </div> */}
                        </div>
                       
                        <Typography component="p" className="fnt-13 mrB15">
                        This page displays all of the <span className="text-success">Data Storage</span> assets deployed within the selected cloud infrastructure, categorized by asset type. By default, Amazon S3 instances are displayed.
                        You can view the other Data Storage assets deployed by selecting their respective sub-pages above. 
                        </Typography>

                        <Typography component="p" className="fnt-13 mrB15">
                        On this page you can adjust the asset weights,
                        which will increase an asset's criticality within the Cumulus Risk Engine, producing a SIR score more aligned with your organization goals.
                        You should increase the weight of assets that you feel are of a higher security priority. 
                        </Typography>

                        <Typography component="p" className="fnt-13 mrB15">
                        You can suppress an asset if you no longer want to receive alerts for that asset.
                        </Typography>

                        <Typography component="p" className="fnt-13">
                        For more information on asset weights and the suppression of assets, please see our <a href="http://help.secberus.com/en/articles/2869020-how-to-customize-asset-weights" target="_blank"><span className="link-hrf">Knowledge library.</span></a>.
                        </Typography>

                        <Grid container spacing={24}>
                            <Grid item sm={12}>
                                {/* <div className="d-flex justify-flex-end">
                                    <SearchField handleChange={this.searchHandler} />
                                </div> */}
                            </Grid>
                        </Grid>
                        <Grid container spacing={24} className="grid-container">
                            <Grid item sm={12}>
                                <DynamoAssetList value={value}/>
                            </Grid>
                        </Grid>
                    </CardContent>
                }

                <Drawer className="right-sidebar sidebar" anchor="right" open={right}>
                   <AddNewRuleList toggleDrawer={this.toggleDrawer}/>
                </Drawer>
            </Card>
        )
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators(Object.assign({}, assetsActions), dispatch),
        showMessage: message => {
            dispatch(showMessage(message))
        }, setProgressBar: isProgress => {
            dispatch(setProgressBar(isProgress))
        }, setActiveMenu: activeMenu => {
            dispatch(setActiveMenu(activeMenu))
        },setActiveParentMenu: activeParentMenu => {
            dispatch(setActiveParentMenu(activeParentMenu))
        },
    };
}

const mapStateToProps = (state, ownProps) => ({
    filterData: state.uiReducer.filterData,
    countAssets: state.commonReducer.countAssets,
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Assets))