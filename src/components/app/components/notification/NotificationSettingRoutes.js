/*
 * @Author: Virendra Patidar 
 * @Date: 2018-11-16 17:51:11 
 * @Last Modified by: Virendra Patidar
 * @Last Modified time: 2018-11-29 10:44:51
 */
import React from 'react'

import { Switch } from 'react-router-dom'

import MainRoute from 'components/app/MainRoute'

import NotificationSetting from './components/setting'
import SeeALLNotification from './components/allNotification'


export function NotificationSettingRoutes(url) {
    return (
        <Switch>
            <MainRoute exact path={`${url}/setting`} component={NotificationSetting} />
            <MainRoute exact path={`${url}/all`} component={SeeALLNotification} />
        </Switch>
    )
};
