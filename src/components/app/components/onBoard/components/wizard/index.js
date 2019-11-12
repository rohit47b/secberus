/*
 * @Author: Virendra Patidar 
 * @Date: 2018-07-30 09:39:00 
 * @Last Modified by: Virendra Patidar
 * @Last Modified time: 2018-11-16 16:41:57
 */

import React, { PureComponent } from 'react'

import { withRouter } from 'react-router-dom'

import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import Button from '@material-ui/core/Button'

import { connect } from "react-redux"
import { bindActionCreators } from 'redux'

import Wizard from './Wizard'

import history from 'customHistory'

import * as integrationActions from 'actions/integrationAction'
import { setActiveMenu, setActiveParentMenu } from 'actions/commonAction'

import ConfirmDialogBoxHOC from 'hoc/DialogBox'

class OnBoard extends PureComponent {
  state = {
    open: true,
    openDialog: false,
    openSuccessDialog: false,
    cloudName: ''
  };

  cancelOnBoardProcess = () => {
    this.setState({ openDialog: true })
  }

  handleDialogClose = () => {
    this.setState({ openDialog: false })
  }


  submitCancelRequest = () => {
    this.handleDialogClose()
    this.props.actions.resetOnbaordForm();
    if (this.props.location.state) {
      if (this.props.location.state.backUrl === '/login') {
        localStorage.clear();
      }
      history.push(this.props.location.state.backUrl)
    } else {
      localStorage.clear();
      history.push('/login')
    }

  }

  handleSuccessDialogOpen = (cloud_name) => {
    this.setState({ cloudName:cloud_name, openSuccessDialog: true });
  }

  handleSuccessDialogClose = () => {
    this.props.setActiveParentMenu('')
    this.props.setActiveMenu('Dashboard')
    history.push('/app/dashboard/home')
    window.location.reload()
    this.setState({ openSuccessDialog: false });
  };

  render() {

    const { open, openDialog, openSuccessDialog, cloudName } = this.state
    return (
      <div>
        <Dialog
          open={open}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          className="modal-stepper"
          fullWidth={true}
          maxWidth="sm"
        >

          <div>
            <DialogContent className="modal-processStepper">
              <Wizard cancelOnBoardProcess={this.cancelOnBoardProcess} selectedCloud={this.props.location.state.selectedCloud} handleSuccessDialogOpen={this.handleSuccessDialogOpen}/>
            </DialogContent>
          </div>
        </Dialog>

        <ConfirmDialogBoxHOC
          isOpen={openDialog}
          title={'Confirmation'}
          content={'Are you sure you want to cancel setup new account ?'}
          handleDialogClose={this.handleDialogClose}
          successDialogEvent={this.submitCancelRequest}
        />

        <Dialog
            open={openSuccessDialog}
            onClose={this.handleConfirmDialogClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            className="confirm-dialog delete-dialog"
        >
          <DialogTitle id="alert-dialog-title">Successful</DialogTitle>
          <DialogContent>
              <DialogContentText className="mrB15">
                Cloud Integration successful “{cloudName}”. Please allow our system 2-10 minutes to scan your cloud configuration and perform all enabled security rules. An email  will be sent to you when the Dashboard is ready.
              </DialogContentText>
          </DialogContent>
          <DialogActions className="dailog-footer">
              <Button variant="outlined" className="btn btn-gray" onClick={this.handleSuccessDialogClose} color="primary">
                  Confirm
              </Button> 
          </DialogActions>
        </Dialog>

      </div>
    );
  }
}


function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(Object.assign({}, integrationActions), dispatch),
    setActiveMenu: activeMenu => {
        dispatch(setActiveMenu(activeMenu))
    },
    setActiveParentMenu: activeParentMenu => {
        dispatch(setActiveParentMenu(activeParentMenu))
    }
  };
}

export default withRouter(connect(null, mapDispatchToProps)(OnBoard))