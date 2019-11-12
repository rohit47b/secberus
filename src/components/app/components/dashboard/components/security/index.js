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
import Remediation from './Remediation'
import PriorityFilter from './PriorityFilter'
import RiskScore from './RiskScore';

class Security extends PureComponent {

    render() {
        return (
            <CardWithTitle title={"Security"} bgImageClass={"card-security"}>
                <div className="pdLR-30 pdT30">
                    <Alert />
                    <Grid container spacing={24} className="mrB20">
                        <Grid item xs={12} md={6}>
                            <Remediation />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <RiskScore />
                        </Grid>
                    </Grid>
                </div>
                <PriorityFilter />
            </CardWithTitle>
        );
    }
}

export default Security