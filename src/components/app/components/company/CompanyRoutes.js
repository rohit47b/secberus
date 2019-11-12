/*
 * @Author: Virendra Patidar 
 * @Date: 2018-11-19 16:25:42 
 * @Last Modified by: Virendra Patidar
 * @Last Modified time: 2018-11-19 16:28:21
 */
import React from 'react'

import { Switch,Route } from 'react-router-dom'

import MainRoute from 'components/app/MainRoute'
import CompanyPage from './CompanyPage'
import AccountCloudList from './AccountCloudList'

import NotFound from 'components/404'

 export function CompanyRoutes(url){
    return (
        <Switch>
            <MainRoute exact path={`${url}`} component={CompanyPage} />
            <MainRoute exact path={`${url}/cloud`} component={AccountCloudList} />
            <Route component={NotFound} /> 
        </Switch>
    )
};