/*
 * @Author: Virendra Patidar 
 * @Date: 2018-10-01 15:49:14 
 * @Last Modified by: Virendra Patidar
 * @Last Modified time: 2019-04-20 17:41:17
 */
import { Button, Checkbox, Drawer, Grid } from '@material-ui/core';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import STATIC_DATA from 'data/StaticData';
import React, { Fragment, PureComponent } from "react";
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Field, formValueSelector, reduxForm } from 'redux-form';
import { renderTextField } from 'reduxFormComponent';

const CLOUD_ACCOUNTS =
    [
        { label: 'AWS-Production01', value: 'AWS-Production01' },
        { label: 'AWS-Stating01', value: 'AWS-Stating01' },
        { label: 'AWS-Production02', value: 'AWS-Production02' },
        { label: 'AWS-Dev01', value: 'AWS-Dev01' }
    ]

const REPORT_TYPE =
    [
        { reportType: 'Security', cloud_type: [{ name: 'AWS', cloud_accounts: ['AWS-Stating01', 'AWS-Production01'] }, { name: 'GCP', cloud_accounts: [] }] },
        { reportType: 'Compliance', cloud_type: [{ name: 'PCI', cloud_accounts: ['AWS-Development01', 'AWS-Production01', 'AWS-Production02'] }, { name: 'HIPAA', cloud_accounts: [] }, { name: 'GDPR', cloud_accounts: [] }, { name: 'SOC2', cloud_accounts: [] }] },
        { reportType: 'Custom', cloud_type: [{ name: 'Custom Report 1', cloud_accounts: [] }, { name: 'Custom Report 2', cloud_accounts: [] }] },
    ]



const validate = values => {
    const errors = {}
    const requiredFields = [
        'userName',
        'emailId',
        'roles',
        'cloud_accounts'
    ]
    requiredFields.forEach(field => {
        if (!values[field]) {
            errors[field] = 'This field is required'
        }
    })
    if (
        values.emailId &&
        !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.emailId)
    ) {
        errors.emailId = 'Invalid email address'
    }
    return errors
}


class ViewUser extends PureComponent {

    _mounted = false

    state = {
        allRoleValue: [],
        is_editable: false
    };



    handleClickAway = () => {
        this.setState({
            open: false,
        });
    };


    componentDidMount() {
        const editPayload = { userName: this.props.userDetails.userName, emailId: this.props.userDetails.emailId, role: this.props.userDetails.role }
        this.props.initialize(editPayload);
        this.setAllRoleValue()
    }


    setAllRoleValue = () => {
        let allRoleValue = []
        STATIC_DATA.USER_ROLES.map((role, index) => {
            allRoleValue.push(role.value)
        })
        this.setState({ allRoleValue }, () => { })
    }


    handleRoleSelect = () => {
        console.log(' handleRoleSelect ')
    }


    renderCheckboxGroup = ({ name, options, input, meta, ...custom }) => {
        //Render Report Type
        let $options = options.map((option, i) => (
            <div key={option.reportType + '_' + i}>
                <div className="d-flex align-item-center">
                    <span className="flexGrow1"><strong>{option.reportType}</strong></span>
                    <Checkbox
                        name={`${name}[${i}]`}
                        defaultChecked={input.value.indexOf(option.reportType) !== -1}
                        onChange={(e, checked) => {
                            let newValue = [...input.value];
                            if (checked) {
                                newValue.push(option.reportType);
                            } else {
                                newValue.splice(newValue.indexOf(option.reportType), 1);
                            }
                            return input.onChange(newValue);
                        }}
                        {...custom}
                        className="checkbox-small mrL30"
                    // style={{marginLeft:"70%",position:"fixed",float:"right"}}
                    />
                </div>
                {/* Render Cloud Checkbox */}
                {option.cloud_type.map((cloud_option, i) => (
                    <div key={cloud_option.name + '_' + i} className="mrL10">
                        <div className="d-flex align-item-center">
                            <span className="flexGrow1"> - {cloud_option.name}</span>
                            <Checkbox
                                name={`${name}[${i}]`}
                                defaultChecked={input.value.indexOf(cloud_option.name) !== -1}
                                onChange={(e, checked) => {
                                    let newValue = [...input.value];
                                    if (checked) {
                                        newValue.push(cloud_option.name);
                                    } else {
                                        newValue.splice(newValue.indexOf(cloud_option.name), 1);
                                    }
                                    return input.onChange(newValue);
                                }}
                                {...custom}
                                className="checkbox-small"
                            />
                        </div>

                        {cloud_option.cloud_accounts.map((cloud_account_option, i) => (
                            <div key={cloud_account_option + '_' + i} className="mrL20">
                                <div className="d-flex align-item-center">
                                    <span className="flexGrow1">-{cloud_account_option}</span>
                                    <Checkbox
                                        name={`${name}[${i}]`}
                                        defaultChecked={input.value.indexOf(cloud_account_option) !== -1}
                                        onChange={(e, checked) => {
                                            let newValue = [...input.value];
                                            if (checked) {
                                                newValue.push(cloud_account_option);
                                            } else {
                                                newValue.splice(newValue.indexOf(cloud_account_option), 1);
                                            }
                                            return input.onChange(newValue);
                                        }}
                                        {...custom}
                                        className="checkbox-small"
                                    />
                                </div>
                            </div>
                        ))
                        }
                    </div>
                ))
                }
            </div>


        ));
        return (
            <div>
                {$options}
            </div>
        )
    }

    render() {

        const { handleSubmit, userDetails } = this.props;
        const { anchorEl, open, placement, is_editable } = this.state;

        return (
            <Drawer className="right-sidebar width-600 security-sidebar" anchor="right" open={true}>
                <div className="container sidebar-container">
                    <div className="sidebar-header">
                        <h4>{userDetails.userName}</h4>
                        <span onClick={() => this.props.toggleDrawerUser(false)} className="sidebar-close-icon"><i className="fa fa-times-circle" aria-hidden="true"></i> Exit</span>
                        <div className="clearfix"></div>
                    </div>
                    <div
                        tabIndex={0}
                        role="button"
                        className="sidebar-body container"
                    >
                        <form onSubmit={handleSubmit((values) => this.reportFormSubmit(values))}>
                            <Grid container className="width-100 mr0">

                                {is_editable === true && <Fragment> <Grid item sm={12} className="qaud-grid mrB10">
                                    <Field className="text-field" component={renderTextField} fixedlabel="Name" name="userName" type="text" />
                                </Grid>
                                    <Grid item sm={12} className="qaud-grid mrB15">
                                        <Field className="text-field" component={renderTextField} fixedlabel="User email Id" name="emailId" type="text" />
                                    </Grid>
                                </Fragment>
                                }

                                <Grid item sm={12} className="qaud-grid mrB15">
                                    <ClickAwayListener onClickAway={this.props.handleClosePopper}>
                                        <Paper className="paper-action" elevation={1}>
                                            <span className={"heading-black flexGrow1"}>
                                                <strong>Role</strong>
                                                <span onClick={this.props.handleOpenPopper} className={open == true ? "alert-icon mrL10  active" : 'alert-icon mrL10'}><i className="fa fa-question-circle" aria-hidden="true"></i></span>
                                            </span>
                                            <span><strong>Action</strong></span>
                                        </Paper>
                                        <Paper className="paper-action" elevation={1}>
                                            <span className={"heading-black flexGrow1"}>
                                                <strong>{userDetails.role}</strong>
                                            </span>
                                            <div className="actions">
                                                <span>
                                                    <i className="fa fa-pencil" aria-hidden="true"></i>
                                                </span>
                                                <span className="mrL15">
                                                    <i className="fa fa-trash-o" aria-hidden="true"></i>
                                                </span>
                                            </div>
                                        </Paper>
                                        <ExpansionPanel className="expand-sidebar">
                                            <ExpansionPanelSummary className="expand-sidebar-summary d-flex align-item-center">
                                                <Typography className={"heading-black flexGrow1"}>
                                                    <strong>Cloud Account</strong>
                                                    <span className="dropdown-icon mrL15">
                                                        <i className="fa fa-angle-down" aria-hidden="true"></i>
                                                    </span>
                                                </Typography>
                                                <span className="pdR0">Action</span>
                                            </ExpansionPanelSummary>
                                            <ExpansionPanelDetails className="expand-sidebar-content">
                                                <Table className="table-expand-sidebar">
                                                    <TableBody>
                                                        {userDetails.role !== 'Super Admin' ? <Fragment> <TableRow>
                                                            <TableCell align="left">AWS-Production01</TableCell>
                                                            <TableCell className="text-right">
                                                                <div className="actions">
                                                                    <i className="fa fa-trash-o" aria-hidden="true"></i>
                                                                </div>
                                                            </TableCell>
                                                        </TableRow>
                                                            <TableRow>
                                                                <TableCell align="left">AWS-Dev01</TableCell>
                                                                <TableCell className="text-right">
                                                                    <div className="actions">
                                                                        <i className="fa fa-trash-o" aria-hidden="true"></i>
                                                                    </div>
                                                                </TableCell>
                                                            </TableRow>
                                                            <TableRow>
                                                                <TableCell align="left">AWS-Staging01</TableCell>
                                                                <TableCell className="text-right">
                                                                    <div className="actions">
                                                                        <i className="fa fa-trash-o" aria-hidden="true"></i>
                                                                    </div>
                                                                </TableCell>
                                                            </TableRow>

                                                            {(userDetails.role === 'Admin' || userDetails.role === 'Manager') && <Fragment>
                                                                <TableRow>
                                                                    <TableCell align="left">AWS-Development001</TableCell>
                                                                    <TableCell className="text-right">
                                                                        <div className="actions">
                                                                            <i className="fa fa-plus-circle" aria-hidden="true"></i>
                                                                        </div>
                                                                    </TableCell>
                                                                </TableRow>


                                                                <TableRow>
                                                                    <TableCell align="left">AWS-Development002</TableCell>
                                                                    <TableCell className="text-right">
                                                                        <div className="actions">
                                                                            <i className="fa fa-plus-circle" aria-hidden="true"></i>
                                                                        </div>
                                                                    </TableCell>
                                                                </TableRow>

                                                                <TableRow>
                                                                    <TableCell align="left">AWS-Development003</TableCell>
                                                                    <TableCell className="text-right">
                                                                        <div className="actions">
                                                                            <i className="fa fa-plus-circle" aria-hidden="true"></i>
                                                                        </div>
                                                                    </TableCell>
                                                                </TableRow>
                                                            </Fragment>
                                                            }
                                                        </Fragment> : <TableRow>
                                                                <TableCell align="left">Universal Access</TableCell>
                                                            </TableRow>
                                                        }

                                                    </TableBody>
                                                </Table>
                                            </ExpansionPanelDetails>
                                        </ExpansionPanel>
                                    </ClickAwayListener>
                                </Grid>

                                {userDetails.role === 'Report Recipient' && <Grid item sm={12} className="qaud-grid mrB15">
                                    <Paper className="paper-action" elevation={1}>
                                        <span className={"heading-black flexGrow1"}>
                                            <strong>Report Type</strong>
                                        </span>
                                    </Paper>
                                    <fieldset>
                                        <Field
                                            name="report_recipient"
                                            component={this.renderCheckboxGroup}
                                            options={REPORT_TYPE}
                                        />
                                    </fieldset>
                                </Grid>}
                                <Grid item sm={12} className="sidebar-btn">
                                    <Button type="submit" className="btn btn-primary btn-md mrR10" color="primary" variant="contained">
                                        {!userDetails.userName ? 'Add' : 'Update'}
                                    </Button>
                                    <Button className="btn btn-gray btn-md" onClick={() => this.props.toggleDrawerUser(false)} color="primary" autoFocus>
                                        Cancel
                                   </Button>
                                </Grid>
                            </Grid>
                        </form>
                    </div>
                </div>
            </Drawer>
        );
    }
}
const mapStateToProps = (state, ownProps) => {
    const selector = formValueSelector('userForm')
    return {
        userName: selector(state, 'userName'),
        emailId: selector(state, 'emailId'),
    }
}

const connectWithRedux = withRouter((connect(mapStateToProps, null)(ViewUser)));


const AddEditUserRedux = reduxForm({ form: 'userForm', validate, keepValues: true })(connectWithRedux)

export default AddEditUserRedux;

