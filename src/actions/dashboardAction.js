/*
 * @Author: Virendra Patidar 
 * @Date: 2018-11-16 10:09:10 
 * @Last Modified by:   Virendra Patidar 
 * @Last Modified time: 2018-11-16 10:09:10 
 */
import DashboardService from 'api/DashboardService'

import { errorHandle } from 'actions/errorHandling'

export function fetchSecurityAudit(payload) {
    return function (dispatch) {
        return DashboardService.fetchSecurityAudit(payload).then(response => {
            return response;
        }).catch(error => {
            return errorHandle(error)
        });
    };
}

export function fetchAssetInventory(payload) {
    return function (dispatch) {
        return DashboardService.fetchAssetInventory(payload).then(response => {
            return response;
        }).catch(error => {
            return errorHandle(error)
        });
    };
}

export function fetchSecurityAlert(payload) {
    return function (dispatch) {
        return DashboardService.fetchSecurityAlert(payload).then(response => {
            return response;
        }).catch(error => {
            return errorHandle(error)
        });
    };
}

export function fetchAssetByRegion(payload) {
    return function (dispatch) {
        return DashboardService.fetchAssetByRegion(payload).then(response => {
            return response;
        }).catch(error => {
            return errorHandle(error)
        });
    };
}

export function fetchIssues(payload) {
    return function (dispatch) {
        return DashboardService.fetchIssues(payload).then(response => {
            return response;
        }).catch(error => {
            return errorHandle(error)
        });
    };
}

export function fetchIssuesByService(payload) {
    return function (dispatch) {
        return DashboardService.fetchIssuesByService(payload).then(response => {
            return response;
        }).catch(error => {
            return errorHandle(error)
        });
    };
}

export function fetchAccounts(payload) {
    return function (dispatch) {
        return DashboardService.fetchAccounts(payload).then(response => {
            return response;
        }).catch(error => {
            return errorHandle(error)
        });
    };
}

export function fetchTotalAssets(payload) {
    return function (dispatch) {
        return DashboardService.fetchTotalAssets(payload).then(response => {
            return response;
        }).catch(error => {
            return errorHandle(error)
        });
    };
}

export function fetchSecurityGroups(payload) {
    return function (dispatch) {
        return DashboardService.fetchSecurityGroups(payload).then(response => {
            return response;
        }).catch(error => {
            return errorHandle(error)
        });
    };
}

export function fetchExternalIps(payload) {
    return function (dispatch) {
        return DashboardService.fetchExternalIps(payload).then(response => {
            return response;
        }).catch(error => {
            return errorHandle(error)
        });
    };
}