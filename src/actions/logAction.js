/*
 * @Author: Virendra Patidar 
 * @Date: 2018-11-16 10:14:10 
 * @Last Modified by:   Virendra Patidar 
 * @Last Modified time: 2018-11-16 10:14:10 
 */
import LogService from 'api/LogService'

import { errorHandle } from 'actions/errorHandling'

export function fetchLogs(payload) {
  return function (dispatch) {
    return LogService.fetchLogs(payload).then(response => {
      return response;
    }).catch(error => {
      return errorHandle(error)
    });
  };
}
