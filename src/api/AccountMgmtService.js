/*
 * @Author: Virendra Patidar 
 * @Date: 2018-11-19 16:19:09 
 * @Last Modified by: Virendra Patidar
 * @Last Modified time: 2018-12-20 11:24:44
 */

import requestWithToken from './requestWithToken'

function fetchAccountList(data) {
  return requestWithToken({
    url: 'admin/list-customer/accounts',
    method: 'POST',
    data
  });
}

function disableAccountByAdmin(data) {
  return requestWithToken({
    url: 'admin/disable/aws/accounts',
    method: 'POST',
    data
  });
}

function enableAccountByAdmin(data) {
  return requestWithToken({
    url: 'admin/enable/aws/accounts',
    method: 'POST',
    data
  });
}

function deleteAccountByAdmin(data) {
  return requestWithToken({
    url: 'admin/delete/aws/accounts',
    method: 'DELETE',
    data
  });
}

function fetchAccount(data) {
  return requestWithToken({
    url: '/api/1.0/account',
    method: 'GET'
  });
}

function fetchCloudAccount(data) {
  return requestWithToken({
    url: '/api/1.0/cloud-account/'+data.cloud_account_id,
    method: 'GET'
  });
}

function updateAccount(data) {
  return requestWithToken({
    url: '/api/1.0/cloud-account/'+data.cloud_account_id,
    method: 'PUT',
    data
  });
}

const AccountMgmtService = {
  fetchAccountList,
  disableAccountByAdmin,
  enableAccountByAdmin,
  deleteAccountByAdmin,
  fetchAccount,
  fetchCloudAccount,
  updateAccount
}

export default AccountMgmtService