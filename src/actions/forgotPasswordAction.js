/*
 * @Author: Virendra Patidar 
 * @Date: 2018-07-11 11:40:03 
 * @Last Modified by: Virendra Patidar
 * @Last Modified time: 2018-11-19 11:46:27
 */

import history from 'customHistory'
import { errorHandle } from 'actions/errorHandling'

import ForgotPasswordService from 'api/ForgotPasswordService'

/**
 * Action used for authenticate user
 * @param {*} forgotPasswordPayload 
 */
export function forgotPassword(forgotPasswordPayload) {
  return function (dispatch) {
    return ForgotPasswordService.forgotPasswordService(forgotPasswordPayload).then(response => {
      if (response.success) {
        history.push({
          pathname: '/forgot-password-email',
          query: { email: forgotPasswordPayload.email }
        })
        return response;
      }
      else {
        return response.errorMessage;
      }
    }).catch(error => {
      return errorHandle(error)
    });
  };
}

/**
 * Action used for authenticate user
 * @param {*} ResetPasswordPayload 
 */

export function resetPassword(ResetPasswordPayload) {
  return function (dispatch) {
    return ForgotPasswordService.resetPasswordService(ResetPasswordPayload).then(response => {
      if (response.success) {
        history.push(`/login`)
        return response;
      }
      else {
        return response;
      }
    }).catch(error => {
      return errorHandle(error)
    });
  };
}

