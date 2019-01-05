import React, { Component, PropTypes } from 'react';
import { withRouter, browserHistory } from 'react-router';
import { connect } from 'react-redux';
import autoBind from 'react-autobind';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import TextField from 'material-ui/TextField';
import Checkbox from 'material-ui/Checkbox';
import RaisedButton from 'material-ui/RaisedButton';
import { setTaxrate, clearTaxrateErrors } from '../actions';
import { cyan900 } from 'material-ui/styles/colors';
import Alert from '../components/home/Alert';
import _ from 'lodash';

const propTypes = {
  dispatch: PropTypes.func,
  isAuthenticated: PropTypes.bool,
  taxrates: PropTypes.object,
  error: PropTypes.any,
};

class TaxrateNewPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      auth: !props.isAuthenticated,
      alertOpen: false,
      alertMessage: '',
      error: false,
      taxrate: {
        name: '',
        zipcode: '',
        tax: 0,
        disabled: false,
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
    if (nextProps.taxrates.taxrate && !nextProps.error) {
      this.setState({
        alertOpen: true,
        error: false,
        alertMessage: 'Tax Rate saved successfully!',
      });
    }
  }
  handleChange(e) {
    const nextState = this.state.taxrate;
    if (e.target.type === 'checkbox') {
      _.set(nextState, e.target.name, e.target.checked);
    } else {
      _.set(nextState, e.target.name, e.target.value);
    }
    this.setState({
      taxrates: nextState,
    });
  }
  handleSubmit() {
    this.props.dispatch(clearTaxrateErrors());
    this.props.dispatch(setTaxrate(this.state.taxrate));
  }
  alertHandleClose() {
    this.setState({
      alertMessage: '',
      alertOpen: false,
    });
    if (!this.state.error) {
      browserHistory.push('/taxrate');
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
      <div className="taxrate component" style={authPage}>
        <h2>New Tax Rate</h2>
        <Alert
          alertOpen={this.state.alertOpen}
          alertHandleClose={() => this.alertHandleClose()}
          alertMessage={this.state.alertMessage}
        />
        <div className="content">
          <div>
            <TextField
              floatingLabelText="Zipcode"
              floatingLabelStyle={styles.floatingLabelStyle}
              value={this.state.taxrate.zipcode}
              name="zipcode"
              onChange={this.handleChange}
            />
            <TextField
              floatingLabelText="Name"
              floatingLabelStyle={styles.floatingLabelStyle}
              value={this.state.taxrate.name}
              name="name"
              onChange={this.handleChange}
            />
            <TextField
              floatingLabelText="Tax"
              floatingLabelStyle={styles.floatingLabelStyle}
              value={this.state.taxrate.tax}
              name="tax"
              onChange={this.handleChange}
            />
            <ul>
              <li>
                <Checkbox
                  label="Disabled"
                  checked={this.state.taxrate.disabled}
                  name="disabled"
                  onCheck={this.handleChange}
                />
              </li>
            </ul>
          </div>
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

TaxrateNewPage.childContextTypes = {
  muiTheme: PropTypes.object.isRequired,
};

TaxrateNewPage.propTypes = propTypes;

function mapStateToProps(state) {
  return {
    isAuthenticated: state.auth.isAuthenticated,
    taxrates: state.taxrates,
    error: state.error,
  };
}

export default withRouter(connect(mapStateToProps)(TaxrateNewPage));
