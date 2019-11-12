/*
 * @Author: Virendra Patidar 
 * @Date: 2018-11-16 17:51:11 
 * @Last Modified by: Virendra Patidar
 * @Last Modified time: 2018-11-29 10:44:51
 */
import React from 'react'

import { Switch } from 'react-router-dom'

import MainRoute from 'components/app/MainRoute'

import InvestigateAlert from './components/alerts'
import AlertInfo from './components/alertDetail'


export function InvestigationAlertRoutes(url) {
    return (

        <Switch>
            <MainRoute exact path={`${url}`} component={InvestigateAlert} />
            <MainRoute path={`${url}/detail`} component={AlertInfo} />
        </Switch>
    )
};
