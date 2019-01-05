import * as types from '../actions/actionTypes';
import { assign } from 'lodash';

const ROOT_URL = process.env.API_URL;

const initialState = {
  results: [
    {
      id: 0,
      name: '',
      email: '',
      signupDate: '2016-01-01',
    },
  ],
  meta: {
    count: 0,
    totalCount: 0,
    pageCount: 0,
    self: `${ROOT_URL}/users?page=1`,
    previous: null,
    next: null,
    first: null,
    last: null,
    page: 1,
    limit: 20,
  },
};

// all the returns here could be literals instead of using assign
function auth(state = initialState, action) {
  switch (action.type) {
    case types.USERS_FETCH_SUCCESS:
      return assign({}, state, action.res);
    case types.USERS_FETCH_ERROR:
    case types.USER_FETCH_ERROR:
    case types.USER_EDIT_ERROR:
    case types.USER_SET_ERROR:
      return assign({}, state, {
        error: action.res,
      });
    case types.USER_FETCH_SUCCESS:
    case types.USER_EDIT_SUCCESS:
    case types.USER_SET_SUCCESS:
      return assign({}, state, {
        user: action.res,
      });
    case types.USERS_CLEAR_ERRORS:
      return assign({}, state, {
        error: '',
      });
    default:
      return state;
  }
}

export default auth;
