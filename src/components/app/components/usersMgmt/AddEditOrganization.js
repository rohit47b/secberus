/*
 * @Author: Virendra Patidar 
 * @Date: 2018-10-01 15:49:14 
 * @Last Modified by: Virendra Patidar
 * @Last Modified time: 2019-04-23 16:27:17
 */
import { Button, Drawer, Grid, Paper } from '@material-ui/core';
import React, { PureComponent } from "react";
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Field, formValueSelector, reduxForm } from 'redux-form';
import { renderTextField } from 'reduxFormComponent';
import OrganizationLogo from './OrganizationLogo'


const validate = values => {
    const errors = {}
    const requiredFields = [
        'name',
        'details'
    ]
    requiredFields.forEach(field => {
        if (!values[field]) {
            errors[field] = 'This field is required'
        }
    })
    return errors
}


class AddEditOrganizationComponent extends PureComponent {


    state = {
        openOrganizationLogoDialog: false
    }

    closeOrganizationLogoDialog = () => {
        this.setState({ openOrganizationLogoDialog: false })
    }
    openOrganizationLogoDialog = () => {
        this.setState({ openOrganizationLogoDialog: true })
    }

    componentDidMount() {
        const editPayload = { name: this.props.organizationDetails.name, details: this.props.organizationDetails.details }
        this.props.initialize(editPayload);
    }

    updateOrganizationLogo=()=>{
        console.log(' updateOrganizationLogo ')
    }


    render() {
        const { handleSubmit, organizationDetails } = this.props;
        const {openOrganizationLogoDialog}=this.state
        return (
            <Drawer className="right-sidebar width-600 security-sidebar" anchor="right" open={true}>
                <div className="container sidebar-container">
                    <div className="sidebar-header">
                        <h4>{!organizationDetails.name ? 'Add' : 'Edit'} Organization</h4>
                        <span onClick={() => this.props.closeEditOrganization(false)} className="sidebar-close-icon"><i className="fa fa-times-circle" aria-hidden="true"></i> Exit</span>
                        <div className="clearfix"></div>
                    </div>
                    <div
                        tabIndex={0}
                        role="button"
                        className="sidebar-body container"
                    >


                        <form className="form-add-user" onSubmit={handleSubmit((values) => this.reportFormSubmit(values))}>
                            <Grid container spacing={24} className="width-100 mr0">

                                <Grid item sm={12} className="qaud-grid mrB10">
                                    <div className="add-pic">
                                        <div className="profile-pic text-center mrB10">
                                            <img alt="User Pic" width="200" src={'/assets/images/user.png'} />
                                        </div>
                                        <label htmlFor="flat-button-file">
                                            <Button onClick={this.openOrganizationLogoDialog} className="btn btn-upload" component="span">
                                                Change Logo
                                           </Button>
                                        </label>
                                    </div>
                                </Grid>

                                <Grid item sm={12} className="qaud-grid mrB10">
                                    <Field className="text-field" component={renderTextField} fixedlabel="Name" name="name" type="text" />
                                </Grid>
                                <Grid item sm={12} className="qaud-grid mrB15">
                                    <Field className="text-field" component={renderTextField} fixedlabel="Details" name="details" type="text" />
                                </Grid>

                                <Grid item sm={12} className="qaud-grid mrB15">
                                    <Button type="submit" className="btn btn-primary btn-md mrR10" color="primary" variant="contained">
                                        {!organizationDetails.name ? 'Add' : 'Save'}
                                    </Button>
                                    <Button className="btn btn-gray btn-md" onClick={() => this.props.closeEditOrganization(false)} color="primary" autoFocus>
                                        Cancel
                                </Button>
                                </Grid>
                            </Grid>

                        </form>
                           <OrganizationLogo updateOrganizationLogo={this.updateOrganizationLogo} profilePicUrl={'/assets/images/user.png'} openDialog={openOrganizationLogoDialog} handleDialogClose={this.closeOrganizationLogoDialog} />

                    </div>
                </div>
            </Drawer>
        );
    }
}
const mapStateToProps = (state, ownProps) => {
    const selector = formValueSelector('organizationForm')
    return {
        name: selector(state, 'name'),
        details: selector(state, 'details'),
    }
}

const connectWithRedux = withRouter((connect(mapStateToProps, null)(AddEditOrganizationComponent)));


const AddEditOrganization = reduxForm({ form: 'organizationForm', validate, keepValues: true })(connectWithRedux)

export default AddEditOrganization;

