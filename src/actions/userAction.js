/*
 * @Author: Virendra Patidar 
 * @Date: 2018-09-05 09:24:30 
 * @Last Modified by: Virendra Patidar
 * @Last Modified time: 2019-05-10 10:59:33
 */

import UserService from 'api/UserService'
import * as types from 'constants/ActionTypes'

import { errorHandle } from 'actions/errorHandling'

export function fetchUserList(payload) {
  return function (dispatch) {
    if (payload.company) {
      return UserService.fetchUserListByAdmin(payload).then(response => {
        return response
      }).catch(error => {
        return errorHandle(error)
      });
    } else {
      return UserService.fetchUserList(payload).then(response => {
        return response
      }).catch(error => {
        return errorHandle(error)
      });
    }
  };
}

export function AddEditUser(payload) {
  return function (dispatch) {
      return UserService.AddEditUser(payload).then(response => {
        mixpanel.track("Add User");
        return response
      }).catch(error => {
        return errorHandle(error)
      });
  };
}

export function DeleteUser(userId) {
  return function (dispatch) {
      return UserService.DeleteUser(userId).then(response => {
        return response
      }).catch(error => {
        return errorHandle(error)
      });
  };
}




export function fetchInviteUserList(payload) {
  return function (dispatch) {
    return UserService.fetchInviteUserList(payload).then(response => {
      return response
    }).catch(error => {
      return errorHandle(error)
    });
  };
}


export function fetchUserCount(payload) {
  return function (dispatch) {
    //If company null in  payload means request by user else request by admin
    if (payload.company === null) {
      return UserService.fetchUserCount().then(response => {
        return response
      }).catch(error => {
        return errorHandle(error)
      });
    } else {
      return UserService.fetchUserCountByAdmin(payload).then(response => {
        return response
      }).catch(error => {
        return errorHandle(error)
      });
    }

  };
}

export function fetchLastUpdateTime(payload) {
  return function (dispatch) {
    return UserService.fetchLastUpdateTime(payload).then(response => {
      return response
    }).catch(error => {
      return errorHandle(error)
    });
  };
}

export function userActiveDeactive(payload) {
  return function (dispatch) {
    return UserService.userActiveDeactive(payload).then(response => {
      return response
    }).catch(error => {
      return errorHandle(error)
    });
  };
}

export function resetPasswordSendMail(payload) {
  return function (dispatch) {
    return UserService.resetPasswordSendMail(payload).then(response => {
      return response;
    }).catch(error => {
      return errorHandle(error)
    });
  };
}

export function enableTwoFactorAuth(payload) {
  return function (dispatch) {
    return UserService.enableTwoFactorAuth(payload).then(response => {
      return response;
    }).catch(error => {
      return errorHandle(error)
    });
  };
}

export function disableTwoFactorAuth(payload) {
  return function (dispatch) {
    return UserService.disableTwoFactorAuth(payload).then(response => {
      return response;
    }).catch(error => {
      return errorHandle(error)
    });
  };
}

export function setLoginAsCompanyDetails(loginAsDetails) {
  return { type: types.LOGIN_AS_IN_COMPANY, loginAsDetails };
}