import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
// import { browserHistory } from 'react-router';
import autoBind from 'react-autobind';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import TextField from 'material-ui/TextField';
import Checkbox from 'material-ui/Checkbox';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem'; // eslint-disable-line no-unused-vars
import RaisedButton from 'material-ui/RaisedButton';
import { cyan900 } from 'material-ui/styles/colors';
import DialogModal from '../home/DialogModal';
import _ from 'lodash';

const propTypes = {
  item: PropTypes.any,
  onSave: PropTypes.func,
  products: PropTypes.any,
};

class EditItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
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
      open: false,
    };
    autoBind(this);
  }
  getChildContext() {
    return { muiTheme: getMuiTheme(baseTheme) };
  }
  componentWillReceiveProps(nextProps) {
    let item;
    if (nextProps.item.id) {
      item = nextProps.item;
    } else {
      item = nextProps.item[0];
    }
    // item.productId = (item.productId === null) ? 0 : item.productId;
    this.setState({ item });
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
  handleClose() {
    this.setState({
      open: false,
    });
    if (!this.state.error) {
      // browserHistory.push('/items');
    }
  }
  handleOpen() {
    this.setState({
      open: true,
    });
  }
  saveChanges() {
    this.handleClose();
    this.props.onSave(this.state.item);
  }
  render() {
    const productSelect = _.map(this.props.products, c => <MenuItem value={c.id} key={c.id} primaryText={c.name} />);
    const styles = {
      floatingLabelStyle: {
        color: cyan900,
      },
      inputStyle: {
        marginRight: '1%',
      },
      selectStyle: {
        lineHeight: '33px',
      },
    };
    return (
      <div>
        <div>
          <DialogModal
            dialogOpen={this.state.open}
            dialogHandleClose={this.handleClose}
            dialogHandleSubmit={() => this.saveChanges()}
            dialogTitle="Save product item changes"
            dialogMessage="Do you really want to save the changes in this item?"
            dialogActionTitle="Save"
          />
          <TextField
            floatingLabelText="ID"
            floatingLabelStyle={styles.floatingLabelStyle}
            inputStyle={styles.inputStyle}
            value={this.state.item.id}
            disabled
          />
          <br />
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
          <div>
            <SelectField
              value={this.state.item.editor.orientation}
              onChange={this.handleOrientationChange}
              floatingLabelText="Orientation"
              style={{ verticalAlign: 'bottom' }}
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
          </div>
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
        <RaisedButton
          label="Save"
          primary
          onClick={this.handleOpen}
        />
      </div>
    );
  }
}

EditItem.childContextTypes = {
  muiTheme: PropTypes.object.isRequired,
};

EditItem.propTypes = propTypes;

function mapStateToProps(state) {
  return {
    item: state.items.item,
    products: state.products.results,
  };
}

export default connect(mapStateToProps)(EditItem);
