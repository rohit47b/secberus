/*
 * @Author: Virendra Patidar 
 * @Date: 2018-09-28 11:55:55 
 * @Last Modified by: Virendra Patidar
 * @Last Modified time: 2018-10-15 16:21:49
 */
import React from 'react'

import Grid from '@material-ui/core/Grid'

import classNames from 'classnames'

const issueTypeClasses = { '': '', pass: 'text-success',fail: 'text-danger',error: 'text-gray'}
const label = { '': '', pass: 'PASSED',fail: 'FAILED',error: 'ERROR'}

export const IssueTypeButton = function (props) {
    const percentage = Math.round((props.count * 100) / props.totalCount)
    return <Grid item sm={4}>
        <div className='box-status' onClick={() => props.toggleDrawer('', true, props.issueType)}>
            <span className={classNames('text-msg', issueTypeClasses[props.issueType])}><b>{label[props.issueType]}</b></span>   
            <span className={classNames('text-msg', issueTypeClasses[props.issueType])}><b>{props.count}</b> ({isNaN(percentage) ? 0 : percentage}%)</span>
        </div>
    </Grid>;
};
