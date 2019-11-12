/*
 * @Author: Virendra Patidar 
 * @Date: 2018-10-30 10:12:46 
 * @Last Modified by: Virendra Patidar
 * @Last Modified time: 2019-01-09 16:32:48
 */
import requestWithToken from './requestWithToken'


function fetchRuleCategory() {
    return requestWithToken({
        url: 'rules/list/category',
        method: 'GET'
    });
}

function fetchPriorityList() {
    return requestWithToken({
        url: 'rules/list/severity',
        method: 'GET'
    });
}

function fetchRuleCount(data) {
    return requestWithToken({
        url: 'security-policy/rules/active-inactive/count/',
        method: 'POST',
        data
    });
}

function fetchRuleList() {
    return requestWithToken({
        url: '/api/1.0/rules',
        method: 'GET'
    });
}

function fetchRuleListByAccount(cloud_account_id) {
    return requestWithToken({
        url: '/api/1.0/cloud-account/'+cloud_account_id+'/rules',
        method: 'GET'
    });
}

function suppressRule(data) {
    return requestWithToken({
        url: 'api/1.0/cloud-account/'+data.cloud_account_id+'/rule/'+data.id+'/suppress',
        method: 'POST'
    });
}

function unsuppressRule(data) {
    return requestWithToken({
        url: 'api/1.0/cloud-account/'+data.cloud_account_id+'/rule/'+data.id+'/unsuppress',
        method: 'POST'
    });
}

function fetchRuleServiceList() {
    return requestWithToken({
        url: 'security-policy/service/list/',
        method: 'GET',
    });
}




const RuleService = {
    fetchRuleCategory,
    fetchPriorityList,
    fetchRuleCount,
    fetchRuleList,
    fetchRuleListByAccount,
    suppressRule,
    unsuppressRule,
    fetchRuleServiceList
}

export default RuleService;