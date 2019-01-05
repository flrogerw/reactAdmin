import * as types from '../actions/actionTypes';
import { assign } from 'lodash';

const ROOT_URL = process.env.API_URL;

const initialState = {
  results: [
    {
      id: 0,
      productId: 0,
      sku: '',
      name: '',
      defaultPrice: 0,
      disabled: false,
      preview: {
        img: '',
        x: 0,
        y: 0,
        width: 0,
        height: 0,
      },
    },
  ],
  meta: {
    count: 0,
    totalCount: 0,
    pageCount: 0,
    self: `${ROOT_URL}/items?page=1`,
    previous: null,
    next: null,
    first: null,
    last: null,
    page: 1,
    limit: 20,
  },
};

function item(state = initialState, action) {
  switch (action.type) {
    case types.ITEMS_FETCH_SUCCESS:
      return assign({}, state, action.res);
    case types.ITEMS_FETCH_ERROR:
    case types.ITEM_FETCH_ERROR:
    case types.ITEM_EDIT_ERROR:
    case types.ITEM_SET_ERROR:
    case types.ITEM_DISABLE_ERROR:
      return assign({}, state, {
        error: action.res,
      });
    case types.ITEM_FETCH_SUCCESS:
    case types.ITEM_EDIT_SUCCESS:
    case types.ITEM_SET_SUCCESS:
      return assign({}, state, {
        item: action.res,
      });
    case types.ITEM_DISABLE_SUCCESS:
      return assign({}, state, {
        itemDisabled: action.res.ok,
      });
    case types.ITEMS_CLEAR_ERRORS:
      return assign({}, state, {
        error: '',
      });
    default:
      return state;
  }
}

export default item;
