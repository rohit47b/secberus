import APPCONFIG from 'constants/Config';
import {
  DEMO 
} from '../constants/ActionTypes';

const initialSettings = APPCONFIG.settings;

const settings = (state = initialSettings, action) => {
  switch (action.type) {
    case DEMO:
      return {
        ...state,
        demo: action.isDemo
      }; 
    default:
      return state;
  }
};

export default settings;
