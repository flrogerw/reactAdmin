import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { browserHistory, Link, withRouter } from 'react-router';
import ShowPriceLists from '../components/pricelists/ShowPriceLists';
import { clearAuthErrors, fetchPriceLists } from '../actions';
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
  priceLists: PropTypes.object.isRequired,
  query: PropTypes.object.isRequired,
  router: PropTypes.object,
};

class PriceListPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      search: '',
    };
    autoBind(this);
  }
  getChildContext() {
    return { muiTheme: getMuiTheme(baseTheme) };
  }
  componentWillMount() {
    // TODO: fix authentication - gabo
    if (!this.props.isAuthenticated) {
      this.props.dispatch(clearAuthErrors());
      browserHistory.goBack();
    }
    const query = this.props.query;
    const router = this.props.router;
    if (!query.page) {
      query.page = 1;
      router.push({ pathname: '/pricelists', query });
    } else {
      this.props.dispatch(fetchPriceLists(this.props.query));
    }
  }
  handleSearchChange(e) {
    const query = this.props.query;
    const router = this.props.router;
    const nextListInput = e.target.value;
    const nextList = (nextListInput !== '') ? nextListInput : '';
    this.setState({
      search: nextList,
    });
    if (nextList.length > 0) {
      query.search = nextList;
    } else {
      delete query.search;
    }
    query.page = 1;
    router.push({ pathname: '/pricelists', query });
    this.props.dispatch(fetchPriceLists(this.props.query));
  }
  navigation(route) {
    this.props.dispatch(fetchPriceLists(route));
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
    const { priceLists } = this.props;
    const authPage = {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    };
    return (
      <div className="pricelists component" style={authPage}>
        <h2>PriceList</h2>
        <div className="content">
          <div className="action-buttons">
            <Link to="/pricelists/new">
              <RaisedButton
                label="Add new"
                primary
              />
            </Link>
          </div>
          <TextField
            floatingLabelText="Name"
            floatingLabelStyle={styles.floatingLabelStyle}
            inputStyle={styles.inputStyle}
            value={this.state.search}
            onChange={this.handleSearchChange}
          />
          <hr />
          <ShowPriceLists
            priceLists={priceLists}
          />
        </div>
        <div className="action-buttons bottom">
          <Pagination
            paginationInfo={priceLists.meta}
            pageCall={route => this.navigation(route)}
          />
        </div>
      </div>
    );
  }
}

PriceListPage.childContextTypes = {
  muiTheme: PropTypes.object.isRequired,
};

PriceListPage.propTypes = propTypes;

function mapStateToProps(state, ownProps) {
  return {
    isAuthenticated: state.auth.isAuthenticated,
    priceLists: state.priceLists,
    query: ownProps.location.query,
  };
}

export default withRouter(connect(mapStateToProps)(PriceListPage));
