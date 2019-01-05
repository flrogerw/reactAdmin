import * as types from '../actions/actionTypes';
import { assign } from 'lodash';

const ROOT_URL = process.env.API_URL;

const initialState = {
  results: [
    {
      zipcode: '',
      name: '',
      tax: 0,
      disabled: false,
    },
  ],
  taxrate: {
    zipcode: '',
    name: '',
    tax: 0,
    disabled: false,
  },
  meta: {
    count: 0,
    totalCount: 0,
    pageCount: 0,
    self: `${ROOT_URL}/taxrate?page=1`,
    previous: null,
    next: null,
    first: null,
    last: null,
    page: 1,
    limit: 20,
  },
};

function taxrates(state = initialState, action) {
  switch (action.type) {
    case types.TAXRATES_FETCH_SUCCESS:
      return assign({}, state, action.res);
    case types.TAXRATES_FETCH_ERROR:
    case types.TAXRATE_FETCH_ERROR:
    case types.TAXRATE_EDIT_ERROR:
    case types.TAXRATE_SET_ERROR:
    case types.TAXRATE_DISABLE_ERROR:
      return assign({}, state, {
        error: action.res,
      });
    case types.TAXRATE_FETCH_SUCCESS:
    case types.TAXRATE_EDIT_SUCCESS:
    case types.TAXRATE_SET_SUCCESS:
      return assign({}, state, {
        taxrate: action.res,
      });
    case types.TAXRATE_DELETE_SUCCESS:
      return assign({}, state, {
        taxrateDelete: action.res.ok,
      });
    case types.TAXRATES_CLEAR_ERRORS:
    case types.TAXRATE_CLEAR_ERRORS:
      return assign({}, state, {
        error: '',
      });
    default:
      return state;
  }
}

export default taxrates;
