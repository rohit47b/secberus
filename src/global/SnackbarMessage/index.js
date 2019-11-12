import React, { Component,Fragment } from 'react';

import PropTypes from 'prop-types'
import classNames from 'classnames'
import history from 'customHistory'
import CheckCircleIcon from '@material-ui/icons/CheckCircle'
import ErrorIcon from '@material-ui/icons/Error'
import InfoIcon from '@material-ui/icons/Info'
import CloseIcon from '@material-ui/icons/Close'
import green from '@material-ui/core/colors/green'
import amber from '@material-ui/core/colors/amber'
import IconButton from '@material-ui/core/IconButton'
import Snackbar from '@material-ui/core/Snackbar'
import SnackbarContent from '@material-ui/core/SnackbarContent'
import WarningIcon from '@material-ui/icons/Warning'
import { withStyles } from '@material-ui/core/styles'
import { Button } from '@material-ui/core';

const styles = theme => ({
  close: {
    width: theme.spacing.unit * 4,
    height: theme.spacing.unit * 4,
  },
  success: {
    backgroundColor: green[600],
  },
  error: {
    backgroundColor: theme.palette.error.dark,
  },
  info: {
    backgroundColor: theme.palette.primary.dark,
  },
  warning: {
    backgroundColor: amber[700],
  },
});


const variantIcon = {
  success: CheckCircleIcon,
  warning: WarningIcon,
  error: ErrorIcon,
  info: InfoIcon,
};

const styles1 = theme => ({
  success: {
    backgroundColor: green[600],
  },
  error: {
    backgroundColor: theme.palette.error.dark,
  },
  info: {
    backgroundColor: theme.palette.primary.dark,
  },
  warning: {
    backgroundColor: amber[700],
  },
  icon: {
    fontSize: 20,
  },
  iconVariant: {
    opacity: 0.9,
    marginRight: theme.spacing.unit,
  },
  message: {
    display: 'flex',
    alignItems: 'center',
  },
});

const MySnackbarContent =(props)=> {
  const { classes, className, message, onClose, variant,reportData,onClick, ...other } = props;
  const Icon = variantIcon[variant];

  return (
    <SnackbarContent
      className={classNames(classes[variant], className)} 
      aria-describedby="client-snackbar"
      message={
        <Fragment>
        <div id="client-snackbar" className={classes.message}>
            <Icon className={classNames(classes.icon, classes.iconVariant)} />
            {message}
        </div>
         <div className="text-center mrT10">{reportData!==undefined && <Button className="btn btn-primary btn-sm" onClick={()=>onClick(reportData.id)}>View Plan </Button>}</div>
         </Fragment>
      }
      action={[
        <IconButton
          key="close"
          aria-label="Close"
          color="inherit"
          className={classes.close + " alert-close-icon"}
          onClick={onClose}
        >
          <CloseIcon className={classes.icon} />
        </IconButton>,
      ]}
      {...other}
    />
  );
}

MySnackbarContent.propTypes = {
  classes: PropTypes.object.isRequired,
  className: PropTypes.string,
  message: PropTypes.node,
  onClose: PropTypes.func,
  variant: PropTypes.oneOf(['success', 'warning', 'error', 'info']).isRequired,
};

const MySnackbarContentWrapper = withStyles(styles1)(MySnackbarContent);

const styles2 = theme => ({
  margin: {
    margin: theme.spacing.unit,
  },
});


class SnackbarMessage extends Component {
  state = {
    open: this.props.open,
  };

  static getDerivedStateFromProps(nextProps, state) {
    return { open: nextProps.open, message: nextProps.message }
  }


  componentDidUpdate = (nextProps, prevState) => {
    if (this.props.open !== nextProps.open) {
      this.setState({ open: nextProps.open })
    }
  }
  componentDidMount() {
    this.setState((pre, post) => ({ open: pre.open }))
  }

  handleClick = () => {
    this.setState({ open: true });
  };

  handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    this.setState({ open: false });
  };

  redirectToRemediationPlan=(planId)=>{
      history.push({
        pathname: '/app/reports/plan/'+planId,
        state: { planId: planId }
      })
      this.props.handleClose()
  }

  render() {
    const { classes, message, variant ,reportData} = this.props;
    const { open } = this.state;
    return (
      <div>


        <Snackbar
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
          open={open}
          autoHideDuration={10000}
          onClose={this.props.handleClose}
        >
          <MySnackbarContentWrapper
            onClose={this.props.handleClose}
            variant={variant}
            message={message}
            reportData={reportData}
            onClick={this.redirectToRemediationPlan}
           
          />
        </Snackbar>
      </div>
    );
  }
}

SnackbarMessage.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SnackbarMessage);