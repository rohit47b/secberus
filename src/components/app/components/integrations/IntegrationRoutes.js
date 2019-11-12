/*
 * @Author: Virendra Patidar 
 * @Date: 2018-11-16 17:51:11 
 * @Last Modified by: Virendra Patidar
 * @Last Modified time: 2018-11-29 10:44:51
 */
import React from 'react'

import { Switch } from 'react-router-dom'

import MainRoute from 'components/app/MainRoute'
import CloudIntegration from './components/clouds'
import CommunicationIntegrations from './components/communicationIntegrations'


import { checkIsUser } from 'client'

export function IntegrationRoutes(url) {
    return (

        <Switch>
            

            <MainRoute exact path={`${url}/clouds`} component={(props) => (
                checkIsUser()
                    ? <CloudIntegration {...props} />
                    : ''
            )} />

            <MainRoute exact path={`${url}/communication`} component={CommunicationIntegrations} />

            
        </Switch>
    )
};
