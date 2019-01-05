import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import autoBind from 'react-autobind';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import { cyan900 } from 'material-ui/styles/colors';
import DialogModal from '../home/DialogModal';

const propTypes = {
  catalog: PropTypes.any,
  onSave: PropTypes.func,
};

class EditCatalog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      catalog: {
        id: 0,
        name: '',
        description: '',
      },
      open: false,
    };
    autoBind(this);
  }
  getChildContext() {
    return { muiTheme: getMuiTheme(baseTheme) };
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.catalog) {
      this.setState({ catalog: nextProps.catalog });
    }
  }
  handleChange(e) {
    const nextState = this.state.catalog;
    if (e.target.type === 'checkbox') {
      nextState[e.target.name] = e.target.checked;
    } else {
      nextState[e.target.name] = e.target.value;
    }
    this.setState({
      catalog: nextState,
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
    this.props.onSave(this.state.catalog);
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
          dialogTitle="Save Catalog changes"
          dialogMessage="Do you really want to save the changes in this catalog?"
          dialogActionTitle="Save"
        />
        <TextField
          floatingLabelText="ID"
          floatingLabelStyle={styles.floatingLabelStyle}
          inputStyle={styles.inputStyle}
          value={this.state.catalog.id}
          disabled
        />
        <TextField
          floatingLabelText="Name"
          floatingLabelStyle={styles.floatingLabelStyle}
          value={this.state.catalog.name}
          name="name"
          onChange={this.handleChange}
        />
        <TextField
          floatingLabelText="Description"
          floatingLabelStyle={styles.floatingLabelStyle}
          value={this.state.catalog.description}
          name="name"
          onChange={this.handleChange}
        />
        <RaisedButton
          label="Save"
          primary
          onClick={this.handleOpen}
        />
      </div>
    );
  }
}

EditCatalog.childContextTypes = {
  muiTheme: PropTypes.object.isRequired,
};

EditCatalog.propTypes = propTypes;

function mapStateToProps(state) {
  return {
    catalog: state.catalogs.catalog,
  };
}

export default connect(mapStateToProps)(EditCatalog);
