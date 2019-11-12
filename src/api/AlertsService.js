import requestWithToken from './requestWithToken'

function fetchAlerts(data) {
    let uri = 'api/1.0/cloud-account/'+data.accountId+'/alerts?sort_by='+data.sort_by+'&sort_order='+data.sort_order
    if (data.priority !== undefined && data.priority !== null && data.priority !== '') {
        if (data.priority.toUpperCase() === 'SUPPRESSED') {
            uri += '&suppressed='+true
        } else {
            uri += '&priority='+data.priority.toUpperCase()
        }
    }
    if (data.limit !== undefined && data.limit !== null && data.limit !== '') {
        uri += '&limit='+data.limit
    }
    if (data.offset !== undefined && data.offset !== null && data.offset !== '') {
        uri += '&offset='+data.offset
    }
    if (data.status !== undefined && data.status !== null && data.status !== '') {
        uri += '&status='+data.status.toUpperCase()
    }
    if (data.asset_type !== undefined && data.asset_type !== null && data.asset_type !== '') {
        uri += '&asset_type='+data.asset_type
    }
    if (data.rule_id !== undefined && data.rule_id !== null && data.rule_id !== '') {
        uri += '&rule_id='+data.rule_id
    }
    if (data.asset_id !== undefined && data.asset_id !== null && data.asset_id !== '') {
        uri += '&asset_id='+data.asset_id
    }
    return requestWithToken({
        url: uri,
        method: 'GET'
    });
}

function unSuppressAlert(data) {
    return requestWithToken({
        url: 'api/1.0/cloud-account/'+data.cloud_account_id+'/alert/'+data.id+'/unsuppress',
        method: 'POST'
    });
}

function suppressAlert(data) {
    return requestWithToken({
        url: 'api/1.0/cloud-account/'+data.cloud_account_id+'/alert/'+data.id+'/suppress',
        method: 'POST'
    });
}

function fetchAlert(data) {
    return requestWithToken({
        url: 'api/1.0/cloud-account/'+data.cloud_account_id+'/alert/'+data.id,
        method: 'GET',
    });
}

function updateAlert(data) {
    return requestWithToken({
        url: 'api/1.0/cloud-account/'+data.cloud_account_id+'/alert/'+data.id,
        method: 'PUT',
        data
    });
}

function addCommentAlert(cloudAccountId,alertId,data) {
    return requestWithToken({
        url: 'api/1.0/cloud-account/'+cloudAccountId+'/alert/'+alertId+'/comments',
        method: 'POST',
        data
    });
}

const AlertsService = {
    fetchAlerts,
    unSuppressAlert,
    suppressAlert,
    updateAlert,
    addCommentAlert,
    fetchAlert
}

export default AlertsService;
