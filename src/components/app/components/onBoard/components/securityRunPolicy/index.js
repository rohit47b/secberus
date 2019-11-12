/*
 * @Author: Virendra Patidar 
 * @Date: 2018-11-16 16:25:28 
 * @Last Modified by: Virendra Patidar
 * @Last Modified time: 2018-11-16 16:39:46
 */


import React, { PureComponent } from 'react'

import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import Tooltip from '@material-ui/core/Tooltip'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import SnackbarMessage from 'global/SnackbarMessage'
import Loader from 'global/Loader'

import PolicyRunRuleList from './PolicyRunRuleList'

import * as securityPolicyActions from 'actions/securityPolicyAction'
import * as schedulerSettingActions from 'actions/schedulerSettingAction'

import history from 'customHistory'

class RunPolicy extends PureComponent {

  _mounted = false

  state = {
    open: true,
    openRule: false,
    disableServices: [],
    variant: 'info',
    message: '',
    showSnackbarState: false,
    cisCount: 0,
    bestPractices: 0,
    custom: 0,
    isProgress: false
  };


  componentDidMount() {
    this._mounted = true
    this.fetchPolicyWizardCount()
  }

  componentWillUnmount() {
    this._mounted = false
  }


  // ---------------- Custom method logic START ------------------------
  handleClose = () => {
    this.setState({ open: false });
  };


  handleCloseMessage = () => {
    this.setState({ showSnackbarState: false });
  };

  onClickEvent = () => {
    console.log(' Call')
  }


  toggleRules = () => {
    this.setState(prevState => ({
      openRule: !prevState.openRule
    }));
  }


  updateDisableServices = (services) => {
    this.setState({ disableServices: services })
  }

  // ---------------- Custom method logic END ------------------------

  // ---------------- API method logic START ------------------------

  runPolicy = () => {
    let payload = {
      services: this.state.disableServices,
      account_id: localStorage.getItem('temp_account_id')
    }
    this.setState({ isProgress: true })
    this.props.actions.defaultPolicyRun(payload).then(result => {
      if (this._mounted) {
        if (result.success) {
          let payload = {
            services: this.state.disableServices,
            account_id: localStorage.getItem('temp_account_id'),
            security_policy: result.data['securityPolicyId']
          }
          this.props.actions.createScheduleRun(payload)
          history.push({
            pathname: '/app/onboard/pullassets'
          })
        } else {
          this.setState({ variant: 'error', message: result, showSnackbarState: true })
        }
      }
      this.setState({ isProgress: false })
    });
  }

  skipPolicy = () => {
    this.props.actions.skipPolicyRun().then(result => {
      if (result.success) {
        history.push({
          pathname: '/app/dashboard/home'
        })
      } else {
        this.setState({ variant: 'error', message: result, showSnackbarState: true })
      }
    });
  }


  fetchPolicyWizardCount = () => {
    this.props.actions.fetchPolicyWizardCount().then(result => {
      if (result.success) {
        result.data.map((item, index) => {
          if (item.standards === 'bp') {
            this.setState({ bestPractices: item.service })
          } else if (item.standards === 'cis') {
            this.setState({ cisCount: item.service })
          }
        })
      } else {

      }
    });
  }
  // ---------------- API method logic END ------------------------

  render() {
    const { openRule, disableServices, variant, message, showSnackbarState, cisCount, open, isProgress, bestPractices, custom } = this.state;
    return (
      <div>
        <Dialog
          open={open}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          className="modal-stepper modal-security"
          fullWidth={true}
          maxWidth="sm"
        >
          <DialogContent className="modal-body">
            <div className="text-center">
              <h3>
                Security Policy
                  <Tooltip
                  id="tooltip"
                  placement="right"
                  title={
                    <React.Fragment>
                      This run will not affect the configuration or will make any changes
                    </React.Fragment>
                  }
                >
                  <i className="fa fa-info-circle mrL10"></i>
                </Tooltip>
              </h3>
            </div>
            <Card className="card-popup">
              <CardContent className="card-body">
                <Grid container spacing={24}>
                  <Grid item sm={4}>
                    <div className="sec-policy">
                      <span className="num mrR10">{cisCount}</span>
                      <span className="policy-name">
                        CIS<br />
                        benchmarks
                        </span>
                      <div className="clearfix"></div>
                    </div>
                  </Grid>
                  <Grid item sm={4}>
                    <div className="sec-policy">
                      <span className="num mrR10">{bestPractices}</span>
                      <span className="policy-name">
                        Best<br />
                        practices
                        </span>
                      <div className="clearfix"></div>
                    </div>
                  </Grid>
                  <Grid item sm={4}>
                    <div className="sec-policy">
                      <span className="num mrR10">{custom}</span>
                      <span className="policy-name">
                        Customs
                        </span>
                      <div className="clearfix"></div>
                    </div>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
            <div className="text-right">
              <a className="fnt-13" href="javascript:void(0)" onClick={this.toggleRules}>
                View Details
              </a>
            </div>
            <Grid item sm={12}>
              <PolicyRunRuleList openRule={openRule} updateDisableServices={this.updateDisableServices} disableServices={disableServices} onClickEvent={() => this.onClickEvent} />
            </Grid>
            <div className="modal-bottom">
              <Button href="javascript:void(0)" className="btn btn-link mrR40" onClick={this.skipPolicy}>
                Skip & continue with Application
              </Button>
              <Button variant="contained" className="btn btn-run" onClick={this.runPolicy}>
                Run
              </Button>
            </div>
          </DialogContent>

          <SnackbarMessage
            open={showSnackbarState}
            message={message}
            variant={variant}
            handleClose={this.handleCloseMessage}
          />
          {isProgress && <Loader />}
        </Dialog>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(Object.assign({}, securityPolicyActions, schedulerSettingActions), dispatch)
  };
}

export default withRouter((connect(null, mapDispatchToProps)(RunPolicy)));
