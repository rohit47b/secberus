/*
 * @Author: Virendra Patidar 
 * @Date: 2018-11-16 17:51:11 
 * @Last Modified by: Virendra Patidar
 * @Last Modified time: 2018-11-29 10:44:51
 */
import React from 'react'

import { Switch } from 'react-router-dom'

import MainRoute from 'components/app/MainRoute'
import Remediation from './'
import RemediationAutoGenerated from './remediationAutoGenerated'


import { checkIsUser } from 'client'

export function RemediationRoutes(url) {
    return (
        <Switch>
            <MainRoute exact path={`${url}/`} component={Remediation} />
            <MainRoute exact path={`${url}/auto-generated`} component={RemediationAutoGenerated} />
        </Switch>
    )
};
