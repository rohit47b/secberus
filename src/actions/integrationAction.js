/*
 * @Author: Virendra Patidar 
 * @Date: 2018-11-16 10:08:22 
 * @Last Modified by: Virendra Patidar
 * @Last Modified time: 2018-12-06 15:53:32
 */
import * as types from 'constants/ActionTypes'

import IntegrationService from '../api/IntegrationService'
import { errorHandle } from 'actions/errorHandling'

import { reset, initialize } from 'redux-form'
/**
 * Action used for authenticate user
 * @param {*} signupPayload 
 */
export function integrationCreate(payload) {
  return function (dispatch) {
    return IntegrationService.create(payload).then(response => {
      mixpanel.track("Add Cloud Account");
      return response;
    }).catch(error => {
      return errorHandle(error)
    });
  };
}

export function resetOnbaordForm() {
  return function (dispatch) {
    dispatch(reset('integrationcreate'));
    // dispatch(reset('login'));
    dispatch(initialize('integrationInvite', { 'emails': [''] }));
  };
}

export function fetchExternalId() {
  return function (dispatch) {
    return IntegrationService.fetchExternalId().then(response => {
      if (response.success) {
        return response.data.id;
      }
      else {
        return response;
      }
    }).catch(error => {
      return errorHandle(error)
    });
  };
}

export function addCollaborator(payload) {
  return function (dispatch) {
    return IntegrationService.addCollaborator(payload).then(response => {
      return response;
    }).catch(error => {
      return errorHandle(error)
    });
  };
}


export function fetchIntegrationList() {
  return function (dispatch) {
    return IntegrationService.fetchIntegrationList().then(response => {
      return response;
    }).catch(error => {
      return errorHandle(error)
    });
  };
}

export function deleteIntegrationAccount(payload) {
  return function (dispatch) {
    return IntegrationService.deleteIntegrationAccount(payload).then(response => {
      return response;
    }).catch(error => {
      return errorHandle(error)
    });
  };
}

export function fetchServiceList() {
  return function (dispatch) {
    return IntegrationService.fetchServiceList().then(response => {
      dispatch(setServiceList(response.data))
      return response;
    }).catch(error => {
      return errorHandle(error)
    });
  };
}

export function setServiceList(serviceList) {
  return { type: types.SERVICE_LIST, serviceList };
}

export function deleteUserAccount() {
  return function (dispatch) {
    return IntegrationService.deleteUserAccount().then(response => {
      return response;
    }).catch(error => {
      return errorHandle(error)
    });
  };
}

export function updateAccount(cloudId) {
  return function (dispatch) {
    return IntegrationService.updateAccount(cloudId).then(response => {
      return response;
    }).catch(error => {
      return errorHandle(error)
    });
  };
}

export function deleteCloudAccount(cloudId) {
  return function (dispatch) {
    return IntegrationService.deleteCloudAccount(cloudId).then(response => {
      return response;
    }).catch(error => {
      return errorHandle(error)
    });
  };
}

///
export function addIntegrationsHttp(data) {
  return function (dispatch) {
    return IntegrationService.addIntegrationsHttp(data).then(response => {
      return response;
    }).catch(error => {
      return errorHandle(error)
    });
  };
}

export function fetchIntegrations() {
  return function (dispatch) {
    return IntegrationService.fetchIntegrations().then(response => {
      return response;
    }).catch(error => {
      return errorHandle(error)
    });
  };
}

export function fetchIntegrationsHttp() {
  return function (dispatch) {
    return IntegrationService.fetchIntegrationsHttp().then(response => {
      return response;
    }).catch(error => {
      return errorHandle(error)
    });
  };
}

export function updateIntegrationHttp(data) {
  return function (dispatch) {
    return IntegrationService.updateIntegrationHttp(data).then(response => {
      return response;
    }).catch(error => {
      return errorHandle(error)
    });
  };
}

export function fetchIntegrationHttp(id) {
  return function (dispatch) {
    return IntegrationService.fetchIntegrationHttp(id).then(response => {
      return response;
    }).catch(error => {
      return errorHandle(error)
    });
  };
}

export function deleteIntegrationHttp(id) {
  return function (dispatch) {
    return IntegrationService.deleteIntegrationHttp(id).then(response => {
      return response;
    }).catch(error => {
      return errorHandle(error)
    });
  };
}

export function enableIntegrationHttp(id) {
  return function (dispatch) {
    return IntegrationService.enableIntegrationHttp(id).then(response => {
      return response;
    }).catch(error => {
      return errorHandle(error)
    });
  };
}

export function disableIntegrationHttp(id) {
  return function (dispatch) {
    return IntegrationService.disableIntegrationHttp(id).then(response => {
      return response;
    }).catch(error => {
      return errorHandle(error)
    });
  };
}

export function addIntegrationsSmtp(data) {
  return function (dispatch) {
    return IntegrationService.addIntegrationsSmtp(data).then(response => {
      return response;
    }).catch(error => {
      return errorHandle(error)
    });
  };
}

export function fetchIntegrationsSmtp() {
  return function (dispatch) {
    return IntegrationService.fetchIntegrationsSmtp().then(response => {
      return response;
    }).catch(error => {
      return errorHandle(error)
    });
  };
}

export function fetchIntegrationSmtp(id) {
  return function (dispatch) {
    return IntegrationService.fetchIntegrationSmtp(id).then(response => {
      return response;
    }).catch(error => {
      return errorHandle(error)
    });
  };
}

export function updateIntegrationSmtp(data) {
  return function (dispatch) {
    return IntegrationService.updateIntegrationSmtp(data).then(response => {
      return response;
    }).catch(error => {
      return errorHandle(error)
    });
  };
}

export function deleteIntegrationSmtp(id) {
  return function (dispatch) {
    return IntegrationService.deleteIntegrationSmtp(id).then(response => {
      return response;
    }).catch(error => {
      return errorHandle(error)
    });
  };
}

export function enableIntegrationSmtp(id) {
  return function (dispatch) {
    return IntegrationService.enableIntegrationSmtp(id).then(response => {
      return response;
    }).catch(error => {
      return errorHandle(error)
    });
  };
}

export function disableIntegrationSmtp(id) {
  return function (dispatch) {
    return IntegrationService.disableIntegrationSmtp(id).then(response => {
      return response;
    }).catch(error => {
      return errorHandle(error)
    });
  };
}

export function fetchNotificationEvents() {
  return function (dispatch) {
    return IntegrationService.fetchNotificationEvents().then(response => {
      return response;
    }).catch(error => {
      return errorHandle(error)
    });
  };
}

export function fetchNotificationMapping(data) {
  return function (dispatch) {
    return IntegrationService.fetchNotificationMapping(data).then(response => {
      return response;
    }).catch(error => {
      return errorHandle(error)
    });
  };
}