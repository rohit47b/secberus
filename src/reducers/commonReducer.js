import * as types from 'constants/ActionTypes'

const commonReducerInitialState = {
    cloud_accounts: [],

    countryList: [],
    constants: {},
    awsList: [],
    serviceList: [],
    complianceList: [],
    priorityList: [],
    isProgress: false,
    autoRefresh: 'None',
    countAssets: {
        totalAssets: 0,
        totalMfaAssets: 0, 
        totalLogingAssets: 0, 
        totalEncryptedAssets: 0, 
        totalPublicAssets: 0,
        totalAuthtenticationAssets: 0
    },
    accountAlerts: {},
    riskScores: {},
    compliancePercent: {},
    accountAssets: {},
    accountFailedAssets: {},
    mttd: 900,
    alerts_plan: []
}

export default function commonReducer(state = commonReducerInitialState, action) {
    switch (action.type) {

        case types.SET_CLOUD_ACCOUNTS:
            if (action.cloudAccounts.length > 0) {
                localStorage.setItem('account_id', action.cloudAccounts[0].id)
            } else {
                localStorage.setItem('account_id', null)
            }
            return {
                ...state,
                cloud_accounts: action.cloudAccounts
            };

        case types.LOAD_COUNTRY_SUCCESS:
            return Object.assign([], state, action.countryList)
        case types.SET_CONSTANT:
            localStorage.setItem('account_id', action.accountId)
            mixpanel.register({ "account_id": String(action.accountId) });
            return {
                ...state,
                constants: { accountId: action.accountId }
            };
        case types.AWS_LIST:
            return {
                ...state,
                awsList: action.awsList
            };
        case types.SERVICE_LIST:
            return {
                ...state,
                serviceList: action.serviceList
            };
        case types.COMPLIANCE_LIST:
            return {
                ...state,
                complianceList: action.complianceList
            };
        case types.PRIORITY_LIST:
            return {
                ...state,
                priorityList: action.priorityList
            };
        case types.PROGRESS_BAR:
            return {
                ...state,
                isProgress: action.isProgress
            };
        case types.AUTO_REFRESH:
            return {
                ...state,
                autoRefresh: action.autoRefresh
            };
        case types.COUNT_ASSETS:
            Object.keys(state.countAssets).forEach(function(key){
                if (action.countAssets[key] === undefined || action.countAssets[key] === null) {
                    action.countAssets[key] = 0
                }
            })
            return {
                ...state,
                countAssets: action.countAssets
            };
        case types.ACCOUNT_ALERTS:
            const accountAlerts = Object.assign(state.accountAlerts, action.accountAlerts);
            return {
                ...state,
                accountAlerts: accountAlerts
            };
        case types.RISK_SCORES:
            const riskScores = Object.assign(state.riskScores, action.riskScores);
            return {
                ...state,
                riskScores: riskScores
            };
        case types.COMPLIANCE_PERCENT:
            const compliancePercent = Object.assign(state.compliancePercent, action.compliancePercent);
            return {
                ...state,
                compliancePercent: compliancePercent
            };
        case types.ACCOUNT_ASSETS:
            const accountAssets = Object.assign(state.accountAssets, action.accountAssets);
            return {
                ...state,
                accountAssets: accountAssets
            };
        case types.ACCOUNT_FAILED_ASSETS:
            const accountFailedAssets = Object.assign(state.accountFailedAssets, action.accountFailedAssets);
            return {
                ...state,
                accountFailedAssets: accountFailedAssets
            };
        case types.MTTD:
            return {
                ...state,
                mttd: action.mttd
            };
        case types.ALERTS_PLAN:
            return {
                ...state,
                alerts_plan: action.alerts_plan
            };
        default:
            return state;
    }
}
