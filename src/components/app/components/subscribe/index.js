/*
 * @Author: Virendra Patidar 
 * @Date: 2018-09-26 10:34:57 
 * @Last Modified by: Virendra Patidar
 * @Last Modified time: 2018-11-27 12:15:43
 */
import React, { PureComponent } from 'react'

import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Typography from '@material-ui/core/Typography'

import history from 'customHistory'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { union } from 'lodash'

import { RightIcon } from 'hoc/Icon/RightIcon'

import ErrorBoundary from 'global/ErrorBoundary'
import DeleteUser from 'global/DeleteUser'

import * as subscriptionsActions from 'actions/subscriptionsAction'

import { showMessage } from 'actions/messageAction'
import { setProgressBar } from 'actions/commonAction'

class Subscribe extends PureComponent {
    _mounted = false
    state = {
        dataList: [],
        loaded: false,
        remainingTrialDays: 0,
        companyId: '',
        featuresList: [],
        noOfPlan: 0
    }

    componentDidMount() {
        this._mounted = true
        this.props.setProgressBar(true);
        this.fetchSubscriptionsPlans()
    }

    componentWillUnmount() {
        this._mounted = false
    }

    fetchSubscriptionsPlans() {
        this.props.actions.fetchSubscriptionsPlans().
            then(result => {
                if (this._mounted) {
                    if (result.success) {
                        this.props.setProgressBar(false);
                        this.setState({ dataList: result.data, noOfPlan: result.data.length, loaded: true }, () => {
                            this.setFeatures(this.state.dataList)
                        });
                    } else {
                        this.props.setProgressBar(false);
                        this.setState({ dataList: [], loaded: true });
                        let message = { message: result, showSnackbarState: true, variant: 'error' }
                        this.props.showMessage(message)
                    }
                }
            });
    }

    setFeatures = (data) => {
        let featuresList = []
        data.map((item, index) => {
            featuresList = union(featuresList, item.feature)
        })
        this.setState({ featuresList: featuresList })
    }


    subscribePlan = (planId, amount, planName) => {
        this.props.setProgressBar(true);
        history.push({
            pathname: '/app/billing',
            state: { planId: planId, planName: planName, amount: amount }
        })
    }

    render() {
        const { dataList, loaded, featuresList, noOfPlan } = this.state
        const { trailPeriodRemainigDays, isPurchased } = this.props.trailData
        return (
            <Grid container spacing={24} className="container-bill">
                <Grid item sm={6}>
                    <h3 className="mr0 main-heading">Billing</h3>
                    <p className="mr0 fnt-13">You have {trailPeriodRemainigDays} Days remaining from 14 days trial,please subscribe before it expires.</p>
                </Grid>
                <Grid item sm={6} className="text-right right-sec">
                    {(trailPeriodRemainigDays === 0 && isPurchased === false) && <DeleteUser />}
                    <span className="mrR10 fnt-13 mrL10">Current Plan:</span>
                    <Button onClick={() => history.push('/app/billing')} variant="contained" className="btn btn-white">
                        Trial
                    </Button>
                </Grid>
                <Grid item sm={12} className="pdB0 pdT0 mrB20">
                    <hr className="divider-border" />
                </Grid>
                <Grid container spacing={24} className="mr0">
                    <ErrorBoundary error="error-boundary">
                        <Grid item sm={10} className="pdB0 pdT0">
                            {loaded && <Table className="table-billing mrB15">
                                <TableHead>
                                    <TableRow>
                                        <TableCell component="td"></TableCell>
                                        {
                                            dataList.map((item, index) => {
                                                return (
                                                    <TableCell key={item.name} component="td" className={index === 0 ? 'stnd-bill' : ''}>{index === 0 ? 'RECOMMENDED' : ''}</TableCell>

                                                )
                                            })
                                        }
                                    </TableRow>

                                    <TableRow>
                                        <TableCell align="left" width="350">Feature</TableCell>
                                        {
                                            dataList.map((item, index) => {
                                                return (
                                                    <TableCell width="100" className="td-border text-center" key={item.name} numeric>{item.name}- ${item.ammount}*</TableCell>
                                                )
                                            })
                                        }
                                    </TableRow>
                                </TableHead>
                                <TableBody>

                                    {
                                        featuresList.map((item, index) => {
                                            return (
                                                <TableRow key={item}>
                                                    <TableCell className="bg-light-gray">
                                                        {item}
                                                    </TableCell>
                                                    {
                                                        dataList.map((plan, planIndex) => {
                                                            return <TableCell key={item + ' ' + plan.name + ' ' + planIndex} className='td-border text-center'>
                                                                {plan.feature.indexOf(item) > -1 && <RightIcon />}
                                                            </TableCell>
                                                        })
                                                    }
                                                </TableRow>
                                            )
                                        })
                                    }

                                    <TableRow>
                                        <TableCell className="bg-light-gray">
                                        </TableCell>
                                        {
                                            dataList.map((item, index) => {
                                                if (item.planId !== 'Coming Soon') {
                                                    return (
                                                        <TableCell className="td-border brd-btm-green text-center" key={item.name}>
                                                            <Button onClick={() => this.subscribePlan(item.planId, item.ammount, item.name)} variant="outlined" color="primary" className="btn btn-primary">
                                                                Subscribe
                                                            </Button>
                                                        </TableCell>
                                                    )
                                                } else {
                                                    return (
                                                        <TableCell className="td-border brd-btm-green text-center" key={item.name}>
                                                            <Button variant="outlined" color="primary" className="btn btn-gray" disabled>
                                                                Coming Soon
                                                            </Button>
                                                        </TableCell>
                                                    )
                                                }
                                            })
                                        }
                                    </TableRow>
                                </TableBody>
                            </Table>
                            }
                            <Typography component="p">
                                * Plan for single account
                            </Typography>
                        </Grid>
                    </ErrorBoundary>
                </Grid>
            </Grid >
        );
    }
}


const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators(Object.assign({}, subscriptionsActions), dispatch),
        showMessage: message => {
            dispatch(showMessage(message))
        }, setProgressBar: isProgress => {
            dispatch(setProgressBar(isProgress))
        }
    };
}


const mapStateToProps = (state, ownProps) => ({
    filterData: state.uiReducer.filterData,
    trailData: state.uiReducer.trailData,
})

export default withRouter((connect(mapStateToProps, mapDispatchToProps)(Subscribe)));