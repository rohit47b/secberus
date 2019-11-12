import React, { PureComponent } from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';

import { Field, reduxForm } from 'redux-form'

import history from 'customHistory';

import { renderTextField, renderSelectField } from 'reduxFormComponent'

import { setActiveMenu } from 'actions/commonAction'

class CreateRule extends PureComponent {
    state = {
        checkedA: false,
        checkedB: false,
        s3Bucket: 1,
        equal: 1,
        aes: 1,
        plus:1,
        be2546:1
    }

    componentDidMount() {
        const { equal, s3Bucket, aes,be2546,plus } = this.state
        this.props.reset();
        this.props.initialize({ s3Bucket: s3Bucket, equal: equal, aes: aes,be2546:be2546,plus:plus });
    }

    handleCheckboxChange = name => event => {
        this.setState({ [name]: event.target.checked });
    };

    redirectToPage = (menu, url) => {
        this.props.setActiveMenu(menu)
        this.setState({ activeMenu: menu }, () => {
            history.push(url)
        });
    }

    render() {
        const { handleSubmit } = this.props;
        const { checkedA, checkedB, repeatDelay } = this.state
        return (
            <div>
                <Grid container spacing={24} className="bdr-b-1 mrB15">
                    <Grid item sm={9}>
                        <h5 className="mr0 main-heading">Create Rule</h5>
                    </Grid>
                    <Grid item sm={3} className="text-right">
                        <Button onClick={() => history.push('/app/security-rule/create-policies')} variant="contained" className="btn btn-primary btn-md mrR10">
                            Save
                        </Button>
                        <Button onClick={this.props.history.goBack} variant="contained" className="btn btn-gray btn-md">
                            Cancel
                        </Button>
                    </Grid>
                </Grid>
                <Grid container spacing={24}>
                    <Grid item sm={2}>
                        <div className="left-rule">
                            <h5>Select Service</h5>
                            <div className="mrB10">
                                <span className="float-left service-icon">
                                    <img alt="Amazon Web Service" src="/assets/images/aws.png" />
                                </span>
                                <span className="src-name float-left pdL5">Amazon <br />Web Service</span>
                                <div className="clearfix"></div>
                            </div>
                            <Button variant="contained" className=" btn btn-src mrB10">
                                <span className="sr-icon">
                                    <img alt="EC2" src="/assets/service-icon/EC2.png" />
                                </span>
                                <span className="sr-name">EC2 (52)</span>
                            </Button>
                        </div>
                    </Grid>
                    <Grid item sm={7}>
                        <Card className="card-wizard card-add mrB15">
                            <Typography component="div" className="card-header">
                                <span className="float-left">Add Details</span>
                                <a className="float-right" href="javascript:void(0)">
                                    <i className="fa fa-edit"></i>
                                </a>
                                <div className="clearfix"></div>
                            </Typography>
                            <CardContent>
                                <form onSubmit={handleSubmit((values) => this.editSchedulerSubmit(values))}>
                                    <Grid container spacing={24} className="mrB15">
                                        <Grid item sm={3}>
                                            <Field className="text-field" component={renderTextField} name="rule" type="text" label="Rule Name" />
                                        </Grid>
                                        <Grid item sm={9}>
                                            <Field className="text-field" component={renderTextField} name="desc" type="text" label="Add Description" />
                                        </Grid>
                                    </Grid>
                                    <div className="bg-gray">
                                        <Grid container spacing={24}>
                                            <Grid item sm={4}>
                                                <Field className="text-field select-field" component={renderSelectField} name="s3Bucket" type="text" label="S3 Bucket">
                                                    <MenuItem value={1}>S3 Bucket Encryption</MenuItem>
                                                </Field>
                                            </Grid>
                                            <Grid item sm={4}>
                                                <Field className="text-field select-field" component={renderSelectField} name="equal" type="text" label="Equals">
                                                    <MenuItem value={1}>Equals</MenuItem>
                                                </Field>
                                            </Grid>
                                            <Grid item sm={4}>
                                                <Field className="text-field select-field" component={renderSelectField} name="aes" type="text" label="AES256">
                                                    <MenuItem value={1}>AES256</MenuItem>
                                                </Field>
                                            </Grid>
                                        </Grid>
                                    </div>
                                    <div className="log-divider">
                                        <span>And</span>
                                    </div>
                                    <div className="bg-gray">
                                        <Grid container spacing={24}>
                                            <Grid item sm={4}>
                                                <Field className="text-field select-field" component={renderSelectField} name="s3Bucket" type="text" label="S3 Bucket">
                                                    <MenuItem value={1}>S3 Bucket Encryption</MenuItem>
                                                </Field>
                                            </Grid>
                                            <Grid item sm={4}>
                                                <Field className="text-field select-field" component={renderSelectField} name="plus" type="text" label="Plus">
                                                    <MenuItem value={1}>Plus</MenuItem>
                                                </Field>
                                            </Grid>
                                            <Grid item sm={4}>
                                                <Field className="text-field select-field" component={renderSelectField} name="be2546" type="text" label="BE2546">
                                                    <MenuItem value={1}>BE2546</MenuItem>
                                                </Field>
                                            </Grid>
                                        </Grid>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>

                         <Card className="card-wizard card-add mrB15">
                            <Typography component="div" className="card-header">
                                <span> Summary</span>
                            </Typography>
                            <CardContent className="card-body">
                                <div className="light-text mrB5">RULE NAME</div>
                                <h4 className="mrT0 mrB5">ScaEC2</h4>
                                <div className="light-text mrB5">RULE DESCRIPTION</div>
                                <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. 
                                    It has survived not only five centurie.</p>
                                    <div className="light-text mrB5">ACTION</div>
                                    <p className="mr0">S3 Bucket Encryption equals AES256</p>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item sm={3}>
                         <Card className="card-black">
                            <Typography component="div" className="card-header">
                                <span> Preview</span>
                            </Typography>
                            <CardContent className="card-body">
                               
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </div>
        );
    }
}

export default reduxForm({
    form: 'createRule',
    destroyOnUnmount: false,
})(CreateRule);

