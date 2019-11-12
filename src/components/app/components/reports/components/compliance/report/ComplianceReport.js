import React, { PureComponent } from 'react'
import Typography from '@material-ui/core/Typography'
import renderHTML from 'react-render-html';

class ComplianceReport extends PureComponent {
    render() {
        const template = (
            `<!DOCTYPE html>
            <html lang="en">
            
            <head>
                <title>Secberus</title>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1">
                <link href='https://fonts.googleapis.com/css?family=Poppins' rel='stylesheet'>
                <!-- <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"> -->
            </head>
            <style>
                html,
                body{
                    height: 100%;
                }
            
                body {
                    margin: 0px;
                    padding: 0px;
                    font-family: 'Poppins';
                    font-size: 14px;
                }
                .pages {
                    width: 8.5in;
                    height: 11in;
                    margin: 0;
                    background-color: #fff;
                    padding: 24px;
                }
            
                table tr:nth-child(even) {
                    background-color: #fff;
                }
            
                table tr:nth-child(odd) {
                    background-color: #FBFAFF;
                }
            
                .page-footer {
                    position: absolute;
                    left: 0px;
                    right: 0px;
                    bottom: 0px;
                    margin-bottom: 20px;
                }
            
                @media print {
                    .pages {
                        page-break-after: always;
                        width: 8.5in;
                        height: 11in;
                        margin: 0.5in 0px;
                        padding: 0px;
                        -webkit-print-color-adjust: exact;
                    }
            
                    .page-footer {
                        position: fixed;
                        bottom: 0px;
                        width: 100%;
                        margin-bottom: 0px;
                    }
            
                }
            </style>
            
            <body style="background-color:#eee" id="this-body">
                <!--Page 1-->
                <div class="pages page1" style="position:relative;">
                    <div style="display: flex;flex-wrap: wrap;box-sizing: border-box;">
                        <div
                            style="border-bottom:8px solid#5DBCD2;display: flex;width: 100%;padding-bottom: 20px;align-items: center;margin-bottom: 10px;">
                        </div>
                    </div>
                    <div
                        style="display: flex;flex-wrap: wrap;box-sizing: border-box;padding: 0 12px;height: 100%; align-items: center;justify-content: center;">
                        <div style="flex-grow: 0;max-width: 100%;;flex-basis: 100%;margin-bottom: 30px;text-align: center">
                            <div>
                                <img style="width: 450px;" src="/assets/images/report/secberus-logo.png" alt="Secberus Logo" />
                            </div>
                            <h1
                                style="margin: 10px 0px 30px;font-style: italic;font-size: 2.5em;text-transform: uppercase;padding-right: 5px;font-weight: 600;">
                                PCI COMPLIANCE REPORT</h1>
                            <div style="font-size: 24px;line-height: 35px;">
                                <code style="display: block"> < Company Name > </code>
                                <code style="display: block"> < Date > </code>
                                <code style="display: block"> < Time > </code>
                            </div>
                        </div>
                    </div>
                </div>
                  <!--Page 2-->
                <div class="pages page2" style="position:relative;">
                    <div style="display: flex;flex-wrap: wrap;box-sizing: border-box;margin-bottom: 50px;">
                        <div
                            style="border-bottom:8px solid#5DBCD2;display: flex;width: 100%;padding-bottom: 20px;align-items: center;margin-bottom: 10px;">
                            <span style="flex-grow: 1;"><img style="width: 320px;" src="/assets/images/report/secberus-logo.png"
                                    alt="Secberus Logo" /></span>
                            <h1 style="margin: 0px;font-style: italic;font-size: 2em;text-transform: uppercase;padding-right: 5px;">
                                PCI COMPLIANCE REPORT
                            </h1>
                        </div>
                        <div style="flex-grow: 0;max-width: 50%;;flex-basis: 50%">
                            <span style="display:block">
                                <span style="font-weight: 600;font-size:15px;">Customer Name:</span>
                                <span style="font-size:15px;"> <code> < Customer Name > </code> </span>
                            </span>
                            <span style="display:block">
                                <span style="font-weight: 600;font-size:15px;">Account Name:</span>
                                <span style="font-size:15px;"> All Accounts OVERVIEW </span>
                            </span>
            
                        </div>
                        <div style="flex-grow: 0;max-width: 50%;;flex-basis: 50%">
                            <span>
                                <span style="font-weight: 600;font-size:15px;">Date & Time:</span>
                                <span style="font-size:15px;"> <code> < MM/DD/YY , Hour:Minute:Seconds > </code> </span>
                            </span>
                        </div>
                    </div>
            
                    <div style="display: flex;flex-wrap: wrap;box-sizing: border-box;margin-bottom:30px ">
                        <div style="max-width: 28%;flex-basis: 28%;box-sizing: border-box;">
                            <div
                                style="border: 1px solid #000;min-height: 150px;display: flex;flex-direction: column;border-right: none">
                                <div
                                    style="font-size:16px;font-weight:600;color:#032B2F;text-align: center;margin-bottom: 15px;margin-top: 5px;">
                                    PCI
                                    Posture <span style="text-transform: uppercase">(Current)</span>
                                </div>
                                <div style="display:flex;align-items:center">
            
                                    <div>
                                        <svg width="80" height="70" viewBox="0 0 42 42" class="donut">
                                            <circle class="donut-hole" cx="21" cy="21" r="15.91549430918954" fill="#fff"></circle>
                                            <circle class="donut-ring" cx="21" cy="21" r="15.91549430918954" fill="transparent"
                                                stroke="#d2d3d4" stroke-width="3"></circle>
            
                                            <circle class="donut-segment" cx="21" cy="21" r="15.91549430918954" fill="transparent"
                                                stroke="#24BA4D" stroke-width="5" stroke-dasharray="85 15" stroke-dashoffset="25">
                                            </circle>
                                            <circle class="donut-segment" cx="21" cy="21" r="15.91549430918954" fill="transparent"
                                                stroke="#EC4E4E" stroke-width="5" stroke-dasharray="15 85" stroke-dashoffset="40">
                                            </circle>
                                            <text x="15" y="20" stroke="currentColor" font-size="7" fill="#3d3d3d">PCI</text>
                                            <text x="19" y="30" font-size="5" fill="#000000">
                                                06%
                                            </text>
                                            <g>
                                                <image x="14" y="26" xlink:href="/assets/images/report/arrow-down.svg" height="4" width="4"></image>
                                            </g>
                                        </svg>
                                    </div>
                                    <div style="line-height:20px">
                                        <div style="color:#19C681;font-size: 24px;font-weight: 600">95%</div>
                                        <div>
                                            <span style="font-size: 11px;padding-right: 2px;">
                                                <span style="color:#19C681;">70</span> Passed
                                            </span>
                                            |
                                            <span style="font-size: 11px;padding-left: 2px;">
                                                <span style="color:#EC4E4E;">4</span> Failed
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
            
                        <div style="max-width: 44%;flex-basis: 44%;box-sizing: border-box;">
                            <div style="border: 1px solid #000;min-height: 150px;display: flex;flex-direction: column;">
                                <div
                                    style="font-size:16px;font-weight:600;color:#032B2F;text-align: center;margin-bottom: 15px;margin-top: 5px;">
                                    Compliance Trend
                                </div>
                                <div class="area-chart" style="padding: 0 15px;">
                                    <img style="width:100%" src="/assets/images/report/linechart1.png">
                                </div>
                            </div>
                        </div>
            
                        <div style="max-width: 28%;flex-basis: 28%;box-sizing: border-box;">
                            <div
                                style="border: 1px solid #000;min-height: 150px;display: flex;flex-direction: column;border-left: none">
                                <div
                                    style="font-size:16px;font-weight:600;color:#032B2F;text-align: center;margin-bottom: 15px;margin-top: 5px;">
                                    PCI
                                    Posture <span style="text-transform: uppercase">(Projected)</span>
                                </div>
                                <div style="display:flex;align-items:center">
            
                                    <div>
                                        <svg width="80" height="70" viewBox="0 0 42 42" class="donut">
                                            <circle class="donut-hole" cx="21" cy="21" r="15.91549430918954" fill="#fff"></circle>
                                            <circle class="donut-ring" cx="21" cy="21" r="15.91549430918954" fill="transparent"
                                                stroke="#d2d3d4" stroke-width="3"></circle>
            
                                            <circle class="donut-segment" cx="21" cy="21" r="15.91549430918954" fill="transparent"
                                                stroke="#24BA4D" stroke-width="5" stroke-dasharray="85 15" stroke-dashoffset="25">
                                            </circle>
                                            <circle class="donut-segment" cx="21" cy="21" r="15.91549430918954" fill="transparent"
                                                stroke="#EC4E4E" stroke-width="5" stroke-dasharray="15 85" stroke-dashoffset="40">
                                            </circle>
                                            <text x="15" y="20" stroke="currentColor" font-size="7" fill="#3d3d3d">PCI</text>
                                            <text x="19" y="30" font-size="5" fill="#000000">
                                                06%
                                            </text>
                                            <g>
                                                <image x="14" y="26" xlink:href="/assets/images/report/arrow-down.svg" height="4" width="4"></image>
                                            </g>
                                        </svg>
                                    </div>
                                    <div style="line-height:20px">
                                        <div style="color:#19C681;font-size: 24px;font-weight: 600">95%</div>
                                        <div>
                                            <span style="font-size: 11px;padding-right: 2px;">
                                                <span style="color:#19C681;">70</span> Passed
                                            </span>
                                            |
                                            <span style="font-size: 11px;padding-left: 2px;">
                                                <span style="color:#EC4E4E;">4</span> Failed
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div style="font-size:12px;color:#032B2F;text-align: center">
                                    Remediation Plan in Progress : 3</div>
                            </div>
                        </div>
                        <div style="max-width: 100%;flex-basis: 100%;box-sizing: border-box;">
                            <h3 style="color:#032B2F;">Control - <span style="font-weight: normal">PCI</span></h3>
                            <table style="width:100%;border-collapse: collapse;">
                                <thead>
                                    <tr style="-webkit-print-color-adjust: exact;background-color: #e7f1f2;">
                                        <th style="padding:12px 8px;font-size: 13px;text-align: center;">
                                            Control
                                            ID
                                        </th>
                                        <th style="padding:12px 8px;font-size: 13px;text-align: left;">
                                            PCI
                                            Controls
                                        </th>
                                        <th style="padding:12px 8px;font-size: 13px;text-align: center;">
                                            Status</th>
                                        <th style="padding:12px 8px;font-size: 13px;text-align: center;">
                                            Failed
                                            / Total Assets</th>
                                        <th style="padding:12px 8px;font-size: 13px;text-align: center;">
                                            07/23/19</th>
                                        <th style="padding:12px 8px;font-size: 13px;text-align: center;">
                                            Projection</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td style="padding:12px 8px;font-size: 13px;text-align: center;">
                                            ID1</td>
                                        <td style="padding:8px;font-size: 12px;">
                                            Install and maintain a firewall configuration
                                        </td>
                                        <td style="padding:12px 8px;font-size: 13px;text-align: center;">
                                            <span style="color:#EC4E4E">Fail</span>
                                        </td>
                                        <td style="padding:12px 8px;font-size: 13px;text-align: center;">
                                            <span style="color:#EC4E4E">3</span>
                                            / 69
                                        </td>
                                        <td style="padding:12px 8px;font-size: 13px;text-align: center;">
                                            <span
                                                style="background-color:#DDF4E3;border-radius: 20px;padding: 5px 10px;font-size: 11px;">
                                                12 <img width="8" height="8" src="/assets/images/report/arrow-up.svg">
                                            </span>
                                        </td>
                                        <td style="padding:12px 8px;font-size: 13px;text-align: center;">
                                            <span
                                                style="background-color:#DDF4E3;border-radius: 20px;padding: 5px 10px;font-size: 11px;">
                                                12 <img width="8" height="8" src="/assets/images/report/arrow-up.svg">
                                            </span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding:12px 8px;font-size: 13px;text-align: center;">
                                            ID2</td>
                                        <td style="padding:12px 8px;font-size: 13px;">
                                            Do not use vendor-supplied default passwords
                                        </td>
                                        <td style="padding:12px 8px;font-size: 13px;text-align: center;">
                                            <span style="color:#EC4E4E">Fail</span>
                                        </td>
                                        <td style="padding:12px 8px;font-size: 13px;text-align: center;">
                                            <span style="color:#EC4E4E">14</span>
                                            / 92
                                        </td>
                                        <td style="padding:12px 8px;font-size: 13px;text-align: center;">
                                            <span
                                                style="background-color:#DDF4E3;border-radius: 20px;padding: 5px 10px;font-size: 11px;">
                                                12 <img width="8" height="8" src="/assets/images/report/arrow-up.svg">
                                            </span>
                                        </td>
                                        <td style="padding:12px 8px;font-size: 13px;text-align: center;">
                                            <span class="chip"
                                                style="background-color:#DDF4E3;border-radius: 20px;padding: 5px 10px;font-size: 11px;">
                                                12 <img width="8" height="8" src="/assets/images/report/arrow-up.svg">
                                            </span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding:12px 8px;font-size: 13px;text-align: center;">
                                            ID3</td>
                                        <td style="padding:12px 8px;font-size: 13px;">
                                            Protect stored cardholder data
                                        </td>
                                        <td style="padding:12px 8px;font-size: 13px;text-align: center;">
                                            <span style="color:#EC4E4E">Fail</span>
                                        </td>
                                        <td style="padding:12px 8px;font-size: 13px;text-align: center;">
                                            <span style="color:#EC4E4E">84</span>
                                            / 100
                                        </td>
                                        <td style="padding:12px 8px;font-size: 13px;text-align: center;">
                                            <span
                                                style="background-color:#DDF4E3;border-radius: 20px;padding: 5px 10px;font-size: 11px;">
                                                12 <img width="8" height="8" src="/assets/images/report/arrow-up.svg">
                                            </span>
                                        </td>
                                        <td style="padding:12px 8px;font-size: 13px;text-align: center;">
                                            <span class="chip"
                                                style="background-color:#DDF4E3;border-radius: 20px;padding: 5px 10px;font-size: 11px;">
                                                12 <img width="8" height="8" src="/assets/images/report/arrow-up.svg">
                                            </span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding:12px 8px;font-size: 13px;text-align: center;">
                                            ID4</td>
                                        <td style="padding:12px 8px;font-size: 13px;">
                                            Develop and maintain secure system and applications
                                        </td>
                                        <td style="padding:12px 8px;font-size: 13px;text-align: center;">
                                            <span style="color:#EC4E4E">Fail</span>
                                        </td>
                                        <td style="padding:12px 8px;font-size: 13px;text-align: center;">
                                            <span style="color:#EC4E4E">40</span>
                                            / 55
                                        </td>
                                        <td style="padding:12px 8px;font-size: 13px;text-align: center;">
                                            <span
                                                style="background-color:#DDF4E3;border-radius: 20px;padding: 5px 10px;font-size: 11px;">
                                                12 <img width="8" height="8" src="/assets/images/report/arrow-up.svg">
                                            </span>
                                        </td>
                                        <td style="padding:12px 8px;font-size: 13px;text-align: center;">
                                            <span class="chip"
                                                style="background-color:#DDF4E3;border-radius: 20px;padding: 5px 10px;font-size: 11px;">
                                                12 <img width="8" height="8" src="/assets/images/report/arrow-up.svg">
                                            </span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding:12px 8px;font-size: 13px;text-align: center;">
                                            ID5</td>
                                        <td style="padding:12px 8px;font-size: 13px;">
                                            Identify and authenticate data by business need to know
                                        </td>
                                        <td style="padding:12px 8px;font-size: 13px;text-align: center;">
                                            <span style="color:#19C681">pass</span>
                                        </td>
                                        <td style="padding:12px 8px;font-size: 13px;text-align: center;">
                                            <span style="color:#19C681">0</span>
                                            / 45
                                        </td>
                                        <td style="padding:12px 8px;font-size: 13px;text-align: center;">
                                            <span
                                                style="background-color:#DDF4E3;border-radius: 20px;padding: 5px 10px;font-size: 11px;">
                                                12 <img width="8" height="8" src="/assets/images/report/arrow-up.svg">
                                            </span>
                                        </td>
                                        <td style="padding:12px 8px;font-size: 13px;text-align: center;">
                                            <span
                                                style="background-color:#DDF4E3;border-radius: 20px;padding: 5px 10px;font-size: 11px;">
                                                12 <img width="8" height="8" src="/assets/images/report/arrow-up.svg">
                                            </span>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
              <!--Page 3-->
                <div class="pages page3" style="position:relative;">
                    <div style="display: flex;flex-wrap: wrap;box-sizing: border-box;margin-bottom: 50px;">
                        <div
                            style="border-bottom:8px solid#5DBCD2;display: flex;width: 100%;padding-bottom: 20px;align-items: center;margin-bottom: 10px;">
                            <span style="flex-grow: 1;"><img style="width: 320px;" src="/assets/images/report/secberus-logo.png"
                                    alt="Secberus Logo" /></span>
                            <h1 style="margin: 0px;font-style: italic;font-size: 2em;text-transform: uppercase;padding-right: 5px;">
                                PCI COMPLIANCE REPORT
                            </h1>
                        </div>
                        <div style="flex-grow: 0;max-width: 50%;;flex-basis: 50%">
                            <span style="display:block">
                                <span style="font-weight: 600;font-size:15px;">Customer Name:</span>
                                <span style="font-size:15px;"> <code> < Customer Name > </code> </span>
                            </span>
                            <span style="display:block">
                                <span style="font-weight: 600;font-size:15px;">Account Name:</span>
                                <span style="font-size:15px;"> All Accounts OVERVIEW </span>
                            </span>
            
                        </div>
                        <div style="flex-grow: 0;max-width: 50%;;flex-basis: 50%">
                            <span>
                                <span style="font-weight: 600;font-size:15px;">Date & Time:</span>
                                <span style="font-size:15px;"> <code> < MM/DD/YY , Hour:Minute:Seconds > </code> </span>
                            </span>
                        </div>
                    </div>
            
                    <div style="display: flex;flex-wrap: wrap;box-sizing: border-box;margin-bottom:30px ">
                        <div style="max-width: 25%;flex-basis: 25%;box-sizing: border-box;">
                            <div style="border: 1px solid #000;
                                min-height: 170px;
                                display: flex;
                                flex-direction: column;
                                justify-content: center;
                                padding: 10px 0px;
                                border-right: none;
                                border-bottom: none;
                                ">
                                <div style="font-size:16px;font-weight:600;color:#032B2F;text-align: center">
                                    Cloud Account<br>
                                    <div style="font-weight:normal">AWS-Production001</div>
                                </div>
                                <div style="display:flex;align-items:center;margin: 15px 0px;justify-content: center;">
                                    <div>
                                        <svg width="80" height="70" viewBox="0 0 42 42" class="donut">
                                            <circle class="donut-hole" cx="21" cy="21" r="15.91549430918954" fill="#fff"></circle>
                                            <circle class="donut-ring" cx="21" cy="21" r="15.91549430918954" fill="transparent"
                                                stroke="#d2d3d4" stroke-width="3"></circle>
            
                                            <circle class="donut-segment" cx="21" cy="21" r="15.91549430918954" fill="transparent"
                                                stroke="#24BA4D" stroke-width="5" stroke-dasharray="85 15" stroke-dashoffset="25">
                                            </circle>
                                            <circle class="donut-segment" cx="21" cy="21" r="15.91549430918954" fill="transparent"
                                                stroke="#EC4E4E" stroke-width="5" stroke-dasharray="15 85" stroke-dashoffset="40">
                                            </circle>
                                            <text x="15" y="20" stroke="currentColor" font-size="7" fill="#3d3d3d">PCI</text>
                                            <text x="19" y="30" font-size="5" fill="#000000">
                                                06%
                                            </text>
                                            <g>
                                                <image x="14" y="26" xlink:href="/assets/images/report/arrow-down.svg" height="4" width="4"></image>
                                            </g>
                                        </svg>
                                    </div>
                                    <div style="line-height:20px;">
                                        <div style="color:#19C681;font-size: 24px;font-weight: 600">95%</div>
                                        <div>
                                            <span style="font-size: 11px;padding-right: 2px;">
                                                <span style="color:#19C681;">70</span> Passed
                                            </span>
                                            |
                                            <span style="font-size: 11px;padding-left: 2px;">
                                                <span style="color:#EC4E4E;">4</span> Failed
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div style="font-size:14px;color:#032B2F;text-align: center">
                                    Projection :
                                    <span style="background-color:#DDF4E3;border-radius: 20px;padding: 5px 10px;font-size: 12px;">
                                        02 <img width="8" height="8" src="/assets/images/report/arrow-up.svg">
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div style="max-width: 25%;flex-basis: 25%;box-sizing: border-box;">
                            <div style="border: 1px solid #000;
                                min-height: 170px;
                                display: flex;
                                flex-direction: column;
                                justify-content: center;
                                padding: 10px 0px;
                                border-right: none;
                                border-bottom: none;
                                ">
                                <div style="font-size:16px;font-weight:600;color:#032B2F;text-align: center">
                                    Cloud Account<br>
                                    <div style="font-weight:normal">AWS-Staging001</div>
                                </div>
                                <div style="display:flex;align-items:center;margin: 15px 0px;justify-content: center;">
                                    <div>
                                        <svg width="80" height="70" viewBox="0 0 42 42" class="donut">
                                            <circle class="donut-hole" cx="21" cy="21" r="15.91549430918954" fill="#fff"></circle>
                                            <circle class="donut-ring" cx="21" cy="21" r="15.91549430918954" fill="transparent"
                                                stroke="#d2d3d4" stroke-width="3"></circle>
            
                                            <circle class="donut-segment" cx="21" cy="21" r="15.91549430918954" fill="transparent"
                                                stroke="#24BA4D" stroke-width="5" stroke-dasharray="85 15" stroke-dashoffset="25">
                                            </circle>
                                            <circle class="donut-segment" cx="21" cy="21" r="15.91549430918954" fill="transparent"
                                                stroke="#EC4E4E" stroke-width="5" stroke-dasharray="15 85" stroke-dashoffset="40">
                                            </circle>
                                            <text x="15" y="20" stroke="currentColor" font-size="7" fill="#3d3d3d">PCI</text>
                                            <text x="19" y="30" font-size="5" fill="#000000">
                                                06%
                                            </text>
                                            <g>
                                                <image x="14" y="26" xlink:href="/assets/images/report/arrow-down.svg" height="4" width="4"></image>
                                            </g>
                                        </svg>
                                    </div>
                                    <div style="line-height:20px;">
                                        <div style="color:#19C681;font-size: 24px;font-weight: 600">95%</div>
                                        <div>
                                            <span style="font-size: 11px;padding-right: 2px;">
                                                <span style="color:#19C681;">70</span> Passed
                                            </span>
                                            |
                                            <span style="font-size: 11px;padding-left: 2px;">
                                                <span style="color:#EC4E4E;">4</span> Failed
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div style="font-size:14px;color:#032B2F;text-align: center">
                                    Projection :
                                    <span style="background-color:#DDF4E3;border-radius: 20px;padding: 5px 10px;font-size: 12px;">
                                        02 <img width="8" height="8" src="/assets/images/report/arrow-up.svg">
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div style="max-width: 25%;flex-basis: 25%;box-sizing: border-box;">
                            <div style="border: 1px solid #000;
                                min-height: 170px;
                                display: flex;
                                flex-direction: column;
                                justify-content: center;
                                padding: 10px 0px;
                                border-right: none;
                                border-bottom: none;
                                ">
                                <div style="font-size:16px;font-weight:600;color:#032B2F;text-align: center">
                                    Cloud Account<br>
                                    <div style="font-weight:normal">AWS-Development001</div>
                                </div>
                                <div style="display:flex;align-items:center;margin: 15px 0px;justify-content: center;">
                                    <div>
                                        <svg width="80" height="70" viewBox="0 0 42 42" class="donut">
                                            <circle class="donut-hole" cx="21" cy="21" r="15.91549430918954" fill="#fff"></circle>
                                            <circle class="donut-ring" cx="21" cy="21" r="15.91549430918954" fill="transparent"
                                                stroke="#d2d3d4" stroke-width="3"></circle>
            
                                            <circle class="donut-segment" cx="21" cy="21" r="15.91549430918954" fill="transparent"
                                                stroke="#24BA4D" stroke-width="5" stroke-dasharray="85 15" stroke-dashoffset="25">
                                            </circle>
                                            <circle class="donut-segment" cx="21" cy="21" r="15.91549430918954" fill="transparent"
                                                stroke="#EC4E4E" stroke-width="5" stroke-dasharray="15 85" stroke-dashoffset="40">
                                            </circle>
                                            <text x="15" y="20" stroke="currentColor" font-size="7" fill="#3d3d3d">PCI</text>
                                            <text x="19" y="30" font-size="5" fill="#000000">
                                                06%
                                            </text>
                                            <g>
                                                <image x="14" y="26" xlink:href="/assets/images/report/arrow-down.svg" height="4" width="4"></image>
                                            </g>
                                        </svg>
                                    </div>
                                    <div style="line-height:20px;">
                                        <div style="color:#19C681;font-size: 24px;font-weight: 600">95%</div>
                                        <div>
                                            <span style="font-size: 11px;padding-right: 2px;">
                                                <span style="color:#19C681;">70</span> Passed
                                            </span>
                                            |
                                            <span style="font-size: 11px;padding-left: 2px;">
                                                <span style="color:#EC4E4E;">4</span> Failed
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div style="font-size:14px;color:#032B2F;text-align: center">
                                    Projection :
                                    <span style="background-color:#DDF4E3;border-radius: 20px;padding: 5px 10px;font-size: 12px;">
                                        02 <img width="8" height="8" src="/assets/images/report/arrow-up.svg">
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div style="max-width: 25%;flex-basis: 25%;box-sizing: border-box;">
                            <div style="border: 1px solid #000;
                                min-height: 170px;
                                display: flex;
                                flex-direction: column;
                                justify-content: center;
                                padding: 10px 0px;
                                border-bottom: none;
                                ">
                                <div style="font-size:16px;font-weight:600;color:#032B2F;text-align: center">
                                    Cloud Account<br>
                                    <div style="font-weight:normal">AWS-Development002</div>
                                </div>
                                <div style="display:flex;align-items:center;margin: 15px 0px;justify-content: center;">
                                    <div>
                                        <svg width="80" height="70" viewBox="0 0 42 42" class="donut">
                                            <circle class="donut-hole" cx="21" cy="21" r="15.91549430918954" fill="#fff"></circle>
                                            <circle class="donut-ring" cx="21" cy="21" r="15.91549430918954" fill="transparent"
                                                stroke="#d2d3d4" stroke-width="3"></circle>
            
                                            <circle class="donut-segment" cx="21" cy="21" r="15.91549430918954" fill="transparent"
                                                stroke="#24BA4D" stroke-width="5" stroke-dasharray="85 15" stroke-dashoffset="25">
                                            </circle>
                                            <circle class="donut-segment" cx="21" cy="21" r="15.91549430918954" fill="transparent"
                                                stroke="#EC4E4E" stroke-width="5" stroke-dasharray="15 85" stroke-dashoffset="40">
                                            </circle>
                                            <text x="15" y="20" stroke="currentColor" font-size="7" fill="#3d3d3d">PCI</text>
                                            <text x="19" y="30" font-size="5" fill="#000000">
                                                06%
                                            </text>
                                            <g>
                                                <image x="14" y="26" xlink:href="/assets/images/report/arrow-down.svg" height="4" width="4"></image>
                                            </g>
                                        </svg>
                                    </div>
                                    <div style="line-height:20px;">
                                        <div style="color:#19C681;font-size: 24px;font-weight: 600">95%</div>
                                        <div>
                                            <span style="font-size: 11px;padding-right: 2px;">
                                                <span style="color:#19C681;">70</span> Passed
                                            </span>
                                            |
                                            <span style="font-size: 11px;padding-left: 2px;">
                                                <span style="color:#EC4E4E;">4</span> Failed
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div style="font-size:14px;color:#032B2F;text-align: center">
                                    Projection :
                                    <span style="background-color:#DDF4E3;border-radius: 20px;padding: 5px 10px;font-size: 12px;">
                                        02 <img width="8" height="8" src="/assets/images/report/arrow-up.svg">
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div style="max-width: 25%;flex-basis: 25%;box-sizing: border-box;">
                            <div style="border: 1px solid #000;
                                min-height: 170px;
                                display: flex;
                                flex-direction: column;
                                justify-content: center;
                                padding: 10px 0px;
                                border-right: none;
                                border-bottom: none;
                                ">
                                <div style="font-size:16px;font-weight:600;color:#032B2F;text-align: center">
                                    Cloud Account<br>
                                    <div style="font-weight:normal">AWS-Production002</div>
                                </div>
                                <div style="display:flex;align-items:center;margin: 15px 0px;justify-content: center;">
                                    <div>
                                        <svg width="80" height="70" viewBox="0 0 42 42" class="donut">
                                            <circle class="donut-hole" cx="21" cy="21" r="15.91549430918954" fill="#fff"></circle>
                                            <circle class="donut-ring" cx="21" cy="21" r="15.91549430918954" fill="transparent"
                                                stroke="#d2d3d4" stroke-width="3"></circle>
            
                                            <circle class="donut-segment" cx="21" cy="21" r="15.91549430918954" fill="transparent"
                                                stroke="#24BA4D" stroke-width="5" stroke-dasharray="85 15" stroke-dashoffset="25">
                                            </circle>
                                            <circle class="donut-segment" cx="21" cy="21" r="15.91549430918954" fill="transparent"
                                                stroke="#EC4E4E" stroke-width="5" stroke-dasharray="15 85" stroke-dashoffset="40">
                                            </circle>
                                            <text x="15" y="20" stroke="currentColor" font-size="7" fill="#3d3d3d">PCI</text>
                                            <text x="19" y="30" font-size="5" fill="#000000">
                                                06%
                                            </text>
                                            <g>
                                                <image x="14" y="26" xlink:href="/assets/images/report/arrow-down.svg" height="4" width="4"></image>
                                            </g>
                                        </svg>
                                    </div>
                                    <div style="line-height:20px;">
                                        <div style="color:#19C681;font-size: 24px;font-weight: 600">95%</div>
                                        <div>
                                            <span style="font-size: 11px;padding-right: 2px;">
                                                <span style="color:#19C681;">70</span> Passed
                                            </span>
                                            |
                                            <span style="font-size: 11px;padding-left: 2px;">
                                                <span style="color:#EC4E4E;">4</span> Failed
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div style="font-size:14px;color:#032B2F;text-align: center">
                                    Projection :
                                    <span style="background-color:#DDF4E3;border-radius: 20px;padding: 5px 10px;font-size: 12px;">
                                        02 <img width="8" height="8" src="/assets/images/report/arrow-up.svg">
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div style="max-width: 25%;flex-basis: 25%;box-sizing: border-box;">
                            <div style="border: 1px solid #000;
                                min-height: 170px;
                                display: flex;
                                flex-direction: column;
                                justify-content: center;
                                padding: 10px 0px;
                                border-right: none;
                                border-bottom: none;
                                ">
                                <div style="font-size:16px;font-weight:600;color:#032B2F;text-align: center">
                                    Cloud Account<br>
                                    <div style="font-weight:normal">AWS-Staging002</div>
                                </div>
                                <div style="display:flex;align-items:center;margin: 15px 0px;justify-content: center;">
                                    <div>
                                        <svg width="80" height="70" viewBox="0 0 42 42" class="donut">
                                            <circle class="donut-hole" cx="21" cy="21" r="15.91549430918954" fill="#fff"></circle>
                                            <circle class="donut-ring" cx="21" cy="21" r="15.91549430918954" fill="transparent"
                                                stroke="#d2d3d4" stroke-width="3"></circle>
            
                                            <circle class="donut-segment" cx="21" cy="21" r="15.91549430918954" fill="transparent"
                                                stroke="#24BA4D" stroke-width="5" stroke-dasharray="85 15" stroke-dashoffset="25">
                                            </circle>
                                            <circle class="donut-segment" cx="21" cy="21" r="15.91549430918954" fill="transparent"
                                                stroke="#EC4E4E" stroke-width="5" stroke-dasharray="15 85" stroke-dashoffset="40">
                                            </circle>
                                            <text x="15" y="20" stroke="currentColor" font-size="7" fill="#3d3d3d">PCI</text>
                                            <text x="19" y="30" font-size="5" fill="#000000">
                                                06%
                                            </text>
                                            <g>
                                                <image x="14" y="26" xlink:href="/assets/images/report/arrow-down.svg" height="4" width="4"></image>
                                            </g>
                                        </svg>
                                    </div>
                                    <div style="line-height:20px;">
                                        <div style="color:#19C681;font-size: 24px;font-weight: 600">95%</div>
                                        <div>
                                            <span style="font-size: 11px;padding-right: 2px;">
                                                <span style="color:#19C681;">70</span> Passed
                                            </span>
                                            |
                                            <span style="font-size: 11px;padding-left: 2px;">
                                                <span style="color:#EC4E4E;">4</span> Failed
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div style="font-size:14px;color:#032B2F;text-align: center">
                                    Projection :
                                    <span style="background-color:#DDF4E3;border-radius: 20px;padding: 5px 10px;font-size: 12px;">
                                        02 <img width="8" height="8" src="/assets/images/report/arrow-up.svg">
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div style="max-width: 25%;flex-basis: 25%;box-sizing: border-box;">
                            <div style="border: 1px solid #000;
                                min-height: 170px;
                                display: flex;
                                flex-direction: column;
                                justify-content: center;
                                padding: 10px 0px;
                                border-right: none;
                                border-bottom: none;
                                ">
                                <div style="font-size:16px;font-weight:600;color:#032B2F;text-align: center">
                                    Cloud Account<br>
                                    <div style="font-weight:normal">AWS-Development002</div>
                                </div>
                                <div style="display:flex;align-items:center;margin: 15px 0px;justify-content: center;">
                                    <div>
                                        <svg width="80" height="70" viewBox="0 0 42 42" class="donut">
                                            <circle class="donut-hole" cx="21" cy="21" r="15.91549430918954" fill="#fff"></circle>
                                            <circle class="donut-ring" cx="21" cy="21" r="15.91549430918954" fill="transparent"
                                                stroke="#d2d3d4" stroke-width="3"></circle>
            
                                            <circle class="donut-segment" cx="21" cy="21" r="15.91549430918954" fill="transparent"
                                                stroke="#24BA4D" stroke-width="5" stroke-dasharray="85 15" stroke-dashoffset="25">
                                            </circle>
                                            <circle class="donut-segment" cx="21" cy="21" r="15.91549430918954" fill="transparent"
                                                stroke="#EC4E4E" stroke-width="5" stroke-dasharray="15 85" stroke-dashoffset="40">
                                            </circle>
                                            <text x="15" y="20" stroke="currentColor" font-size="7" fill="#3d3d3d">PCI</text>
                                            <text x="19" y="30" font-size="5" fill="#000000">
                                                06%
                                            </text>
                                            <g>
                                                <image x="14" y="26" xlink:href="/assets/images/report/arrow-down.svg" height="4" width="4"></image>
                                            </g>
                                        </svg>
                                    </div>
                                    <div style="line-height:20px;">
                                        <div style="color:#19C681;font-size: 24px;font-weight: 600">95%</div>
                                        <div>
                                            <span style="font-size: 11px;padding-right: 2px;">
                                                <span style="color:#19C681;">70</span> Passed
                                            </span>
                                            |
                                            <span style="font-size: 11px;padding-left: 2px;">
                                                <span style="color:#EC4E4E;">4</span> Failed
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div style="font-size:14px;color:#032B2F;text-align: center">
                                    Projection :
                                    <span style="background-color:#DDF4E3;border-radius: 20px;padding: 5px 10px;font-size: 12px;">
                                        02 <img width="8" height="8" src="/assets/images/report/arrow-up.svg">
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div style="max-width: 25%;flex-basis: 25%;box-sizing: border-box;">
                            <div style="border: 1px solid #000;
                                min-height: 170px;
                                display: flex;
                                flex-direction: column;
                                justify-content: center;
                                padding: 10px 0px;
                                border-bottom: none;
                                ">
                                <div style="font-size:16px;font-weight:600;color:#032B2F;text-align: center">
                                    Cloud Account<br>
                                    <div style="font-weight:normal">AWS-Development003</div>
                                </div>
                                <div style="display:flex;align-items:center;margin: 15px 0px;justify-content: center;">
                                    <div>
                                        <svg width="80" height="70" viewBox="0 0 42 42" class="donut">
                                            <circle class="donut-hole" cx="21" cy="21" r="15.91549430918954" fill="#fff"></circle>
                                            <circle class="donut-ring" cx="21" cy="21" r="15.91549430918954" fill="transparent"
                                                stroke="#d2d3d4" stroke-width="3"></circle>
            
                                            <circle class="donut-segment" cx="21" cy="21" r="15.91549430918954" fill="transparent"
                                                stroke="#24BA4D" stroke-width="5" stroke-dasharray="85 15" stroke-dashoffset="25">
                                            </circle>
                                            <circle class="donut-segment" cx="21" cy="21" r="15.91549430918954" fill="transparent"
                                                stroke="#EC4E4E" stroke-width="5" stroke-dasharray="15 85" stroke-dashoffset="40">
                                            </circle>
                                            <text x="15" y="20" stroke="currentColor" font-size="7" fill="#3d3d3d">PCI</text>
                                            <text x="19" y="30" font-size="5" fill="#000000">
                                                06%
                                            </text>
                                            <g>
                                                <image x="14" y="26" xlink:href="/assets/images/report/arrow-down.svg" height="4" width="4"></image>
                                            </g>
                                        </svg>
                                    </div>
                                    <div style="line-height:20px;">
                                        <div style="color:#19C681;font-size: 24px;font-weight: 600">95%</div>
                                        <div>
                                            <span style="font-size: 11px;padding-right: 2px;">
                                                <span style="color:#19C681;">70</span> Passed
                                            </span>
                                            |
                                            <span style="font-size: 11px;padding-left: 2px;">
                                                <span style="color:#EC4E4E;">4</span> Failed
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div style="font-size:14px;color:#032B2F;text-align: center">
                                    Projection :
                                    <span style="background-color:#DDF4E3;border-radius: 20px;padding: 5px 10px;font-size: 12px;">
                                        02 <img width="8" height="8" src="/assets/images/report/arrow-up.svg">
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div style="max-width: 25%;flex-basis: 25%;box-sizing: border-box;">
                            <div style="border: 1px solid #000;
                                min-height: 170px;
                                display: flex;
                                flex-direction: column;
                                justify-content: center;
                                padding: 10px 0px;
                                border-right: none
                                ">
                                <div style="font-size:16px;font-weight:600;color:#032B2F;text-align: center">
                                    Cloud Account<br>
                                    <div style="font-weight:normal">AWS-Production003</div>
                                </div>
                                <div style="display:flex;align-items:center;margin: 15px 0px;justify-content: center;">
                                    <div>
                                        <svg width="80" height="70" viewBox="0 0 42 42" class="donut">
                                            <circle class="donut-hole" cx="21" cy="21" r="15.91549430918954" fill="#fff"></circle>
                                            <circle class="donut-ring" cx="21" cy="21" r="15.91549430918954" fill="transparent"
                                                stroke="#d2d3d4" stroke-width="3"></circle>
            
                                            <circle class="donut-segment" cx="21" cy="21" r="15.91549430918954" fill="transparent"
                                                stroke="#24BA4D" stroke-width="5" stroke-dasharray="85 15" stroke-dashoffset="25">
                                            </circle>
                                            <circle class="donut-segment" cx="21" cy="21" r="15.91549430918954" fill="transparent"
                                                stroke="#EC4E4E" stroke-width="5" stroke-dasharray="15 85" stroke-dashoffset="40">
                                            </circle>
                                            <text x="15" y="20" stroke="currentColor" font-size="7" fill="#3d3d3d">PCI</text>
                                            <text x="19" y="30" font-size="5" fill="#000000">
                                                06%
                                            </text>
                                            <g>
                                                <image x="14" y="26" xlink:href="/assets/images/report/arrow-down.svg" height="4" width="4"></image>
                                            </g>
                                        </svg>
                                    </div>
                                    <div style="line-height:20px;">
                                        <div style="color:#19C681;font-size: 24px;font-weight: 600">95%</div>
                                        <div>
                                            <span style="font-size: 11px;padding-right: 2px;">
                                                <span style="color:#19C681;">70</span> Passed
                                            </span>
                                            |
                                            <span style="font-size: 11px;padding-left: 2px;">
                                                <span style="color:#EC4E4E;">4</span> Failed
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div style="font-size:14px;color:#032B2F;text-align: center">
                                    Projection :
                                    <span style="background-color:#DDF4E3;border-radius: 20px;padding: 5px 10px;font-size: 12px;">
                                        02 <img width="8" height="8" src="/assets/images/report/arrow-up.svg">
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div style="max-width: 25%;flex-basis: 25%;box-sizing: border-box;">
                            <div style="border: 1px solid #000;
                                min-height: 170px;
                                display: flex;
                                flex-direction: column;
                                justify-content: center;
                                padding: 10px 0px;
                                border-right: none
                                ">
                                <div style="font-size:16px;font-weight:600;color:#032B2F;text-align: center">
                                    Cloud Account<br>
                                    <div style="font-weight:normal">AWS-Staging003</div>
                                </div>
                                <div style="display:flex;align-items:center;margin: 15px 0px;justify-content: center;">
                                    <div>
                                        <svg width="80" height="70" viewBox="0 0 42 42" class="donut">
                                            <circle class="donut-hole" cx="21" cy="21" r="15.91549430918954" fill="#fff"></circle>
                                            <circle class="donut-ring" cx="21" cy="21" r="15.91549430918954" fill="transparent"
                                                stroke="#d2d3d4" stroke-width="3"></circle>
            
                                            <circle class="donut-segment" cx="21" cy="21" r="15.91549430918954" fill="transparent"
                                                stroke="#24BA4D" stroke-width="5" stroke-dasharray="85 15" stroke-dashoffset="25">
                                            </circle>
                                            <circle class="donut-segment" cx="21" cy="21" r="15.91549430918954" fill="transparent"
                                                stroke="#EC4E4E" stroke-width="5" stroke-dasharray="15 85" stroke-dashoffset="40">
                                            </circle>
                                            <text x="15" y="20" stroke="currentColor" font-size="7" fill="#3d3d3d">PCI</text>
                                            <text x="19" y="30" font-size="5" fill="#000000">
                                                06%
                                            </text>
                                            <g>
                                                <image x="14" y="26" xlink:href="/assets/images/report/arrow-down.svg" height="4" width="4"></image>
                                            </g>
                                        </svg>
                                    </div>
                                    <div style="line-height:20px;">
                                        <div style="color:#19C681;font-size: 24px;font-weight: 600">95%</div>
                                        <div>
                                            <span style="font-size: 11px;padding-right: 2px;">
                                                <span style="color:#19C681;">70</span> Passed
                                            </span>
                                            |
                                            <span style="font-size: 11px;padding-left: 2px;">
                                                <span style="color:#EC4E4E;">4</span> Failed
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div style="font-size:14px;color:#032B2F;text-align: center">
                                    Projection :
                                    <span style="background-color:#DDF4E3;border-radius: 20px;padding: 5px 10px;font-size: 12px;">
                                        02 <img width="8" height="8" src="/assets/images/report/arrow-up.svg">
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div style="max-width: 25%;flex-basis: 25%;box-sizing: border-box;">
                            <div style="border: 1px solid #000;
                                min-height: 170px;
                                display: flex;
                                flex-direction: column;
                                justify-content: center;
                                padding: 10px 0px;
                                border-right: none
                                ">
                                <div style="font-size:16px;font-weight:600;color:#032B2F;text-align: center">
                                    Cloud Account<br>
                                    <div style="font-weight:normal">AWS-Development003</div>
                                </div>
                                <div style="display:flex;align-items:center;margin: 15px 0px;justify-content: center;">
                                    <div>
                                        <svg width="80" height="70" viewBox="0 0 42 42" class="donut">
                                            <circle class="donut-hole" cx="21" cy="21" r="15.91549430918954" fill="#fff"></circle>
                                            <circle class="donut-ring" cx="21" cy="21" r="15.91549430918954" fill="transparent"
                                                stroke="#d2d3d4" stroke-width="3"></circle>
            
                                            <circle class="donut-segment" cx="21" cy="21" r="15.91549430918954" fill="transparent"
                                                stroke="#24BA4D" stroke-width="5" stroke-dasharray="85 15" stroke-dashoffset="25">
                                            </circle>
                                            <circle class="donut-segment" cx="21" cy="21" r="15.91549430918954" fill="transparent"
                                                stroke="#EC4E4E" stroke-width="5" stroke-dasharray="15 85" stroke-dashoffset="40">
                                            </circle>
                                            <text x="15" y="20" stroke="currentColor" font-size="7" fill="#3d3d3d">PCI</text>
                                            <text x="19" y="30" font-size="5" fill="#000000">
                                                06%
                                            </text>
                                            <g>
                                                <image x="14" y="26" xlink:href="/assets/images/report/arrow-down.svg" height="4" width="4"></image>
                                            </g>
                                        </svg>
                                    </div>
                                    <div style="line-height:20px;">
                                        <div style="color:#19C681;font-size: 24px;font-weight: 600">95%</div>
                                        <div>
                                            <span style="font-size: 11px;padding-right: 2px;">
                                                <span style="color:#19C681;">70</span> Passed
                                            </span>
                                            |
                                            <span style="font-size: 11px;padding-left: 2px;">
                                                <span style="color:#EC4E4E;">4</span> Failed
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div style="font-size:14px;color:#032B2F;text-align: center">
                                    Projection :
                                    <span style="background-color:#DDF4E3;border-radius: 20px;padding: 5px 10px;font-size: 12px;">
                                        02 <img width="8" height="8" src="/assets/images/report/arrow-up.svg">
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div style="max-width: 25%;flex-basis: 25%;box-sizing: border-box;">
                            <div style="border: 1px solid #000;
                                min-height: 170px;
                                display: flex;
                                flex-direction: column;
                                justify-content: center;
                                padding: 10px 0px;
                                ">
                                <div style="font-size:16px;font-weight:600;color:#032B2F;text-align: center">
                                    Cloud Account<br>
                                    <div style="font-weight:normal">AWS-Development004</div>
                                </div>
                                <div style="display:flex;align-items:center;margin: 15px 0px;justify-content: center;">
                                    <div>
                                        <svg width="80" height="70" viewBox="0 0 42 42" class="donut">
                                            <circle class="donut-hole" cx="21" cy="21" r="15.91549430918954" fill="#fff"></circle>
                                            <circle class="donut-ring" cx="21" cy="21" r="15.91549430918954" fill="transparent"
                                                stroke="#d2d3d4" stroke-width="3"></circle>
            
                                            <circle class="donut-segment" cx="21" cy="21" r="15.91549430918954" fill="transparent"
                                                stroke="#24BA4D" stroke-width="5" stroke-dasharray="85 15" stroke-dashoffset="25">
                                            </circle>
                                            <circle class="donut-segment" cx="21" cy="21" r="15.91549430918954" fill="transparent"
                                                stroke="#EC4E4E" stroke-width="5" stroke-dasharray="15 85" stroke-dashoffset="40">
                                            </circle>
                                            <text x="15" y="20" stroke="currentColor" font-size="7" fill="#3d3d3d">PCI</text>
                                            <text x="19" y="30" font-size="5" fill="#000000">
                                                06%
                                            </text>
                                            <g>
                                                <image x="14" y="26" xlink:href="/assets/images/report/arrow-down.svg" height="4" width="4"></image>
                                            </g>
                                        </svg>
                                    </div>
                                    <div style="line-height:20px;">
                                        <div style="color:#19C681;font-size: 24px;font-weight: 600">95%</div>
                                        <div>
                                            <span style="font-size: 11px;padding-right: 2px;">
                                                <span style="color:#19C681;">70</span> Passed
                                            </span>
                                            |
                                            <span style="font-size: 11px;padding-left: 2px;">
                                                <span style="color:#EC4E4E;">4</span> Failed
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div style="font-size:14px;color:#032B2F;text-align: center">
                                    Projection :
                                    <span style="background-color:#DDF4E3;border-radius: 20px;padding: 5px 10px;font-size: 12px;">
                                        02 <img width="8" height="8" src="/assets/images/report/arrow-up.svg">
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                   <!--Page 4-->
                <div class="pages page4" style="position:relative;">
                    <div style="display: flex;flex-wrap: wrap;box-sizing: border-box;margin-bottom: 50px;">
                        <div
                            style="border-bottom:8px solid#5DBCD2;display: flex;width: 100%;padding-bottom: 20px;align-items: center;margin-bottom: 10px;">
                            <span style="flex-grow: 1;"><img style="width: 320px;" src="/assets/images/report/secberus-logo.png"
                                    alt="Secberus Logo" /></span>
                            <h1 style="margin: 0px;font-style: italic;font-size: 2em;text-transform: uppercase;padding-right: 5px;">
                                PCI COMPLIANCE REPORT
                            </h1>
                        </div>
                        <div style="flex-grow: 0;max-width: 50%;;flex-basis: 50%">
                            <span style="display:block">
                                <span style="font-weight: 600;font-size:15px;">Customer Name:</span>
                                <span style="font-size:15px;"> <code> < Customer Name > </code> </span>
                            </span>
                            <span style="display:block">
                                <span style="font-weight: 600;font-size:15px;">Account Name:</span>
                                <span style="font-size:15px;"> All Accounts OVERVIEW </span>
                            </span>
            
                        </div>
                        <div style="flex-grow: 0;max-width: 50%;;flex-basis: 50%">
                            <span>
                                <span style="font-weight: 600;font-size:15px;">Date & Time:</span>
                                <span style="font-size:15px;"> <code> < MM/DD/YY , Hour:Minute:Seconds > </code> </span>
                            </span>
                        </div>
                    </div>
            
                    <div style="display: flex;flex-wrap: wrap;box-sizing: border-box;margin-bottom:30px ">
                        <div style="max-width: 28%;flex-basis: 28%;box-sizing: border-box;">
                            <div
                                style="border: 1px solid #000;min-height: 150px;display: flex;flex-direction: column;border-right: none">
                                <div
                                    style="font-size:16px;font-weight:600;color:#032B2F;text-align: center;margin-bottom: 15px;margin-top: 5px;">
                                    PCI
                                    Posture <span style="text-transform: uppercase">(Current)</span>
                                </div>
                                <div style="display:flex;align-items:center">
            
                                    <div>
                                        <svg width="80" height="70" viewBox="0 0 42 42" class="donut">
                                            <circle class="donut-hole" cx="21" cy="21" r="15.91549430918954" fill="#fff"></circle>
                                            <circle class="donut-ring" cx="21" cy="21" r="15.91549430918954" fill="transparent"
                                                stroke="#d2d3d4" stroke-width="3"></circle>
            
                                            <circle class="donut-segment" cx="21" cy="21" r="15.91549430918954" fill="transparent"
                                                stroke="#24BA4D" stroke-width="5" stroke-dasharray="85 15" stroke-dashoffset="25">
                                            </circle>
                                            <circle class="donut-segment" cx="21" cy="21" r="15.91549430918954" fill="transparent"
                                                stroke="#EC4E4E" stroke-width="5" stroke-dasharray="15 85" stroke-dashoffset="40">
                                            </circle>
                                            <text x="15" y="20" stroke="currentColor" font-size="7" fill="#3d3d3d">PCI</text>
                                            <text x="19" y="30" font-size="5" fill="#000000">
                                                06%
                                            </text>
                                            <g>
                                                <image x="14" y="26" xlink:href="/assets/images/report/arrow-down.svg" height="4" width="4"></image>
                                            </g>
                                        </svg>
                                    </div>
                                    <div style="line-height:20px">
                                        <div style="color:#19C681;font-size: 24px;font-weight: 600">95%</div>
                                        <div>
                                            <span style="font-size: 11px;padding-right: 2px;">
                                                <span style="color:#19C681;">70</span> Passed
                                            </span>
                                            |
                                            <span style="font-size: 11px;padding-left: 2px;">
                                                <span style="color:#EC4E4E;">4</span> Failed
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
            
                        <div style="max-width: 44%;flex-basis: 44%;box-sizing: border-box;">
                            <div style="border: 1px solid #000;min-height: 150px;display: flex;flex-direction: column;">
                                <div
                                    style="font-size:16px;font-weight:600;color:#032B2F;text-align: center;margin-bottom: 15px;margin-top: 5px;">
                                    Compliance Trend
                                </div>
                                <div class="area-chart" style="padding: 0 15px;">
                                    <img style="width:100%" src="/assets/images/report/linechart1.png">
                                </div>
                            </div>
                        </div>
            
                        <div style="max-width: 28%;flex-basis: 28%;box-sizing: border-box;">
                            <div
                                style="border: 1px solid #000;min-height: 150px;display: flex;flex-direction: column;border-left: none">
                                <div
                                    style="font-size:16px;font-weight:600;color:#032B2F;text-align: center;margin-bottom: 15px;margin-top: 5px;">
                                    PCI
                                    Posture <span style="text-transform:uppercase">(Projected)</span>
                                </div>
                                <div style="display:flex;align-items:center">
            
                                    <div>
                                        <svg width="80" height="70" viewBox="0 0 42 42" class="donut">
                                            <circle class="donut-hole" cx="21" cy="21" r="15.91549430918954" fill="#fff"></circle>
                                            <circle class="donut-ring" cx="21" cy="21" r="15.91549430918954" fill="transparent"
                                                stroke="#d2d3d4" stroke-width="3"></circle>
            
                                            <circle class="donut-segment" cx="21" cy="21" r="15.91549430918954" fill="transparent"
                                                stroke="#24BA4D" stroke-width="5" stroke-dasharray="85 15" stroke-dashoffset="25">
                                            </circle>
                                            <circle class="donut-segment" cx="21" cy="21" r="15.91549430918954" fill="transparent"
                                                stroke="#EC4E4E" stroke-width="5" stroke-dasharray="15 85" stroke-dashoffset="40">
                                            </circle>
                                            <text x="15" y="20" stroke="currentColor" font-size="7" fill="#3d3d3d">PCI</text>
                                            <text x="19" y="30" font-size="5" fill="#000000">
                                                06%
                                            </text>
                                            <g>
                                                <image x="14" y="26" xlink:href="/assets/images/report/arrow-down.svg" height="4" width="4"></image>
                                            </g>
                                        </svg>
                                    </div>
                                    <div style="line-height:20px">
                                        <div style="color:#19C681;font-size: 24px;font-weight: 600">95%</div>
                                        <div>
                                            <span style="font-size: 11px;padding-right: 2px;">
                                                <span style="color:#19C681;">70</span> Passed
                                            </span>
                                            |
                                            <span style="font-size: 11px;padding-left: 2px;">
                                                <span style="color:#EC4E4E;">4</span> Failed
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div style="font-size:12px;color:#032B2F;text-align: center">
                                    Remediation Plan in Progress : 3</div>
                            </div>
                        </div>
                        <div style="max-width: 100%;flex-basis: 100%;box-sizing: border-box;">
                            <h3 style="color:#032B2F;">Control - <span style="font-weight: normal">PCI: AWS- Production001</span>
                            </h3>
                            <table style="width:100%;border-collapse: collapse;">
                                <thead>
                                    <tr style="-webkit-print-color-adjust: exact;background-color: #e7f1f2;">
                                        <th style="padding:12px 8px;font-size: 13px;text-align: center;">
                                            Control
                                            ID
                                        </th>
                                        <th style="padding:12px 8px;font-size: 13px;text-align: left;">
                                            PCI
                                            Controls
                                        </th>
                                        <th style="padding:12px 8px;font-size: 13px;text-align: center;">
                                            Status</th>
                                        <th style="padding:12px 8px;font-size: 13px;text-align: center;">
                                            Failed
                                            / Total Assets</th>
                                        <th style="padding:12px 8px;font-size: 13px;text-align: center;">
                                            07/23/19</th>
                                        <th style="padding:12px 8px;font-size: 13px;text-align: center;">
                                            Projection</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td style="padding:12px 8px;font-size: 13px;text-align: center;">
                                            ID1</td>
                                        <td style="padding:8px;font-size: 12px;">
                                            Install and maintain a firewall configuration
                                        </td>
                                        <td style="padding:12px 8px;font-size: 13px;text-align: center;">
                                            <span style="color:#EC4E4E">Fail</span>
                                        </td>
                                        <td style="padding:12px 8px;font-size: 13px;text-align: center;">
                                            <span style="color:#EC4E4E">3</span>
                                            / 69
                                        </td>
                                        <td style="padding:12px 8px;font-size: 13px;text-align: center;">
                                            <span
                                                style="background-color:#DDF4E3;border-radius: 20px;padding: 5px 10px;font-size: 11px;">
                                                12 <img width="8" height="8" src="/assets/images/report/arrow-up.svg">
                                            </span>
                                        </td>
                                        <td style="padding:12px 8px;font-size: 13px;text-align: center;">
                                            <span
                                                style="background-color:#DDF4E3;border-radius: 20px;padding: 5px 10px;font-size: 11px;">
                                                12 <img width="8" height="8" src="/assets/images/report/arrow-up.svg">
                                            </span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding:12px 8px;font-size: 13px;text-align: center;">
                                            ID2</td>
                                        <td style="padding:12px 8px;font-size: 13px;">
                                            Do not use vendor-supplied default passwords
                                        </td>
                                        <td style="padding:12px 8px;font-size: 13px;text-align: center;">
                                            <span style="color:#EC4E4E">Fail</span>
                                        </td>
                                        <td style="padding:12px 8px;font-size: 13px;text-align: center;">
                                            <span style="color:#EC4E4E">14</span>
                                            / 92
                                        </td>
                                        <td style="padding:12px 8px;font-size: 13px;text-align: center;">
                                            <span
                                                style="background-color:#DDF4E3;border-radius: 20px;padding: 5px 10px;font-size: 11px;">
                                                12 <img width="8" height="8" src="/assets/images/report/arrow-up.svg">
                                            </span>
                                        </td>
                                        <td style="padding:12px 8px;font-size: 13px;text-align: center;">
                                            <span class="chip"
                                                style="background-color:#DDF4E3;border-radius: 20px;padding: 5px 10px;font-size: 11px;">
                                                12 <img width="8" height="8" src="/assets/images/report/arrow-up.svg">
                                            </span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding:12px 8px;font-size: 13px;text-align: center;">
                                            ID3</td>
                                        <td style="padding:12px 8px;font-size: 13px;">
                                            Protect stored cardholder data
                                        </td>
                                        <td style="padding:12px 8px;font-size: 13px;text-align: center;">
                                            <span style="color:#EC4E4E">Fail</span>
                                        </td>
                                        <td style="padding:12px 8px;font-size: 13px;text-align: center;">
                                            <span style="color:#EC4E4E">84</span>
                                            / 100
                                        </td>
                                        <td style="padding:12px 8px;font-size: 13px;text-align: center;">
                                            <span
                                                style="background-color:#DDF4E3;border-radius: 20px;padding: 5px 10px;font-size: 11px;">
                                                12 <img width="8" height="8" src="/assets/images/report/arrow-up.svg">
                                            </span>
                                        </td>
                                        <td style="padding:12px 8px;font-size: 13px;text-align: center;">
                                            <span class="chip"
                                                style="background-color:#DDF4E3;border-radius: 20px;padding: 5px 10px;font-size: 11px;">
                                                12 <img width="8" height="8" src="/assets/images/report/arrow-up.svg">
                                            </span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding:12px 8px;font-size: 13px;text-align: center;">
                                            ID4</td>
                                        <td style="padding:12px 8px;font-size: 13px;">
                                            Develop and maintain secure system and applications
                                        </td>
                                        <td style="padding:12px 8px;font-size: 13px;text-align: center;">
                                            <span style="color:#EC4E4E">Fail</span>
                                        </td>
                                        <td style="padding:12px 8px;font-size: 13px;text-align: center;">
                                            <span style="color:#EC4E4E">40</span>
                                            / 55
                                        </td>
                                        <td style="padding:12px 8px;font-size: 13px;text-align: center;">
                                            <span
                                                style="background-color:#DDF4E3;border-radius: 20px;padding: 5px 10px;font-size: 11px;">
                                                12 <img width="8" height="8" src="/assets/images/report/arrow-up.svg">
                                            </span>
                                        </td>
                                        <td style="padding:12px 8px;font-size: 13px;text-align: center;">
                                            <span class="chip"
                                                style="background-color:#DDF4E3;border-radius: 20px;padding: 5px 10px;font-size: 11px;">
                                                12 <img width="8" height="8" src="/assets/images/report/arrow-up.svg">
                                            </span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding:12px 8px;font-size: 13px;text-align: center;">
                                            ID5</td>
                                        <td style="padding:12px 8px;font-size: 13px;">
                                            Identify and authenticate data by business need to know
                                        </td>
                                        <td style="padding:12px 8px;font-size: 13px;text-align: center;">
                                            <span style="color:#19C681">pass</span>
                                        </td>
                                        <td style="padding:12px 8px;font-size: 13px;text-align: center;">
                                            <span style="color:#19C681">0</span>
                                            / 45
                                        </td>
                                        <td style="padding:12px 8px;font-size: 13px;text-align: center;">
                                            <span
                                                style="background-color:#DDF4E3;border-radius: 20px;padding: 5px 10px;font-size: 11px;">
                                                12 <img width="8" height="8" src="/assets/images/report/arrow-up.svg">
                                            </span>
                                        </td>
                                        <td style="padding:12px 8px;font-size: 13px;text-align: center;">
                                            <span
                                                style="background-color:#DDF4E3;border-radius: 20px;padding: 5px 10px;font-size: 11px;">
                                                12 <img width="8" height="8" src="/assets/images/report/arrow-up.svg">
                                            </span>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                  <!--Page 5-->
                <div class="pages page5" style="position:relative;">
                    <div style="display: flex;flex-wrap: wrap;box-sizing: border-box;margin-bottom: 50px;">
                        <div
                            style="border-bottom:8px solid#5DBCD2;display: flex;width: 100%;padding-bottom: 20px;align-items: center;margin-bottom: 10px;">
                            <span style="flex-grow: 1;"><img style="width: 320px;" src="/assets/images/report/secberus-logo.png"
                                    alt="Secberus Logo" /></span>
                            <h1 style="margin: 0px;font-style: italic;font-size: 2em;text-transform: uppercase;padding-right: 5px;">
                                PCI COMPLIANCE REPORT
                            </h1>
                        </div>
                        <div style="flex-grow: 0;max-width: 50%;;flex-basis: 50%">
                            <span style="display:block">
                                <span style="font-weight: 600;font-size:15px;">Customer Name:</span>
                                <span style="font-size:15px;"> <code> < Customer Name > </code> </span>
                            </span>
                            <span style="display:block">
                                <span style="font-weight: 600;font-size:15px;">Account Name:</span>
                                <span style="font-size:15px;"> All Accounts OVERVIEW </span>
                            </span>
            
                        </div>
                        <div style="flex-grow: 0;max-width: 50%;;flex-basis: 50%">
                            <span>
                                <span style="font-weight: 600;font-size:15px;">Date & Time:</span>
                                <span style="font-size:15px;"> <code> < MM/DD/YY , Hour:Minute:Seconds > </code> </span>
                            </span>
                        </div>
                    </div>
            
                    <div style="display: flex;flex-wrap: wrap;box-sizing: border-box;margin-bottom:30px ">
                        <div style="max-width: 100%;flex-basis: 100%;box-sizing: border-box;">
                            <table style="width:100%;border-collapse: collapse;">
                                <thead>
                                    <tr style="-webkit-print-color-adjust: exact;background-color: #e7f1f2;">
                                        <th style="padding:12px 8px;font-size: 13px;text-align: left;">
                                            Control
                                            ID
                                        </th>
                                        <th colspan="2" style="padding:12px 8px;font-size: 13px;text-align: left;">PCI
                                            Controls
                                        </th>
                                        <th style="padding:12px 8px;font-size: 13px;text-align: center;">
                                            Failed/Total
                                            Rules
                                        </th>
                                        <th style="padding:12px 8px;font-size: 13px;text-align: center;">
                                            Failed
                                            / Total Assets
                                        </th>
                                        <th style="padding:12px 8px;font-size: 13px;text-align: center;">
                                            07/23/19
                                        </th>
                                        <th style="padding:12px 8px;font-size: 13px;text-align: center;">
                                            Projection
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td style="padding:12px 8px;font-size: 13px;text-align: left;">ID1
                                        </td>
                                        <td colspan="2" style="padding:12px 8px;font-size: 13px;text-align: left;">
                                            Install and maintain a firewall configuration
                                        </td>
                                        <td style="padding:12px 8px;font-size: 13px;text-align: center;">
                                            <span style="color:#EC4E4E">6</span>
                                            / 6
                                        </td>
                                        <td style="padding:12px 8px;font-size: 13px;text-align: center;">
                                            <span style="color:#EC4E4E">34</span>
                                            / 69
                                        </td>
                                        <td style="padding:12px 8px;font-size: 13px;text-align: center;">
                                            <span
                                                style="background-color:#DDF4E3;border-radius: 20px;padding: 5px 10px;font-size: 11px;">
                                                12 <img width="8" height="8" src="/assets/images/report/arrow-up.svg">
                                            </span>
                                        </td>
                                        <td style="padding:12px 8px;font-size: 13px;text-align: center;">
                                            <span
                                                style="background-color:#DDF4E3;border-radius: 20px;padding: 5px 10px;font-size: 11px;">
                                                12 <img width="8" height="8" src="/assets/images/report/arrow-up.svg">
                                            </span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td colspan="7">
                                            <table style="width:100%;border-collapse: collapse;">
                                                <thead>
                                                    <tr style="-webkit-print-color-adjust: exact;background-color: #e7f1f2;">
                                                        <th style="padding:12px 8px;font-size: 13px;text-align: left;">
                                                            Rule ID
                                                        </th>
                                                        <th style="padding:12px 8px;font-size: 13px;text-align: left;">
                                                            Rule Name
                                                        </th>
                                                        <th style="padding:12px 8px;font-size: 13px;text-align: center;">
                                                            Status
                                                        </th>
                                                        <th style="padding:12px 8px;font-size: 13px;text-align: center;">
                                                            Failed
                                                            / Total Assets</th>
                                                        <th style="padding:12px 8px;font-size: 13px;text-align: center;">
                                                            07/23/19</th>
                                                        <th style="padding:12px 8px;font-size: 13px;text-align: center;">
                                                            Projection</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td style="padding:12px 8px;font-size: 13px;text-align: left;">
                                                            ID1
                                                        </td>
                                                        <td style="padding:12px 8px;font-size: 13px;text-align: left;">
                                                            Lorem Ipsum
                                                        </td>
                                                        <td style="padding:12px 8px;font-size: 13px;text-align: center;">
                                                            <span style="color:#EC4E4E">Failed</span>
                                                        </td>
                                                        <td style="padding:12px 8px;font-size: 13px;text-align: center;">
                                                            <span style="color:#EC4E4E">4</span> / 69
                                                        </td>
                                                        <td style="padding:12px 8px;font-size: 13px;text-align: center;">
                                                            <span
                                                                style="background-color:#DDF4E3;border-radius: 20px;padding: 5px 10px;font-size: 11px;">
                                                                12 <img width="8" height="8" src="/assets/images/report/arrow-up.svg">
                                                            </span>
                                                        </td>
                                                        <td style="padding:12px 8px;font-size: 13px;text-align: center;">
                                                            <span
                                                                style="background-color:#DDF4E3;border-radius: 20px;padding: 5px 10px;font-size: 11px;">
                                                                12 <img width="8" height="8" src="/assets/images/report/arrow-up.svg">
                                                            </span>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td colspan="7" style="font-size: 12px;">
                                                            <table class="table-toggle"
                                                                style="width:100%;border-collapse: collapse;">
                                                                <thead>
                                                                    <tr
                                                                        style="-webkit-print-color-adjust: exact;background-color: #e7f1f2;">
                                                                        <th colspan="6"
                                                                            style="padding:12px 8px;font-size: 13px;text-align: left;">
                                                                            <div style="display:flex;align-items:center;">
                                                                                <span style="color: #EC4E4E">FAILED</span>
                                                                                <hr
                                                                                    style="flex-grow: 1;border: 1px solid#EC4E4E;margin: 0px 12px">
                                                                            </div>
                                                                        </th>
                                                                    </tr>
                                                                    <tr
                                                                        style="-webkit-print-color-adjust: exact;background-color: #e7f1f2;">
                                                                        <th
                                                                            style="padding:0px 8px 12px;font-size: 13px;text-align: left;">
                                                                            Type
                                                                        </th>
                                                                        <th
                                                                            style="padding:0px 8px 12px;font-size: 13px;text-align: left;">
                                                                            Name
                                                                        </th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    <tr>
                                                                        <td
                                                                            style="padding:12px 8px;font-size: 13px;text-align: left;">
                                                                            S3
                                                                            Bucket
                                                                        </td>
                                                                        <td
                                                                            style="padding:12px 8px;font-size: 13px;text-align: left;">
                                                                            S3BucketName01
                                                                        </td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td
                                                                            style="padding:12px 8px;font-size: 13px;text-align: left;">
                                                                            S3
                                                                            Bucket
                                                                        </td>
                                                                        <td
                                                                            style="padding:12px 8px;font-size: 13px;text-align: cenleftter;">
                                                                            S3BucketName01
                                                                        </td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td
                                                                            style="padding:12px 8px;font-size: 13px;text-align: left;">
                                                                            S3
                                                                            Bucket
                                                                        </td>
                                                                        <td
                                                                            style="padding:12px 8px;font-size: 13px;text-align: cenleftter;">
                                                                            S3BucketName01
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td colspan="7" style="font-size: 12px;">
                                                            <table class="table-toggle"
                                                                style="width:100%;border-collapse: collapse;">
                                                                <thead>
                                                                    <tr
                                                                        style="-webkit-print-color-adjust: exact;background-color: #e7f1f2;">
                                                                        <th colspan="6"
                                                                            style="padding:12px 8px;font-size: 13px;text-align: left;">
                                                                            <div style="display:flex;align-items:center;">
                                                                                <span style="color: #225BDE">IN REMEDIATION</span>
                                                                                <hr
                                                                                    style="flex-grow: 1;border:1px solid #225BDE;margin: 0px 12px">
                                                                            </div>
                                                                        </th>
                                                                    </tr>
                                                                    <tr
                                                                        style="-webkit-print-color-adjust: exact;background-color: #e7f1f2;">
                                                                        <th
                                                                            style="padding:0px 8px 12px;font-size: 13px;text-align: left;">
                                                                            Type
                                                                        </th>
                                                                        <th
                                                                            style="padding:0px 8px 12px;font-size: 13px;text-align: left;">
                                                                            Name
                                                                        </th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    <tr>
                                                                        <td
                                                                            style="padding:12px 8px;font-size: 13px;text-align: left;">
                                                                            S3
                                                                            Bucket
                                                                        </td>
                                                                        <td
                                                                            style="padding:12px 8px;font-size: 13px;text-align: left;">
                                                                            S3BucketName01
                                                                        </td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td
                                                                            style="padding:12px 8px;font-size: 13px;text-align: left;">
                                                                            S3
                                                                            Bucket
                                                                        </td>
                                                                        <td
                                                                            style="padding:12px 8px;font-size: 13px;text-align: left;">
                                                                            S3BucketName01
                                                                        </td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td
                                                                            style="padding:12px 8px;font-size: 13px;text-align: left;">
                                                                            S3
                                                                            Bucket
                                                                        </td>
                                                                        <td
                                                                            style="padding:12px 8px;font-size: 13px;text-align: left;">
                                                                            S3BucketName01
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </td>
                                                    </tr>
            
                                                    <tr>
                                                        <td colspan="7" style="font-size: 12px;">
                                                            <table class="table-toggle"
                                                                style="width:100%;border-collapse: collapse;">
                                                                <thead>
                                                                    <tr
                                                                        style="-webkit-print-color-adjust: exact;background-color: #e7f1f2;">
                                                                        <th colspan="6"
                                                                            style="padding:12px 8px;font-size: 13px;text-align: left;">
                                                                            <div style="display:flex;align-items:center;">
                                                                                <span style="color: #24BA4D">PASSED</span>
                                                                                <hr
                                                                                    style="flex-grow: 1;border: 1px solid #24BA4D;margin: 0px 12px">
                                                                            </div>
                                                                        </th>
                                                                    </tr>
                                                                    <tr
                                                                        style="-webkit-print-color-adjust: exact;background-color: #e7f1f2;">
                                                                        <th
                                                                            style="padding:0px 8px 12px;font-size: 13px;text-align: left;">
                                                                            Type
                                                                        </th>
                                                                        <th
                                                                            style="padding:0px 8px 12px;font-size: 13px;text-align: left;">
                                                                            Name
                                                                        </th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    <tr>
                                                                        <td
                                                                            style="padding:12px 8px;font-size: 13px;text-align: left;">
                                                                            S3
                                                                            Bucket
                                                                        </td>
                                                                        <td
                                                                            style="padding:12px 8px;font-size: 13px;text-align: left;">
                                                                            S3BucketName01
                                                                        </td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td
                                                                            style="padding:12px 8px;font-size: 13px;text-align: left;">
                                                                            S3
                                                                            Bucket
                                                                        </td>
                                                                        <td
                                                                            style="padding:12px 8px;font-size: 13px;text-align: cenleftter;">
                                                                            S3BucketName01
                                                                        </td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td
                                                                            style="padding:12px 8px;font-size: 13px;text-align: left;">
                                                                            S3
                                                                            Bucket
                                                                        </td>
                                                                        <td
                                                                            style="padding:12px 8px;font-size: 13px;text-align: cenleftter;">
                                                                            S3BucketName01
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div class="page-footer">
                        <div
                            style="display: flex;flex-wrap: wrap;box-sizing: border-box;padding: 0 12px;border-top: 4px solid#5DBCD2;padding-top: 10px;">
                            <div style="flex-grow: 0;max-width: 33.3%;;flex-basis: 33.3%;">
                                <span>@ SECBERUS , Inc 2018-19</span>
                            </div>
                            <div style="flex-grow: 0;max-width: 33.3%;;flex-basis: 33.3%;text-align: center;">
                                <span>CONFIDENTIAL</span>
                            </div>
                            <div style="flex-grow: 0;max-width: 33.3%;;flex-basis: 33.3%;text-align: right">
                                <span>Page 1 of 5</span>
                            </div>
                        </div>
                    </div>
            
                </div>
            </body>
            
            </html>`
            )
        return (
            renderHTML(template)
        );
    }
}

export default ComplianceReport