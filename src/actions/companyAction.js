/*
 * @Author: Virendra Patidar 
 * @Date: 2018-10-30 11:13:53 
 * @Last Modified by: Virendra Patidar
 * @Last Modified time: 2018-11-23 11:47:34
 */

import * as types from '../constants/ActionTypes'

import CompanyService from 'api/CompanyService'

import { errorHandle } from 'actions/errorHandling'

export function fetchCompanyList() {
    return function (dispatch) {
        return CompanyService.fetchCompanyList().then(response => {
            if (response.success) {
                localStorage.setItem('companyId', response.data.list[0].id)
                dispatch(setCompanyDetails(response.data.list[0]));
            }
            return response
        }).catch(error => {
            return errorHandle(error)
        });
    };
}

export function setCompanyDetails(company) {
    return { type: types.SET_COMPANY, company };
}