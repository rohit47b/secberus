/*
 * @Author: Virendra Patidar 
 * @Date: 2018-11-16 13:21:10 
 * @Last Modified by:   Virendra Patidar 
 * @Last Modified time: 2018-11-16 13:21:10 
 */
import React, { PureComponent } from 'react'

import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'

import { Field, reduxForm, reset } from 'redux-form'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'

import AdminUserList from 'global/AdminUserList'

import ErrorBoundary from 'global/ErrorBoundary'

import { renderTextField} from 'reduxFormComponent'


const validate = values => {
    const errors = {}
    const requiredFields = [
        'name',
        'emailId',
        'password'
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


class AdminUser extends PureComponent {

    state = {
        selectedUserType: '',
        search: '',
        openAddUser: false,
    };

    updateUserType = (selectedUserType, userCount) => {
        this.setState({ selectedUserType, userCount })
    }

    searchHandler = name => event => {
        this.setState({ search: event.target.value })
    }

    handleOpenAddUser = () => {
        this.setState({ openAddUser: true });
    };

    handleCloseAddUser = () => {
        this.setState({ openAddUser: false });
    };


    render() {
        const { openAddUser } = this.state;
        return (
            <div className="page-wrapper page-content">
                <Grid container spacing={24}>
                    <Grid item sm={6}>
                        <h3 className="mr0 main-heading">Admin Users</h3>
                    </Grid>
                    <Grid item sm={6} className="text-right">
                        <Button
                            className="btn-primary"
                            variant="contained"
                            color="primary"
                            onClick={this.handleOpenAddUser}
                        >
                            Create user
                        </Button>
                    </Grid>
                </Grid>
                <Grid container spacing={24} className="grid-container">
                    <Grid item sm={12}>
                        <ErrorBoundary error="error-boundary">
                            <AdminUserList />
                        </ErrorBoundary>
                    </Grid>
                </Grid>
                {/* Dialog Box for Add  User */}

                <Dialog
                    open={openAddUser}
                    onClose={this.handleCloseAddUser}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                    className="modal-add network-modal modal-report"
                >
                    <DialogTitle className="modal-title">Create User</DialogTitle>
                        <DialogContent className="modal-body">
                            <form>
                                <Grid item sm={12} className="qaud-grid mrB10">
                                    <Field className="text-field" component={renderTextField} controllabel="Name" name="name" type="text" />
                                </Grid>
                                <Grid item sm={12} className="qaud-grid mrB15">
                                    <Field className="text-field" component={renderTextField} controllabel="Email Id" name="emailId" type="email" />
                                </Grid>
                                <Grid item sm={12} className="qaud-grid mrB15">
                                    <Field className="text-field" component={renderTextField} controllabel="Password" name="password" type="password" />
                                </Grid>
                                <Button type="submit" className="btn btn-primary btn-md mrR10" color="primary" variant="contained">
                                    Create
                                </Button>
                                <Button className="btn btn-gray btn-md" onClick={this.handleCloseAddUser} color="primary" autoFocus>
                                    Cancel
                                </Button>
                            </form>
                        </DialogContent>
                </Dialog>
            </div>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return {
        //actions: bindActionCreators(Object.assign({}, integrationActions, reportScheduleActions, dashboardActions), dispatch),
        showMessage: message => {
            dispatch(showMessage(message))
        }, setProgressBar: isProgress => {
            dispatch(setProgressBar(isProgress))
        }
    };
}

const connectWithRedux = withRouter((connect(null, mapDispatchToProps)(AdminUser)));
const createAdminUser = reduxForm({ form: 'createUser', validate, destroyOnUnmount: false, noOverwite: true })(connectWithRedux)

export default createAdminUser; 
