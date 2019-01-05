import React, { Component, PropTypes } from 'react';
import { browserHistory, withRouter } from 'react-router';
import { connect } from 'react-redux';
import { fetchSalesChannel, editSalesChannel, clearSalesChannelsErrors } from '../actions/';
import autoBind from 'react-autobind';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import EditSalesChannel from '../components/salesChannels/EditSalesChannel';
import Alert from '../components/home/Alert';

const propTypes = {
  dispatch: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
  salesChannel: PropTypes.any,
  salesChannelId: PropTypes.string.isRequired,
  error: PropTypes.any,
};

class SalesChannelEditPage extends Component {
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
    this.props.dispatch(fetchSalesChannel(this.props.salesChannelId));
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.error) {
      this.setState({
        alertOpen: true,
        edited: false,
        alertMessage: `${nextProps.error.statusCode} ${nextProps.error.error} ${nextProps.error.message}`,
      });
    }
    if (nextProps.salesChannel && !nextProps.error && this.state.edited) {
      this.setState({
        alertOpen: true,
        alertMessage: 'Sales channel edited succesfully!',
      });
    }
  }
  saveEditSalesChannel(salesChannel) {
    this.setState({
      edited: true,
    });
    this.props.dispatch(editSalesChannel(salesChannel));
  }
  alertHandleClose() {
    this.setState({
      alertOpen: false,
      edited: false,
      alertMessage: '',
    });
    this.props.dispatch(clearSalesChannelsErrors());
    browserHistory.push('/saleschannels');
  }
  render() {
    const authPage = {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    };
    return (
      <div className="sales-channels component" style={authPage}>
        <h2>Sales Channel Edit</h2>
        <Alert
          alertOpen={this.state.alertOpen}
          alertHandleClose={() => this.alertHandleClose()}
          alertMessage={this.state.alertMessage}
        />
        <div className="content">
          <EditSalesChannel
            salesChannel={this.props.salesChannel}
            onSave={data => this.saveEditSalesChannel(data)}
          />
        </div>
      </div>
    );
  }
}

SalesChannelEditPage.childContextTypes = {
  muiTheme: PropTypes.object.isRequired,
};

SalesChannelEditPage.propTypes = propTypes;

function mapStateToProps(state, ownProps) {
  return {
    isAuthenticated: state.auth.isAuthenticated,
    salesChannel: state.salesChannels.salesChannel,
    salesChannelId: ownProps.params.id,
    error: state.salesChannels.error,
  };
}

export default withRouter(connect(mapStateToProps)(SalesChannelEditPage));
