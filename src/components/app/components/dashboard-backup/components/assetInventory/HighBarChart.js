import React , { Component } from "react"
import ReactHighcharts from "react-highcharts"
import Highcharts from 'highcharts'


const config ={
    chart: {
        type: 'column'
    },
    title:{
        text:''
    },
    xAxis: {

        categories: [{
          name: "IAM",
          url: "/assets/service-icon/iam.png"
        }, {
          name: "ACM",
          url: "/assets/service-icon/acm.png"
        }, {
            name: "CloudTrail",
            url: "/assets/service-icon/cloud-trail.png"
          }, {
            name: "CloudWatch",
            url: "/assets/service-icon/cloud-watch.png"
          }, {
            name: "RDS",
            url: "/assets/service-icon/rds.png"
          },{
            name: "Redshift",
            url: "/assets/service-icon/redshift.png"
          },
          {
            name: "SQS",
            url: "/assets/service-icon/sqs.png"
          },
          {
            name: "CloudFront",
            url: "/assets/service-icon/cloud-front.png"
          },
          {
            name: "CloudInformation",
            url: "/assets/service-icon/cloudformation.png"
          },
          {
            name: "S3",
            url: "/assets/service-icon/s3.png"
          },
          {
            name: "ElasticSearch",
            url: "/assets/service-icon/elastic-search.png"
          },
          {
            name: "EC2",
            url: "/assets/service-icon/ec2.png"
          },
          {
            name: "VPC",
            url: "/assets/service-icon/vpc.png"
          },
          {
            name: "Route53",
            url: "/assets/service-icon/route53.png"
          },
          {
            name: "SNS",
            url: "/assets/service-icon/sns.png"
          },
        ],
        labels: {
          formatter: function() {
            return '<a alt="'+this.value.name+'" title="' + this.value.name + '" href="javascript:void(0)"><img width="15px" src="' + this.value.url + '" /></a>'
          },
          useHTML: true
        },
        title: {
            text: 'Services'
        }
      },
    yAxis: {
        min: 0,
        title: {
            text: 'Number of Assets'
        },
        stackLabels: {
            enabled: true,
            style: {
                fontWeight: 'bold',
                fill:'#ddd',
                color: (Highcharts.theme && Highcharts.theme.textColor) || 'gray',
            },
            formatter: function () {
                return '<a class="label-circle" href="javascript:void(0)">' + this.total +'</a>';
            },
            useHTML: true
        },
        
    },
    legend: {
        align: 'left',
        x: 0,
        verticalAlign: 'bottom',
        y: 10,
        floating: true,
        backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || 'white',
        borderColor: '#CCC',
        borderWidth: 1,
        shadow: false
    },
    tooltip: {
        enabled:false,
        headerFormat: '<b>{point.x}</b><br/>',
        pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}'
    },
    plotOptions: {
        column: {
            stacking: 'circle',
            dataLabels: {
                enabled: false,
                color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white'
            }
        }
       
    },
    series: [{
        name: 'Assets',
        data: [5, 3, 4, 7, 2 , 8 , 1 , 3 , 4 , 5 , 6 , 9 , 4 , 6 , 2],
        color:'#ec4e4e'
    }, {
        name: 'Offenders',
        data: [2, 2, 3, 2, 1 , 5 , 4 , 6 , 7 , 8 , 9 , 5 , 4 , 1 ,2],
        color:'#24BA4D'
        
    }],
    
};

class HighBarChart extends Component{
    render(){
        return(
            <ReactHighcharts config = {config}/>
        )
    }
}

export default HighBarChart