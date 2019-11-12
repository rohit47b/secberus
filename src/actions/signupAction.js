/*
 * @Author: Virendra Patidar 
 * @Date: 2018-07-11 11:40:03 
 * @Last Modified by: Virendra Patidar
 * @Last Modified time: 2018-11-14 11:35:48
 */
import history from 'customHistory'
import SignupService from '../api/SignupService'

import { errorHandle } from 'actions/errorHandling'

/**
 * Action used for authenticate user
 * @param {*} signupPayload 
 */
export function signup(signupPayload) {
  return function (dispatch) {
    return SignupService.registration(signupPayload).then(response => {
      if (typeof response.company_name !== 'undefined') {
        mixpanel.track("Sign Up", { 
          "Name": signupPayload.first_name + " " + signupPayload.last_name,
          "Email Address": signupPayload.email,
          "Company": response.company_name,
          "Registration Date": response.signup_date
        });
        history.push({
          pathname: '/welcome',
          state: { email: signupPayload.email, isVerified: false }
        });
        return;
      }
      else if (typeof response !== 'undefined'){
        return response;
      }

      return errorHandle(error)
    }).catch(error => {
      return error.data
    });
  };
}

export function collaboratorCreate(signupPayload) {
  return function (dispatch) {
    return SignupService.collaboratorCreate(signupPayload).then(response => {
      if (typeof response.company_name !== 'undefined') {
        history.push({
          pathname: '/welcome',
          state: { email: signupPayload.email, isVerified: true }
        })
        return;
      }
      else {
        return errorHandle(response);
      }
    }).catch(error => {
      return errorHandle(error)
    });
  };
}


export function verify(uidb64, token) {
  return function (dispatch) {
    return SignupService.emailVerify(uidb64, token).then(response => {
      return response;
    }).catch(error => {
      return error.data.message;
    });
  };
}


export function verifyCollbrators(uidb64) {
  return function (dispatch) {
    return SignupService.verifyCollbrators(uidb64).then(response => {
      return response;
    }).catch(error => {
      return errorHandle(error)
    });
  };
}

export function resentMail(payload) {
  return function (dispatch) {
    return SignupService.resentMail(payload).then(response => {
      return response;
    }).catch(error => {
      return error.data.message;
    });
  };
}