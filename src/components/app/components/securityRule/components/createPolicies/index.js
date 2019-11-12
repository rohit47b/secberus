import React, { PureComponent } from 'react';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { Field, reduxForm } from 'redux-form'
import Checkbox from '@material-ui/core/Checkbox';

import history from 'customHistory';

import { renderTextField, renderSelectField } from 'reduxFormComponent'

import SearchField from 'global/SearchField'

class CreatePolicies extends PureComponent {
    state = {
        checkedA: false,
        checkedB: false
    }

    componentDidMount() {
        this.props.reset();
    }

    handleCheckboxChange = name => event => {
        this.setState({ [name]: event.target.checked });
    };


    handleChange = () => {
        console.log('  search');
    }

    render() {
        const { handleSubmit } = this.props;
        const { checkedA, checkedB } = this.state
        return (
            <div>
                <Grid container spacing={24}>
                    <Grid item sm={9}>
                        <h5 className="mr0 main-heading">Create Policy</h5>
                    </Grid>
                    <Grid item sm={3} className="text-right">
                        <Button onClick={() => history.push('app/policies/managment')} variant="contained" className="btn btn-primary btn-md mrR10">
                            Save
                        </Button>
                        <Button variant="contained" className="btn btn-gray btn-md">
                            Cancel
                        </Button>
                    </Grid>
                </Grid>
                <Grid container spacing={24}>
                    <Grid item sm={12}>
                        <Card className="card-wizard mrB25">
                            <CardContent>
                                <form className="add-user" onSubmit={handleSubmit((values) => this.showResults(values))}>
                                    <Grid container spacing={24}>
                                        <Grid item sm={3}>
                                            <Field className="text-field" component={renderTextField} name="pname" type="text" label="Enter Policy Name" />
                                        </Grid>
                                        <Grid item sm={9}>
                                            <Field className="text-field" component={renderTextField} name="pdesc" type="text" label="Policy Description" />
                                        </Grid>
                                    </Grid>
                                </form>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                <Grid container spacing={24}>
                    <Grid item sm={2}>
                        <h5 className="mrT0">Filter by Resources</h5>
                    </Grid>
                    <Grid item sm={10}>
                        <Grid container spacing={24}>
                            <Grid item sm={6}>
                                <h5 className="mr0">Rules Available</h5>
                            </Grid>
                            <Grid item sm={6} className="text-right">
                                <span className="fnt-12 mrR10">Selected Rules:00</span>
                                <Button onClick={() => history.push('app/policies/create-rule')} variant="outlined" className="btn btn-blue-outline">
                                    Create Rule
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid container spacing={24}>
                    <Grid item sm={2} className="pdT0">
                        <SearchField handleChange={this.handleChange} />
                        <div className="mrT10">
                            <div
                                className="btn-icon mrB10 btn-checkbox btn-bg-white"
                            >
                                <span className="icon-text">
                                    <Checkbox
                                        checked={checkedA}
                                        onChange={this.handleCheckboxChange('checkedA')}
                                        value="checkedA"
                                        color="primary"
                                        className="checkbox-select"
                                    />
                                </span>
                                <span className="bar-icon">
                                    <img  alt="EC2" src="/assets/images/icon1.png" /> EC2 (52)
                                    </span>
                            </div>
                        </div>
                    </Grid>
                    <Grid item sm={10} className="pdT0">
                        <Card className="card-wizard card-rule mrB15">
                            <CardContent className="card-body">
                                <div className="card-media">
                                    <span className="float-left">
                                        <Checkbox
                                            checked={checkedB}
                                            onChange={this.handleCheckboxChange('checkedB')}
                                            value="checkedB"
                                            color="primary"
                                            className="checkbox-select"
                                        />
                                    </span>
                                    <div className="media-body">
                                        <div>
                                            <span className="fnt-12">#18155</span>
                                            <span className="icon-action">
                                                <a href="javascript:void(0)">
                                                    <i className="fa fa-pencil-square-o"></i>
                                                </a>
                                                <a href="javascript:void(0)">
                                                    <i className="fa fa-clone"></i>
                                                </a>
                                                <a href="javascript:void(0)">
                                                    <i className="fa fa-trash-o"></i>
                                                </a>
                                            </span>
                                        </div>
                                        <div className="media-desc">
                                            <h4 className="mr0 float-left">ScanEc2</h4>
                                            <div className="service-name float-left mrL10">
                                                <span className="sr-icon">
                                                    <img alt="EC2" src="/assets/service-icon/EC2.png" />
                                                </span>
                                                <span className="sr-name">EC2</span>
                                            </div>
                                            <div className="clearfix"></div>
                                            <div className="mrB10 light-text mrT15">RULE DESCRIPTION</div>
                                            <p className="mr0">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
                                                            It has survived not only five centuries, but also the leap into electronic typesetting</p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                            <CardActions className="card-footer">
                                <div className="light-text mrB5">Action</div>
                                <p className="mr0">S3 Bucket Encrption equals AES256</p>
                            </CardActions>
                        </Card>
                    </Grid>
                </Grid>
            </div>
        );
    }
}

export default reduxForm({
    form: 'createPolicies',
    destroyOnUnmount: false,
})(CreatePolicies);

