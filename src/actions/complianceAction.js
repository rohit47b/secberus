/*
 * @Author: Virendra Patidar 
 * @Date: 2018-11-16 10:09:10 
 * @Last Modified by: Virendra Patidar
 * @Last Modified time: 2019-02-26 15:20:28
 */
import ComplianceService from 'api/ComplianceService'

import { errorHandle } from 'actions/errorHandling'

export function fetchComplianceSummery(payload) {
    return function (dispatch) {
        return ComplianceService.fetchComplianceSummery(payload).then(response => {
            return response;
        }).catch(error => {
            return errorHandle(error)
        });
    };
}


export function fetchComplianceTrend(payload) {
    return function (dispatch) {
        return ComplianceService.fetchComplianceTrend(payload).then(response => {
            return response;
        }).catch(error => {
            return errorHandle(error)
        });
    };
}

export function fetchComplianceDetails(payload) {
    return function (dispatch) {
        return ComplianceService.fetchComplianceDetails(payload).then(response => {
            return response;
        }).catch(error => {
            return errorHandle(error)
        });
    };
}

export function fetchComplianceReport(payload) {
    return function (dispatch) {
        return ComplianceService.fetchComplianceReport(payload).then(response => {
            return response;
        }).catch(error => {
            return errorHandle(error)
        });
    };
}