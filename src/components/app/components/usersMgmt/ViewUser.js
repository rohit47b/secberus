/*
 * @Author: Virendra Patidar 
 * @Date: 2018-10-01 15:49:14 
 * @Last Modified by: Virendra Patidar
 * @Last Modified time: 2019-05-28 16:36:17
 */
import { Button, Checkbox, Drawer, Grid } from '@material-ui/core';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { withStyles } from '@material-ui/core/styles'
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
import EditRole from './EditRole'
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


const styles = {
    expansionPanelSummaryContent: {

    },
    expansionPanelSummaryExpandIcon: {

    }
};



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
        is_editable: false,
        expanded: null,
        openDialog: false
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

    handleChange = panel => (event, expanded) => {
        this.setState({
            expanded: expanded ? panel : false,
        });
    };

    renderCheckboxGroup = ({ name, options, input, meta, ...custom }) => {
        const { expanded } = this.state;
        let $options = options.map((option, i) => (
            <TableRow key={option.reportType + '_' + i} className="report_recipient">
                <TableCell align="left">
                    <ExpansionPanel className="expand-subside-bar expand-common">
                        <ExpansionPanelSummary className="expand-sidebar-summary d-flex align-item-center box-shadow-none">
                            <span className="flexGrow1">{option.reportType} <i className="fa fa-caret-down" aria-hidden="true"></i></span>
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
                        </ExpansionPanelSummary>
                        {/* Render Cloud Checkbox */}

                        {option.cloud_type.map((cloud_option, i) => (
                            <ExpansionPanelDetails key={cloud_option.name + '-' + i} className="d-flex-imp bottom-border pd0">
                                <ExpansionPanel className="expand-sidebar2 expand-common">
                                    <ExpansionPanelSummary className="expand-sidebar-summary d-flex align-item-center">
                                        <Table className="table-expand-sidebar">
                                            <TableBody>
                                                <TableRow className="row-bg">
                                                    <TableCell className="bdr-0 pdR0 pdT0 pdL15 pdB0 width-100" align="left">
                                                        <span> - {cloud_option.name} <i className="fa fa-caret-down" aria-hidden="true"></i></span>
                                                        {/* <span className="dropdown-icon mrL15">
                                                        <i class="fa fa-caret-down" aria-hidden="true"></i>
                                                    </span> */}
                                                    </TableCell>
                                                    <TableCell className="bdr-0 pdR0 text-right">
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
                                                    </TableCell>
                                                </TableRow>
                                            </TableBody>
                                        </Table>
                                    </ExpansionPanelSummary>
                                    <ExpansionPanelDetails className="expand-sidebar-content">
                                        {cloud_option.cloud_accounts.map((cloud_account_option, i) => (
                                            <Table className="table-expand-sidebar" key={cloud_account_option + '_' + i}>
                                                <TableBody>
                                                    <TableRow className="mrL20">
                                                        <TableCell className="bdr-0 pdT0 pdR0 pdB0 pdL35 width-100" align="left"><span>-{cloud_account_option}</span></TableCell>
                                                        <TableCell className="bdr-0 pdR0 text-right">
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
                                                        </TableCell>
                                                    </TableRow>
                                                </TableBody>
                                            </Table>
                                        ))
                                        }
                                    </ExpansionPanelDetails>
                                </ExpansionPanel>

                            </ExpansionPanelDetails>
                        ))
                        }

                    </ExpansionPanel>


                </TableCell>



            </TableRow>
        ));
        return (
            <Fragment>
                {$options}
            </Fragment>
        )
    }


    renderCheckboxGroup1 = ({ name, options, input, meta, ...custom }) => {
        //Render Report Type
        let $options = options.map((option, i) => (
            <div key={option.reportType + '_' + i}>
                <div className="d-flex align-item-center">
                    <span className="flexGrow1">
                        <strong>{option.reportType}
                            <span className="dropdown-icon mrL15">
                                <i className="fa fa-caret-down" aria-hidden="true"></i>
                            </span>
                        </strong>
                    </span>

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
                                    <span className="flexGrow1"> - {cloud_account_option}</span>
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

    editOpen = () => {
        this.setState({ openDialog: true })
    }

    editClose = () => {
        this.setState({ openDialog: false })
    }

    render() {

        let { handleSubmit, userDetails, awsList } = this.props;
        const { anchorEl, open, openDialog } = this.state;
        userDetails.role = "Report Recipient"
        return (
            <Drawer className="right-sidebar width-450 user-sidebar" anchor="right" open={true}>
                <div className="container sidebar-container">
                    {/* <div className="sidebar-header justify-flex-end">
                        <span onClick={() => this.props.toggleDrawerUser(false)} className="sidebar-close-icon"><i className="fa fa-times-circle" aria-hidden="true"></i> Exit</span>
                    </div> */}
                    <div
                        tabIndex={0}
                        role="button"
                        className="sidebar-body container"
                    >
                        <form onSubmit={handleSubmit((values) => this.reportFormSubmit(values))}>
                            <Grid container className="width-100 mr0">
                                <Grid item sm={12} className="qaud-grid mrB0 responsive-fields">
                                    <ClickAwayListener onClickAway={this.props.handleClosePopper}>
                                        <Fragment>
                                            <Table className="table-expand-sidebar mrB5">
                                                <TableBody>
                                                    <TableRow>
                                                        <TableCell>
                                                            <strong>User Name:</strong>
                                                        </TableCell>
                                                        <TableCell>
                                                            <strong>{userDetails.first_name} {userDetails.last_name}</strong>
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            <div className="actions">
                                                                <span> <i className="fa fa-trash-o" aria-hidden="true"></i></span>
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                    <TableRow>
                                                        <TableCell>
                                                            <strong> Role</strong> <span onClick={this.props.handleOpenPopper} className={open == true ? "alert-icon mrL10  active" : 'alert-icon mrL10'}><i className="fa fa-question-circle" aria-hidden="true"></i></span>
                                                        </TableCell>
                                                        <TableCell>
                                                            <strong>Super Admin</strong>
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            <div className="actions">
                                                                <span><i className="fa fa-pencil" aria-hidden="true" onClick={this.editOpen}></i></span>
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                </TableBody>
                                            </Table>
                                            <Paper className="paper-light-gray text-center" elevation={1}>
                                                ACCESS PRIVILEGES
                                        </Paper>
                                            <ExpansionPanel defaultExpanded className="expand-sidebar expand-common">
                                                <ExpansionPanelSummary className="expand-sidebar-summary d-flex align-item-center">
                                                    <Typography className={"heading-black flexGrow1"}>
                                                        <strong>Cloud Account</strong>
                                                        <span className="dropdown-icon">
                                                            <i className="fa fa-caret-down" aria-hidden="true"></i>
                                                        </span>
                                                    </Typography>
                                                </ExpansionPanelSummary>
                                                <ExpansionPanelDetails className="expand-sidebar-content">
                                                    <Table className="table-expand-sidebar">
                                                        <TableBody>
                                                            {
                                                                awsList.accountList.map((account, index) => {
                                                                    return <TableRow key={account.name}>
                                                                        <TableCell align="left">{account.name}</TableCell>
                                                                    </TableRow>
                                                                })
                                                            }


                                                        </TableBody>
                                                    </Table>
                                                </ExpansionPanelDetails>
                                            </ExpansionPanel>
                                        </Fragment>
                                    </ClickAwayListener>
                                </Grid>
                            </Grid>
                        </form>
                        <EditRole openDialog={openDialog} handleDialogClose={this.editClose} />
                    </div>
                    <Grid item sm={12} className="sidebar-btn">
                        <Button type="submit" className="btn btn-primary btn-md mrR10" color="primary" variant="contained">
                            {'Save'}
                        </Button>
                        <Button className="btn btn-gray btn-md" onClick={() => this.props.toggleDrawerUser(false)} color="primary" autoFocus>
                            Cancel
                        </Button>
                    </Grid>
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
        awsList: state.commonReducer.awsList
    }
}

const connectWithRedux = withRouter((connect(mapStateToProps, null)(ViewUser)));


const AddEditUserRedux = reduxForm({ form: 'userForm', validate, keepValues: true })(connectWithRedux)

export default withStyles(styles, { withTheme: true })(AddEditUserRedux);

