/*
 * @Author: Virendra Patidar 
 * @Date: 2018-11-16 14:55:42 
 * @Last Modified by: Virendra Patidar
 * @Last Modified time: 2019-03-04 16:11:13
 */
import LinearProgress from '@material-ui/core/LinearProgress';
import React, { PureComponent } from 'react';
import LabelWithHelper from 'hoc/Label/LabelWithHelper';

class PolicyWrapper extends PureComponent {
    state = {
        value: 0
    }

    componentDidMount() {
        
    }

    componentWillUnmount() {
        
    }

    render() {
        const { value } = this.state
        const { title, Name, Count, addClass } = this.props
        const titleClassName = addClass
        
        return (
            <div className="assets-box">
                <div className="assets-head">{title}</div>
                <div className={"assets-item " + titleClassName}>
                    <LabelWithHelper title={Name} content={Name + " number of policies detected."} />
                    <div>
                        <div className="asset-count">{Count}</div>
                    </div>
                </div>
            </div>
        )
    }
}


export default PolicyWrapper; 