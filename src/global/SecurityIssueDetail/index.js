/*
 * @Author: Virendra Patidar 
 * @Date: 2018-09-07 12:03:27 
 * @Last Modified by: Virendra Patidar
 * @Last Modified time: 2018-11-26 12:49:54
 */
import React, { PureComponent } from 'react'

import Drawer from '@material-ui/core/Drawer'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import { convertDateFormatWithDateTime } from 'utils/dateFormat'

import * as securityIssueActions from 'actions/securityIssueAction'
import { showMessage } from 'actions/messageAction'
import { setProgressBar } from 'actions/commonAction'

import Loader from 'global/Loader'

class SecurityIssueDetail extends PureComponent {

    state = {
        open: false,
        issueDetails: {}
    }


    componentDidUpdate = (prevProps, prevState) => {
        if (this.props.open !== prevProps.open || this.props.resultId !== prevProps.resultId) {
            if (this.props.open) {
                this.fetchSecurityIssueDetails()
            }
        }
    }

    fetchSecurityIssueDetails = () => {
        this.props.setProgressBar(true);
        let payload = {
            result_id: this.props.resultId
        }
        this.props.actions.fetchSecurityIssueDetails(payload).
            then(result => {
                if (result.success) {
                    this.props.setProgressBar(false);
                    this.setState({ issueDetails: result.data[0], open: true })
                }
                else {
                    this.props.setProgressBar(false);
                    this.setState({ dataList: [] });
                    let message = { message: result, showSnackbarState: true, variant: 'error' }
                    this.props.showMessage(message)
                }
            });
    }

    render() {
        const { issueDetails } = this.state
        const { resultId, open, id, region } = this.props
        return (
            <div> {issueDetails.name && <Drawer className="right-sidebar width-600 security-sidebar" anchor="right" open={open}>
                <div className="sidebar-header">
                    <h4>ID - {id}</h4>
                    <span onClick={this.props.toggleDrawer('right', false)} className="sidebar-close-icon"><i className="fa fa-times-circle" aria-hidden="true"></i> Exit</span>
                </div>
                <div
                    tabIndex={0}
                    role="button"
                    className="sidebar-body"
                >
                    <div className="time-detect">
                        <div className="float-left">
                            <p className="title mrB5">TIME DETECTED</p>
                            <p className="date">{convertDateFormatWithDateTime(issueDetails.time_detected)}</p>
                        </div>
                        <div className="clearfix"></div>
                    </div>
                    <div className="desc">
                        <h4 className="mrB5">DESCRIPTION</h4>
                        <p className="mrT0">
                            {issueDetails.name}
                        </p>
                        <h4 className="mrB5">Affected assets: </h4>

                        {
                            issueDetails.offenders.map((offender, index) => {
                                return (region === issueDetails.offender_attr[offender].Region &&
                                    <div key={offender} className="issue-info">
                                        <span className="issue-title">{issueDetails.offender_attr[offender].Identifier}</span>
                                    </div>
                                )
                            })
                        }
                        <div className="remediation-info mrT25">
                            <h4 className="mrB5">REMEDIATION</h4>
                            {issueDetails.remediation !== null && <div dangerouslySetInnerHTML={{ __html: issueDetails.remediation.replace(/\n/g, '<br />') }} />}
                        </div>
                        <div className="cli-info mrT25">
                            <h4 className="mrB5">REMEDIATION CLI</h4>
                            {/* {issueDetails.remediation_cli} */}
                            {issueDetails.remediation_cli !== null && <div dangerouslySetInnerHTML={{ __html: issueDetails.remediation_cli.replace(/\n/g, '<br />') }} />}
                        </div>
                    </div>
                </div>
            </Drawer>}
            </div>
        )
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators(Object.assign({}, securityIssueActions), dispatch),
        showMessage: message => {
            dispatch(showMessage(message))
        }, setProgressBar: isProgress => {
            dispatch(setProgressBar(isProgress))
        }
    };
}

export default withRouter((connect(null, mapDispatchToProps)(SecurityIssueDetail)));