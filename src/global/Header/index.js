/*
 * @Author: Virendra Patidar 
 * @Date: 2018-10-01 11:37:40 
 * @Last Modified by: Virendra Patidar
 * @Last Modified time: 2019-04-25 16:15:45
 */
import React, { PureComponent } from 'react'

import PropTypes from 'prop-types'
import classNames from 'classnames'

import { withStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import MenuIcon from '@material-ui/icons/Menu'
import IconButton from '@material-ui/core/IconButton'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'
import Button from '@material-ui/core/Button'

import { Link } from 'react-router-dom'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { store } from 'client'
import { cloneDeep } from "lodash"

import APPCONFIG from 'constants/Config'

import SearchBar from 'global/SearchBar'
import Notification from 'global/Notification'
import ProfileNavigationItem from 'global/ProfileNavigationItem'
import InProgress from 'global/InProgress'

import * as accountMgmtActions from 'actions/accountMgmtAction'

import { showMessage } from 'actions/messageAction'
import { setProgressBar, setOpen, setMttd } from 'actions/commonAction'
import { setLoginAsCompanyDetails } from 'actions/userAction'
import { setActiveMenu } from 'actions/commonAction'

import history from 'customHistory'

const drawerWidth = 240;

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
        //width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    menuButton: {
        marginLeft: 12,
        marginRight: 8,
    },
    hide: {
        display: 'none',
    },
    drawerPaper: {
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
        ...theme.mixins.toolbar,
    },
    content: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.default,
        padding: theme.spacing.unit * 3,
    },
});


class Header extends PureComponent {

    _mounted = false

    state = { trailPeriodRemainigDays: 0, isPurchased: false, inProgress: false, remaining: 0, accountId: undefined };

    currentValue = this.props.trailData
    currentValueCloud = {}

    componentDidMount() {
        this._mounted = true
        const trailData = this.props.trailData
        this.setState({ trailPeriodRemainigDays: trailData.trailPeriodRemainigDays, isPurchased: trailData.isPurchased })
        const filterData = this.props.filterData
        this.setState({accountId: filterData.selectAccount.id})
        if (filterData.selectAccount.id !== 'all' && filterData.selectAccount.id !== undefined) {
            this._mounted = false
            this.fetchCloudAccount(filterData.selectAccount.id)
        } else {
            this.setState({inProgress: false})
        }
        this.timer = setInterval(this.updateTime, 50000);
        this.unsubscribe = store.subscribe(this.receiveFilterData)
    }


    componentWillUnmount() {
        this._mounted = false
        clearInterval(this.timer);
    }

    receiveFilterData = data => {
        const currentState = store.getState()
        const previousValue = this.currentValue
        this.currentValue = currentState.uiReducer.trailData

        const previousValueCloud = this.currentValueCloud
        this.currentValueCloud = currentState.uiReducer.filterData

        if (
            (this.currentValue && previousValue !== this.currentValue) ||
            (this.currentValueCloud && previousValueCloud !== this.currentValueCloud)
        ) {
            const trailData = cloneDeep(currentState.uiReducer.trailData)
            if (this._mounted) {
                this.setState({ trailPeriodRemainigDays: trailData.trailPeriodRemainigDays, isPurchased: trailData.isPurchased })
            }
            const filterData = cloneDeep(currentState.uiReducer.filterData)
            this.setState({accountId: filterData.selectAccount.id})
            if (filterData.selectAccount.id !== 'all' && this._mounted) {
                this.fetchCloudAccount(filterData.selectAccount.id)
            } else {
                this.setState({inProgress: false})
            }
        }
    }

    updateTime = () => {
        const accountId = this.state.accountId
        if (accountId !== 'all' && accountId !== undefined) {
            this.fetchCloudAccount(accountId)
        } else {
            this.setState({inProgress: false})
        }
    }

    fetchCloudAccount(accountId) {
        let payload = {}
        payload.cloud_account_id = accountId
        this.props.actions.fetchCloudAccount(payload).
            then(response => {
                this._mounted = true
                if (typeof response !== 'string') {
                    this.props.setMttd(response.scan_interval)
                    const lastScan = Date.parse(response.last_scan_finish_date)
                    const now = Date.now()
                    const timeElapsed = now - lastScan
                    let remaining =  (response.scan_interval/60) - (timeElapsed / 60000)
                    if (remaining < 0) {
                        remaining = 0
                    }
                    this.setState({remaining: Math.round(remaining), inProgress: response.in_progress})
                } else {
                    console.log(' Error in fetching alert summery :- ', response);
                }
            });
    }

    backToAdmin = () => {
        const loginAsDetails = { isLogin: false, company: {} }
        this.props.setLoginAsCompanyDetails(loginAsDetails)
        this.props.setActiveMenu('Companies')
        history.push('/app/companies')
    }

    backToAdmin1 = () => {
        this.props.setProgressBar(true)
        this.props.actions.logoutAsAdminFromCompany().
            then(result => {
                if (this._mounted) {
                    if (result.success) {
                        const loginAsDetails = { isLoginAs: false, company: {} }
                        this.props.setLoginAsCompanyDetails(loginAsDetails)
                        this.props.setActiveMenu('Companies')
                        history.push('/app/companies')
                    } else {
                        let message = { message: result, showSnackbarState: true, variant: 'error', }
                        this.props.showMessage(message)
                        this.props.setProgressBar(false)
                    }

                }
            });
    }


    render() {
        const { classes, theme, open, handleDrawerOpen, handleDrawerClose, token, company } = this.props;
        const { trailPeriodRemainigDays, isPurchased, inProgress, remaining, accountId } = this.state
        const { isLogin } = this.props.loginAsDetail
        const loginAsCompany = this.props.loginAsDetail.company
        // const isPurchased = localStorage.getItem('isPurchased') ? localStorage.getItem('isPurchased') : false
        return (
            <AppBar
                position="absolute"
                className={classNames(classes.appBar, open && classes.appBarShift, ' header')}
            >
                <Toolbar className="header-toolbar" disableGutters={!open} >
                    <IconButton
                        color="inherit"
                        aria-label="Open drawer"
                        onClick={handleDrawerOpen}
                        className={classNames(classes.menuButton, open && classes.hide)}
                    >
                    <MenuIcon />
                    </IconButton>
                    <div className={classes.toolbar + ' toolbar-icon ' + classes.hide}>
                        <IconButton className={classNames(classes.menuButton)} onClick={handleDrawerClose}>
                            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                        </IconButton>
                    </div>
                    <div className="logo">
                        <Link to="/app/dashboard/home"><img alt="Secberus" src={APPCONFIG.company_logo_path2} /></Link>
                    </div>
                    {(isLogin === true) && <SearchBar />}
                    <div className="nav-right profile-bar">
                        {accountId !== 'all' && accountId !== undefined && (<div>{(inProgress === true) ? <InProgress /> : <span className="in-progress-spinner-text">Next scan in {remaining} minutes</span>}</div>)}
                        {/* (isPurchased === 'false' || isPurchased === false) && (token.role && token.role === 'user') && (company === undefined || company.is_permanent !== true) */ false && <span className="anim-typewriter fnt-13 mrR15">TRIAL - {trailPeriodRemainigDays} DAYS LEFT</span>}

                        {/* {isLogin === true && <Button
                            className="btn btn-primary mrR10"
                            variant="contained"
                            color="primary"
                            onClick={this.backToAdmin}
                        >
                            <i className="fa fa-arrow-left mrR5"></i> Back To Admin Panel
                        </Button>} */}

                        {isLogin === true && <span className="padding-spinner">{loginAsCompany.name}</span>}
                        <Notification />
                        <ProfileNavigationItem />
                    </div>
                </Toolbar>
            </AppBar>
        );
    }
}

Header.propTypes = {
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
};


const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators(Object.assign({}, accountMgmtActions), dispatch),
        setLoginAsCompanyDetails: isLoginAs => {
            dispatch(setLoginAsCompanyDetails(isLoginAs))
        }, setActiveMenu: activeMenu => {
            dispatch(setActiveMenu(activeMenu))
        }, showMessage: message => {
            dispatch(showMessage(message))
        }, setProgressBar: isProgress => {
            dispatch(setProgressBar(isProgress))
        }, setMttd: mttd => {
            dispatch(setMttd(mttd))
        }, 
    };
}

const mapStateToProps = (state, ownProps) => ({
    trailData: state.uiReducer.trailData,
    token: state.userReducer.token,
    company: state.userReducer.company,
    loginAsDetail: state.userReducer.loginAsDetail,
    filterData: state.uiReducer.filterData,
    accountList:state.commonReducer.cloud_accounts
})



export default withStyles(styles, { withTheme: true })(connect(mapStateToProps, mapDispatchToProps)(Header));