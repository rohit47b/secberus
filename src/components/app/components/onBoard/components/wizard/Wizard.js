/*
 * @Author: Virendra Patidar 
 * @Date: 2018-11-16 16:51:21 
 * @Last Modified by: Virendra Patidar
 * @Last Modified time: 2018-11-16 17:10:23
 */
import React, { PureComponent } from 'react'

import Stepper from '@material-ui/core/Stepper'
import Step from '@material-ui/core/Step'
import StepLabel from '@material-ui/core/StepLabel'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'


import Step1 from './Step1'
import Step2 from './Step2'
import Step3 from './Step3'

import SnackbarMessage from 'global/SnackbarMessage'

import history from 'customHistory'

const getSteps =()=> {
  return ['', '', ''];
}

class Wizard extends PureComponent {

  state = {
    activeStep: 0,
    provider: '',
    submitForm: false,
    collaborators: [{ emailId: '' }],
    webServerEnv: { account_name: '', role_arn: '', external_id: '', isValid: false },
    variant: 'info',
    message: '',
    showSnackbarState: false,
  };

  handleNext = (currentStep) => {
    this.setState({
      activeStep: currentStep + 1,
    });
  };

  handleBack = (currentStep) => {
    this.setState({
      activeStep: currentStep - 1,
    });
  };

  handleReset = () => {
    this.setState({
      activeStep: 0
    });
  };

  setWebServerEnv = (webServerEnv) => {
    this.setState({
      webServerEnv
    });
  };

  runPolicy = () => {
    this.resetForm();
    history.push('/app/onboard/runpolicy')
  };

  resetForm = () => {
    // this.props.reset('awscreate');
    // this.props.reset('awsInvite');
  }


  getStepContent = (stepIndex) => {
    const { webServerEnv,collaborators } = this.state
    return (
      <Step2 cancelOnBoardProcess={this.props.cancelOnBoardProcess} setWebServerEnv={this.setWebServerEnv} webServerEnv={webServerEnv} handleNext={this.handleNext} selectedCloud={this.props.selectedCloud} runPolicy={this.runPolicy} handleSuccessDialogOpen={this.props.handleSuccessDialogOpen}/>
    );
  }


  handleClose = () => {
    this.setState({ message: '', showSnackbarState: false })
  }

  cloudProvider = (provider) => {
    this.setState({ provider: provider })
  }

  render() {
    const steps = getSteps();
    const { activeStep, selectedCloud, variant, message, showSnackbarState } = this.state;

    return (
      <div className="stpper-wizard">
        <Stepper activeStep={activeStep} alternativeLabel className="stepper">
          {steps.map((label, index) => {
            return (
              <Step key={label} className={index < activeStep ? 'step-process complete' : activeStep === index ? 'step-process active' : 'step-process in-active'} >
                <StepLabel className='stepper-label'>{label}</StepLabel>
              </Step>
            );
          })}
        </Stepper>
        <div className="stepper-content">
          {activeStep === steps.length ? (
            <div>
              <Typography>
                All steps completed - you&quot;re finished
              </Typography>
              <Button onClick={this.handleReset}>Reset</Button>
            </div>
          ) : (
              <div>
                <div className="stepper-instruction">{this.getStepContent(activeStep)}</div>
              </div>
            )}
        </div>

        <SnackbarMessage
          open={showSnackbarState}
          message={message}
          variant={variant}
          handleClose={this.handleClose}
        />

      </div>
    );
  }
}
export default Wizard;
