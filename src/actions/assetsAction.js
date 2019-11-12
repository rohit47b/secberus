/*
 * @Author: Virendra Patidar 
 * @Date: 2018-11-16 09:31:15 
 * @Last Modified by: Virendra Patidar
 * @Last Modified time: 2019-03-14 11:25:51
 */
import AssetService from 'api/AssetService'

import { errorHandle } from 'actions/errorHandling'

export function fetchAssets(payload) {
  return function (dispatch) {
    return AssetService.fetchAssets(payload).then(response => {
      return response;
    }).catch(error => {
      return errorHandle(error)
    });
  };
}

export function fetchAsset(payload) {
  return function (dispatch) {
    return AssetService.fetchAsset(payload).then(response => {
      return response;
    }).catch(error => {
      return errorHandle(error)
    });
  };
}

export function suppressAssets(payload) {
  return function (dispatch) {
    return AssetService.suppressAssets(payload).then(response => {
      return response;
    }).catch(error => {
      return errorHandle(error)
    });
  };
}

export function unsuppressAssets(payload) {
  return function (dispatch) {
    return AssetService.unsuppressAssets(payload).then(response => {
      return response;
    }).catch(error => {
      return errorHandle(error)
    });
  };
}

export function setMaxScoreAssets(payload) {
  return function (dispatch) {
    return AssetService.setMaxScoreAssets(payload).then(response => {
      return response;
    }).catch(error => {
      return errorHandle(error)
    });
  };
}

export function setScoreAssets(payload) {
  return function (dispatch) {
    return AssetService.setScoreAssets(payload).then(response => {
      return response;
    }).catch(error => {
      return errorHandle(error)
    });
  };
}

export function fetchAssetTypes(payload) {
  return function (dispatch) {
    return AssetService.fetchAssetTypes(payload).then(response => {
      return response;
    }).catch(error => {
      return errorHandle(error)
    });
  };
}

export function fetchAssetsExcludedList(payload) {
  return function (dispatch) {
    return AssetService.fetchAssetsExcludedList(payload).then(response => {
      return response;
    }).catch(error => {
      return errorHandle(error)
    });
  };
}


export function fetchServiceAssets(payload) {
  return function (dispatch) {
    return AssetService.fetchServiceAssets(payload).then(response => {
      return response;
    }).catch(error => {
      return errorHandle(error)
    });
  };
}
export function assetAlertChangeUpdate(payload) {
  return function (dispatch) {
    return AssetService.assetAlertChangeUpdate(payload).then(response => {
      return response;
    }).catch(error => {
      return errorHandle(error)
    });
  };
}

