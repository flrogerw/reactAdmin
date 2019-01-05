import React, { Component, PropTypes } from 'react';
import autoBind from 'react-autobind';
import { connect } from 'react-redux';
import { browserHistory, withRouter } from 'react-router';
const queryString = require('query-string');
const _ = require('lodash');

const propTypes = {
  paginationInfo: PropTypes.object.isRequired,
  pageCall: PropTypes.func.isRequired,
  router: PropTypes.object,
  pageName: PropTypes.string,
};

class Pagination extends Component {
  constructor() {
    super();
    this.state = {
      pageNumber: 1,
    };
    autoBind(this);
  }
  componentWillReceiveProps(nextProps) {
    const pageCount = _.get(nextProps, 'paginationInfo.pageCount');
    const page = _.get(nextProps, 'paginationInfo.page');

    this.setState({
      pageNumber: nextProps.paginationInfo.page,
    });
    this.refs.inputPage.value = page;

    // redirect to previous state if page number is out of range
    if (pageCount && !_.inRange(page, 1, pageCount + 1)) {
      // TODO: improve this, use case entering with wrong page in params ( first time ) - gabo
      browserHistory.goBack();
      return;
    }
  }

  validateInputNumber(value) {
    let val = value;
    if (/^[0-9]*$/.test(val)) {
      if (val > this.props.paginationInfo.pageCount) {
        val = this.props.paginationInfo.pageCount;
      }
      return val;
    } else if (val === '') {
      val = 1;
    }
    return 1;
  }

  handleGoToPage(route) {
    const query = queryString.parse(route.substring(route.indexOf('?')));
    const pathname = this.props.pageName || route.substring(route.indexOf('local/') + 5, route.indexOf('?'));
    delete query.limit;
    const params = { pathname, query };
    this.props.router.push(params);
    this.props.pageCall(route);
  }

  handleInputChange(event) {
    const value = this.validateInputNumber(event.target.value);
    if (value) {
      if (value > 0 && value <= this.props.paginationInfo.pageCount) {
        this.setState({
          pageNumber: value,
        });
        const host = this.props.paginationInfo.self.split(/\?/)[0];
        this.handleGoToPage(`${host}?page=${value}`);
      }
    } else {
      this.refs.inputPage.value = value;
    }
  }

  render() {
    return (
      <div>
        <ul className="pagination">
          <li>
            <a
              onClick={(event) => {
                event.preventDefault();
                this.handleGoToPage(this.props.paginationInfo.first);
              }}
            >
              First
            </a>
          </li>
          <li>
            <a
              onClick={(event) => {
                event.preventDefault();
                const previous = this.props.paginationInfo.previous;
                if (previous) {
                  this.handleGoToPage(previous);
                }
              }}
            >
              <i className="fa fa-angle-left" aria-hidden="true"></i>
            </a>
          </li>
          <li className="pageInput">
            <input
              defaultValue={this.state.pageNumber}
              onChange={this.handleInputChange}
              ref="inputPage"
            />
            of {this.props.paginationInfo.pageCount}
          </li>
          <li>
            <a
              onClick={(event) => {
                event.preventDefault();
                const next = this.props.paginationInfo.next;
                if (next) {
                  this.handleGoToPage(next);
                }
              }}
            >
              <i className="fa fa-angle-right" aria-hidden="true"></i>
            </a>
          </li>
          <li>
            <a
              onClick={(event) => {
                event.preventDefault();
                this.handleGoToPage(this.props.paginationInfo.last);
              }}
            >
              Last
            </a>
          </li>
        </ul>
      </div>
    );
  }
}

Pagination.propTypes = propTypes;

export default withRouter(connect()(Pagination));
