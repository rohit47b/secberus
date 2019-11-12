import React, { PureComponent } from 'react'
import { BarChart, Bar,XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Label} from 'recharts';
import CustomBarLabel from '../CustomBarLabel'
const data = [
    {
        name: 'JAN', Staging: 27, Production1: 55, Production2: 75,
    },
    {
        name: 'FEB', Staging: 42, Production1: 78, Production2: 78,
    },
    {
        name: 'MAR', Staging: 42, Production1: 120, Production2: 130,
    },
    {
        name: 'APR', Staging: 42, Production1: 80, Production2: 80,
    },
    {
        name: 'MAY', Staging: 70, Production1: 120, Production2: 120,
    },
    {
        name: 'JUN', Staging: 73, Production1: 108, Production2: 108,
    },
    {
        name: 'JUL', Staging: 75, Production1: 125, Production2: 125,
    },
    {
        name: 'AUG', Staging: 80, Production1: 91, Production2: 91,
    },
    {
        name: 'SEP', Staging: 80, Production1: 91, Production2: 91,
    },
    {
        name: 'OCT', Staging: 86, Production1: 92, Production2: 92,
    },
    {
        name: 'NOV', Staging: 78, Production1: 120, Production2: 120,
    },
    {
        name: 'DEC', Staging: 78, Production1: 107, Production2: 107,
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
                        <XAxis dataKey="name" />
                        <YAxis axisLine={false}>
                            <Label angle={-90} value='S Thousands' position='insideLeft' style={{ textAnchor: 'middle' }} />
                        </YAxis>
                        <Tooltip cursor={{fill: 'transparent'}}/>
                        <Legend
                                payload={
                                    [
                                    { id: 'Staging', value: 'Staging', type: 'circle', color: '#00A1FF'},
                                    { id: 'Production1', value: 'Production1', type: 'circle', color: '#60D836'},
                                    { id: 'Production2', value: 'Production2', type: 'circle', color: '#F8BA00'}
                                ]
                            }
                            iconSize="10"
                        />
                        <Bar barSize={18} dataKey="Staging" fill="#00A1FF" label={<CustomBarLabel/>} />
                        <Bar barSize={18} dataKey="Production1" fill="#60D836" label={<CustomBarLabel/>} />
                        <Bar barSize={18} dataKey="Production2" fill="#F8BA00" label={<CustomBarLabel/>}/>
                    </BarChart>
                </ResponsiveContainer>

            </div>
        )
    }
}

export default SpendHistoryBarChart