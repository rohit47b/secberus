/*
 * @Author: Virendra Patidar 
 * @Date: 2018-09-26 11:01:27 
 * @Last Modified by: Virendra Patidar
 * @Last Modified time: 2019-05-20 14:12:19
 */

import React from 'react'

import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import Grid from '@material-ui/core/Grid'
import CancelIcon from '@material-ui/icons/HighlightOff';


const LogingVerificationDialog = (props) => {
    const { isOpen, handleVerificationDialogClose, verificationError, loginVerificationCode, code, handleSetCode } = props
    return (<Dialog
        open={isOpen}
        onClose={handleVerificationDialogClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        className="login-dialog"
    >
        <DialogContent className="dialog-content">
            <DialogTitle className="dialog-title" id="alert-dialog-title">
                <CancelIcon onClick={handleVerificationDialogClose} className="icon-close" />
            </DialogTitle>
            <Typography component="p" className="fnt-13 mrB15">
                We have sent an email with a verification code to the email with a verification code to the email address associated with the account.
            </Typography>
            <Typography component="p" className="fnt-13 mrB5">
                Please enter the verification code into the form field below
            </Typography>
            <form className="text-center">
                <Grid container spacing={24} className="justify-content-center mrB30">
                    <Grid item xs={12} md={10}>
                        <TextField
                            id="standard-full-width"
                            style={{ margin: 8 }}
                            fullWidth
                            margin="normal"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            className="text-outline"
                            value={code}
                            onChange={handleSetCode}
                        />
                        {verificationError !== '' && <span className="validation-error">{verificationError}</span> }
                    </Grid>
                </Grid>
                <Button onClick={loginVerificationCode} variant="contained" className="btn btn-success mrR10">Sign In</Button>
                <Button variant="outlined" className="btn btn-outline">Send Again</Button>
            </form>

        </DialogContent>

    </Dialog>)
}

export default LogingVerificationDialog;