/*
 * @Author: Virendra Patidar 
 * @Date: 2018-11-16 14:52:44 
 * @Last Modified by:   Virendra Patidar 
 * @Last Modified time: 2018-11-16 14:52:44 
 */
import SchedulerSettingSerivce from '../api/SchedulerSettingSerivce'
import { errorHandle } from 'actions/errorHandling'

export function fetchSchedulerList(data) {
  return function (dispatch) {
    return SchedulerSettingSerivce.fetchSchedulerList(data).then(response => {
      return response;
    }).catch(error => {
      return errorHandle(error)
    });
  };
}

export function schedulerEdit(payload) {
  return function (dispatch) {
    return SchedulerSettingSerivce.schedulerEdit(payload).then(response => {
      if (response.success) {
        return response;
      }
      else {
        return response.errorMessage;
      }
    }).catch(error => {
      return errorHandle(error)
    });
  };
}

export function schedulerEnableDisable(payload) {
  return function (dispatch) {
    return SchedulerSettingSerivce.schedulerEnableDisable(payload).then(response => {
      if (response.success) {
        return response;
      }
      else {
        return response.errorMessage;
      }
    }).catch(error => {
      return errorHandle(error)
    });
  };
}

export function createScheduleRun(payload) {
  return function (dispatch) {
    return SchedulerSettingSerivce.createScheduleRun(payload).then(response => {
      if (response.success) {
        return response;
      }
      else {
        return response.errorMessage;
      }
    }).catch(error => {
      return errorHandle(error)
    });
  };
}