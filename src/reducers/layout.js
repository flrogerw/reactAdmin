import * as types from '../actions/actionTypes';
import { assign } from 'lodash';

const initialState = {
  menuState: false,
};

function layout(state = initialState, action) {
  switch (action.type) {
    case types.MENU_TOGGLE :
      return assign({}, state, {
        menuState: !state.menuState,
      });
    default:
      return state;
  }
}

export default layout;
