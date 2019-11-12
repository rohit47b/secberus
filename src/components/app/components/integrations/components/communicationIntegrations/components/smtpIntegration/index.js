import React, { PureComponent } from 'react';
import Grid from '@material-ui/core/Grid'
import { CardWithTitle } from 'hoc/CardWithTitle'
import CreateSmtpIntegration from './CreateSmtpIntegration'
import SmtpIntegrationList from './SmtpIntegrationList'
import * as integrationActions from 'actions/integrationAction'
import { showMessage } from 'actions/messageAction'
import { setProgressBar } from 'actions/commonAction'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

class SmtpIntegration extends PureComponent {

    state = {
        loaded: true,
        currentIntegration: undefined
    };
    
    createIntegration = (data) => {
        this.setState({loaded: false})

        let CC = []
        let BCC = []
        for (let i = 0; i < data.NAddCC; i++) {
            CC.push(data['cc_email_'+i])
        }
        for (let i = 0; i < data.NAddBcc; i++) {
            BCC.push(data['bcc_email_'+i])
        }

        const payload = {
            name: data.subject,
            enabled: true,
            to: data.email.replace(/\s/g, "").split(','),
            cc: CC,
            bcc: BCC
        }
        if (data.id === undefined) {
            this.props.actions.addIntegrationsSmtp(payload).
            then(result => {
                if (typeof result !== 'string') {
                    let message = { message: 'Integration added successfuly', showSnackbarState: true, variant: 'success' }
                    this.setState({loaded: true})
                    this.props.showMessage(message)
                } else {
                    console.log(' Error in fetching integrations :- ', result);
                    let message = { message: result, showSnackbarState: true, variant: 'error' }
                    this.props.showMessage(message)
                }
            });
        } else {
            payload['id'] = data.id
            this.props.actions.updateIntegrationSmtp(payload).
            then(result => {
                if (typeof result !== 'string') {
                    let message = { message: 'Integration udpated successfuly', showSnackbarState: true, variant: 'success' }
                    this.setState({loaded: true})
                    this.props.showMessage(message)
                } else {
                    console.log(' Error in fetching integrations :- ', result);
                    let message = { message: result, showSnackbarState: true, variant: 'error' }
                    this.props.showMessage(message)
                }
            });
        }
    }

    showCurrent = (id) => {
        this.setState({loaded: false})
        this.props.actions.fetchIntegrationSmtp(id).
          then(result => {
            if (typeof result !== 'string') {
                this.setState({ currentIntegration: result}, () => (
                    this.setState({loaded: true})
                ))
            } else {
                console.log(' Error in fetching integrations :- ', result);
                this.setState({loaded: true})
            }
          });
    }

    removeIntegration = (id) => {
        this.setState({loaded: false})
        this.props.actions.deleteIntegrationSmtp(id).
          then(result => {
            if (result.replace(/\s/g, "") === '') {
                let message = { message: 'Integration deleted successfuly', showSnackbarState: true, variant: 'success' }
                this.setState({loaded: true})
                this.props.showMessage(message)
            } else {
                console.log(' Error in fetching integrations :- ', result);
                let message = { message: result, showSnackbarState: true, variant: 'error' }
                this.props.showMessage(message)
            }
          });
    }

    render() {
        const { loaded, currentIntegration } = this.state

        return (
            <Grid container spacing={16} className="grid-container">
                <Grid item md={4}>
                    <CardWithTitle title={"Create / Update SMTP Integration"} bgImageClass={"card-integration"}>
                        {loaded && <CreateSmtpIntegration createIntegration={this.createIntegration} currentIntegration={currentIntegration} /> }
                    </CardWithTitle>
                </Grid>
                <Grid item md={8}>
                    <CardWithTitle title={"Active SMTP Integrations"} bgImageClass={"card-integration"}>
                        {loaded && <SmtpIntegrationList removeIntegration={this.removeIntegration} showCurrent={this.showCurrent} /> }
                    </CardWithTitle>
                </Grid>
            </Grid>
           
        );
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
  
export default withRouter((connect(null, mapDispatchToProps)(SmtpIntegration)));