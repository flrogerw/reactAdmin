import React, { Component, PropTypes } from 'react';
import { browserHistory, withRouter } from 'react-router';
import { connect } from 'react-redux';
import { fetchPriceList, editPriceList, clearPriceListsErrors, fetchItems,
       deletePriceListItem, addPriceListItem } from '../actions/';
import autoBind from 'react-autobind';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import EditPriceList from '../components/pricelists/EditPriceList';
import Alert from '../components/home/Alert';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';
import _ from 'lodash';
import Pagination from '../components/home/Pagination';
import TextField from 'material-ui/TextField';
import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';

// import '../assets/stylesheets/priceLists.scss';
const isNumeric = i => Boolean(parseInt(i, 10) || 0);

const propTypes = {
  dispatch: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
  priceList: PropTypes.any,
  priceListId: PropTypes.string.isRequired,
  error: PropTypes.any,
  query: PropTypes.object.isRequired,
  items: PropTypes.array,
  itemsMeta: PropTypes.object,
  router: PropTypes.object,
};

class PriceListEditPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      alertOpen: false,
      alertMessage: '',
      edited: false,
      itemsList: [],
      priceListItemsMap: new Map(),
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
    this.props.dispatch(fetchPriceList(this.props.priceListId));
  }
  componentWillReceiveProps(nextProps) {
    const nextState = this.state;
    const priceList = nextProps.priceList;
    const priceListItemsMap = this.state.priceListItemsMap;
    let itemsList = [];
    if (priceList) {
      _.each(priceList.items, item => {
        const priceItem = { itemId: item.id, price: item.price, priceListId: priceList.id };
        priceListItemsMap.set(item.id, priceItem);
      });

      itemsList = _.map(nextProps.items, (item) => {
        const newItem = _.clone(item);
        if (priceListItemsMap.has(item.id)) {
          newItem.price = priceListItemsMap.get(item.id).price;
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
    if (priceList && !nextProps.error && this.state.edited) {
      _.merge(nextState, {
        alertOpen: true,
        alertMessage: 'PriceList edited succesfully!',
      });
    }

    this.setState(nextState);
  }
  clearPrice(item) {
    console.log('clearPrice');
    const priceListItemsMap = this.state.priceListItemsMap;
    const data = { itemId: item.id, priceListId: this.props.priceList.id };
    priceListItemsMap.delete(item.id);
    console.log(priceListItemsMap);
    const newItemsList = _.map(this.state.itemsList, (pItem) => {
      const i = pItem;
      if (priceListItemsMap.has(i.id)) {
        i.price = priceListItemsMap.get(i.id).price;
      }
      return i;
    });
    this.setState({ itemsList: newItemsList });
    this.props.dispatch(deletePriceListItem(data));
  }
  triggerPriceChange(item) {
    this.props.dispatch(addPriceListItem(item));
  }
  handlePriceChange(e, itemId) {
    clearTimeout(this.timer);
    const WAIT_INTERVAL = 1000;
    const ENTER_KEY = 13;

    if (!isNumeric(e.target.value) || !isNumeric(itemId)) {
      return;
    }

    const priceListItemsMap = this.state.priceListItemsMap;
    const priceList = this.props.priceList;
    const item = { itemId, price: e.target.value, priceListId: priceList.id };
    const itemsList = _.clone(this.state.itemsList);
    priceListItemsMap.set(itemId, item);
    const newItemsList = _.map(itemsList, (pItem) => {
      const i = pItem;
      if (priceListItemsMap.has(i.id)) {
        i.price = priceListItemsMap.get(i.id).price;
      }
      return i;
    });
    if (e.keyCode === ENTER_KEY) {
      this.triggerPriceChange(item);
    } else {
      this.setState({ itemsList: newItemsList });
      this.timer = setTimeout(() => { this.triggerPriceChange(item); }, WAIT_INTERVAL);
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
    this.props.dispatch(clearPriceListsErrors());
    browserHistory.push('/pricelists');
  }
  saveEditPriceList(priceList) {
    this.setState({
      edited: true,
    });
    this.props.dispatch(editPriceList(priceList));
  }
  renderRowsTable() {
    return this.state.itemsList.map(item =>
      <TableRow key={item.id}>
        <TableRowColumn>{item.id}</TableRowColumn>
        <TableRowColumn>{item.name}</TableRowColumn>
        <TableRowColumn>{item.productId}</TableRowColumn>
        <TableRowColumn>{item.sku}</TableRowColumn>
        <TableRowColumn>{item.defaultPrice}</TableRowColumn>
        <TableRowColumn>
          <TextField
            // floatingLabelText="Name"
            // floatingLabelStyle={styles.floatingLabelStyle}
            value={item.price || ''}
            name="name"
            onChange={(e) => { this.handlePriceChange(e, item.id); }}
            onKeyDown={(e) => { this.handlePriceChange(e, item.id); }}
            style={{ width: '70%' }}
          />
          <IconButton
            tooltip="Clear Price"
            onClick={(e) => { this.clearPrice(e, item.id); }}
          >
            <FontIcon className="fa fa-trash" />
          </IconButton>
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
      <div className="catalgos component" style={authPage}>
        <h2>PriceLists Edit</h2>
        <Alert
          alertOpen={this.state.alertOpen}
          alertHandleClose={() => this.alertHandleClose()}
          alertMessage={this.state.alertMessage}
        />
        <div className="content">
          <EditPriceList
            priceList={this.props.priceList}
            onSave={data => this.saveEditPriceList(data)}
          />
        </div>

        <h2>Product Items</h2>
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
                <TableHeaderColumn>DefaultPrice</TableHeaderColumn>
                <TableHeaderColumn>Price</TableHeaderColumn>
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
            pageName={`/pricelists/${_.get(this, 'props.priceList.id')}`}
          />
        </div>
      </div>
    );
  }
}

PriceListEditPage.childContextTypes = {
  muiTheme: PropTypes.object.isRequired,
};

PriceListEditPage.propTypes = propTypes;

function mapStateToProps(state, ownProps) {
  return {
    isAuthenticated: state.auth.isAuthenticated,
    priceList: state.priceLists.priceList,
    priceListId: ownProps.params.id,
    error: state.priceLists.error,
    itemsMeta: state.items.meta,
    items: state.items.results,
    query: ownProps.location.query,
  };
}

export default withRouter(connect(mapStateToProps)(PriceListEditPage));
