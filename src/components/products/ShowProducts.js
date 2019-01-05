import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import autoBind from 'react-autobind';
import { fetchProducts, deleteProduct, clearProductsErrors } from '../../actions';
import DialogModal from '../home/DialogModal';
import ActionButtons from '../home/ActionButtons';
import Alert from '../home/Alert';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';

const propTypes = {
  dispatch: PropTypes.func.isRequired,
  productsList: PropTypes.object.isRequired,
  productDelete: PropTypes.bool,
  onProductDisable: PropTypes.func.isRequired,
};

class ShowProducts extends Component {
  constructor() {
    super();
    this.state = {
      open: false,
      deleteId: 0,
      alertOpen: false,
      alertMessage: '',
      delete: false,
    };
    autoBind(this);
  }
  getChildContext() {
    return { muiTheme: getMuiTheme(baseTheme) };
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.productDelete && this.state.delete) {
      this.setState({
        delete: false,
        alertOpen: true,
        alertMessage: 'Product deleted!',
      });
      this.handleClose();
    }
    if (nextProps.error) {
      this.setState({
        delete: false,
        alertOpen: true,
        alertMessage: `${nextProps.error.statusCode} ${nextProps.error.error} ${nextProps.error.message}`,
      });
    }
  }
  handleOpen(id) {
    this.setState({
      open: true,
      deleteId: id,
    });
  }
  handleClose() {
    this.setState({
      open: false,
      deleteId: 0,
    });
  }
  handleDelete() {
    this.setState({
      delete: true,
    });
    this.props.dispatch(deleteProduct(this.state.deleteId));
  }
  handleDisable(item) {
    const data = item;
    data.disabled = !item.disabled;
    this.props.onProductDisable(data);
  }
  alertHandleClose() {
    this.setState({
      alertMessage: '',
      alertOpen: false,
    });
    this.props.dispatch(clearProductsErrors());
    this.props.dispatch(fetchProducts());
  }
  renderRowsTable() {
    return this.props.productsList.results.map(item =>
      <TableRow key={item.id}>
        <TableRowColumn key={item.id}>{item.id}</TableRowColumn>
        <TableRowColumn key={item.id}>{item.name}</TableRowColumn>
        <TableRowColumn key={item.id}>{item.description}</TableRowColumn>
        <TableRowColumn key={item.id}>
          <ActionButtons
            onEdit={`/products/${item.id}`}
            onDelete={() => this.handleOpen(item.id)}
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
        <DialogModal
          dialogOpen={this.state.open}
          dialogHandleClose={this.handleClose}
          dialogHandleSubmit={() => this.handleDelete()}
          dialogTitle="Delete Product"
          dialogMessage="Do you really want to delete this product?"
          dialogActionTitle="Delete"
        />
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
              <TableHeaderColumn>Description</TableHeaderColumn>
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

ShowProducts.childContextTypes = {
  muiTheme: PropTypes.object.isRequired,
};

ShowProducts.propTypes = propTypes;

function mapStateToProps(state) {
  return {
    productDelete: state.products.productDelete,
    error: state.products.error,
  };
}

export default connect(mapStateToProps)(ShowProducts);
