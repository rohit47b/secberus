/*
 * @Author: Virendra Patidar 
 * @Date: 2019-04-19 11:00:22 
 * @Last Modified by: Virendra Patidar
 * @Last Modified time: 2019-04-29 16:49:05
 */

import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import React from 'react';


export const RoleBasedPrivileges = (props) => {
    const { open, handleClosePopper } = props

    const privileges = [
        { desc: 'user who views reports', is_super_admin_allow: true, is_admin_allow: true, is_manager_allow: true, is_report_recipient_allow: true },
        { desc: 'user who up-weights assets /rules', is_super_admin_allow: true, is_admin_allow: true, is_manager_allow: true, is_report_recipient_allow: false },
        { desc: 'user who shares/ distributes reports', is_super_admin_allow: true, is_admin_allow: true, is_manager_allow: true, is_report_recipient_allow: false },
        { desc: 'user who conducts investigations', is_super_admin_allow: true, is_admin_allow: true, is_manager_allow: true, is_report_recipient_allow: false },
        { desc: 'user who creates integrations (ie.: slack)', is_super_admin_allow: true, is_admin_allow: true, is_manager_allow: true, is_report_recipient_allow: false },
        { desc: 'user who creates/ monitors remediation plans', is_super_admin_allow: true, is_admin_allow: true, is_manager_allow: true, is_report_recipient_allow: false },
        { desc: 'user who creates policies', is_super_admin_allow: true, is_admin_allow: true, is_manager_allow: true, is_report_recipient_allow: false },
        { desc: 'user who creates rules', is_super_admin_allow: true, is_admin_allow: true, is_manager_allow: true, is_report_recipient_allow: false },
        { desc: 'user who suppresses alerts/ rules/ policies', is_super_admin_allow: true, is_admin_allow: true, is_manager_allow: true, is_report_recipient_allow: false },
        { desc: 'user who creates custom reports', is_super_admin_allow: true, is_admin_allow: true, is_manager_allow: true, is_report_recipient_allow: false },
        { desc: 'user who adds/ removes Report Recipients', is_super_admin_allow: true, is_admin_allow: true, is_manager_allow: true, is_report_recipient_allow: false },
        { desc: 'user who removes clouds', is_super_admin_allow: true, is_admin_allow: true, is_manager_allow: false, is_report_recipient_allow: false },
        { desc: 'user who adds clouds', is_super_admin_allow: true, is_admin_allow: true, is_manager_allow: false, is_report_recipient_allow: false },
        { desc: 'user who adds/ removes Managers', is_super_admin_allow: true, is_admin_allow: true, is_manager_allow: false, is_report_recipient_allow: false },
        { desc: 'user who adds/ removes Admins', is_super_admin_allow: true, is_admin_allow: false, is_manager_allow: false, is_report_recipient_allow: false },
        { desc: 'user who adds/ removes Super Admins', is_super_admin_allow: true, is_admin_allow: false, is_manager_allow: false, is_report_recipient_allow: false },
        { desc: 'user who controls billing', is_super_admin_allow: true, is_admin_allow: false, is_manager_allow: false, is_report_recipient_allow: false },
    ]
    
    return (
        <Dialog
            open={open}
            // onRequestClose={handleClosePopper}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            fullWidth={true}
            disableBackdropClick={false}
            disableEscapeKeyDown

            className="alert-dialog-container"
        >
            <DialogTitle id="alert-dialog-title" className="text-center pdT12 pdB12"><strong>{"Role-Based User Access Privileges"}</strong> <span onClick={props.handleClosePopper} className="float-right" style={{cursor: "pointer"}}> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg></span></DialogTitle>
            <DialogContent className="pd0">
                <Table className="table-role">
                    <TableHead className="alert-table-head">
                        <TableRow>
                            <TableCell className="text-center fnt-16 text-black">Privileges</TableCell>
                            <TableCell className="text-center fnt-16 text-black" align="center">Super Admin</TableCell>
                            <TableCell className="text-center fnt-16 text-black" align="center">Admin</TableCell>
                            <TableCell className="text-center fnt-16 text-black" align="center">Manager</TableCell>
                            <TableCell className="text-center fnt-16 text-black" align="center">Report Recipient</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="text-center fnt-13 text-black"></TableCell>
                            <TableCell className="text-center fnt-13 text-black" align="center">(All Cloud Account Security Administration)</TableCell>
                            <TableCell className="text-center fnt-13 text-black" align="center">(Multiple or Single cloud Account Security Administration)</TableCell>
                            <TableCell className="text-center fnt-13 text-black" align="center">(Multiple or Single cloud Account Security Administration)</TableCell>
                            <TableCell className="text-center fnt-13 text-black" align="center">(Multiple or Single cloud report viewing)</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {privileges.map((row, index) => (
                            <TableRow key={row.desc + '- ' + index}>
                                <TableCell className="fnt-15" component="th" scope="row">
                                    {row.desc}
                                </TableCell>
                                <TableCell className="text-center fnt-15" align="right">{row.is_super_admin_allow === true ? <i className="fa fa-times-circle" aria-hidden="true"></i> : ''}</TableCell>
                                <TableCell className="text-center fnt-15" align="right">{row.is_admin_allow === true ? <i className="fa fa-times-circle" aria-hidden="true"></i> : ''}</TableCell>
                                <TableCell className="text-center fnt-15" align="right">{row.is_manager_allow === true ? <i className="fa fa-times-circle" aria-hidden="true"></i> : ''}</TableCell>
                                <TableCell className="text-center fnt-15" align="right">{row.is_report_recipient_allow === true ? <i className="fa fa-times-circle" aria-hidden="true"></i> : ''}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </DialogContent>
        </Dialog>
    )
}