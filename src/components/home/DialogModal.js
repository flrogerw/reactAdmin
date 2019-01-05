import React, { PropTypes } from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

const propTypes = {
  dialogOpen: PropTypes.bool.isRequired,
  dialogHandleClose: PropTypes.func.isRequired,
  dialogHandleSubmit: PropTypes.func.isRequired,
  dialogTitle: PropTypes.string,
  dialogMessage: PropTypes.string.isRequired,
  dialogActionTitle: PropTypes.string.isRequired,
};

function DialogModal({ dialogOpen, dialogHandleClose, dialogHandleSubmit, dialogTitle, dialogMessage, dialogActionTitle }) {
  const actions = [
    <FlatButton
      label="Cancel"
      primary
      onTouchTap={dialogHandleClose}
    />,
    <FlatButton
      label={dialogActionTitle}
      primary
      keyboardFocused
      onTouchTap={dialogHandleSubmit}
    />,
  ];
  return (
    <Dialog
      title={dialogTitle}
      actions={actions}
      modal
      open={dialogOpen}
      onRequestClose={dialogHandleClose}
    >
      {dialogMessage}
    </Dialog>
  );
}

DialogModal.propTypes = propTypes;

export default DialogModal;
