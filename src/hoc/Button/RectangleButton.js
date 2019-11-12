/*
 * @Author: Virendra Patidar 
 * @Date: 2018-09-28 12:35:17 
 * @Last Modified by: Virendra Patidar
 * @Last Modified time: 2018-10-11 11:03:51
 */
import React from 'react'

import Button from '@material-ui/core/Button';

export const RectangleButton = (props) => {
    return (
        <Button variant="outlined" className="btn btn-add-rectangle">
            <span className="pdR5"><i className="fa fa-plus-circle" aria-hidden="true"></i>
            </span>  {props.buttonName}
        </Button>
    )
}