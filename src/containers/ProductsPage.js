import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { browserHistory, Link, withRouter } from 'react-router';
import ShowProducts from '../components/products/ShowProducts';
import { clearAuthErrors, fetchProducts, disableProduct } from '../actions';
import autoBind from 'react-autobind';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import RaisedButton from 'material-ui/RaisedButton';
import Pagination from '../components/home/Pagination';
import TextField from 'material-ui/TextField';
import { cyan900 } from 'material-ui/styles/colors';

const propTypes = {
  dispatch: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
  products: PropTypes.object.isRequired,
  query: PropTypes.object.isRequired,
  router: PropTypes.object,
};

class ProductsPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      search: '',
    };
    autoBind(this);
  }
  getChildContext() {
    return { muiTheme: getMuiTheme(baseTheme) };
  }
  componentWillMount() {
    // TODO: fix authentication - gabo
    if (!this.props.isAuthenticated) {
      this.props.dispatch(clearAuthErrors());
      browserHistory.goBack();
    }
    const query = this.props.query;
    const router = this.props.router;
    if (!query.page) {
      query.page = 1;
      router.push({ pathname: '/products', query });
    } else {
      this.props.dispatch(fetchProducts(this.props.query));
    }
  }
  onProductDisable(data) {
    this.props.dispatch(disableProduct(data));
  }
  handleSearchChange(e) {
    const query = this.props.query;
    const router = this.props.router;
    const nextProductInput = e.target.value;
    const nextProduct = (nextProductInput !== '') ? nextProductInput : '';
    this.setState({
      search: nextProduct,
    });
    if (nextProduct.length > 0) {
      query.search = nextProduct;
    } else {
      delete query.search;
    }
    query.page = 1;
    router.push({ pathname: '/products', query });
    this.props.dispatch(fetchProducts(this.props.query));
  }
  navigation(route) {
    this.props.dispatch(fetchProducts(route));
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
      <div className="products component" style={authPage}>
        <h2>Products</h2>
        <div className="content">
          <div className="action-buttons">
            <Link to="/products/new">
              <RaisedButton
                label="Add new"
                primary
              />
            </Link>
          </div>
          <TextField
            floatingLabelText="Name"
            floatingLabelStyle={styles.floatingLabelStyle}
            inputStyle={styles.inputStyle}
            value={this.state.search}
            onChange={this.handleSearchChange}
          />
          <hr />
          <ShowProducts
            productsList={this.props.products}
            onProductDisable={data => this.onProductDisable(data)}
          />
        </div>
        <div className="action-buttons bottom">
          <Pagination
            paginationInfo={this.props.products.meta}
            pageCall={route => this.navigation(route)}
          />
        </div>
      </div>
    );
  }
}

ProductsPage.childContextTypes = {
  muiTheme: PropTypes.object.isRequired,
};

ProductsPage.propTypes = propTypes;

function mapStateToProps(state, ownProps) {
  return {
    isAuthenticated: state.auth.isAuthenticated,
    products: state.products,
    query: ownProps.location.query,
  };
}

export default withRouter(connect(mapStateToProps)(ProductsPage));
