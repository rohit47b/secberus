/*
 * @Author: Virendra Patidar 
 * @Date: 2018-07-11 11:40:03 
 * @Last Modified by: Virendra Patidar
 * @Last Modified time: 2019-05-13 10:16:20
 */
import * as types from '../constants/ActionTypes'

import { reset } from 'redux-form'
import history from 'customHistory'

import LoginService from '../api/LoginService'
import UserService from '../api/UserService'
import AccountMgmtService from '../api/AccountMgmtService'

import { errorHandle } from 'actions/errorHandling'
import { setActiveMenu, setAlertsPlan } from 'actions/commonAction'
import { setAwsList, setComplianceList, setPriorityList,setActiveParentMenu } from 'actions/commonAction'
import { fetchProfileDetail } from 'actions/profileAction'
import { fetchCompanyList } from 'actions/companyAction'
import { checkIsTailPeriodFinishedAndNotSubsribed } from 'actions/subscriptionsAction'

import { setLoginAsCompanyDetails } from 'actions/userAction'
import { setProfileData } from 'actions/profileAction'

/**
 * Action used for authenticate user
 * @param {*} loginPayload 
 * Note :- After login  succesfully need to perform following task-
 *  1. Set token in local storage
 *  2. Reset header filter data 
 *  3. By default need to set Dashboard menu is active
 *  4. Reset signup-awsinvite , awscreate redux form
 *  5. Fetch login user profile details and set in reducer
 *  6. Fetch compnay details
 *  7. Set aws list in reducer
 *  8. Fetch account details
 *  9. Check user trail period is expire or not
 *  10. Check user subscribe any plan or not after trail period expired
 * 
 */
export function login(loginPayload) {
  return function (dispatch) {
    return LoginService.authenticate(loginPayload).then(response => {
      const authResponse = response
      if (authResponse.access_token && authResponse.refresh_token) {
        localStorage.setItem('token', authResponse.access_token)
        UserService.fetchUserList().then(response => {
          let currentUser = {}
          response.forEach(user => {
            if (loginPayload.username.toLowerCase() === user.email.toLowerCase()) {
              currentUser = JSON.stringify(user)
              localStorage.setItem('profile', currentUser)
              dispatch(resetHeaderFilterData())
              dispatch(loginSuccess(authResponse.access_token));
              localStorage.setItem('lastUpdateTime', '')
              const loginAsDetails = { isLoginAs: true, company: {} }
              dispatch(setLoginAsCompanyDetails(loginAsDetails));
              dispatch(setUserProfile(currentUser))
              dispatch(fetchCloudAccounts(authResponse.access_token));
              return;
            }
          });
        })
      } else {
        return { success: false, erroType: 'message', error: authResponse.errorMessage }
      }
    }).catch(error => {
      if (error.headers['www-authenticate'] !== undefined) {
        const arrayToken = error.headers['www-authenticate'].split(", ")
        const token = arrayToken[1].replace('token=', '').replace(/"/g, '')
        return {'token': token}
      } else {
        return errorHandle(error)
      }
    });
  };
}

export function twofactor(code, email) {
  return function (dispatch) {
    return LoginService.twofactor(code).then(response => {
      const authResponse = response
      if (authResponse.access_token && authResponse.refresh_token) {
        localStorage.setItem('token', authResponse.access_token)
        UserService.fetchUserList().then(response => {
          let currentUser = {}
          response.forEach(user => {
            if (email.toLowerCase() === user.email.toLowerCase()) {
              currentUser = JSON.stringify(user)
              localStorage.setItem('profile', currentUser)
              dispatch(resetHeaderFilterData())
              dispatch(loginSuccess(authResponse.access_token));
              localStorage.setItem('lastUpdateTime', '')
              const loginAsDetails = { isLoginAs: true, company: {} }
              dispatch(setLoginAsCompanyDetails(loginAsDetails));
              dispatch(setUserProfile(currentUser))
              dispatch(fetchCloudAccounts(authResponse.access_token));
              return;
            }
          });
        })
      } else {
        return { success: false, erroType: 'message', error: authResponse.errorMessage }
      }
    }).catch(error => {
      if (error.data !== undefined && error.data.title !== undefined) {
          return error.data.title
      } else {
        return errorHandle(error)
      }
    });
  }
}

export function fetchCloudAccounts(token) {
  return function (dispatch) {
    return LoginService.fetchCloudAccounts(token).then(response => {
      if (response.length === 0) {
        dispatch(setAlertsPlan([]))
        dispatch(setCloudAccounts(response));
        dispatch(setActiveMenu('Clouds'))
        dispatch(setActiveParentMenu('Integration'))
        history.push(`/app/integrations/clouds`)
      } else {
        dispatch(setCloudAccounts(response));
        localStorage.setItem('account_id',response[0].id)
        dispatch(setActiveMenu('Dashboard'))
        history.push(`/app/dashboard/home`)
      }
      return;
    }).catch(error => {
      return errorHandle(error)
    });
  };
}

export function setUserProfile(currentUser) {
  return function (dispatch) {
    return AccountMgmtService.fetchAccount().then(result => {
      let company = 'undefined'
      if (result && typeof result !== undefined) {
          company = result.company_name
      }
      localStorage.setItem('company', company)
      mixpanel.track("Log In", {
        "Name": currentUser.first_name + " " + currentUser.last_name,
        "Email Address": currentUser.email,
        "First Login": 'N/A',
        "Last Login": currentUser.last_login_date,
        "Company": company
      });
      dispatch(setProfileData(currentUser));
      return;
    }).catch(error => {
      return errorHandle(error)
    });
  };
}

export function setCloudAccounts(cloudAccounts) {
  return { type: types.SET_CLOUD_ACCOUNTS, cloudAccounts };
}

/**
 * Action used after login success 
 * @param {*} responseLogin 
 */
export function loginSuccess(token) {
  return { type: types.LOGIN_SUCCESS, token };
}

export function loadLogin() {
  return history.push(`/login`)
};

export function fetchConstant(token) {
  return function (dispatch) {
    return LoginService.fetchConstant(token).then(response => {
      dispatch(setConstant(response[0].id));
      dispatch(setActiveMenu('Dashboard'))
      history.push(`/app/dashboard/home`)
      return;
    }).catch(error => {
      return errorHandle(error)
    });

    /* return LoginService.fetchConstant(token).then(response => {
  if (response.success) {
    dispatch(setConstant(response.data.account_id));
    dispatch(checkIsTailPeriodFinishedAndNotSubsribed())
    if (role === 'user') { // If user not set up any account then redirect to On-board page
      dispatch(setActiveMenu('Dashboard'))
      history.push(`/app/dashboard/home`)
    } else {
      dispatch(setActiveMenu('Companies'))
      history.push(`/app/companies`)
    }
    return;
  }
  else {
    return;
  }
}).catch(error => {
  return errorHandle(error)
}); */

  };
}

export function resetLoginForm() {
  return function (dispatch) {
    return dispatch(reset('login'));
  };
}

export function resetHeaderFilterData() {
  return { type: types.RESET_FILTER_SEARCH_BAR };
}

export function setConstant(accountId) {
  return { type: types.SET_CONSTANT, accountId };
}


