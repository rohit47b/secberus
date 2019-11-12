/*
 * @Author: Virendra Patidar 
 * @Date: 2018-10-08 13:19:59 
 * @Last Modified by: Virendra Patidar
 * @Last Modified time: 2019-05-24 16:30:07
 */

import { Button, Grid } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from  '@material-ui/core/DialogActions';
import MenuItem from '@material-ui/core/MenuItem';
import * as commonActions from 'actions/commonAction';
import * as dashboardActions from 'actions/dashboardAction';
import * as integrationActions from 'actions/integrationAction';
import * as reportScheduleActions from 'actions/reportScheduleAction';
import * as ruleActions from 'actions/ruleAction';
import STATIC_DATA from 'data/StaticData';
import Loader from 'global/Loader';
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { Field, formValueSelector, reduxForm } from 'redux-form';
import { renderControlSelect } from 'reduxFormComponent';


const validate = values => {
    const errors = {}
    const requiredFields = [
        'role'
    ]
    requiredFields.forEach(field => {
        if (!values[field]) {
            errors[field] = 'This field is required'
        }
    })
    return errors
}



class EditRole extends PureComponent {

    _mounted = false

    state = {
        isProgress: false,
    }

    handleRoleSelect=()=>{
        
    }



    render() {
        const { isProgress } = this.state
        const { handleDialogClose, openDialog } = this.props
        const { handleSubmit } = this.props; 
        return (
            <Dialog
                open={openDialog}
                onClose={handleDialogClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                className="dialog-box dialog-edit"
            >
                <DialogTitle className="dialog-header" id="alert-dialog-title">
                    Edit Role
              </DialogTitle>
                <DialogContent className="modal-body">
                    {isProgress && <Loader />}
                    <form  onSubmit={handleSubmit((values) => handleDialogClose)}>
                        <Grid container spacing={24} className="width-100 mr0">
                            <Grid item sm={12} className="qaud-grid mrB15 pdL0">
                                <Field onChangeMethod={this.handleRoleSelect} className="text-field" component={renderControlSelect} name="role" type="text">
                                    {
                                        STATIC_DATA.USER_ROLES.map(role => (
                                            <MenuItem className="select-item" key={role.label} data={role.value} value={role.label} >{role.label} </MenuItem>
                                        ))}
                                </Field>

                            </Grid>
                            <Grid item sm={12} className="pdL0">
                                <Button type="button" className="btn btn-primary btn-md mrR10" color="primary" onClick={handleDialogClose}  variant="contained">
                                    {'Save'}
                                </Button>
                                <Button className="btn btn-gray btn-md" onClick={handleDialogClose} color="primary" autoFocus>
                                    Cancel
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                </DialogContent>
            </Dialog>

        )
    }
}


const mapStateToProps = (state, ownProps) => {
    const selector = formValueSelector('createReport')
    return {
        name: selector(state, 'name'),
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(Object.assign({}, integrationActions, reportScheduleActions, dashboardActions, commonActions, ruleActions), dispatch),
    };
}


const connectWithRedux = withRouter((connect(mapStateToProps, mapDispatchToProps)(EditRole)));

const CreateReportDialogRedux = reduxForm({ form: 'editRole', validate, keepValues: true })(connectWithRedux)


export default CreateReportDialogRedux;