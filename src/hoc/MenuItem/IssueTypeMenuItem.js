/*
 * @Author: Virendra Patidar 
 * @Date: 2018-09-28 12:17:53 
 * @Last Modified by: Virendra Patidar
 * @Last Modified time: 2018-12-06 16:44:21
 */

import React from 'react'

import MenuItem from '@material-ui/core/MenuItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import Avatar from '@material-ui/core/Avatar'

import classNames from 'classnames'

import history from 'customHistory'

const issueTypeClasses = { '': '', error: 'circle-danger', fail: 'circle-warning', pass: 'circle-success' }
const issueText = { '': '', error: 'Error', fail: 'Failed', pass: 'Passed' }

export const IssueTypeMenuItem = (props) => {
    return (<MenuItem onClick={()=>props.toggleDrawer('right',true,props.issueType,props.serviceName,props.data)}>
        <ListItemIcon>
            <Avatar className={classNames('issue-circle', issueTypeClasses[props.issueType])}>{props.count ? props.count : '0'}</Avatar>
        </ListItemIcon>
        <ListItemText inset primary={issueText[props.issueType]} />
    </MenuItem>)

    //temporally removed, for Assets
    /*(<MenuItem onClick={() => history.push({ pathname :'/app/assets', state :{ service: props.service, issueType: props.issueType } })}>
        <ListItemIcon>
            <Avatar className={classNames('issue-circle', issueTypeClasses[props.issueType])}>{props.count ? props.count : '0'}</Avatar>
        </ListItemIcon>
        <ListItemText inset primary={issueText[props.issueType]} />
    </MenuItem>)*/
}