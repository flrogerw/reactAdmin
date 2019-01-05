import React, { PropTypes } from 'react';
import { browserHistory } from 'react-router';
import { connect } from 'react-redux';
import { clearAuthErrors, login } from '../actions/';
import autoBind from 'react-autobind';
import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import { cyan50 } from 'material-ui/styles/colors';

const propTypes = {
  dispatch: PropTypes.func,
  auth: PropTypes.object,
};

class LoginPage extends React.Component {
  constructor() {
    super();
    this.state = {
      email: '',
      password: '',
    };
    autoBind(this);
  }

  getChildContext() {
    return { muiTheme: getMuiTheme(baseTheme) };
  }

  componentWillMount() {
    this.props.dispatch(clearAuthErrors());
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.auth.isAuthenticated) {
      browserHistory.push('/saleschannels?page=1');
    }
  }

  formValid() {
    return (
      this.state.email !== '' &&
      this.state.password !== ''
    );
  }

  handleSubmit(e) {
    e.preventDefault();
    if (!this.formValid()) {
      return;
    }
    const data = {
      email: this.state.email,
      password: this.state.password,
    };
    this.props.dispatch(login(data));
  }

  render() {
    const fullWidth = true;
    const primary = true;
    const alert = this.props.auth.error ? <div className="error">{this.props.auth.error}</div> : null;
    const authPage = {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'space-around',
    };
    const styles = {
      floatingLabelStyle: {
        color: cyan50,
      },
    };
    let disabled;
    if (this.formValid()) {
      disabled = false;
    } else {
      disabled = true;
    }
    return (
      <div className="auth-page" style={authPage}>
        <div className="box">
          <h2>Sign in with your account</h2>
          <form onSubmit={this.handleSubmit}>
            <TextField
              value={this.state.email}
              type="text"
              onChange={e => {
                this.setState({
                  email: e.target.value,
                });
              }}
              id="email"
              fullWidth={fullWidth}
              floatingLabelText="Email"
              floatingLabelStyle={styles.cyan50}
            />
            <TextField
              value={this.state.password}
              type="password"
              onChange={e => {
                this.setState({
                  password: e.target.value,
                });
              }}
              id="password"
              fullWidth={fullWidth}
              floatingLabelText="Password"
              floatingLabelStyle={styles.cyan50}
            />
            {alert}
            <RaisedButton
              disabled={disabled}
              primary={primary}
              type="submit"
              label="Login"
              fullWidth={fullWidth}
              style={{ margin: '5% 0' }}
            />
          </form>
        </div>
      </div>
      );
  }
}

LoginPage.childContextTypes = {
  muiTheme: PropTypes.object.isRequired,
};

LoginPage.propTypes = propTypes;

function mapStateToProps(state) {
  return {
    auth: state.auth,
  };
}

export default connect(mapStateToProps)(LoginPage);
