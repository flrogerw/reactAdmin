import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { browserHistory, Link, withRouter } from 'react-router';
import ShowUsers from '../components/users/ShowUsers';
import { clearAuthErrors, fetchUsers } from '../actions';
import autoBind from 'react-autobind';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import RaisedButton from 'material-ui/RaisedButton';
import Pagination from '../components/home/Pagination';
import TextField from 'material-ui/TextField';
import { cyan900 } from 'material-ui/styles/colors';

const propTypes = {
  dispatch: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
  users: PropTypes.object.isRequired,
  query: PropTypes.object.isRequired,
  router: PropTypes.object,
};

class UsersPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: props.users,
      search: '',
    };
    autoBind(this);
  }
  getChildContext() {
    return { muiTheme: getMuiTheme(baseTheme) };
  }
  componentWillMount() {
    // TODO : fix authentication - Gabo
    if (!this.props.isAuthenticated) {
      this.props.dispatch(clearAuthErrors());
      browserHistory.goBack();
    }
    const query = this.props.query;
    const router = this.props.router;
    if (!query.page) {
      query.page = 1;
      router.push({ pathname: '/users', query });
    } else {
      this.props.dispatch(fetchUsers(this.props.query));
    }
  }
  handleSearchChange(e) {
    const query = this.props.query;
    const router = this.props.router;
    const nextUsersInput = e.target.value;
    const nextUsers = (nextUsersInput !== '') ? nextUsersInput : '';
    this.setState({
      search: nextUsers,
    });
    if (nextUsers.length > 0) {
      query.search = nextUsers;
    } else {
      delete query.search;
    }
    query.page = 1;
    router.push({ pathname: '/users', query });
    this.props.dispatch(fetchUsers(this.props.query));
  }
  navigation(route) {
    this.props.dispatch(fetchUsers(route));
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
    const authPage = {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    };
    return (
      <div className="users component" style={authPage}>
        <h2>Users</h2>
        <div className="content">
          <div className="action-buttons">
            <Link to="/users/new">
              <RaisedButton
                label="Add new"
                primary
              />
            </Link>
          </div>
          <TextField
            floatingLabelText="Name/Email"
            floatingLabelStyle={styles.floatingLabelStyle}
            inputStyle={styles.inputStyle}
            value={this.state.search}
            onChange={this.handleSearchChange}
          />
          <hr />
          <ShowUsers usersList={this.props.users} />
        </div>
        <div className="action-buttons bottom">
          <Pagination
            paginationInfo={this.props.users.meta}
            pageCall={route => this.navigation(route)}
          />
        </div>
      </div>
    );
  }
}

UsersPage.childContextTypes = {
  muiTheme: PropTypes.object.isRequired,
};

UsersPage.propTypes = propTypes;

function mapStateToProps(state, ownProps) {
  return {
    isAuthenticated: state.auth.isAuthenticated,
    users: state.users,
    query: ownProps.location.query,
  };
}

export default withRouter(connect(mapStateToProps)(UsersPage));
