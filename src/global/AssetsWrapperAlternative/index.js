/*
 * @Author: Virendra Patidar 
 * @Date: 2018-11-16 14:55:42 
 * @Last Modified by: Virendra Patidar
 * @Last Modified time: 2019-05-21 15:42:57
 */
import LinearProgress from '@material-ui/core/LinearProgress';
import React, { PureComponent } from 'react';
import LabelWithHelper from 'hoc/Label/LabelWithHelper';

class AssetsWrapper extends PureComponent {
    state = {
        value: 0,
        completed: 0
    }

    componentDidMount() {
        this.timer = setInterval(this.progress, 500);
    }

    componentWillUnmount() {
        clearInterval(this.timer);
    }

    progress = () => {
        const { completed } = this.state;
        if (completed === 100) {
            this.setState({ completed: 0 });
        } else {
            const diff = Math.random() * 10;
            this.setState({ completed: Math.min(completed + diff, 100) });
        }
    };

    render() {
        const { value, completed } = this.state
        const { progressBar,title,message, assetName, assetCount, addClass, progressBarColorClass, activeAssetName, isHelper, borderClassName,content,marginTop } = this.props
        const isActive = activeAssetName === assetName
        const titleClassName = isActive === true ? 'asset-border-blue' : addClass

        return (
            <div className={"assets-box "} onClick={() => this.props.filterAssets(assetName)}>
                {title && <div className="assets-head">{title}</div>}
                <div className={"assets-item " + titleClassName + ' '+(title ?'mrT0':'mrT20')}>
                    <strong className={isActive == true ? 'text-primary' : ''}>{assetName}</strong>
                    <div>
                        <div className="asset-count">{assetCount}</div>
                     {progressBar!==false &&  <LinearProgress className={"asset-progress-bar " + progressBarColorClass} variant="determinate" value={completed} /> }
                    </div>
                </div>
            </div>
        )
    }
}


export default AssetsWrapper; 