/*
 * @Author: Virendra Patidar 
 * @Date: 2018-11-16 17:45:42 
 * @Last Modified by:   Virendra Patidar 
 * @Last Modified time: 2018-11-16 17:45:42 
 */
import React from 'react'
import { Switch,Route } from 'react-router-dom'

import MainRoute from 'components/app/MainRoute'
import SecurityRule from './components/securityRules'
import CreateRule from './components/createRule'
import CreatePolicies from './components/createPolicies'
import NotFound from 'components/404'

export function SecurityRuleRoutes(url) {
    return (

        <Switch>
            <MainRoute exact path={`${url}`} component={SecurityRule} />
            <MainRoute exact path={`${url}/create-rule`} component={CreateRule} />
            <MainRoute exact path={`${url}/create-policies`} component={CreatePolicies} />
            <Route component={NotFound} /> 
        </Switch>
    )
};
