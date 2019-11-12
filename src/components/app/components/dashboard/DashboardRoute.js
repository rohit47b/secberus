/*
 * @Author: Virendra Patidar 
 * @Date: 2018-11-16 15:28:46 
 * @Last Modified by:   Virendra Patidar 
 * @Last Modified time: 2018-11-16 15:28:46 
 */
import React from 'react'

import { Route, Switch } from 'react-router-dom'

import MainRoute from 'components/app/MainRoute'
import NotFound from 'components/404'
import Home from './components'

 export function DashboardRoute(url){
    return (
       
        <Switch>
            <MainRoute exact path={`${url}/home`} component={Home} />
            <Route component={NotFound} />
        </Switch>
    )
};