/*
 * @Author: Virendra Patidar 
 * @Date: 2018-11-16 10:09:10 
 * @Last Modified by: Virendra Patidar
 * @Last Modified time: 2019-05-30 13:12:23
 */
import SecurityService from 'api/SecurityService'

import { errorHandle } from 'actions/errorHandling'

export function fetchAlertSummery(payload) {
    return function (dispatch) {
        return SecurityService.fetchAlertSummery(payload).then(response => {
            return response;
        }).catch(error => {
            return errorHandle(error)
        });
    };
}


export function fetchRiskScoreSummery(payload) {
    return function (dispatch) {
        return SecurityService.fetchRiskScoreSummery(payload).then(response => {
            return response;
        }).catch(error => {
            return errorHandle(error)
        });
    };
}

export function fetchRemediation(payload) {
    return function (dispatch) {
        return SecurityService.fetchRemediation(payload).then(response => {
            return response;
        }).catch(error => {
            return errorHandle(error)
        });
    };
}

export function fetchLatestScan(payload) {
    return function (dispatch) {
        return SecurityService.fetchLatestScan(payload).then(response => {
            return response;
        }).catch(error => {
            return errorHandle(error)
        });
    };
}

export function fetchSecurityReport(payload) {
    return function (dispatch) {
        return SecurityService.fetchSecurityReport(payload).then(response => {
            return response;
        }).catch(error => {
            return errorHandle(error)
        });
    };
}

export function fetchSecurityRiskTrend(payload) {
    return function (dispatch) {
        return SecurityService.fetchSecurityRiskTrend(payload).then(response => {
            return response;
        }).catch(error => {
            return errorHandle(error)
        });
    };
}


export function fetchAccountGrowthTrend(payload) {
    return function (dispatch) {
        return SecurityService.fetchAccountGrowthTrend(payload).then(response => {
            return response;
        }).catch(error => {
            return errorHandle(error)
        });
    };
}



