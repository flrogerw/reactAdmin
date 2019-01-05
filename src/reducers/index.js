import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';

import auth from './auth';
import layout from './layout';
import users from './users';
import salesChannels from './salesChannels';
import products from './products';
import catalogs from './catalogs';
import items from './items';
import priceLists from './pricelists';
import taxrates from './taxrates';

const rootReducer = combineReducers({
  auth,
  layout,
  users,
  salesChannels,
  products,
  catalogs,
  priceLists,
  items,
  taxrates,
  routing,
});

export default rootReducer;
