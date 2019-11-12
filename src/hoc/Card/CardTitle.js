/*
 * @Author: Virendra Patidar 
 * @Date: 2018-09-28 12:35:17 
 * @Last Modified by: Virendra Patidar
 * @Last Modified time: 2018-10-11 11:03:51
 */
import React from 'react'

import Typography from '@material-ui/core/Typography'

export const CardTitle = (props) => {
    return (
        <div className="card-head card-title">
            <Typography component="h5">
                {props.text}
            </Typography>
        </div>
    )
}