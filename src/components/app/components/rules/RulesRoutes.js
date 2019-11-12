/*
 * @Author: Virendra Patidar 
 * @Date: 2018-11-16 17:51:11 
 * @Last Modified by: Virendra Patidar
 * @Last Modified time: 2019-03-19 12:03:26
 */
import React from 'react'

import { Switch } from 'react-router-dom'

import MainRoute from 'components/app/MainRoute'
import Rules from './components/rules'
import RuleDetail from './components/rulesDetail'


export function RulesRoutes(url) {
    return (
        <Switch>
            <MainRoute exact path={`${url}/`} component={Rules} />
            <MainRoute exact path={`${url}/detail`} component={RuleDetail} />
        </Switch>
    )
};
