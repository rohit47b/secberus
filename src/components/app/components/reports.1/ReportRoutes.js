/*
 * @Author: Virendra Patidar 
 * @Date: 2018-11-16 17:18:09 
 * @Last Modified by:   Virendra Patidar 
 * @Last Modified time: 2018-11-16 17:18:09 
 */
import React from 'react';
import { Route, Switch } from 'react-router-dom'

import MainRoute from 'components/app/MainRoute'
import PolicyDetails from './components/policyDetails'

import NotFound from 'components/404'

 export function ReportRoutes(url){
    return (
       
        <Switch>
            <MainRoute exact path={`${url}`} component={PolicyDetails} />
            <Route component={NotFound} /> 
        </Switch>
    )
};
