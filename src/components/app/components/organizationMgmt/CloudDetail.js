/*
 * @Author: Virendra Patidar 
 * @Date: 2018-10-01 15:49:14 
 * @Last Modified by: Virendra Patidar
 * @Last Modified time: 2019-04-04 17:16:13
 */
import { Button, Drawer, Grid, ListItemText, MenuItem } from '@material-ui/core';
import STATIC_DATA from 'data/StaticData';
import React, { PureComponent } from "react";
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Field, formValueSelector, reduxForm } from 'redux-form';
import { renderControlMultiSelect, renderTextField } from 'reduxFormComponent';


const Organizations = [
    'Organization 1',
    'Organization 2',
    'Organization 3'
];


const validate = values => {
    const errors = {}
    const requiredFields = [
        'description',
        'users',
        'organizations'
    ]
    requiredFields.forEach(field => {
        if (!values[field]) {
            errors[field] = 'This field is required'
        }
    })
    return errors
}


class CloudDetail extends PureComponent {

    _mounted = false

    state = {
        selectedRoles:[],
        allRoleValue:[],
    };

    componentDidMount() {
        const editPayload = { users: "Watson, Virendra, Sumit", description: '',organizations:[Organizations[Math.floor(Math.random() * 3)]] }
        this.props.initialize(editPayload);
    }


    handleStatusSelect = (event) => {
        //First time click on select all
        if (event.target.value.indexOf('-1') > -1) {
            this.props.initialize({ roles: this.state.allRoleValue, userName: this.props.userName, emailId: this.props.emailId })
        }
    }


    render() {
        const { handleSubmit,cloudName } = this.props;
        return (
            <Drawer className="right-sidebar width-600 security-sidebar" anchor="right" open={true}>
                <div className="container sidebar-container">
                    <div className="sidebar-header">
                        <h4>{cloudName}</h4>
                        <span onClick={() => this.props.closeCloudDetailPopUp(false)} className="sidebar-close-icon"><i className="fa fa-times-circle" aria-hidden="true"></i> Exit</span>
                        <div className="clearfix"></div>
                    </div>
                    <div
                        tabIndex={0}
                        role="button"
                        className="sidebar-body container"
                    >
                        <form className="form-add-user"  onSubmit={handleSubmit((values) => this.reportFormSubmit(values))}>
                            <Grid container spacing={24} className="width-100 mr0">
                                <Grid item sm={12} className="qaud-grid mrB10">
                                    <Field className="text-field" component={renderTextField} fixedlabel="Description" name="description" type="text" />
                                </Grid>
                              
                                <Grid item sm={12} className="qaud-grid mrB15">
                                    <Field
                                        onChangeMethod={this.handleStatusSelect}
                                        format={value => Array.isArray(value) ? value : []}
                                        className="text-field" 
                                        component={renderControlMultiSelect} 
                                        name="organizations" 
                                        type="text" 
                                        label="Organizations">
                                        <MenuItem className="select-item" value={'-1'} data={'-1'}>
                                            Select All
                                        </MenuItem>
                                        {
                                            Organizations.map(org => (
                                                <MenuItem className="select-item" key={org} data={org} value={org} >
                                                <ListItemText primary={org} />
                                            </MenuItem>
                                            ))}

                                    </Field>
                                </Grid>
                                
                                <Grid item sm={12} className="qaud-grid mrB10">
                                    <Field className="text-field" component={renderTextField} fixedlabel="Users" name="users" type="text" />
                                </Grid>
                                
                                <Grid item sm={12} className="qaud-grid mrB15">
                                <Button type="submit" className="btn btn-primary btn-md mrR10" color="primary" variant="contained">
                                    {'Save'}
                                </Button>
                                <Button className="btn btn-gray btn-md" onClick={() => this.props.closeCloudDetailPopUp(false)} color="primary" autoFocus>
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
    const selector = formValueSelector('cloudForm')
    return {
        description: selector(state, 'description'),
    }
}

const connectWithRedux = withRouter((connect(mapStateToProps, null)(CloudDetail)));


const CloudDetailRedux = reduxForm({ form: 'cloudForm', validate, keepValues: true })(connectWithRedux)

export default CloudDetailRedux;
