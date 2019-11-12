import React, { PureComponent } from 'react'
import { Link } from 'react-router-dom'
import Button from '@material-ui/core/Button'
import Popover from '@material-ui/core/Popover'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import Typography from '@material-ui/core/Typography'
import Paper from '@material-ui/core/Paper';


class Notification extends PureComponent {
    state = {
        popoverEl: null,
    };

    handleClick = event => {
        this.setState({
            popoverEl: event.currentTarget,
        });
    };

    handleClose = () => {
        this.setState({
            popoverEl: null,
        });
    };

    render() {

        const { popoverEl } = this.state;

        return (
            <div className="notification-dropdown">
                <div>
                    <Button
                        onClick={this.handleClick}
                        className="notification-btn"
                    >
                        <i className="fa fa-bell-o">

                        </i>
                    </Button>
                    <Popover
                        open={Boolean(popoverEl)}
                        anchorEl={popoverEl}
                        onClose={this.handleClose}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'right',
                        }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        className="notification-popover"
                    >
                        <List component="nav" className="notification-list">
                            <Typography component="h4" className="list-head">
                                <strong>Notification</strong>
                                {/* <Link to="/app/notifications/all" className="flexGrow1">See all</Link> */}
                            {/* </Typography> */}
                            {/* <ListItem button className="list-item">
                                <Paper className="list-item-category">
                                    <span className="flexGrow1">Assets</span>
                                    <span><strong>3</strong></span>
                                </Paper>
                            </ListItem>
                            <ListItem button className="list-item">
                                <Paper className="list-item-category">
                                    <span className="flexGrow1">Rules</span>
                                    <span><strong>5</strong></span>
                                </Paper>
                            </ListItem>
                            <ListItem button className="list-item">
                                <Paper className="list-item-category">
                                    <span className="flexGrow1">User Activity</span>
                                    <span><strong>5</strong></span>
                                </Paper>
                            </ListItem>
                            <ListItem button className="list-item">
                                <Paper className="list-item-category">
                                    <span className="flexGrow1">Alerts</span>
                                    <span><strong>0</strong></span>
                                </Paper>
                            </ListItem>
                            <ListItem button className="list-item">
                                <Paper className="list-item-category">
                                    <span className="flexGrow1">Posture</span>
                                    <span><strong>7</strong></span>
                                </Paper>
                            </ListItem> */}
                            {/* <Typography component="div" className="list-footer text-center"> */}
                                <Link to="/app/notifications/setting" onClick={this.handleClose} >Setting</Link>
                            </Typography>
                        </List>
                    </Popover>
                </div>
            </div>
        );
    }
}


export default Notification;