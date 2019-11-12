import requestWithToken from './requestWithToken'

function fetchSchedulerList(accountId) {
  return requestWithToken({
    url: '/api/1.0/cloud-accounts/',
    method: 'GET'
  });
}

function schedulerEdit(data) {
  return requestWithToken({
    url: 'scheduler/edit/',
    method: 'POST',
    data
  });
}

function schedulerEnableDisable(data) {
  return requestWithToken({
    url: 'scheduler/state/',
    method: 'POST',
    data
  });
}

function createScheduleRun(data) {
  return requestWithToken({
    url: 'scheduler/create/',
    method: 'POST',
    data
  });
}



const SchedulerSettingSerivce = {
    fetchSchedulerList,
    schedulerEdit,
    schedulerEnableDisable,
    createScheduleRun
  }
  
  export default SchedulerSettingSerivce;