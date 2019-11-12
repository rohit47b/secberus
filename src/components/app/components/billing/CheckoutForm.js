/*
 * @Author: Virendra Patidar 
 * @Date: 2018-10-30 11:36:59 
 * @Last Modified by: Virendra Patidar
 * @Last Modified time: 2018-11-16 15:28:10
 */
import React from 'react'

import {
  CardNumberElement,
  CardExpiryElement,
  CardCVCElement,
  injectStripe,
} from 'react-stripe-elements'

import history from 'customHistory'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import * as subscriptionsActions from 'actions/subscriptionsAction'
import { showMessage } from 'actions/messageAction'
import { setProgressBar } from 'actions/commonAction'

import SnackbarMessage from 'global/SnackbarMessage'
import Loader from 'global/Loader'

const createOptions = (fontSize, padding) => {
  return {
    style: {
      base: {
        fontSize,
        color: '#424770',
        letterSpacing: '0.025em',
        fontFamily: 'Source Code Pro, monospace',
        '::placeholder': {
          color: '#aab7c4',
        },
        ...(padding ? { padding } : {}),
      },
      invalid: {
        color: '#9e2146',
      },
    },
  };
};


class CheckoutForm extends React.Component {

  state = {
    name: '',
    errorMessage: '',
    isProgress: false,

    message: '',
    variant: 'info',
    showSnackbarState: false
  }

  nameChange = (event) => {
    this.setState({ name: event.target.value })
  }

  handleSubmit = (ev) => {
    this.setState({ errorMessage: '', isProgress: true, showSnackbarState: false })
    ev.preventDefault();
    if (this.props.stripe) {
      this.props.stripe
        .createToken({ name: this.state.name })
        .then((payload) => {
          if (payload.error) {
            console.log('[error] at strip token generate ', payload.error.message)
            this.setState({ errorMessage: payload.error.message, isProgress: false })
          } else {
            this.subscribePlan(payload)
          }
        });
    } else {
      console.log("Stripe.js hasn't loaded yet.");
    }
  };

  subscribePlan = (payload) => {

    let reqPayload = {
      token: payload.token.id,
      plan_id: this.props.data.planId,
      company_id: localStorage.getItem('companyId'),
      account_id: this.props.filterData.selectAccount.id,
      plan_name: this.props.data.planName,
      account_name: this.props.filterData.selectAccount.account_name,
      cloud: this.props.filterData.selectCloud.id,
    }

    this.props.actions.subscriptionsPlan(reqPayload).
      then(result => {
        if (result.success) {
          this.setState({ isProgress: false })
          const message = { message: this.props.data.planName + ' Plan Subscribed successfully', showSnackbarState: true, variant: 'success' }
          this.props.showMessage(message)
          localStorage.setItem("isExpired", false)

          const trailData = { isPurchased: true, trailPeriodRemainigDays: 0 }
          this.props.actions.setTrailPeriodData(trailData);

          history.push({
            pathname: '/app/billing',
            state: {}
          })
          window.location.reload()
        } else {
          this.setState({ isProgress: false })
          this.setState({ message: result, showSnackbarState: true, variant: 'error' })
        }
      });
  }

  handleClose = () => {
    this.setState({ message: '', showSnackbarState: false });
  }

  render() {
    const { errorMessage, isProgress, variant, message, showSnackbarState } = this.state
    return (
      <div>
        <form className="checkout-form" name="payment" onSubmit={this.handleSubmit}>
          {isProgress && <Loader />}
          <div className="validation-error mrB5">
            {errorMessage}
          </div>

          <div className="u-name">
            <input name="user-name" type="text" placeholder="Name" required onChange={this.nameChange} />
          </div>
          <div className="u-email">
            <input name="email" type="email" placeholder="Email" required />
          </div>

          <label>
            <CardNumberElement
              {...createOptions(this.props.fontSize)}
              className="card-no"
            />
          </label>

          <label >
            <CardExpiryElement
              {...createOptions(this.props.fontSize)}
              className="card-expiry"
            />
          </label>

          <label>
            <CardCVCElement
              {...createOptions(this.props.fontSize)}
              className="card-cvc"
            />
          </label>
          
          <button className="btn btn-primary">Subscribe</button>

        </form>

        <SnackbarMessage
          open={showSnackbarState}
          message={message}
          variant={variant}
          handleClose={this.handleClose}
        />
      </div>
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
})
const CheckoutFormWithStripe = injectStripe(CheckoutForm)

export default withRouter((connect(mapStateToProps, mapDispatchToProps)(CheckoutFormWithStripe)));
