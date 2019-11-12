/*
 * @Author: Virendra Patidar 
 * @Date: 2018-10-30 10:10:03 
 * @Last Modified by: Virendra Patidar
 * @Last Modified time: 2019-01-07 13:27:28
 */
import history from 'customHistory'

import * as types from 'constants/ActionTypes'
import SubscriptionService from 'api/SubscriptionService'

import { errorHandle } from 'actions/errorHandling'

import { store } from 'client'

export function fetchSubscriptionsPlans() {
    return function (dispatch) {
        return SubscriptionService.fetchSubscriptionsPlans().then(response => {
            return response
        }).catch(error => {
            return errorHandle(error)
        });
    };
}


export function checkIsTailPeriodFinishedAndNotSubsribed() {
    return function (dispatch) {

        const currentState = store.getState()
        let company = currentState.userReducer.company
        const loginAsDetail = currentState.userReducer.loginAsDetail
        
        if(loginAsDetail.isLogin===true){
            company=loginAsDetail.company
        }

        if (company !== undefined && company.is_permanent === true) {
            return true
        } else {
            return SubscriptionService.fetchSubscriptionsRemainingTrial().then(response => {
                if (response.success) {
                    if (response.data === 0) {
                        const payload = {
                            company_id: localStorage.getItem('companyId'),
                            account_id: localStorage.getItem('account_id')
                        }
                        SubscriptionService.fetchSubscriptionsHistorySubscriptions(payload).then(response1 => {
                            var isSubscribed = false
                            if (response1.data.length > 0) {
                                if (response1.data[0]['status'] == 'active') {
                                    isSubscribed = true
                                }
                            }
                            if (isSubscribed) {
                                const trailData = { isPurchased: true, trailPeriodRemainigDays: 0 }
                                dispatch(setTrailPeriodData(trailData));
                            } else {
                                const trailData = { isPurchased: false, trailPeriodRemainigDays: 0 }
                                dispatch(setTrailPeriodData(trailData));
                                history.push(`/app/subscribe`)
                            }
                            return !isSubscribed
                        }).catch(error => {
                            const trailData = { isPurchased: false, trailPeriodRemainigDays: 0 }
                            dispatch(setTrailPeriodData(trailData));
                            history.push(`/app/subscribe`)
                            return true
                        });
                    } else {
                        const trailData = { isPurchased: false, trailPeriodRemainigDays: response.data }
                        dispatch(setTrailPeriodData(trailData));
                        return false
                    }
                } else {
                    history.push(`/app/subscribe`)
                    const trailData = { isPurchased: true, trailPeriodRemainigDays: 0 }
                    dispatch(setTrailPeriodData(trailData));
                    return true;
                }
                return response
            }).catch(error => {
                const trailData = { isPurchased: true, trailPeriodRemainigDays: 0 }
                dispatch(setTrailPeriodData(trailData));
                history.push(`/app/dashboard/home`)
                return true
            });
        }
    };
}

export function subscriptionsPlan(payload) {
    return function (dispatch) {
        return SubscriptionService.subscriptionsPlan(payload).then(response => {
            return response
        }).catch(error => {
            return errorHandle(error)
        });
    };
}



export function fetchSubscriptionsHistoryInvoices(payload) {
    return function (dispatch) {
        return SubscriptionService.fetchSubscriptionsHistoryInvoices(payload).then(response => {
            return response
        }).catch(error => {
            return errorHandle(error)
        });
    };
}

export function fetchSubscriptionsHistorySubscriptions(payload) {
    return function (dispatch) {
        return SubscriptionService.fetchSubscriptionsHistorySubscriptions(payload).then(response => {
            return response
        }).catch(error => {
            return errorHandle(error)
        });
    };
}

export function subscribeCancel(payload) {
    return function (dispatch) {
        return SubscriptionService.subscribeCancel(payload).then(response => {
            return response
        }).catch(error => {
            return errorHandle(error)
        });
    };
}


export function fetchSubscribeCustomer() {
    return function (dispatch) {
        const payload = {
            company_id: localStorage.getItem('companyId')
        }
        return SubscriptionService.fetchSubscribeCustomer(payload).then(response => {
            return response
        }).catch(error => {
            return errorHandle(error)
        });
    };
}

export function setTrailPeriodData(trailData) {
    return { type: types.SET_TRAIL_PERIOD_DATA, trailData };
}