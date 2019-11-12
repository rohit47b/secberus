/*
 * @Author: Virendra Patidar 
 * @Date: 2018-11-16 17:45:42 
 * @Last Modified by:   Virendra Patidar 
 * @Last Modified time: 2018-11-16 17:45:42 
 */
import React from 'react'
import { Switch,Route } from 'react-router-dom'

import MainRoute from 'components/app/MainRoute'
import Compliance from './components/compliance'
import Remediation from './components/remediation/components/remediation'
import RemediationPlan from './components/remediation/components/remdiationPlan'
import Security from './components/security'

export function ReportRoutes(url) {
    return (

        <Switch>
            <MainRoute exact path={`${url}/compliance`} component={Compliance} />
            <MainRoute exact path={`${url}/remediation`} component={Remediation} />
            <MainRoute path={`${url}/plan`} component={RemediationPlan} />
            <MainRoute exact path={`${url}/security`} component={Security} />
        </Switch>
    )
};
