import React, { PureComponent } from 'react';
import Grid from '@material-ui/core/Grid'
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';

import AlertList from './AlertList';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import LabelWithHelper from 'hoc/Label/LabelWithHelper'
import * as alertsActions from 'actions/alertsAction';
import { setProgressBar } from 'actions/commonAction';
import { showMessage } from 'actions/messageAction';
import * as remediationActions from 'actions/remediationAction';
import { store } from 'client';
import { cloneDeep } from "lodash"

class PriorityFilter extends PureComponent {

    state = {
        openDrawer: false,
        alert_id:'',
        rule_id: null,
        asset_type: null,
        filterProgress: true,
        loaded: false,
        loading: false,
        dataList: []
    }

    componentDidMount() {
        this._mounted = true

        const filterData = this.props.filterData
        if (filterData.selectAccount.id !== 'all' && filterData.selectAccount.id !== undefined) {
            this._mounted = false
            this.fetchAlerts(filterData)
        } else {
            this.setState({ filterProgress: false, loaded: true })
        }
        // this.setState({ dataList: this.getRows(20) });
        this.unsubscribe = store.subscribe(this.receiveFilterData)
    }

    componentWillUnmount() {
        this._mounted = false
    }

    receiveFilterData = data => {
        const currentState = store.getState()
        const previousValue = this.currentValue
        this.currentValue = currentState.uiReducer.filterData
    
        if (
          this.currentValue &&
          previousValue !== this.currentValue
        ) {
          const filterData = cloneDeep(currentState.uiReducer.filterData)
          if (filterData.selectAccount.id !== 'all' && this._mounted) {
            this.fetchAlerts(filterData)
          }
        }
    }

    fetchAlerts(filterData) {
        let ruleList = {}
        let RuleTopList = []
        let payload = { accountId: filterData.selectAccount.id, sort_by: 'priority', sort_order: 'DESC', status: 'OPEN', limit: 100 }
        this.props.actions.fetchAlerts(payload).
            then(result => {
                this._mounted = true
                if (result && typeof result !== 'string') {
                    result.forEach(element => {
                        if (ruleList[element.rule.id] !== undefined) {
                            ruleList[element.rule.id].push(element)
                        } else {
                            ruleList[element.rule.id] = [element]
                        }
                    });
                    let topList = []
                    Object.keys(ruleList).forEach(element => {
                        const elementLength = ruleList[element].length
                        if (topList.length > 0) {
                            let altTopList = []
                            let added = false
                            topList.forEach(item => {
                                if (elementLength > item.value && !added) {
                                    altTopList.push({id: element, value: elementLength})
                                    altTopList.push({id: item.id, value: item.value})
                                    added = true
                                } else {
                                    altTopList.push({id: item.id, value: item.value})
                                }
                            })

                            if (altTopList.length > 5) {
                                altTopList.pop()
                            } else if (altTopList.length < 5) {
                                altTopList.push({id: element, value: elementLength})
                            }
                            topList = altTopList
                        } else {
                            topList.push({id: element, value: elementLength})
                        }
                    })
                    topList.forEach(item => {
                        RuleTopList.push({ 
                            rule_id: item.id,
                            asset_type: ruleList[item.id][0].rule.asset_type_id,
                            description: ruleList[item.id][0].rule.description, 
                            failed_count: ruleList[item.id].length, 
                            impact_on_risk_score: 0
                        })
                    })
                    this.setState({dataList: RuleTopList, filterProgress: false, loaded:true})
                    
                } else {
                    console.log(' Error in fetching alerts :- ', result);
                    this.setState({ loading: false, filterProgress: false, loaded: false })
                }
            });
    }

    /* fetchAlerts(filterData) {
        let newDataList = cloneDeep(this.state.dataList)
        let count = 0
        for (var i = 0; i < newDataList.length; i++) {
            newDataList[i].failed_count = 0
            let payload = { accountId: filterData.selectAccount.id, sort_by: 'priority', sort_order: 'ASC'}
            payload['rule_id'] = newDataList[i].rule_id
            payload['asset_type'] = newDataList[i].asset_type
            payload['status'] = 'OPEN'
            this.props.actions.fetchAlerts(payload).
                then(result => {
                    count++
                    if (result && typeof result !== 'string') {
                        if (result.length > 0) {
                            for (var j = 0; j < newDataList.length; j++) {
                                if (newDataList[j].asset_type === result[0].asset.asset_type.id && newDataList[j].rule_id === result[0].rule.id) {
                                    newDataList[j].failed_count = result.length
                                }  
                            }
                        }
                        if (count === 5) {
                            this.setState({ dataList: newDataList, filterProgress: false, loaded:true })
                        }
                    } else {
                        console.log(' Error in fetching alerts :- ', result);
                        this.setState({ loading: false, filterProgress: false, loaded: false })
                    }
                });
        }
    } */

    toggleDrawer = (index) => {
        if (typeof index === 'number') {
            this.setState(prevState => ({
                openDrawer: !prevState.openDrawer,
                rule_id: this.state.dataList[index].rule_id,
                asset_type: this.state.dataList[index].asset_type
            }));
        } else {
            this.setState(prevState => ({
                openDrawer: !prevState.openDrawer
            }));
        }
    };
  
    render() {
        const {  dataList, openDrawer, rule_id, asset_type, filterProgress, loaded } = this.state;
        return (
            <div className="sec-filter">
                <Grid container spacing={24}>
                    <Grid item sm={12}>
                        <LabelWithHelper message={"Investigation"} title={"Investigation Priority Filter"} content={"The investigation pane is pre-populated with alerts that have the largest contribution to your risk score."} />
                    </Grid>
                </Grid>
                <Grid container spacing={24}>
                    <Grid item sm={12}>
                        <div className="table-layout">
                            {loaded && <Table className="table-compliance priority-filter-responsive">
                                <TableBody>
                                    <TableRow className="border-bottom">
                                        <TableCell component="th" className="fixed_headers header_75">
                                            <div className="d-flex align-item-center">Rule Violation
                                            </div>
                                        </TableCell>
                                        <TableCell component="th" className="fixed_headers text-center">
                                            Alerts
                                         </TableCell>
                                    </TableRow>
                                    {dataList.map((rule, index) => {
                                        return < TableRow key={rule.description}>
                                            <TableCell><span className="link-hrf" onClick={() => this.toggleDrawer(index)} >{rule.description}</span></TableCell>
                                            <TableCell className="text-center">
                                                <span className="text-danger">{rule.failed_count}</span>
                                            </TableCell>
                                        </TableRow>
                                    })
                                    }
                                </TableBody>
                            </Table>}
                        </div>
                    </Grid>
                </Grid>
                <SwipeableDrawer onOpen={this.toggleDrawer} onClose={this.toggleDrawer} className="right-sidebar" anchor="bottom" open={openDrawer}>
                    <AlertList rule_id={rule_id} asset_type={asset_type} toggleDrawer={this.toggleDrawer}/>
                </SwipeableDrawer>
            </div>
        );
    }

}

const mapDispatchToProps = (dispatch) => {
    return {
      actions: bindActionCreators(Object.assign({}, alertsActions, remediationActions), dispatch),
      showMessage: message => {
        dispatch(showMessage(message))
      }, setProgressBar: isProgress => {
        dispatch(setProgressBar(isProgress))
      }
    };
  }
  
  const mapStateToProps = (state, ownProps) => ({
    filterData: state.uiReducer.filterData,
    serviceList: state.commonReducer.serviceList,
  })
  
  export default withRouter((connect(mapStateToProps, mapDispatchToProps)(PriorityFilter)));