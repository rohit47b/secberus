import requestWithToken from './requestWithToken'

const account_id=localStorage.getItem('account_id')

function fetchAlertSummery(data) {
  return requestWithToken({
    url: 'api/1.0/cloud-account/'+data.accountId+'/alert-summary',
    method: 'GET'
  });
}

function fetchRiskScoreSummery(data) {
    return requestWithToken({
      url: 'api/1.0/cloud-account/'+data.accountId+'/risk-score',
      method: 'GET'
    });
  }
  
  function fetchRemediation(data) {
    return requestWithToken({
      url: 'api/1.0/cloud-account/'+data.accountId+'/remediation-summary',
      method: 'GET'
    });
  }
  
  function fetchLatestScan(data) {
    return requestWithToken({
        url: 'api/1.0/cloud-account/'+data.cloud_account_id+'/latest-scan',
        method: 'GET'
    });
} 

function fetchSecurityReport(cloud_account_id) {
  return requestWithToken({
      url: 'api/1.0/cloud-account/'+cloud_account_id+'/security-report',
      method: 'GET'
  });
} 


function fetchSecurityRiskTrend(data) {
  return requestWithToken({
      url: 'api/1.0/cloud-account/'+data.cloud_account_id+'/risk-trend?period='+data.period,
      method: 'GET'
  });
} 
function fetchAccountGrowthTrend(data) {
  return requestWithToken({
      url: 'api/1.0/cloud-account/'+data.cloud_account_id+'/growth-trend?period='+data.period,
      method: 'GET'
  });
} 


const SecurityService = {
    fetchAlertSummery,
    fetchRiskScoreSummery,
    fetchRemediation,
    fetchLatestScan,
    fetchSecurityReport,
    fetchSecurityRiskTrend,
    fetchAccountGrowthTrend
  }
  
  export default SecurityService;
