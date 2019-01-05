import * as types from '../actions/actionTypes';
import { assign } from 'lodash';

const ROOT_URL = process.env.API_URL;

const initialState = {
  results: [
    {
      id: 0,
      name: '',
      description: '',
      categories: '',
      imageUrl: '',
      isTaxable: true,
      disabled: true,
    },
  ],
  meta: {
    count: 0,
    totalCount: 0,
    pageCount: 0,
    self: `${ROOT_URL}/products?page=1`,
    previous: null,
    next: null,
    first: null,
    last: null,
    page: 0,
    limit: 20,
  },
};

function products(state = initialState, action) {
  switch (action.type) {
    case types.PRODUCTS_FETCH_SUCCESS:
      return assign({}, state, action.res);
    case types.PRODUCTS_FETCH_ERROR:
    case types.PRODUCT_FETCH_ERROR:
    case types.PRODUCT_EDIT_ERROR:
    case types.PRODUCT_SET_ERROR:
    case types.PRODUCT_DELETE_ERROR:
    case types.PRODUCT_DISABLE_ERROR:
      return assign({}, state, {
        error: action.res,
      });
    case types.PRODUCT_FETCH_SUCCESS:
    case types.PRODUCT_EDIT_SUCCESS:
    case types.PRODUCT_SET_SUCCESS:
      return assign({}, state, {
        product: action.res,
      });
    case types.PRODUCT_DELETE_SUCCESS:
      return assign({}, state, {
        productDelete: action.res.ok,
      });
    case types.PRODUCTS_CLEAR_ERRORS:
      return assign({}, state, {
        error: '',
      });
    default:
      return state;
  }
}

export default products;
