import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Header from '../components/home/Header';
import { logout, menuToggle } from '../actions/';

import '../assets/stylesheets/base.scss';

const injectTapEventPlugin = require('react-tap-event-plugin');
injectTapEventPlugin();

const propTypes = {
  children: PropTypes.any,
  dispatch: PropTypes.func,
};

class App extends Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    const { children } = this.props;
    return (
      <div>
        <Header
          dispatch={this.props.dispatch}
          logout={() => this.props.dispatch(logout())}
          menuToggle={() => this.props.dispatch(menuToggle())}
        />
        {children}
      </div>
      );
  }
}

App.propTypes = propTypes;

export default connect()(App);
