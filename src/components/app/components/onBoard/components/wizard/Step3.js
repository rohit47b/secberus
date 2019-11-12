/*
 * @Author: Virendra Patidar 
 * @Date: 2018-11-16 16:47:41 
 * @Last Modified by: Virendra Patidar
 * @Last Modified time: 2019-04-23 16:18:26
 */
import React, { Component } from 'react'
import { Grid, Button } from '@material-ui/core'
import { CopyToClipboard } from 'react-copy-to-clipboard'

import { withRouter } from 'react-router-dom'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { Field, reduxForm, FieldArray } from 'redux-form'
import { SubmissionError } from 'redux-form'

import SnackbarMessage from 'global/SnackbarMessage'
import Loader from 'global/Loader'

import { renderTextField, } from 'reduxFormComponent'

import * as integrationAction from 'actions/integrationAction'


const validate = values => {
    const errors = { emails: [] }

    if (values.emails && values.emails.length > 0) {
        values.emails.forEach((email, emailIndex) => {

            if (
                email &&
                !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email)
            ) {
                errors.emails[emailIndex] = 'Invalid email address'
            }
        })
    }
    return errors
}


const renderMembers = ({ fields, meta: { touched, error, submitFailed } }) => (
    <div>
        {(touched || submitFailed) && error && <span>{error}</span>}
        {fields.map((member, index) => {
            return (
                <div key={member + ' ' + index} className="invite-feild">
                    <div className="form-feild">
                        <Field key={'email_' + index} name={member} component={renderTextField} className="text-outline" type="text" />
                    </div>
                    <div className="btn-group">

                        {index === fields.length - 1 && fields.length < 5 && <button className="btn btn-plus" type="button" onClick={() => fields.push()}><i className="fa fa-plus-circle" aria-hidden="true"></i></button>}

                        {index > 0 && <button
                            type="button"
                            title="Remove Member"
                            onClick={() => fields.remove(index)}
                            className="btn btn-minus"
                        ><i className="fa fa-minus-circle" aria-hidden="true"></i>
                        </button>
                        }
                    </div>
                </div>
            )
        })}
    </div>
);


class Step3 extends Component {
    state = {
        emailId: '',
        message: '', showSnackbarState: false, variant: 'error',
        isProgress: false
    }


    handleClose = () => {
        this.setState({ message: '', showSnackbarState: false })
    }

    inviteCollbrator = (values) => {
        let payload = {
            "emails": values.emails
        }
        this.props.initialize({ emails: values.emails });
        this.setState({ isProgress: true })
        return this.props.actions.addCollaborator(payload).then(result => {
            this.setState({ isProgress: false })
            if (result.success) {
                this.setState({ variant: 'success', message: result.message, showSnackbarState: true })
            } else if (result.emails) {
                let customError = { emails: [] };
                if (result.emails instanceof Array) {
                    customError['email_0'] = result.emails[0]
                } else {
                    Object.keys(result.emails).map((key, idx) => {
                        customError.emails[key] = result.emails[key][0]
                    });
                }
                throw new SubmissionError(customError);
            } else  {
                this.setState({ variant: 'error', message: result, showSnackbarState: true })
            }
       
        });
    }

    copiedAccountId = () => {
        this.setState({
            message: 'Copied: Account Id',
            showSnackbarState: true,
            variant: 'info'
        });
    };


    componentDidMount() {
        if (this.props.emailIds === undefined || this.props.emailIds.emails === undefined) {
            this.props.initialize({ emails: [''] });
        }
    }

    render() {
        const { message, showSnackbarState, variant, isProgress } = this.state;
        const { handleSubmit } = this.props;
        return (
            <Grid container spacing={24}>
                <Grid item sm={12}>
                    <div className="stepp-head pdB0">
                        <h4 className="mrB10 mrT0">Invite your team</h4>
                        <p className="mrT0 modal-txt mrB0">Invite collaborator to assigns task and help you get complaint</p>
                    </div>
                </Grid>
                <Grid item sm={4} className="radio-box">
                    <div className='service-box active'>
                        <div className="cloud-service">
                            <img alt="AWS" src="/assets/images/aws.png" />
                        </div>
                        <div className="src-title">Amazon Web Service</div>
                    </div>
                </Grid>

                <Grid item sm={8} className="form-group">
                    <div className="acc-id mrB5">Account Id : {localStorage.getItem('account_id')}
                        <CopyToClipboard text={localStorage.getItem('account_id')} onCopy={() => this.copiedAccountId()}>
                            <a title="Copy to Clipboard" href="javascript:void(0)" className="mrL10"><i className="fa fa-copy"></i></a>
                        </CopyToClipboard>
                    </div>
                    <div className="mrB15 field-group">

                        <form onSubmit={handleSubmit((values) => this.inviteCollbrator(values))}>
                            <FieldArray component={renderMembers} name='emails' />
                            <Button type="submit" variant="outlined" className="btn-back">
                                Invite
                                </Button>
                        </form>
                    </div>

                    <div className="footer-btn">
                        <Button onClick={() => this.props.handleBack(2)} className="btn-back" >
                            Back
                        </Button>
                        <Button
                            type="button"
                            variant="contained"
                            color="primary"
                            onClick={() => this.props.runPolicy()}
                            className="btn-blue-next mrR10 mrL10"
                            disabled={localStorage.getItem('temp_account_id') === ''}
                        >
                            Save & Run policy
                           </Button>

                        <Button
                                variant="contained"
                                color="primary"
                                className="btn-blue-next"
                                onClick={() => { this.props.cancelOnBoardProcess() }}
                            >
                                Cancel
                       </Button>
                    </div>
                </Grid>
                <SnackbarMessage
                    open={showSnackbarState}
                    message={message}
                    variant={variant}
                    handleClose={this.handleClose}
                />
                {isProgress && <Loader />}
            </Grid>
        );
    }
}

const mapDispatchToProps =(dispatch)=> {
    return {
        actions: bindActionCreators(integrationAction, dispatch)
    };
}

const mapStateToProps = (state) => {
    return {
        emailIds: state.form.awsInvite ? state.form.awsInvite.values : undefined
    };
}


const connectWithRedux = withRouter((connect(mapStateToProps, mapDispatchToProps)(Step3)));
const awsInviteReduxForm = reduxForm({ form: 'awsInvite', validate,keepDirtyOnReinitialize: true, destroyOnUnmount: false,forceUnregisterOnUnmount: true,enableReinitialize: true})(connectWithRedux)

export default awsInviteReduxForm;