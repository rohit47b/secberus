/*
 * @Author: Virendra Patidar 
 * @Date: 2018-11-16 14:55:42 
 * @Last Modified by: Virendra Patidar
 * @Last Modified time: 2019-04-26 10:15:17
 */
import Grid from '@material-ui/core/Grid';
import { setActiveMenu, setActiveParentMenu } from 'actions/commonAction';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper'
import React, { PureComponent, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router-dom'
import { store } from 'client'
import { connect } from "react-redux"
import { bindActionCreators } from 'redux'
import { cloneDeep } from "lodash"
import ComplianceChart from './ComplianceChart';
import ComplianceReportList from './ComplianceReportList';
import ComplianceReportSubList from './ComplianceReportSubList';
import ComplianceReport from './report/ComplianceReport';
import LineChart from '../security/LineChart';

import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'

import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import ListItemText from '@material-ui/core/ListItemText'
import Input from '@material-ui/core/Input'
import CancelIcon from '@material-ui/icons/HighlightOff';

import * as complianceActions from 'actions/complianceAction';
import html2canvas  from 'html2canvas'
import jsPDF from 'jspdf'


class Compliance extends PureComponent {
    _mounted = false

    state = {
        cloud_accounts: [
            'AWS-Production-001',
            'AWS-Stating-001',
            'AWS-Dev-001'
        ],
        selected_cloud_account: '',
        selected_control: '',
        selected_compliance: 'PCI',
        company_account: 'Company-12345',
        date: '',
        time: '',
        dataList: {},
        compliaceList: {},
        isOpen: false
    }

    componentDidMount() {
        this._mounted = true
        this.props.setActiveParentMenu('Reports')
        this.props.setActiveMenu('Compliance')
        const filterData = this.props.filterData
        if (filterData.selectAccount.id !== 'all' && filterData.selectAccount.id !== undefined) {
            this._mounted = false
            this.fetchComplianceReport(filterData)
            this.getDate()
        } else {
            this.setState({ filterProgress: false, loading: false })
        }
        this.unsubscribe = store.subscribe(this.receiveFilterData)
    }

    getDate = () => {
        var today = new Date();
        var time = '';
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0');
        var yyyy = today.getFullYear();
        var HH = today.getHours()
        var MM = today.getMinutes()
        var SS = today.getSeconds()

        today = mm + '/' + dd + '/' + yyyy;
        time = HH + ':' + MM + ':' + SS;

        this.setState({date: today, time: time})
    }

    receiveFilterData = data => {

        const currentState = store.getState()
        const previousValue = this.currentValue
        this.currentValue = currentState.uiReducer.filterData
        if (
            this.currentValue && previousValue !== this.currentValue
        ) {
            const filterData = cloneDeep(currentState.uiReducer.filterData)
            if (filterData.selectAccount.id !== 'all' && this._mounted) {
                this.fetchComplianceReport(filterData)
            }
        }
    }

    fetchComplianceReport(filterData) {
        this.props.actions.fetchComplianceReport({cloud_account_id: filterData.selectAccount.id}).
            then(result => {
                this._mounted = true
                if (typeof result !== 'string') {
                    this.setState({dataList: result})
                    this.filterCompliace(this.state.selected_compliance, result)
                } else {
                    console.log(' Error in fetching alerts :- ', result);
                    this.setState({ loading: false, filterProgress: false })
                }
            });
    }

    filterCompliace(currentCompliance, dataList) {
        let compliaceList = {}
        let selectedCompliance = currentCompliance
        if (currentCompliance === 'ISO 27001') {
            selectedCompliance = 'ISO 2700'
        }
        if (dataList.compliances !== undefined) {
            dataList.compliances.forEach(function(compliance) {
                if (compliance.name.indexOf(selectedCompliance) !== -1) {
                    compliaceList = compliance
                }
            });
        }
        this.setState({compliaceList, loading: false})
    }

    selectCloudAccount = (selected_cloud_account) => {
        this.setState({ selected_cloud_account, selected_control: '' })
    }

    selectControl = (selected_control) => {
        this.setState({ selected_control })
    }


    complianceSelectHandler = name => event => {
        let value = event.target.value;
        this.setState({ selected_compliance: value, selected_cloud_account: '', selected_control: '' })
        this.filterCompliace(value, this.state.dataList)
    };

    print=()=> {
        const filename  = 'ThisIsYourPDFFilename.pdf';
        const HTML_Width = document.querySelector('#compliancePDF').offsetWidth;
        const HTML_Height = document.querySelector('#compliancePDF').offsetHeight;
        const top_left_margin = 15;
		const PDF_Width = HTML_Width+(top_left_margin*2);
        const PDF_Height = (PDF_Width*1.5)+(top_left_margin*2);
		const canvas_image_width = HTML_Width;
        const canvas_image_height = HTML_Height;
        
        const totalPDFPages = Math.ceil(HTML_Height/PDF_Height)-1;

        html2canvas(document.querySelector('#compliancePDF'),{allowTaint:true}).then(canvas => {
            canvas.getContext('2d');
            let imgData = canvas.toDataURL("image/png");
            let pdf = new jsPDF('p', 'pt', [PDF_Width, PDF_Height]);
            pdf.addImage(imgData, 'PNG', top_left_margin, top_left_margin+95,canvas_image_width,canvas_image_height);
            for (var i = 1; i <= totalPDFPages; i++) {
                pdf.addPage(PDF_Width, PDF_Height);
				pdf.addImage(imgData, 'PNG', top_left_margin, -(PDF_Height*i)+(top_left_margin*4),canvas_image_width,canvas_image_height);
            }
            pdf.save(filename);
        });
    }

    openDialog=()=> {
        this.setState({isOpen: true})
    }
    
    handleVerificationDialogClose = () => {
        this.setState({ isOpen: false });
    };

    render() {
        mixpanel.track("View Page", {
            "Page Name": 'Report Compliance',
        });
        const { cloud_accounts, selected_cloud_account, selected_control, selected_compliance, date, time, compliaceList, isOpen } = this.state
        const { selectedCloudAccount, companyAccount } = this.props
        return (
            <div className="container" >
                <Dialog
                    open={isOpen}
                    onClose={this.handleVerificationDialogClose}
                    onEntering={this.print}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                    className="report-dialog"
                >
                    <DialogContent className="dialog-content">
                    <DialogTitle className="dialog-title" id="alert-dialog-title">
                        <CancelIcon onClick={this.handleVerificationDialogClose} className="icon-close" />
                    </DialogTitle>
                        <div id="compliancePDF">
                            <ComplianceReport />
                        </div>
                    </DialogContent>
                </Dialog>
                <Grid container spacing={24} className="mrB10">
                    <Grid item xs={12} sm={12} md={2}>
                        <FormControl className="multi-select">
                            <Select
                                value={selected_compliance ? selected_compliance : []}
                                onChange={this.complianceSelectHandler('time_interval')}
                                className="select-feild"
                                MenuProps={{
                                    style: {
                                        top: '30px'
                                    }
                                }}
                            >

                                <MenuItem className="select-item" key={"PCI"} value={"PCI"} >PCI</MenuItem>
                                <MenuItem className="select-item" key={"HIPAA"} value={"HIPAA"} >HIPAA</MenuItem>
                                <MenuItem className="select-item" key={"CIS"} value={"CIS"} >CIS</MenuItem>
                                <MenuItem className="select-item" key={"ISO 27001"} value={"ISO 27001"} >ISO 27001</MenuItem>
                                }
                    </Select>
                        </FormControl>
                    </Grid>
                </Grid>

                <div className="report-details mrB40">
                    <Grid container className="align-item-center">
                        <Grid item xs={12} sm={12} md={1} className="report-text highligh-text">
                            <span><strong>{companyAccount}</strong></span>
                        </Grid>
                        <Grid item xs={12} sm={12} md={11} className="report-text-info pdL30">
                            <span className="pdR30"><strong>Report Type</strong> : {selected_compliance} Compliance Posture</span>
                            <span className="pdR30"><strong>Cloud Account</strong> : {this.props.filterData.selectAccount.name}</span>
                            <span className="pdR30"><strong>Date</strong> : {date}</span>
                            <span><strong>Time</strong> : {time}</span>
                        </Grid>
                    </Grid>
                    <Grid container className="align-item-center">
                        <Grid item xs={12} sm={12} md={1} className="report-text">
                            <span><strong>Quick Links:</strong></span>
                        </Grid>
                        <Grid item xs={12} sm={12} md={11} className="report-text-info pdL30">
                            <a href="#cloud_account" className="link-hrf  pdR30">Cloud Account: {selected_compliance}</a>
                            <a href="#control" className="link-hrf pdR30">Control: {selected_compliance}</a>
                        </Grid>
                    </Grid>
                    <div className="download-links">
                        Download
                        <span onClick={this.openDialog}  className="link-hrf pdL10">
                            <i className="fa fa-file-pdf-o" aria-hidden="true" ></i>
                        </span>
                    </div>
                </div>

                {/* <Grid container spacing={16}>
                    <Grid item md={12}>
                        <Typography className="mrB10 heading-h3" id="global_overview" component="h3">
                            <strong>Global Overview:</strong> {selected_compliance}
                        </Typography>
                    </Grid>
                </Grid>
                <Grid container spacing={16} className="mrB30">
                    <Grid item md={3} className="col-30">
                        <Paper elevation={1} className="paper-box compliance-box">
                            <div className="compliance-chart-status">
                                <Typography className="heading-h4" component="h4">
                                    <strong>{selected_compliance} Posture</strong> <span>(Current)</span>
                                </Typography>
                                <div className="pie-chart-status d-flex align-item-center justify-content-center">
                                    <ComplianceChart is_report_icon={false} compliance_name={selected_compliance} />
                                </div>
                            </div>
                        </Paper>
                    </Grid>
                    <Grid item md={6} className="col-40 line-chart">
                        <LineChart lineColor={"#ECA84E"} />
                    </Grid>
                    <Grid item md={3} className="col-30">
                        <Paper elevation={1} className="paper-box compliance-box">
                            <div className="compliance-chart-status">
                                <Typography className="heading-h4" component="h4">
                                    <strong>{selected_compliance} Posture</strong> <span>(Projected)</span>
                                </Typography>
                                <div className="pie-chart-status d-flex align-item-center justify-content-center">
                                    <ComplianceChart is_report_icon={false} compliance_name={selected_compliance} />
                                </div>
                                <div className="light-text">Remediation Plan in Progress : 3</div>
                            </div>
                        </Paper>
                    </Grid>
                </Grid>
                <Grid container spacing={16} className="mrB30">
                    <Grid item md={12}>
                        <Typography className="mrB10 heading-h3" id="global_controls" component="h3">
                            <strong>Global Controls</strong> <span className="font-normal"> - {selected_compliance}</span>
                        </Typography>
                        <ComplianceReportList selectControl={this.selectControl} compliance_name={selected_compliance} />
                    </Grid>
                </Grid>
                <Grid container spacing={16}>
                    <Grid item md={12}>
                        <Typography className="mrB10 heading-h3" id="cloud_accounts" component="h3">
                            <strong>Cloud Accounts</strong>
                        </Typography>
                    </Grid>
                </Grid>
                <Grid container spacing={16} className="mrB15 compliance-pie-chart-data">
                    {
                        cloud_accounts.map(cloud_account => {
                            return <Grid item md={4} key={cloud_account} >
                                <Paper elevation={1} className={cloud_account === selected_cloud_account ? "paper-box compliance-box active" : "paper-box compliance-box"}>
                                    <div className="compliance-chart-status">
                                        <Typography className="heading-h4" component="h4">
                                            <strong>Cloud Account:</strong> <span>{cloud_account}</span>
                                        </Typography>
                                        <span className="report-icon" onClick={() => this.selectCloudAccount(cloud_account)} style={{ cursor: "pointer", marginLeft: "94%" }}><img alt="Document" src="/assets/images/document_icon.png" width={15}></img></span>
                                        <div className="pie-chart-status d-flex align-item-center justify-content-center">
                                            <ComplianceChart is_report_icon={true} compliance_name={selected_compliance} />
                                        </div>
                                        <div className="light-text">Projection :   <span className="chip chip-success">12 <i className="fa fa-arrow-down" aria-hidden="true"></i></span></div>
                                    </div>
                                </Paper>
                            </Grid>
                        })
                    }

                </Grid> */}

                {(selectedCloudAccount.id !== "all" && compliaceList.requirements !== undefined) && <Fragment>
                    <hr className="mrB10" />
                    <Grid container spacing={16}>
                        <Grid item xs={12} sm={12} md={12}>
                            <Typography className="mrB10 heading-h3" component="h3" id="cloud_account">
                                <strong>Cloud Account: </strong><span className="font-normal"> {selectedCloudAccount.name}</span>
                            </Typography>
                        </Grid>
                    </Grid>

                    <Grid container spacing={16} className="mrB30">
                        <Grid item xs={12} sm={12} md={3} className="col-30">
                            {/* <Paper elevation={1} className="paper-box compliance-box">
                                <Typography className="heading-h4" component="h4">
                                    <strong>Account Information:</strong> {selected_cloud_account}
                                </Typography>
                                <div className="pie-chart-status d-flex align-item-center justify-content-center">
                                    <div className="status-bar-sub-heading pdR15">
                                       
                                    </div>
                                    <ComplianceChart compliance_name={selected_compliance} />
                                </div>
                            </Paper> */}

                            <Paper elevation={1} className="paper-box compliance-box">
                                <div className="compliance-chart-status">
                                    <Typography className="heading-h4" component="h4">
                                        <strong>{selected_compliance} Posture</strong>  (Current)
                                        </Typography>
                                    <div className="pie-chart-status d-flex align-item-center justify-content-center">
                                        <ComplianceChart is_report_icon={true} compliance_name={selected_compliance} compliance={compliaceList}/>
                                    </div>
                                </div>
                            </Paper>
                        </Grid>
                        {/* <Grid item md={6} className="col-40 line-chart">
                            <LineChart lineColor={"#ECA84E"} />
                        </Grid>
                        <Grid item md={3} className="col-30">

                            <Paper elevation={1} className="paper-box compliance-box">
                                <div className="compliance-chart-status">
                                    <Typography className="heading-h4" component="h4">
                                        <strong>{selected_compliance} Posture</strong> (Projected)
                                        </Typography>
                                    <div className="pie-chart-status d-flex align-item-center justify-content-center">
                                        <ComplianceChart is_report_icon={true} compliance_name={selected_compliance} compliace={compliaceList}/>
                                    </div>
                                    <div className="light-text">Remediation Plan in Progress : 3</div>
                                </div>
                            </Paper>
                        </Grid> */}
                    </Grid>

                    <Grid container spacing={16}>
                        <Grid item xs={12} sm={12} md={12}>
                            <Typography className="mrB10 heading-h3" component="h3" id="control">
                                <strong>Control- </strong><span className="font-normal">{selected_compliance}: {selected_cloud_account.name}</span>
                            </Typography>
                        </Grid>
                    </Grid>
                    <Grid container spacing={16} className="mrB30">
                        <Grid item xs={12} sm={12} md={12}>
                            <ComplianceReportList selectControl={this.selectControl} compliance_name={compliaceList.name} controlList={compliaceList.requirements}/>
                        </Grid>
                    </Grid></Fragment>}

                {selected_control !== '' && <Fragment>
                    <Grid container spacing={16}>
                        <Grid item xs={12} sm={12} md={12}>
                            <Typography className="mrB10 heading-h3" component="h3">
                                <strong>Control Details :</strong> <span className="font-normal">{selected_compliance}:{selected_cloud_account.name}</span>
                            </Typography>
                        </Grid>
                    </Grid>
                    <Grid container spacing={16}>
                        <Grid xs={12} sm={12} item md={12}>
                            <ComplianceReportSubList control={selected_control} compliance_name={compliaceList.name}/>
                        </Grid>
                    </Grid>
                </Fragment>
                }
            </div>
        )
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators(Object.assign({}, complianceActions), dispatch),
        setHeaderFilterData: filterData => {
            dispatch(setHeaderFilterData(filterData))
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
    reportTabValue: state.uiReducer.reportTabValue,
    filterData: state.uiReducer.filterData,
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Compliance)) 