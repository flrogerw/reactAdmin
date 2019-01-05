import React, { Component, PropTypes } from 'react';
import { browserHistory, withRouter } from 'react-router';
import { connect } from 'react-redux';
import { fetchUser, editUser, clearUsersErrors } from '../actions/';
import autoBind from 'react-autobind';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import EditUser from '../components/users/EditUser';
import Alert from '../components/home/Alert';

const propTypes = {
  dispatch: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
  user: PropTypes.object,
  userId: PropTypes.string.isRequired,
  error: PropTypes.any,
};

class UserEditPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      alertOpen: false,
      alertMessage: '',
      edited: false,
    };
    autoBind(this);
  }
  getChildContext() {
    return { muiTheme: getMuiTheme(baseTheme) };
  }
  componentWillMount() {
    if (!this.props.isAuthenticated) {
      browserHistory.push('/');
    }
  }
  componentDidMount() {
    this.props.dispatch(fetchUser(this.props.userId));
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.error) {
      this.setState({
        alertOpen: true,
        edited: false,
        alertMessage: `${nextProps.error.statusCode} ${nextProps.error.error} ${nextProps.error.message}`,
      });
    }
    if (nextProps.user && !nextProps.error && this.state.edited) {
      this.setState({
        alertOpen: true,
        alertMessage: 'User edited succesfully!',
      });
    }
  }
  saveEditUser(user) {
    this.setState({
      edited: true,
    });
    this.props.dispatch(editUser(user));
  }
  alertHandleClose() {
    this.setState({
      alertOpen: false,
      edited: false,
      alertMessage: '',
    });
    this.props.dispatch(clearUsersErrors());
    browserHistory.push('/users');
  }
  render() {
    const authPage = {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    };
    return (
      <div className="users component" style={authPage}>
        <h2>User Edit</h2>
        <Alert
          alertOpen={this.state.alertOpen}
          alertHandleClose={() => this.alertHandleClose()}
          alertMessage={this.state.alertMessage}
        />
        <div className="content">
          <EditUser
            user={this.props.user}
            onSave={data => this.saveEditUser(data)}
          />
        </div>
      </div>
    );
  }
}

UserEditPage.childContextTypes = {
  muiTheme: PropTypes.object.isRequired,
};

UserEditPage.propTypes = propTypes;

function mapStateToProps(state, ownProps) {
  return {
    isAuthenticated: state.auth.isAuthenticated,
    user: state.users.user,
    userId: ownProps.params.id,
    error: state.users.error,
  };
}

export default withRouter(connect(mapStateToProps)(UserEditPage));
