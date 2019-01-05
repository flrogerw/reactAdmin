import React, { Component, PropTypes } from 'react';
import { withRouter, browserHistory } from 'react-router';
import { connect } from 'react-redux';
import autoBind from 'react-autobind';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import { setCatalog, clearCatalogsErrors } from '../actions';
import { cyan900 } from 'material-ui/styles/colors';
import Alert from '../components/home/Alert';

// import '../assets/stylesheets/catalogs.scss';

const propTypes = {
  dispatch: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
  catalog: PropTypes.object,
  error: PropTypes.any,
};

class CatalogNewPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      auth: !props.isAuthenticated,
      alertOpen: false,
      alertMessage: '',
      error: false,
      catalog: {
        name: '',
        description: '',
      },
    };
    autoBind(this);
  }
  getChildContext() {
    return { muiTheme: getMuiTheme(baseTheme) };
  }
  componentWillMount() {
    if (!this.props.isAuthenticated) {
      browserHistory.goBack();
    }
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.error) {
      this.setState({
        alertOpen: true,
        error: true,
        alertMessage: `${nextProps.error.statusCode} ${nextProps.error.error} ${nextProps.error.message}`,
      });
    }
    if (nextProps.catalog && !nextProps.error) {
      this.setState({
        alertOpen: true,
        error: false,
        alertMessage: 'Catalog saved successfully!',
      });
    }
  }
  handleChange(e) {
    const nextState = this.state.catalog;
    nextState[e.target.name] = e.target.value;
    this.setState({
      catalog: nextState,
    });
  }
  handleSubmit() {
    this.props.dispatch(clearCatalogsErrors());
    this.props.dispatch(setCatalog(this.state.catalog));
  }
  alertHandleClose() {
    this.setState({
      alertMessage: '',
      alertOpen: false,
    });
    if (!this.state.error) {
      browserHistory.push(`/catalogs/${this.props.catalog.id}?page=1`);
      browserHistory.push('/catalogs');
    }
  }
  render() {
    const authPage = {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    };
    const styles = {
      floatingLabelStyle: {
        color: cyan900,
      },
      inputStyle: {
        marginRight: '1%',
      },
    };
    return (
      <div className="catalogs component" style={authPage}>
        <h2>New Catalog</h2>
        <Alert
          alertOpen={this.state.alertOpen}
          alertHandleClose={() => this.alertHandleClose()}
          alertMessage={this.state.alertMessage}
        />
        <div className="content">
          <TextField
            floatingLabelText="Name"
            floatingLabelStyle={styles.floatingLabelStyle}
            name="name"
            onChange={this.handleChange}
          />
          <TextField
            floatingLabelText="Description"
            floatingLabelStyle={styles.floatingLabelStyle}
            name="description"
            onChange={this.handleChange}
          />
          <div className="actions">
            <RaisedButton
              label="Save"
              primary
              onClick={this.handleSubmit}
            />
          </div>
        </div>
      </div>
    );
  }
}

CatalogNewPage.childContextTypes = {
  muiTheme: PropTypes.object.isRequired,
};

CatalogNewPage.propTypes = propTypes;

function mapStateToProps(state) {
  return {
    isAuthenticated: state.auth.isAuthenticated,
    catalog: state.catalogs.catalog,
    error: state.catalogs.error,
  };
}

export default withRouter(connect(mapStateToProps)(CatalogNewPage));
