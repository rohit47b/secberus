import React, { PureComponent } from 'react'
import Grid from '@material-ui/core/Grid'
import { CardWithTitle } from 'hoc/CardWithTitle'
import SpendHistory from './spendHistory'
import Investigate from './investigate'

class BillingAnalysis extends PureComponent {
    render() {
        return (
            <CardWithTitle title={<h3 className="card-heading">Billing Analysis</h3>} bgImageClass={"card-inner"}>
                <Grid container spacing={16}>
                    <Grid item md={12}>
                        <SpendHistory/>
                    </Grid>
                    <Grid item md={12}>
                        <Investigate/>
                    </Grid>
                </Grid>
            </CardWithTitle>
        )
    }
}

export default BillingAnalysis