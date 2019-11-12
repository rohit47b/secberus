/*
 * @Author: Virendra Patidar 
 * @Date: 2018-07-24 10:17:00 
 * @Last Modified by: Virendra Patidar
 * @Last Modified time: 2018-11-16 14:53:22
 */


import * as types from '../constants/ActionTypes'

/**
 * Action snackbar message
 * @param {*} snackbarMessage
 */
export function showMessage(message) {
    return { type: types.SNACK_BAR_MASSAGE,message };
}