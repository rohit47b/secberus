/*
 * @Author: Virendra Patidar 
 * @Date: 2019-03-05 12:04:52 
 * @Last Modified by: Virendra Patidar
 * @Last Modified time: 2019-05-20 13:05:57
 */

import AlertsService from 'api/AlertsService'

import { errorHandle } from 'actions/errorHandling'

export function fetchAlerts(payload) {
    return function (dispatch) {
        return AlertsService.fetchAlerts(payload).then(response => {
            return response;
        }).catch(error => {
            return errorHandle(error)
        });
    };
}

export function unSuppressAlert(cloudAccountId,alertId) {
    return function (dispatch) {
        return AlertsService.unSuppressAlert(cloudAccountId,alertId).then(response => {
            return response;
        }).catch(error => {
            return errorHandle(error)
        });
    };
}

export function suppressAlert(cloudAccountId,alertId) {
    return function (dispatch) {
        return AlertsService.suppressAlert(cloudAccountId,alertId).then(response => {
            return response;
        }).catch(error => {
            return errorHandle(error)
        });
    };
}

export function fetchAlert(payload) {
    return function (dispatch) {
        return AlertsService.fetchAlert(payload).then(response => {
            return response;
        }).catch(error => {
            return errorHandle(error)
        });
    };
}

export function updateAlert(cloudAccountId,alertId) {
    return function (dispatch) {
        const data = {
            cloudAccountId: cloudAccountId,
            alertId: alertId
        }
        return AlertsService.updateAlert(data).then(response => {
            return response;
        }).catch(error => {
            return errorHandle(error)
        });
    };
}

export function addCommentAlert(cloudAccountId,alertId,data) {
    return function (dispatch) {
        return AlertsService.addCommentAlert(cloudAccountId,alertId,data).then(response => {
            return response;
        }).catch(error => {
            return errorHandle(error)
        });
    };
}