/*
 * @Author: Virendra Patidar 
 * @Date: 2018-11-16 14:58:33 
 * @Last Modified by:   Virendra Patidar 
 * @Last Modified time: 2018-11-16 14:58:33 
 */
import React, { PureComponent } from 'react'

import { StripeProvider } from 'react-stripe-elements'
import { Elements } from 'react-stripe-elements'

import InjectedCheckoutForm from './CheckoutForm'

class Payment extends PureComponent {
    
    render() {
        return (
            <StripeProvider apiKey="pk_live_ffG2NLMWhEEAlbUS1fDWmeUy">
                <Elements>
                    <InjectedCheckoutForm data={this.props.data} />
                </Elements>
            </StripeProvider>
        )
    }
}
export default Payment;
