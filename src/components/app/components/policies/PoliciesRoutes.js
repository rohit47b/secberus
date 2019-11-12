/*
 * @Author: Virendra Patidar 
 * @Date: 2018-11-16 17:51:11 
 * @Last Modified by: Virendra Patidar
 * @Last Modified time: 2019-03-11 09:58:29
 */
import React from 'react'

import { Switch } from 'react-router-dom'

import MainRoute from 'components/app/MainRoute'
import Policies from './'
import CopyPolicies from './copyPolicies'


import { checkIsUser } from 'client'

export function PoliciesRoutes(url) {
    return (
        <Switch>
            <MainRoute exact path={`${url}/`} component={Policies} />
            <MainRoute exact path={`${url}/copy-policies`} component={CopyPolicies} />
        </Switch>
    )
};
