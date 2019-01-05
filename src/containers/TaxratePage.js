import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { browserHistory, Link, withRouter } from 'react-router';
import ShowTaxrates from '../components/taxrate/ShowTaxrates';
import { clearAuthErrors, fetchTaxrates, disableTaxrate } from '../actions';
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
  taxrates: PropTypes.object.isRequired,
  query: PropTypes.object.isRequired,
  router: PropTypes.object,
};

class TaxratePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
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
    if (!this.props.isAuthenticated) {
      this.props.dispatch(clearAuthErrors());
      browserHistory.goBack();
    }
    const query = this.props.query;
    const router = this.props.router;
    if (!query.page) {
      query.page = 1;
      router.push({ pathname: '/taxrate', query });
    } else {
      this.props.dispatch(fetchTaxrates(this.props.query));
    }
  }
  onTaxrateDisable(data) {
    this.props.dispatch(disableTaxrate(data));
  }
  handleSearchChange(e) {
    const query = this.props.query;
    const router = this.props.router;
    const nextZipcode = e.target.value;
    this.setState({
      search: nextZipcode,
    });
    if (nextZipcode.length > 0) {
      query.search = nextZipcode;
    } else {
      delete query.search;
    }
    query.page = 1;
    router.push({ pathname: '/taxrate', query });
    this.props.dispatch(fetchTaxrates(query));
  }
  navigation(route) {
    // add search to url
    this.props.dispatch(fetchTaxrates(route));
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
      <div className="taxrate component" style={authPage}>
        <h2>Taxrates</h2>
        <div className="content">
          <div className="action-buttons">
            <Link to="/taxrate/new">
              <RaisedButton
                label="Add new"
                primary
              />
            </Link>
          </div>
          <TextField
            floatingLabelText="Zipcode"
            floatingLabelStyle={styles.floatingLabelStyle}
            inputStyle={styles.inputStyle}
            value={this.state.search}
            onChange={this.handleSearchChange}
          />
          <hr />
          <ShowTaxrates
            taxrates={this.props.taxrates}
            onTaxrateDisable={data => this.onTaxrateDisable(data)}
          />
        </div>
        <div className="action-buttons bottom">
          <Pagination
            paginationInfo={this.props.taxrates.meta}
            pageCall={route => this.navigation(route)}
          />
        </div>
      </div>
      );
  }
}

TaxratePage.childContextTypes = {
  muiTheme: PropTypes.object.isRequired,
};

TaxratePage.propTypes = propTypes;

function mapStateToProps(state, ownProps) {
  return {
    isAuthenticated: state.auth.isAuthenticated,
    taxrates: state.taxrates,
    query: ownProps.location.query,
  };
}

export default withRouter(connect(mapStateToProps)(TaxratePage));
