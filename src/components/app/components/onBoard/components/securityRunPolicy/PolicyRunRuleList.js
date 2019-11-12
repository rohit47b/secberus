import React, { PureComponent } from "react"
import {
  Table,
  Column,
  InfiniteLoader
} from "react-virtualized"
import AutoSizer from "react-virtualized/dist/commonjs/AutoSizer"

import { withRouter } from 'react-router-dom';

import Switch from '@material-ui/core/Switch'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import WithDrawer from 'TableHelper/with-drawer';

import * as securityPolicyActions from 'actions/securityPolicyAction'
import { showMessage } from 'actions/messageAction'

import { groupBy, keys, pull, filter, findIndex } from "lodash"
import { headerRenderer } from 'TableHelper/cellRenderer'

import { fetchServiceIconPath } from 'utils/serviceIcon'

class PolicyRunRuleList extends PureComponent {

  _mounted = false

  state = {
    headerHeight: 39,
    rowHeight: 25,
    rowCount: 0,
    height: 250,
    count: 10,
    dataList: [],
    active: true,
    loaded: false
  };

  componentDidMount() {
    this._mounted = true
    this.fetchSecurityPolicy(localStorage.getItem('temp_account_id'))
  }

  componentWillUnmount() {
    this._mounted = false
  }

  fetchSecurityPolicy(accountId) {
    let payload = {
      account_id: accountId
    }
    this.props.actions.fetchDefaultSecurityPolicyRule().
      then(result => {
        if (this._mounted) {
          if (result.success) {
            this.setState({ dataList: result.data, loaded: true }, () => {
              this.setEnableList()
            });
          } else {
            this.setState({ dataList: [], loaded: true })
            let message = { message: result, showSnackbarState: true, variant: 'error' }
            this.props.showMessage(message)
          }
        }
      });
  }

  _rowGetter = ({ index }) => {
    return this.state.dataList[index];
  }

  switchCellRenderer = ({rowData, cellData, rowIndex }) => {
    let boxClass = ["switch-green"];
    if (cellData === undefined || cellData === true) {
      boxClass.push('active');
    }
    return (
      <div>
        <Switch className={boxClass.join(' ')} checked={cellData === undefined ? true : cellData} onChange={() => this.statusChange(rowIndex)} />
      </div>
    );
  };

  setEnableList = () => {
    const dataList = groupBy(this.state.dataList, 'category')
    const categoryKeys = keys(dataList)

    let currentDisableServices = []
    categoryKeys.map((category, index) => {
      let rules = []
      let foundResource = filter(this.state.dataList, { 'category': category })
      foundResource.map((resourceItem, index) => {
        rules.push(resourceItem.service)
      })
      currentDisableServices.push({ category: category, rules: rules })
    })
    this.props.updateDisableServices(currentDisableServices)
  }


  statusChange = (rowIndex) => {
    const newDataList = this.state.dataList.map((row, sidx) => {
      if (rowIndex !== sidx) {
        return row;
      } else {
        let currentStatus = row.status === undefined ? true : row.status;
        let currentDisableServices = this.props.disableServices;
        if (!currentStatus) {
          let foundResource = filter(currentDisableServices, { 'category': row.category })
          foundResource[0].rules.push(row.service)
        } else {
          let foundResource = filter(currentDisableServices, { 'category': row.category })
          let newResource = pull(foundResource[0].rules, row.service)
          let rIndex = findIndex(currentDisableServices, { 'category': row.category });
          currentDisableServices.splice(rIndex, 1, { category: row.category, rules: newResource });
        }

        this.props.updateDisableServices(currentDisableServices)
        return { ...row, status: !currentStatus };
      }
    });
    this.setState({ dataList: newDataList, active: !this.state.active });
  }

  _loadMoreRows = ({ startIndex, stopIndex }) => {
    this.setState({ loaded: false })
    this.setState({ loaded: true, dataList: this.fetchSecurityPolicy(localStorage.getItem('temp_account_id')) });
  }


  ruleRenderer = (rules) => {
    return (
      <ul>
        {
          rules.map((rule) => {
            return (<li key={rule}>{rule} </li>)
          })
        }
      </ul>
    );
  }

  _isRowLoaded = ({ index }) => {
    return !!this.state.dataList[index];
  }


  render() {
    const {
      height,
      dataList,
      loaded
    } = this.state;

    const { openRule } = this.props;

    return (
      <div>
        {loaded && openRule && <WithDrawer
          drawerContent={(rowProps) => {
            return (<div className="tbl-list">{this.ruleRenderer(rowProps.rowData.rules)}</div>);
          }}
          rowsDimensions={dataList.map((dataItem) => ({ collapsedHeight: 38, expandedHeight: dataItem.rules.length < 5 ? 150 : (dataItem.rules.length * 25) + 10 }))}
        >
          {({ rowHeight, rowRenderer, toggleDrawer, toggleDrawerWithAnimation, setTableRef }) => (

            <AutoSizer disableHeight>
              {
                ({ width }) => (

                  <Table
                    ref={setTableRef}
                    headerHeight={39}
                    height={320}
                    width={width}
                    rowCount={dataList.length}
                    rowGetter={this._rowGetter}
                    rowHeight={rowHeight}
                    rowRenderer={rowRenderer}
                    className='data-table run-policy-list'
                  >

                    <Column
                      dataKey="category"
                      label="Category"
                      className="table-td"
                      headerRenderer={headerRenderer}
                      disableSort={true}
                      width={230}
                      flexGrow={1}
                      className="col-td"

                    />

                    <Column
                      label="Resource"
                      dataKey="service_name"
                      width={230}
                      headerRenderer={headerRenderer}
                      flexGrow={2}
                      cellRenderer={
                        ({rowData, cellData, rowIndex }) => {
                          return (
                            <div>
                              <a href="javascript:void(0)" onClick={() => toggleDrawerWithAnimation(rowIndex)}>
                                <span className="service-img">
                                  <img alt={rowData.service} src={fetchServiceIconPath(rowData.service)} />
                                </span>
                                <span>{cellData}</span>
                              </a>
                            </div>
                          );
                        }
                      }
                      className="col-td"
                    />
                    {/* <Column
                      dataKey="status"
                      label="Status"
                      headerRenderer={headerRenderer}
                      cellRenderer={this.switchCellRenderer}
                      disableSort={true}
                      width={130}
                      flexGrow={3}
                      className="col-td"
                    /> */}

                  </Table>
                )
              }
            </AutoSizer>
          )}
        </WithDrawer>
        }
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(securityPolicyActions, dispatch),
    showMessage: message => {
      dispatch(showMessage(message))
    }
  };
}

export default withRouter((connect(null, mapDispatchToProps)(PolicyRunRuleList)));