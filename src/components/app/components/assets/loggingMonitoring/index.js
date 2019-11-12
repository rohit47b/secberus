/*
 * @Author: Virendra Patidar 
 * @Date: 2018-11-16 14:55:42 
 * @Last Modified by: Virendra Patidar
 * @Last Modified time: 2019-05-22 14:37:17
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
import CloudWatchAssetList from './CloudWatchAssetList'
import CloudTrailAssetList from './CloudTrailAssetList'
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
        this.props.setActiveParentMenu('Assets')
        this.props.setActiveMenu('Logging/Monitoring')
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
            "Page Name": 'Assets Loging/Monitoring',
        });
        const { value, activeAssetName,right } = this.state
        const { countAssets } = this.props
        return (
            <Card className="card-wizard card-panel card-inner card-tab">
                <div className="card-title">
                    <h3 className="card-heading">Logging/Monitoring Assets</h3>
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
                                <img className="select-img"src="/assets/service-icon/cloud-watch.png" alt="Cloud Watch"/><span>CloudWatch</span>
                            </MenuItem>
                            <MenuItem className="select-item select-item-text" key={1} value={1}>
                                <img className="select-img"src="/assets/service-icon/cloud-trail.png" alt="Cloud Trail"/><span>CloudTrail</span>
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
                            label={<div className="icon-img"><img src="/assets/service-icon/cloud-watch.png" alt="Cloud Watch"/> CloudWatch</div>}
                            className="tab-item mrR15"
                        />

                        <Tab
                            disableRipple
                            label={<div className="icon-img"><img src="/assets/service-icon/cloud-trail.png" alt="Cloud Trail"/> CloudTrail</div>}
                            className="tab-item mrR15"
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
                            <AssetsWrapperAlternative message={"Logging/Monitoring Assets"} content={"This displays the total number of CloudWatch assets detected within your infrastructure as of the last scan."} activeAssetName={activeAssetName} filterAssets={this.filterAssets} progressBarColorClass={"asset-progress-bar-red"} addClass={"asset-border-red"} title={"TOTAL ASSETS"} assetName={"CloudWatch Assets"} assetCount={countAssets.totalAssets} />
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
                            This page displays all of the <strong>Logging/Monitoring</strong> assets deployed within the selected cloud infrastructure, categorized by asset type.
                             By default, CloudWatch assets are displayed. You can view the other Logging/Monitoring Data Storage assets deployed by selecting their respective sub-pages above.
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
                            <CloudWatchAssetList value={value}/>
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
                            <AssetsWrapperAlternative message={"Logging/Monitoring Assets"} content={"This displays the total number of CloudTrail assets detected within your infrastructure as of the last scan."} activeAssetName={activeAssetName} filterAssets={this.filterAssets} progressBarColorClass={"asset-progress-bar-red"} addClass={"asset-border-red"} title={"TOTAL ASSETS"} assetName={"CloudTrail Assets"} assetCount={countAssets.totalAssets} />
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
                            This page displays all of the <strong>Logging/Monitoring</strong> assets deployed within the selected cloud infrastructure, categorized by asset type.
                             By default, CloudTrail assets are displayed. You can view the other Logging/Monitoring assets deployed by selecting their respective sub-pages above.
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
                            <CloudTrailAssetList value={value}/>
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