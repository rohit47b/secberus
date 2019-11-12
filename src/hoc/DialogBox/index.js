/*
 * @Author: Virendra Patidar 
 * @Date: 2018-09-26 11:01:27 
 * @Last Modified by: Virendra Patidar
 * @Last Modified time: 2019-05-20 14:12:19
 */

import React from 'react'

import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import Button from '@material-ui/core/Button'
import Loader from 'global/Loader'


const ConfirmDialogBoxHOC = (props) => {
    const { isOpen, handleDialogClose, title, content, successDialogEvent,confirmBtnLabel,cancelBtnLabel,classbtnCancel,classbtnDelete,isProgress } = props
    return (<Dialog
        open={isOpen}
        onClose={handleDialogClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        className="confirm-dialog"
    >
        <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
        <DialogContent>
            <DialogContentText id="alert-dialog-description">
                {content}
            </DialogContentText>
        </DialogContent>
        <DialogActions className="dailog-footer">
            <Button variant="outlined" className={classbtnCancel ? classbtnCancel : 'btn btn-blue-outline'} onClick={handleDialogClose} color="primary">
                {cancelBtnLabel ? cancelBtnLabel : 'No'}
            </Button>
            <Button variant="contained" className={classbtnDelete ? classbtnDelete : 'btn btn-primary'} onClick={successDialogEvent}>
                {confirmBtnLabel ? confirmBtnLabel : 'Yes'}
             </Button>
        </DialogActions>
        {isProgress===true && <Loader/>}
    </Dialog>)
}

export default ConfirmDialogBoxHOC;