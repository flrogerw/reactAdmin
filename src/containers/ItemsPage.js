import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router';
import ShowItems from '../components/items/ShowItems';
import { fetchProducts, fetchItems, disableItem } from '../actions';
import autoBind from 'react-autobind';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import RaisedButton from 'material-ui/RaisedButton';
import Pagination from '../components/home/Pagination';
import TextField from 'material-ui/TextField';
import { cyan900 } from 'material-ui/styles/colors';
const _ = require('lodash');

const propTypes = {
  dispatch: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
  items: PropTypes.object.isRequired,
  query: PropTypes.object.isRequired,
  router: PropTypes.object,
};

class ItemsPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: props.items,
      search: '',
    };
    autoBind(this);
  }
  // TODO: review this, why duplication on each Container - gabo
  getChildContext() {
    return {
      muiTheme: getMuiTheme(baseTheme),
    };
  }
  componentWillMount() {
    // TODO : review authentication and security
    if (!this.props.isAuthenticated) {
      // this.props.dispatch(clearAuthErrors());
    //  browserHistory.goBack();
    }
    const query = this.props.query;
    const router = this.props.router;
    const selectLimit = { limit: 1000 };
    this.props.dispatch(fetchProducts(selectLimit));
    if (!query.page) {
      query.page = 1;
      router.push({ pathname: '/items', query });
    } else {
      this.props.dispatch(fetchItems(this.props.query));
    }
  }
  onItemDisable(data) {
    const pData = _.omit(data, 'productName');
    this.props.dispatch(disableItem(pData));
  }
  handleSearchChange(e) {
    const query = this.props.query;
    const router = this.props.router;
    const nextItemInput = e.target.value;
    const nextItem = (nextItemInput !== '') ? nextItemInput : '';
    this.setState({
      search: nextItem,
    });
    if (nextItem.length > 0) {
      query.search = nextItem;
    } else {
      delete query.search;
    }
    query.page = 1;
    router.push({ pathname: '/items', query });
    this.props.dispatch(fetchItems(this.props.query));
  }
  navigation(route) {
    // add search to url
    this.props.dispatch(fetchItems(route));
  }
  render() {
    const styles = {
      floatingLabelStyle: {
        color: cyan900,
      },
      inputStyle: {
        marginRight: '1%',
      },
    };
    const authPage = {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    };
    return (
      <div className="items component" style={authPage}>
        <h2>Items</h2>
        <div className="content">
          <div className="action-buttons">
            <Link to="/items/new">
              <RaisedButton
                label="Add new"
                primary
              />
            </Link>
          </div>
          <TextField
            floatingLabelText="Name/Sku"
            floatingLabelStyle={styles.floatingLabelStyle}
            inputStyle={styles.inputStyle}
            value={this.state.search}
            onChange={this.handleSearchChange}
          />
          <hr />
          <ShowItems
            itemsList={this.props.items}
            onItemDisable={data => this.onItemDisable(data)}
          />
        </div>
        <div className="action-buttons bottom">
          <Pagination
            paginationInfo={this.props.items.meta}
            pageCall={route => this.navigation(route)}
          />
        </div>
      </div>
      );
  }
}

ItemsPage.childContextTypes = {
  muiTheme: PropTypes.object.isRequired,
};

ItemsPage.propTypes = propTypes;

function mapStateToProps(state, ownProps) {
  return {
    isAuthenticated: state.auth.isAuthenticated,
    items: state.items,
    query: ownProps.location.query,
  };
}

export default withRouter(connect(mapStateToProps)(ItemsPage));
