import requestWithToken from './requestWithToken'
const account_id=localStorage.getItem('account_id')


function fetchComplianceSummery(data) {
  return requestWithToken({
    url: 'api/1.0/cloud-account/'+data.accountId+'/compliance-summary',
    method: 'GET'
  });
}

function fetchComplianceTrend(data) {
    return requestWithToken({
      url: 'api/1.0/cloud-account/'+data.accountId+'/compliance-trend?period='+data.period,
      method: 'GET'
    });
  }
  
  function fetchComplianceDetails(data) {
    return requestWithToken({
      url: 'api/1.0/cloud-account/'+data.accountId+'/compliance-summary',
      method: 'GET'
    });
  }

function fetchComplianceReport(data) {
  return requestWithToken({
    url: 'api/1.0/cloud-account/'+data.cloud_account_id+'/compliance-report',
    method: 'GET'
  });
}
  
const ComplianceService = {
    fetchComplianceSummery,
    fetchComplianceTrend,
    fetchComplianceDetails,
    fetchComplianceReport
  }
  
  export default ComplianceService;
