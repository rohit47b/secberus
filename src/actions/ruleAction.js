/*
 * @Author: Virendra Patidar 
 * @Date: 2018-11-02 12:46:09 
 * @Last Modified by: Virendra Patidar
 * @Last Modified time: 2019-01-09 16:31:50
 */
import RuleService from 'api/RuleService'

import { errorHandle } from 'actions/errorHandling'

export function fetchRuleCategory(payload) {
  return function (dispatch) {
    return RuleService.fetchRuleCategory(payload).then(response => {
      return response;
    }).catch(error => {
      return errorHandle(error)
    });
  };
}


export function fetchPriorityList() {
  return function (dispatch) {
    return RuleService.fetchPriorityList().then(response => {
      return response;
    }).catch(error => {
      return errorHandle(error)
    });
  };
}

export function fetchRuleCount(payload) {
  return function (dispatch) {
    return RuleService.fetchRuleCount(payload).then(response => {
      return response;
    }).catch(error => {
      return errorHandle(error)
    });
  };
}

export function fetchRuleList(payload) {
  return function (dispatch) {
    return RuleService.fetchRuleList(payload).then(response => {
      return response;
    }).catch(error => {
      return errorHandle(error)
    });
  };
}

export function fetchRuleListByAccount(payload) {
  return function (dispatch) {
    return RuleService.fetchRuleListByAccount(payload).then(response => {
      return response;
    }).catch(error => {
      return errorHandle(error)
    });
  };
}

export function suppressRule(payload) {
  return function (dispatch) {
    return RuleService.suppressRule(payload).then(response => {
      return response;
    }).catch(error => {
      return errorHandle(error)
    });
  };
}

export function unsuppressRule(payload) {
  return function (dispatch) {
    return RuleService.unsuppressRule(payload).then(response => {
      return response;
    }).catch(error => {
      return errorHandle(error)
    });
  };
}

export function fetchRuleServiceList() {
  return function (dispatch) {
    return RuleService.fetchRuleServiceList().then(response => {
      return response;
    }).catch(error => {
      return errorHandle(error)
    });
  };
}