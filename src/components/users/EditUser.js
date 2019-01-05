import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import autoBind from 'react-autobind';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import TextField from 'material-ui/TextField';
import DatePicker from 'material-ui/DatePicker';
import RaisedButton from 'material-ui/RaisedButton';
import { cyan900 } from 'material-ui/styles/colors';
import DialogModal from '../home/DialogModal';

const propTypes = {
  user: PropTypes.object.isRequired,
  onSave: PropTypes.func.isRequired,
};

class EditUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {
        id: 0,
        name: '',
        email: '',
        signupDate: '',
      },
      date: new Date(),
      open: false,
    };
    autoBind(this);
  }
  getChildContext() {
    return { muiTheme: getMuiTheme(baseTheme) };
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.user) {
      this.setState({
        user: nextProps.user,
      });
      this.setState({
        date: { date: new Date(nextProps.user.signupDate) },
      });
    }
  }
  handleChange(e) {
    const nextState = this.state.user;
    nextState[e.target.name] = e.target.value;
    this.setState({
      user: nextState,
    });
  }
  handleDatePickerChange(e, date) {
    this.setState(this.state.user.signupDate = date);
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
    this.props.onSave(this.state.user);
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
    const autoOk = true;
    return (
      <div>
        <DialogModal
          dialogOpen={this.state.open}
          dialogHandleClose={this.handleClose}
          dialogHandleSubmit={() => this.saveChanges()}
          dialogTitle="Save Sales Channel changes"
          dialogMessage="Do you really want to save the changes in this sales channel?"
          dialogActionTitle="Save"
        />
        <TextField
          floatingLabelText="ID"
          floatingLabelStyle={styles.floatingLabelStyle}
          inputStyle={styles.inputStyle}
          value={this.state.user.id}
          disabled
        />
        <TextField
          floatingLabelText="Name"
          floatingLabelStyle={styles.floatingLabelStyle}
          value={this.state.user.name}
          name="name"
          onChange={this.handleChange}
        />
        <TextField
          floatingLabelText="Email"
          floatingLabelStyle={styles.floatingLabelStyle}
          value={this.state.user.email}
          name="email"
          onChange={this.handleChange}
        />
        <DatePicker
          floatingLabelText="Sign Up Date"
          floatingLabelStyle={styles.floatingLabelStyle}
          hintText="Sign Up Date"
          defaultDate={this.state.date}
          autoOk={autoOk}
          name="signupDate"
          onChange={this.handleDatePickerChange}
        />
        <div className="action-buttons bottom">
          <RaisedButton
            label="Save"
            primary
            onClick={this.handleOpen}
          />
        </div>
      </div>
    );
  }
}

EditUser.childContextTypes = {
  muiTheme: PropTypes.object.isRequired,
};

EditUser.propTypes = propTypes;

function mapStateToProps(state) {
  return {
    user: state.users.user,
  };
}

export default connect(mapStateToProps)(EditUser);
