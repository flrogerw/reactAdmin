import React, { Component, PropTypes } from 'react';
import { browserHistory, withRouter } from 'react-router';
import { connect } from 'react-redux';
import { fetchItem, editItem, clearItemsErrors } from '../actions/';
import autoBind from 'react-autobind';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import EditItem from '../components/items/EditItem';
import Alert from '../components/home/Alert';

const propTypes = {
  dispatch: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
  item: PropTypes.any,
  itemId: PropTypes.string.isRequired,
  error: PropTypes.any,
};

class ItemEditPage extends Component {
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
    this.props.dispatch(fetchItem(this.props.itemId));
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.error) {
      this.setState({
        alertOpen: true,
        edited: false,
        alertMessage: `${nextProps.error.statusCode} ${nextProps.error.error} ${nextProps.error.message}`,
      });
    }
    if (nextProps.item && !nextProps.error && this.state.edited) {
      this.setState({
        alertOpen: true,
        alertMessage: 'Product item edited succesfully!',
      });
    }
  }
  saveEditItem(item) {
    this.setState({
      edited: true,
    });
    this.props.dispatch(editItem(item));
  }
  alertHandleClose() {
    this.setState({
      alertOpen: false,
      edited: false,
      alertMessage: '',
    });
    this.props.dispatch(clearItemsErrors());
    browserHistory.push('/items');
  }
  render() {
    const authPage = {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    };
    return (
      <div className="items component" style={authPage}>
        <h2>Product Item Edit</h2>
        <Alert
          alertOpen={this.state.alertOpen}
          alertHandleClose={() => this.alertHandleClose()}
          alertMessage={this.state.alertMessage}
        />
        <div className="content">
          <EditItem
            item={this.props.item}
            onSave={data => this.saveEditItem(data)}
          />
        </div>
      </div>
    );
  }
}

ItemEditPage.childContextTypes = {
  muiTheme: PropTypes.object.isRequired,
};

ItemEditPage.propTypes = propTypes;

function mapStateToProps(state, ownProps) {
  return {
    isAuthenticated: state.auth.isAuthenticated,
    item: state.items.item,
    itemId: ownProps.params.id,
    error: state.items.error,
  };
}

export default withRouter(connect(mapStateToProps)(ItemEditPage));
