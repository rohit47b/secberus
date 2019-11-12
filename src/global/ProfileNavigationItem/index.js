/*
 * @Author: Virendra Patidar 
 * @Date: 2018-10-16 11:14:15 
 * @Last Modified by: Virendra Patidar
 * @Last Modified time: 2019-04-23 16:32:50
 */
import React, { PureComponent } from 'react';
import { withRouter } from 'react-router-dom'

import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import Popover from '@material-ui/core/Popover';

import { connect } from "react-redux"
import { store } from 'client'
import { bindActionCreators } from 'redux'
import { cloneDeep } from "lodash"

import history from 'customHistory'

import * as logoutActions from 'actions/logoutAction'

class ProfileNavigationItem extends PureComponent {
  _mounted = false
  state = {
    popoverEl: null,
    profile_picture: this.props.profile.profile_picture
  };

  currentValue = this.props.profile.profile_picture
  componentDidMount() {
    this._mounted = true
    this.unsubscribe = store.subscribe(this.receiveFilterData)
  }

  componentWillUnmount() {
    this._mounted = false
  }

  receiveFilterData = data => {

    const currentState = store.getState()
    const previousValue = this.currentValue
    this.currentValue = currentState.userReducer.profile.profile_picture

    if (
      this.currentValue && previousValue !== this.currentValue
    ) {
      const profile_picture = cloneDeep(currentState.userReducer.profile.profile_picture)
      if (this._mounted) {
        this.setState({ profile_picture })
      }
    }
  }



  handleProfilePopOver = event => {
    event.preventDefault();
    event.stopPropagation();
    let target = event.currentTarget;
    this.setState({
      popoverEl:target,
    });
    event.persist();
  };

  handleClosePopOver = (redirectUrl) => {
    this.setState({
      popoverEl: null,
    }, () => {
      history.push(redirectUrl)
    });
  };

  handleClosePopOverLogout = () => {
    this.setState({
      popoverEl: null,
    }, () => {
      this.logout()

    });
  };

  logout = () => {
    this.props.actions.logout().
      then(result => {
        console.log(' Logout user', result);
      });
  }

  render() {
    const { popoverEl, profile_picture } = this.state;
    const { profile } = this.props
    return (
      <div className="notification-dropdown profile-dropdown">
        <div>
          <Button
            onClick={(e) => this.handleProfilePopOver(e)}
            className="pro-pic"
          >
            <img alt="Profile Picture" src={(profile_picture !== null && profile_picture !== undefined) ? profile_picture : '/assets/images/user.png'} />
          </Button>

          <Popover
            open={Boolean(popoverEl)}
            anchorEl={popoverEl}
            onClose={this.handleClosePopOver}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}

          >
            <MenuList>
              <MenuItem onClick={() => this.handleClosePopOver('/app/setting/profile')}>Profile</MenuItem>
              {/* <MenuItem onClick={() => this.handleClosePopOver('/app/setting/profile')}>My account</MenuItem> */}
              <MenuItem onClick={() => this.logout()}>Logout</MenuItem>
            </MenuList>

          </Popover>
        </div>
      </div>
    );
  }
}



const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(logoutActions, dispatch)
  };
}
const mapStateToProps = (state, ownProps) => ({
  profile: state.userReducer.profile,
})

export default withRouter((connect(mapStateToProps, mapDispatchToProps)(ProfileNavigationItem)));