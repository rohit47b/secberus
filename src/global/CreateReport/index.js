/*
 * @Author: Virendra Patidar 
 * @Date: 2018-10-08 13:19:59 
 * @Last Modified by: Virendra Patidar
 * @Last Modified time: 2019-01-10 12:14:47
 */

import React, { PureComponent } from 'react'

import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import { Button, Grid } from '@material-ui/core'
import MenuItem from '@material-ui/core/MenuItem'

import { Field, reduxForm, reset } from 'redux-form'
import { SubmissionError, formValueSelector } from 'redux-form'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { cloneDeep, pull, filter, includes } from "lodash"

import { renderTextField, renderControlSelect, renderControlMultiSelect } from 'reduxFormComponent'
import Loader from 'global/Loader'
import SnackbarMessage from 'global/SnackbarMessage'

import * as integrationActions from 'actions/integrationAction'
import * as reportScheduleActions from 'actions/reportScheduleAction'
import * as ruleActions from 'actions/ruleAction'
import * as dashboardActions from 'actions/dashboardAction'
import * as commonActions from 'actions/commonAction'

import { showMessage } from 'actions/messageAction'
import { setProgressBar, setComplianceList, setPriorityList } from 'actions/commonAction'

import STATIC_DATA from 'data/StaticData'

const validate = values => {
    const errors = {}
    const requiredFields = [
        'name',
        'description',
        'account_id',
        'time_interval'
    ]
    requiredFields.forEach(field => {
        if (!values[field]) {
            errors[field] = 'This field is required'
        }
    })
    if (
        values.username &&
        !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.username)
    ) {
        errors.username = 'Invalid email address'
    }
    return errors
}



class CreateReportDialog extends PureComponent {

    _mounted = false

    state = {
        isProgress: false,
        openDialog: this.props.openDialog,
        serviceList: [],
        service: ['service'],
        allServiceNames: [],
        accountDataList: [],
        complianceList: [],
        allDisplayComplianceList: [],
        priorityList: [],
        allRuleStatus: STATIC_DATA.STATUS_LIST.map(status => status.display_name),

        message: '',
        variant: 'info',
        showSnackbarState: false
    }

    static getDerivedStateFromProps(nextProps, state) {
        return { openDialog: nextProps.openDialog }
    }


    componentDidUpdate = (prevProps, prevState) => {
        if (this.props.openDialog !== prevProps.openDialog) {
            this.props.reset();
            this.fetchAccountData()
            this.fetchServiceList()
            this.fetchCompliances()
            this.fetchPriorityList()
            if (this.props.editPayload && prevProps.openDialog === false) {

                let editPayload = this.props.editPayload
                if (this.props.editPayload.compliance.length === 0) {
                    editPayload.compliance = this.state.allDisplayComplianceList
                }
                if (this.props.editPayload.rule_status.length === 0) {
                    editPayload.rule_status = this.state.allRuleStatus
                }
                if (this.props.editPayload.priority.length === 0) {
                    editPayload.priority = this.state.priorityList
                }

                this.props.initialize(editPayload);
            } else {
                const editPayload = { name: '', description: '', account_id: '', service: [], time_interval: '', status: [], priority: [], compliance: [] }
                this.props.initialize(editPayload);
            }
            this.setState({ openDialog: prevProps.openDialog })
        }
    }

    componentDidMount() {
        this._mounted = true
        this.props.reset();
    }

    componentWillUnmount() {
        this._mounted = false
    }


    // -----------------------API call method START------------------------------
    fetchAccountData = () => {
        if (this.props.awsList.length !== 0) {
            this.setState({ accountDataList: this.props.awsList.accountList })
        } else {
            this.props.actions.fetchIntegrationList().
                then(result => {
                    if (this._mounted) {
                        if (result.success) {
                            this.setState({ accountDataList: result.data.length > 0 ? result.data[0].accounts : [] }, () => {
                            })
                        } else {
                            let message = { message: result, showSnackbarState: true, variant: 'error' }
                            this.props.showMessage(message)
                        }
                    }
                });
        }
    }

    fetchServiceList = () => {
        if (this.props.serviceList && this.props.serviceList.length === 0) {
            this.props.actions.fetchServiceList().
                then(result => {
                    if (this._mounted) {
                        if (result.success) {
                            this.setServiceData(result.data)

                        } else {
                            let message = { message: result, showSnackbarState: true, variant: 'error' }
                            this.props.showMessage(message)
                        }
                    }
                });
        } else {
            this.setServiceData(this.props.serviceList)
        }

    }

    fetchCompliances() {
        if (this.props.complianceList.length === 0) {
            this.props.actions.fetchCompliances().
                then(result => {
                    if (this._mounted) {
                        if (result.success) {
                            const allComplianceList = result.data.map(compliance => compliance.name)
                            this.props.setComplianceList(result.data)
                            this.setState({ complianceList: result.data, allDisplayComplianceList: allComplianceList, loaded: true });
                        } else {
                            let message = { message: result, showSnackbarState: true, variant: 'error' }
                            this.props.showMessage(message)
                        }
                    }
                });
        } else {
            const allComplianceList = this.props.complianceList.map(compliance => compliance.name)
            this.setState({ complianceList: this.props.complianceList, allDisplayComplianceList: allComplianceList, loaded: true });
        }
    }



    setServiceData = (list) => {
        let allServiceNames = []

        list.map((service, index) => {
            allServiceNames.push(service.service_name)
        })
        this.setState({ serviceList: list, allServiceNames }, () => { })
    }



    fetchPriorityList() {
        if (this.props.priorityList.length === 0) {
            this.props.actions.fetchPriorityList().
                then(result => {
                    if (this._mounted) {
                        if (result.success) {
                            this.props.setPriorityList(result.data)
                            this.setState({ priorityList: result.data, loaded: true });
                        } else {
                            let message = { message: result, showSnackbarState: true, variant: 'error' }
                            this.props.showMessage(message)
                        }
                    }

                });
        } else {
            this.setState({ priorityList: this.props.priorityList, loaded: true });
        }
    }
    fetchDashboardData(filterData, accountId) {

        let payload = {
            section: ['security_issue_by_service'],
            account: accountId
        }

        if (filterData.selectCloud.id !== 'all') {
            payload['cloud'] = filterData.selectCloud.id
        }

        this.props.actions.fetchDashboardData(payload).
            then(result => {
                if (this._mounted) {
                    if (result.success) {
                        this.setState({ dashboardData: result.data }, () => {
                            this.setData();
                        })
                    } else {
                        let message = { message: result, showSnackbarState: true, variant: 'error' }
                        this.props.showMessage(message)
                    }
                }
                this.setState({ isProgress: false })
            });
    }


    createReportFormSubmit = (values) => {

        let filtered_services = filter(this.state.serviceList, function (p) {
            return includes(values.service, p.service_name);
        });
        const filtered_services_names = filtered_services.map(service => service.service);



        let filtered_status = filter(STATIC_DATA.STATUS_LIST, function (p) {
            return includes(values.rule_status, p.display_name);
        });
        const filtered_status_values = filtered_status.map(status => status.value);


        let filtered_compliance = filter(this.state.complianceList, function (p) {
            return includes(values.compliance, p.name);
        });
        const filtered_compliance_values = filtered_compliance.map(compliance => compliance.value);

        let payload = {
            account_id: values.account_id,
            description: values.description,
            name: values.name,
            service: filtered_services_names,
            time_interval: values.time_interval,
            rule_status: filtered_status_values,
            priority: values.priority,
            compliance: filtered_compliance_values
        }

        return this.props.actions.createReportSchedule(payload).
            then(result => {
                this.setState({ isProgress: false })
                if (this._mounted) {
                    if (!result.success) {
                        this.setState({ isProgress: false })

                        if (typeof result === 'string') {
                            this.setState({ message: result, showSnackbarState: true, variant: 'error' });
                        } else {
                            throw new SubmissionError(result)
                        }

                    } else if (result.success) {
                        this.setState({ isProgress: false })
                        const file = new Blob(
                            [result.data],
                            { type: 'application/pdf' });

                        const fileURL = URL.createObjectURL(file);
                        window.open(fileURL);
                        // this.setState({ message: 'Report Generated Successfully', showSnackbarState: true, variant: 'success' });
                        this.props.handleDialogClose()
                    }
                }
            });
    }

    editReportFormSubmit = (values) => {
        let filtered_services = filter(this.state.serviceList, function (p) {
            return includes(values.service, p.service_name);
        });


        const filtered_services_names = filtered_services.map(service => service.service);


        let filtered_status = filter(STATIC_DATA.STATUS_LIST, function (p) {
            return includes(values.rule_status, p.display_name);
        });
        const filtered_status_values = filtered_status.map(status => status.value);


        let filtered_compliance = filter(this.state.complianceList, function (p) {
            return includes(values.compliance, p.name);
        });
        const filtered_compliance_values = filtered_compliance.map(compliance => compliance.value);



        let payload = {
            account_id: values.account_id,
            description: values.description,
            name: values.name,
            service: filtered_services_names,
            time_interval: values.time_interval,
            id: this.props.editPayload.id,
            rule_status: filtered_status_values,
            priority: values.priority,
            compliance: filtered_compliance_values
        }

        return this.props.actions.editReportSchdule(payload).
            then(result => {
                this.setState({ isProgress: false })
                if (this._mounted) {
                    if (!result.success) {
                        this.setState({ isProgress: false })

                        if (typeof result === 'string') {
                            this.setState({ message: result, showSnackbarState: true, variant: 'error' });
                        } else {
                            throw new SubmissionError(result)
                        }

                    } else if (result.success) {
                        this.setState({ isProgress: false })

                        this.setState({ message: 'Report Edit Successfully', showSnackbarState: true, variant: 'success' });
                        this.props.handleDialogClose()
                    }
                }
            });
    }


    // -----------------------API call method END------------------------------


    // -----------------------Custom method START------------------------------
    setData = () => {
        const data = this.state.dashboardData;
        data.map((item, index) => {
            if (item.section === 'security_issue_by_service') {
                this.setState({ serviceList: item.data, isProgress: false })
            }
        })
    }


    reportFormSubmit = (values) => {
        this.setState({ isProgress: true })
        if (this.props.editPayload) {
            this.editReportFormSubmit(values)
        } else {
            this.createReportFormSubmit(values)
        }
    }



    successDialogEvent = () => {
        this.setState({ openDialog: true })
    }

    handleDialogClose = () => {
        this.setState({ openDialog: false })

    }

    handleAccountSelect = (event) => {
    };

    handleIntervalSelect = (event) => {

    }

    handleServiceSelect = (event) => {
        //First time click on select all
        if (event.target.value.indexOf('-1') > -1) {
            let allServiceNames = this.state.allServiceNames
            this.props.initialize({ service: allServiceNames, name: this.props.name, description: this.props.description, account_id: this.props.account_id, time_interval: this.props.time_interval, rule_status: this.props.rule_status, priority: this.props.priority, compliance: this.props.compliance })
        }
    }

    handleStatusSelect = (event) => {
        //First time click on select all
        if (event.target.value.indexOf('-1') > -1) {
            this.props.initialize({ rule_status: this.state.allRuleStatus, service: this.props.service, name: this.props.name, description: this.props.description, account_id: this.props.account_id, time_interval: this.props.time_interval, priority: this.props.priority, compliance: this.props.compliance })
        }
    }

    handlePrioritySelect = (event) => {
        //First time click on select all
        if (event.target.value.indexOf('-1') > -1) {
            this.props.initialize({ priority: this.state.priorityList, service: this.props.service, name: this.props.name, description: this.props.description, account_id: this.props.account_id, time_interval: this.props.time_interval, rule_status: this.props.rule_status, compliance: this.props.compliance })
        }
    }


    handleComplianceSelect = (event) => {
        //First time click on select all
        if (event.target.value.indexOf('-1') > -1) {
            this.props.initialize({ compliance: this.state.allDisplayComplianceList, service: this.props.service, name: this.props.name, description: this.props.description, account_id: this.props.account_id, time_interval: this.props.time_interval, rule_status: this.props.rule_status, priority: this.props.priority })
        }
    }



    handleClose = () => {
        this.setState({ message: '', showSnackbarState: false });
    }

    // -----------------------Custom method END------------------------------

    render() {
        const { priorityList, openDialog, serviceList, accountDataList, isProgress, variant, message, showSnackbarState, complianceList } = this.state
        const { handleDialogClose } = this.props
        const { handleSubmit, invalid, submitting, pristine, editPayload } = this.props;
        return (

            <Dialog
                open={openDialog}
                onClose={handleDialogClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                className="modal-add network-modal modal-report"
            >
                <DialogTitle className="modal-title" id="alert-dialog-title">
                    Reporting
            <span onClick={handleDialogClose} className="close-icon">
                        <i className="fa fa-times-circle" aria-hidden="true"></i>
                    </span>
                </DialogTitle>
                <DialogContent className="modal-body">
                    {isProgress && <Loader />}
                    <form onSubmit={handleSubmit((values) => this.reportFormSubmit(values))}>
                        <Grid item sm={12} className="qaud-grid mrB10">
                            <Field className="text-field" component={renderTextField} controllabel="Name" name="name" type="text" />
                        </Grid>
                        <Grid item sm={12} className="qaud-grid mrB15">
                            <Field className="text-field" component={renderTextField} controllabel="Description" name="description" type="text" />
                        </Grid>
                        <Grid container spacing={24}>

                            <Grid item sm={6}>
                                <Field onChangeMethod={this.handleAccountSelect} className="text-field" component={renderControlSelect} name="account_id" type="text" label="Account">
                                    {
                                        accountDataList.map(function (account, index) {
                                            return <MenuItem className="select-item" key={account.account_name} value={account.id} >
                                                {account.account_name}
                                            </MenuItem>
                                        })
                                    }
                                </Field>
                            </Grid>

                            <Grid item sm={6}>
                                <Field
                                    onChangeMethod={this.handleServiceSelect}
                                    format={value => Array.isArray(value) ? value : []}
                                    className="text-field" component={renderControlMultiSelect} name="service" type="text" label="All Service">
                                    <MenuItem className="select-item" value={'-1'} data={'-1'}>
                                        Select All
                                       </MenuItem>
                                    {
                                        serviceList.map(item => (
                                            <MenuItem data={item.service} className="select-item" key={item.service_name} value={item.service_name}>
                                                {item.service_name}
                                            </MenuItem>
                                        ))}
                                    }
                                </Field>
                            </Grid>

                        </Grid>


                        <Grid container spacing={24}>

                            <Grid item sm={6}>
                                <Field
                                    onChangeMethod={this.handleStatusSelect}
                                    format={value => Array.isArray(value) ? value : []}
                                    className="text-field" component={renderControlMultiSelect} name="rule_status" type="text" label="All Status">
                                    <MenuItem className="select-item" value={'-1'} data={'-1'}>
                                        Select All
                                       </MenuItem>
                                    {
                                        STATIC_DATA.STATUS_LIST.map(status => (
                                            <MenuItem data={status.display_name} className="select-item" key={status.display_name} value={status.display_name}>
                                                {status.display_name}
                                            </MenuItem>
                                        ))}

                                </Field>
                            </Grid>

                            <Grid item sm={6}>
                                <Field
                                    onChangeMethod={this.handlePrioritySelect}
                                    format={value => Array.isArray(value) ? value : []}
                                    className="text-field" component={renderControlMultiSelect} name="priority" type="text" label="All Priority">
                                    <MenuItem className="select-item" value={'-1'} data={'-1'}>
                                        Select All
                                       </MenuItem>
                                    {
                                        priorityList.map(priority => (
                                            <MenuItem data={priority} className="select-item" key={priority} value={priority}>
                                                {priority}
                                            </MenuItem>
                                        ))}
                                    }
                                </Field>

                            </Grid>

                        </Grid>

                        <Grid container spacing={24}>
                            <Grid item sm={6}>
                                <Field
                                    onChangeMethod={this.handleComplianceSelect}
                                    format={value => Array.isArray(value) ? value : []}
                                    className="text-field" component={renderControlMultiSelect} name="compliance" type="text" label="All Compliance">
                                    <MenuItem className="select-item" value={'-1'} data={'-1'}>
                                        Select All
                                       </MenuItem>
                                    {
                                        complianceList.map(compliance => (
                                            <MenuItem data={compliance.name} className="select-item" key={compliance.name} value={compliance.name}>
                                                {compliance.name}
                                            </MenuItem>
                                        ))}
                                    }
                                </Field>

                            </Grid>


                            <Grid item sm={6} className="mrB20">
                                <Field onChangeMethod={this.handleIntervalSelect} className="text-field" component={renderControlSelect} name="time_interval" type="text" label="Time frame">
                                    <MenuItem className="select-item" value={'daily'}>Daily</MenuItem>
                                    <MenuItem className="select-item" value={'weekly'}>Weekly</MenuItem>
                                    <MenuItem className="select-item" value={'monthly'}>Monthly</MenuItem>
                                </Field>
                            </Grid>
                        </Grid>
                        <Button type="submit" className="btn btn-primary btn-md mrR10" color="primary" variant="contained">
                            {!editPayload ? 'Create' : 'Save'}
                        </Button>
                        <Button className="btn btn-gray btn-md" onClick={handleDialogClose} color="primary" autoFocus>
                            Cancel
                        </Button>
                    </form>

                    <SnackbarMessage
                        open={showSnackbarState}
                        message={message}
                        variant={variant}
                        handleClose={this.handleClose}
                    />
                </DialogContent>
            </Dialog>)
    }
}


const mapStateToProps = (state, ownProps) => {
    const selector = formValueSelector('createReport')
    return {
        name: selector(state, 'name'),
        description: selector(state, 'description'),
        account_id: selector(state, 'account_id'),
        time_interval: selector(state, 'time_interval'),
        rule_status: selector(state, 'rule_status'),
        service: selector(state, 'service'),
        priority: selector(state, 'priority'),
        compliance: selector(state, 'compliance'),
        awsList: state.commonReducer.awsList,
        serviceList: state.commonReducer.serviceList,
        filterData: state.uiReducer.filterData,
        complianceList: state.commonReducer.complianceList,
        priorityList:state.commonReducer.priorityList
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(Object.assign({}, integrationActions, reportScheduleActions, dashboardActions, commonActions, ruleActions), dispatch),
        showMessage: message => {
            dispatch(showMessage(message))
        }, setProgressBar: isProgress => {
            dispatch(setProgressBar(isProgress))
        }, setComplianceList: complianceList => {
            dispatch(setComplianceList(complianceList))
        }, setPriorityList: priorityList => {
            dispatch(setPriorityList(priorityList))
        }
    };
}


const connectWithRedux = withRouter((connect(mapStateToProps, mapDispatchToProps)(CreateReportDialog)));

const CreateReportDialogRedux = reduxForm({ form: 'createReport', validate, keepValues: true })(connectWithRedux)


export default CreateReportDialogRedux;