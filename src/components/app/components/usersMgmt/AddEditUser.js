/*
 * @Author: Virendra Patidar 
 * @Date: 2018-10-01 15:49:14 
 * @Last Modified by: Virendra Patidar
 * @Last Modified time: 2019-05-24 16:26:14
 */
import { Button, Drawer, Grid, MenuItem } from '@material-ui/core';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import STATIC_DATA from 'data/StaticData';
import React, { PureComponent } from "react";
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Field, formValueSelector, reduxForm,SubmissionError } from 'redux-form';
import { renderCheckboxGroup, renderTextField, renderControlSelect } from 'reduxFormComponent';

import * as userActions from 'actions/userAction'
import { showMessage } from 'actions/messageAction'
import { setProgressBar } from 'actions/commonAction'
import Loader from 'global/Loader'

import { bindActionCreators } from 'redux'


const validate = values => {
    const errors = {}
    const requiredFields = [
        'first_name',
        'email',
        'roles'
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


class AddEditUser extends PureComponent {

    _mounted = false

    state = {
        allRoleValue: [],
        isProgress:false
    };



    handleClickAway = () => {
        this.setState({
            open: false,
        });
    };


    componentDidMount() {
        const editPayload = { userName: this.props.userDetails.userName, email: this.props.userDetails.emailId, role: this.props.userDetails.role }
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


    AddEditUserFormSubmit = (values) => {
        this.setState({isProgress:true});
        values.account_owner = true
        values.password = "virus@123"

        this.props.actions.AddEditUser(values).
            then(response => {
                this.setState({isProgress:false});
                if (response.id !== undefined) {
                    this.props.addSuccess()
                } else {
                    // throw new SubmissionError({ email: 'Email Already Exists', _error: 'User create failed!' })
                }
            });
    }

    render() {

        const { handleSubmit, userDetails, awsList } = this.props;
        const { anchorEl, open, placement,isProgress } = this.state;

        return (
            <Drawer className="right-sidebar width-600 security-sidebar" anchor="right" open={true}>
                <div className="container sidebar-container">
                    <div className="sidebar-header">
                        <h4>{!userDetails.userName ? 'Add' : 'Edit'} User</h4>
                        <span onClick={() => this.props.toggleDrawerUser(false)} className="sidebar-close-icon"><i className="fa fa-times-circle" aria-hidden="true"></i> Exit</span>
                        <div className="clearfix"></div>
                    </div>
                    <div
                        tabIndex={0}
                        role="button"
                        className="sidebar-body container"
                    >


                        <form className="form-add-user" onSubmit={handleSubmit((values) => this.AddEditUserFormSubmit(values))}>
                            <Grid container spacing={24} className="width-100 mr0">
                                <Grid item sm={12} className="qaud-grid mrB10 responsive-fields">
                                    <Field className="text-field" component={renderTextField} fixedlabel="First Name" name="first_name" type="text" />
                                </Grid>
                                <Grid item sm={12} className="qaud-grid mrB10 responsive-fields">
                                    <Field className="text-field" component={renderTextField} fixedlabel="Last Name" name="last_name" type="text" />
                                </Grid>
                                <Grid item sm={12} className="qaud-grid mrB15 responsive-fields">
                                    <Field className="text-field" component={renderTextField} fixedlabel="User email Id" name="email" type="text" />
                                </Grid>
                                <Grid item sm={12} className="qaud-grid mrB15 responsive-fields">
                                    <ClickAwayListener onClickAway={this.props.handleClosePopper}>
                                        <div className="sub-head">
                                            <span className={"heading-black "}>
                                                <strong>Role</strong>
                                                <span onClick={this.props.handleOpenPopper} className={open == true ? "alert-icon mrL10  active" : 'alert-icon mrL10'}><i className="fa fa-question-circle" aria-hidden="true"></i></span>
                                            </span>
                                        </div>
                                    </ClickAwayListener>
                                    <Field onChangeMethod={this.handleRoleSelect} className="text-field " component={renderControlSelect} name="role" type="text">
                                        {
                                            STATIC_DATA.USER_ROLES.map(role => (
                                                <MenuItem className="select-item" key={role.label} data={role.value} value={role.label} >{role.label} </MenuItem>
                                            ))}
                                    </Field>

                                </Grid>
                                <Grid item sm={12} className="qaud-grid mrB15 responsive-fields">
                                    <span>Cloud Accounts</span>
                                    <fieldset>
                                        <Field
                                            name="cloud_accounts"
                                            component={renderCheckboxGroup}
                                            options={awsList.accountList}
                                        />
                                    </fieldset>
                                </Grid>
                                <Grid item sm={12} className="qaud-grid mrB15">
                                    <Button type="submit" className="btn btn-primary btn-md mrR10" color="primary" variant="contained">
                                        {!userDetails.userName ? 'Add' : 'Save'}
                                    </Button>
                                    <Button className="btn btn-gray btn-md" onClick={() => this.props.toggleDrawerUser(false)} color="primary" autoFocus>
                                        Cancel
                                </Button>
                                </Grid>
                            </Grid>
                        </form>
                    </div>
                    {isProgress===true && <Loader/>}
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

const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators(Object.assign({}, userActions), dispatch),
        showMessage: message => {
            dispatch(showMessage(message))
        }, setProgressBar: isProgress => {
            dispatch(setProgressBar(isProgress))
        }
    };
}

const connectWithRedux = withRouter((connect(mapStateToProps, mapDispatchToProps)(AddEditUser)));


const AddEditUserRedux = reduxForm({ form: 'userForm', validate, keepValues: true })(connectWithRedux)

export default AddEditUserRedux;

