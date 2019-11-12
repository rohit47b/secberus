import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'

import settings from './settings'
import userReducer from './userReducer'
import commonReducer from './commonReducer'
import messageReducer from './messageReducer'

import uiReducer  from './uiReducer'
import { reducer as formReducer } from 'redux-form'

const reducers = {
  routing: routerReducer,
  settings,
  userReducer,
  commonReducer,
  messageReducer,
  uiReducer,
  form: formReducer
};

export default combineReducers(reducers);
