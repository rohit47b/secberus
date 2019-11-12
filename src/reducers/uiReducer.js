
import * as types from 'constants/ActionTypes'

export const uiReducerInitialState = {
    showAssetModal: false,
    filterData: { selectAccount: { id: 'all', name: 'All Accounts', cloud: 'all' }, selectCloud: { name: 'All Clouds', id: 'all', cloudIcon: '/assets/images/cloud_all.png' } },
    reloadSearchBar: { flag: false },
    activeMenu: 'Dashboard',
    openSetting: false,
    openAsset: false,
    openGovernance: false,
    openIntegration: false,
    openReports: false,
    activeParentMenu:'',
    open: false,
    trailData: { isPurchased: false, trailPeriodRemainigDays: 0 },
    securityIssueFilter: {},
    openReportBug:false,
    dashboardLayout: [
        { i: 'SecurityAlertStatus', x: 0, y: 0, w: 1, h: 1.8, visible: true, permissionToAccess: true, moved: false, static: false }, //
        { i: 'Types', x: 0, y: 1.8, w: 1, h: 4.5, visible: true, permissionToAccess: true, moved: false, static: false },
        { i: 'Services', x: 0, y: 3, w: 1, h: 4.5, visible: true, permissionToAccess: true, moved: false, static: false },
        { i: 'ComplianceStatusAssets', x: 1, y: 0, w: 1, h: 4.15, visible: true, permissionToAccess: true, moved: false, static: false },
        { i: 'AssetInventory', x: 1, y: 3, w: 1, h: 5.7, visible: true, permissionToAccess: true, moved: false, static: false },
        { i: 'SecurityAlertByRegion', x: 2, y: 0, w: 1, h: 8, visible: true, permissionToAccess: true, moved: false, static: false }
    ],
    reportTabValue: 0,
    dimentions: {sideTop: 0, bodyHeight: 0}
}

export default function uiReducer(state = uiReducerInitialState, action) {
    switch (action.type) {
        case types.SHOW_ASSET_MODAL:
            return {
                ...state,
                showAssetModal: true
            }

        case types.CLOSE_ASSET_MODAL:
            return Object.assign({}, state, {
                showAssetModal: false
            });

        case types.FILTER_SEARCH_BAR:
            return {
                ...state,
                filterData: action.filterData
            }
        case types.RESET_FILTER_SEARCH_BAR:
            return {
                ...state,
                filterData: { selectAccount: { id: 'all', name: 'All Accounts', cloud: 'all' }, selectCloud: { name: 'All Clouds', id: 'all', cloudIcon: '/assets/images/cloud_all.png' } },
            }

        case types.RELOAD_SEARCH_BAR:
            return {
                ...state,
                reloadSearchBar: action.reloadSearchBar
            }

        case types.ACTIVE_MENU:
            return {
                ...state,
                activeMenu: action.activeMenu
            }
        case types.OPEN_SETTING:
            return {
                ...state,
                openSetting: action.openSetting
            }
        case types.OPEN_ASSET:
            return {
                ...state,
                openAsset: action.openAsset
            }
        case types.OPEN_GOVERNANCE:
            return {
                ...state,
                openGovernance: action.openGovernance
            }
        case types.OPEN_INTEGRATION:
            return {
                ...state,
                openIntegration: action.openIntegration
            }
        case types.OPEN_REPORTS:
            return {
                ...state,
                openReports: action.openReports
            }
        case types.SET_TRAIL_PERIOD_DATA:
            return {
                ...state,
                trailData: action.trailData,
            }

        case types.SECURITY_ISSUE_FILTER:
            return {
                ...state,
                securityIssueFilter: action.securityIssueFilter,
            }

        case types.DASHBOARD_LAYOUT:
            return {
                ...state,
                dashboardLayout: action.dashboardLayout,
            }

        case types.OPEN:
            return {
                ...state,
                open: action.open
            };
        case types.ACTIVE_PARENT_MENU:
            return {
                ...state,
                activeParentMenu: action.activeParentMenu
            };
        case types.REPORT_TAB_VALUE:
            return {
                ...state,
                reportTabValue: action.reportTabValue
            };
        case types.DIMENTIONS:
            return {
                ...state,
                dimentions: action.dimentions
            };
            case types.OPEN_REPORT_BUG:
                return {
                    ...state,
                    openReportBug: action.openReportBug
                };
        default:
            return state;
    }
}
