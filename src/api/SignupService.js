/*
 * @Author: Virendra Patidar 
 * @Date: 2018-07-11 14:08:14 
 * @Last Modified by: Virendra Patidar
 * @Last Modified time: 2018-10-30 10:11:52
 * @Description :-  Used for interact with server for login related operation
 */
import request from './request'

function registration(data) {
  return request({
    url: 'api/1.0/account/register', 
    method: 'POST',
    data
  });
}
function collaboratorCreate(data) {
  return request({
    url: 'collaborator/create/',
    method: 'POST',
    data
  });
}


function emailVerify(uidb64, token) {
  return request({
    url: '/users/activate/' + uidb64 + '/' + token,
    method: 'GET'
  });
}


function verifyCollbrators(uidb64) {
  return request({
    url: 'collaborator/uuid/detail/' + uidb64,
    method: 'GET'
  });
}



function resentMail(data) {
  return request({
    url: 'users/activate/resend/',
    method: 'POST',
    data
  });
}


const SignupService = {
  registration,
  emailVerify,
  verifyCollbrators,
  collaboratorCreate,
  resentMail
}

export default SignupService;



