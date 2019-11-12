/*
 * @Author: Virendra Patidar 
 * @Date: 2018-11-16 14:52:34 
 * @Last Modified by:   Virendra Patidar 
 * @Last Modified time: 2018-11-16 14:52:34 
 */
import SecurityIssueService from 'api/SecurityIssueService'

import { errorHandle } from 'actions/errorHandling'

export function fetchSecurityIssue(payload) {
  return function (dispatch) {
    return SecurityIssueService.fetchSecurityIssue(payload).then(response => {
      return response;
    }).catch(error => {
      return errorHandle(error)
    });
  };
}


export function fetchSecurityIssueDetails(payload) {
  return function (dispatch) {
    return SecurityIssueService.fetchSecurityIssueDetails(payload).then(response => {
      return response;
    }).catch(error => {
      return errorHandle(error)
    });
  };
}
