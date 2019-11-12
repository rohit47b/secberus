/*
 * @Author: Virendra Patidar 
 * @Date: 2018-11-16 17:51:11 
 * @Last Modified by: Virendra Patidar
 * @Last Modified time: 2018-11-29 10:44:51
 */
import React from 'react'

import { Switch } from 'react-router-dom'

import MainRoute from 'components/app/MainRoute'
import Schedule from './components/pullInterval'
import Profile from './components/profile'
import ActivityLog from './components/activityLog'
import ScheduleReport from './components/scheduleReport'

import { checkIsUser } from 'client'

export function SettingRoutes(url) {
    return (

        <Switch>
            <MainRoute exact path={`${url}/profile`} component={Profile} />

            <MainRoute exact path={`${url}/cloud-scanner`} component={(props) => (
                checkIsUser()
                    ? <Schedule {...props} />
                    : ''
            )} />

            <MainRoute exact path={`${url}/activity-log`} component={(props) => (
                checkIsUser()
                    ? <ActivityLog {...props} />
                    : ''
            )} />

             <MainRoute exact path={`${url}/reporting`} component={(props) => (
                checkIsUser()
                    ? <ScheduleReport {...props} />
                    : ''
            )} />
        </Switch>
    )
};
