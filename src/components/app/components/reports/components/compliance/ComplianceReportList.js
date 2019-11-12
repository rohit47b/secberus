import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import React, { PureComponent } from 'react';

class ComplianceReportList extends PureComponent {
    /* controlList: [
        { control_id: "001", desc: "Install and maintain a firewall configuration", status: "Fail", failed: 3, passed: 66, total_count: 69, on_date_status: 12, projection: 12 },
        { control_id: "002", desc: "Do not user vendor-supplied default passwords", status: "Fail", failed: 14, passed: 66, total_count: 92, on_date_status: 12, projection: 12 },
        { control_id: "003", desc: "Protect stored cardholder data", status: "Fail", failed: 84, passed: 66, total_count: 100, on_date_status: 12, projection: 12 },
        { control_id: "004", desc: "Develop and maintain secure system and application", status: "Fail", failed: 40, passed: 66, total_count: 55, on_date_status: 12, projection: 12 },
        { control_id: "005", desc: "Identify amd authenticate data by business need to know", status: "Pass", failed: 0, passed: 0, total_count: 45, on_date_status: 12, projection: 12 },
    ] */
    render() {
        const {compliance_name, controlList}=this.props
        return (
            <div className="table-responsive">
            <Table className="table-report">
                <TableHead>
                    <TableRow>
                        <TableCell component="th">Control ID</TableCell>
                        <TableCell component="th">{compliance_name} Controls </TableCell>
                        <TableCell component="th">Status</TableCell>
                        <TableCell component="th">Failed / Total Assets</TableCell>
                        {/* <TableCell component="th">07/23/19</TableCell>
                        <TableCell component="th">Projection</TableCell> */}
                    </TableRow>
                </TableHead>
                <TableBody>

                    {
                        controlList.map(control => {
                            return <TableRow key={control.name}>
                                <TableCell> <a href="javascript:void(0)" onClick={()=>this.props.selectControl(control)}>{control.identifier}</a></TableCell>
                                <TableCell>{control.description}</TableCell>
                                <TableCell>
                                    {(control.asset_failed_count > 0 || control.asset_in_remediation_count > 0) ? <span className="text-danger">FAIL</span> : <span className="text-success">PASSED</span>}
                                </TableCell>
                                <TableCell>
                                    <span> <span className="text-danger">{control.asset_failed_count}</span> / {control.asset_total_count}</span>
                                </TableCell>
                                {/* <TableCell>
                                    <span className="chip chip-success">{control.on_date_status} <i className="fa fa-arrow-down" aria-hidden="true"></i></span>
                                </TableCell>
                                <TableCell>
                                    <span className="chip chip-success">{control.projection} <i className="fa fa-arrow-down" aria-hidden="true"></i></span>
                                </TableCell> */}
                            </TableRow>
                        })
                    }
                </TableBody>
            </Table>
            </div>

        )
    }
}





export default ComplianceReportList