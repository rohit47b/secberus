import React from 'react';
import { Route, Switch } from 'react-router-dom';

import SignUp from './main'
import Verify from './verify'
import Resent from './resentMail'

 export function SignupRoute(url){
    return (
       
        <Switch>
            <Route exact path={`${url}`} component={SignUp} />
            <Route exact path={`${url}/verify`} component={Verify} />
            <Route exact path={`${url}/resent`} component={Resent} />
        </Switch>
    )
};