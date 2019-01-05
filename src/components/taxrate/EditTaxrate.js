import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import autoBind from 'react-autobind';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import TextField from 'material-ui/TextField';
import Checkbox from 'material-ui/Checkbox';
import RaisedButton from 'material-ui/RaisedButton';
import { cyan900 } from 'material-ui/styles/colors';
import DialogModal from '../home/DialogModal';
import _ from 'lodash';

const propTypes = {
  taxrates: PropTypes.any,
  onSave: PropTypes.func,
};

class EditTaxrate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
    };
    autoBind(this);
  }
  getChildContext() {
    return { muiTheme: getMuiTheme(baseTheme) };
  }
  componentWillReceiveProps(nextProps) {
    let taxrates = nextProps.taxrates;
    if (nextProps.taxrates.taxrate.zipcode) {
      taxrates = nextProps.taxrates;
    } else {
      taxrates.taxrate = nextProps.taxrates.results[0];
    }
    taxrates.taxrate.zipcode = (taxrates.taxrate.zipcode === null) ? '00000' : taxrates.taxrate.zipcode;
    this.setState({ taxrates });
  }
  handleChange(e) {
    const nextState = this.props.taxrates;
    if (e.target.type === 'checkbox') {
      _.set(nextState.taxrate, e.target.name, e.target.checked);
    } else {
      _.set(nextState.taxrate, e.target.name, e.target.value);
    }
    this.setState({
      taxrates: nextState,
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
    this.props.onSave(this.state.taxrates);
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
        <div>
          <DialogModal
            dialogOpen={this.state.open}
            dialogHandleClose={this.handleClose}
            dialogHandleSubmit={() => this.saveChanges()}
            dialogTitle="Save tax rate changes"
            dialogMessage="Do you really want to save the changes in this tax rate?"
            dialogActionTitle="Save"
          />
          <TextField
            floatingLabelText="Zipcode"
            floatingLabelStyle={styles.floatingLabelStyle}
            inputStyle={styles.inputStyle}
            value={this.props.taxrates.taxrate.zipcode}
            disabled
          />

          <TextField
            floatingLabelText="Name"
            floatingLabelStyle={styles.floatingLabelStyle}
            value={this.props.taxrates.taxrate.name}
            name="name"
            onChange={this.handleChange}
          />
          <TextField
            floatingLabelText="Tax"
            floatingLabelStyle={styles.floatingLabelStyle}
            value={this.props.taxrates.taxrate.tax}
            name="tax"
            onChange={this.handleChange}
          />
          <ul>
            <li>
              <Checkbox
                label="Disabled"
                checked={this.props.taxrates.taxrate.disabled}
                name="disabled"
                onCheck={this.handleChange}
              />
            </li>
          </ul>
          <br />
          <br />
        </div>
        <RaisedButton
          label="Save"
          primary
          onClick={this.handleOpen}
        />
      </div>
    );
  }
}

EditTaxrate.childContextTypes = {
  muiTheme: PropTypes.object.isRequired,
};

EditTaxrate.propTypes = propTypes;

function mapStateToProps(state) {
  return {
    taxrates: state.taxrates,
  };
}

export default connect(mapStateToProps)(EditTaxrate);
