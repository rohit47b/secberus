/*
 * @Author: Virendra Patidar 
 * @Date: 2018-11-22 16:24:18 
 * @Last Modified by: Virendra Patidar
 * @Last Modified time: 2019-01-07 13:26:12
 */
import React from 'react';
import { render } from 'react-dom';
import { createStore, applyMiddleware, compose } from "redux"
import { persistStore, autoRehydrate } from "redux-persist"
import thunk from "redux-thunk"
import { Provider } from 'react-redux';
import reducers from './reducers'
import { } from 'babel-polyfill'
import { Router } from 'react-router-dom'
import history from 'customHistory'
import Main from './routes'

import { AppContainer } from 'react-hot-loader'

export const store = createStore(
  reducers,
  applyMiddleware(thunk),
  compose(autoRehydrate()),
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()

)

export const persistingStore = persistStore(store, { blacklist: ["routing"] })

/**
 * Method used for check token is valid ot not
 */
export const requireAuth = async (nextState, replace) => {
  const authToken = localStorage.getItem("token")
  const profile = localStorage.getItem("profile")
  if (!authToken || profile === undefined || profile === null || profile === {}) {
    history.push('/login')
    window.location.reload(true)
    return false
  }
  return true
}

/**
 * Method used for if user already login into browser and token not expire then redirect to dashboard page
 */
export const isAlreadyLogin = () => {
  const authToken = localStorage.getItem("token")
  const isRunDefaultPolicy = localStorage.getItem('isRunDefaultPolicy')
  if (authToken && isRunDefaultPolicy === 'true') {
    history.push('/app/dashboard/home')
    return false
  }
  return true;
}

/**
 * Method used for check trail period is expire and not subscribed any plan
 */
export const checkTrailRemainingDays = () => {

  const currentState = store.getState()
  let company = currentState.userReducer.company
  const loginAsDetail = currentState.userReducer.loginAsDetail
  if (loginAsDetail.isLogin === true) {
    company = loginAsDetail.company
  }

  if (company !== undefined && company.is_permanent === true) {
    return true;
  } else {
    const isExpired = localStorage.getItem("isExpired") ? (localStorage.getItem("isExpired") === 'true' ? true : false) : false
    if (isExpired === true) {
      history.push('/app/subscribe')
      return false
    }
    return true;
  }
}

/**
 * Method used for access pages which only access permission to super-admin
 */
export const checkIsAdmin = () => {
  const currentState = store.getState()
  const token = currentState.userReducer.token
  const role = token.role ? token.role : 'user'
  if (role === 'super_admin') {
    return true;
  } else {
    if (checkTrailRemainingDays()) {
      history.push('/app/dashboard/home')
      return false
    }
    return false
  }
}

/**
 * Method used for access pages which only access permission to user
 */
export const checkIsUser = () => {
  const currentState = store.getState()
  const token = currentState.userReducer.token
  const isLoginAs = currentState.userReducer.loginAsDetail.isLogin
  //const role = token.role ? token.role : 'user'
  const role = 'user'
   if (role === 'user' || isLoginAs === true) {
    return true;
  } else {
    history.push('/app/companies')
    return false
  } 
}

/**
 * Persist the store, after rehydration after that rendering dom.
 */
persistStore(store, {}, () => {
  render(
    <AppContainer>
      <Provider store={store}>
        <Router history={history}>
          <Main />
        </Router>
      </Provider>
    </AppContainer>,
    document.getElementById('app-container')
  )
}); 