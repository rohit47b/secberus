/*
 * @Author: Virendra Patidar 
 * @Date: 2018-07-11 14:08:14 
 * @Last Modified by: Virendra Patidar
 * @Last Modified time: 2019-05-13 11:47:28
 * @Description :-  Used for interact with server for login related operation
 */
import request from './request'

function forgotPasswordService(data) {
  return request({
    url: 'api/1.0/auth/password/reset',
    method: 'POST',
    data
  });
}

function resetPasswordService(data) {
  return request({
    url: 'api/1.0/auth/password/reset/confirm',
    method: 'POST',
    data
  });
}

const ForgotPasswordService = {
  forgotPasswordService,
  resetPasswordService
}

export default ForgotPasswordService;



