import React from 'react'
import { Switch,Route } from 'react-router-dom'

import MainRoute from 'components/app/MainRoute'
import Onboard from './components/wizard'
import PullAssets from './components/pullAssets'
import RunPolicy from './components/securityRunPolicy'
import NotFound from 'components/404'

export function onboardRoutes(url) {
    return (

        <Switch>
            <MainRoute exact path={`${url}`} component={Onboard} />
            <MainRoute exact path={`${url}/pullassets`} component={PullAssets} />
            <MainRoute exact path={`${url}/runpolicy`} component={RunPolicy} />
            <Route component={NotFound} />
        </Switch>
    )
};
