/*
 * @Author: Virendra Patidar 
 * @Date: 2018-11-16 14:55:42 
 * @Last Modified by: Virendra Patidar
 * @Last Modified time: 2019-05-22 13:50:13
 */
import React, { PureComponent } from 'react'
import Card from '@material-ui/core/Card';
import Grid from '@material-ui/core/Grid';
import { Checkbox } from '@material-ui/core'
import CardContent from '@material-ui/core/CardContent';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import Input from '@material-ui/core/Input';

import AllNotificationList from './AllNotificationList'

import SearchField from 'global/SearchField'

class SeeALLNotification extends PureComponent {
    state = {
        value: 0,
        search: '',
    }

    handleChangeTab = (event, value) => {
        this.setState({ value: event.target.value });
    }

    searchHandler = name => event => {
        this.setState({ search: event.target.value })
    }

    render() {
        const { value } = this.state
        return (
            <Card className="card-wizard card-panel card-inner card-notification card-tab">
                <div className="card-title">
                    <h3 className="card-heading">All Notifications</h3>
                    <FormControl className="multi-select single-select">
                        <Select
                            value={value}
                            name="tabs"
                            onChange={this.handleChangeTab}
                            input={<Input id="select-multiple" />}
                            className="select-feild"
                            MenuProps={{
                                style: {
                                    top: '40px'
                                }
                            }}
                        >
                            <MenuItem className="select-item select-item-text" key={0} value={0}>
                                <span>All</span>
                            </MenuItem>
                            <MenuItem className="select-item select-item-text" key={1} value={1}>
                                <span>Assets Notifications</span>
                            </MenuItem>
                            <MenuItem className="select-item select-item-text" key={2} value={2}>
                                <span>Rule Notifications</span>
                            </MenuItem>
                            <MenuItem className="select-item select-item-text" key={3} value={3}>
                                <span>User Activity Notifications</span>
                            </MenuItem>
                            <MenuItem className="select-item select-item-text" key={4} value={4}>
                                <span>Alert Notifications</span>
                            </MenuItem>
                            <MenuItem className="select-item select-item-text" key={5} value={5}>
                                <span>Posture Notifications</span>
                            </MenuItem>
                        </Select>
                    </FormControl>
                </div>
                {value === 0 &&
                    <CardContent className="card-body">
                        <Grid container spacing={16}>
                            <Grid item md={12} className="pdR0 d-flex align-item-center justify-flex-end">
                                <span>Mark all as read</span>
                                <Checkbox
                                    tabIndex={-1}
                                    disableRipple
                                    color="primary"
                                    className="checkbox-blue mrR20"  
                                />
                                <SearchField handleChange={this.searchHandler} />
                            </Grid>
                        </Grid>
                        <Grid container spacing={16} className="grid-container">
                            <Grid item md={12}>
                                <AllNotificationList />
                            </Grid>
                        </Grid>

                    </CardContent>
                }
            </Card>
        )
    }
}



export default SeeALLNotification