import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router';
import ShowSalesChannels from '../components/salesChannels/ShowSalesChannels';
import { fetchCatalogs, fetchPriceLists, fetchSalesChannels, disableSalesChannel } from '../actions';
import autoBind from 'react-autobind';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import RaisedButton from 'material-ui/RaisedButton';
import Pagination from '../components/home/Pagination';
import TextField from 'material-ui/TextField';
import { cyan900 } from 'material-ui/styles/colors';
const _ = require('lodash');

const propTypes = {
  dispatch: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
  salesChannels: PropTypes.object.isRequired,
  query: PropTypes.object.isRequired,
  router: PropTypes.object,
};

class SalesChannelsPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      salesChannels: props.salesChannels,
      search: '',
    };
    autoBind(this);
  }
  // TODO: review this, why duplication on each Container - gabo
  getChildContext() {
    return {
      muiTheme: getMuiTheme(baseTheme),
    };
  }
  componentWillMount() {
    // TODO : review authentication and security
    if (!this.props.isAuthenticated) {
      // this.props.dispatch(clearAuthErrors());
    //  browserHistory.goBack();
    }
    const selectLimit = { limit: 1000 };
    const query = this.props.query;
    const router = this.props.router;
    if (!query.page) {
      query.page = 1;
      router.push({ pathname: '/saleschannels', query });
    } else {
      this.props.dispatch(fetchCatalogs(selectLimit));
      this.props.dispatch(fetchPriceLists(selectLimit));
      this.props.dispatch(fetchSalesChannels(this.props.query));
    }
  }
  onSalesChannelDisable(data) {
    const pData = _.omit(data, ['catalogName', 'priceListName']);
    this.props.dispatch(disableSalesChannel(pData));
  }
  handleSearchChange(e) {
    const query = this.props.query;
    const router = this.props.router;
    const nextSalesChannelInput = e.target.value;
    const nextSalesChannel = (nextSalesChannelInput !== '') ? nextSalesChannelInput : '';
    this.setState({
      search: nextSalesChannel,
    });
    if (nextSalesChannel.length > 0) {
      query.search = nextSalesChannel;
    } else {
      delete query.search;
    }
    query.page = 1;
    router.push({ pathname: '/saleschannels', query });
    this.props.dispatch(fetchSalesChannels(this.props.query));
  }
  navigation(route) {
    this.props.dispatch(fetchSalesChannels(route));
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
      <div className="sales-channels component" style={authPage}>
        <h2>Sales Channels</h2>
        <div className="content">
          <div className="action-buttons">
            <Link to="/saleschannels/new">
              <RaisedButton
                label="Add new"
                primary
              />
            </Link>
          </div>
          <TextField
            floatingLabelText="Name/Display Name"
            floatingLabelStyle={styles.floatingLabelStyle}
            inputStyle={styles.inputStyle}
            value={this.state.search}
            onChange={this.handleSearchChange}
          />
          <hr />
          <ShowSalesChannels
            salesChannelsList={this.props.salesChannels}
            onSalesChannelDisable={data => this.onSalesChannelDisable(data)}
          />
        </div>
        <div className="action-buttons bottom">
          <Pagination
            paginationInfo={this.props.salesChannels.meta}
            pageCall={route => this.navigation(route)}
          />
        </div>
      </div>
      );
  }
}

SalesChannelsPage.childContextTypes = {
  muiTheme: PropTypes.object.isRequired,
};

SalesChannelsPage.propTypes = propTypes;

function mapStateToProps(state, ownProps) {
  return {
    isAuthenticated: state.auth.isAuthenticated,
    salesChannels: state.salesChannels,
    query: ownProps.location.query,
  };
}

export default withRouter(connect(mapStateToProps)(SalesChannelsPage));
