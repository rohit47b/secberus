/*
 * @Author: Virendra Patidar 
 * @Date: 2018-09-19 12:30:21 
 * @Last Modified by: Virendra Patidar
 * @Last Modified time: 2019-05-08 11:23:29
 */
import Collapse from '@material-ui/core/Collapse';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { withStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import * as commonActions from 'actions/commonAction';
import { setActiveMenu, setActiveParentMenu, setReportTabValue } from 'actions/commonAction';
import { setOpenReportBug } from 'actions/uiAction';
import classNames from 'classnames';
import { store } from 'client';
import history from 'customHistory';
import { cloneDeep } from "lodash";
import PropTypes from 'prop-types';
import React, { Fragment, PureComponent } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';


const drawerWidth = 260;

const styles = theme => ({

    appBar: {
        zIndex: theme.zIndex.drawer + 1,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    appBarShift: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    menuButton: {
        marginLeft: 12,
        marginRight: 36,
    },
    hide: {
        display: 'none',
    },
    drawerPaper: {
        overflowX: 'hidden',
        position: 'relative',
        whiteSpace: 'nowrap',
        width: drawerWidth,
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    drawerPaperClose: {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing.unit * 7,
        [theme.breakpoints.up('sm')]: {
            width: theme.spacing.unit * 9,
        },
    },
    toolbar: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: '0 8px',
        ...theme.mixins.toolbar,
    },
    content: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.default,
        padding: theme.spacing.unit * 3,
    }
});

class Sidebar extends PureComponent {
    _mounted = false
    state = { activeMenu: this.props.activeMenu, isExpired: false };

    currentValue = this.props.trailData

    componentDidMount() {
        this._mounted = true
        const trailData = this.props.trailData
        let company = this.props.company

        const loginAsDetail = this.props.loginAsDetail
        if (loginAsDetail.isLogin === true) {
            company = loginAsDetail.company
        }
        if (company !== undefined && company.is_permanent === true) {
            this.setState({ isExpired: false })
        }
        else if (trailData.trailPeriodRemainigDays === 0 && trailData.isPurchased === false) {
            this.setState({ isExpired: false })
        }
        this.unsubscribe = store.subscribe(this.receiveFilterData)
    }

    componentWillUnmount() {
        this._mounted = false
    }

    receiveFilterData = data => {

        const currentState = store.getState()
        const previousValue = this.currentValue
        this.currentValue = currentState.uiReducer.trailData

        if (
            this.currentValue && previousValue !== this.currentValue
        ) {
            const trailData = cloneDeep(currentState.uiReducer.trailData)
            let company = this.props.company
            const loginAsDetail = this.props.loginAsDetail
            if (loginAsDetail.isLogin === true) {
                company = loginAsDetail.company
            }

            if (company !== undefined && company.is_permanent === true && this._mounted) {
                this.setState({ isExpired: false })
            }
            else if (trailData.trailPeriodRemainigDays === 0 && trailData.isPurchased === false && this._mounted) {
                this.setState({ isExpired: false })
            } else if (this._mounted) {
                this.setState({ isExpired: false })
            }
        }
    }

    handleParentMenu = (menu) => {
        if (this.props.activeParentMenu === menu) {
            this.props.setActiveParentMenu('')
        } else {
            this.props.setActiveParentMenu(menu)
        }
    }

    redirectToPage = (menu, url, tabValue) => {
        this.props.setActiveMenu(menu)

        if (menu === 'Dashboard' || menu === 'Alerts' || menu === 'Activity Log') {
            this.props.setActiveParentMenu('')
        }
        if (tabValue != undefined) {
            this.props.setReportTabValue(tabValue)
        }
        this.setState({ activeMenu: menu }, () => {
            history.push(url)
        });

    }

    handleOpenDialog=()=>{
        this.props.setOpenReportBug(true)
    }

    render() {
        const { classes, open, activeMenu, loginAsDetail, cloudAccounts, sideTop, filterData } = this.props;

        let isAllAccounts = false
        if (filterData.selectCloud.id === 'all' || filterData.selectAccount.id === 'all') {
            isAllAccounts = true
        }
     
        let { company } = this.props;
        const isLoginAs = loginAsDetail.isLogin

        if (isLoginAs === true) {
            company = loginAsDetail.company
        }

        const { isExpired } = this.state;
        const { activeParentMenu } = this.props;

        localStorage.setItem("isExpired", isExpired)
        const role = 'user'
        let topValue = sideTop
        if (topValue === 0) {
            topValue = 50
        }
        return (
            <Drawer
                variant="permanent"
                classes={{
                    paper: classNames(classes.drawerPaper, !open && classes.drawerPaperClose, 'app-sidebar'),
                }}
                open={open}
                PaperProps={{
                    style: {
                        top: topValue + 'px'
                    }
                }}
                style={{ paddingBottom: '50px' }}
            >
                <List component="nav" className="side-nav">
                    <div className="side-nav-top">
                    {(role === 'user' || isLoginAs === true) && <Fragment>
                        {!isExpired && <div>
                            {(cloudAccounts.length > 0 && isAllAccounts) &&
                            <Fragment>
                                <ListItem button className={activeMenu === 'Dashboard' ? 'nav-link active' : 'nav-link'} onClick={() => this.redirectToPage('Dashboard', '/app/multi-tenancy-dashboard/home')}>
                                    <Tooltip title="Dashboard" placement="right-end">
                                        <img width="16" src={activeMenu === 'Dashboard' ? "/assets/images/sideBarIcons/activeIcons/dashboard-green.png" : "/assets/images/sideBarIcons/dashboard.png"} alt="Dashboard" />
                                    </Tooltip>
                                    <ListItemText className="nav-text" primary="Dashboard" />
                                </ListItem>
                            </Fragment>
                            }
                            {(cloudAccounts.length > 0 && !isAllAccounts) && <Fragment>
                                <ListItem button className={activeMenu === 'Dashboard' ? 'nav-link active' : 'nav-link'} onClick={() => this.redirectToPage('Dashboard', '/app/dashboard/home')}>
                                    <Tooltip title="Dashboard" placement="right-end">
                                        <img width="16" src={activeMenu === 'Dashboard' ? "/assets/images/sideBarIcons/activeIcons/dashboard-green.png" : "/assets/images/sideBarIcons/dashboard.png"} alt="Dashboard" />
                                    </Tooltip>
                                    <ListItemText className="nav-text" primary="Dashboard" />
                                </ListItem>
                                {/* <ListItem button className={activeMenu === 'Multi-tenancy-dashboard' ? 'nav-link active' : 'nav-link'} onClick={() => this.redirectToPage('Multi-tenancy-dashboard', '/app/multi-tenancy-dashboard/home')}>
                                    <Tooltip title="Multi Tenancy Dashboard" placement="right-end">
                                        <img width="16" src={activeMenu === 'Multi-tenancy-dashboard' ? "/assets/images/sideBarIcons/activeIcons/multi-tenancy-dashboard-green.png" : "/assets/images/sideBarIcons/multi-tenancy-dashboard.png"} alt="Dashboard" />
                                    </Tooltip>
                                    <ListItemText className="nav-text" primary="Dashboard" />
                                </ListItem> */}

                                <ListItem button className={activeMenu === 'Alerts' ? 'nav-link active' : 'nav-link'} onClick={() => this.redirectToPage('Alerts', '/app/alerts')}>
                                    <Tooltip title="Alerts (Investigate)" placement="right-end">
                                        <img width="16" src={activeMenu === 'Alerts' ? "/assets/images/sideBarIcons/activeIcons/alert-green.png" : "/assets/images/sideBarIcons/alert.png"} alt="Alerts (Investigate)" />
                                    </Tooltip>
                                    <ListItemText className="nav-text" primary="Alerts" />
                                </ListItem>

                                <ListItem button className={activeMenu === 'Assets' ? 'nav-link active bg-black' : 'nav-link'} onClick={() => this.handleParentMenu('Assets')}>
                                    <Tooltip title="Assets" placement="right-end">
                                        <img width="16" src={activeMenu === 'Assets' ? "/assets/images/sideBarIcons/activeicons/assets-green.png" : "/assets/images/sideBarIcons/assets_icon.png"} alt="Assets" />
                                    </Tooltip>
                                    <ListItemText className="nav-text" primary="Assets" />
                                </ListItem>

                                <Collapse in={activeParentMenu === 'Assets'} timeout="auto" unmountOnExit>
                                    <List component="div" disablePadding className="submenu">
                                        <ListItem button className={activeMenu === 'Compute' ? 'submenu-item active' : 'submenu-item'} onClick={() => this.redirectToPage('Compute', '/app/assets-compute')}>
                                            <Tooltip title="Compute" placement="right-end">
                                                <img width="16" src={activeMenu === 'Compute' ? "/assets/images/sideBarIcons/activeIcons/compute-green.png" : "/assets/images/sideBarIcons/compute.png"} alt="Compute" />
                                            </Tooltip>
                                            <ListItemText inset primary="Compute" />
                                        </ListItem>
                                        <ListItem button className={activeMenu === 'Data Storage' ? 'submenu-item active' : 'submenu-item'} onClick={() => this.redirectToPage('Data Storage', '/app/assets-storage')}>
                                            <Tooltip title="Data Storage" placement="right-end">
                                                <img width="16" src={activeMenu === 'Data Storage' ? "/assets/images/sideBarIcons/activeIcons/data-storage-green.png" : "/assets/images/sideBarIcons/data-storage.png"} alt="Data Storage" />
                                            </Tooltip>
                                            <ListItemText inset primary="Data Storage" />
                                        </ListItem>
                                        <ListItem button className={activeMenu === 'Identity Management' ? 'submenu-item active' : 'submenu-item'} onClick={() => this.redirectToPage('Identity Management', '/app/assets-identity-management')}>
                                            <Tooltip title="Identity Management" placement="right-end">
                                                <img width="16" src={activeMenu === 'Identity Management' ? "/assets/images/sideBarIcons/activeIcons/identity management-green.png" : "/assets/images/sideBarIcons/identity management.png"} alt="Identity Management" />
                                            </Tooltip>
                                            <ListItemText inset primary="Identity Management" />
                                        </ListItem>
                                        <ListItem button className={activeMenu === 'Logging/Monitoring' ? 'submenu-item active' : 'submenu-item'} onClick={() => this.redirectToPage('Logging/Monitoring', '/app/assets-logging-monitoring')}>
                                            <Tooltip title="Logging/Monitoring" placement="right-end">
                                                <img width="16" src={activeMenu === 'Logging/Monitoring' ? "/assets/images/sideBarIcons/activeIcons/access-control-green.png" : "/assets/images/sideBarIcons/access-control.png"} alt="Logging/Monitoring" />
                                            </Tooltip>
                                            <ListItemText inset primary="Logging/Monitoring" />
                                        </ListItem>
                                        <ListItem button className={activeMenu === 'Transit' ? 'submenu-item active' : 'submenu-item'} onClick={() => this.redirectToPage('Transit', '/app/assets-transit')}>
                                            <Tooltip title="Transit" placement="right-end">
                                                <img width="16" src={activeMenu === 'Transit' ? "/assets/images/sideBarIcons/activeIcons/transit-green.png" : "/assets/images/sideBarIcons/transit.png"} alt="Transit" />
                                            </Tooltip>
                                            <ListItemText inset primary="Transit" />
                                        </ListItem>
                                    </List>
                                </Collapse>

                                <ListItem button className={activeMenu === 'Governance' ? 'nav-link active bg-black' : 'nav-link'} onClick={() => this.handleParentMenu('Governance')}>
                                    <Tooltip title="Governance" placement="right-end">
                                        <img width="16" src={activeMenu === 'Governance' ? "/assets/images/sideBarIcons/activeicons/governance-green.png" : "/assets/images/sideBarIcons/governance.png"} alt="Governance" />
                                    </Tooltip>
                                    <ListItemText className="nav-text" primary="Governance" />
                                </ListItem>

                                <Collapse in={activeParentMenu === 'Governance'} timeout="auto" unmountOnExit>
                                    <List component="div" disablePadding className="submenu">
                                        {/* <ListItem button className={activeMenu === 'Policies' ? 'submenu-item active' : 'submenu-item'} onClick={() => this.redirectToPage('Policies', '/app/policies')}>
                                            <Tooltip title="Policies" placement="right-end">
                                                <img width="16" src={activeMenu === 'Policies' ? "/assets/images/sideBarIcons/activeIcons/policies-green.png" : "/assets/images/sideBarIcons/policies_icon.png"} alt="Policies" />
                                            </Tooltip>
                                            <ListItemText inset primary="Policies" />
                                        </ListItem> */}
                                        <ListItem button className={activeMenu === 'Security Rules' ? 'submenu-item active' : 'submenu-item'} onClick={() => this.redirectToPage('Security Rules', '/app/rules')}>
                                            <Tooltip title="Security Rules" placement="right-end">
                                                <img width="16" src={activeMenu === 'Security Rules' ? "/assets/images/sideBarIcons/activeIcons/security-rules-green.png" : "/assets/images/sideBarIcons/security-rules.png"} alt="Security Rules" />
                                            </Tooltip>
                                            <ListItemText inset primary="Security Rules" />
                                        </ListItem>
                                    </List>
                                </Collapse>

                                <ListItem button className={activeMenu === 'Reports' ? 'nav-link active' : 'nav-link'} onClick={() => this.handleParentMenu('Reports')}>
                                    <Tooltip title="Reports" placement="right-end">
                                        <img src={activeMenu === 'Reports' ? "/assets/images/sideBarIcons/activeIcons/report-green.png" : "/assets/images/sideBarIcons/reports.png"} width="16" alt="Reports" />
                                    </Tooltip>
                                    <ListItemText className="nav-text" primary="Reports" />
                                </ListItem>

                                <Collapse in={activeParentMenu === 'Reports'} timeout="auto" unmountOnExit>
                                    <List component="div" disablePadding className="submenu">
                                        <ListItem button className={activeMenu === 'Remediation' ? 'nav-link active' : 'nav-link'} onClick={() => this.redirectToPage('Remediation', '/app/reports/remediation')}>
                                            <Tooltip title="Remediation" placement="right-end">
                                                <img width="16" src={activeMenu === 'Remediation' ? "/assets/images/sideBarIcons/activeIcons/remediation-green.png" : "/assets/images/sideBarIcons/remediation.png"} alt="Remediation" />
                                            </Tooltip>
                                            <ListItemText className="nav-text" primary="Remediation" />
                                        </ListItem>
                                        <ListItem button className={activeMenu === 'Security' ? 'submenu-item active' : 'submenu-item'} onClick={() => this.redirectToPage('Security', '/app/reports/security')}>
                                            <Tooltip title="Security" placement="right-end">
                                                <img width="16" src={activeMenu === 'Security' ? "/assets/images/sideBarIcons/activeIcons/security-green.png" : "/assets/images/sideBarIcons/security.png"} alt="Security" />
                                            </Tooltip>
                                            <ListItemText inset primary="Security" />
                                        </ListItem>
                                        <ListItem button className={activeMenu === 'Compliance' ? 'submenu-item active' : 'submenu-item'} onClick={() => this.redirectToPage('Compliance', '/app/reports/compliance')}>
                                            <Tooltip title="Compliance" placement="right-end">
                                                <img width="16" src={activeMenu === 'Compliance' ? "/assets/images/sideBarIcons/activeIcons/compliance-green.png" : "/assets/images/sideBarIcons/compliance_icon.png"} alt="Compliance" />
                                            </Tooltip>
                                            <ListItemText inset primary="Compliance" />
                                        </ListItem>

                                        {/* <ListItem button className={activeMenu === 'Custom' ? 'submenu-item active' : 'submenu-item'} onClick={() => this.redirectToPage('Custom', '/app/reports', 3)}>
                                            <Tooltip title="Custom" placement="right-end">
                                                <img width="16" src={activeMenu === 'Custom' ? "/assets/images/sideBarIcons/activeIcons/custom-green.png" : "/assets/images/sideBarIcons/custom.png"} alt="Custom" />
                                            </Tooltip>
                                            <ListItemText inset primary="Custom" />
                                        </ListItem> */}

                                    </List>
                                </Collapse>
                                <ListItem button className={activeMenu === 'Billing Analysis' ? 'nav-link active' : 'nav-link'} onClick={() => this.redirectToPage('Billing Analysis', '/app/billing-analysis')}>
                                    <Tooltip title="Billing Analysis" placement="right-end">
                                        <img width="16" src={activeMenu === 'Billing Analysis' ? "/assets/images/sideBarIcons/activeIcons/bill-green.png" : "/assets/images/sideBarIcons/bill-gray.png"} alt="Billing Analysis" />
                                    </Tooltip>
                                    <ListItemText className="nav-text" primary="Billing Analysis" />
                                </ListItem>
                            </Fragment>}

                            <ListItem button className={activeMenu === 'Integration' ? 'nav-link active bg-black' : 'nav-link'} onClick={() => this.handleParentMenu('Integration')}>
                                <Tooltip title="Integrations" placement="right-end">
                                    <img width="16" src={activeMenu === 'Integration' ? "/assets/images/sideBarIcons/activeIcons/integration-green.png" : "/assets/images/sideBarIcons/integration.png"} alt="Integrations" />
                                </Tooltip>
                                <ListItemText className="nav-text" primary="Integrations" />
                            </ListItem>

                            <Collapse in={activeParentMenu === 'Integration'} timeout="auto" unmountOnExit>
                                <List component="div" disablePadding className="submenu">
                                    <ListItem button className={activeMenu === 'Clouds' ? 'submenu-item active' : 'submenu-item'} onClick={() => this.redirectToPage('Clouds', '/app/integrations/clouds')}>
                                        <Tooltip title="Clouds" placement="right-end">
                                            <img src={activeMenu === 'Clouds' ? "/assets/images/sideBarIcons/activeIcons/clouds-green.png" : "/assets/images/sideBarIcons/cloud_icon.png"} width="16" alt="Clouds" />
                                        </Tooltip>
                                        <ListItemText inset primary="Clouds" />
                                    </ListItem>
                                    <ListItem button className={activeMenu === 'Communication' ? 'submenu-item active' : 'submenu-item'} onClick={() => this.redirectToPage('Communication', '/app/integrations/communication')}>
                                        <Tooltip title="Communication" placement="right-end">
                                            <img  src={activeMenu === 'Communication' ? "/assets/images/sideBarIcons/activeIcons/communication-green.png" : "/assets/images/sideBarIcons/communication_icon.png"} width="16" alt="Communication" />
                                        </Tooltip>
                                        <ListItemText inset primary="Communication" />
                                    </ListItem>
                                </List>
                            </Collapse>

                            <ListItem button className={activeMenu === 'Settings' ? 'nav-link active bg-black' : 'nav-link'} onClick={() => this.handleParentMenu('Settings')}>
                                <Tooltip title="Settings" placement="right-end">
                                    <img src={activeMenu === 'Settings' ? "/assets/images/sideBarIcons/activeIcons/settings-green.png" : "/assets/images/sideBarIcons/settings.png"} width="16" alt="Settings" />
                                </Tooltip>
                                <ListItemText className="nav-text" primary="Settings" />
                            </ListItem>

                            <Collapse in={activeParentMenu === 'Settings'} timeout="auto" unmountOnExit>
                                <List component="div" disablePadding className="submenu">
                                    <ListItem button className={activeMenu === 'Detection' ? 'submenu-item active' : 'submenu-item'} onClick={() => this.redirectToPage('Detection', '/app/setting/cloud-scanner')}>
                                        <Tooltip title="Detection" placement="right-end">
                                            <img src={activeMenu === 'Detection' ? "/assets/images/sideBarIcons/activeIcons/detection-green.png" : "/assets/images/sideBarIcons/detection.png"} width="16" alt="Detection" />
                                        </Tooltip>
                                        <ListItemText inset primary="Detection" />
                                    </ListItem>

                                    <ListItem button className={activeMenu === 'User Mgmt' ? 'submenu-item active' : 'submenu-item'} onClick={() => this.redirectToPage('User Mgmt', '/app/user-management')}>
                                        <Tooltip title="User Mgmt" placement="right-end">
                                            <img width="16" src={activeMenu === 'User Mgmt' ? "/assets/images/sideBarIcons/activeIcons/user-management-green.png" : "/assets/images/sideBarIcons/user-management.png"} alt="User Management" />
                                        </Tooltip>
                                        <ListItemText inset primary="User Mgmt" />
                                    </ListItem>

                                </List>
                            </Collapse>

                            {/* <ListItem button className={activeMenu === 'Activity Log' ? 'nav-link active' : 'nav-link'} onClick={() => this.redirectToPage('Activity Log', '/app/setting/activity-log')}>
                                <Tooltip title="Activity Log" placement="right-end">
                                    <img src={activeMenu === 'Activity Log' ? "/assets/images/sideBarIcons/activeIcons/activity-log-green.png" : "/assets/images/sideBarIcons/activity-log.png"} width="16" alt="Activity Log" />
                                </Tooltip>
                                <ListItemText className="nav-text" primary="Activity Log" />
                            </ListItem> */}
                        </div>
                        }


                        {company.is_permanent === false && <ListItem button className={activeMenu === 'Billing' ? 'nav-link active' : 'nav-link'} onClick={() => this.redirectToPage('Billing', '/app/billing')}>
                            <Tooltip title="Billing" placement="right-end">
                                <i className="fa fa-credit-card" aria-hidden="true"></i>
                            </Tooltip>
                            <ListItemText className="nav-text" primary="Billing" />
                        </ListItem>
                        }
                    </Fragment>
                    }

                    {/* Super Admin can be access company page as well as admin users page*/}
                    {(role === 'super_admin' && isLoginAs !== true) && <Fragment>
                        <ListItem button className={activeMenu === "Companies" ? 'nav-link active' : 'nav-link'} onClick={() => this.redirectToPage('Companies', '/app/companies')}>
                            <Tooltip title="Companies" placement="right-end">
                                <i className="fa fa fa-building-o" aria-hidden="true"></i>
                            </Tooltip>
                            <ListItemText className="nav-text" primary="Company" />
                        </ListItem>
                        <ListItem button className={activeMenu === "Admin User" ? 'nav-link active' : 'nav-link'} onClick={() => this.redirectToPage('Admin User', '/app/admin-user')}>
                            <Tooltip title="Admin User" placement="right-end">
                                <i className="fa fa-user-o" aria-hidden="true"></i>
                            </Tooltip>
                            <ListItemText className="nav-text" primary="Admin User" />
                        </ListItem>
                    </Fragment>}



                    {/* Admin only have permission to access company page */}
                    {(role === 'admin' && isLoginAs !== true) && <Fragment>
                        <ListItem button className={activeMenu === "Companies" ? 'nav-link active' : 'nav-link'} onClick={() => this.redirectToPage('Companies', '/app/companies')}>
                            <Tooltip title="Companies" placement="right-end">
                                <i className="fa fa fa-building-o" aria-hidden="true"></i>
                            </Tooltip>
                            <ListItemText className="nav-text" primary="Company" />
                        </ListItem>
                    </Fragment>}
                    </div>
                    <ListItem button className={activeMenu === 'Report Bug' ? 'nav-link active' : 'nav-link'} onClick={this.handleOpenDialog}>
                        <Tooltip title="Report Bug" placement="right-end">
                            <img width="16" src={"/assets/images/sideBarIcons/Report-bug.png"} alt="Report Bug" />
                        </Tooltip>
                        <ListItemText className="nav-text" primary="Report Bug" />
                    </ListItem>

                </List>

            </Drawer>
        );
    }
}

Sidebar.propTypes = {
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
};

const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators(Object.assign({}, commonActions), dispatch),
        setActiveMenu: activeMenu => {
            dispatch(setActiveMenu(activeMenu))
        },
        setReportTabValue: reportTabValue => {
            dispatch(setReportTabValue(reportTabValue))
        },
        setActiveParentMenu: activeParentMenu => {
            dispatch(setActiveParentMenu(activeParentMenu))
        },
        setOpenReportBug: open => {
            dispatch(setOpenReportBug(open))
        }
    };
}

const mapStateToProps = (state, ownProps) => ({
    activeMenu: state.uiReducer.activeMenu,
    activeParentMenu: state.uiReducer.activeParentMenu,
    trailData: state.uiReducer.trailData,
    token: state.userReducer.token,
    company: state.userReducer.company,
    loginAsDetail: state.userReducer.loginAsDetail,
    cloudAccounts: state.commonReducer.cloud_accounts,
    filterData: state.uiReducer.filterData,
})


export default withRouter(withStyles(styles, { withTheme: true })(connect(mapStateToProps, mapDispatchToProps)(Sidebar)));