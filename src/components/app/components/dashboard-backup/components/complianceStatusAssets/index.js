/*
 * @Author: Virendra Patidar 
 * @Date: 2018-09-19 17:27:40 
 * @Last Modified by: Virendra Patidar
 * @Last Modified time: 2019-01-17 15:08:52
 */
import React, { PureComponent } from 'react'

import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Grid from '@material-ui/core/Grid'
import Drawer from '@material-ui/core/Drawer'
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';

import SecurityIssueTable from 'global/SecurityIssueTable'
import ErrorBoundary from 'global/ErrorBoundary'

import { IssueTypeButton } from 'hoc/Button/IssueTypeButton'
import { CardTitle } from 'hoc/Card/CardTitle'

import DashboardContext from "context/DashboardContext"
const DashboardContextConsumer = DashboardContext.Consumer

class ComplianceStatusAssets extends PureComponent {

    state = {
        issueCountList: [],
        totalCount: 0,
        loaded: false,
        openDrawer: false,
        category: '',
        issueType: ''

    }

    componentDidMount() {
        this.updateState(this.props.securityIssue)
    }

    static getDerivedStateFromProps(nextProps, state) {
        return { securityIssue: nextProps.securityIssue }
    }

    componentDidUpdate = (nextProps, prevState) => {
        if (this.props !== nextProps) {
            this.updateState(this.props.securityIssue)
        }
    }

    // --------------- Custom Logic Method Start----------------------
    toggleDrawer = (position, isOpen, issueType, service) => {
        this.setState({
            openDrawer: isOpen,
            issueType
        });
    };

    updateState = (securityIssue) => {
        this.setState({
            issueCountList:
                [
                    { issueType: 'pass', issueCount: securityIssue.data[0] ? securityIssue.data[0].PASS : 0 },
                    { issueType: 'fail', issueCount: securityIssue.data[0] ? securityIssue.data[0].FAIL : 0 },
                    { issueType: 'error', issueCount: securityIssue.data[0] ? securityIssue.data[0].ERROR : 0 }

                ],
            totalCount: securityIssue.count,
            loaded: true
        })
    }
    // --------------- Custom Logic Method End----------------------

    render() {
        const { loaded, totalCount, issueCountList, openDrawer, issueType } = this.state;
        const { securityIssue } = this.props

        return (
            <div>
                <Card className="card-wizard card-panel card-pd" id="container_security_alerts_by_status">
                    <CardTitle text={<span>  Compliance Status - <b>  {totalCount} </b></span>} />
                    <CardContent className="card-body pd0">

                        <ErrorBoundary error="error-boundary">
                            <List className="list-group-menu">
                                <ListItem className="list-group-item">
                                    <ListItemText className="list-group-item-1" primary={'Access Control 164.312(a)(1)'} />
                                    <ListItemSecondaryAction className="list-group-item-2 fnt-11 pdR24">
                                        <span className="text-success">24</span>
                                        <span>/48</span>
                                    </ListItemSecondaryAction>
                                </ListItem>
                                <ListItem className="list-group-item">
                                    <ListItemText className="list-group-item-1" primary={'Access Control 164.312(a)(1)'} />
                                    <ListItemSecondaryAction className="list-group-item-2 fnt-11 pdR24">
                                        <span className="text-success">24</span>
                                        <span>/48</span>
                                    </ListItemSecondaryAction>
                                </ListItem>
                                <ListItem className="list-group-item">
                                    <ListItemText className="list-group-item-1" primary={'Access Control 164.312(a)(1)'} />
                                    <ListItemSecondaryAction className="list-group-item-2 fnt-11 pdR24">
                                        <span className="text-success">24</span>
                                        <span>/48</span>
                                    </ListItemSecondaryAction>
                                </ListItem>
                                <ListItem className="list-group-item">
                                    <ListItemText className="list-group-item-1" primary={'Access Control 164.312(a)(1)'} />
                                    <ListItemSecondaryAction className="list-group-item-2 fnt-11 pdR24">
                                        <span className="text-success">24</span>
                                        <span>/48</span>
                                    </ListItemSecondaryAction>
                                </ListItem>
                                <ListItem className="list-group-item">
                                    <ListItemText className="list-group-item-1" primary={'Access Control 164.312(a)(1)'} />
                                    <ListItemSecondaryAction className="list-group-item-2 fnt-11 pdR24">
                                        <span className="text-success">24</span>
                                        <span>/48</span>
                                    </ListItemSecondaryAction>
                                </ListItem>
                                <ListItem className="list-group-item">
                                    <ListItemText className="list-group-item-1" primary={'Access Control 164.312(a)(1)'} />
                                    <ListItemSecondaryAction className="list-group-item-2 fnt-11 pdR24">
                                        <span className="text-success">24</span>
                                        <span>/48</span>
                                    </ListItemSecondaryAction>
                                </ListItem>
                                
                            </List>
                        </ErrorBoundary>
                    </CardContent>
                </Card>
                {totalCount > 0 && <Drawer className="right-sidebar" anchor="right" open={openDrawer}>
                    <SecurityIssueTable securityIssue={securityIssue} issueType={issueType} toggleDrawer={this.toggleDrawer} />
                </Drawer>}
            </div>
        );
    }
}

export default props => (
    <DashboardContextConsumer>
        {state => <ComplianceStatusAssets {...props} securityIssue={state.securityIssue} />}
    </DashboardContextConsumer>
);