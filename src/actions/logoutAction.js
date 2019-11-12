/*
 * @Author: Virendra Patidar 
 * @Date: 2018-11-16 14:53:27 
 * @Last Modified by:   Virendra Patidar 
 * @Last Modified time: 2018-11-16 14:53:27 
 */

import LogoutService from 'api/LogoutService'
import history from 'customHistory'


export function logout() {
    return function (dispatch) {
      return LogoutService.logout().then(response => {
        if (response.success) {
          localStorage.clear();
          history.push(`/login`)
        }
        else {
          return response;
        }
      }).catch(error => {
        return error.data.message;
      });
    };
  }