import React, { Component, PropTypes } from 'react';

const propTypes = {
  children: PropTypes.any,
};

class Layout extends Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    const children = this.props.children;
    return (
      <div>
        {children}
      </div>
    );
  }
}

Layout.propTypes = propTypes;

export default Layout;
