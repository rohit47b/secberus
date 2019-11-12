/*
 * @Author: Virendra Patidar 
 * @Date: 2018-09-26 11:01:27 
 * @Last Modified by: Virendra Patidar
 * @Last Modified time: 2019-05-18 13:05:37
 */

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import React from 'react';

const SuccessMessageDialogHoc = (props) => {
    const { isOpen, handelCloseDialog, content } = props
    return (<Dialog
        open={isOpen}
        onClose={handelCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        className="dialog-box"
    >
        <DialogTitle className="dialog-header" id="alert-dialog-title">
            {content}
        </DialogTitle>
        <DialogActions className="dailog-footer">
            <Button variant="outlined" className={'btn btn-blue-outline'} onClick={handelCloseDialog} color="primary">
                {'Close'}
            </Button>
        </DialogActions>
    </Dialog>)
}

export default SuccessMessageDialogHoc;