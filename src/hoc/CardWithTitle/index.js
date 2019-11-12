/*
 * @Author: Virendra Patidar 
 * @Date: 2018-09-28 12:35:17 
 * @Last Modified by: Virendra Patidar
 * @Last Modified time: 2019-02-27 15:54:28
 */
import React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

export const CardWithTitle = (props) => {
    const {bgImageClass,title,children,left}=props
    return (
        <Card className={"card-wizard card-panel " +bgImageClass}>
        <div className={"card-title" }>
            <span>{title} </span> <div>{left}</div>
        </div>
        <CardContent className="card-body card-body-pd">
            {children}
        </CardContent>
    </Card>
    )
}