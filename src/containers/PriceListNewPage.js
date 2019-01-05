import React, { Component, PropTypes } from 'react';
import { withRouter, browserHistory } from 'react-router';
import { connect } from 'react-redux';
import autoBind from 'react-autobind';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import { setPriceList, clearPriceListsErrors } from '../actions';
import { cyan900 } from 'material-ui/styles/colors';
import Alert from '../components/home/Alert';

const propTypes = {
  dispatch: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
  priceList: PropTypes.object,
  error: PropTypes.any,
};

class PriceListNewPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      auth: !props.isAuthenticated,
      alertOpen: false,
      alertMessage: '',
      error: false,
      priceList: {
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
    if (nextProps.priceList && !nextProps.error) {
      this.setState({
        alertOpen: true,
        error: false,
        alertMessage: 'PriceList saved successfully!',
      });
    }
  }
  handleChange(e) {
    const nextState = this.state.priceList;
    nextState[e.target.name] = e.target.value;
    this.setState({
      priceList: nextState,
    });
  }
  handleSubmit() {
    this.props.dispatch(clearPriceListsErrors());
    this.props.dispatch(setPriceList(this.state.priceList));
  }
  alertHandleClose() {
    this.setState({
      alertMessage: '',
      alertOpen: false,
    });
    if (!this.state.error) {
      browserHistory.push('/pricelists');
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
      <div className="priceLists component" style={authPage}>
        <h2>New Price List</h2>
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

PriceListNewPage.childContextTypes = {
  muiTheme: PropTypes.object.isRequired,
};

PriceListNewPage.propTypes = propTypes;

function mapStateToProps(state) {
  console.log('==mapStateToProps', state);
  return {
    isAuthenticated: state.auth.isAuthenticated,
    priceList: state.priceLists.priceList,
    error: state.priceLists.error,
  };
}

export default withRouter(connect(mapStateToProps)(PriceListNewPage));
