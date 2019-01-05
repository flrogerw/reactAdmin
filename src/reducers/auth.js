import * as types from '../actions/actionTypes';
import { assign } from 'lodash';

const initialState = {
  isAuthenticated: false,
  error: '',
};

// all the returns here could be literals instead of using assign
function auth(state = initialState, action) {
  switch (action.type) {
    case types.AUTH_SUCCESS:
      return assign({}, state, {
        isAuthenticated: true,
        error: '',
      });
    case types.AUTH_FAILURE:
    case types.LOGOUT:
      return assign({}, state, {
        isAuthenticated: false,
        error: action.error || '',
      });
    case types.AUTH_CLEAR_ERRORS:
      return assign({}, state, {
        error: '',
      });
    default:
      return state;
  }
}

export default auth;
