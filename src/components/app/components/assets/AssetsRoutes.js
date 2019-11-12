/*
 * @Author: Virendra Patidar 
 * @Date: 2018-11-16 17:51:11 
 * @Last Modified by: Virendra Patidar
 * @Last Modified time: 2019-03-05 11:36:06
 */
import React from 'react'

import { Switch } from 'react-router-dom'

import MainRoute from 'components/app/MainRoute'
import Assets from './'
import AssetSummary from './assetSummary'

export function AssetsRoutes(url) {
    return (
        <Switch>
            <MainRoute exact path={`${url}/`} component={Assets} />
            <MainRoute path={`${url}/detail`} component={AssetSummary} />
        </Switch>
    )
};
