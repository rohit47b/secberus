import requestWithToken from './requestWithToken'

function fetchSecurityAudit(data) {
  return requestWithToken({
    url: 'dashboard/security/audit',
    method: 'POST',
    data
  });
}

function fetchAssetInventory(data) {
  return requestWithToken({
    url: 'dashboard/assets-inventory/',
    method: 'POST',
    data
  });
}


function fetchSecurityAlert(data) {
  return requestWithToken({
    url: 'dashboard/security/audit',
    method: 'POST',
    data
  });
}

function fetchAsset(data) {
  return requestWithToken({
    url: 'dashboard/security-alerts/',
    method: 'POST',
    data
  });
}

function fetchAssetByRegion(data) {
  return requestWithToken({
    url: 'dashboard/security-alerts-by-region/',
    method: 'POST',
    data
  });
}

function fetchIssues(data) {
  return requestWithToken({
    url: 'dashboard/security-issue/',
    method: 'POST',
    data
  });
}

function fetchIssuesByService(data) {
  return requestWithToken({
    url: 'dashboard/security-issue-by-service/',
    method: 'POST',
    data
  });
}

function fetchAccounts(data) {
  return requestWithToken({
    url: 'dashboard/total-account-count/',
    method: 'POST',
    data
  });
}

function fetchTotalAssets(data) {
  return requestWithToken({
    url: 'dashboard/total-assets/',
    method: 'POST',
    data
  });
}

function fetchSecurityGroups(data) {
  return requestWithToken({
    url: 'dashboard/security-groups/',
    method: 'POST',
    data
  });
}

function fetchExternalIps(data) {
  return requestWithToken({
    url: 'dashboard/external-ips/',
    method: 'POST',
    data
  });
}


const DashboardService = {
    fetchSecurityAudit,
    fetchAssetInventory,
    fetchSecurityAlert,
    fetchAsset,
    fetchAssetByRegion,
    fetchIssues,
    fetchIssuesByService,
    fetchAccounts,
    fetchTotalAssets,
    fetchSecurityGroups,
    fetchExternalIps
  }
  
  export default DashboardService;
  