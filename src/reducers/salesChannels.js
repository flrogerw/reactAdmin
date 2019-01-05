import * as types from '../actions/actionTypes';
import { assign } from 'lodash';

const ROOT_URL = process.env.API_URL;

const initialState = {
  results: [
    {
      allowPickup: true,
      allowShip: true,
      displayName: '',
      id: 0,
      name: '',
      catalogId: 0,
      type: '',
      disabled: false,
    },
  ],
  meta: {
    count: 0,
    totalCount: 0,
    pageCount: 0,
    self: `${ROOT_URL}/saleschannels?page=1`,
    previous: null,
    next: null,
    first: null,
    last: null,
    page: 1,
    limit: 20,
  },
};

function salesChannel(state = initialState, action) {
  switch (action.type) {
    case types.SALESCHANNELS_FETCH_SUCCESS:
      return assign({}, state, action.res);
    case types.SALESCHANNELS_FETCH_ERROR:
    case types.SALESCHANNEL_FETCH_ERROR:
    case types.SALESCHANNEL_EDIT_ERROR:
    case types.SALESCHANNEL_SET_ERROR:
    case types.SALESCHANNEL_DISABLE_ERROR:
      return assign({}, state, {
        error: action.res,
      });
    case types.SALESCHANNEL_FETCH_SUCCESS:
    case types.SALESCHANNEL_EDIT_SUCCESS:
    case types.SALESCHANNEL_SET_SUCCESS:
      return assign({}, state, {
        salesChannel: action.res,
      });
    case types.SALESCHANNEL_DISABLE_SUCCESS:
      return assign({}, state, {
        salesChannelDisabled: action.res.ok,
      });
    case types.SALESCHANNELS_CLEAR_ERRORS:
      return assign({}, state, {
        error: '',
      });
    default:
      return state;
  }
}

export default salesChannel;
