import React, { PureComponent } from 'react'

import { PieChart } from 'react-d3-components'

class ComplianceChart extends PureComponent {
    parseTitle(title) {
        if (title.indexOf('PCI') !== -1) {
            return 'PCI'
        }
        if (title.indexOf('HIPAA') !== -1) {
            return 'HIPAA'
        }
        if (title.indexOf('CIS') !== -1) {
            return 'CIS'
        }
        return title
    }
    render() {

        const {title,percantage,passed,failed,isShowLegend} = this.props
        const scale = d3.scale.ordinal().range(['#24BA4D', '#EC4E4E'])

        const pieChartData={
            label: 'somethingA',
            values: [
                { x: 'SomethingA', y: passed },
                { x: 'SomethingB', y: failed }
            ]
        }
        return (
            <div className="pei-chart-data">
                <PieChart
                    data={pieChartData}
                    width={95}
                    height={100}
                    hideLabels={true}
                    margin={{ top: 10, bottom: 10, left: 0, right: 5 }}
                    colorScale={scale}
                    innerRadius={45}
                    outerRadius={32}

                >
                    <text textAnchor='middle' x="45" y="35" stroke="black" fontSize="11" fill="#292929">{this.parseTitle(title)}</text>
                    <text x="42" y="55" fontSize="12" fill="#292929">
                    {Math.round(Math.abs(percantage))}%
                </text>
                <g>
                    <image x="30" y="46" xlinkHref={percantage < 0 ? '/assets/images/arrow-down.svg':'/assets/images/arrow-up.svg'}  height="10" width="10" />
                </g>
                </PieChart>
               {isShowLegend === undefined &&  <div className="chart-result">
                    {(passed === 0) ? <div className="chart-per text-success">0%</div> : <div className="chart-per text-success">{Math.round((passed/(passed+failed))*100)}%</div>}
                    <div className="fnt-12">
                        <span className="text-success">{passed}</span>  Passed
                                    <span className="pdL5 pdR5">|</span>
                        <span className="text-danger ">{failed}</span>  Failed
                    </div>
                </div>
               }
            </div>

        );
    }

}

export default ComplianceChart