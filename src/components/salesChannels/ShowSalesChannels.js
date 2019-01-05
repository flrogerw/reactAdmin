import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import autoBind from 'react-autobind';
import { fetchSalesChannels, clearSalesChannelsErrors } from '../../actions';
import ActionButtons from '../home/ActionButtons';
import Alert from '../home/Alert';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import Checkbox from 'material-ui/Checkbox';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';

const propTypes = {
  dispatch: PropTypes.func,
  salesChannelsList: PropTypes.object,
  salesChannelDisabled: PropTypes.bool,
  onSalesChannelDisable: PropTypes.func,
};

class ShowSalesChannels extends Component {
  constructor() {
    super();
    this.state = {
      disableId: 0,
      alertOpen: false,
      alertMessage: '',
    };
    autoBind(this);
  }
  getChildContext() {
    return { muiTheme: getMuiTheme(baseTheme) };
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.error) {
      this.setState({
        delete: false,
        alertOpen: true,
        alertMessage: `${nextProps.error.statusCode} ${nextProps.error.error} ${nextProps.error.message}`,
      });
    }
  }
  handleDisable(item) {
    const data = item;
    data.disabled = !item.disabled;
    this.props.onSalesChannelDisable(data);
  }
  handleClose() {
    this.setState({
      open: false,
      disableId: 0,
    });
  }
  alertHandleClose() {
    this.setState({
      alertMessage: '',
      alertOpen: false,
    });
    this.props.dispatch(clearSalesChannelsErrors());
    this.props.dispatch(fetchSalesChannels());
  }
  renderRowsTable() {
    const isDisabled = true;
    return this.props.salesChannelsList.results.map(item =>
      <TableRow key={item.id}>
        <TableRowColumn key={item.id}>{item.id}</TableRowColumn>
        <TableRowColumn key={item.id}>{item.name}</TableRowColumn>
        <TableRowColumn key={item.id}>{item.displayName}</TableRowColumn>
        <TableRowColumn key={item.id}>{item.subdomain}</TableRowColumn>
        <TableRowColumn key={item.id}>{item.catalogName}</TableRowColumn>
        <TableRowColumn key={item.id}>{item.priceListName}</TableRowColumn>
        <TableRowColumn key={item.id}>
          <Checkbox
            checked={item.web}
            disabled={isDisabled}
          />
        </TableRowColumn>
        <TableRowColumn key={item.id}>
          <Checkbox
            checked={item.store}
            disabled={isDisabled}
          />
        </TableRowColumn>
        <TableRowColumn key={item.id}>
          <Checkbox
            checked={item.allowPickup}
            disabled={isDisabled}
          />
        </TableRowColumn>
        <TableRowColumn key={item.id}>
          <Checkbox
            checked={item.allowShip}
            disabled={isDisabled}
          />
        </TableRowColumn>
        <TableRowColumn key={item.id} colSpan="2">
          <ActionButtons
            onEdit={`/saleschannels/${item.id}`}
            onDisable={() => this.handleDisable(item)}
            disabled={item.disabled}
          />
        </TableRowColumn>
      </TableRow>
    );
  }
  render() {
    const tableStyles = {
      stripedRows: true,
      displaySelectAll: false,
      adjustForCheckbox: false,
      selectable: false,
      displayRowCheckbox: false,
    };
    return (
      <div>
        <Alert
          alertOpen={this.state.alertOpen}
          alertHandleClose={() => this.alertHandleClose()}
          alertMessage={this.state.alertMessage}
        />
        <Table>
          <TableHeader
            displaySelectAll={tableStyles.displaySelectAll}
            adjustForCheckbox={tableStyles.adjustForCheckbox}
          >
            <TableRow
              selectable={tableStyles.selectable}
            >
              <TableHeaderColumn>ID</TableHeaderColumn>
              <TableHeaderColumn>Name</TableHeaderColumn>
              <TableHeaderColumn>Display Name</TableHeaderColumn>
              <TableHeaderColumn>Subdomain</TableHeaderColumn>
              <TableHeaderColumn>Catalog</TableHeaderColumn>
              <TableHeaderColumn>Price List</TableHeaderColumn>
              <TableHeaderColumn>Web</TableHeaderColumn>
              <TableHeaderColumn>Store</TableHeaderColumn>
              <TableHeaderColumn>Allow Pickup</TableHeaderColumn>
              <TableHeaderColumn>Allow Ship</TableHeaderColumn>
              <TableHeaderColumn colSpan="2">Actions</TableHeaderColumn>
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
    );
  }
}

ShowSalesChannels.childContextTypes = {
  muiTheme: PropTypes.object.isRequired,
};

ShowSalesChannels.propTypes = propTypes;

function mapStateToProps(state) {
  return {
    salesChannelDisabled: state.salesChannels.salesChannelDisabled,
    error: state.salesChannels.error,
  };
}

export default connect(mapStateToProps)(ShowSalesChannels);
