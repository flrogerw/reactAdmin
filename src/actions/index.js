import request from 'superagent';
import * as types from './actionTypes';
import _ from 'lodash';

const ROOT_URL = process.env.API_URL;

const normalizeError = (pError) => {
  let err = pError;
  if (_.get(err, 'response.body.message')) {
    err = _.get(err, 'response.body');
  }
  return err;
};

const dispatchAction = (dispatch, action, res) => {
  dispatch({
    type: action,
    res,
  });
};

const setRequestUrl = (route, basePath) => {
  let basicRoute = basePath;
  if (typeof route === 'string') {
    basicRoute = route;
  } else {
    basicRoute += `?${Object.keys(route).map(key => `${key}=${route[key]}`).join('&')}`;
  }
  return basicRoute;
};

// Login actions
export function login(data) {
  return dispatch =>
    request.post(`${ROOT_URL}/auth/login`)
      .send(data)
      .then(res => dispatch(authSuccess(res.body.token)))
      .catch(error => dispatch(authFailure(normalizeError(error))));
}

export function logout() {
  localStorage.removeItem('token');
  return {
    type: types.LOGOUT,
  };
}

export function authSuccess(token) {
  localStorage.setItem('token', token);
  return {
    type: types.AUTH_SUCCESS,
  };
}

export function authFailure(error) {
  return {
    type: types.AUTH_FAILURE,
    error,
  };
}

export function clearAuthErrors() {
  return {
    type: types.AUTH_CLEAR_ERRORS,
  };
}

export function authInfo(dispatch = null) {
  const token = localStorage.getItem('token');
  if (token) {
    dispatch(authSuccess(token));
  }
  return token;
}

// Categories actions
export function fetchCategories(route) {
  let routeUrl = `${ROOT_URL}/categories?page=1`;
  if (route) {
    routeUrl = setRequestUrl(route, `${ROOT_URL}/categories`);
  }
  return dispatch => {
    const token = authInfo(dispatch);
    request.get(routeUrl)
      .set({ Authorization: token })
      .then(res => dispatchAction(dispatch, types.CATEGORIES_FETCH_SUCCESS, res.body))
      .catch(error => dispatchAction(dispatch, types.CATEGORIES_FETCH_ERROR, normalizeError(error)));
  };
}

export function fetchCategory(id) {
  return dispatch => {
    const token = authInfo(dispatch);
    request.get(`${ROOT_URL}/categories/${id}`)
      .set({ Authorization: token })
      .then(res => dispatchAction(dispatch, types.CATEGORY_FETCH_SUCCESS, res.body))
      .catch(error => dispatchAction(dispatch, types.CATEGORY_FETCH_ERROR, normalizeError(error)));
  };
}

export function setCategory(data) {
  return dispatch => {
    const token = authInfo(dispatch);
    request.post(`${ROOT_URL}/categories`)
      .set({ Authorization: token })
      .send(data)
      .then(res => dispatchAction(dispatch, types.CATEGORY_SET_SUCCESS, res.body))
      .catch(error => dispatchAction(dispatch, types.CATEGORY_SET_ERROR, normalizeError(error)));
  };
}

export function deleteCategory(id) {
  return dispatch => {
    const token = authInfo(dispatch);
    request.delete(`${ROOT_URL}/categories/${id}`)
      .set({ Authorization: token })
      .then(res => dispatchAction(dispatch, types.CATEGORY_DELETE_SUCCESS, res))
      .catch(error => dispatchAction(dispatch, types.CATEGORY_DELETE_ERROR, normalizeError(error)));
  };
}

export function editCategory(data) {
  return dispatch => {
    const token = authInfo(dispatch);
    request.patch(`${ROOT_URL}/categories/${data.id}`)
      .send(data)
      .set({ Authorization: token })
      .then(res => dispatchAction(dispatch, types.CATEGORY_EDIT_SUCCESS, res.body))
      .catch(error => dispatchAction(dispatch, types.CATEGORY_EDIT_ERROR, normalizeError(error)));
  };
}

export function clearCategoriesErrors() {
  return {
    type: types.CATEGORIES_CLEAR_ERRORS,
  };
}

// Products actions

export function fetchProducts(route) {
  let routeUrl = `${ROOT_URL}/products?page=1`;
  if (route) {
    routeUrl = setRequestUrl(route, `${ROOT_URL}/products`);
  }
  return dispatch => {
    const token = authInfo(dispatch);
    request.get(routeUrl)
      .set({ Authorization: token })
      .then(res => dispatchAction(dispatch, types.PRODUCTS_FETCH_SUCCESS, res.body))
      .catch(error => dispatchAction(dispatch, types.PRODUCTS_FETCH_ERROR, normalizeError(error)));
  };
}

export function fetchProduct(id) {
  return dispatch => {
    const token = authInfo(dispatch);
    request.get(`${ROOT_URL}/products/${id}`)
      .set({ Authorization: token })
      .then(res => dispatchAction(dispatch, types.PRODUCT_FETCH_SUCCESS, res.body))
      .catch(error => dispatchAction(dispatch, types.PRODUCT_FETCH_ERROR, normalizeError(error)));
  };
}

export function setProduct(data) {
  return dispatch => {
    const token = authInfo(dispatch);
    request.post(`${ROOT_URL}/products`)
      .set({ Authorization: token })
      .send(data)
      .then(res => dispatchAction(dispatch, types.PRODUCT_SET_SUCCESS, res.body))
      .catch(error => dispatchAction(dispatch, types.PRODUCT_SET_ERROR, normalizeError(error)));
  };
}

export function deleteProduct(id) {
  return dispatch => {
    const token = authInfo(dispatch);
    request.delete(`${ROOT_URL}/products/${id}`)
      .set({ Authorization: token })
      .then(res => dispatchAction(dispatch, types.PRODUCT_DELETE_SUCCESS, res))
      .catch(error => dispatchAction(dispatch, types.PRODUCT_DELETE_ERROR, normalizeError(error)));
  };
}

export function editProduct(data) {
  return dispatch => {
    const token = authInfo(dispatch);
    request.patch(`${ROOT_URL}/products/${data.id}`)
      .send(data)
      .set({ Authorization: token })
      .then(res => dispatchAction(dispatch, types.PRODUCT_EDIT_SUCCESS, res.body))
      .catch(error => dispatchAction(dispatch, types.PRODUCT_EDIT_ERROR, normalizeError(error)));
  };
}

export function disableProduct(pData) {
  const data = pData;
  delete data.items;
  data.defaultItemId = (!_.isNumber(data.defaultItemId)) ? 0 : data.defaultItemId;
  return dispatch => {
    const token = authInfo(dispatch);
    request.patch(`${ROOT_URL}/products/${data.id}`)
      .send(data)
      .set({ Authorization: token })
      .then(res => dispatchAction(dispatch, types.PRODUCT_DISABLE_SUCCESS, res))
      .catch(error => dispatchAction(dispatch, types.PRODUCT_DISABLE_ERROR, normalizeError(error)));
  };
}

export function clearProductsErrors() {
  return {
    type: types.PRODUCTS_CLEAR_ERRORS,
  };
}

// Sales Channel actions

export function fetchSalesChannels(route) {
  let routeUrl = `${ROOT_URL}/saleschannels?page=1`;
  if (route) {
    routeUrl = setRequestUrl(route, `${ROOT_URL}/saleschannels`);
  }
  return dispatch => {
    const token = authInfo(dispatch);
    request.get(routeUrl)
      .set({ Authorization: token })
      .then(res => {
        dispatchAction(dispatch, types.SALESCHANNELS_FETCH_SUCCESS, res.body);
      })
      .catch(error => dispatchAction(dispatch, types.SALESCHANNELS_FETCH_ERROR, normalizeError(error)));
  };
}

export function fetchSalesChannel(id) {
  return dispatch => {
    const token = authInfo(dispatch);
    request.get(`${ROOT_URL}/saleschannels/${id}`)
      .set({ Authorization: token })
      .then(res => dispatchAction(dispatch, types.SALESCHANNEL_FETCH_SUCCESS, res.body))
      .catch(error => dispatchAction(dispatch, types.SALESCHANNEL_FETCH_ERROR, error));
  };
}

export function setSalesChannel(pData) {
  const data = pData;
  data.catalogId = (data.catalogId === null) ? 0 : data.catalogId;
  data.priceListId = (data.priceListId === null) ? 0 : data.priceListId;

  return dispatch => {
    const token = authInfo(dispatch);
    request.post(`${ROOT_URL}/saleschannels`)
      .set({ Authorization: token })
      .send(data)
      .then(res => {
        dispatchAction(dispatch, types.SALESCHANNEL_SET_SUCCESS, res.body);
      })
      .catch(error => dispatchAction(dispatch, types.SALESCHANNEL_SET_ERROR, normalizeError(error)));
  };
}

export function disableSalesChannel(pData) {
  const data = pData;
  data.catalogId = (data.catalogId === null) ? 0 : data.catalogId;
  data.priceListId = (data.priceListId === null) ? 0 : data.priceListId;
  return dispatch => {
    const token = authInfo(dispatch);
    request.patch(`${ROOT_URL}/saleschannels/${data.id}`)
      .send(data)
      .set({ Authorization: token })
      .then(res => dispatchAction(dispatch, types.SALESCHANNEL_DISABLE_SUCCESS, res))
      .catch(error => dispatchAction(dispatch, types.SALESCHANNEL_DISABLE_ERROR, normalizeError(error)));
  };
}

export function editSalesChannel(data) {
  return dispatch => {
    const token = authInfo(dispatch);
    request.patch(`${ROOT_URL}/saleschannels/${data.id}`)
      .send(data)
      .set({ Authorization: token })
      .then(res => dispatchAction(dispatch, types.SALESCHANNEL_EDIT_SUCCESS, res.body))
      .catch(error => dispatchAction(dispatch, types.SALESCHANNEL_EDIT_ERROR, normalizeError(error)));
  };
}

export function clearSalesChannelsErrors() {
  return {
    type: types.SALESCHANNELS_CLEAR_ERRORS,
  };
}

// Users actions

export function fetchUsers(route) {
  let routeUrl = `${ROOT_URL}/users?page=1`;
  if (route) {
    routeUrl = setRequestUrl(route, `${ROOT_URL}/users`);
  }
  return dispatch => {
    const token = authInfo(dispatch);
    request.get(routeUrl)
      .set({ Authorization: token })
      .then(res => dispatchAction(dispatch, types.USERS_FETCH_SUCCESS, res.body))
      .catch(error => dispatchAction(dispatch, types.USERS_FETCH_ERROR, normalizeError(error)));
  };
}

export function fetchUser(id) {
  return dispatch => {
    const token = authInfo(dispatch);
    request.get(`${ROOT_URL}/users/${id}`)
      .set({ Authorization: token })
      .then(res => dispatchAction(dispatch, types.USER_FETCH_SUCCESS, res.body))
      .catch(error => dispatchAction(dispatch, types.USER_FETCH_ERROR, normalizeError(error)));
  };
}

export function setUser(data) {
  return dispatch => {
    const token = authInfo(dispatch);
    request.post(`${ROOT_URL}/users`)
      .set({ Authorization: token })
      .send(data)
      .then(res => dispatchAction(dispatch, types.USER_SET_SUCCESS, res.body))
      .catch(error => dispatchAction(dispatch, types.USER_SET_ERROR, normalizeError(error)));
  };
}

export function editUser(data) {
  return dispatch => {
    const token = authInfo(dispatch);
    request.patch(`${ROOT_URL}/users/${data.id}`)
      .send(data)
      .set({ Authorization: token })
      .then(res => dispatchAction(dispatch, types.USER_EDIT_SUCCESS, res.body))
      .catch(error => dispatchAction(dispatch, types.USER_EDIT_ERROR, normalizeError(error)));
  };
}

export function clearUsersErrors() {
  return {
    type: types.USERS_CLEAR_ERRORS,
  };
}

// Catalogs actions

export function fetchCatalogs(route) {
  let routeUrl = `${ROOT_URL}/catalogs?page=1`;
  if (route) {
    routeUrl = setRequestUrl(route, `${ROOT_URL}/catalogs`);
  }
  return dispatch => {
    const token = authInfo(dispatch);
    request.get(routeUrl)
      .set({ Authorization: token })
      .then(res => dispatchAction(dispatch, types.CATALOGS_FETCH_SUCCESS, res.body))
      .catch(error => dispatchAction(dispatch, types.CATALOGS_FETCH_ERROR, normalizeError(error)));
  };
}

export function fetchCatalog(id) {
  return dispatch => {
    const token = authInfo(dispatch);
    request.get(`${ROOT_URL}/catalogs/${id}`)
      .set({ Authorization: token })
      .then(res => dispatchAction(dispatch, types.CATALOG_FETCH_SUCCESS, res.body))
      .catch(error => dispatchAction(dispatch, types.CATALOG_FETCH_ERROR, normalizeError(error)));
  };
}

export function setCatalog(data) {
  return dispatch => {
    const token = authInfo(dispatch);
    request.post(`${ROOT_URL}/catalogs`)
      .set({ Authorization: token })
      .send(data)
      .then(res => dispatchAction(dispatch, types.CATALOG_SET_SUCCESS, res.body))
      .catch(error => dispatchAction(dispatch, types.CATALOG_SET_ERROR, normalizeError(error)));
  };
}

export function deleteCatalog(id) {
  return dispatch => {
    const token = authInfo(dispatch);
    request.delete(`${ROOT_URL}/catalogs/${id}`)
      .set({ Authorization: token })
      .then(res => dispatchAction(dispatch, types.CATALOG_DELETE_SUCCESS, res))
      .catch(error => dispatchAction(dispatch, types.CATALOG_DELETE_ERROR, normalizeError(error)));
  };
}

export function editCatalog(data) {
  return dispatch => {
    const token = authInfo(dispatch);
    request.patch(`${ROOT_URL}/catalogs/${data.id}`)
      .send(data)
      .set({ Authorization: token })
      .then(res => dispatchAction(dispatch, types.CATALOG_EDIT_SUCCESS, res.body))
      .catch(error => dispatchAction(dispatch, types.CATALOG_EDIT_ERROR, normalizeError(error)));
  };
}

export function disableCatalog(pData) {
  const data = pData;
  delete data.items;
  return dispatch => {
    const token = authInfo(dispatch);
    request.patch(`${ROOT_URL}/catalogs/${data.id}`)
      .send(data)
      .set({ Authorization: token })
      .then(res => dispatchAction(dispatch, types.CATALOG_DISABLE_SUCCESS, res))
      .catch(error => dispatchAction(dispatch, types.CATALOG_DISABLE_ERROR, normalizeError(error)));
  };
}

export function addCatalogItem(data) {
  return dispatch => {
    const token = authInfo(dispatch);
    request.patch(`${ROOT_URL}/catalogs/${data.catalogId}/items`)
      .send(data.item)
      .set({ Authorization: token })
      .then(res => dispatchAction(dispatch, types.CATALOG_EDIT_SUCCESS, res.body))
      .catch(error => dispatchAction(dispatch, types.CATALOG_EDIT_ERROR, normalizeError(error)));
  };
}

export function deleteCatalogItem(data) {
  return dispatch => {
    const token = authInfo(dispatch);
    request.delete(`${ROOT_URL}/catalogs/${data.catalogId}/items/${data.item.id}`)
      .send(data)
      .set({ Authorization: token })
      .catch(error => dispatchAction(dispatch, types.CATALOG_EDIT_ERROR, normalizeError(error)));
  };
}


export function clearCatalogsErrors() {
  return {
    type: types.CATALOGS_CLEAR_ERRORS,
  };
}


// Price List actions

export function fetchPriceLists(route) {
  let routeUrl = `${ROOT_URL}/pricelists?page=1`;
  if (route) {
    routeUrl = setRequestUrl(route, `${ROOT_URL}/pricelists`);
  }
  return dispatch => {
    const token = authInfo(dispatch);
    request.get(routeUrl)
      .set({ Authorization: token })
      .then(res => dispatchAction(dispatch, types.PRICELISTS_FETCH_SUCCESS, res.body))
      .catch(error => dispatchAction(dispatch, types.PRICELISTS_FETCH_ERROR, normalizeError(error)));
  };
}

export function fetchPriceList(id) {
  return dispatch => {
    const token = authInfo(dispatch);
    request.get(`${ROOT_URL}/pricelists/${id}`)
      .set({ Authorization: token })
      .then(res => dispatchAction(dispatch, types.PRICELIST_FETCH_SUCCESS, res.body))
      .catch(error => dispatchAction(dispatch, types.PRICELIST_FETCH_ERROR, normalizeError(error)));
  };
}

export function setPriceList(data) {
  return dispatch => {
    const token = authInfo(dispatch);
    request.post(`${ROOT_URL}/pricelists`)
      .set({ Authorization: token })
      .send(data)
      .then(res => dispatchAction(dispatch, types.PRICELIST_SET_SUCCESS, res.body))
      .catch(error => dispatchAction(dispatch, types.PRICELIST_SET_ERROR, normalizeError(error)));
  };
}

export function deletePriceList(id) {
  return dispatch => {
    const token = authInfo(dispatch);
    request.delete(`${ROOT_URL}/pricelists/${id}`)
      .set({ Authorization: token })
      .then(res => dispatchAction(dispatch, types.PRICELIST_DELETE_SUCCESS, res))
      .catch(error => dispatchAction(dispatch, types.PRICELIST_DELETE_ERROR, normalizeError(error)));
  };
}

export function editPriceList(data) {
  return dispatch => {
    const token = authInfo(dispatch);
    request.patch(`${ROOT_URL}/pricelists/${data.id}`)
      .send(data)
      .set({ Authorization: token })
      .then(res => dispatchAction(dispatch, types.PRICELIST_EDIT_SUCCESS, res.body))
      .catch(error => dispatchAction(dispatch, types.PRICELIST_EDIT_ERROR, normalizeError(error)));
  };
}

export function disablePriceList(pData) {
  const data = pData;
  delete data.items;
  return dispatch => {
    const token = authInfo(dispatch);
    request.patch(`${ROOT_URL}/pricelists/${data.id}`)
      .send(data)
      .set({ Authorization: token })
      .then(res => dispatchAction(dispatch, types.PRICELIST_DISABLE_SUCCESS, res))
      .catch(error => dispatchAction(dispatch, types.PRICELIST_DISABLE_ERROR, normalizeError(error)));
  };
}

export function addPriceListItem(data) {
  return dispatch => {
    const token = authInfo(dispatch);
    request.patch(`${ROOT_URL}/pricelists/${data.priceListId}/items`)
      .send(data)
      .set({ Authorization: token })
      .then(res => dispatchAction(dispatch, types.PRICELIST_EDIT_SUCCESS, res.body))
      .catch(error => dispatchAction(dispatch, types.PRICELIST_EDIT_ERROR, normalizeError(error)));
  };
}

export function deletePriceListItem(data) {
  return dispatch => {
    const token = authInfo(dispatch);
    request.delete(`${ROOT_URL}/pricelists/${data.priceListId}/items/${data.itemId}`)
      .send(data)
      .set({ Authorization: token })
      .catch(error => dispatchAction(dispatch, types.PRICELIST_EDIT_ERROR, normalizeError(error)));
  };
}


export function clearPriceListsErrors() {
  return {
    type: types.CATALOGS_CLEAR_ERRORS,
  };
}

// Items actions

export function fetchItems(route) {
  let routeUrl = `${ROOT_URL}/items?page=1`;
  if (route) {
    routeUrl = setRequestUrl(route, `${ROOT_URL}/items`);
  }
  return dispatch => {
    const token = authInfo(dispatch);
    request.get(routeUrl)
      .set({ Authorization: token })
      .then(res => {
        dispatchAction(dispatch, types.ITEMS_FETCH_SUCCESS, res.body);
      })
      .catch(error => dispatchAction(dispatch, types.ITEMS_FETCH_ERROR, normalizeError(error)));
  };
}

export function fetchItem(id) {
  return dispatch => {
    const token = authInfo(dispatch);
    request.get(`${ROOT_URL}/items/${id}`)
      .set({ Authorization: token })
      .then(res => dispatchAction(dispatch, types.ITEM_FETCH_SUCCESS, res.body))
      .catch(error => dispatchAction(dispatch, types.ITEM_FETCH_ERROR, error));
  };
}

export function setItem(pData) {
  const data = pData;
  data.productId = (data.productId === null) ? 0 : data.productId;

  return dispatch => {
    const token = authInfo(dispatch);
    request.post(`${ROOT_URL}/items`)
      .set({ Authorization: token })
      .send(data)
      .then(res => {
        dispatchAction(dispatch, types.ITEM_SET_SUCCESS, res.body);
      })
      .catch(error => dispatchAction(dispatch, types.ITEM_SET_ERROR, normalizeError(error)));
  };
}

export function disableItem(pData) {
  const data = pData;
  data.productId = (data.productId === null) ? 0 : data.productId;

  return dispatch => {
    const token = authInfo(dispatch);
    request.patch(`${ROOT_URL}/items/${data.id}`)
      .send(data)
      .set({ Authorization: token })
      .then(res => dispatchAction(dispatch, types.ITEM_DISABLE_SUCCESS, res))
      .catch(error => dispatchAction(dispatch, types.ITEM_DISABLE_ERROR, normalizeError(error)));
  };
}

export function editItem(data) {
  return dispatch => {
    const token = authInfo(dispatch);
    request.patch(`${ROOT_URL}/items/${data.id}`)
      .send(data)
      .set({ Authorization: token })
      .then(res => dispatchAction(dispatch, types.ITEM_EDIT_SUCCESS, res.body))
      .catch(error => dispatchAction(dispatch, types.ITEM_EDIT_ERROR, normalizeError(error)));
  };
}

export function clearItemsErrors() {
  return {
    type: types.ITEMS_CLEAR_ERRORS,
  };
}

// Tax Rate actions

export function fetchTaxrates(route) {
  let routeUrl = `${ROOT_URL}/taxrate?page=1`;
  if (route) {
    routeUrl = setRequestUrl(route, `${ROOT_URL}/taxrate`);
  }
  return dispatch => {
    const token = authInfo(dispatch);
    request.get(routeUrl)
      .set({ Authorization: token })
      .then(res => {
        dispatchAction(dispatch, types.TAXRATES_FETCH_SUCCESS, res.body);
      })
      .catch(error => dispatchAction(dispatch, types.TAXRATES_FETCH_ERROR, normalizeError(error)));
  };
}

export function fetchTaxrate(zipcode) {
  return dispatch => {
    const token = authInfo(dispatch);
    request.get(`${ROOT_URL}/taxrate/${zipcode}`)
      .set({ Authorization: token })
      .then(res => dispatchAction(dispatch, types.TAXRATE_FETCH_SUCCESS, res.body))
      .catch(error => dispatchAction(dispatch, types.TAXRATE_FETCH_ERROR, error));
  };
}

export function setTaxrate(pData) {
  const data = pData;

  return dispatch => {
    const token = authInfo(dispatch);
    request.post(`${ROOT_URL}/taxrate`)
      .set({ Authorization: token })
      .send(data)
      .then(res => {
        dispatchAction(dispatch, types.TAXRATE_SET_SUCCESS, res.body);
      })
      .catch(error => dispatchAction(dispatch, types.TAXRATE_SET_ERROR, normalizeError(error)));
  };
}
export function deleteTaxrate(zipcode) {
  return dispatch => {
    const token = authInfo(dispatch);
    request.delete(`${ROOT_URL}/taxrate/${zipcode}`)
      .set({ Authorization: token })
      .then(res => dispatchAction(dispatch, types.TAXRATE_DELETE_SUCCESS, res))
      .catch(error => dispatchAction(dispatch, types.TAXRATE_DELETE_ERROR, normalizeError(error)));
  };
}

export function editTaxrate(data) {
  return dispatch => {
    const token = authInfo(dispatch);
    request.patch(`${ROOT_URL}/taxrate/${data.zipcode}`)
      .send(data)
      .set({ Authorization: token })
      .then(res => dispatchAction(dispatch, types.TAXRATE_EDIT_SUCCESS, res.body))
      .catch(error => dispatchAction(dispatch, types.TAXRATE_EDIT_ERROR, normalizeError(error)));
  };
}

export function clearTaxrateErrors() {
  return {
    type: types.TAXRATES_CLEAR_ERRORS,
  };
}

// MENU actions
export function menuToggle() {
  return {
    type: types.MENU_TOGGLE,
  };
}
