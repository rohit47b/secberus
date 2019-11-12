/*
 * @Author: Virendra Patidar 
 * @Date: 2018-11-16 15:28:34 
 * @Last Modified by:   Virendra Patidar 
 * @Last Modified time: 2018-11-16 15:28:34 
 */
import React from 'react'
import { Elements } from 'react-stripe-elements'

import InjectedCheckoutForm from './CheckoutForm'

class MyStoreCheckout extends React.Component {
    
    render() {
        return (
            <Elements>
                <InjectedCheckoutForm />
            </Elements>
        );
    }
}

export default MyStoreCheckout;