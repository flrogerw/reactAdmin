import React from 'react';
import { Route, IndexRoute } from 'react-router';
import App from './containers/App';
import LoginPage from './containers/LoginPage';
import ProductsPage from './containers/ProductsPage';
import ProductEditPage from './containers/ProductEditPage';
import ProductNewPage from './containers/ProductNewPage';
import CatalogsPage from './containers/CatalogsPage';
import CatalogEditPage from './containers/CatalogEditPage';
import CatalogNewPage from './containers/CatalogNewPage';
import SalesChannelsPage from './containers/SalesChannelsPage';
import SalesChannelEditPage from './containers/SalesChannelEditPage';
import SalesChannelNewPage from './containers/SalesChannelNewPage';
import ItemsPage from './containers/ItemsPage';
import ItemEditPage from './containers/ItemEditPage';
import ItemNewPage from './containers/ItemNewPage';
import UsersPage from './containers/UsersPage';
import UserEditPage from './containers/UserEditPage';
import UserNewPage from './containers/UserNewPage';
import PriceListsPage from './containers/PriceListsPage';
import PriceListEditPage from './containers/PriceListEditPage';
import PriceListNewPage from './containers/PriceListNewPage';
import TaxratePage from './containers/TaxratePage';
import TaxrateEditPage from './containers/TaxrateEditPage';
import TaxrateNewPage from './containers/TaxrateNewPage';

export default (
  <Route path="/" component={App}>
    <IndexRoute component={LoginPage} />
    <Route path="/products" component={ProductsPage} />
    <Route path="/products/new" component={ProductNewPage} />
    <Route path="/products/:id" component={ProductEditPage} />
    <Route path="/catalogs" component={CatalogsPage} />
    <Route path="/catalogs/new" component={CatalogNewPage} />
    <Route path="/catalogs/:id" component={CatalogEditPage} />
    <Route path="/pricelists" component={PriceListsPage} />
    <Route path="/pricelists/new" component={PriceListNewPage} />
    <Route path="/pricelists/:id" component={PriceListEditPage} />
    <Route path="/saleschannels" component={SalesChannelsPage} />
    <Route path="/saleschannels/new" component={SalesChannelNewPage} />
    <Route path="/saleschannels/:id" component={SalesChannelEditPage} />
    <Route path="/items" component={ItemsPage} />
    <Route path="/items/new" component={ItemNewPage} />
    <Route path="/items/:id" component={ItemEditPage} />
    <Route path="/users" component={UsersPage} />
    <Route path="/users/new" component={UserNewPage} />
    <Route path="/users/:id" component={UserEditPage} />
    <Route path="/taxrate" component={TaxratePage} />
    <Route path="/taxrate/new" component={TaxrateNewPage} />
    <Route path="/taxrate/:zipcode" component={TaxrateEditPage} />
    <Route path="*" component={App} />
  </Route>
);
