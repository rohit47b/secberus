/*
 * @Author: Virendra Patidar 
 * @Date: 2018-09-27 09:03:40 
 * @Last Modified by: Virendra Patidar
 * @Last Modified time: 2019-03-01 17:42:57
 */

import React, { PureComponent } from 'react';
import Grid from '@material-ui/core/Grid'

import { CardWithTitle } from 'hoc/CardWithTitle'

import Alert from './Alert'
import AssestResult from './AssestResult'
import RiskScore from './RiskScore';

class Security extends PureComponent {

    render() {
        return (
            <CardWithTitle title={"Security"} bgImageClass={"card-security mrB10"}>
                    <Alert />
                    <Grid container spacing={24}>
                        <Grid item xs={12} md={6}>
                            <AssestResult />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <RiskScore />
                        </Grid>
                    </Grid>
            </CardWithTitle>
        );
    }
}

export default Security