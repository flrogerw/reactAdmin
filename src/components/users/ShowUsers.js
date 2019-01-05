import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import autoBind from 'react-autobind';
import ActionButtons from '../home/ActionButtons';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';

const propTypes = {
  dispatch: PropTypes.func.isRequired,
  usersList: PropTypes.object.isRequired,
};

class ShowUsers extends Component {
  constructor() {
    super();
    autoBind(this);
  }
  getChildContext() {
    return { muiTheme: getMuiTheme(baseTheme) };
  }
  renderRowsTable() {
    return this.props.usersList.results.map(item =>
      <TableRow key={item.id}>
        <TableRowColumn key={item.id}>{item.id}</TableRowColumn>
        <TableRowColumn key={item.id}>{item.name}</TableRowColumn>
        <TableRowColumn key={item.id}>{item.email}</TableRowColumn>
        <TableRowColumn key={item.id}>{item.signupDate}</TableRowColumn>
        <TableRowColumn key={item.id}>
          <ActionButtons
            onEdit={`/users/${item.id}`}
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
              <TableHeaderColumn>Email</TableHeaderColumn>
              <TableHeaderColumn>Sign Up Date</TableHeaderColumn>
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

ShowUsers.childContextTypes = {
  muiTheme: PropTypes.object.isRequired,
};

ShowUsers.propTypes = propTypes;

export default connect()(ShowUsers);
