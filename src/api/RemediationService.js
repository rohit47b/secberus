import requestWithToken from './requestWithToken'
const account_id=localStorage.getItem('account_id')


function fetchPrioritzedAlerts(data) {
    return requestWithToken({
        url: '/api/1.0/cloud-account/'+data.account_id+'/remediation-plans/generate?criteria='+data.criteria,
        method: 'GET'
    });
}

function fetchRemediationPlans(data) {
    return requestWithToken({
        url: 'api/1.0/cloud-account/'+data.account_id+'/remediation-plans?limit='+data.limit+'&offset='+data.offset+'&sort_by='+data.sort_by+'&sort_order='+data.sort_order,
        method: 'GET'
    });
}
function savePlan(data) {
    return requestWithToken({
        url: '/api/1.0/cloud-account/'+data.account_id+'/remediation-plans',
        method: 'POST',
        data
    });
}

function addToPlan(data,cloud_account_id,planId) {
    return requestWithToken({
        url: '/api/1.0/cloud-account/'+cloud_account_id+'/remediation-plan/'+planId+'/alerts',
        method: 'POST',
        data
    });
}
function fetchRemediationPlanDetails(cloudAccountId,planId) {
    return requestWithToken({
        url: 'api/1.0/cloud-account/'+cloudAccountId+'/remediation-plan/'+planId,
        method: 'GET'
    });
}

function fetchRemediationFull(cloudAccountId) {
    return requestWithToken({
        url: 'api/1.0/cloud-account/'+cloudAccountId+'/remediation-plans-full',
        method: 'GET'
    });
}

function deleteRemediationPlan(cloudAccountId,planId) {
    return requestWithToken({
        url: 'api/1.0/cloud-account/'+cloudAccountId+'/remediation-plan/'+planId,
        method: 'DELETE'
    });
}


function deleteAlertFromRemediationPlan(cloudAccountId,planId,data) {
    return requestWithToken({
        url: 'api/1.0/cloud-account/'+cloudAccountId+'/remediation-plan/'+planId+'/alerts',
        method: 'DELETE',
        data
    });
}



function fetchRemediationPlanAlerts(cloudAccountId,planId) {
    return requestWithToken({
        url: 'api/1.0/cloud-account/'+cloudAccountId+'/remediation-plan/'+planId+'/alerts',
        method: 'GET'
    });
}


function fetchRemediationSummery(data) {
    return requestWithToken({
        url: 'api/1.0/cloud-account/'+data.cloud_account_id+'/remediation-summary',
        method: 'GET'
    });
}


function fetchPlanRiskScore(planId,cloud_account_id) {
    return requestWithToken({
        url: 'api/1.0/cloud-account/'+cloud_account_id+'/remediation-plan/'+planId+'/risk-score',
        method: 'GET'
    });
}

function fetchOverAllProjectedRiskScore(data) {
    return requestWithToken({
        url: '/api/1.0/remediation-plan/overall-projected-risk-score',
        method: 'GET'
    });
}

function fetchRemediationPlanCount(data) {
    return requestWithToken({
        url: '/api/1.0/remediation-plan/count/1234',
        method: 'GET'
    });
}


const RemediationService = {
    fetchPrioritzedAlerts,
    fetchRemediationPlanAlerts,
    savePlan,
    addToPlan,
    fetchRemediationFull,
    deleteRemediationPlan,
    deleteAlertFromRemediationPlan,
    fetchRemediationPlans,
    fetchRemediationSummery,
    fetchPlanRiskScore,
    fetchRemediationPlanDetails,
    fetchOverAllProjectedRiskScore,
    fetchRemediationPlanCount
}

export default RemediationService;
