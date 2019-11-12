/*
 * @Author: Virendra Patidar 
 * @Date: 2018-07-24 10:17:00 
 * @Last Modified by: Virendra Patidar
 * @Last Modified time: 2019-01-17 15:39:38
 */

import * as types from 'constants/ActionTypes'

/**
 * Action used after login success 
 * @param {*} responseLogin 
 */
export function showAssetModal(showAssetModal) {
    return { type: types.SHOW_ASSET_MODAL, showAssetModal };
}

/**
 * 
 */
export function closeAssetModal() {
    return { type: types.CLOSE_ASSET_MODAL };
}


export function setReloadFlagSearchBar(reloadSearchBar) {
    return { type: types.RELOAD_SEARCH_BAR, reloadSearchBar };
}

export function setSecurityIssueFilter(securityIssueFilter) {
    return { type: types.SECURITY_ISSUE_FILTER, securityIssueFilter };
}

export function setDashboardLayout(dashboardLayout) {
    return { type: types.DASHBOARD_LAYOUT, dashboardLayout };
}


export function setOpenReportBug(openReportBug) {
    return { type: types.OPEN_REPORT_BUG, openReportBug };
}