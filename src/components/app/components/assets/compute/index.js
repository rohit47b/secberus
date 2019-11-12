/*
 * @Author: Virendra Patidar 
 * @Date: 2018-11-16 14:55:42 
 * @Last Modified by: Virendra Patidar
 * @Last Modified time: 2019-05-22 13:59:11
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
import AssetsWrapper from 'global/AssetsWrapper';
import AssetsWrapperAlternative from 'global/AssetsWrapperAlternative';
import SearchField from 'global/SearchField';
import InstanceAssetList from './InstanceAssetList'
import SecurityGroupAssetList from './SecurityGroupAssetList'
import VolumeAssetList from './VolumeAssetList'
import AmiAssetList from './AmiAssetList'
import LoadBalancerAssetList from './LoadBalancerAssetList'
import CertificateAssetList from './CertificateAssetList'
import LambdaAssetList from './LambdaAssetList'
import ElasticIpAddressAssetList from './ElasticIpAddressAssetList'
import VpcAssetList from './VpcAssetList'
import VpcFlowLogAssetList from './VpcFlowLogAssetList'
import AddNewRuleList from './AddNewRuleList'

import history from 'customHistory';

class Assets extends PureComponent {

    state = {
        search: '',
        value: 0,
        completed: 0,
        activeAssetName:'Compute Assets',
        right: false
    }

    componentDidMount() {
        this.props.setActiveParentMenu('Assets')
        this.props.setActiveMenu('Compute')
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
            "Page Name": 'Assets Compute',
        });
        const { value, activeAssetName,right } = this.state
        const { countAssets } = this.props
        return (
            <Card className="card-wizard card-panel card-inner card-tab">
                <div className="card-title">
                    <h3 className="card-heading">Compute Assets</h3>
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
                                <img className="select-img" src="/assets/service-icon/ec2.png" alt="Ec2"/><span>Ec2</span>
                            </MenuItem>
                            <MenuItem className="select-item select-item-text" key={1} value={1}>
                                <img className="select-img" src="/assets/service-icon/ec2.png" alt="Ec2 Security Group"/><span>Ec2 Security Group</span>
                            </MenuItem>
                            <MenuItem className="select-item select-item-text" key={2} value={2}>
                                <img className="select-img" src="/assets/service-icon/ec2.png" alt="Volume"/><span>EBS Volume</span>
                            </MenuItem>
                            <MenuItem className="select-item select-item-text" key={3} value={3}>
                                <img className="select-img" src="/assets/service-icon/lambda.png" alt="Lambda"/><span>Lambda</span>
                            </MenuItem>
                            <MenuItem className="select-item select-item-text" key={4} value={4}>
                                <img className="select-img" src="/assets/service-icon/ec2.png" alt="AMI"/><span>AMI</span>
                            </MenuItem>
                            <MenuItem className="select-item select-item-text" key={5} value={5}>
                                <img className="select-img" src="/assets/service-icon/ebs.png" alt="ELB"/><span>ELB</span>
                            </MenuItem>
                            <MenuItem className="select-item select-item-text" key={6} value={6}>
                                <img className="select-img" src="/assets/service-icon/acm.png" alt="Certificates"/><span>Certificates</span>
                            </MenuItem>
                            <MenuItem className="select-item select-item-text" key={7} value={7}>
                            <img className="select-img" src="/assets/service-icon/elasticipaddress.png" alt="Elastic Ip Address"/><span>Elastic Ip Address</span>
                            </MenuItem>
                            <MenuItem className="select-item select-item-text" key={8} value={8}>
                                <img className="select-img" src="/assets/service-icon/vpc.png" alt="Elastic Ip Address"/><span>VPC</span>
                            </MenuItem>
                            <MenuItem className="select-item select-item-text" key={9} value={9}>
                                <img className="select-img" src="/assets/service-icon/vpc.png" alt="Elastic Ip Address"/><span>VPC Flow Log</span>
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
                            label={<div className="icon-img"><img src="/assets/service-icon/ec2.png" alt="Ec2"/> Ec2</div>}
                            className="tab-item mrR15"
                        />
                        <Tab
                            disableRipple
                            label={<div className="icon-img"><img src="/assets/service-icon/ec2.png" alt="Volume"/> EBS Volume</div>}
                            className="tab-item mrR15"
                        />
                        <Tab
                            disableRipple
                            label={<div className="icon-img"><img src="/assets/service-icon/lambda.png" alt="Lambda"/> Lambda</div>}
                            className="tab-item mrR15"
                        />
                        <Tab
                            disableRipple
                            label={<div className="icon-img"><img src="/assets/service-icon/ec2.png" alt="AMI"/> AMI</div>}
                            className="tab-item mrR15"
                        />
                        <Tab
                            disableRipple
                            label={<div className="icon-img"><img src="/assets/service-icon/ebs.png" alt="ELB"/> ELB</div>}
                            className="tab-item mrR15"
                        />
                        <Tab
                            disableRipple
                            label={<div className="icon-img"><img src="/assets/service-icon/acm.png" alt="Certificates"/> Certificates</div>}
                            className="tab-item mrR15"
                        />
                        <Tab
                            disableRipple
                            label={<div className="icon-img"><img src="/assets/service-icon/elasticipaddress.png" alt="Elastic Ip Address"/> Elastic Ip Address</div>}
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
                            <AssetsWrapperAlternative progressBar={false} message={"Compute Assets"} content={"This displays the total number of <span class='text-success'>EC2</span> instances  detected within your infrastructure as of the last scan."} activeAssetName={activeAssetName} filterAssets={this.filterAssets} progressBarColorClass={"asset-progress-bar-red"} addClass={"asset-border-red"} title={"TOTAL ASSETS"} assetName={"EC2 Instances"} assetCount={countAssets.totalAssets} />
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
                            This page displays all of the <span className="text-success">Compute Assets</span> deployed within the selected cloud infrastructure, categorized by asset type. By default, Amazon EC2 instances are displayed. You can view the other compute  assets deployed by selecting their respective sub-pages above.
                        </Typography>
                        <Typography component="p" className="fnt-13 mrB15">
                           On this page you can adjust asset weights, which will increase an asset's criticality within the Cumulus Risk Engine, producing a SIR score more aligned with your organization goals. 
                           You should increase the weight of assets that you feel are of a higher security priority. 
                        </Typography>
                        <Typography component="p" className="fnt-13 mrB15">
                          You can also suppress an asset if you no longer want to receive alerts for that asset.
                        </Typography>
                        <Typography component="p" className="fnt-13">
                            For more information on asset weights and the suppression of assets, please see our <a href="http://help.secberus.com/en/articles/2869020-how-to-customize-asset-weights" target="_blank"><span className="link-hrf">Knowledge library.</span></a>
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
                            <InstanceAssetList value={value}/>
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
                            <AssetsWrapperAlternative progressBar={false} message={"Compute Assets"} content={"This displays the total number of <span class='text-success'>EC2</span> instances  detected within your infrastructure as of the last scan."} activeAssetName={activeAssetName} filterAssets={this.filterAssets} progressBarColorClass={"asset-progress-bar-red"} addClass={"asset-border-red"} title={"TOTAL ASSETS"} assetName={"EC2 Security Group"} assetCount={countAssets.totalAssets} />
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
                            This page displays all of the <span className="text-success">Compute Assets</span> deployed within the selected cloud infrastructure, categorized by asset type. By default, Amazon EC2 instances are displayed. You can view the other compute  assets deployed by selecting their respective sub-pages above.
                        </Typography>
                        <Typography component="p" className="fnt-13 mrB15">
                           On this page you can adjust asset weights, which will increase an asset's criticality within the Cumulus Risk Engine, producing a SIR score more aligned with your organization goals. 
                           You should increase the weight of assets that you feel are of a higher security priority. 
                        </Typography>
                        <Typography component="p" className="fnt-13 mrB15">
                          You can also suppress an asset if you no longer want to receive alerts for that asset.
                        </Typography>
                        <Typography component="p" className="fnt-13">
                            For more information on asset weights and the suppression of assets, please see our <a href="http://help.secberus.com/en/articles/2869020-how-to-customize-asset-weights" target="_blank"><span className="link-hrf">Knowledge library.</span></a>
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
                                <SecurityGroupAssetList value={value}/>
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
                            <AssetsWrapperAlternative progressBar={false} message={"Compute Assets"} content={"This displays the total number of <span class='text-success'>EBS Volume</span> assets  detected within your infrastructure as of the last scan."} activeAssetName={activeAssetName} filterAssets={this.filterAssets} progressBarColorClass={"asset-progress-bar-red"} addClass={"asset-border-red"} title={"TOTAL ASSETS"} assetName={"EBS Volume"} assetCount={countAssets.totalAssets} />
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
                            This page displays all of the <span className="text-success">Compute Assets</span> deployed within the selected cloud infrastructure, categorized by asset type. By default, Amazon EC2 instances are displayed. You can view the other compute  assets deployed by selecting their respective sub-pages above.
                        </Typography>
                        <Typography component="p" className="fnt-13 mrB15">
                           On this page you can adjust asset weights, which will increase an asset's criticality within the Cumulus Risk Engine, producing a SIR score more aligned with your organization goals. 
                           You should increase the weight of assets that you feel are of a higher security priority. 
                        </Typography>
                        <Typography component="p" className="fnt-13 mrB15">
                          You can also suppress an asset if you no longer want to receive alerts for that asset.
                        </Typography>
                        <Typography component="p" className="fnt-13">
                            For more information on asset weights and the suppression of assets, please see our <a href="http://help.secberus.com/en/articles/2869020-how-to-customize-asset-weights" target="_blank"><span className="link-hrf">Knowledge library.</span></a>
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
                            <VolumeAssetList value={value}/>
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
                            <AssetsWrapperAlternative progressBar={false} message={"Compute Assets"}  content={"This displays the total number of <span class='text-success'>Lambda</span> assets  detected within your infrastructure as of the last scan."} activeAssetName={activeAssetName} filterAssets={this.filterAssets} progressBarColorClass={"asset-progress-bar-red"} addClass={"asset-border-red"} title={"TOTAL ASSETS"} assetName={"Lambda Assets"} assetCount={countAssets.totalAssets} />
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
                            This page displays all of the <span className="text-success">Compute Assets</span> deployed within the selected cloud infrastructure, categorized by asset type. By default, Amazon EC2 instances are displayed. You can view the other compute  assets deployed by selecting their respective sub-pages above.
                        </Typography>
                        <Typography component="p" className="fnt-13 mrB15">
                           On this page you can adjust asset weights, which will increase an asset's criticality within the Cumulus Risk Engine, producing a SIR score more aligned with your organization goals. 
                           You should increase the weight of assets that you feel are of a higher security priority. 
                        </Typography>
                        <Typography component="p" className="fnt-13 mrB15">
                          You can also suppress an asset if you no longer want to receive alerts for that asset.
                        </Typography>
                        <Typography component="p" className="fnt-13">
                            For more information on asset weights and the suppression of assets, please see our <a href="http://help.secberus.com/en/articles/2869020-how-to-customize-asset-weights" target="_blank"><span className="link-hrf">Knowledge library.</span></a>
                        </Typography>
                        <Grid container spacing={24}>
                            <Grid item sm={12}>
                                {/* <div className="d-flex justify-flex-end">
                                    <SearchField handleChange={this.searchHandler} />
                                </div> */}
                            </Grid>
                        </Grid>
                        <Grid container spacing={24} className="grid-container">
                            <Grid item xs={12} sm={12}>
                            <LambdaAssetList value={value}/>
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
                            <AssetsWrapperAlternative progressBar={false} message={"Compute Assets"} content={"This displays the total number of <span class='text-success'>AMI</span> assets detected within your infrastructure as of the last scan."} activeAssetName={activeAssetName} filterAssets={this.filterAssets} progressBarColorClass={"asset-progress-bar-red"} addClass={"asset-border-red"} title={"TOTAL ASSETS"} assetName={"AMI Assets"} assetCount={countAssets.totalAssets} />
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
                        This page displays all of the <span className="text-success">Compute Assets</span> deployed within the selected cloud infrastructure, categorized by asset type. By default, Amazon EC2 instances are displayed.
                        You can view the other compute assets deployed by selecting their respective sub-pages above. 
                        </Typography>

                        <Typography component="p" className="fnt-13 mrB15">
                        On this page you can adjust the asset weights,
                        which will increase an asset's criticality within the Cumulus Risk Engine, producing a SIR score more aligned with your organization goals.
                        You should increase the weight of assets that you feel are of a higher security priority. 
                        </Typography>

                        <Typography component="p" className="fnt-13 mrB15">
                        You can also suppress an asset if you no longer want to receive alerts for that asset.
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
                            <AmiAssetList value={value}/>
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
                            <AssetsWrapperAlternative progressBar={false} message={"Compute Assets"} content={"This displays the total number of <span class='text-success'>ELB</span> assets detected within your infrastructure as of the last scan."} activeAssetName={activeAssetName} filterAssets={this.filterAssets} progressBarColorClass={"asset-progress-bar-red"} addClass={"asset-border-red"} title={"TOTAL ASSETS"} assetName={"ELB"} assetCount={countAssets.totalAssets} />
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
                        This page displays all of the <span className="text-success">Compute Assets</span> deployed within the selected cloud infrastructure, categorized by asset type. By default, Amazon EC2 instances are displayed.
                        You can view the other compute assets deployed by selecting their respective sub-pages above. 
                        </Typography>

                        <Typography component="p" className="fnt-13 mrB15">
                        On this page you can adjust the asset weights,
                        which will increase an asset's criticality within the Cumulus Risk Engine, producing a SIR score more aligned with your organization goals.
                        You should increase the weight of assets that you feel are of a higher security priority. 
                        </Typography>

                        <Typography component="p" className="fnt-13 mrB15">
                        You can also suppress an asset if you no longer want to receive alerts for that asset.
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
                            <LoadBalancerAssetList value={value}/>
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
                            <AssetsWrapperAlternative progressBar={false} message={"Compute Assets"} content={"Lorem Ipsum is simply dummy text of the printing and typesetting industry."} activeAssetName={activeAssetName} filterAssets={this.filterAssets} progressBarColorClass={"asset-progress-bar-red"} addClass={"asset-border-red"} title={"TOTAL ASSETS"} assetName={"Certificates"} assetCount={countAssets.totalAssets} />
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
                        This page displays all of the <span className="text-success">Compute Assets</span> deployed within the selected cloud infrastructure, categorized by asset type. By default, Amazon EC2 instance are displayed.
                        You can view the other compute assets deployed by selecting their respective sub-pages above. 
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
                            <CertificateAssetList value={value}/>
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
                            <AssetsWrapperAlternative progressBar={false} message={"Compute Assets"} content={"Lorem Ipsum is simply dummy text of the printing and typesetting industry."} activeAssetName={activeAssetName} filterAssets={this.filterAssets} progressBarColorClass={"asset-progress-bar-red"} addClass={"asset-border-red"} title={"TOTAL ASSETS"} assetName={"Elastic Ip Address"} assetCount={countAssets.totalAssets} />
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
                        This page displays all of the <span className="text-success">Compute Assets</span> deployed within the selected cloud infrastructure, categorized by asset type. By default, Amazon EC2 instance are displayed.
                        You can view the other compute assets deployed by selecting their respective sub-pages above. 
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
                                <ElasticIpAddressAssetList value={value}/>
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
                            <AssetsWrapperAlternative progressBar={false} message={"Compute Assets"} content={"Lorem Ipsum is simply dummy text of the printing and typesetting industry."} activeAssetName={activeAssetName} filterAssets={this.filterAssets} progressBarColorClass={"asset-progress-bar-red"} addClass={"asset-border-red"} title={"TOTAL ASSETS"} assetName={"VPC"} assetCount={countAssets.totalAssets} />
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
                        This page displays all of the <span className="text-success">Compute Assets</span> deployed within the selected cloud infrastructure, categorized by asset type. By default, Amazon EC2 instance are displayed.
                        You can view the other compute assets deployed by selecting their respective sub-pages above. 
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
                                <VpcAssetList value={value}/>
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
                            <AssetsWrapperAlternative progressBar={false} message={"Compute Assets"} content={"Lorem Ipsum is simply dummy text of the printing and typesetting industry."} activeAssetName={activeAssetName} filterAssets={this.filterAssets} progressBarColorClass={"asset-progress-bar-red"} addClass={"asset-border-red"} title={"TOTAL ASSETS"} assetName={"VPC Flow Log"} assetCount={countAssets.totalAssets} />
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
                        This page displays all of the <span className="text-success">Compute Assets</span> deployed within the selected cloud infrastructure, categorized by asset type. By default, Amazon EC2 instance are displayed.
                        You can view the other compute assets deployed by selecting their respective sub-pages above. 
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
                                <VpcFlowLogAssetList value={value}/>
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