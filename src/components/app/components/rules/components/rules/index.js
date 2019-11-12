/*
 * @Author: Virendra Patidar 
 * @Date: 2018-11-16 14:55:42 
 * @Last Modified by: Virendra Patidar
 * @Last Modified time: 2019-05-21 17:06:42
 */
import React, { PureComponent } from 'react'
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Drawer from '@material-ui/core/Drawer'
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Grid from '@material-ui/core/Grid';
import { Typography } from '@material-ui/core';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';

import { connect } from "react-redux";
import { withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';

import AssetsWrapper from 'global/AssetsWrapper';
import SearchField from 'global/SearchField';
import RuleList from './RuleList'
import LabelWithHelper from 'hoc/Label/LabelWithHelper';
import { setActiveMenu, setActiveParentMenu } from 'actions/commonAction';

class Rules extends PureComponent {
    state = {
        search: '',
        value: 0,
        completed: 0,
        activeAssetName: 'Total',
        right: false,
        total: 0,
        suppressed: 0

    }

    componentDidMount() {
        this.props.setActiveParentMenu('Governance')
        this.props.setActiveMenu('Security Rules')
        //this.timer = setInterval(this.progress, 500);
    }

    componentWillUnmount() {
        //clearInterval(this.timer);
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

    setTotals = (totals) => {
        this.setState({ total: totals['total'], suppressed: totals['suppressed'] })
    }

    render() {
        mixpanel.track("View Page", {
            "Page Name": 'Rules',
        });
        const { value, activeAssetName, right } = this.state
        return (
            <Card className="card-wizard card-panel card-rule card-inner">
                <div className="card-title">
                    <span>
                     <h3 className="card-heading">Security Rules</h3>
                    </span>
                            
                            {/* <Tabs
                                value={value}
                                onChange={this.handleChangeTab}
                                indicatorColor="primary"
                                className="tabs tab-policies"
                            >
                                <Tab
                                    disableRipple
                                    label="Assets"
                                    className="tab-item mrR20"
                                />
                                <Tab
                                    disableRipple
                                    label="Encryption"
                                    className="tab-item mrR20"
                                />
                                <Tab
                                    disableRipple
                                    label="Logging"
                                    className="tab-item mrR20"
                                />
                                <Tab
                                    disableRipple
                                    label="Integrity"
                                    className="tab-item"
                                />


                            </Tabs> */}
                </div>
                <CardContent className="card-body">
                    <Grid container spacing={24}>
                        <Grid item xs={12} sm={12}>
                           
                            <div className="assets-wrapper assets-wrapper-no-label">
                                {/* <AssetsWrapper activeAssetName={activeAssetName} filterAssets={this.filterAssets} progressBarColorClass={"asset-progress-bar-red"} addClass={"asset-border-red"}  assetName={"Total Rules"} assetCount={"151"} /> */}
                                {/* <LabelWithHelper message={"Status"} title={"Status - 107"} content={"Total number of cloud security rules audited. This includes Secberus default rules and custom rules."} /> */}
                                <AssetsWrapper progressBar={false} marginTop={"mrT0"} activeAssetName={activeAssetName} filterAssets={this.filterAssets} progressBarColorClass={"asset-progress-bar-red"} addClass={"asset-border-red"} title={""}  message={"Total"} content={"Total number of cloud security rules audited. This includes Secberus default rules and custom rules."} assetName={"Total"} assetCount={this.state.total} />
                                <AssetsWrapper progressBar={false} marginTop={"mrT0"} activeAssetName={activeAssetName} filterAssets={this.filterAssets} progressBarColorClass={"asset-progress-bar-red"} addClass={"asset-border-red"} title={""}  message={"Suppressed"} content={"Total number of suppressed cloud security rules."} assetName={"Suppressed"} assetCount={this.state.suppressed} />
                            </div>
                        </Grid>
                        <Grid item xs={12} sm={12}>
                            <Typography component="p" className="fnt-13">
                              {value ===0 &&  "This page shows all of the Rules for Assets included in the Secberus platform. It displays how many Assets are violating a particular Rule in your environment, the Rule's severity, and which Policies it belongs to. Rules can be suppressed which suppresses all new Alerts for that Rule. You can navigate between Rules by type in the header navigation."  }
                              {value ===1 &&  "This page shows all of the Rules for Encryption included in the Secberus platform. It displays how many Assets are violating a particular Rule in your environment, the Rule's severity, and which Policies it belongs to. Rules can be suppressed which suppresses all new Alerts for that Rule. You can navigate between Rules by type in the header navigation."  }
                              {value ===2 &&  "This page shows all of the Rules for Logging included in the Secberus platform. It displays how many Assets are violating a particular Rule in your environment, the Rule's severity, and which Policies it belongs to. Rules can be suppressed which suppresses all new Alerts for that Rule. You can navigate between Rules by type in the header navigation." }
                              {value ===3 &&  "This page shows all of the Rules for Integrity included in the Secberus platform. It displays how many Assets are violating a particular Rule in your environment, the Rule's severity, and which Policies it belongs to. Rules can be suppressed which suppresses all new Alerts for that Rule. You can navigate between Rules by type in the header navigation."}
                              
                        </Typography>
                        </Grid>
                    </Grid>


                    {/* <div className="d-flex justify-flex-end">
                        <SearchField handleChange={this.searchHandler} />
                    </div> */}

                    <Grid container spacing={24} className="grid-container">
                        <Grid item xs={12} sm={12}>
                            <RuleList setTotals={this.setTotals}/>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        )
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators(Object.assign({}), dispatch),
        setActiveMenu: activeMenu => {
            dispatch(setActiveMenu(activeMenu))
        },
        setActiveParentMenu: activeParentMenu => {
            dispatch(setActiveParentMenu(activeParentMenu))
        }
    };
}

export default withRouter(connect(null, mapDispatchToProps)(Rules))