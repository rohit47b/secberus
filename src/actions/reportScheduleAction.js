/*
 * @Author: Virendra Patidar 
 * @Date: 2018-11-16 14:52:56 
 * @Last Modified by:   Virendra Patidar 
 * @Last Modified time: 2018-11-16 14:52:56 
 */
import ReportScheduleService from 'api/ReportScheduleService'

import { errorHandle } from 'actions/errorHandling'

export function createReportSchedule(payload) {
  return function (dispatch) {
    return ReportScheduleService.createReportSchedule(payload).then(response => {
      return { success: true, data: response };
    }).catch(error => {
      return errorHandle(error)
    });
  };
}

export function editReportSchdule(payload) {
  return function (dispatch) {
    return ReportScheduleService.editReportSchdule(payload).then(response => {
      return { success: true, data: response };
    }).catch(error => {
      return errorHandle(error)
    });
  };
}


export function fetchReportSchedule(payload) {
  return function (dispatch) {
    return ReportScheduleService.fetchReportSchedule(payload).then(response => {
      return response;
    }).catch(error => {
      return errorHandle(error)
    });
  };
}


export function deleteReportSchdule(paylod) {
  return function (dispatch) {
    return ReportScheduleService.deleteReportSchdule(paylod).then(response => {
      return response;
    }).catch(error => {
      return errorHandle(error)
    });
  };
}

