import requestWithToken from './requestWithToken'


function fetchPolicyList(data) {
    return requestWithToken({
        url: '/api/1.0/account/policies',
        method: 'GET',
        data
    });
}

function fetchDefaultSecurityPolicyRule() {
    return requestWithToken({
        url: 'security-policy/wizard/list/',
        method: 'GET',
    });
}

function defaultPolicyRun(data) {
    return requestWithToken({
        url: 'security-policy/create/default/',
        method: 'POST',
        data
    });
}

function pull(data) {
    return requestWithToken({
        url: 'pull/',
        method: 'POST',
        data
    });
}

function pullAssetsProgress(data) {
    return requestWithToken({
        url: 'pull/state/',
        method: 'POST',
        data
    });
}

function skipPolicyRun() {
    return requestWithToken({
        url: 'users/onboard/skip/',
        method: 'GET'
    });
}

function enableDisablePolicy(data) {
    return requestWithToken({
        url: 'security-policy/update/state/',
        method: 'POST',
        data
    });
}


function enableDisableRule(data) {
    return requestWithToken({
        url: 'security-policy/update/rule/state',
        method: 'POST',
        data
    });
}



function fetchPolicyCount(data) {
    return requestWithToken({
        url: 'security-policy/state/count/',
        method: 'POST',
        data
    });
}


function fetchPolicyDetailReport(data) {
    return requestWithToken({
        url: 'reporting/account/policy/detail/report',
        method: 'POST',
        data
    });
}

function fetchReportPolicyList(data) {
    return requestWithToken({
        url: 'reporting/policy/list',
        method: 'POST',
        data
    });
}

function fetchPolicyReport(data) {
    return requestWithToken({
        url: 'reporting/policy/report',
        method: 'POST',
        data
    });
}




function fetchPolicyReportCount(data) {
    return requestWithToken({
        url: 'reporting/policy/report/count',
        method: 'POST',
        data
    });
}

function fetchPolicyWizardCount() {
    return requestWithToken({
        url: 'security-policy/wizard/count/',
        method: 'GET',
    });
}


function editPolicyName(data) {
    return requestWithToken({
        url: 'security-policy/update/name/',
        method: 'POST',
        data
    });
}





const SecurityPolicyService = {
    fetchDefaultSecurityPolicyRule,
    defaultPolicyRun,
    pullAssetsProgress,
    pull,
    skipPolicyRun,
    fetchPolicyList,
    enableDisablePolicy,
    enableDisableRule,
    fetchPolicyCount,
    fetchPolicyDetailReport,
    fetchReportPolicyList,
    fetchPolicyReport,
    fetchPolicyReportCount,
    fetchPolicyWizardCount,
    editPolicyName
}

export default SecurityPolicyService;