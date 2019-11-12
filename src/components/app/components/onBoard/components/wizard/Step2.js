/*
 * @Author: Virendra Patidar 
 * @Date: 2018-11-16 16:43:40 
 * @Last Modified by: Virendra Patidar
 * @Last Modified time: 2019-04-23 16:17:53
 */
import React, { PureComponent } from 'react'

import history from 'customHistory'
import { Field, reduxForm } from 'redux-form'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { withRouter } from 'react-router-dom'

import { Grid } from '@material-ui/core'
import Button from '@material-ui/core/Button'
import Popper from '@material-ui/core/Popper'

import { CopyToClipboard } from 'react-copy-to-clipboard'

import { renderTextField, renderTextFieldWithEndCopyToClipAdornment } from 'reduxFormComponent'

import SnackbarMessage from 'global/SnackbarMessage'
import Loader from 'global/Loader'

import * as integrationAction from 'actions/integrationAction'
import { setActiveMenu, setActiveParentMenu } from 'actions/commonAction'

const validate = values => {
    const errors = {}
    const requiredFields = []

    requiredFields.forEach(field => {
        if (!values[field]) {
            errors[field] = 'This field is required'
        }
    })
    return errors
}

class Step2 extends PureComponent {
    _mounted = false
    state = {
        selectedValue: '',
        message: '',
        showSnackbarState: false,
        webServerEnv: this.props.webServerEnv,
        process: false,
        variant: 'info',
        open: false,
        placement: null,
        anchorEl: null,
        isProgress: false,
        account_id: ''
    }

    componentDidMount() {
        this._mounted = true
        this.props.reset('awscreate');
        if (!this.props.submitSucceeded || !this.props.anyTouched) {
            this.fetchExternalId()
        }
    }

    componentWillUnmount() {
        this._mounted = false
    }


    static getDerivedStateFromProps(nextProps, state) {
        return { webServerEnv: nextProps.webServerEnv }
    }

    // ------------------ Custom method logic START ----------------------    

    handleChange = event => {
        this.setState({ selectedValue: event.target.value });
    };

    handleClose = () => {
        this.setState({ message: '', showSnackbarState: false })
    }

    handleClickPopper = event => {
        const { currentTarget } = event;
        this.setState(state => ({
            anchorEl: currentTarget,
            open: !state.open,
        }));
    };

    handleClosePopper = () => {
        this.setState({
            anchorEl: null,
            open: false
        });
    };

    copiedAccountId = () => {
        this.setState({
            message: 'Copied: Account Id',
            showSnackbarState: true,
            variant: 'info'
        });
    };

    copiedExternalId = () => {
        this.setState({
            message: 'Copied: External Id',
            showSnackbarState: true,
            variant: 'info'
        });
    };

    // ------------------ Custom method logic END ----------------------    

    // ------------------ API method START ----------------------    

    setUpCloudEnv = (values) => {
        let payload = values
        this.props.setWebServerEnv(payload);
        this.setState({ isProgress: true })
        let cloud_data = {
            'cloud': this.props.selectedCloud,
            'name': values['account_name'],
            'enabled': true,
            'credentials': {
                'role_arn': values['role_arn'],
                'external_id': values['external_id']
            }
        } 
        return this.props.actions.integrationCreate(cloud_data).
            then(result => {
                // this.props.handleNext(1);
                if (this._mounted) {
                    if (result.id) {
                        localStorage.setItem('temp_account_id', result.id)
                        //this.props.handleNext(1);
                        this.props.handleSuccessDialogOpen(values['account_name'])
                        //payload.isValid = true;
                        //this.props.setWebServerEnv(payload);
                    } else {
                        localStorage.setItem('temp_account_id', '')
                        payload.isValid = false;
                        this.props.setWebServerEnv(payload);
                        this.setState({ message: 'Invalid ARN, please verify External ID, Account ID and Policy in the role', showSnackbarState: true, variant: 'error' });
                    };
                }
                this.setState({ isProgress: false })
            });
    }


    fetchExternalId() {
        this.props.actions.fetchExternalId().
            then(result => {
                this.setState({account_id:result.aws_account_id})
                this.props.initialize({ external_id: result.external_id, cloud: this.props.selectedCloud });
            });
    }

    fetchCloud() {
        this.props.initialize({ cloud: this.props.selectedCloud });
    }
    // ------------------ API method START ----------------------    


    render() {
        const { handleSubmit, invalid, submitting, pristine, valid, submitSucceeded, selectedCloud } = this.props;
        const isValid = this.props.values == undefined ? false : this.props.values.isValid;
        const { anchorEl, open, variant, message, showSnackbarState, isProgress, account_id } = this.state;
        const alreadyFillForm = (invalid || submitting || pristine);
        const id = open ? null : 'simple-popper';

        return (
            <div>
                {selectedCloud === 'aws' &&
                    <form className="form-qaud step2" onSubmit={handleSubmit((values) => this.setUpCloudEnv(values))} >
                        <Grid container spacing={24}>
                            <Grid item sm={12}>
                                <div className="stepp-head">
                                    <h4 className="mrB10">Cloud Environment</h4>
                                    <p className="mrT0 modal-txt">Please add your account information.</p>
                                </div>
                            </Grid>
                            <Grid item sm={5} className="radio-box">
                                <div className='service-box active'>
                                    <div className="cloud-service">
                                        <img alt="AWS" src="/assets/images/aws.png" />
                                    </div>
                                    <div className="src-title">Amazon Web Services</div>
                                </div>
                            </Grid>
                            <Grid item sm={7} className="form-group">
                                <div className="acc-id mrB10">
                                    Account Id : {account_id}
                                    <CopyToClipboard text={account_id} onCopy={() => this.copiedAccountId()}>
                                        <a title="Copy to Clipboard" href="javascript:void(0)" className="mrL10"><i className="fa fa-copy"></i></a>
                                    </CopyToClipboard>
                                </div>
                                <div className="mrB15">
                                    <Field placeholder="e.g. Production" className="text-outline" component={renderTextField} name="account_name" type="text" fixedlabel="Account" />
                                </div>
                                <div className="mrB15">
                                    <a onClick={this.handleClickPopper} className="help-link" href="javascript:void(0)">Need Help to get ARN ?</a>
                                    <Field className="text-outline" component={renderTextField} name="role_arn" type="text" fixedlabel="Role ARN" />
                                </div>
                                <div className="mrB15">
                                    {/* <Field title="Copy to Clipboard" disabled={true} copiedExternalId={this.copiedExternalId} className="text-outline" component={renderTextFieldWithEndCopyToClipAdornment} name="external_id" type="text" fixedlabel="External Id" /> */}
                                    <Field className="text-outline" component={renderTextField} name="external_id" type="text" fixedlabel="External Id" />
                                </div>
                            </Grid>
                            <div className="footer-btn">

                                {/* invalid || !submitSucceeded */}
                                {!isValid && <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    disabled={invalid || submitting || pristine}
                                    className="btn-blue-next mrR10"
                                >
                                    Validate & Connect
                            </Button>
                                }

                                <Button
                                    variant="contained"
                                    color="primary"
                                    className="btn-blue-next responsive-cancel-integration"
                                    onClick={() => { this.props.cancelOnBoardProcess() }}
                                >
                                    Cancel
                        </Button>

                            </div>
                            {isProgress && <Loader />}
                        </Grid>
                        <SnackbarMessage
                            open={showSnackbarState}
                            message={message}
                            variant={variant}
                            handleClose={this.handleClose}
                        />
                    </form>
                }
                {selectedCloud === 'gcp' &&
                    <form className="form-qaud step2" onSubmit={handleSubmit((values) => this.setUpCloudEnv(values))}>
                        <Grid container spacing={24}>
                            <Grid item sm={12}>
                                <div className="stepp-head">
                                    <h4 className="mrB10">Cloud Environment</h4>
                                    <p className="mrT0 modal-txt">Please add your account information.</p>
                                </div>
                            </Grid>
                            <Grid item sm={5} className="radio-box">
                                <div className='service-box active'>
                                    <div className="cloud-service">
                                        <img alt="Google Cloud Platform" src="/assets/images/google-cloud.png" />
                                    </div>
                                    <div className="src-title">Google Cloud Platform</div>
                                </div>
                            </Grid>
                            <Grid item sm={7} className="form-group">
                                <div className="mrB15">
                                    <Field placeholder="" className="text-outline" component={renderTextField} name="role_email" type="text" fixedlabel="Role Email" />
                                </div>
                                <div className="mrB15">
                                    <Field placeholder="" className="text-outline" component={renderTextField} name="key_id" type="text" fixedlabel="Key Id" />
                                </div>
                            </Grid>
                            <Grid item sm={12} className="form-group">
                                <div className="mrB15">
                                    <Field placeholder="" className="text-outline" component={renderTextField} name="private_key" type="textarea" fixedlabel="Private Key" multiLine={true} rows={50}/>
                                </div>
                            </Grid>
                            <div className="footer-btn">

                                {/* invalid || !submitSucceeded */}
                                {!isValid && <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    disabled={invalid || submitting || pristine}
                                    className="btn-blue-next mrR10"
                                >
                                    Validate & Connect
                            </Button>
                                }

                                <Button
                                    variant="contained"
                                    color="primary"
                                    className="btn-blue-next responsive-cancel-integration"
                                    onClick={() => { this.props.cancelOnBoardProcess() }}
                                >
                                    Cancel
                        </Button>

                            </div>
                            {isProgress && <Loader />}
                        </Grid>
                        <SnackbarMessage
                            open={showSnackbarState}
                            message={message}
                            variant={variant}
                            handleClose={this.handleClose}
                        />
                    </form>
                }
                <Popper
                    placement="right-start"
                    open={open}
                    anchorEl={anchorEl}
                    transition
                    className="popover-help"
                    id={id}
                >
                    <ul className="arn-list">
                        <li><a href="https://aws.amazon.com/console/" target="_blank"> 1. Login to AWS console. </a></li>
                        <li>2. Click on Services & select IAM</li>
                        <li>3. Click on Roles & select Create Role</li>
                        <li>4. Select “Another AWS Account”</li>
                        <li>5. Enter our Account ID, Click on “Require External ID” and enter the external ID</li>
                        <li>6. Select “Security Audit” as a Policy type.</li>
                        <li>7. Copy Role ARN & Complete On-boarding</li>
                    </ul>

                    <a className="close-icon" onClick={this.handleClosePopper} href="javascript:void(0)"><i className="fa fa-times-circle"></i></a>
                </Popper>
            </div>
        );
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators(integrationAction, dispatch), 
        setActiveMenu: activeMenu => {
            dispatch(setActiveMenu(activeMenu))
        },
        setActiveParentMenu: activeParentMenu => {
            dispatch(setActiveParentMenu(activeParentMenu))
        }
    };
}

const mapStateToProps = (state) => {
    return {
        //values: state.form.awscreate.values
    };
}

const connectWithRedux = withRouter((connect(mapStateToProps, mapDispatchToProps)(Step2)));
const integrationCreateReduxForm = reduxForm({ form: 'awscreate', validate, keepDirtyOnReinitialize: true, destroyOnUnmount: false, forceUnregisterOnUnmount: true, enableReinitialize: true })(connectWithRedux)

export default integrationCreateReduxForm;