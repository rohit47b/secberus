
import * as types from 'constants/ActionTypes'

const userReducerInitialState = {
    token: {},
    profile: {},
    company: {},
    loginAsDetail: { isLogin: false, company: {} }
}

export default function userReducer(state = userReducerInitialState, action) {
    switch (action.type) {
        case types.LOGIN_SUCCESS:
            return {
                ...state,
                token: action.token
            };
        case types.USER_PROFILE:
            return {
                ...state,
                profile: action.profile
            };

        case types.SET_COMPANY:
            return {
                ...state,
                company: action.company
            };
        case types.LOGIN_AS_IN_COMPANY:
            return {
                ...state,
                loginAsDetail: { isLogin: action.loginAsDetails.isLoginAs, company: action.loginAsDetails.company }
            };

        default:
            return state;
    }
}
