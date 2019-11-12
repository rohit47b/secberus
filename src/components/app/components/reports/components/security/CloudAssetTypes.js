/*
 * @Author: Virendra Patidar 
 * @Date: 2018-11-16 14:55:42 
 * @Last Modified by: Virendra Patidar
 * @Last Modified time: 2019-05-28 14:29:04
 */
import { BarChart } from 'react-d3-components'
import Paper from '@material-ui/core/Paper'
import React, { PureComponent } from 'react'
import Typography from '@material-ui/core/Typography'
import { fetchServiceIconPath } from 'utils/serviceIcon'

class CloudAssetTypes extends PureComponent {

    render() {
        const { asset_summary } = this.props
        return (
            <Paper elevation={1} className="paper-box pdT15">
                <Typography className="mrB15 report-title text-center heading-h4" component="h4">
                <strong>Cloud Asset Types</strong>
                </Typography>
                <div className="cloud-services-box">
                    {
                        asset_summary.map((asset, index) => {
                            return <div className="asset-type" key={asset.type}>
                                <div className="assets-service-icon assets-type-report">
                                    <p>
                                        <span><img alt={asset.type.toUpperCase()} title ={asset.type.toUpperCase()} src={fetchServiceIconPath(asset.type.split("_")[0])}/></span>
                                    </p>
                                    <p>
                                        <span>{asset.type.charAt(0).toUpperCase()+asset.type.slice(1).toLowerCase().replace(/_/g, ' ')}</span>
                                    </p>
                                </div>
                                <span className="assets-type-count">{asset.count}
                        <span className="chip chip-success">{asset.count_change}<i className="fa fa-arrow-up" aria-hidden="true"></i></span>
                                </span>
                            </div>
                        })
                    }
                </div>
            </Paper>
        )
    }
}


export default CloudAssetTypes