/*
 * @Author: Virendra Patidar 
 * @Date: 2018-09-26 10:34:57 
 * @Last Modified by: Virendra Patidar
 * @Last Modified time: 2018-11-16 14:57:56
 */
import React, { PureComponent } from 'react'

import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'

import ErrorBoundary from 'global/ErrorBoundary'
import { CountBox } from 'hoc/Box/CountBox'
import BillingTable from 'global/BillingTable'

import history from 'customHistory'

import Payment from './Payment'

class Billing extends PureComponent {
    state = {
        open: false,
        nextBilling: '',
        billingAmount: '0'
    }

    componentDidMount() {
        if (this.props.location.state && this.props.location.state.planId) {
            this.setState({ open: true })
        }
    }

    handleClose = () => {
        this.setState({ open: false }, () => {
            history.push({
                pathname: '/app/billing',
                state: {}
            })
        });
    };

    updateNextBillingDetails = (nextBilling, billingAmount) => {
        this.setState({ nextBilling, billingAmount })
    }

    render() {
        mixpanel.track("View Page", {
            "Page Name": 'Billing',
        });
        const { open, nextBilling, billingAmount } = this.state
        const planName = this.props.location.state ? this.props.location.state.planName : ''
        const amount = this.props.location.state ? this.props.location.state.amount : ''
        return (
            <div className="page-wrapper container-bill page-content">
                <Grid container spacing={24} className="container-heading mrB10">
                    <Grid item sm={6}>
                        <h3 className="mr0 main-heading">Billing</h3>
                    </Grid>
                    <Grid item sm={6} className="text-right right-sec">
                        <Button onClick={() => history.push('/app/subscribe')} variant="contained" className="btn btn-outline-blue">
                            Payment information
                        </Button>
                    </Grid>
                </Grid>
                <Grid container spacing={24} className="mrB20">
                    <ErrorBoundary error="error-boundary">
                        <Grid item sm={6}>
                            <CountBox title={'Next'} nextLineTitle={'Billing'} cssClass={'bill-box'} count={nextBilling} />
                        </Grid>
                        <Grid item sm={6}>
                            <CountBox title={'Billing'} nextLineTitle={'Amount'} cssClass={'bill-box'} count={'$' + billingAmount} />
                        </Grid>
                    </ErrorBoundary>
                </Grid>
                <Grid container spacing={24} className="mrB20">
                    <Grid item sm={12} className="pdB0">
                        <h5 className="mr0">Payment History</h5>
                    </Grid>
                </Grid>
                <Grid container spacing={24} className="grid-container">
                    <Grid item sm={12} className="pdT0">
                        <BillingTable updateNextBillingDetails={this.updateNextBillingDetails} />
                    </Grid>
                </Grid>
                <Dialog className="dialog-subscribe" open={open} onClose={this.handleClose}>
                    <DialogTitle className="dialog-title">
                        <span className="float-left">Subscribe</span>
                        <span className="light-fnt float-right">{planName} - ${amount}*</span>
                        <div className="clearfix"></div>
                    </DialogTitle>
                    <DialogContent>
                        <Payment data={this.props.location.state} />
                    </DialogContent>
                </Dialog>
            </div>
        );
    }
}


export default Billing