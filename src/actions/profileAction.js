/*
 * @Author: Virendra Patidar 
 * @Date: 2018-10-11 16:40:39 
 * @Last Modified by: Virendra Patidar
 * @Last Modified time: 2018-10-16 12:05:44
 */
import ProfileService from 'api/ProfileService'
import * as types from 'constants/ActionTypes'

import { errorHandle } from 'actions/errorHandling'

export function fetchProfileDetail() {
  return function (dispatch) {
    return ProfileService.fetchProfileDetail().then(response => {
      if (response.success) {
        dispatch(setProfileData(response.data))
      }
      return response
    }).catch(error => {
      return errorHandle(error)
    });
  };
}

export function updateProfileDetail(payload) {
  return function (dispatch) {
    return ProfileService.updateProfileDetail(payload).then(response => {
      return response
    }).catch(error => {
      return errorHandle(error)
    });
  };
}


export function photoUpload(file) {
  return function (dispatch) {
    var formData = new FormData();
    formData.append("image", file);
    return ProfileService.photoUpload(formData).then(response => {
      return response
    }).catch(error => {
      return errorHandle(error)
    });
  };
}

export function setProfileData(profile) {
  return { type: types.USER_PROFILE, profile };
}