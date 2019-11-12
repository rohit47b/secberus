/*
 * @Author: Virendra Patidar 
 * @Date: 2018-07-11 14:08:14 
 * @Last Modified by: Virendra Patidar
 * @Last Modified time: 2019-05-06 20:59:54
 * @Description :-  Used for interact with server for login related operation
 */
import request from './request'
import requestWithPassToken from './requestWithPassToken'

function authenticate(data) {
  return request({
    url: '/api/1.0/auth/login',
    method: 'POST',
    data
  });
}

function twofactor(code) {
  return request({
    url: '/api/1.0/auth/twofactor',
    method: 'POST',
    headers: { 'Authorization': 'PIN ' + code },
  });
}

function fetchConstant(token) {
  return requestWithPassToken({
    url: '/api/1.0/cloud-accounts/',
    method: 'GET',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
  });
}
function fetchCloudAccounts(token) {
  return requestWithPassToken({
    url: '/api/1.0/cloud-accounts/',
    method: 'GET',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
  });
}



const LoginService = {
  authenticate,
  fetchConstant,
  fetchCloudAccounts,
  twofactor
}

export default LoginService;



