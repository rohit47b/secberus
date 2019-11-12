import React, { PureComponent,Fragment } from 'react'
import { CardWithTitle } from 'hoc/CardWithTitle'
import { Typography, Button } from '@material-ui/core'


class AlertDetail extends PureComponent {

    buildSteps(blob) {
        if (blob) {
            const steps = blob.toString().split(/\s*\d+\.\s*/).filter(s => !!s)
            return steps
        }
    }

    render() {
        return (
            <CardWithTitle title={"Alert Details"} bgImageClass={"card-alert"}>
                <Fragment>
                     <Typography className="mrB15" component="p">
                         <strong>Rule Violated :</strong> {this.props.rule.label}
                    </Typography>
                    <Typography className="mrB15" component="p">
                         <strong>Rule Description :</strong> {this.props.rule.description}
                    </Typography>
                    <Typography component="p">
                         <strong>Recommended Remediation Steps:</strong>
                         <ol type="1" className="pdL20">
                            {this.buildSteps(this.props.rule.remediation_steps).map(function(step, index){
                                return <li><span>{step}</span></li>
                            })}
                         </ol>
                    </Typography>
                </Fragment>
            </CardWithTitle>
        );
    }
}

export default AlertDetail