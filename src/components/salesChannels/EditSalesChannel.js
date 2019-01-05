import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
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
const _ = require('lodash');

const propTypes = {
  dispatch: PropTypes.func,
  salesChannel: PropTypes.any,
  onSave: PropTypes.func,
  catalogs: PropTypes.any,
  priceLists: PropTypes.any,
};

class EditSalesChannel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      salesChannel: {
        allowPickup: true,
        allowShip: true,
        displayName: '',
        id: 0,
        name: '',
        catalogId: null,
        priceListId: null,
        type: '',
        disabled: false,
        subdomain: '',
        web: true,
        store: true,
      },
      open: false,
    };
    autoBind(this);
  }
  getChildContext() {
    return { muiTheme: getMuiTheme(baseTheme) };
  }
  componentWillReceiveProps(nextProps) {
    let salesChannel;
    if (nextProps.salesChannel.id) {
      salesChannel = nextProps.salesChannel;
    } else {
      salesChannel = nextProps.salesChannel[0];
    }
    // salesChannel.catalogId = (salesChannel.catalogId === null) ? 0 : salesChannel.catalogId;
    // salesChannel.priceListId = (salesChannel.priceListId === null) ? 0 : salesChannel.priceListId;
    this.setState({ salesChannel });
  }
  handlePriceListChange(event, index, value) {
    const nextState = this.state.salesChannel;
    nextState.priceListId = value;
    this.setState({
      salesChannel: nextState,
    });
  }
  handleCatalogChange(event, index, value) {
    const nextState = this.state.salesChannel;
    nextState.catalogId = value;
    this.setState({
      salesChannel: nextState,
    });
  }
  handleChange(e, isChecked) {
    const nextState = this.state.salesChannel;
    if (e.target.type === 'checkbox') {
      nextState[e.target.name] = isChecked;
    } else {
      nextState[e.target.name] = e.target.value;
    }
    this.setState({
      salesChannel: nextState,
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
    this.props.onSave(this.state.salesChannel);
  }
  render() {
    const catalogSelect = _.map(this.props.catalogs, c => <MenuItem value={c.id} key={c.id} primaryText={c.name} />);
    const priceListSelect = _.map(this.props.priceLists, p => <MenuItem value={p.id} key={p.id} primaryText={p.name} />);
    const styles = {
      floatingLabelStyle: {
        color: cyan900,
      },
      inputStyle: {
        marginRight: '1%',
      },
      inline: {
        display: 'inline-block',
        width: '50%',
      },
      mainDiv: {
        width: '75%',
      },
    };
    return (
      <div style={styles.mainDiv}>
        <DialogModal
          dialogOpen={this.state.open}
          dialogHandleClose={this.handleClose}
          dialogHandleSubmit={() => this.saveChanges()}
          dialogTitle="Save Sales Channel changes"
          dialogMessage="Do you really want to save the changes in this sales channel?"
          dialogActionTitle="Save"
        />
        <TextField
          floatingLabelText="ID"
          floatingLabelStyle={styles.floatingLabelStyle}
          inputStyle={styles.inputStyle}
          value={this.state.salesChannel.id}
          disabled
        />
        <br />
        <TextField
          floatingLabelText="Name"
          floatingLabelStyle={styles.floatingLabelStyle}
          value={this.state.salesChannel.name}
          name="name"
          onChange={this.handleChange}
        />
        <TextField
          floatingLabelText="Display Name"
          floatingLabelStyle={styles.floatingLabelStyle}
          value={this.state.salesChannel.displayName}
          name="displayName"
          onChange={this.handleChange}
        />
        <TextField
          floatingLabelText="Type"
          floatingLabelStyle={styles.floatingLabelStyle}
          value={this.state.salesChannel.type}
          name="type"
          onChange={this.handleChange}
        />
        <br />
        <SelectField
          value={this.state.salesChannel.catalogId}
          onChange={this.handleCatalogChange}
          floatingLabelText="Catalog"
          style={{ verticalAlign: 'bottom' }}
          name="catalogId"
          floatingLabelStyle={styles.floatingLabelStyle}
        >
          <MenuItem value={null} primaryText="" />
          {catalogSelect}
        </SelectField>
        <SelectField
          value={this.state.salesChannel.priceListId}
          onChange={this.handlePriceListChange}
          floatingLabelText="Price List"
          style={{ verticalAlign: 'bottom' }}
          name="priceListId"
          floatingLabelStyle={styles.floatingLabelStyle}
        >
          <MenuItem value={null} primaryText="" />
          {priceListSelect}
        </SelectField>
        <TextField
          floatingLabelText="Subdomain"
          floatingLabelStyle={styles.floatingLabelStyle}
          value={this.state.salesChannel.subdomain}
          name="subdomain"
          onChange={this.handleChange}
        />
        <br />
        <ul style={styles.inline}>
          <li>
            <Checkbox
              label="Allow Pickup"
              defaultChecked={this.state.salesChannel.allowPickup}
              name="allowPickup"
              onCheck={this.handleChange}
            />
          </li>
          <li>
            <Checkbox
              label="Allow Ship"
              defaultChecked={this.state.salesChannel.allowShip}
              name="allowShip"
              onCheck={this.handleChange}
            />
          </li>
          <li>
            <Checkbox
              label="Disabled"
              defaultChecked={this.state.salesChannel.disabled}
              name="disabled"
              onCheck={this.handleChange}
            />
          </li>
        </ul>
        <ul style={styles.inline}>
          <li>
            <Checkbox
              label="Web"
              defaultChecked={this.state.salesChannel.web}
              name="web"
              onCheck={this.handleChange}
            />
          </li>
          <li>
            <Checkbox
              label="Store"
              defaultChecked={this.state.salesChannel.store}
              name="store"
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

EditSalesChannel.childContextTypes = {
  muiTheme: PropTypes.object.isRequired,
};

EditSalesChannel.propTypes = propTypes;

function mapStateToProps(state) {
  return {
    salesChannel: state.salesChannels.salesChannel,
    catalogs: state.catalogs.results,
    priceLists: state.priceLists.results,
  };
}

export default connect(mapStateToProps)(EditSalesChannel);
