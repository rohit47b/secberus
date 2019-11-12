/*
 * @Author: Virendra Patidar 
 * @Date: 2018-11-02 12:48:06 
 * @Last Modified by: Virendra Patidar
 * @Last Modified time: 2018-11-05 11:07:11
 */
import requestWithToken from './requestWithToken'


function slackWebHookIntegrate(data) {
    return requestWithToken({
        url: 'bot/webhook/edit/',
        method: 'POST',
        data
    });
}

function fetchSlackDetails(data) {
    return requestWithToken({
        url: 'bot/webhook/get/',
        method: 'POST',
        data
    });
}

const SlackIntegrationService = {
    slackWebHookIntegrate,
    fetchSlackDetails
}

export default SlackIntegrationService;
