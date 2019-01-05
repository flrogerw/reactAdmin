import React, { Component, PropTypes } from 'react';
import { browserHistory, withRouter } from 'react-router';
import { connect } from 'react-redux';
import { fetchCatalog, editCatalog, clearCatalogsErrors, fetchItems, addCatalogItem, deleteCatalogItem } from '../actions/';
import autoBind from 'react-autobind';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import EditCatalog from '../components/catalogs/EditCatalog';
import Alert from '../components/home/Alert';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';
import _ from 'lodash';
import Toggle from 'material-ui/Toggle';
import Pagination from '../components/home/Pagination';

// import '../assets/stylesheets/catalogs.scss';

const propTypes = {
  dispatch: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
  catalog: PropTypes.any,
  catalogId: PropTypes.string.isRequired,
  error: PropTypes.any,
  query: PropTypes.object.isRequired,
  items: PropTypes.array,
  itemsMeta: PropTypes.object,
  router: PropTypes.object,
};

class CatalogEditPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      alertOpen: false,
      alertMessage: '',
      edited: false,
      itemsList: [],
      catalogItemsMap: new Map(),
    };
    autoBind(this);
  }
  getChildContext() {
    return { muiTheme: getMuiTheme(baseTheme) };
  }
  componentWillMount() {
    if (!this.props.isAuthenticated) {
      browserHistory.push('/');
    }
    const query = this.props.query;
    const router = this.props.router;
    if (!query.page) {
      query.page = 1;
      router.push({ pathname: location.pathname, query });
    } else {
      this.props.dispatch(fetchItems(this.props.query));
    }
    this.props.dispatch(fetchCatalog(this.props.catalogId));
  }
  componentWillReceiveProps(nextProps) {
    const nextState = this.state;
    const catalog = nextProps.catalog;
    const catalogItemsMap = this.state.catalogItemsMap;
    let itemsList = [];
    if (catalog) {
      _.each(catalog.items, item => {
        catalogItemsMap.set(item.id, item);
      });

      itemsList = _.map(nextProps.items, (item) => {
        const newItem = _.clone(item);
        if (catalogItemsMap.has(item.id)) {
          newItem.inCatalog = true;
        }
        return newItem;
      });
    }
    nextState.itemsList = itemsList;

    if (nextProps.error) {
      _.merge(nextState, {
        alertOpen: true,
        edited: false,
        alertMessage: `${nextProps.error.statusCode} ${nextProps.error.error} ${nextProps.error.message}`,
      });
    }
    if (catalog && !nextProps.error && this.state.edited) {
      _.merge(nextState, {
        alertOpen: true,
        alertMessage: 'Catalog edited succesfully!',
      });
    }

    this.setState(nextState);
  }
  onChangeNewCatalogItem(e) {
    const nextState = _.clone(this.state);
    if (!_.isNumber(e.target.value)) {
      return;
    }
    nextState.newCatalogItem[e.target.name] = e.target.value;
    this.setState(nextState);
  }
  handleItemToggle(pItem) {
    const catalog = _.clone(this.props.catalog);
    const catalogId = catalog.id;
    const catalogItemsMap = this.state.catalogItemsMap;
    const item = _.clone(pItem);
    delete item.inCatalog;

    if (catalogItemsMap.has(item.id)) {
      catalogItemsMap.delete(item.id);
      catalog.items = Array.from(catalogItemsMap.values());
      this.props.dispatch(deleteCatalogItem({ catalogId, item }));
    } else {
      catalogItemsMap.set(item.id, item);
      catalog.items = Array.from(catalogItemsMap.values());
      this.props.dispatch(addCatalogItem({ catalogId, item: { itemId: item.id } }));
    }
  }
  navigation(route) {
    this.props.dispatch(fetchItems(route));
  }
  alertHandleClose() {
    this.setState({
      alertOpen: false,
      edited: false,
      alertMessage: '',
    });
    this.props.dispatch(clearCatalogsErrors());
    browserHistory.push('/catalogs');
  }
  saveEditCatalog(catalog) {
    this.setState({
      edited: true,
    });
    this.props.dispatch(editCatalog(catalog));
  }
  renderRowsTable() {
    return this.state.itemsList.map(item =>
      <TableRow key={item.id}>
        <TableRowColumn>{item.id}</TableRowColumn>
        <TableRowColumn>{item.name}</TableRowColumn>
        <TableRowColumn>{item.productId}</TableRowColumn>
        <TableRowColumn>{item.sku}</TableRowColumn>
        <TableRowColumn>
          <Toggle
            labelPosition="right"
            onToggle={() => this.handleItemToggle(item)}
            defaultToggled={item.inCatalog}
          />
        </TableRowColumn>
      </TableRow>
    );
  }
  render() {
    const authPage = {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    };
    const tableStyles = {
      showCheckboxes: false,
      stripedRows: true,
      displaySelectAll: false,
      adjustForCheckbox: false,
      selectable: false,
      displayRowCheckbox: false,
    };
    return (
      <div className="catalogs component" style={authPage}>
        <h2>Catalogs Edit</h2>
        <Alert
          alertOpen={this.state.alertOpen}
          alertHandleClose={() => this.alertHandleClose()}
          alertMessage={this.state.alertMessage}
        />
        <div className="content">
          <EditCatalog
            catalog={this.props.catalog}
            onSave={data => this.saveEditCatalog(data)}
          />
        </div>

        <h2>Select Product Items</h2>
        <div className="content">
          <Table
            selectable={tableStyles.selectable}
            multiSelectable={tableStyles.multiSelectable}
          >
            <TableHeader
              displaySelectAll={tableStyles.showCheckboxes}
              adjustForCheckbox={tableStyles.showCheckboxes}
              enableSelectAll={tableStyles.enableSelectAll}
            >
              <TableRow
                selectable={tableStyles.selectable}
              >
                <TableHeaderColumn>Item Id</TableHeaderColumn>
                <TableHeaderColumn>Name</TableHeaderColumn>
                <TableHeaderColumn>Product Id</TableHeaderColumn>
                <TableHeaderColumn>SKU</TableHeaderColumn>
                <TableHeaderColumn>Active</TableHeaderColumn>
              </TableRow>
            </TableHeader>
            <TableBody
              stripedRows={tableStyles.stripedRows}
              displayRowCheckbox={tableStyles.displayRowCheckbox}
            >
              {this.renderRowsTable()}
            </TableBody>
          </Table>
        </div>
        <div className="action-buttons bottom">
          <Pagination
            paginationInfo={this.props.itemsMeta}
            pageCall={route => this.navigation(route)}
            pageName={`/catalogs/${_.get(this, 'props.catalog.id')}`}
          />
        </div>
      </div>
    );
  }
}

CatalogEditPage.childContextTypes = {
  muiTheme: PropTypes.object.isRequired,
};

CatalogEditPage.propTypes = propTypes;

function mapStateToProps(state, ownProps) {
  return {
    isAuthenticated: state.auth.isAuthenticated,
    catalog: state.catalogs.catalog,
    catalogId: ownProps.params.id,
    error: state.catalogs.error,
    itemsMeta: state.items.meta,
    items: state.items.results,
    query: ownProps.location.query,
  };
}

export default withRouter(connect(mapStateToProps)(CatalogEditPage));
