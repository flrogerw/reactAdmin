import React, { Component, PropTypes } from 'react';
import { withRouter, browserHistory } from 'react-router';
import { connect } from 'react-redux';
import autoBind from 'react-autobind';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem'; // eslint-disable-line no-unused-vars
import Checkbox from 'material-ui/Checkbox';
import RaisedButton from 'material-ui/RaisedButton';
import { setSalesChannel, clearSalesChannelsErrors } from '../actions';
import { cyan900 } from 'material-ui/styles/colors';
import Alert from '../components/home/Alert';
const _ = require('lodash');

const propTypes = {
  dispatch: PropTypes.func,
  isAuthenticated: PropTypes.bool,
  salesChannel: PropTypes.object,
  catalogs: PropTypes.any,
  priceLists: PropTypes.any,
  error: PropTypes.any,
};

class SalesChannelNewPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      auth: !props.isAuthenticated,
      alertOpen: false,
      alertMessage: '',
      error: false,
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
    if (nextProps.salesChannel && !nextProps.error) {
      this.setState({
        alertOpen: true,
        error: false,
        alertMessage: 'Sales Channel saved successfully!',
      });
    }
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
  handleChange(e) {
    const nextState = this.state.salesChannel;
    if (e.target.type === 'checkbox') {
      nextState[e.target.name] = e.target.checked;
    } else {
      nextState[e.target.name] = e.target.value;
    }
    this.setState({
      salesChannel: nextState,
    });
  }
  handleSubmit() {
    this.props.dispatch(clearSalesChannelsErrors());
    this.props.dispatch(setSalesChannel(this.state.salesChannel));
  }
  alertHandleClose() {
    this.setState({
      alertMessage: '',
      alertOpen: false,
    });
    if (!this.state.error) {
      browserHistory.push('/saleschannels');
    }
  }
  render() {
    const catalogSelect = _.map(this.props.catalogs, c => <MenuItem value={c.id} key={c.id} primaryText={c.name} />);
    const priceListSelect = _.map(this.props.priceLists, p => <MenuItem value={p.id} key={p.id} primaryText={p.name} />);
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
      <div className="sales-channels component" style={authPage}>
        <h2>New Sale Channel</h2>
        <Alert
          alertOpen={this.state.alertOpen}
          alertHandleClose={() => this.alertHandleClose()}
          alertMessage={this.state.alertMessage}
        />
        <div className="content">
          <TextField
            floatingLabelText="Display Name"
            floatingLabelStyle={styles.floatingLabelStyle}
            name="displayName"
            onChange={this.handleChange}
          />
          <TextField
            floatingLabelText="Name"
            floatingLabelStyle={styles.floatingLabelStyle}
            name="name"
            onChange={this.handleChange}
          />
          <TextField
            floatingLabelText="Type"
            floatingLabelStyle={styles.floatingLabelStyle}
            name="type"
            onChange={this.handleChange}
          />
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
          <ul>
            <li>
              <Checkbox
                label="Allow Pickup"
                name="allowPickup"
                onCheck={this.handleChange}
              />
            </li>
            <li>
              <Checkbox
                label="Allow Ship"
                name="allowShip"
                onCheck={this.handleChange}
              />
            </li>
            <li>
              <Checkbox
                label="Disabled"
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

SalesChannelNewPage.childContextTypes = {
  muiTheme: PropTypes.object.isRequired,
};

SalesChannelNewPage.propTypes = propTypes;

function mapStateToProps(state) {
  return {
    isAuthenticated: state.auth.isAuthenticated,
    salesChannel: state.salesChannels.salesChannel,
    catalogs: state.catalogs.results,
    priceLists: state.priceLists.results,
    error: state.salesChannels.error,
  };
}

export default withRouter(connect(mapStateToProps)(SalesChannelNewPage));
