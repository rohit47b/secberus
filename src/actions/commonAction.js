/*
 * @Author: Virendra Patidar 
 * @Date: 2018-09-05 09:25:32 
 * @Last Modified by: Virendra Patidar
 * @Last Modified time: 2019-04-25 10:57:23
 */
import * as types from 'constants/ActionTypes'

import { errorHandle } from 'actions/errorHandling'

import CommonService from 'api/CommonService'

export function fetchCountry() {
    return function (dispatch) {
        return CommonService.countryList().then(response => {
            if (response.success) {
                return response.data.list
            } else {
                return []
            }
        }).catch(error => {
            return errorHandle(error)
        });
    };
}

export function fetchState(countryCode) {
    return function (dispatch) {
        return CommonService.stateList(countryCode).then(response => {
            if (response.success) {
                return response.data.list
            } else {
                return []
            }
        }).catch(error => {
            return [];
        });
    };
}

export function fetchTimeZone(countryCode) {
    return function (dispatch) {
        return CommonService.fetchTimeZone(countryCode).then(response => {
            if (response.success) {
                return response.data
            } else {
                return []
            }
        }).catch(error => {
            return [];
        });
    };
}


export function fetchCompliances() {
    return function (dispatch) {
        return CommonService.fetchCompliances().then(response => {
            if (response.success) {
                return response
            } else {
                return []
            }
        }).catch(error => {
            return [];
        });
    };
}

export function reportBug(data) {
    return function (dispatch) {
        return CommonService.reportBug(data).then(response => {
            return response
        }).catch(error => {
            return errorHandle(error)
        });
    };
}

export function setHeaderFilterData(filterData) {
    return { type: types.FILTER_SEARCH_BAR, filterData };
}

export function setActiveMenu(activeMenu) {
    return { type: types.ACTIVE_MENU, activeMenu };
}

export function setAwsList(awsList) {
    return { type: types.AWS_LIST, awsList };
}

export function setComplianceList(complianceList) {
    return { type: types.COMPLIANCE_LIST, complianceList };
}

export function setPriorityList(priorityList) {
    return { type: types.PRIORITY_LIST, priorityList };
}

export function setProgressBar(isProgress) {
    return { type: types.PROGRESS_BAR, isProgress };
}

export function setOpen(open) {
    return { type: types.OPEN, open };
}

export function setReportTabValue(reportTabValue) {
    return { type: types.REPORT_TAB_VALUE, reportTabValue };
}

export function setActiveParentMenu(activeParentMenu) {
    return { type: types.ACTIVE_PARENT_MENU, activeParentMenu };
}

export function setAutoRefresh(autoRefresh) {
    return { type: types.AUTO_REFRESH, autoRefresh };
}

export function setCountAssets(countAssets) {
    return { type: types.COUNT_ASSETS, countAssets };
}

export function setDimentions(dimentions) {
    return { type: types.DIMENTIONS, dimentions };
}

export function setAccountAlerts(accountAlerts) {
    return { type: types.ACCOUNT_ALERTS, accountAlerts };
}

export function setRiskScores(riskScores) {
    return { type: types.RISK_SCORES, riskScores };
}

export function setCompliancePercent(compliancePercent) {
    return { type: types.COMPLIANCE_PERCENT, compliancePercent };
}

export function setAccountAssets(accountAssets) {
    return { type: types.ACCOUNT_ASSETS, accountAssets };
}

export function setAccountFailedAssets(accountFailedAssets) {
    return { type: types.ACCOUNT_FAILED_ASSETS, accountFailedAssets };
}

export function setMttd(mttd) {
    return { type: types.MTTD, mttd };
}

export function setAlertsPlan(alerts_plan) {
    return { type: types.ALERTS_PLAN, alerts_plan };
}