import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { browserHistory, Link, withRouter } from 'react-router';
import ShowCatalogs from '../components/catalogs/ShowCatalogs';
import { clearAuthErrors, fetchCatalogs, disableCatalog } from '../actions';
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
  catalogs: PropTypes.object.isRequired,
  query: PropTypes.object.isRequired,
  router: PropTypes.object,
};

class CatalogsPage extends Component {
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
      router.push({ pathname: '/catalogs', query });
    } else {
      this.props.dispatch(fetchCatalogs(this.props.query));
    }
  }
  onCatalogDisable(data) {
    this.props.dispatch(disableCatalog(data));
  }
  handleSearchChange(e) {
    const query = this.props.query;
    const router = this.props.router;
    const nextCatalogInput = e.target.value;
    const nextCatalog = (nextCatalogInput !== '') ? nextCatalogInput : '';
    this.setState({
      search: nextCatalog,
    });
    if (nextCatalog.length > 0) {
      query.search = nextCatalog;
    } else {
      delete query.search;
    }
    query.page = 1;
    router.push({ pathname: '/catalogs', query });
    this.props.dispatch(fetchCatalogs(this.props.query));
  }
  navigation(route) {
    this.props.dispatch(fetchCatalogs(route));
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
    const { catalogs } = this.props;
    const authPage = {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    };
    return (
      <div className="catalogs component" style={authPage}>
        <h2>Catalogs</h2>
        <div className="content">
          <div className="action-buttons">
            <Link to="/catalogs/new">
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
          <ShowCatalogs
            catalogsList={catalogs}
            onCatalogDisable={data => this.onCatalogDisable(data)}
          />
        </div>
        <div className="action-buttons bottom">
          <Pagination
            paginationInfo={catalogs.meta}
            pageCall={route => this.navigation(route)}
          />
        </div>
      </div>
    );
  }
}

CatalogsPage.childContextTypes = {
  muiTheme: PropTypes.object.isRequired,
};

CatalogsPage.propTypes = propTypes;

function mapStateToProps(state, ownProps) {
  return {
    isAuthenticated: state.auth.isAuthenticated,
    catalogs: state.catalogs,
    query: ownProps.location.query,
  };
}

export default withRouter(connect(mapStateToProps)(CatalogsPage));
