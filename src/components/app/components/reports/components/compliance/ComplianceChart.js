import React, { PureComponent } from 'react'
import Typography from '@material-ui/core/Typography'
import { PieChart } from 'react-d3-components'

class ComplianceChart extends PureComponent {

    render() {

        const { title, percantage, passed, failed, isShowLegend, is_report_icon,compliance_name, compliance } = this.props
        let percent = 0
        if (compliance !== undefined && compliance !== null) {
            if (compliance.rule_passed_count !== 0) {
                percent = Math.round((compliance.rule_passed_count/(compliance.rule_passed_count+compliance.rule_failed_count))*100)
            }
        }
        const scale = d3.scale.ordinal().range(['#24BA4D', '#EC4E4E'])

        const data = {
            label: 'somethingA',
            values: [{ x: 'SomethingA', y: 10 }, { x: 'SomethingB', y: 4 }, { x: 'SomethingC', y: 3 }]
        }
        return (
            <div className="pei-chart-data">
                <PieChart
                    data={data}
                    width={90}
                    height={80}
                    hideLabels={true}
                    margin={{ top: 10, bottom: 10, left: 0, right: 20 }}
                    colorScale={scale}
                    innerRadius={35}
                    outerRadius={25}

                >
                    <text x="25" y="24" stroke="black" fontSize="10" fill="#292929">{compliance_name}</text>
                    <text x="30" y="39" fontSize="9" fill="#292929">
                        {percent}%
                    </text>
                    <g>
                        <image x="21" y="33" xlinkHref='/assets/images/arrow-down.svg' height="8" width="8" />
                    </g>
                </PieChart>
                {compliance !== undefined && <div className="chart-result">
                    {percent}%
                    <div className="fnt-10">
                        <span className="text-success">{compliance.rule_passed_count}</span>  Passed
                                    <span className="pdL5 pdR5">|</span>
                        <span className="text-danger ">{compliance.rule_failed_count}</span>  Failed
                    </div>
                </div>}
            </div>

        );
    }

}

export default ComplianceChart