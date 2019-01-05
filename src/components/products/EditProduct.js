import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import autoBind from 'react-autobind';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import TextField from 'material-ui/TextField';
import Checkbox from 'material-ui/Checkbox';
import RaisedButton from 'material-ui/RaisedButton';
import { cyan900 } from 'material-ui/styles/colors';
import DialogModal from '../home/DialogModal';

const propTypes = {
  product: PropTypes.object,
  onSave: PropTypes.func.isRequired,
};

class EditProduct extends Component {
  constructor(props) {
    super(props);
    this.state = {
      product: {
        id: 0,
        name: '',
        description: '',
        defaultItemId: 0,
        disabled: false,
      },
      open: false,
    };
    autoBind(this);
  }
  getChildContext() {
    return { muiTheme: getMuiTheme(baseTheme) };
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.product) {
      const product = nextProps.product;
      product.defaultItemId = (product.defaultItemId === null) ? 0 : product.defaultItemId;
      this.setState({ product });
    }
  }
  handleChange(e) {
    const nextState = this.state.product;
    nextState[e.target.name] = e.target.value;
    if (e.target.type === 'checkbox') {
      nextState[e.target.name] = e.target.checked;
    } else {
      nextState[e.target.name] = e.target.value;
    }
    this.setState({
      product: nextState,
    });
  }
  handleClose() {
    this.setState({
      open: false,
    });
  }
  handleOpen() {
    this.setState({
      open: true,
    });
  }
  saveChanges() {
    this.handleClose();
    this.props.onSave(this.state.product);
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
    return (
      <div>
        <DialogModal
          dialogOpen={this.state.open}
          dialogHandleClose={this.handleClose}
          dialogHandleSubmit={() => this.saveChanges()}
          dialogTitle="Save Product changes"
          dialogMessage="Do you really want to save the changes in this product?"
          dialogActionTitle="Save"
        />
        <TextField
          floatingLabelText="ID"
          floatingLabelStyle={styles.floatingLabelStyle}
          inputStyle={styles.inputStyle}
          value={this.state.product.id}
          disabled
        />
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
        <RaisedButton
          label="Save"
          primary
          onClick={this.handleOpen}
        />
      </div>
    );
  }
}

EditProduct.childContextTypes = {
  muiTheme: PropTypes.object.isRequired,
};

EditProduct.propTypes = propTypes;

function mapStateToProps(state) {
  return {
    product: state.products.product,
  };
}

export default connect(mapStateToProps)(EditProduct);
