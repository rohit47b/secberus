import requestWithToken from './requestWithToken'

function create(data) {
  return requestWithToken({
    url: 'api/1.0/cloud-accounts',
    method: 'POST',
    data
  });
}

function fetchExternalId() {
  return requestWithToken({
    url: '/api/1.0/utilities/external-id/',
    method: 'GET',
  });
}

function addCollaborator(data) {
  return requestWithToken({
    url: 'collaborator/add/',
    method: 'POST',
    data
  });
}

function fetchIntegrationList() {
  return requestWithToken({
    url: 'api/1.0/cloud-accounts',
    method: 'GET',
  }); 
}

function deleteIntegrationAccount(data) {
  return requestWithToken({
    url: 'integrations/delete/',
    method: 'POST',
    data
  });
}

function fetchServiceList() {
  return requestWithToken({
    url: 'integrations/services/list/',
    method: 'GET',
  });
}

function deleteUserAccount() {
  return requestWithToken({
    url: '/api/1.0/account/',
    method: 'DELETE',
  });
}

function updateAccount(data) {
  return requestWithToken({
    url: '/api/1.0/cloud-account/' + data.id,
    method: 'PUT',
    data
  });
}

function deleteCloudAccount(cloudId, data) {
  return requestWithToken({
    url: '/api/1.0/cloud-account/' + cloudId,
    method: 'DELETE',
  });
}

function fetchIntegrations() {
  return requestWithToken({
    url: '/api/1.0/integrations',
    method: 'GET',
  });
}

function addIntegrationsHttp(data) {
  return requestWithToken({
    url: '/api/1.0/integrations/http',
    method: 'POST',
    data
  });
}

function fetchIntegrationsHttp() {
  return requestWithToken({
    url: '/api/1.0/integrations/http',
    method: 'GET',
  });
}

function updateIntegrationHttp(data) {
  return requestWithToken({
    url: '/api/1.0/integrations/http/' + data.id,
    method: 'PUT',
    data
  });
}

function fetchIntegrationHttp(id) {
  return requestWithToken({
    url: '/api/1.0/integrations/http/' + id,
    method: 'GET',
  });
}

function deleteIntegrationHttp(id) {
  return requestWithToken({
    url: '/api/1.0/integrations/http/' + id,
    method: 'DELETE',
  });
}

function enableIntegrationHttp(id) {
  return requestWithToken({
    url: '/api/1.0/integrations/http/' + id + '/enable',
    method: 'POST',
    data
  });
}

function disableIntegrationHttp(id) {
  return requestWithToken({
    url: '/api/1.0/integrations/http/' + id + '/disable',
    method: 'POST',
    data
  });
}


function addIntegrationsSmtp(data) {
  return requestWithToken({
    url: '/api/1.0/integrations/smtp',
    method: 'POST',
    data
  });
}

function fetchIntegrationsSmtp() {
  return requestWithToken({
    url: '/api/1.0/integrations/smtp',
    method: 'GET',
  });
}

function updateIntegrationSmtp(data) {
  return requestWithToken({
    url: '/api/1.0/integrations/smtp/' + data.id,
    method: 'PUT',
    data
  });
}

function fetchIntegrationSmtp(id) {
  return requestWithToken({
    url: '/api/1.0/integrations/smtp/' + id,
    method: 'GET',
  });
}

function deleteIntegrationSmtp(id) {
  return requestWithToken({
    url: '/api/1.0/integrations/smtp/' + id,
    method: 'DELETE',
  });
}

function enableIntegrationSmtp(id) {
  return requestWithToken({
    url: '/api/1.0/integrations/smtp/' + id + '/enable',
    method: 'POST',
  });
}

function disableIntegrationSmtp(id) {
  return requestWithToken({
    url: '/api/1.0/integrations/smtp/' + id + '/disable',
    method: 'POST',
  });
}

function fetchNotificationEvents() {
  return requestWithToken({
    url: '/api/1.0/notification-events',
    method: 'GET',
  });
}

function fetchNotificationMapping(data) {
  return requestWithToken({
    url: '/api/1.0/notification-mappings',
    method: 'POST',
    data
  });
}

const IntegrationService = {
  create,
  fetchExternalId,
  addCollaborator,
  fetchIntegrationList,
  deleteIntegrationAccount,
  fetchServiceList,
  deleteUserAccount,
  updateAccount,
  deleteCloudAccount,
  fetchNotificationEvents,
  fetchNotificationMapping,
  addIntegrationsHttp,
  fetchIntegrations,
  fetchIntegrationsHttp,
  updateIntegrationHttp,
  fetchIntegrationHttp,
  deleteIntegrationHttp,
  enableIntegrationHttp,
  disableIntegrationHttp,
  addIntegrationsSmtp,
  fetchIntegrationsSmtp,
  fetchIntegrationSmtp,
  updateIntegrationSmtp,
  deleteIntegrationSmtp,
  enableIntegrationSmtp,
  disableIntegrationSmtp
}

export default IntegrationService;