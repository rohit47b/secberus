import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form'
import { withRouter } from 'react-router-dom'
import { bindActionCreators } from 'redux'
import { Grid } from '@material-ui/core'
import Button from '@material-ui/core/Button';
import CancelIcon from '@material-ui/icons/HighlightOff'
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import { renderTextField, renderTextArea } from 'reduxFormComponent'
import { setOpenReportBug } from 'actions/uiAction';
import { showMessage } from 'actions/messageAction'
import * as CommonAction from 'actions/commonAction'



const validate = values => {
  const errors = {}
  const requiredFields = ['actual_result', 'description', 'expected_result', 'steps_reproduce', 'summary_issue', 'url']

  requiredFields.forEach(field => {
    if (!values[field] || values[field] === '') {
      errors[field] = 'This field is required'
    }
  })
  return errors
}

class ReportBugDialog extends React.Component {
  state = {
    openStatusDialog: false
  }

  componentDidMount() {
    this.props.initialize({
      summary_issue: '',
      url: '',
      description: '',
      steps_reproduce: '',
      expected_result: '',
      actual_result: ''
    });
  }

  handleCloseDialog = () => {
    this.props.setOpenReportBug(false)
  }

  handlePostBug = (values) => {
    let profile = JSON.parse(localStorage.getItem('profile'));
    let payload = {
      date_reported: Date.now().toString(),
      summary: values.summary_issue,
      email: profile.email,
      url: values.url,
      description: values.description,
      steps_to_reproduce: values.steps_reproduce,
      expected_results: values.expected_result,
      actual_results: values.actual_result
    }
    /* return this.props.actions.reportBug(payload).
      then(result => {
        if (result && (typeof result !== 'string')) {
            this.props.setOpenReportBug(false)
        }
        else {
            let message = { message: result, showSnackbarState: true, variant: 'error' }
            this.props.showMessage(message)
        }
      }); */

    // this.props.setOpenReportBug(false)
  }

  handleOpenStatusDialog = () => {
    this.setState({ openStatusDialog: true });
  }

  handleCloseStatusDialog = () => {
    this.props.setOpenReportBug(false)
    this.setState({ openStatusDialog: false })
  }

  render() {
    const { isOpen, handleSubmit,invalid, submitting,pristine } = this.props
    const { openStatusDialog } = this.state
    return (
      <Fragment>
        {isOpen === true && <Card className="card-report-bug">
          <div className="card-header">
            <span className="card-report-bug-title">Report Bug</span>
            <CancelIcon style={{ cursor: "pointer" }} onClick={this.handleCloseDialog} />
          </div>
          <CardContent className="card-report-bug-content">
            <form onSubmit={handleSubmit((values) => this.handlePostBug(values))}>
              <Grid container spacing={24} className="pdB30">
                <Grid item sm={12}>
                  <Field className="text-outline" component={renderTextField} name="summary_issue" type="text" fixedlabel="Summary of Issue" placeholder="Brief Summary" />
                </Grid>
                <Grid item sm={12}>
                  <Field className="text-outline" component={renderTextField} name="url" type="text" fixedlabel="Url Where Issue" placeholder="https://" />
                </Grid>
                <Grid item sm={12}>
                  <Field className="text-outline" rows="3" component={renderTextArea} name="description" type="text" fixedlabel="Description of Issue" />
                </Grid>
                <Grid item sm={12}>
                  <Field className="text-outline" rows="3" component={renderTextArea} name="steps_reproduce" type="text" fixedlabel="Steps to Reproduce" />
                </Grid>
                <Grid item sm={12}>
                  <Field className="text-outline" rows="3" component={renderTextArea} name="expected_result" type="text" fixedlabel="Expected Result" />
                </Grid>
                <Grid item sm={12}>
                  <Field className="text-outline" rows="3" component={renderTextArea} name="actual_result" type="text" fixedlabel="Actual Result" />
                </Grid>
              </Grid>
              <Grid container spacing={24}>
                <Grid item sm={12} className="text-center">
                  <Button type="submit" variant="contained" disabled={invalid || submitting || pristine} color="primary" className="btn btn-primary" onClick={this.handleOpenStatusDialog}>
                    SUBMIT BUG
                  </Button>
                </Grid>
              </Grid>
            </form>
          </CardContent>
        </Card>}
        <Dialog
          open={openStatusDialog}
          onClose={this.handleCloseStatusDialog}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          className="confirm-dialog dialog-bug-report"
        >
          <DialogContent className="dialog-bug-report-content">
            <DialogContentText className="mrB30" id="alert-dialog-description">
              Bug Reported, Thank You!
              </DialogContentText>
            <Button variant="outlined" className='btn btn-blue-outline' onClick={this.handleCloseStatusDialog} color="primary">
              Close
              </Button>
          </DialogContent>
        </Dialog>
      </Fragment>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(CommonAction, dispatch),
    setOpenReportBug: open => {
      dispatch(setOpenReportBug(open))
    }, showMessage: message => {
      dispatch(showMessage(message))
    }
  };
}

const connectWithRedux = withRouter((connect(null, mapDispatchToProps)(ReportBugDialog)));
const reportBugReduxForm = reduxForm({ form: 'ReportBugCreate', validate, keepDirtyOnReinitialize: true, destroyOnUnmount: false, forceUnregisterOnUnmount: true, enableReinitialize: true })(connectWithRedux)

export default reportBugReduxForm;