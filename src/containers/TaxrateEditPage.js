import React, { Component, PropTypes } from 'react';
import { browserHistory, withRouter } from 'react-router';
import { connect } from 'react-redux';
import { fetchTaxrate, editTaxrate, clearTaxrateErrors } from '../actions/';
import autoBind from 'react-autobind';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import EditItem from '../components/taxrate/EditTaxrate';
import Alert from '../components/home/Alert';

const propTypes = {
  dispatch: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
  taxrates: PropTypes.object,
  params: PropTypes.object,
  error: PropTypes.any,
};

class TaxrateEditPage extends Component {
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
    this.props.dispatch(fetchTaxrate(this.props.params.zipcode));
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.error) {
      this.setState({
        alertOpen: true,
        edited: false,
        alertMessage: `${nextProps.error.statusCode} ${nextProps.error.error} ${nextProps.error.message}`,
      });
    }
    if (nextProps.taxrate && !nextProps.error && this.state.edited) {
      this.setState({
        alertOpen: true,
        alertMessage: 'Tax rate edited succesfully!',
      });
    }
  }
  saveEditTaxrate(taxrates) {
    this.setState({
      edited: true,
    });
    this.props.dispatch(editTaxrate(taxrates.taxrate));
  }
  alertHandleClose() {
    this.setState({
      alertOpen: false,
      edited: false,
      alertMessage: '',
    });
    this.props.dispatch(clearTaxrateErrors());
    browserHistory.push('/taxrate');
  }
  render() {
    const authPage = {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    };
    return (
      <div className="taxrate component" style={authPage}>
        <h2>Tax Rate Edit</h2>
        <Alert
          alertOpen={this.state.alertOpen}
          alertHandleClose={() => this.alertHandleClose()}
          alertMessage={this.state.alertMessage}
        />
        <div className="content">
          <EditItem
            taxrate={this.props.taxrates.taxrate}
            onSave={data => this.saveEditTaxrate(data)}
          />
        </div>
      </div>
    );
  }
}

TaxrateEditPage.childContextTypes = {
  muiTheme: PropTypes.object.isRequired,
};

TaxrateEditPage.propTypes = propTypes;

function mapStateToProps(state) {
  return {
    isAuthenticated: state.auth.isAuthenticated,
    taxrates: state.taxrates,
    error: state.taxrates.error,
  };
}

export default withRouter(connect(mapStateToProps)(TaxrateEditPage));
