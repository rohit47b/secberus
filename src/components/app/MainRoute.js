/*
 * @Author: Virendra Patidar 
 * @Date: 2018-09-26 10:27:10 
 * @Last Modified by: Virendra Patidar
 * @Last Modified time: 2018-10-10 16:16:08
 */
import React from 'react'
import { Route } from 'react-router-dom'

import Layout from './Layout'
import {requireAuth } from 'client'

const MainRoute = ({ component: Component, ...rest }) => {
  return (
    <Route {...rest} render={requireAuth() ? matchProps => (
      <Layout>
        <Component {...matchProps} />
      </Layout>
    ) : ''} />
  )
};

export default MainRoute;