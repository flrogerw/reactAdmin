import React, { Component, PropTypes } from 'react';
import { browserHistory, withRouter } from 'react-router';
import { connect } from 'react-redux';
import { fetchProduct, editProduct, clearProductsErrors } from '../actions/';
import autoBind from 'react-autobind';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import EditProduct from '../components/products/EditProduct';
import Alert from '../components/home/Alert';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';
import _ from 'lodash';
import TextField from 'material-ui/TextField';
import { cyan900 } from 'material-ui/styles/colors';
import RaisedButton from 'material-ui/RaisedButton';
import DialogModal from '../components/home/DialogModal';
import FontIcon from 'material-ui/FontIcon';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

const propTypes = {
  dispatch: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
  product: PropTypes.object,
  productId: PropTypes.string.isRequired,
  error: PropTypes.any,
};

class ProductEditPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      auth: !props.isAuthenticated,
      alertOpen: false,
      alertMessage: '',
      edited: false,
      newOptionGroup: { name: '', description: '' },
      openDeleteConfirmation: false,
      optionGroupToDelete: false,
      productOptionItems: [],
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
    this.props.dispatch(fetchProduct(this.props.productId));
  }
  componentWillReceiveProps(nextProps) {
    const product = nextProps.product;
    const nullOption = { name: '', groupName: '' };
    const productOptionItems = [];
    const addItem = (item) => {
      const option = _.find(product.optionItems, { itemId: item.id }) || nullOption;
      const optionItem = {
        name: option.name,
        groupName: option.groupName,
        itemId: item.id,
        itemName: item.name,
        itemSku: item.sku,
      };
      productOptionItems.push(optionItem);
    };

    if (product && product.items) {
      _.each(product.items, addItem);
    }

    const nextState = { productOptionItems };

    if (nextProps.error) {
      _.merge(nextState, {
        alertOpen: true,
        edited: false,
        alertMessage: `${nextProps.error.statusCode} ${nextProps.error.error} ${nextProps.error.message}`,
      });
    }
    if (nextProps.product && !nextProps.error && this.state.edited) {
      _.merge(nextState, {
        alertOpen: true,
        alertMessage: 'Product edited succesfully!',
      });
    }

    this.setState(nextState);
  }
  onChangeNewOptionGroup(e) {
    const nextState = this.state.newOptionGroup;
    nextState.position = this.props.product.optionGroups.length;
    nextState[e.target.name] = e.target.value;
    this.setState({
      newOptionGroup: nextState,
    });
  }
  openDeleteConfirmation(type, key) {
    if (type === 'optionGroup') {
      this.setState({
        openDeleteConfirmation: true,
        optionGroupToDelete: key,
      });
    }
  }
  handleCloseDeleteConfirmation() {
    this.setState({
      openDeleteConfirmation: false,
      optionGroupToDelete: '',
    });
  }
  handleDelete() {
    const product = this.props.product;
    product.optionGroups = _.pullAllBy(product.optionGroups, [{ name: this.state.optionGroupToDelete }], 'name');
    this.props.dispatch(editProduct(product));
    this.handleCloseDeleteConfirmation();
  }
  handleProductOptionItemChange(pOptionItem, propName, value) {
    const optionItem = _.clone(pOptionItem);
    optionItem[propName] = value;
    const nextState = _.clone(this.state);
    const index = _.indexOf(nextState.productOptionItems, _.find(nextState.productOptionItems, { itemId: optionItem.itemId }));
    nextState.productOptionItems.splice(index, 1, optionItem); // Replace item at index using native splice
    this.setState(nextState);
  }
  handleSaveProductOptions() {
    const product = _.clone(this.props.product);
    const productOptionItems = this.state.productOptionItems;
    const pickOptionItemProps = (optionItem) => _.pick(optionItem, ['itemId', 'name', 'groupName']);
    product.optionItems = _.map(productOptionItems, pickOptionItemProps);
    this.saveEditProduct(product);
  }
  handleUpdateOptionGroupPositions(groupName, direction) {
    const product = this.props.product;
    const optionGroups = _.clone(product.optionGroups);
    const group = _.find(optionGroups, { name: groupName });
    const currentPosition = group.position;
    if (currentPosition === 0 && direction === 'up' ||
        currentPosition === optionGroups.length && direction === 'down') {
      return;
    }
    let nextPosition;
    if (direction === 'up') {
      nextPosition = currentPosition - 1;
    } else {
      nextPosition = currentPosition + 1;
    }
    const group2 = _.find(optionGroups, { position: nextPosition });
    group.position = nextPosition;
    group2.position = currentPosition;
    product.optionGroups = optionGroups;
    this.props.dispatch(editProduct(product));
  }
  addNewOptionGroup() {
    const product = this.props.product;
    const newName = _.get(this, 'state.newOptionGroup.name');
    const nameExists = Boolean(_.find(product.optionGroups, { name: newName }));
    if (!newName || nameExists) {
      return;
    }
    product.optionGroups.push(this.state.newOptionGroup);
    this.props.dispatch(editProduct(product));
    this.resetNewOptionGroup();
  }
  resetNewOptionGroup() {
    this.setState({
      newOptionGroup: { name: '', description: '', position: '' },
    });
  }
  saveEditProduct(product) {
    this.setState({
      edited: true,
    });
    this.props.dispatch(editProduct(product));
  }
  alertHandleClose() {
    this.setState({
      alertOpen: false,
      edited: false,
      alertMessage: '',
    });
    this.props.dispatch(clearProductsErrors());
    browserHistory.push('/products');
  }
  renderProductOptionsTableRows() {
    const iconStyles = {
      marginRight: 24,
    };
    const productOptionGroups = _.orderBy(_.get(this, 'props.product.optionGroups'), 'position', 'asc');
    return productOptionGroups.map(item =>
      <TableRow key={item.name}>
        <TableRowColumn>{item.position}</TableRowColumn>
        <TableRowColumn>{item.name}</TableRowColumn>
        <TableRowColumn>{item.description}</TableRowColumn>
        <TableRowColumn>
          <FontIcon
            className="fa fa-caret-up"
            style={iconStyles}
            onClick={() => this.handleUpdateOptionGroupPositions(item.name, 'up')}
          />
          <FontIcon
            className="fa fa-caret-down"
            style={iconStyles}
            onClick={() => this.handleUpdateOptionGroupPositions(item.name, 'down')}
          />
          <FontIcon
            className="fa fa-trash"
            style={iconStyles}
            onClick={() => this.openDeleteConfirmation('optionGroup', item.name)}
          />
        </TableRowColumn>
      </TableRow>
    );
  }
  renderProductOptionsItemsTableRows() {
    const productOptionItems = this.state.productOptionItems;
    const optionGroups = _.get(this, 'props.product.optionGroups');
    const items = [];
    items.push(<MenuItem value={null} key={-1} primaryText="select" />);
    const addSelectItem = (group) => {
      items.push(<MenuItem value={group.name} key={group.name} primaryText={group.name} />);
    };
    _.each(optionGroups, addSelectItem);

    if (!productOptionItems) { return ''; }
    const styles = {
      floatingLabelStyle: {
        color: cyan900,
      },
      inputStyle: {
        marginRight: '1%',
      },
    };
    return productOptionItems.map(optionItem =>
      <TableRow key={optionItem.itemId}>
        <TableRowColumn key={`${optionItem.itemId}_id`}>{optionItem.itemId}</TableRowColumn>
        <TableRowColumn key={`${optionItem.itemId}_itemName`}>{optionItem.itemName}</TableRowColumn>
        <TableRowColumn key={`${optionItem.itemId}_sku`}>{optionItem.itemSku}</TableRowColumn>
        <TableRowColumn key={`${optionItem.itemId}_groupName`}>
          <SelectField
            name="groupName"
            value={optionItem.groupName}
            onChange={(event, index, value) => this.handleProductOptionItemChange(optionItem, 'groupName', value)}
            maxHeight={200}
          >
           {items}
          </SelectField>
        </TableRowColumn>
        <TableRowColumn key={`${optionItem.itemId}_name`}>
          <TextField
            onFocus={(e) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()}
            name="optionItemName"
            inputStyle={styles.inputStyle}
            value={optionItem.name}
            onChange={(event) => this.handleProductOptionItemChange(optionItem, 'name', event.target.value)}
          />
        </TableRowColumn>
      </TableRow>
    );
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
    const tableStyles = {
      stripedRows: true,
      displaySelectAll: false,
      adjustForCheckbox: false,
      selectable: false,
      displayRowCheckbox: false,
    };
    const authPage = {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    };
    return (
      <div className="products component" style={authPage}>
        <h2>Product Edit</h2>
        <Alert
          alertOpen={this.state.alertOpen}
          alertHandleClose={() => this.alertHandleClose()}
          alertMessage={this.state.alertMessage}
        />
        <div className="content">
          <EditProduct
            product={this.props.product}
            onSave={data => this.saveEditProduct(data)}
          />
        </div>

        <DialogModal
          dialogOpen={this.state.openDeleteConfirmation}
          dialogHandleClose={this.handleCloseDeleteConfirmation}
          dialogHandleSubmit={this.handleDelete}
          dialogTitle="Delete"
          dialogMessage="Do you really want to delete this?"
          dialogActionTitle="Delete"
        />

        <h2>Product Option Groups </h2>
        <div className="content">
          <p>Create the options that are displayed in the product page ( eg. color, size, .. )</p>
          <br></br>
          <br></br>
          <div></div>
          <Table>
            <TableHeader
              displaySelectAll={tableStyles.displaySelectAll}
              adjustForCheckbox={tableStyles.adjustForCheckbox}
            >
              <TableRow
                selectable={tableStyles.selectable}
              >
                <TableHeaderColumn>Position</TableHeaderColumn>
                <TableHeaderColumn>Name</TableHeaderColumn>
                <TableHeaderColumn>Description</TableHeaderColumn>
                <TableHeaderColumn>Actions</TableHeaderColumn>
              </TableRow>
            </TableHeader>
            <TableBody
              stripedRows={tableStyles.stripedRows}
              displayRowCheckbox={tableStyles.displayRowCheckbox}
            >
              {this.renderProductOptionsTableRows()}
            </TableBody>
          </Table>

          <div>
            <TextField
              floatingLabelText="Name"
              name="name"
              floatingLabelStyle={styles.floatingLabelStyle}
              inputStyle={styles.inputStyle}
              value={this.state.newOptionGroup.name}
              onChange={this.onChangeNewOptionGroup}
            />
            <TextField
              floatingLabelText="Description"
              name="description"
              floatingLabelStyle={styles.floatingLabelStyle}
              inputStyle={styles.inputStyle}
              value={this.state.newOptionGroup.description}
              onChange={this.onChangeNewOptionGroup}
            />
            <RaisedButton
              label="Add"
              primary
              onClick={this.addNewOptionGroup}
            />
          </div>

        </div>

        <h2>Product Options ( Items ) </h2>
        <div className="content">
          <p>Map a product item to the corresponding option and option group</p>
          <br></br>
          <br></br>
          <div></div>
          <Table>
            <TableHeader
              displaySelectAll={tableStyles.displaySelectAll}
              adjustForCheckbox={tableStyles.adjustForCheckbox}
            >
              <TableRow
                selectable={tableStyles.selectable}
              >
                <TableHeaderColumn>Item Id</TableHeaderColumn>
                <TableHeaderColumn>Item Name</TableHeaderColumn>
                <TableHeaderColumn>Item SKU</TableHeaderColumn>
                <TableHeaderColumn>Option Group</TableHeaderColumn>
                <TableHeaderColumn>Option Name</TableHeaderColumn>
              </TableRow>
            </TableHeader>
            <TableBody
              stripedRows={tableStyles.stripedRows}
              displayRowCheckbox={tableStyles.displayRowCheckbox}
            >
              {this.renderProductOptionsItemsTableRows()}
            </TableBody>
          </Table>
          <RaisedButton
            label="Save Product Options"
            primary
            onClick={this.handleSaveProductOptions}
          />
        </div>
      </div>
    );
  }
}

ProductEditPage.childContextTypes = {
  muiTheme: PropTypes.object.isRequired,
};

ProductEditPage.propTypes = propTypes;

function mapStateToProps(state, ownProps) {
  const product = state.products.product;
  return {
    isAuthenticated: state.auth.isAuthenticated,
    product,
    productId: ownProps.params.id,
    error: state.products.error,
  };
}

export default withRouter(connect(mapStateToProps)(ProductEditPage));
