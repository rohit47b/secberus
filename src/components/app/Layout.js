/*
 * @Author: Virendra Patidar 
 * @Date: 2018-09-19 13:40:02 
 * @Last Modified by: Virendra Patidar
 * @Last Modified time: 2019-05-24 20:34:26
 */
import React from 'react'

import ReactDOM from 'react-dom';
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'

import { connect } from "react-redux"
import { withRouter } from 'react-router-dom'
import { bindActionCreators } from 'redux'
import { store } from 'client';
import { cloneDeep } from "lodash";

import Header from 'global/Header'
import Sidebar from 'global/Sidebar'
import Loader from 'global/Loader'
import SnackbarMessage from 'global/SnackbarMessage'

import { showMessage } from 'actions/messageAction'
import * as securityPolicyActions from 'actions/securityPolicyAction'
import { setOpen, setDimentions } from 'actions/commonAction'

import history from 'customHistory'
import Intercom from 'react-intercom';
import ReportBugDialog from 'global/ReportBugDialog'

class Layout extends React.Component {

  _mounted = false

  handleResize = this.handleResize.bind(this);
  state = {
    open: this.props.open,
    addClass: false,
    layoutClass: '',
    isRunPolicy: false,
    userIntercom: null, 
    sideTop: 0,
    bodyHeight: 0,
    prevBodyHeight: 0,
    currentZoom: '100%',
    currentPercent: 100,
    zoomChanged: false
  };

  componentDidMount() {
    this._mounted = true
    this.timer = setInterval(this.handleResize, 500);
    window.addEventListener('resize', this.handleResize);
    if (this.state.open) {
      this.setState(prevState => ({addClass: true, layoutClass: 'drawer-responsive'}));
    }
    this.setIntercom()
    this.unsubscribe = store.subscribe(this.receiveFilterData)
  }

  receiveFilterData = data => {

    const currentState = store.getState()
    const previousValue = this.currentValue
    this.currentValue = currentState.uiReducer.openReportBug
    if (
        this.currentValue && previousValue !== this.currentValue
    ) {
        const openReportBug = cloneDeep(currentState.uiReducer.openReportBug)
       console.log('openReportBug',openReportBug)

    }
}

  componentWillUnmount() {
    this._mounted = false
    window.removeEventListener('resize', this.handleResize);
  }

  //  ------------------- API Call start----------------------

  fetchJobId = () => {
    history.push('/app/integrations/clouds')
  }

  setIntercom = () => {
    let user = null
    if (localStorage.getItem('profile') !== undefined && localStorage.getItem('profile') !== null && localStorage.getItem('profile') !== {} && user === null) {
      let profile = JSON.parse(localStorage.getItem('profile'));
      user = {
        name: profile.first_name + " " + profile.last_name,
        email: profile.email,
        created_at: profile.create_date
      };
    }
    this.setState({userIntercom: user});
  }

  //  ------------------- API Call END----------------------

 // ----------------------- Custom logic method START -----------------------------*

  runPolicy = () => {
    this.fetchJobId()
  }

  isRunPolicyClose = () => {
    this.setState(prevState => ({
      isRunPolicy: !prevState.isRunPolicy
    }));
  }

  handleDrawerOpen = () => {
    this.setState(prevState => ({
      addClass: !prevState.addClass, open: true, layoutClass: 'drawer-responsive'
    }));
    this.props.setOpen(true)
  };

  handleDrawerClose = () => {
    this.setState({ open: false, addClass: false, layoutClass: '' });
    this.props.setOpen(false)
  };

  handleClose = () => {
    let message = { message: '', showSnackbarState: false, variant: this.props.message.variant }
    this.props.showMessage(message)
  }


 

   // ----------------------- Custom logic method END -----------------------------*

  render() {

    const { children, isProgress,token,openReportBug } = this.props;
    const { open, userIntercom, sideTop, bodyHeight} = this.state
    const { showSnackbarState, message, variant,reportData } = this.props.message

    const show_msg_content= typeof message !== 'string' ? '':message

    let boxClass = ["main-app-container " + this.state.layoutClass];
    if (this.state.addClass) {
      boxClass.push('toggle-container');
    }

    let hidden = {
      display: this.state.isRunPolicy ? "none" : "block"
    }
    let sideTopValue = sideTop
    if (sideTopValue === 0) {
      sideTopValue = 50
    }
    let heightValue = 'auto'
    let sideTopStyle = {
      marginTop: (sideTopValue)+((900-bodyHeight)*.1)+'px',
      height: heightValue,
      top: '0px'
    };
    /* let bodyZoom = this.state.currentZoom
    let currentheight = this.state.bodyHeight+50
    if (currentheight > 0 && currentheight < 1000 && this._mounted) {
      let errorMargin = (currentheight*(this.state.currentPercent/100)) - this.state.prevBodyHeight
      if (errorMargin <= -5 || errorMargin >= 5) {
        let stringheight = currentheight.toString()
        bodyZoom = stringheight.substring(0, 2)+'.'+stringheight.substring(2)+'%'
        let percent = parseFloat(stringheight.substring(0, 2)+'.'+stringheight.substring(2))
        this._mounted = false
        this.setState({currentZoom:bodyZoom, currentPercent:percent, prevBodyHeight:currentheight}, () => {
          this._mounted = true
        })
      }
    } else if (currentheight >= 1000 && this.state.prevBodyHeight !== 100 && this._mounted){
      this._mounted = false
      this.setState({currentZoom:'100%', currentPercent:100, prevBodyHeight:100}, () => {
        this._mounted = true
      })
    }
    let BodyStyle = {
      zoom: this.state.currentZoom
    } */

    return (
      <div ref={"BodyRef"} className={boxClass.join(' ')}>
        <Header open={open} handleDrawerClose={this.handleDrawerClose} handleDrawerOpen={this.handleDrawerOpen} ref={"HeaderRef"}/>
        <Sidebar open={open} handleDrawerClose={this.handleDrawerClose} sideTop={sideTop}/>
        <section id="page-container" className="app-page-container" style={sideTopStyle} sideTop={sideTop}>
          <div className="app-content-wrapper">
          {
               /*  (localStorage.getItem('existCloud') === false || localStorage.getItem('existCloud') === null) && token.role && token.role === 'user' ? */
               false ?
            <div className="alert-box">
            <Grid container spacing={24} style={hidden} className="mrB15">
                  <Grid item sm={12} className="pdB0">
                    <div className="danger-box">
                      In order to see security analytics data and compliance reporting, please integrate your cloud
                      <Button variant="contained" className="btn btn-white" onClick={this.runPolicy}>
                        Connect Cloud
                                </Button>
                      <a className="close-icon" href="javascript:void(0)" onClick={this.isRunPolicyClose}>
                        <i className="fa fa-times-circle"></i>
                      </a>
                    </div>
                  </Grid> 
            </Grid>
            </div>
            : ''}
            
            {openReportBug === true ? <ReportBugDialog isOpen={openReportBug}/> :children}
            {/* {isProgress && <Loader />} */}
          </div>
          <SnackbarMessage
            className="server-error"
            open={showSnackbarState}
            message={show_msg_content}
            reportData={reportData}
            variant={variant}
            handleClose={this.handleClose}
          />

        </section>
        {userIntercom && <Intercom appID={process.env.INTERCOM_APP_ID} { ...userIntercom } /> }
       
      </div>
    );
  }

  handleResize(e) {
    if (this.state.sideTop > 0) {
        clearInterval(this.timer);
    }
    let elem = ReactDOM.findDOMNode(this.refs.HeaderRef);
    let elemBody = ReactDOM.findDOMNode(this.refs.BodyRef);
    if (elem !== undefined && elem !== null && elemBody !== undefined && elemBody !== null) {
        let height = elem.offsetHeight;
        let heightBody = window.document.body.offsetHeight;
        this.setState({
            sideTop: height,
            bodyHeight: heightBody,
        }, () => {
          this.props.setDimentions({sideTop: height, bodyHeight: heightBody})
        });
    }
}
}


const mapStateToProps = (state, ownProps) => ({
  message: state.messageReducer.message,
  isProgress: state.commonReducer.isProgress,
  token: state.userReducer.token,
  open: state.uiReducer.open,
  openReportBug: state.uiReducer.openReportBug,
  dimentions: state.uiReducer.dimentions,
})

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(Object.assign({}, securityPolicyActions), dispatch),
    showMessage: message => {
      dispatch(showMessage(message))
    },
    setOpen: open => {
      dispatch(setOpen(open))
    },
    setDimentions: dimentions => {
      dispatch(setDimentions(dimentions))
    },
    setOpenReportBug: open => {
      dispatch(setOpenReportBug(open))
    },
  };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Layout))
