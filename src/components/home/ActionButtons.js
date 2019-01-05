import React, { Component, PropTypes } from 'react';
import autoBind from 'react-autobind';
import { connect } from 'react-redux';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';
import Toggle from 'material-ui/Toggle';
import { Link } from 'react-router';

const propTypes = {
  onEdit: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  onDelete: PropTypes.func,
  onDisable: PropTypes.func,
};

class ActionButtons extends Component {
  constructor() {
    super();
    autoBind(this);
  }
  getChildContext() {
    return { muiTheme: getMuiTheme(baseTheme) };
  }
  render() {
    const editIcon = <FontIcon className="fa fa-pencil-square-o" />;
    const deleteIcon = <FontIcon className="fa fa-trash" />;
    let disableButton = '';
    let deleteButton = '';
    if (this.props.onDelete) {
      deleteButton = (<li className="delete">
        <IconButton
          tooltip="Delete"
          onClick={this.props.onDelete}
        >
          {deleteIcon}
        </IconButton>
      </li>);
    }
    if (this.props.onDisable) {
      disableButton = (<li className="is-disabled">
        <Toggle
          labelPosition="right"
          onToggle={this.props.onDisable}
          defaultToggled={!this.props.disabled}
        />
      </li>);
    }
    return (
      <div id="action-buttons">
        <ul>
          <li className="edit"><Link to={this.props.onEdit}><IconButton tooltip="Edit">{editIcon}</IconButton></Link></li>
          {deleteButton}
          {disableButton}
        </ul>
      </div>
    );
  }
}

ActionButtons.childContextTypes = {
  muiTheme: PropTypes.object.isRequired,
};

ActionButtons.propTypes = propTypes;

export default connect()(ActionButtons);
