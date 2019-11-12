/*
 * @Author: Virendra Patidar 
 * @Date: 2018-11-16 14:55:42 
 * @Last Modified by: Virendra Patidar
 * @Last Modified time: 2019-05-28 15:28:29
 */
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import AppConfig from 'constants/Config';
import LabelWithHelper from 'hoc/Label/LabelWithHelper';
import React, { PureComponent } from 'react';
class AccountType extends PureComponent {

    render() {
        const { cloud_account } = this.props
        return (
            <Paper elevation={1} className="paper-box text-center paper-report">
                <LabelWithHelper message={"Account Type"} content={"Lorem Ipsum"} />
                <Typography className="mrB20 report-title heading-h4" component="h4">
                    Account Type
                </Typography>
                <div className="report-content d-flex align-item-center justify-content-center">
                    {cloud_account.cloud && <img alt={cloud_account.cloud.toUpperCase()} src={AppConfig.cloudStaticData[cloud_account.cloud] ? AppConfig.cloudStaticData[cloud_account.cloud].cloudIconPath : '/assets/images/aws.png'}/>}
                </div>
            </Paper>
        )
    }
}


export default AccountType