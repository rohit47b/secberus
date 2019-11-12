/*
 * @Author: Virendra Patidar 
 * @Date: 2018-11-16 16:15:20 
 * @Last Modified by: Virendra Patidar
 * @Last Modified time: 2018-11-16 16:20:19
 */


import React, { PureComponent } from 'react'

import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import Grid from '@material-ui/core/Grid'
import LinearProgress from '@material-ui/core/LinearProgress'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Button from '@material-ui/core/Button'

import { withRouter } from 'react-router-dom';

import SnackbarMessage from 'global/SnackbarMessage'

import { setReloadFlagSearchBar } from 'actions/uiAction'
import * as securityPolicyActions from 'actions/securityPolicyAction'
import * as integrationActions from 'actions/integrationAction'

import history from 'customHistory';

const messages = ['Validating AWS Credentials', 'Assuming Role Of Security Audit', 'Pulling Metadata', 'Running Cloud Security Assessment', 'Cloud Security Assessment completed']

class PullAssets extends PureComponent {

  _mounted = false

  state = {
    open: true,
    percentComplete: 0,
    status: 'Inprogress',
    variant: 'info',
    message: '', 
    showSnackbarState: false,
    messageContent: messages[0]
  };


  componentDidMount() {
    this._mounted = true
    if (((localStorage.getItem('job_id') === null || localStorage.getItem('job_id') === '' || localStorage.getItem('job_id') === undefined)) && localStorage.getItem('temp_account_id') !== '') {
      this.fetchJobId();
    } else if (localStorage.getItem('temp_account_id') !== '') {
      this.fetchProgressStatus();
    }
  }

  componentWillUnmount() {
    this._mounted = false
  }


  // --------------------- Custom method logic START-----------------
  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  handleCloseMessage = () => {
    this.setState({ showSnackbarState: false });
  };

  fetchMessageContent(percent_completed) {
    if (percent_completed > 0 && percent_completed <= 10) {
      return messages[0]
    } else if (percent_completed > 10 && percent_completed <= 30) {
      return messages[1]
    } else if (percent_completed > 30 && percent_completed <= 70) {
      return messages[2]
    } else if (percent_completed > 70 && percent_completed <= 99) {
      return messages[3]
    } else if (percent_completed > 99) {
      return messages[4]
    }
  }

  // --------------------- Custom method logic END-----------------

  // ---------------------API method START-------------------------
  fetchJobId = () => {
    let payload = {
      account_id: localStorage.getItem('temp_account_id'),
      service: "all"
    }

    this.props.actions.pullAssetsProgress(payload).then(result => {
      if (this._mounted) {
        if (result.success) {
          localStorage.setItem('job_id', result.data.id)
          localStorage.setItem('job_account', localStorage.getItem('temp_account_id'))
          this.fetchProgressStatus();
        } else {
          this.setState({ showSnackbarState: true, message: result, variant: 'error' })
        }
      }
    });
  }


  fetchProgressStatus = () => {
    try {
      let progress = setInterval(async () => {
        let jobPayload = { job_id: localStorage.getItem('job_id') }
        this.props.actions.pullProgress(jobPayload).then(result => {
          if (this._mounted) {
            if (result.success) {
              const content = this.fetchMessageContent(result.data.percent_completed)
              this.setState({ status: result.data.state, percentComplete: result.data.percent_completed, messageContent: content });
              
              if (result.data.state === 'SUCCESS' || result.data.percent_completed === '100') {
                clearInterval(progress);
                localStorage.setItem('job_id', '')
                localStorage.setItem('temp_account_id', '')
                localStorage.setItem('job_account', '')
                const reloadSearchBar = { flag: true }
                this.props.setReloadFlagSearchBar(reloadSearchBar)
                this.props.actions.resetOnbaordForm();
                history.push('/app/dashboard/home')
                window.location.reload()

              } else if (result.data.state === 'FAILURE') {
                this.setState({ showSnackbarState: true, message: 'Pulling failure, click on run button to pull again ', variant: 'error' })
                clearInterval(progress);
                localStorage.setItem('job_id', '')
                localStorage.setItem('job_account', '')
                const reloadSearchBar = { flag: true }
                this.props.setReloadFlagSearchBar(reloadSearchBar)
                this.props.actions.resetOnbaordForm();
                history.push('/app/dashboard/home')
                window.location.reload()
              }
            } else {
              clearInterval(progress);
              if (((localStorage.getItem('job_id') === null || localStorage.getItem('job_id') === '' || localStorage.getItem('job_id') === undefined)) && localStorage.getItem('temp_account_id') !== '') {
                this.fetchJobId();
              } else {
                if (localStorage.getItem('job_account') === null || localStorage.getItem('job_account') === '' || localStorage.getItem('job_account') === undefined || localStorage.getItem('job_account') !== localStorage.getItem('temp_account_id')) {
                  localStorage.setItem('job_id', '')
                  this.fetchJobId();
                }
                this.setState({ showSnackbarState: true, message: 'Pulling failure, click on run button to pull again ', variant: 'error' })
                localStorage.setItem('job_id', '')
                localStorage.setItem('is_new', 'false')
                const reloadSearchBar = { flag: true }
                this.props.setReloadFlagSearchBar(reloadSearchBar)
                this.props.actions.resetOnbaordForm();
                history.push('/app/dashboard/home')
                window.location.reload()
              }
            }
          }
        });
      }, 10000);
    } catch (e) {
      console.log('[Error at fetch Progress Status  of job]---------', e);
    }
  }
  // ---------------------API method END-------------------------


  render() {
    const { status, percentComplete, variant, message, showSnackbarState, open, messageContent } = this.state;
    return (
      <div>
        <Dialog
          open={open}
          // onClose={this.handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          className="modal-stepper modal-security modal-config"
          fullWidth={true}
          maxWidth="sm"
        >
          <DialogContent className="modal-body text-center">
            <Grid container spacing={24}>
              <Grid item xs={12}>
                <div className="config-info">
                  <h3>You are all set !</h3>
                  <p>{messageContent}</p>
                  <div className="progressbar">
                    <div className="title mrB5">Pulling Assets</div>
                    <LinearProgress className="linear-progress" />
                    <div className="time">{percentComplete} % completed ...</div>
                  </div>
                  <div className="config-text mrB15">
                    Policy is scheduled to run after every 30 minutes,You can later change this under setting tab
                  </div>
                </div>
              </Grid>
            </Grid>

            {status === 'FAILURE' && <Button variant="contained" className="btn btn-primary" onClick={this.fetchJobId}>
              Run
              </Button>
            }
          </DialogContent>

          <SnackbarMessage
            open={showSnackbarState}
            message={message}
            variant={variant}
            handleClose={this.handleCloseMessage}
          />
        </Dialog>

      </div>
    );
  }
}


const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(Object.assign({}, securityPolicyActions, integrationActions), dispatch),
    setReloadFlagSearchBar: reloadSearchBar => {
      dispatch(setReloadFlagSearchBar(reloadSearchBar))
    }
  };
}

export default withRouter((connect(null, mapDispatchToProps)(PullAssets)));
