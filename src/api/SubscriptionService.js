/*
 * @Author: Virendra Patidar 
 * @Date: 2018-10-30 10:12:32 
 * @Last Modified by: Virendra Patidar
 * @Last Modified time: 2018-10-31 17:16:32
 */
import requestWithToken from './requestWithToken'

function fetchSubscriptionsPlans() {
    return requestWithToken({
        url: 'subscriptions/plans/',
        method: 'GET'
    });
}
function fetchSubscriptionsRemainingTrial() {
    return requestWithToken({
        url: 'subscriptions/remaining-trial/',
        method: 'GET'
    });
}

function subscriptionsPlan(data) {
    return requestWithToken({
        url: 'subscriptions/subscribe/',
        method: 'POST',
        data
    });
}

function fetchSubscriptionsHistoryInvoices(data) {
    return requestWithToken({
        url: 'subscriptions/history/invoices/',
        method: 'POST',
        data
    });
}

function fetchSubscriptionsHistorySubscriptions(data) {
    /* return requestWithToken({
        url: 'subscriptions/history/subscriptions/',
        method: 'POST',
        data
    }); */
    return {success: true, data: [], message: "Subscriptions list"}
}

function subscribeCancel(data) {
    return requestWithToken({
        url: 'subscriptions/subscribe/cancel/',
        method: 'POST',
        data
    });
}

function fetchSubscribeCustomer(data) {
    return requestWithToken({
        url: 'subscriptions/customer/',
        method: 'POST',
        data
    });
}




const SubscriptionService = {
    fetchSubscriptionsPlans,
    fetchSubscriptionsRemainingTrial,
    subscriptionsPlan,
    fetchSubscriptionsHistoryInvoices,
    fetchSubscriptionsHistorySubscriptions,
    subscribeCancel,
    fetchSubscribeCustomer
}

export default SubscriptionService;



