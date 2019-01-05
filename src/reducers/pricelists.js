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
    self: `${ROOT_URL}/pricelists?page=1`,
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
    case types.PRICELISTS_FETCH_SUCCESS:
      return assign({}, state, action.res);
    case types.PRICELISTS_FETCH_ERROR:
    case types.PRICELIST_FETCH_ERROR:
    case types.PRICELIST_EDIT_ERROR:
    case types.PRICELIST_SET_ERROR:
    case types.PRICELIST_DELETE_ERROR:
      return assign({}, state, {
        error: action.res,
      });
    case types.PRICELIST_FETCH_SUCCESS:
    case types.PRICELIST_EDIT_SUCCESS:
    case types.PRICELIST_SET_SUCCESS:
    case types.PRICELIST_ADD_ITEM:
      return assign({}, state, {
        priceList: action.res,
      });
    case types.PRICELIST_DELETE_SUCCESS:
      return assign({}, state, {
        priceListDelete: action.res.ok,
      });
    case types.PRICELISTS_CLEAR_ERRORS:
      return assign({}, state, {
        error: '',
      });
    default:
      return state;
  }
}

export default catalogs;
