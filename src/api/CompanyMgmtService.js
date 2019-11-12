/*
 * @Author: Virendra Patidar 
 * @Date: 2018-11-19 16:19:09 
 * @Last Modified by: Virendra Patidar
 * @Last Modified time: 2019-01-04 16:19:34
 */

import requestWithToken from './requestWithToken'

function fetchCompanyList(data) {
  return requestWithToken({
    url: 'admin/list-companies',
    method: 'POST',
    data
  });
}


function fetchCompanyPageCount() {
  return requestWithToken({
    url: 'admin/count/customers',
    method: 'GET',
  });
}



function toggleCompanyStatus(data) {
  return requestWithToken({
    url: 'admin/toggle-status',
    method: 'POST',
    data
  });
}

function toggleCompanyPermanent(data) {
  return requestWithToken({
    url: 'admin/company/permanent',
    method: 'POST',
    data
  });
}

function extendCompanyExpiryDate(data) {
  return requestWithToken({
    url: 'admin/extend-trial',
    method: 'POST',
    data
  });
}

function loginAsInCompany(data) {
  return requestWithToken({
    url: 'admin/company/login',
    method: 'POST',
    data
  });
}
function logoutAsAdminFromCompany() {
  return requestWithToken({
    url: 'admin/company/logout',
    method: 'GET'
  });
}



const CompanyMgmtService = {
  fetchCompanyList,
  toggleCompanyStatus,
  extendCompanyExpiryDate,
  toggleCompanyPermanent,
  fetchCompanyPageCount,
  loginAsInCompany,
  logoutAsAdminFromCompany
}

export default CompanyMgmtService;