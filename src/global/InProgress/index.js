import React, { PureComponent } from 'react';
import Button from '@material-ui/core/Button';
import Popover from '@material-ui/core/Popover';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Typography from '@material-ui/core/Typography';

class InProgress extends PureComponent {
    render() {
        return (
            <span className="in-progress-spinner-text">In progress <i className="fa fa-fw fa-spinner fa-pulse"></i> </span>
        );
    }
}


export default InProgress;