import React, { PureComponent } from "react"
import { Link } from 'react-router-dom'
import WithDrawer from 'TableHelper/with-drawer'

import Loader from 'global/Loader';
import { LinearProgress } from '@material-ui/core';

import { Column, InfiniteLoader, SortDirection, Table } from "react-virtualized";
import AutoSizer from "react-virtualized/dist/commonjs/AutoSizer";
import { sNoCellRenderer, dateCellRenderer, headerRenderer } from 'TableHelper/cellRenderer';

import { withRouter } from 'react-router-dom'
import { connect } from "react-redux"
import { bindActionCreators } from 'redux'

import RemediationSubTableList from "./RemediationSubTableList"

import * as remediationActions from 'actions/remediationAction'
import { showMessage } from 'actions/messageAction'
import { setProgressBar } from 'actions/commonAction'
import * as alertsActions from 'actions/alertsAction';

class RuleViolationList extends PureComponent {

    _mounted = false

    state = {
        // Table attribute
        headerHeight: 40,
        rowHeight: 25,
        rowCount: 0,
        height: 450,
        sortBy: "service",
        sortDirection: SortDirection.ASC,

        dataList: [],
        rowIndex: 0,
        loading: true,
        isMoreRecord: false
    };


    componentDidMount() {
        this._mounted = true

        const filterData = this.props.filterData
        if (filterData.selectAccount.id !== 'all' && filterData.selectAccount.id !== undefined) {
            this.fetchAlerts(filterData)
        } else {
            this.setState({ filterProgress: false })
        }
      }


    fetchAlerts(filterData) {
        let alerts = []
          const rule_id = this.props.rule
          this.props.plan.alerts.forEach(function(alert){
            if (alert.rule.id === rule_id) {
                alerts.push(alert)
            }
          })
          this.setState({ dataList: alerts })
      }

  
    //   --------------------Table helper method Start-----------------------

    _isRowLoaded = ({ index }) => {
        return !!this.state.dataList[index];
    }

    _loadMoreRows = ({ startIndex, stopIndex }) => {
        if (this.state.isMoreRecord) {
            console.log(" load more ....", startIndex, stopIndex);
            let pageNo = Math.floor((startIndex) / this.state.perPage)
            if ((pageNo + this.state.perPage) !== this.state.pageNo) {
                this.setState({ pageNo: this.state.pageNo + this.state.perPage, filterProgress: true }, () => {
                    const filterData = this.props.filterData
                    this.fetchAlerts(filterData)
                });
            }
        }
    }


    sort = ({ sortBy, sortDirection }) => {
    }

    noRowsRenderer = () => {
        if (!this.state.loading) {
            return (<div className="data-not-found">Name
                <span>Records Not Found</span>
            </div>)
        }
        else if (this.state.loading) {
            return <Loader />
        }
    }


    toggleActiveClass = (toggleRowIndex) => {
        if (this.state.toggleRowIndex !== toggleRowIndex) {
            this.setState({ toggleRowIndex })
        } else {
            this.setState({ toggleRowIndex: -1 })
        }
    }

    ruleRenderer = (index, planId) => {
        return (
        <RemediationSubTableList/>
        );
    }

    nameCellRenderer = ({ rowData }) => {
        const name = rowData.asset.data[rowData.asset.asset_type.discriminator[0]] ? rowData.asset.data[rowData.asset.asset_type.discriminator[0]] : ''
        return (
          <div>
            {name}
          </div>
        )
      }

    regionCellRenderer = ({ rowData }) => {
        const region = rowData.asset.data.region ? rowData.asset.data.region : ''
        return (
          <div>
            {region.toUpperCase()}
          </div>
        )
      }

    _rowGetter = ({ index }) => {
        return this.state.dataList[index];
    }

    //   --------------------Table helper method End-----------------------

    render() {
        const {
            dataList,
            toggleRowIndex,
        } = this.state;

        return dataList.length
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators(Object.assign({}, remediationActions, alertsActions), dispatch),
        showMessage: message => {
            dispatch(showMessage(message))
        }, setProgressBar: isProgress => {
            dispatch(setProgressBar(isProgress))
        }
    };
}

const mapStateToProps = (state, ownProps) => ({
    filterData: state.uiReducer.filterData,
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(RuleViolationList))