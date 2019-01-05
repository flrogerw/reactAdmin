import React, { Component, PropTypes } from 'react';
import { withRouter, browserHistory } from 'react-router';
import { connect } from 'react-redux';
import autoBind from 'react-autobind';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import TextField from 'material-ui/TextField';
import Checkbox from 'material-ui/Checkbox';
import RaisedButton from 'material-ui/RaisedButton';
import { setProduct, clearProductsErrors } from '../actions';
import { cyan900 } from 'material-ui/styles/colors';
import Alert from '../components/home/Alert';

const propTypes = {
  dispatch: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
  product: PropTypes.object,
  error: PropTypes.any,
};

class ProductNewPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      auth: !props.isAuthenticated,
      alertOpen: false,
      alertMessage: '',
      error: false,
      product: {
        name: '',
        description: '',
        defaultItemId: 0,
        disabled: false,
      },
    };
    autoBind(this);
  }
  getChildContext() {
    return { muiTheme: getMuiTheme(baseTheme) };
  }
  componentWillMount() {
    if (!this.props.isAuthenticated) {
      browserHistory.goBack();
    }
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.error) {
      this.setState({
        alertOpen: true,
        error: true,
        alertMessage: `${nextProps.error.statusCode} ${nextProps.error.error} ${nextProps.error.message}`,
      });
    }
    if (nextProps.product && !nextProps.error) {
      this.setState({
        alertOpen: true,
        error: false,
        alertMessage: 'Product saved successfully!',
      });
    }
  }
  handleChange(e) {
    const nextState = this.state.product;
    nextState[e.target.name] = e.target.value;
    this.setState({
      product: nextState,
    });
  }
  handleSubmit() {
    this.props.dispatch(clearProductsErrors());
    this.props.dispatch(setProduct(this.state.product));
  }
  alertHandleClose() {
    this.setState({
      alertMessage: '',
      alertOpen: false,
    });
    if (!this.state.error) {
      browserHistory.push('/products');
    }
  }
  render() {
    const authPage = {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    };
    const styles = {
      floatingLabelStyle: {
        color: cyan900,
      },
      inputStyle: {
        marginRight: '1%',
      },
    };
    return (
      <div className="products component" style={authPage}>
        <h2>New Product</h2>
        <Alert
          alertOpen={this.state.alertOpen}
          alertHandleClose={() => this.alertHandleClose()}
          alertMessage={this.state.alertMessage}
        />
        <div className="content">
          <TextField
            floatingLabelText="Name"
            floatingLabelStyle={styles.floatingLabelStyle}
            value={this.state.product.name}
            name="name"
            onChange={this.handleChange}
          />
          <TextField
            floatingLabelText="Description"
            floatingLabelStyle={styles.floatingLabelStyle}
            value={this.state.product.description}
            name="description"
            onChange={this.handleChange}
          />
          <TextField
            floatingLabelText="Default Item ID"
            floatingLabelStyle={styles.floatingLabelStyle}
            value={this.state.product.defaultItemId}
            name="defaultItemId"
            onChange={this.handleChange}
          />
          <ul>
            <li>
              <Checkbox
                label="Disabled"
                checked={this.state.product.disabled}
                name="disabled"
                onCheck={this.handleChange}
              />
            </li>
          </ul>
          <div className="actions">
            <RaisedButton
              label="Save"
              primary
              onClick={this.handleSubmit}
            />
          </div>
        </div>
      </div>
    );
  }
}

ProductNewPage.childContextTypes = {
  muiTheme: PropTypes.object.isRequired,
};

ProductNewPage.propTypes = propTypes;

function mapStateToProps(state) {
  return {
    isAuthenticated: state.auth.isAuthenticated,
    product: state.products.product,
    error: state.products.error,
  };
}

export default withRouter(connect(mapStateToProps)(ProductNewPage));
