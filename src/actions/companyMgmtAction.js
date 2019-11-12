/*
 * @Author: Virendra Patidar 
 * @Date: 2018-11-19 16:16:54 
 * @Last Modified by: Virendra Patidar
 * @Last Modified time: 2019-01-08 12:08:32
 */

import CompanyMgmtService from 'api/CompanyMgmtService'

import { errorHandle } from 'actions/errorHandling'

export function fetchCompanyList(payload) {
  return function (dispatch) {
    return CompanyMgmtService.fetchCompanyList(payload).then(response => {
      return response;
    }).catch(error => {
      return errorHandle(error)
    });
  };
}

export function fetchCompanyPageCount() {
  return function (dispatch) {
    return CompanyMgmtService.fetchCompanyPageCount().then(response => {
      return response;
    }).catch(error => {
      return errorHandle(error)
    });
  };
}


export function toggleCompanyStatus(payload) {
  return function (dispatch) {
    return CompanyMgmtService.toggleCompanyStatus(payload).then(response => {
      return response;
    }).catch(error => {
      return errorHandle(error)
    });
  };
}

export function toggleCompanyPermanent(payload) {
  return function (dispatch) {
    return CompanyMgmtService.toggleCompanyPermanent(payload).then(response => {
      return response;
    }).catch(error => {
      return errorHandle(error)
    });
  };
}

export function extendCompanyExpiryDate(payload) {
  return function (dispatch) {
    return CompanyMgmtService.extendCompanyExpiryDate(payload).then(response => {
      return response;
    }).catch(error => {
      return errorHandle(error)
    });
  };
}

export function loginAsInCompany(payload) {
  return function (dispatch) {
    return CompanyMgmtService.loginAsInCompany(payload).then(response => {
      return response;
    }).catch(error => {
      return errorHandle(error)
    });
  };
}

export function logoutAsAdminFromCompany() {
  return function (dispatch) {
    return CompanyMgmtService.logoutAsAdminFromCompany().then(response => {
      return response;
    }).catch(error => {
      return errorHandle(error)
    });
  };
}