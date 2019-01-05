import React, { PropTypes } from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

const propTypes = {
  alertOpen: PropTypes.bool.isRequired,
  alertMessage: PropTypes.string.isRequired,
  alertHandleClose: PropTypes.func.isRequired,
};

function Alert({ alertOpen, alertMessage, alertHandleClose }) {
  const actions = [
    <FlatButton
      label="OK"
      primary
      keyboardFocused
      onTouchTap={alertHandleClose}
    />,
  ];
  return (
    <Dialog
      actions={actions}
      open={alertOpen}
    >
      {alertMessage}
    </Dialog>
  );
}

Alert.propTypes = propTypes;

export default Alert;
