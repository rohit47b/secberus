/*
 * @Author: Virendra Patidar 
 * @Date: 2018-11-16 10:09:10 
 * @Last Modified by: Virendra Patidar
 * @Last Modified time: 2019-05-23 18:48:40
 */
import RemediationService from 'api/RemediationService'

import { errorHandle } from 'actions/errorHandling'

export function fetchPrioritzedAlerts(payload) {
    return function (dispatch) {
        return RemediationService.fetchPrioritzedAlerts(payload).then(response => {
            return response;
        }).catch(error => {
            return errorHandle(error)
        });
    };
}


export function savePlan(payload,cloud_account_id) {
    return function (dispatch) {
        return RemediationService.savePlan(payload,cloud_account_id).then(response => {
            return response;
        }).catch(error => {
            return errorHandle(error)
        });
    };
}

export function addToPlan(payload,cloud_account_id,planId) {
    return function (dispatch) {
        return RemediationService.addToPlan(payload,cloud_account_id,planId).then(response => {
            return response;
        }).catch(error => {
            return errorHandle(error)
        });
    };
}


export function fetchRemediationPlans(payload) {
    return function (dispatch) {
        return RemediationService.fetchRemediationPlans(payload).then(response => {
            return response;
        }).catch(error => {
            return errorHandle(error)
        });
    };
}

export function fetchPlanRiskScore(planId,cloud_account_id) {
    return function (dispatch) {
        return RemediationService.fetchPlanRiskScore(planId,cloud_account_id).then(response => {
            return response;
        }).catch(error => {
            return errorHandle(error)
        });
    };
}

export function fetchRemediationPlanAlerts(cloudAccountId,planId) {
    return function (dispatch) {
        return RemediationService.fetchRemediationPlanAlerts(cloudAccountId,planId).then(response => {
            return response;
        }).catch(error => {
            return errorHandle(error)
        });
    };
}

export function fetchRemediationFull(cloudAccountId) {
    return function (dispatch) {
        return RemediationService.fetchRemediationFull(cloudAccountId).then(response => {
            return response;
        }).catch(error => {
            return errorHandle(error)
        });
    };
}

export function deleteRemediationPlan(cloudAccountId,planId) {
    return function (dispatch) {
        return RemediationService.deleteRemediationPlan(cloudAccountId,planId).then(response => {
            return response;
        }).catch(error => {
            return errorHandle(error)
        });
    };
}

export function deleteAlertFromRemediationPlan(cloudAccountId,planId,alertIds) {
    return function (dispatch) {
        return RemediationService.deleteAlertFromRemediationPlan(cloudAccountId,planId,alertIds).then(response => {
            return response;
        }).catch(error => {
            return errorHandle(error)
        });
    };
}



export function fetchRemediationPlanDetails(cloudAccountId,planId) {
    return function (dispatch) {
        return RemediationService.fetchRemediationPlanDetails(cloudAccountId,planId).then(response => {
            return response;
        }).catch(error => {
            return errorHandle(error)
        });
    };
}


export function fetchRemediationSummery(planId) {
    return function (dispatch) {
        return RemediationService.fetchRemediationSummery(planId).then(response => {
            return response;
        }).catch(error => {
            return errorHandle(error)
        });
    };
}



export function fetchOverAllProjectedRiskScore(data) {
    return function (dispatch) {
        return RemediationService.fetchOverAllProjectedRiskScore(data).then(response => {
            return response;
        }).catch(error => {
            return errorHandle(error)
        });
    };
}

export function fetchRemediationPlanCount(data) {
    return function (dispatch) {
        return RemediationService.fetchRemediationPlanCount(data).then(response => {
            return response;
        }).catch(error => {
            return errorHandle(error)
        });
    };
}
