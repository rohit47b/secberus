/*
 * @Author: Virendra Patidar 
 * @Date: 2018-09-28 12:35:17 
 * @Last Modified by: Virendra Patidar
 * @Last Modified time: 2019-05-21 14:00:00
 */
import React from 'react'

export const AlertCount = (props) => {
    const { borderColorClass,toggleDrawer,alertCountSuppress } = props
    return (
        <div className={"alert-wrapper text-center " + alertCountSuppress} onClick={()=>toggleDrawer(props.alertTitle)}>
            <div className={"alert-circle " + borderColorClass}>
                {props.alertCount}
                </div>
            <div className="alert-title">{props.alertTitle}</div>
        </div>
    )
}