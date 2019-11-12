/*
 * @Author: Virendra Patidar 
 * @Date: 2018-11-16 14:55:42 
 * @Last Modified by: Virendra Patidar
 * @Last Modified time: 2019-03-12 10:21:08
 */
import { BarChart } from 'react-d3-components'
import Paper from '@material-ui/core/Paper'
import React, { PureComponent } from 'react'
import Typography from '@material-ui/core/Typography'
import LabelWithHelper from 'hoc/Label/LabelWithHelper'

class CloudAssets extends PureComponent {

    render() {
        return (
            <Paper elevation={1} className="paper-box text-center paper-report">
                <LabelWithHelper message={"Cloud Assets"}  content={"This is the total number of Cloud Assets monitored by Secberus across your Cloud Accounts."} />
                <Typography className="mrB20 report-title heading-h4" component="h4">
                    Cloud Assets
                </Typography>
                <div className="report-content d-flex align-item-center justify-content-center">
                    <Typography className="mrB10 report-count heading-h3" component="h3">
                        363
            </Typography>
                </div>
            </Paper>
        )
    }
}


export default CloudAssets