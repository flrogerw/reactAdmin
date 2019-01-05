import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import autoBind from 'react-autobind';
import { fetchTaxrates, clearTaxrateErrors, deleteTaxrate } from '../../actions';
import ActionButtons from '../home/ActionButtons';
import Alert from '../home/Alert';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';
import DialogModal from '../home/DialogModal';

const propTypes = {
  dispatch: PropTypes.func,
  taxrates: PropTypes.object,
  taxrateDelete: PropTypes.bool,
  // onTaxrateDisable: PropTypes.func,
};

class ShowTaxrates extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      deleteId: '',
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
    if (nextProps.taxrateDelete && this.state.delete) {
      this.setState({
        delete: false,
        alertOpen: true,
        alertMessage: 'Taxrate deleted!',
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
      deleteId: '',
    });
  }
  handleDelete() {
    this.setState({
      delete: true,
    });
    this.props.dispatch(deleteTaxrate(this.state.deleteId));
  }
  alertHandleClose() {
    this.setState({
      alertMessage: '',
      alertOpen: false,
    });
    this.props.dispatch(clearTaxrateErrors());
    this.props.dispatch(fetchTaxrates());
  }
  renderRowsTable() {
    return this.props.taxrates.results.map(taxrate =>
      <TableRow key={taxrate.zipcode}>
        <TableRowColumn key={taxrate.zipcode}>{taxrate.zipcode}</TableRowColumn>
        <TableRowColumn key={taxrate.zipcode}>{taxrate.name}</TableRowColumn>
        <TableRowColumn key={taxrate.zipcode}>{taxrate.tax}</TableRowColumn>
        <TableRowColumn key={taxrate.zipcode}>
          <ActionButtons
            onDelete={() => this.handleOpen(taxrate.zipcode)}
            onEdit={`/taxrate/${taxrate.zipcode}`}
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
          dialogTitle="Delete Taxrate"
          dialogMessage="Do you really want to delete this taxrate?"
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
              <TableHeaderColumn>Zipcode</TableHeaderColumn>
              <TableHeaderColumn>Name</TableHeaderColumn>
              <TableHeaderColumn>Tax</TableHeaderColumn>
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

ShowTaxrates.childContextTypes = {
  muiTheme: PropTypes.object.isRequired,
};

ShowTaxrates.propTypes = propTypes;

function mapStateToProps(state) {
  return {
    error: state.taxrates.error,
    taxrates: state.taxrates,
    taxrateDelete: state.taxrates.taxrateDelete,
  };
}

export default connect(mapStateToProps)(ShowTaxrates);
