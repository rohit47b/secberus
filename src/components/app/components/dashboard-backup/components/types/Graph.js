import React, { Component } from 'react';
import Highcharts from 'highcharts';

class Graph extends Component{

    state = {
        series: [{
              name: 'Types',
              data: [
                {
                  name: 'Critical',
                  y:20.1,
                  color: '#ec4e4e'
                },
                {
                  name: 'High',
                  y: 50.1,
                  color: '#ECA84E'
                },
                {
                  name: 'Medium',
                  y: 20.9,
                  color: '#ECD24E'
                },
                {
                  name: 'Low',
                  y: 10.0,
                  color: '#24BA4D'
                }
              ]
            }]
    }

    componentDidMount() {
        this.highChartsRender();
      }

    highChartsRender = ()=> {
        Highcharts.chart({
            chart: {
              type: 'pie',
              renderTo: 'atmospheric-composition'
            },
            title: {
              verticalAlign: 'middle',
              floating: true,
              text: '',
              style: {
                  fontSize: '10px',
              }
            },
            plotOptions: {
              pie: {
                dataLabels: {
                    enabled: false,
                },
                innerSize: '50%',
                showInLegend:true
              }
            },
            series: this.state.series
          });
    }

    render() {
        return (
            <div id="atmospheric-composition" style={{"width":"100%","height":"260px"}}>
            </div>
        );
      }
}

export default Graph