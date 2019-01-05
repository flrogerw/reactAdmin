import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import autoBind from 'react-autobind';
import { fetchItems, clearItemsErrors } from '../../actions';
import ActionButtons from '../home/ActionButtons';
import Alert from '../home/Alert';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';

const propTypes = {
  dispatch: PropTypes.func,
  itemsList: PropTypes.object,
  itemDisabled: PropTypes.bool,
  onItemDisable: PropTypes.func,
};

class ShowItems extends Component {
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
    this.props.onItemDisable(data);
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
    this.props.dispatch(clearItemsErrors());
    this.props.dispatch(fetchItems());
  }
  renderRowsTable() {
    return this.props.itemsList.results.map(item =>
      <TableRow key={item.id}>
        <TableRowColumn key={item.id}>{item.id}</TableRowColumn>
        <TableRowColumn key={item.id}>{item.name}</TableRowColumn>
        <TableRowColumn key={item.id}>{item.productName}</TableRowColumn>
        <TableRowColumn key={item.id}>{item.sku}</TableRowColumn>
        <TableRowColumn key={item.id}>
          <ActionButtons
            onEdit={`/items/${item.id}`}
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
              <TableHeaderColumn>Product</TableHeaderColumn>
              <TableHeaderColumn>SKU</TableHeaderColumn>
              <TableHeaderColumn>Actions</TableHeaderColumn>
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

ShowItems.childContextTypes = {
  muiTheme: PropTypes.object.isRequired,
};

ShowItems.propTypes = propTypes;

function mapStateToProps(state) {
  return {
    itemDisabled: state.items.itemDisabled,
    error: state.items.error,
  };
}

export default connect(mapStateToProps)(ShowItems);
