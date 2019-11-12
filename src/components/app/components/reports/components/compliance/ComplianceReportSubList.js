import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Collapse from '@material-ui/core/Collapse';
import Paper from '@material-ui/core/Paper';
import { fetchServiceIconPath } from 'utils/serviceIcon'
import { cloneDeep } from "lodash"
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router-dom'
import { store } from 'client'
import { connect } from "react-redux"
import { bindActionCreators } from 'redux'



class ComplianceReportSubList extends PureComponent {
    _mounted = false
    state = { 
        collapseFailed: [],
        collapseRemediation: [],
        collapsePassed: []
    };

    componentDidMount() {
        this._mounted = true
        let collapseList = []
        this.props.control.rules.forEach(function(rule, index){
            collapseList.push(true)
        })
        this.setState({collapseFailed: collapseList, collapseRemediation: collapseList, collapsePassed: collapseList})
    }

    setCollapse = (section, index) => {
        let selectedList = []
        switch (section) {
            case 'failed':
                selectedList = cloneDeep(this.state.collapseFailed)
                selectedList[index] = !selectedList[index]
                this.setState({collapseFailed: selectedList})
              break;
            case 'remediation':
                selectedList = cloneDeep(this.state.collapseRemediation)
                selectedList[index] = !selectedList[index]
                this.setState({collapseRemediation: selectedList})
              break;
            case 'passed':
                selectedList = cloneDeep(this.state.collapsePassed)
                selectedList[index] = !selectedList[index]
                this.setState({collapsePassed: selectedList})
              break;
          }
    }

    render() {
        const {collapseFailed, collapseRemediation, collapsePassed}=this.state
        const {compliance_name, control}=this.props
        return (
            <div className="table-box table-responsive">
            <Table className="table-report">
                <TableHead>
                    <TableRow>
                        <TableCell component="th">Control ID</TableCell>
                        <TableCell component="th">{compliance_name} Controls </TableCell>
                        <TableCell component="th">Failed / Total Rules</TableCell>
                        <TableCell component="th">Failed / Total Assets</TableCell>
                        {/* <TableCell component="th">07/23/19</TableCell>
                        <TableCell component="th">Projection</TableCell> */}
                    </TableRow>
                </TableHead>
                <TableBody>
                    <TableRow>
                        <TableCell>{control.identifier}</TableCell>
                        <TableCell>{control.description}</TableCell>
                        <TableCell>
                            <span> <span className="text-danger">{control.rule_failed_count}</span> / {control.rule_passed_count + control.rule_failed_count}</span>
                        </TableCell>
                        <TableCell>
                            <span> <span className="text-danger">{control.asset_failed_count}</span> / {control.asset_total_count}</span>
                        </TableCell>
                        {/* <TableCell>
                            <span className="chip chip-success">{control.on_date_status} <i className="fa fa-arrow-down" aria-hidden="true"></i></span>
                        </TableCell>
                        <TableCell>
                            <span className="chip chip-success">{control.projection} <i className="fa fa-arrow-down" aria-hidden="true"></i></span>
                        </TableCell> */}
                    </TableRow>
                    <TableRow>
                        <TableCell colSpan="6">
                            <Table className="table-report mrB20">
                            {control.rules.map((rule, index) => (<div key={rule.name}>
                                <TableHead>
                                    <TableRow style={{ backgroundColor: "#E1E6EE" }}>
                                        <TableCell component="th">Rule ID</TableCell>
                                        <TableCell component="th">Rule Name </TableCell>
                                        <TableCell component="th">Status</TableCell>
                                        <TableCell component="th">Failed / Total Assets</TableCell>
                                        {/* <TableCell component="th">07/23/19</TableCell>
                                        <TableCell component="th">Projection</TableCell> */}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <TableRow>
                                        <TableCell>{rule.name}</TableCell>
                                        <TableCell>{rule.description}</TableCell>
                                        <TableCell>
                                            {(rule.assets.failed.length > 0 || rule.assets.in_remediation.length > 0) ? <span className="text-danger">FAIL</span> : <span className="text-success">PASSED</span>}
                                        </TableCell>
                                        <TableCell>
                                            <span> <span className="text-danger">{rule.assets.failed.length + rule.assets.in_remediation.length}</span> / {rule.assets.passed.length + rule.assets.failed.length + rule.assets.in_remediation.length}</span>
                                        </TableCell>
                                        {/* <TableCell>
                                            <span className="chip chip-success">{rule.on_date_status} <i className="fa fa-arrow-down" aria-hidden="true"></i></span>
                                        </TableCell>
                                        <TableCell>
                                            <span className="chip chip-success">{rule.projection} <i className="fa fa-arrow-down" aria-hidden="true"></i></span>
                                        </TableCell> */}
                                    </TableRow>
                                    <TableRow>
                                        <TableCell colSpan="6">
                                            <Table className="table-report table-sub mrB20">
                                                <TableHead>
                                                    <TableRow style={{ backgroundColor: "#f7f7f7" }}>
                                                        <TableCell colSpan="2" component="th">
                                                            <div className="d-flex align-item-center text-danger fnt-14">
                                                                <span>FAILED</span>
                                                                <span className="flexGrow1 control-info control-info-danger"></span>
                                                                <span className="fnt-24" onClick={() => this.setCollapse('failed', index)}><i className={collapseFailed[index] ? "fa fa-caret-down" : "fa fa-caret-up"} aria-hidden="true"></i></span>
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                    <Collapse in={collapseFailed[index]} timeout="auto" unmountOnExit>
                                                        <TableRow style={{ backgroundColor: "#f7f7f7" }}>
                                                            <TableCell component="th">Type</TableCell>
                                                            <TableCell component="th">Name </TableCell>
                                                        </TableRow>
                                                    </Collapse>
                                                </TableHead>
                                                <Collapse in={collapseFailed[index]} timeout="auto" unmountOnExit>
                                                    <TableBody>
                                                        {rule.assets.failed.map(function(failAsset){ return <TableRow>
                                                            <TableCell><img src={fetchServiceIconPath(failAsset.type.split('_')[0])}  height="20px" width="20px"/> {failAsset.type.replace(/_/g, ' ')}</TableCell>
                                                            <TableCell>{failAsset.discriminator[Object.keys(failAsset.discriminator)[0]] !== null ? failAsset.discriminator[Object.keys(failAsset.discriminator)[0]].toString() : ''}</TableCell>
                                                        </TableRow>})}
                                                    </TableBody>
                                                </Collapse>
                                            </Table>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell colSpan="6">
                                            <Table className="table-report table-sub mrB20">
                                                <TableHead>
                                                    <TableRow style={{ backgroundColor: "#f7f7f7" }}>
                                                        <TableCell colSpan="2" component="th">
                                                            <div className="d-flex align-item-center text-primary fnt-14">
                                                                <span className="control-title">IN REMEDIATION</span>
                                                                <span className="flexGrow1 control-info control-info-primary"></span>
                                                                <span className="fnt-24" onClick={() => this.setCollapse('remediation', index)}><i className={collapseRemediation[index] ? "fa fa-caret-down" : "fa fa-caret-up"} aria-hidden="true"></i></span>
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                    <Collapse in={collapseRemediation[index]} timeout="auto" unmountOnExit>
                                                        <TableRow style={{ backgroundColor: "#f7f7f7" }}>
                                                            <TableCell component="th">Type</TableCell>
                                                            <TableCell component="th">Name </TableCell>
                                                        </TableRow>
                                                    </Collapse>
                                                </TableHead>
                                                <Collapse in={collapseRemediation[index]} timeout="auto" unmountOnExit>
                                                    <TableBody>
                                                        {rule.assets.in_remediation.map(function(remediationAsset){return <TableRow>
                                                            <TableCell><img src={fetchServiceIconPath(remediationAsset.type.split('_')[0])}  height="20px" width="20px"/> {remediationAsset.type.replace(/_/g, ' ')}</TableCell>
                                                            <TableCell>{remediationAsset.discriminator[Object.keys(remediationAsset.discriminator)[0]] !== null ? remediationAsset.discriminator[Object.keys(remediationAsset.discriminator)[0]].toString() : ''}</TableCell>
                                                        </TableRow>})}
                                                    </TableBody>
                                                </Collapse>
                                            </Table>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell colSpan="6">
                                            <Table className="table-report table-sub mrB20">
                                                <TableHead>
                                                    <TableRow style={{ backgroundColor: "#f7f7f7" }}>
                                                        <TableCell colSpan="2" component="th">
                                                            <div className="d-flex align-item-center text-success fnt-14">
                                                                <span>PASSED</span>
                                                                <span className="flexGrow1 control-info control-info-success"></span>
                                                                <span className="fnt-24" onClick={() => this.setCollapse('passed', index)}><i className={collapsePassed[index] ? "fa fa-caret-down" : "fa fa-caret-up"} aria-hidden="true"></i></span>
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                    <Collapse in={collapsePassed[index]} timeout="auto" unmountOnExit>
                                                        <TableRow style={{ backgroundColor: "#f7f7f7" }}>
                                                            <TableCell component="th">Type</TableCell>
                                                            <TableCell component="th">Name </TableCell>
                                                        </TableRow>
                                                    </Collapse>
                                                </TableHead>
                                                <Collapse in={collapsePassed[index]} timeout="auto" unmountOnExit>
                                                    <TableBody>
                                                        {rule.assets.passed.map(function(passedAsset){return <TableRow>
                                                            <TableCell><img src={fetchServiceIconPath(passedAsset.type.split('_')[0])}  height="20px" width="20px"/> {passedAsset.type.replace(/_/g, ' ')}</TableCell>
                                                            <TableCell>{passedAsset.discriminator[Object.keys(passedAsset.discriminator)[0]] !== null ? passedAsset.discriminator[Object.keys(passedAsset.discriminator)[0]].toString() : ''}</TableCell>
                                                        </TableRow>})}
                                                    </TableBody>
                                                </Collapse>
                                            </Table>
                                        </TableCell>
                                    </TableRow>
                                </TableBody></div>))}
                            </Table>
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
            </div>
        )
    }
}

export default ComplianceReportSubList