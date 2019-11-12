import request from './request'
import requestWithToken from './requestWithToken'

function countryList() {
  return request({
    url: 'countryList/',
    method: 'GET'
  });
}

function stateList(countryCode) {
  return request({
    url: 'stateList/' + countryCode + '/',
    method: 'GET'
  });
}

function fetchTimeZone(countryCode) {
  return request({
    url: 'tzList/' + countryCode + '/',
    method: 'GET'
  });
}


function fetchCompliances() {
  return requestWithToken({
    url: 'reporting/list/compliances',
    method: 'GET'
  });
}

function reportBug(data) {
  return requestWithToken({
    url: 'api/1.0/system/bug-report',
    method: 'POST',
    data
  });
}


const CommonService = {
  countryList,
  stateList,
  fetchTimeZone,
  fetchCompliances,
  reportBug
}

export default CommonService;
