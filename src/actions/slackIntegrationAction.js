/*
 * @Author: Virendra Patidar 
 * @Date: 2018-11-02 12:46:16 
 * @Last Modified by: Virendra Patidar
 * @Last Modified time: 2018-11-05 11:07:52
 */
import SlackIntegrationService from 'api/SlackIntegrationService'

import { errorHandle } from 'actions/errorHandling'

export function slackWebHookIntegrate(payload) {
    return function (dispatch) {
        return SlackIntegrationService.slackWebHookIntegrate(payload).then(response => {
            return response;
        }).catch(error => {
            return errorHandle(error)
        });
    };
}

export function fetchSlackDetails(payload) {
    return function (dispatch) {
        return SlackIntegrationService.fetchSlackDetails(payload).then(response => {
            return response;
        }).catch(error => {
            return errorHandle(error)
        });
    };
}
