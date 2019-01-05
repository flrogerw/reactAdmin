import React, { Component, PropTypes } from 'react';
import { withRouter, browserHistory } from 'react-router';
import { connect } from 'react-redux';
import autoBind from 'react-autobind';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import TextField from 'material-ui/TextField';
import Checkbox from 'material-ui/Checkbox';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem'; // eslint-disable-line no-unused-vars
import RaisedButton from 'material-ui/RaisedButton';
import { setItem, clearItemsErrors } from '../actions';
import { cyan900 } from 'material-ui/styles/colors';
import Alert from '../components/home/Alert';
import _ from 'lodash';

const propTypes = {
  dispatch: PropTypes.func,
  isAuthenticated: PropTypes.bool,
  item: PropTypes.object,
  error: PropTypes.any,
  products: PropTypes.any,
};

class ItemNewPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      auth: !props.isAuthenticated,
      alertOpen: false,
      alertMessage: '',
      error: false,
      item: {
        id: 0,
        productId: null,
        sku: '',
        name: '',
        defaultPrice: 0,
        disabled: false,
        preview: {
          img: '',
          x: 0,
          y: 0,
          width: 0,
          height: 0,
        },
        editor: {
          border: 0,
          orientation: 'portrait',
          width: 0,
          height: 0,
          bandHeight: 0,
          textSize: 0,
        },
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
    if (nextProps.item && !nextProps.error) {
      this.setState({
        alertOpen: true,
        error: false,
        alertMessage: 'Product Item saved successfully!',
      });
    }
  }
  handleProductChange(event, index, value) {
    const nextState = this.state.item;
    nextState.productId = value;
    this.setState({
      item: nextState,
    });
  }
  handleOrientationChange(event, index, value) {
    const nextState = this.state.item;
    nextState.editor.orientation = value;
    this.setState({
      item: nextState,
    });
  }
  handleChange(e) {
    const nextState = this.state.item;
    if (e.target.type === 'checkbox') {
      _.set(nextState, e.target.name, e.target.checked);
    } else {
      _.set(nextState, e.target.name, e.target.value);
    }
    this.setState({
      item: nextState,
    });
  }
  handleSubmit() {
    this.props.dispatch(clearItemsErrors());
    this.props.dispatch(setItem(this.state.item));
  }
  alertHandleClose() {
    this.setState({
      alertMessage: '',
      alertOpen: false,
    });
    if (!this.state.error) {
      browserHistory.push('/items');
    }
  }
  render() {
    const productSelect = _.map(this.props.products, c => <MenuItem value={c.id} key={c.id} primaryText={c.name} />);
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
      <div className="items component" style={authPage}>
        <h2>New Product Item</h2>
        <Alert
          alertOpen={this.state.alertOpen}
          alertHandleClose={() => this.alertHandleClose()}
          alertMessage={this.state.alertMessage}
        />
        <div className="content">
          <div>
            <TextField
              floatingLabelText="Name"
              floatingLabelStyle={styles.floatingLabelStyle}
              value={this.state.item.name}
              name="name"
              onChange={this.handleChange}
            />
            <TextField
              floatingLabelText="sku"
              floatingLabelStyle={styles.floatingLabelStyle}
              value={this.state.item.sku}
              name="sku"
              onChange={this.handleChange}
            />
            <SelectField
              value={this.state.item.productId}
              onChange={this.handleProductChange}
              floatingLabelText="Product"
              name="productId"
              style={{ verticalAlign: 'bottom' }}
              floatingLabelStyle={styles.floatingLabelStyle}
            >
              <MenuItem value={null} primaryText="" />
              {productSelect}
            </SelectField>
            <TextField
              floatingLabelText="Default Price"
              floatingLabelStyle={styles.floatingLabelStyle}
              value={this.state.item.defaultPrice}
              name="defaultPrice"
              onChange={this.handleChange}
            />
            <ul>
              <li>
                <Checkbox
                  label="Disabled"
                  defaultChecked={this.state.item.disabled}
                  name="disabled"
                  onCheck={this.handleChange}
                />
              </li>
            </ul>
            <br />
            <br />
            <h4>Preview Data</h4>
            <TextField
              floatingLabelText="Background Image Url"
              floatingLabelStyle={styles.floatingLabelStyle}
              value={this.state.item.preview.img}
              name="preview.img"
              onChange={this.handleChange}
            />
            <br />
            <TextField
              floatingLabelText="Preview Img X Position"
              floatingLabelStyle={styles.floatingLabelStyle}
              value={this.state.item.preview.x}
              name="preview.x"
              onChange={this.handleChange}
            />
            <TextField
              floatingLabelText="Preview Img Y Position"
              floatingLabelStyle={styles.floatingLabelStyle}
              value={this.state.item.preview.y}
              name="preview.y"
              onChange={this.handleChange}
            />
            <TextField
              floatingLabelText="Preview Img Height"
              floatingLabelStyle={styles.floatingLabelStyle}
              value={this.state.item.preview.height}
              name="preview.height"
              onChange={this.handleChange}
            />
            <TextField
              floatingLabelText="Preview Img Width"
              floatingLabelStyle={styles.floatingLabelStyle}
              value={this.state.item.preview.width}
              name="preview.width"
              onChange={this.handleChange}
            />
            <br />
            <br />
            <h4>Editor Data</h4>
            <SelectField
              value={this.state.item.editor.orientation}
              onChange={this.handleOrientationChange}
              style={{ verticalAlign: 'bottom' }}
              floatingLabelText="Orientation"
              name="editor.orientation"
              floatingLabelStyle={styles.floatingLabelStyle}
            >
              <MenuItem value="landscape" primaryText="Landscape" />
              <MenuItem value="portrait" primaryText="Portrait" />
            </SelectField>
            <TextField
              floatingLabelText="Border"
              floatingLabelStyle={styles.floatingLabelStyle}
              value={this.state.item.editor.border}
              name="editor.border"
              onChange={this.handleChange}
            />
            <TextField
              floatingLabelText="Width"
              floatingLabelStyle={styles.floatingLabelStyle}
              value={this.state.item.editor.width}
              name="editor.width"
              onChange={this.handleChange}
            />
            <TextField
              floatingLabelText="Height"
              floatingLabelStyle={styles.floatingLabelStyle}
              value={this.state.item.editor.height}
              name="editor.height"
              onChange={this.handleChange}
            />
            <br />
            <TextField
              floatingLabelText="Band Height"
              floatingLabelStyle={styles.floatingLabelStyle}
              value={this.state.item.editor.bandHeight}
              name="editor.bandHeight"
              onChange={this.handleChange}
            />
            <TextField
              floatingLabelText="Text Size"
              floatingLabelStyle={styles.floatingLabelStyle}
              value={this.state.item.editor.textSize}
              name="editor.textSize"
              onChange={this.handleChange}
            />
          </div>
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

ItemNewPage.childContextTypes = {
  muiTheme: PropTypes.object.isRequired,
};

ItemNewPage.propTypes = propTypes;

function mapStateToProps(state) {
  return {
    isAuthenticated: state.auth.isAuthenticated,
    item: state.items.item,
    error: state.items.error,
    products: state.products.results,
  };
}

export default withRouter(connect(mapStateToProps)(ItemNewPage));
