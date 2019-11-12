/*
 * @Author: Virendra Patidar 
 * @Date: 2018-11-19 16:28:19 
 * @Last Modified by: Virendra Patidar
 * @Last Modified time: 2018-11-29 13:24:54
 */
import React, { PureComponent } from 'react'

import Grid from '@material-ui/core/Grid'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'

import CompanyList from 'global/CompanyList'
import LastUpdateTime from 'global/LastUpdateTime'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import * as companyMgmtActions from 'actions/companyMgmtAction'
import { showMessage } from 'actions/messageAction'
import { setProgressBar } from 'actions/commonAction'

class CompanyPage extends PureComponent {

    _mounted = false

    state = {
        companyCount: 0,
        accountCount: 0
    }


    componentDidMount() {
        this._mounted = true
        this.props.setProgressBar(true)
        this.fetchCompanyCount()
    }

    componentWillUnmount() {
        this._mounted = false
    }


    fetchCompanyCount() {
        this.props.actions.fetchCompanyPageCount().
            then(result => {
                if (this._mounted) {
                    if (result.success) {
                        this.setState({ filterProgress: false, companyCount: result.data.length > 0 ? result.data[0].total_companies : 0, accountCount: result.data.length > 0 ? result.data[0].total_accounts : 0 }, () => {
                        })
                    } else {
                        let message = { message: result, showSnackbarState: true, variant: 'error' }
                        this.props.showMessage(message)
                    }
                }
            });
    }


    render() {
        const { companyCount, accountCount } = this.state
        return (
            <div className="page-wrapper page-content">
                <Grid container spacing={24} className="mrB15">
                    <Grid item sm={6}>
                        <h3 className="mr0 main-heading">Companies</h3>
                    </Grid>
                    <Grid item sm={6} className="text-right">
                        {/* <LastUpdateTime /> */}
                    </Grid>
                </Grid>
                <Grid container spacing={24} className="summary-container">
                    <Grid item sm={3} className="pd0">
                        <Card className="card-wizard card-summary card-account">
                            <CardContent className="summary-content">
                                <div className="summary-title">
                                    Total Companies
                                 </div>
                                <div className="summary-count">
                                    {companyCount}
                                </div>
                                <div className="summary-icon">
                                    <i className="fa fa-bars" />
                                </div>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item sm={3} className="pd0">
                        <Card className="card-wizard card-summary card-account">
                            <CardContent className="summary-content">
                                <div className="summary-title">
                                    Total Accounts
                                 </div>
                                <div className="summary-count">
                                    {accountCount}
                                </div>
                                <div className="summary-icon">
                                    <i className="fa fa-cloud" />
                                </div>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
                <Grid container spacing={24} className="container">
                    <Grid item sm={12}>
                        <CompanyList companyCount={companyCount}/>
                    </Grid>
                </Grid>
            </div>
        );
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators(Object.assign({}, companyMgmtActions), dispatch),
        showMessage: message => {
            dispatch(showMessage(message))
        }, setProgressBar: isProgress => {
            dispatch(setProgressBar(isProgress))
        }
    };
}

export default withRouter((connect(null, mapDispatchToProps)(CompanyPage)));