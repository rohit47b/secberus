/*
 * @Author: Virendra Patidar 
 * @Date: 2018-11-16 14:55:42 
 * @Last Modified by: Virendra Patidar
 * @Last Modified time: 2019-04-23 16:21:27
 */
import { BarChart } from 'react-d3-components'
import Paper from '@material-ui/core/Paper'
import React, { PureComponent } from 'react'
import Typography from '@material-ui/core/Typography'
import LabelWithHelper from 'hoc/Label/LabelWithHelper'

class CloudAccount extends PureComponent {

    render() {
        return (
            <Paper elevation={1} className="paper-box text-center paper-report">
                <LabelWithHelper message={"Cloud Accounts"}  content={"This is the number of Cloud Accounts that Secberus monitors for your Organization."} />
                <Typography className="mrB20 report-title heading-h4" component="h4">
                    Cloud Accounts
                </Typography>
                <div className="report-content d-flex align-item-center justify-content-center">
                    <div className="cloud-services">
                        <div className="cloud-img">
                            <img alt="Slack" src="/assets/images/slack.png" />
                        </div>
                        <div className="cloud-count">0</div>
                    </div>
                    <div className="cloud-services">
                        <div className="cloud-img">
                            <img alt="AWS" src="/assets/images/aws.png" />
                        </div>
                        <div className="cloud-count">3</div>
                    </div>
                    <div className="cloud-services">
                        <div className="cloud-img">
                            <img alt="Security" src="/assets/images/security-training.png" />
                        </div>
                        <div className="cloud-count">0</div>
                    </div>
                </div>
            </Paper>
        )
    }
}


export default CloudAccount