/*
 * @Author: Virendra Patidar 
 * @Date: 2019-04-03 10:40:37 
 * @Last Modified by: Virendra Patidar
 * @Last Modified time: 2019-04-23 16:19:02
 */
import { Grid } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Switch from '@material-ui/core/Switch';
import SearchField from 'global/SearchField';
import React, { PureComponent } from "react";
import CloudDetail from './CloudDetail'

class CloudAccounts extends PureComponent {

    state = {
        openCloudDetail: false,
        cloudName:''
    }

    searchHandler = name => event => {
        this.setState({ search: event.target.value })
    }

    statusChangeDialog = () => {
        this.setState({ openStatusDialog: true });
    }


    openCloudDetailPopUp=(cloudName)=>{
        this.setState({openCloudDetail:true,cloudName})
    }

    closeCloudDetailPopUp=()=>{
        this.setState({openCloudDetail:false,cloudName:''})
    }

    render() {
        const { openCloudDetail,cloudName } = this.state
        return (
            <div className="container">
                <Grid container spacing={24} className="mrB0">
                    <Grid item xs={12} md={12} className="d-flex align-item-flex-end justify-flex-end">
                        <div className="d-flex justify-flex-end">
                            {/* <Button
                                className="btn btn-primary mrR10"
                                variant="contained"
                                color="primary"
                            >
                                Add Cloud Account
                        </Button> */}
                            <SearchField handleChange={this.searchHandler} />
                        </div>
                    </Grid>
                </Grid>
                <Grid container spacing={32} className="mrB0">
                    <Grid item xs={12} md={3}>
                        <Card className="card-wizard text-center card-cloud" onClick={()=>this.openCloudDetailPopUp('Amazon Web Server')}>
                            <CardContent className="card-body-cloud">
                                <div className="switch-control">
                                    <Switch className={'switch-green active'} checked={true} />
                                </div>
                                <div className="services-img">
                                    <img alt="AWS" src='/assets/images/aws.png' />
                                </div>
                                <div className="src-title">Amazon Web Server </div>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12} md={3}>
                        <Card className="card-wizard text-center card-cloud" onClick={()=>this.openCloudDetailPopUp('Slack')}>
                            <CardContent className="card-body-cloud">
                                <div className="switch-control">
                                    <Switch className={'switch-green active'} checked />
                                </div>
                                <div className="services-img">
                                    <img alt="Slack" src='/assets/images/slack.png' />
                                </div>
                                <div className="src-title">Slack </div>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12} md={3}>
                        <Card className="card-wizard text-center card-cloud"  onClick={()=>this.openCloudDetailPopUp('Microsoft Azure')}>
                            <CardContent className="card-body-cloud">
                                <div className="switch-control">
                                    <Switch className={'switch-green active'} checked />
                                </div>
                                <div className="services-img">
                                    <img alt="Microsoft Azure" src='/assets/images/ms-azure.png' />
                                </div>
                                <div className="src-title">Microsoft Azure </div>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12} md={3}>
                        <Card className="card-wizard text-center card-cloud" onClick={()=>this.openCloudDetailPopUp('Jira')}>
                            <CardContent className="card-body-cloud">
                                <div className="switch-control">
                                    <Switch className={'switch-green active'} checked />
                                </div>
                                <div className="services-img">
                                    <img alt="Jira" src='/assets/images/Jira.png' />
                                </div>
                                <div className="src-title">Jira </div>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                {openCloudDetail === true && <CloudDetail closeCloudDetailPopUp={this.closeCloudDetailPopUp} cloudName={cloudName}/>}
            </div>
        );
    }
}


export default CloudAccounts