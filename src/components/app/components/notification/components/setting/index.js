/*
 * @Author: Virendra Patidar 
 * @Date: 2018-11-16 14:55:42 
 * @Last Modified by: Virendra Patidar
 * @Last Modified time: 2019-05-22 13:50:13
 */
import React, { PureComponent, Fragment } from 'react'
import Card from '@material-ui/core/Card';
import Grid from '@material-ui/core/Grid';
import CardContent from '@material-ui/core/CardContent';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import Input from '@material-ui/core/Input';
import Typography from '@material-ui/core/Typography'
import AssetsNotificationList from './AssetsNotificationList'
import RuleNotificationList from './RuleNotificationList'
import UserActivityNotificationList from './UserActivityNotificationList'
import AlertNotificationList from './AlertNotificationList'
import PostureNotificationList from './PostureNotificationList'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import * as integrationActions from 'actions/integrationAction'
import { showMessage } from 'actions/messageAction'
import { setProgressBar } from 'actions/commonAction'

import SearchField from 'global/SearchField'

class NotificationSetting extends PureComponent {
    state = {
        value: 3,
        search: '',
        eventList: [],
        integrationList: [],
        loadedEvents: false,
        loadedIntegrations: false
    }

    handleChangeTab = (event, value) => {
        this.setState({ value: event.target.value });
    }

    searchHandler = name => event => {
        this.setState({ search: event.target.value })
    }

    searchHandlerClick = event => {
        this.setState({loadedEvents: false}, () => {
            this.fetchNotificationEvents()
        })
    }

    componentDidMount() {
        this._mounted = true
        this.props.setProgressBar(true)
        this.fetchNotificationEvents()
        this.fetchIntegrations()
    }

    fetchNotificationEvents() {
        this.props.actions.fetchNotificationEvents().
          then(result => {
            if (typeof result !== 'string') {
                let resultList = []
                if (this.state.search.replace(/\s/g, "") !== '') {
                    result.map(item => {
                        if (JSON.stringify(item).toLowerCase().indexOf(this.state.search.toLowerCase()) !== -1) {
                            resultList.push(item)
                        }
                    })
                } else {
                    resultList = result
                }
                this.setState({ eventList: resultList, loadedEvents: true })
            } else {
                console.log(' Error in fetching integrations :- ', result);
            }
          });
      }

    fetchIntegrations() {
        this.props.actions.fetchIntegrations().
            then(result => {
                if (typeof result !== 'string') {
                    this.setState({ integrationList: result, loadedIntegrations: true })
                } else {
                    console.log(' Error in fetching integrations :- ', result);
                }
            });
    }

    render() {
        const { value, eventList, integrationList, loadedEvents, loadedIntegrations, search } = this.state
        return (
            <Card className="card-wizard card-panel  card-inner card-notification card-single-asset">
                <div className="card-title">
                    <h3 className="mrT22 card-heading">Notifications Settings</h3>
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
                            {/*<MenuItem className="select-item select-item-text" key={0} value={0}>
                                <span>Assets Notifications</span>
                            </MenuItem>
                            {/* <MenuItem className="select-item select-item-text" key={1} value={1}>
                                <span>Rule Notifications</span>
                            </MenuItem>
                            <MenuItem className="select-item select-item-text" key={2} value={2}>
                                <span>User Activity Notifications</span>
                            </MenuItem> */}
                            <MenuItem className="select-item select-item-text" key={3} value={3}>
                                <span>Alert Notifications</span>
                            </MenuItem>
                            {/* <MenuItem className="select-item select-item-text" key={4} value={4}>
                                <span>Posture Notifications</span>
                            </MenuItem> */}
                        </Select>
                    </FormControl>
                </div>
                <CardContent className="card-body">
                    <Grid container spacing={16}>
                        <Grid item md={6} className="pdR0">
                            <Typography component="p" className="fnt-13">
                                *Notification setting will be applied to the cloud accounts selected in the header navigation bar above.
                            </Typography>
                        </Grid>
                        <Grid item md={6}>
                            <SearchField value={search} handleChange={this.searchHandler} handleClick={this.searchHandlerClick} />
                        </Grid>
                    </Grid>
                        {(loadedEvents && loadedIntegrations && value === 0) &&
                            <Fragment>
                                <Grid container spacing={16} className="grid-container">
                                    <Grid item md={12}>
                                        <AssetsNotificationList />
                                    </Grid>
                                </Grid>
                            </Fragment>
                        }
                        {(loadedEvents && loadedIntegrations && value === 1) &&
                            <Fragment>
                                <Grid container spacing={16} className="grid-container">
                                    <Grid item md={12}>
                                        <RuleNotificationList />
                                    </Grid>
                                </Grid>
                            </Fragment>
                        }

                        {(loadedEvents && loadedIntegrations && value === 2) &&
                            <Fragment>
                                <Grid container spacing={16} className="grid-container">
                                    <Grid item md={12}>
                                        <UserActivityNotificationList />
                                    </Grid>
                                </Grid>
                            </Fragment>
                        }
                        {(loadedEvents && loadedIntegrations && value === 3) &&
                            <Fragment>
                                <Grid container spacing={16} className="grid-container">
                                    <Grid item md={12}>
                                        <AlertNotificationList eventList={eventList} integrationList={integrationList} search={search}/>
                                    </Grid>
                                </Grid>
                            </Fragment>
                        }

                        {(loadedEvents && loadedIntegrations && value === 4) &&
                            <Fragment>
                                <Grid container spacing={16} className="grid-container">
                                    <Grid item md={12}>
                                        <PostureNotificationList />
                                    </Grid>
                                </Grid>
                            </Fragment>
                        }
                </CardContent>
            </Card>
        )
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
      actions: bindActionCreators(Object.assign({}, integrationActions), dispatch),
      showMessage: message => {
        dispatch(showMessage(message))
      }, setProgressBar: isProgress => {
        dispatch(setProgressBar(isProgress))
      }
    };
  }
  
export default withRouter((connect(null, mapDispatchToProps)(NotificationSetting)));