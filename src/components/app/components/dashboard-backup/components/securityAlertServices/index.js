/*
 * @Author: Virendra Patidar 
 * @Date: 2018-09-19 17:18:03 
 * @Last Modified by: Virendra Patidar
 * @Last Modified time: 2018-12-06 16:38:03
 */
import React, { PureComponent } from 'react'

import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Drawer from '@material-ui/core/Drawer'

import SecurityIssueBreakdownItem from './SecurityIssueBreakdownItem'
import { CardTitle } from 'hoc/Card/CardTitle'

import ErrorBoundary from 'global/ErrorBoundary'
import SecurityIssueTable from 'global/SecurityIssueTable'

import DashboardContext from "context/DashboardContext"
const DashboardContextConsumer = DashboardContext.Consumer

class SecurityAlertServices extends PureComponent {

    state = {
        issueType: '',
        openDrawer: false,
        service: '',
        securityIssue: this.props.securityIssue
    }

    toggleDrawer = (position, openDrawer, issueType, service, securityIssue) => {
        this.setState({ openDrawer, issueType, service, securityIssue: securityIssue ? securityIssue : this.props.securityIssue })
    }

    render() {
        const { data, assets_inventory } = this.props
        const { issueType, openDrawer, service, securityIssue } = this.state

        return (
            <div>
                <Card className="card-wizard mrB20 card-assets" id="container_security_alerts_by_service">
                    <CardTitle text={<span> Security Alerts by Services - <b>{data.length}</b></span>} />
                    <CardContent className="assets-content card-body">
                        <ErrorBoundary error="error-boundary">
                            {data.map((issueBreakdown) => <SecurityIssueBreakdownItem offenders={assets_inventory[issueBreakdown.service] ? assets_inventory[issueBreakdown.service].offenders:0} toggleDrawer={this.toggleDrawer} key={issueBreakdown.service} issueBreakdown={issueBreakdown} />)}
                        </ErrorBoundary>
                    </CardContent>
                    <Drawer className="right-sidebar" anchor="right" open={openDrawer}>
                        <SecurityIssueTable service={[service]} securityIssue={securityIssue} issueType={issueType} toggleDrawer={this.toggleDrawer} />
                    </Drawer>
                </Card>
            </div>
        );
    }
}

export default props => (
    <DashboardContextConsumer>
        {dashboardData => <SecurityAlertServices {...props} securityIssue={dashboardData.securityIssue} data={dashboardData.securityIssueByService.data} count={dashboardData.securityIssueByService.count} assets_inventory={dashboardData.assets_inventory} />}
    </DashboardContextConsumer>
);