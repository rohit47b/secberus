
import * as types from '../constants/ActionTypes'

const messageReducerInitialState={
    message: { open: false, message: '', variant: 'info',reportData:{} }
}

export default function messageReducer(state = messageReducerInitialState, action) {
    switch (action.type) {
        case types.SNACK_BAR_MASSAGE:
        return {
            ...state,
            message: action.message
        };
        default:
            return state;
    }
}
