import { combineReducers } from 'redux';
import { reducer as config } from './Config';
import { reducer as users } from './Users';
import { reducer as userProfile } from './UserProfile';

export const reducers = {
  config,
  users,
  userProfile,
};

export default combineReducers(reducers);
