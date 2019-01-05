import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import autoBind from 'react-autobind';
import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import Drawer from 'material-ui/Drawer';
import FontIcon from 'material-ui/FontIcon';
import { List, ListItem } from 'material-ui/List';
import { Link } from 'react-router';

const propTypes = {
  menuToggle: PropTypes.func,
};

class SideNavBar extends Component {
  constructor() {
    super();
    this.state = {
      openMenu: false,
    };
    autoBind(this);
  }

  getChildContext() {
    return { muiTheme: getMuiTheme(baseTheme) };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      openMenu: nextProps.openMenu,
    });
  }

  handleMenu() {
    this.state.openMenu = !this.state.openMenu;
    this.props.menuToggle();
  }

  render() {
    // List of Icons
    const salesChannelsIcon = <FontIcon className="fa fa-road" />;
    const productsIcon = <FontIcon className="fa fa-file-image-o" />;
    const productItemsIcon = <FontIcon className="fa fa-barcode" />;
    const catalogsIcon = <FontIcon className="fa fa-stack-overflow" />;
    const priceListsIcon = <FontIcon className="fa fa-usd" />;
    const usersIcon = <FontIcon className="fa fa-users" />;
    const taxrateIcon = <FontIcon className="fa fa-university" />;
    const orderIcon = <FontIcon className="fa fa-shopping-cart" />;
    const categoriesIcon = <FontIcon className="fa fa-folder-open" />;
    const home = <FontIcon className="fa fa-home" />;
    const primaryTogglesNestedList = true;

    return (
      <Drawer open={this.state.openMenu}>
        <List>
          <ListItem
            primaryText="MENU"
            leftIcon={home}
            onClick={this.handleMenu}
          />
          <Link
            to="/saleschannels?page=1"
            onClick={this.handleMenu}
          >
            <ListItem
              primaryText="Sales Channels"
              leftIcon={salesChannelsIcon}
              primaryTogglesNestedList={primaryTogglesNestedList}
            />
          </Link>
          <Link
            to="/catalogs?page=1"
            onClick={this.handleMenu}
          >
            <ListItem
              primaryText="Catalogs"
              leftIcon={catalogsIcon}
              primaryTogglesNestedList={primaryTogglesNestedList}
            />
          </Link>
          <Link
            to="/categories?page=1"
            onClick={this.handleMenu}
          >
            <ListItem
              primaryText="Categories"
              leftIcon={categoriesIcon}
              primaryTogglesNestedList={primaryTogglesNestedList}
            />
          </Link>
          <Link
            to="/products?page=1"
            onClick={this.handleMenu}
          >
            <ListItem
              primaryText="Products"
              leftIcon={productsIcon}
              primaryTogglesNestedList={primaryTogglesNestedList}
            />
          </Link>
          <Link
            to="/items?page=1"
            onClick={this.handleMenu}
          >
            <ListItem
              primaryText="Product Items"
              leftIcon={productItemsIcon}
              primaryTogglesNestedList={primaryTogglesNestedList}
            />
          </Link>
          <Link
            to="/pricelists?page=1"
            onClick={this.handleMenu}
          >
            <ListItem
              primaryText="Price Lists"
              leftIcon={priceListsIcon}
              primaryTogglesNestedList={primaryTogglesNestedList}
            />
          </Link>
          <Link
            to="/orders?page=1"
            onClick={this.handleMenu}
          >
            <ListItem
              primaryText="Orders"
              leftIcon={orderIcon}
              primaryTogglesNestedList={primaryTogglesNestedList}
            />
          </Link>
          <Link
            to="/users?page=1"
            onClick={this.handleMenu}
          >
            <ListItem
              primaryText="Users"
              leftIcon={usersIcon}
              primaryTogglesNestedList={primaryTogglesNestedList}
            />
          </Link>
          <Link
            to="/taxrate?page=1"
            onClick={this.handleMenu}
          >
            <ListItem
              primaryText="Tax Rates"
              leftIcon={taxrateIcon}
              primaryTogglesNestedList={primaryTogglesNestedList}
            />
          </Link>
        </List>
      </Drawer>
    );
  }
}

SideNavBar.childContextTypes = {
  muiTheme: PropTypes.object.isRequired,
};

SideNavBar.propTypes = propTypes;

function mapStateToProps(state) {
  return {
    openMenu: state.layout.menuState,
  };
}

export default connect(mapStateToProps)(SideNavBar);
