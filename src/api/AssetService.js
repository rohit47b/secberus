/*
 * @Author: Virendra Patidar 
 * @Date: 2018-11-16 14:54:49 
 * @Last Modified by: Virendra Patidar
 * @Last Modified time: 2019-03-14 11:26:06
 */
import requestWithToken from './requestWithToken'


function fetchAssets(data) {
    let is_public = false
    let api_url = 'api/1.0/cloud-account/'+data.accountId+'/assets?sort_by='+data.sort_by+'&sort_order='+data.sort_order
    if (data.offset !== undefined && data.offset !== null && data.offset !== '') {
        api_url += '&offset='+data.offset
    }
    if (data.limit !== undefined && data.limit !== null && data.limit !== '') {
        api_url += '&limit='+data.limit
    }
    if (data.asset_type !== undefined && data.asset_type !== null && data.asset_type !== '') {
        api_url += '&asset_type_id='+data.asset_type
    }
    if (data.region !== undefined || data.is_public !== undefined) {
        api_url += '&data='
        if (data.region !== undefined && data.is_public !== undefined) {
            is_public = null
            if (data.is_public === 'yes') {
                is_public = true
            } else if (data.is_public === 'no') {
                is_public = false
            }
            api_url += encodeURIComponent('{"is_public": ' + is_public + ', "region": "' + data.region + '"}')
        } else {
            if (data.region !== undefined) {
                api_url += encodeURIComponent('{"region": "' + data.region + '"}')
            }
            if (data.is_public !== undefined) {
                is_public = null
                if (data.is_public === 'yes') {
                    is_public = true
                } else if (data.is_public === 'no') {
                    is_public = false
                }
                api_url += encodeURIComponent('{"is_public": ' + is_public + '}')
            }
        }
    }
    return requestWithToken({
        url: api_url,
        method: 'GET'
    });
}

function fetchAsset(data) {
    return requestWithToken({
        url: '/api/1.0/cloud-account/'+data.cloud_account_id+'/asset/'+data.id,
        method: 'GET'
    });
}

function suppressAssets(data) {
    return requestWithToken({
        url: 'api/1.0/cloud-account/'+data.cloud_account_id+'/asset/'+data.id+'/suppress',
        method: 'POST'
    });
}

function unsuppressAssets(data) {
    return requestWithToken({
        url: 'api/1.0/cloud-account/'+data.cloud_account_id+'/asset/'+data.id+'/unsuppress',
        method: 'POST'
    });
}

function setMaxScoreAssets(data) {
    return requestWithToken({
        url: 'api/1.0/cloud-account/'+data.cloud_account_id+'/asset/'+data.id+'/max-score',
        method: 'PUT',
        data: data.max_score
    });
}

function setScoreAssets(data) {
    return requestWithToken({
        url: 'api/1.0/cloud-account/'+data.cloud_account_id+'/asset/'+data.id+'/score',
        method: 'PUT',
        data: data.score
    });
}

function fetchAssetTypes(data) {
    return requestWithToken({
        url: 'api/1.0/asset-types',
        method: 'GET'
    });
}

function fetchAssetsExcludedList(data) {
    return requestWithToken({
        url: '/api/1.0/assets/excluded/list/1234',
        method: 'GET'
    });
}

function fetchServiceAssets(data) {
    return requestWithToken({
        url: 'assets/assets-list-by-service',
        method: 'POST',
        data
    });
}

function assetAlertChangeUpdate(data) {
    return requestWithToken({
        url: 'assets/exclude-toggle',
        method: 'POST',
        data
    });
}



const AssetService = {
    fetchAssets,
    fetchAsset,
    suppressAssets,
    unsuppressAssets,
    setMaxScoreAssets,
    setScoreAssets,
    fetchAssetTypes,
    fetchServiceAssets,
    assetAlertChangeUpdate,
    fetchAssetsExcludedList
}

export default AssetService;
