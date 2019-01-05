import * as types from '../actions/actionTypes';
import { assign } from 'lodash';

const ROOT_URL = process.env.API_URL;

const initialState = {
  results: [
    {
      id: 0,
      name: '',
      description: '',
    },
  ],
  meta: {
    count: 0,
    totalCount: 0,
    pageCount: 0,
    self: `${ROOT_URL}/catalogs?page=1`,
    previous: null,
    next: null,
    first: null,
    last: null,
    page: 0,
    limit: 20,
  },
};

function catalogs(state = initialState, action) {
  switch (action.type) {
    case types.CATALOGS_FETCH_SUCCESS:
      return assign({}, state, action.res);
    case types.CATALOGS_FETCH_ERROR:
    case types.CATALOG_FETCH_ERROR:
    case types.CATALOG_EDIT_ERROR:
    case types.CATALOG_SET_ERROR:
    case types.CATALOG_DELETE_ERROR:
      return assign({}, state, {
        error: action.res,
      });
    case types.CATALOG_FETCH_SUCCESS:
    case types.CATALOG_EDIT_SUCCESS:
    case types.CATALOG_SET_SUCCESS:
    case types.CATALOG_ADD_ITEM:
      return assign({}, state, {
        catalog: action.res,
      });
    case types.CATALOG_DELETE_SUCCESS:
      return assign({}, state, {
        catalogDelete: action.res.ok,
      });
    case types.CATALOGS_CLEAR_ERRORS:
      return assign({}, state, {
        error: '',
      });
    default:
      return state;
  }
}

export default catalogs;
