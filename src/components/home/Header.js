import React, { Component, PropTypes } from 'react';
import { browserHistory } from 'react-router';
import { connect } from 'react-redux';
import autoBind from 'react-autobind';
import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import MenuIcon from 'material-ui/svg-icons/navigation/menu';

import SideNavBar from './SideNavBar';

const propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
  logout: PropTypes.func.isRequired,
  dispatch: PropTypes.func.isRequired,
  menuToggle: PropTypes.func.isRequired,
};

class Header extends Component { // eslint-disable-line react/prefer-stateless-function
  constructor() {
    super();
    this.state = {
      moveHeaderTitle: {
        paddingLeft: '25px',
      },
    };
    autoBind(this);
  }
  getChildContext() {
    return { muiTheme: getMuiTheme(baseTheme) };
  }
  handleLogout(e) {
    e.preventDefault();
    this.props.logout();
    browserHistory.push('/');
  }
  handleMenu(e) {
    e.preventDefault();
    this.props.menuToggle();
  }
  render() {
    const { isAuthenticated } = this.props;
    let iconLeft;
    if (!!isAuthenticated) {
      iconLeft = <IconButton onClick={this.handleMenu}><MenuIcon /></IconButton>;
    } else {
      iconLeft = <i></i>;
    }
    return (
      <div>
        <AppBar
          title="Administrator"
          iconElementLeft={iconLeft}
          iconElementRight={(isAuthenticated) ? <IconMenu
            iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}
            targetOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
          >
            <MenuItem onClick={this.handleLogout}>Logout</MenuItem>
          </IconMenu> : <i></i>}
        />
        <SideNavBar menuToggle={this.props.menuToggle} />
      </div>
    );
  }
}

Header.childContextTypes = {
  muiTheme: PropTypes.object.isRequired,
};

Header.propTypes = propTypes;

function mapStateToProps(state) {
  return {
    isAuthenticated: state.auth.isAuthenticated,
  };
}

export default connect(mapStateToProps)(Header);
