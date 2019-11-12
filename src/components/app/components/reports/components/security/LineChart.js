import Paper from '@material-ui/core/Paper';
import { ResponsiveLine } from 'nivo';
import React, { PureComponent } from 'react';
import Typography from '@material-ui/core/Typography'
import LabelWithHelper from 'hoc/Label/LabelWithHelper'

class LineChart extends PureComponent {

    state = {
        chartData: {
            datasets: [{
                borderColor: 'rgb(255, 99, 132)',
                data: [],
            }]
        },
        options: {
            scales: {
                xAxes: [{
                    type: 'time',
                    time: {
                        unit: 'month'
                    }
                }]
            },
            elements: {
                line: {
                    tension: 0, // disables bezier curves
                }
            }
        }
    }


    static getDerivedStateFromProps(nextProps, state) {
        return { allTrendChartData: nextProps.allTrendChartData }
    }


    componentDidUpdate = (prevProps, prevState) => {
        if (this.props.allTrendChartData !== prevProps.allTrendChartData) {
            this.setChartData(this.props.allTrendChartData)
        }
    }


    setChartData = (allChartData) => {
        let allData = []
        let colorIndex = 0
        const colorList = ['rgb(255, 99, 132)', 'rgb(76, 51, 255)', 'rgb(51, 255, 54)', 'rgb(2, 21, 2)', 'rgb(162, 31, 42)']
        allChartData.map(compliance => {
            let pciChartData = []
            compliance.data.values.map(item => {
                pciChartData.push({ x: new Date(item.timestamp), y: item.value })

            })
            pciChartData.sort(function (a, b) {
                if (a.x > b.x) {
                    return 1;
                }
                if (a.x < b.x) {
                    return -1;
                }
                return 0;
            });

            let datasets = {
                label: compliance.key,
                fill: false,
                borderColor: colorList[colorIndex],
                data: pciChartData,
            }

            allData.push(datasets)
            colorIndex++;
        })


        let chartStructure = {
            datasets: allData
        }

        this.setState({ chartData: chartStructure })
    }

    render() {
        const { pciData,lineColor,title,content, classStyle } = this.props
        let class_name = "paper-box text-center paper-report"
        if (classStyle) {
            class_name = "paper-box"
        }
        return (
            <Paper elevation={1} className={class_name}>
            <LabelWithHelper message={title}  content={content} />
             <Typography className="mrB15 report-title text-center heading-h4" component="h4">
                   {title}
            </Typography>
            <div className="nivo-container">
                <ResponsiveLine
                    margin={{
                        top: 10,
                        right: 10, 
                        bottom: 25,
                        left: 30
                    }}
                    data={[
                        {color: 'hsl(221,84%,87%)',data: [
                            {color: 'hsl(153, 70%, 50%)',x: 'Jan',y: Math.floor(Math.random() * 100)},
                            {color: 'hsl(192, 70%, 50%)',x: 'Feb',y: Math.floor(Math.random() * 100)},
                            {color: 'hsl(79, 70%, 50%)',x: 'Mar',y: Math.floor(Math.random() * 100)},
                            {color: 'hsl(153, 70%, 50%)',x: 'Apr',y: Math.floor(Math.random() * 100)},
                            {color: 'hsl(79, 70%, 50%)',x: 'May',y: Math.floor(Math.random() * 100)},
                            {color: 'hsl(192, 70%, 50%)',x: 'Jun',y: Math.floor(Math.random() * 100)},
                            {color: 'hsl(79, 70%, 50%)',x: 'Jul',y: Math.floor(Math.random() * 100)},
                            {color: 'hsl(153, 70%, 50%)',x: 'Agu',y: Math.floor(Math.random() * 100)},
                            {color: 'hsl(192, 70%, 50%)',x: 'Sep',y: Math.floor(Math.random() * 100)},
                            {color: 'hsl(79, 70%, 50%)',x: 'Oct',y: Math.floor(Math.random() * 100)},
                            {color: 'hsl(153, 70%, 50%)',x: 'Nov',y: Math.floor(Math.random() * 100)},
                            {color: 'hsl(192, 70%, 50%)',x: 'Dec',y: Math.floor(Math.random() * 100)}
                            
                        ],id:'123'}
                    ]}
                    animate
                    yScale={{ type: 'linear', stacked: true }}
                    axisLeft={{ tickSize: 10 }}
                    tooltipFormat={function (e) { return e + "%" }}
                    colors={lineColor}
                />
            </div>
            </Paper>

        );
    }
}

export default LineChart