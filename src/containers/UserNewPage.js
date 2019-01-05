import React, { Component, PropTypes } from 'react';
import { withRouter, browserHistory } from 'react-router';
import { connect } from 'react-redux';
import autoBind from 'react-autobind';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import { setUser, clearUsersErrors } from '../actions';
import { cyan900 } from 'material-ui/styles/colors';
import Alert from '../components/home/Alert';
import moment from 'moment';

const propTypes = {
  dispatch: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
  user: PropTypes.object,
  error: PropTypes.any,
};

class UserNewPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      alertOpen: false,
      alertMessage: '',
      error: false,
      user: {
        name: '',
        email: '',
        signupDate: '',
      },
    };
    autoBind(this);
  }
  getChildContext() {
    return { muiTheme: getMuiTheme(baseTheme) };
  }
  componentWillMount() {
    if (!this.props.isAuthenticated) {
      browserHistory.goBack();
    }
    const user = this.state.user;
    user.signupDate = moment().format('YYYY-MM-DD');
    this.setState({
      user: user, // eslint-disable-line object-shorthand
    });
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.error) {
      this.setState({
        alertOpen: true,
        error: true,
        alertMessage: `${nextProps.error.statusCode} ${nextProps.error.error} ${nextProps.error.message}`,
      });
    }
    if (nextProps.user && !nextProps.error) {
      this.setState({
        alertOpen: true,
        error: false,
        alertMessage: 'User saved successfully!',
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
  handleSubmit() {
    this.props.dispatch(clearUsersErrors());
    this.props.dispatch(setUser(this.state.user));
  }
  alertHandleClose() {
    this.setState({
      alertMessage: '',
      alertOpen: false,
    });
    if (!this.state.error) {
      browserHistory.push('/users');
    }
  }
  render() {
    const authPage = {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    };
    const styles = {
      floatingLabelStyle: {
        color: cyan900,
      },
      inputStyle: {
        marginRight: '1%',
      },
    };
    return (
      <div className="users component" style={authPage}>
        <h2>New User</h2>
        <Alert
          alertOpen={this.state.alertOpen}
          alertHandleClose={() => this.alertHandleClose()}
          alertMessage={this.state.alertMessage}
        />
        <div className="content">
          <TextField
            floatingLabelText="Name"
            floatingLabelStyle={styles.floatingLabelStyle}
            name="name"
            onChange={this.handleChange}
          />
          <TextField
            floatingLabelText="Email"
            floatingLabelStyle={styles.floatingLabelStyle}
            name="email"
            onChange={this.handleChange}
          />
          <TextField
            floatingLabelText="Sign Up Date"
            floatingLabelStyle={styles.floatingLabelStyle}
            value={this.state.user.signupDate}
            name="signupDate"
            disabled
          />
          <div className="action-buttons bottom">
            <RaisedButton
              label="Save"
              primary
              onClick={this.handleSubmit}
            />
          </div>
        </div>
      </div>
    );
  }
}

UserNewPage.childContextTypes = {
  muiTheme: PropTypes.object.isRequired,
};

UserNewPage.propTypes = propTypes;

function mapStateToProps(state) {
  return {
    isAuthenticated: state.auth.isAuthenticated,
    user: state.users.user,
    error: state.users.error,
  };
}

export default withRouter(connect(mapStateToProps)(UserNewPage));
