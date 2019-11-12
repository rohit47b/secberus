import { linearGradientDef, ResponsiveStream } from 'nivo';
import React, { PureComponent } from 'react';

class AreaChart extends PureComponent {

   state={
    data:[
        {
          "Raoul": 39,
          "Josiane": 108,
          "Marcel": 128,
          "René": 54,
          "Paul": 65,
          "Jacques": 30
        },
        {
          "Raoul": 24,
          "Josiane": 133,
          "Marcel": 41,
          "René": 50,
          "Paul": 70,
          "Jacques": 58
        },
        {
          "Raoul": 34,
          "Josiane": 25,
          "Marcel": 123,
          "René": 193,
          "Paul": 78,
          "Jacques": 60
        },
        {
          "Raoul": 188,
          "Josiane": 80,
          "Marcel": 28,
          "René": 179,
          "Paul": 11,
          "Jacques": 107
        },
        {
          "Raoul": 82,
          "Josiane": 117,
          "Marcel": 158,
          "René": 123,
          "Paul": 171,
          "Jacques": 100
        },
       
       
      ]
   }

    render() {
        const { data } = this.state
        return (
            <div className="nivo-container">
                <ResponsiveStream
                    data={data}
                    colors="#A8DEC8"
                    keys={[
                        "Raoul",
                    ]}
                    margin={{
                        "top": 50,
                        "right": 110,
                        "bottom": 50,
                        "left": 60
                    }}
                    axisTop={null}
                    axisRight={null}
                    axisBottom={{
                        "orient": "bottom",
                        "tickSize": 5,
                        "tickPadding": 5,
                        "tickRotation": 0,
                        "legend": "",
                        "legendOffset": 36
                    }}
                    axisLeft={{
                        "orient": "left",
                        "tickSize": 5,
                        "tickPadding": 5,
                        "tickRotation": 0,
                        "legend": "",
                        "legendOffset": -40
                    }}
                    curve="linear"
                    offsetType="none"
                    fillOpacity={0.85}
                    borderColor="#000"
                    defs={[
                        // using helpers
                        // will inherit colors from current element
                        linearGradientDef('gradientA', [
                          { offset: 70, color: 'inherit' },
                          { offset: 100, color: 'inherit', opacity: 0 },
                        ]),
                        linearGradientDef('gradientB', [
                          { offset: 70, color: '#000' },
                          { offset: 100, color: 'inherit' },
                        ]),
                        // using plain object
                        {
                          id: 'Raoul',
                          type: 'linearGradient',
                          colors: [
                            { offset: 0, color: '#faf047' },
                            { offset: 100, color: '#e4b400' },
                          ],
                        },
                      ]}
                        // defining rules to apply those patterns
                      fill={[
                        { match: { id: 'Raoul' }, id: 'gradientA' },
                        // match using function
                        { match: d => d.id === 'Josiane', id: 'gradientB' },
                        
                      ]}
                    
                    dotSize={8}
                    dotBorderWidth={2}
                    dotBorderColor="inherit:brighter(0.7)"
                    animate={true}
                    motionStiffness={90}
                    motionDamping={15}
                    legends={[
                        {
                            "anchor": "bottom-right",
                            "direction": "column",
                            "translateX": 100,
                            "itemWidth": 80,
                            "itemHeight": 50,
                            "itemTextColor": "#999",
                            "symbolSize": 12,
                            "symbolShape": "circle",
                            "effects": [
                                {
                                    "on": "hover",
                                    "style": {
                                        "itemTextColor": "#000"
                                    }
                                }
                            ]
                        }
                    ]}
                />
            </div>


        );
    }
}

export default AreaChart