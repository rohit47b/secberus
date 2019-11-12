import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';



class ComplianceReportSubList extends PureComponent {
    render() {
        return (
            <div className="table-box">
            <Table className="table-report">
                <TableHead>
                    <TableRow>
                        <TableCell component="th">Control ID</TableCell>
                        <TableCell component="th">PCI Controls </TableCell>
                        <TableCell component="th">Failed / Total Rules</TableCell>
                        <TableCell component="th">Failed / Total Assets</TableCell>
                        {/* <TableCell component="th">07/23/19</TableCell>
                        <TableCell component="th">Projection</TableCell> */}
                    </TableRow>
                </TableHead>
                <TableBody>
                    <TableRow>
                        <TableCell>ID1</TableCell>
                        <TableCell>Install and maintain a firewall configuration</TableCell>
                        <TableCell>
                            <span> <span className="text-danger">6</span> / 6</span>
                        </TableCell>
                        <TableCell>
                            <span> <span className="text-danger">3</span> / 69</span>
                        </TableCell>
                        {/* <TableCell>
                            <span className="chip chip-success">12 <i className="fa fa-arrow-down" aria-hidden="true"></i></span>
                        </TableCell>
                        <TableCell>
                            <span className="chip chip-success">12 <i className="fa fa-arrow-down" aria-hidden="true"></i></span>
                        </TableCell> */}
                    </TableRow>
                    <TableRow>
                        <TableCell colSpan="6">
                            <Table className="table-report mrB20">
                                <TableHead>
                                    <TableRow style={{ backgroundColor: "#E1E6EE" }}>
                                        <TableCell component="th">Rule ID</TableCell>
                                        <TableCell component="th">Rule Name </TableCell>
                                        <TableCell component="th">Status</TableCell>
                                        <TableCell component="th">Failed / Total Assets</TableCell>
                                        {/* <TableCell component="th">07/23/19</TableCell>
                                        <TableCell component="th">Projection</TableCell> */}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <TableRow>
                                        <TableCell>ID1</TableCell>
                                        <TableCell>Lorem Ipsum</TableCell>
                                        <TableCell>
                                            <span className="text-danger">Fail</span>
                                        </TableCell>
                                        <TableCell>
                                            <span> <span className="text-danger">4</span> / 69</span>
                                        </TableCell>
                                        {/* <TableCell>
                                            <span className="chip chip-success">12 <i className="fa fa-arrow-down" aria-hidden="true"></i></span>
                                        </TableCell>
                                        <TableCell>
                                            <span className="chip chip-success">12 <i className="fa fa-arrow-down" aria-hidden="true"></i></span>
                                        </TableCell> */}
                                    </TableRow>
                                    <TableRow>
                                        <TableCell colSpan="6">
                                            <Table className="table-report mrB20">
                                                <TableHead>
                                                    <TableRow style={{ backgroundColor: "#f7f7f7" }}>
                                                        <TableCell component="th">Type</TableCell>
                                                        <TableCell component="th">Name </TableCell>
                                                        <TableCell component="th" style={{ borderRight: "1px solid #ddd" }}>Status</TableCell>
                                                        <TableCell component="th" >Type</TableCell>
                                                        <TableCell component="th">Name </TableCell>
                                                        <TableCell component="th" style={{ borderRight: "1px solid #ddd" }}>Status</TableCell>
                                                        <TableCell component="th">Type</TableCell>
                                                        <TableCell component="th">Name </TableCell>
                                                        <TableCell component="th">Status</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    <TableRow>
                                                        <TableCell>S3 Bucket</TableCell>
                                                        <TableCell>S3BucketName01</TableCell>
                                                        <TableCell style={{ borderRight: "1px solid #ddd" }}>
                                                            <span className="text-danger">Failed</span>
                                                        </TableCell>
                                                        <TableCell>S3 Bucket</TableCell>
                                                        <TableCell>S3BucketName01</TableCell>
                                                        <TableCell style={{ borderRight: "1px solid #ddd" }}>
                                                            <span className="text-primary">In Remediation</span>
                                                        </TableCell>
                                                        <TableCell>S3 Bucket</TableCell>
                                                        <TableCell>S3BucketName01</TableCell>
                                                        <TableCell>
                                                            <span className="text-success">Passed</span>
                                                        </TableCell>
                                                    </TableRow>
                                                    <TableRow>
                                                        <TableCell>S3 Bucket</TableCell>
                                                        <TableCell>S3BucketName01</TableCell>
                                                        <TableCell style={{ borderRight: "1px solid #ddd" }}>
                                                            <span className="text-danger">Failed</span>
                                                        </TableCell>
                                                        <TableCell>S3 Bucket</TableCell>
                                                        <TableCell>S3BucketName01</TableCell>
                                                        <TableCell style={{ borderRight: "1px solid #ddd" }}>
                                                            <span className="text-primary">In Remediation</span>
                                                        </TableCell>
                                                        <TableCell>S3 Bucket</TableCell>
                                                        <TableCell>S3BucketName01</TableCell>
                                                        <TableCell>
                                                            <span className="text-success">Passed</span>
                                                        </TableCell>
                                                    </TableRow>
                                                    <TableRow>
                                                        <TableCell>S3 Bucket</TableCell>
                                                        <TableCell>S3BucketName01</TableCell>
                                                        <TableCell style={{ borderRight: "1px solid #ddd" }}>
                                                            <span className="text-danger">Failed</span>
                                                        </TableCell>
                                                        <TableCell>S3 Bucket</TableCell>
                                                        <TableCell>S3BucketName01</TableCell>
                                                        <TableCell style={{ borderRight: "1px solid #ddd" }}>
                                                            <span className="text-primary">In Remediation</span>
                                                        </TableCell>
                                                        <TableCell>S3 Bucket</TableCell>
                                                        <TableCell>S3BucketName01</TableCell>
                                                        <TableCell>
                                                            <span className="text-success">Passed</span>
                                                        </TableCell>
                                                    </TableRow>
                                                </TableBody>
                                            </Table>
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
            </div>
        )
    }
}





export default ComplianceReportSubList