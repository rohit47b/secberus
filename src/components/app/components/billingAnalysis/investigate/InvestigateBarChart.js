import React, { PureComponent } from 'react'
import {BarChart, Bar,XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Label} from 'recharts';
import CustomBarLabel from '../CustomBarLabel'
const data = [
    {
        name: 'JAN', Staging: 42
    },
    {
        name: 'FEB', Staging: 78
    },
    {
        name: 'MAR', Staging: 65
    },
    {
        name: 'APR', Staging: 78
    },
    {
        name: 'MAY', Staging: 108
    },
    {
        name: 'JUN', Staging: 95
    },
    {
        name: 'JUL', Staging: 125
    },
    {
        name: 'AUG', Staging: 110,
    },
    {
        name: 'SEP', Staging: 88
    },
    {
        name: 'OCT', Staging: 98
    },
    {
        name: 'NOV', Staging: 115
    },
    {
        name: 'DEC', Staging: 60
    }
];

class SpendHistoryBarChart extends PureComponent {

    render() {
        return (
            <div className="bar-container">
                <ResponsiveContainer>
                    <BarChart
                        width={200}
                        height={200}
                        data={data}
                        margin={{
                            top: 5, right: 10, left: 10, bottom: 5,
                        }}
                        barGap={0}
                    >
                        <CartesianGrid vertical={false}/>
                        <defs>
                        <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="70%" stopColor="#00A1FF" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#ffffff" stopOpacity={0.9}/>
                        </linearGradient>
                        
                    </defs>
                        <XAxis dataKey="name" />
                        <YAxis axisLine={false}>
                            <Label angle={-90} value='S Thousands' position='insideLeft' style={{ textAnchor: 'middle' }} />
                        </YAxis>
                        <Tooltip cursor={{fill: 'transparent'}}/>
                        <Bar barSize={45} dataKey="Staging" fill="url(#colorUv)" label={<CustomBarLabel/>} />
                    </BarChart>
                </ResponsiveContainer>

            </div>
        )
    }
}

export default SpendHistoryBarChart