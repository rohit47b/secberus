import requestWithToken from './requestWithToken'


function fetchSecurityIssue(data) {
    return requestWithToken({
        url: 'dashboard/security-issue-listing/',
        method: 'POST',
        data
    });
}

function fetchSecurityIssueDetails(data) {
    return requestWithToken({
        url: 'security-issues/detail/',
        method: 'POST',
        data
    });
}



const SecurityIssueService = {
    fetchSecurityIssue,
    fetchSecurityIssueDetails
}

export default SecurityIssueService;