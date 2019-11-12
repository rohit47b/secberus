import React, { PureComponent } from 'react';
import Grid from '@material-ui/core/Grid'
import { CardWithTitle } from 'hoc/CardWithTitle'
import CreateHttpIntegration from './CreateHttpIntegration'
import HttpIntegrationList from './HttpIntegrationList'
import * as integrationActions from 'actions/integrationAction'
import { showMessage } from 'actions/messageAction'
import { setProgressBar } from 'actions/commonAction'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

class HttpIntegration extends PureComponent {

    httpVerbs = {1: 'POST', 2: 'GET'}
    authScheme = {1: 'Basic', 2: 'Bearer', 3: 'Digest', 4: 'Oauth2'}

    state = {
        loaded: true,
        currentIntegration: undefined
    };

    createIntegration = (data) => {
        this.setState({loaded: false})
        let headers = {}
        for (let i = 0; i < data.NHeaders; i++) {
            if (data['header_key_'+i] !== undefined && data['header_value_'+i] !== undefined) {
                const headerKey = data['header_key_'+i]
                const headerValue = data['header_value_'+i]
                headers[headerKey] = headerValue
            }
        }

        const payload = {
            "name": data.name,
            "enabled": true,
            "url": data.url,
            "http_verb": this.httpVerbs[data.HttpType],
        }

        if (headers.length > 0) {
            payload['http_headers'] = headers
        }
        if (data.authType !== 0) {
            payload['auth_scheme'] = this.authScheme[data.authType]
            /* payload['auth_details'] = {}
            switch(data.authType) {
                case 1:
                    payload['auth_details']['user_name'] = data.user_name
                    payload['auth_details']['password'] = data.password
                    break;
                case 2:
                    payload['auth_details']['bearer_auth_token'] = data.bearer_auth_token
                    break;
                case 3:
                    payload['auth_details']['user_name'] = data.user_name
                    payload['auth_details']['password'] = data.password
                    payload['auth_details']['realm'] = data.realm
                    break;
                case 4:
                    payload['auth_details']['client_id'] = data.client_id
                    payload['auth_details']['secret'] = data.secret
                    payload['auth_details']['scope'] = data.scope
                    break;
              } */
        }

        if (data.id === undefined) {
            this.props.actions.addIntegrationsHttp(payload).
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

            this.props.actions.updateIntegrationHttp(payload).
                then(result => {
                    if (typeof result !== 'string') {
                        let message = { message: 'Integration updated successfuly', showSnackbarState: true, variant: 'success' }
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
        this.props.actions.fetchIntegrationHttp(id).
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
        this.props.actions.deleteIntegrationHttp(id).
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
                    <CardWithTitle title={"Create / Update HTTP Integration"} bgImageClass={"card-integration"}>
                        {loaded && <CreateHttpIntegration createIntegration={this.createIntegration} currentIntegration={currentIntegration}/>}
                    </CardWithTitle>
                </Grid>
                <Grid item md={8}>
                    <CardWithTitle title={"Active HTTP Integrations"} bgImageClass={"card-integration"}>
                        {loaded && <HttpIntegrationList removeIntegration={this.removeIntegration} showCurrent={this.showCurrent} /> }
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
  
export default withRouter((connect(null, mapDispatchToProps)(HttpIntegration)));