/*
 * @Author: Virendra Patidar 
 * @Date: 2018-12-20 11:10:15 
 * @Last Modified by: Virendra Patidar
 * @Last Modified time: 2018-12-20 12:11:10
 */
import { errorHandle } from 'actions/errorHandling'
import AccountMgmtService from 'api/AccountMgmtService'

export function fetchAccountList(payload) {
    return function (dispatch) {
      return AccountMgmtService.fetchAccountList(payload).then(response => {
        return response;
      }).catch(error => {
        return errorHandle(error)
      });
    };
  }


  export function disableAccountByAdmin(payload) {
    return function (dispatch) {
      return AccountMgmtService.disableAccountByAdmin(payload).then(response => {
        return response;
      }).catch(error => {
        return errorHandle(error)
      });
    };
  }

  export function enableAccountByAdmin(payload) {
    return function (dispatch) {
      return AccountMgmtService.enableAccountByAdmin(payload).then(response => {
        return response;
      }).catch(error => {
        return errorHandle(error)
      });
    };
  }

  export function deleteAccountByAdmin(payload) {
    return function (dispatch) {
      return AccountMgmtService.deleteAccountByAdmin(payload).then(response => {
        return response;
      }).catch(error => {
        return errorHandle(error)
      });
    };
  }

  export function fetchAccount(payload) {
    return function (dispatch) {
      return AccountMgmtService.fetchAccount(payload).then(response => {
        return response;
      }).catch(error => {
        return errorHandle(error)
      });
    };
  }

  export function fetchCloudAccount(payload) {
    return function (dispatch) {
      return AccountMgmtService.fetchCloudAccount(payload).then(response => {
        return response;
      }).catch(error => {
        return errorHandle(error)
      });
    };
  }

  export function updateAccount(payload) {
    return function (dispatch) {
      return AccountMgmtService.updateAccount(payload).then(response => {
        return response;
      }).catch(error => {
        return errorHandle(error)
      });
    };
  }