import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import autoBind from 'react-autobind';
import { fetchPriceLists, deletePriceList, clearPriceListsErrors } from '../../actions';
import DialogModal from '../home/DialogModal';
import ActionButtons from '../home/ActionButtons';
import Alert from '../home/Alert';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';

const propTypes = {
  dispatch: PropTypes.func.isRequired,
  priceLists: PropTypes.object.isRequired,
  priceListDelete: PropTypes.bool,
  onPriceListDisable: PropTypes.func,
};

class ShowPriceLists extends Component {
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
    if (nextProps.priceListDelete && this.state.delete) {
      this.setState({
        delete: false,
        alertOpen: true,
        alertMessage: 'PriceList deleted!',
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
    this.props.dispatch(deletePriceList(this.state.deleteId));
  }
  handleDisable(item) {
    const data = item;
    data.disabled = !item.disabled;
    this.props.onPriceListDisable(data);
  }
  alertHandleClose() {
    this.setState({
      alertMessage: '',
      alertOpen: false,
    });
    this.props.dispatch(clearPriceListsErrors());
    this.props.dispatch(fetchPriceLists());
  }
  renderRowsTable() {
    return this.props.priceLists.results.map(item =>
      <TableRow key={item.id}>
        <TableRowColumn key={item.id}>{item.id}</TableRowColumn>
        <TableRowColumn key={item.id}>{item.name}</TableRowColumn>
        <TableRowColumn key={item.id}>{item.description}</TableRowColumn>
        <TableRowColumn key={item.id}>
          <ActionButtons
            onEdit={`/pricelists/${item.id}`}
            onDelete={() => this.handleOpen(item.id)}
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
          dialogTitle="Delete PriceList"
          dialogMessage="Do you really want to delete this priceList?"
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

ShowPriceLists.childContextTypes = {
  muiTheme: PropTypes.object.isRequired,
};

ShowPriceLists.propTypes = propTypes;

function mapStateToProps(state) {
  return {
    priceListDelete: state.priceLists.priceListDelete,
    error: state.priceLists.error,
  };
}

export default connect(mapStateToProps)(ShowPriceLists);
