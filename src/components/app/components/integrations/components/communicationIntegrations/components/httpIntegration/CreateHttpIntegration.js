import React, { PureComponent, Fragment } from 'react'
import { Field, reduxForm, change } from 'redux-form'
import Grid from '@material-ui/core/Grid'
import Input from '@material-ui/core/Input'
import MenuItem from '@material-ui/core/MenuItem'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'
import Button from '@material-ui/core/Button'
import { renderTextField } from 'reduxFormComponent'
import { cloneDeep } from "lodash"

const validate = values => {
    const errors = {}
    let requiredFields = ['name', 'url']
    /* switch (values['authType']) {
        case 1:
            requiredFields = requiredFields.concat(['user_name', 'password'])
            break;
        case 2:
            requiredFields = requiredFields.concat(['bearer_auth_token'])
            break;
        case 3:
            requiredFields = requiredFields.concat(['user_name', 'realm', 'password'])
            break;
        case 4:
            requiredFields = requiredFields.concat(['client_id', 'secret', 'scope'])
            break;
      } */

    return errors
}


class CreateHttpIntegration extends PureComponent {

    state = {
        HttpValue: 0,
        authName: 0,
        headers: [],
    };

    httpVerbs = {'POST': 1, 'GET': 2}
    authScheme = {'Basic': 1, 'Bearer': 2, 'Digest': 3, 'Oauth2': 4}

    componentDidMount() {
        if (this.props.currentIntegration !== undefined) {
            const ci = this.props.currentIntegration
            let current = {
                name: ci.name,
                url: ci.url,
            }
            const verb = this.httpVerbs[ci.verb] ? this.httpVerbs[ci.verb] : 0
            const auth = this.authScheme[ci.auth_scheme] ? this.authScheme[ci.auth_scheme] : 0
            this.setState({HttpValue: verb, authName: auth})
            if (auth > 0) {
                current['auth_details'] = {}
                switch(auth) {
                    case 1:
                        current['auth_details']['user_name'] = ci.user_name ? ci.user_name : ''
                        current['auth_details']['password'] = ci.password ? ci.password : ''
                        this.props.initialize({ 
                            id: ci.id,
                            NHeaders: 0, 
                            HttpType: current.verb, 
                            authType: current.auth, 
                            name: current.name, 
                            url: current.url ,
                            user_name: current['auth_details']['user_name'],
                            password: current['auth_details']['password']
                        });
                        break;
                    case 2:
                        current['auth_details']['bearer_auth_token'] = ci.bearer_auth_token ? ci.bearer_auth_token : ''
                        this.props.initialize({ 
                            id: ci.id,
                            NHeaders: 0, 
                            HttpType: current.verb, 
                            authType: current.auth, 
                            name: current.name, 
                            url: current.url ,
                            bearer_auth_token: current['auth_details']['bearer_auth_token'],
                        });
                        break;
                    case 3:
                        current['auth_details']['user_name'] = ci.user_name ? ci.user_name : ''
                        current['auth_details']['password'] = ci.password ? ci.password : ''
                        current['auth_details']['realm'] = ci.realm ? ci.realm : ''
                        this.props.initialize({ 
                            id: ci.id,
                            NHeaders: 0, 
                            HttpType: current.verb, 
                            authType: current.auth, 
                            name: current.name, 
                            url: current.url ,
                            user_name: current['auth_details']['user_name'],
                            password: current['auth_details']['password'],
                            realm: current['auth_details']['realm']
                        });
                        break;
                    case 4:
                        current['auth_details']['client_id'] = ci.client_id ? ci.client_id : ''
                        current['auth_details']['secret'] = ci.secret ? ci.secret : ''
                        current['auth_details']['scope'] = ci.scope ? ci.scope : ''
                        this.props.initialize({ 
                            id: ci.id,
                            NHeaders: 0, 
                            HttpType: current.verb, 
                            authType: current.auth, 
                            name: current.name, 
                            url: current.url ,
                            client_id: current['auth_details']['client_id'],
                            secret: current['auth_details']['secret'],
                            scope: current['auth_details']['scope']
                        });
                        break;
                  }
            } else {
                this.props.initialize({ id: ci.id, NHeaders: 0, HttpType: current.verb, authType: current.auth, name: current.name, url: current.url });
            }

            const headers = this.props.currentIntegration.headers
            if (Object.keys(headers).length > 0) {
                let altHeaders = []
                Object.keys(headers).map((header, index) => {
                    altHeaders.push('X')
                    this.props.dispatch(change('CreateHttpIntegration', "header_key_"+index, header));
                    this.props.dispatch(change('CreateHttpIntegration', "header_value_"+index, headers[header]));
                })
                this.props.dispatch(change('CreateHttpIntegration', 'NHeaders', altHeaders.length));
                this.setState({ headers: altHeaders })
            }
            
        } else {
            this.props.initialize({ NHeaders: 0, HttpType: 0, authType: 0 });
        }
    }

    handleHttpChange = (event) => {
        this.props.dispatch(change('CreateHttpIntegration', 'HttpType', event.target.value));
        this.setState({ HttpValue: event.target.value });
    }

    handleAuthChange = (event) => {
        this.props.dispatch(change('CreateHttpIntegration', 'authType', event.target.value));
        this.setState({ authName: event.target.value });

    }

    addHeader = () => {
        let altHeaders = cloneDeep(this.state.headers)
        altHeaders.push('X')
        this.props.dispatch(change('CreateHttpIntegration', 'NHeaders', altHeaders.length));
        this.setState({ headers: altHeaders })
    }

    removeHeader = () => {
        let altHeaders = cloneDeep(this.state.headers)
        altHeaders.pop();
        this.props.dispatch(change('CreateHttpIntegration', 'NHeaders', altHeaders.length));
        this.setState({ headers: altHeaders })
    }

    render() {
        const { HttpValue, authName, headers } = this.state
        const { handleSubmit, currentIntegration} = this.props;
        return (
            <Fragment>
                <form onSubmit={handleSubmit((values) => this.props.createIntegration(values))}>
                    <Grid container spacing={32}>
                        <Grid item md={6}>
                            <Field className="text-outline" component={renderTextField} name="name" type="text" placeholder="Enter Name" />
                        </Grid>
                        <Grid item md={6}>
                            <Field className="text-outline" component={renderTextField} name="url" type="text" placeholder="Enter URL" />
                        </Grid>
                    </Grid>
                    <Grid container spacing={32}>
                        <Grid item md={6}>
                            <FormControl className="multi-select single-select">
                                <Select
                                    value={HttpValue}
                                    name="http"
                                    onChange={this.handleHttpChange}
                                    input={<Input id="select-multiple" />}
                                    className="select-feild"
                                    MenuProps={{
                                        className: 'select-asset-dropdown'
                                    }}
                                >
                                    <MenuItem className="select-item select-item-text" value={0}>
                                        <span>HTTP verb</span>
                                    </MenuItem>
                                    <MenuItem className="select-item select-item-text" value={1}>
                                        <span>POST</span>
                                    </MenuItem>
                                    <MenuItem className="select-item select-item-text" value={2}>
                                        <span>GET</span>
                                    </MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                    <hr className="divider" />
                    <Grid container spacing={32}>
                        <Grid item md={6}>
                            <FormControl className="multi-select single-select">
                                <Select
                                    value={authName}
                                    name="auth"
                                    onChange={this.handleAuthChange}
                                    input={<Input id="select-multiple1" />}
                                    className="select-feild"
                                    MenuProps={{
                                        className: 'select-asset-dropdown'
                                    }}
                                >
                                    <MenuItem className="select-item select-item-text" value={0}>
                                        <span>Auth Scheme</span>
                                    </MenuItem>
                                    <MenuItem className="select-item select-item-text" value={1}>
                                        <span>Basic</span>
                                    </MenuItem>
                                    <MenuItem className="select-item select-item-text" value={2}>
                                        <span>Bearer</span>
                                    </MenuItem>
                                    <MenuItem className="select-item select-item-text" value={3}>
                                        <span>Digest</span>
                                    </MenuItem>
                                    <MenuItem className="select-item select-item-text" value={4}>
                                        <span>Oauth2</span>
                                    </MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                    {authName === 1 && <Fragment>
                        <Grid container spacing={32}>
                            <Grid item md={6}>
                                <Field className="text-outline" component={renderTextField} name="user_name" type="text" placeholder="Enter Username" />
                            </Grid>
                            <Grid item md={6}>
                                <Field className="text-outline" component={renderTextField} name="password" type="text" placeholder="Enter Password" />
                            </Grid>
                        </Grid>
                        <hr className="divider" />
                        {headers.map((header, index) => {
                            return(
                                <Grid container spacing={32}>
                                    <Grid item md={6}>
                                        <Field className="text-outline" component={renderTextField} name={"header_key_"+index} type="text" placeholder="Enter Header Key"/>
                                    </Grid>
                                    <Grid item md={6}>
                                        <Field className="text-outline" component={renderTextField} name={"header_value_"+index} type="text" placeholder="Enter Header value"/>
                                    </Grid>
                                    <hr/>
                                </Grid>
                            )
                        })}
                        <Grid container spacing={32}>
                            <Grid item md={6}>
                                <a href="javascript:void(0)" onClick={() => this.addHeader()}>Add Headers +</a>
                            </Grid>
                            {headers.length > 0 && <Grid item md={6}>
                                <a href="javascript:void(0)" onClick={() => this.removeHeader()}>Remove Headers -</a>
                            </Grid>}
                        </Grid>
                    </Fragment>
                    }
                    {authName === 2 && <Fragment>
                        <Grid container spacing={32}>
                            <Grid item md={6}>
                                <Field className="text-outline" component={renderTextField} name="bearer_auth_token" type="text" placeholder="Enter Bearer Auth Token" />
                            </Grid>
                        </Grid>
                        <hr className="divider" />
                        {headers.map((header, index) => {
                            return(
                                <Grid container spacing={32}>
                                    <Grid item md={6}>
                                        <Field className="text-outline" component={renderTextField} name={"header_key_"+index} type="text" placeholder="Enter Header Key"/>
                                    </Grid>
                                    <Grid item md={6}>
                                        <Field className="text-outline" component={renderTextField} name={"header_value_"+index} type="text" placeholder="Enter Header value"/>
                                    </Grid>
                                    <hr/>
                                </Grid>
                            )
                        })}
                        <Grid container spacing={32}>
                            <Grid item md={6}>
                                <a href="javascript:void(0)" onClick={() => this.addHeader()}>Add Headers +</a>
                            </Grid>
                            {headers.length > 0 && <Grid item md={6}>
                                <a href="javascript:void(0)" onClick={() => this.removeHeader()}>Remove Headers -</a>
                            </Grid>}
                        </Grid>
                    </Fragment>
                    }

                    { authName === 3 && <Fragment>
                        <Grid container spacing={32}>
                            <Grid item md={6}>
                                <Field className="text-outline" component={renderTextField} name="user_name" type="text" placeholder="Enter Username" />
                            </Grid>
                            <Grid item md={6}>
                                <Field className="text-outline" component={renderTextField} name="realm" type="text" placeholder="Enter Realm" />
                            </Grid>
                            <Grid item md={6}>
                                <Field className="text-outline" component={renderTextField} name="password" type="text" placeholder="Enter Password" />
                            </Grid>
                        </Grid>
                        <hr className="divider" />
                        {headers.map((header, index) => {
                            return(
                                <Grid container spacing={32}>
                                    <Grid item md={6}>
                                        <Field className="text-outline" component={renderTextField} name={"header_key_"+index} type="text" placeholder="Enter Header Key"/>
                                    </Grid>
                                    <Grid item md={6}>
                                        <Field className="text-outline" component={renderTextField} name={"header_value_"+index} type="text" placeholder="Enter Header value"/>
                                    </Grid>
                                    <hr/>
                                </Grid>
                            )
                        })}
                        <Grid container spacing={32}>
                            <Grid item md={6}>
                                <a href="javascript:void(0)" onClick={() => this.addHeader()}>Add Headers +</a>
                            </Grid>
                            {headers.length > 0 && <Grid item md={6}>
                                <a href="javascript:void(0)" onClick={() => this.removeHeader()}>Remove Headers -</a>
                            </Grid>}
                        </Grid>
                    </Fragment>
                    }
                    { authName === 4 && <Fragment>
                        <Grid container spacing={32}>
                            <Grid item md={6}>
                                <Field className="text-outline" component={renderTextField} name="client_id" type="text" placeholder="Enter Client ID" />
                            </Grid>
                            <Grid item md={6}>
                                <Field className="text-outline" component={renderTextField} name="secret" type="text" placeholder="Enter Secret" />
                            </Grid>
                            <Grid item md={6}>
                                <Field className="text-outline" component={renderTextField} name="scope" type="text" placeholder="Enter Scope" />
                            </Grid>
                        </Grid>
                        <hr className="divider" />
                        {headers.map((header, index) => {
                            return(
                                <Grid container spacing={32}>
                                    <Grid item md={6}>
                                        <Field className="text-outline" component={renderTextField} name={"header_key_"+index} type="text" placeholder="Enter Header Key"/>
                                    </Grid>
                                    <Grid item md={6}>
                                        <Field className="text-outline" component={renderTextField} name={"header_value_"+index} type="text" placeholder="Enter Header value"/>
                                    </Grid>
                                    <hr/>
                                </Grid>
                            )
                        })}
                        <Grid container spacing={32}>
                            <Grid item md={6}>
                                <a href="javascript:void(0)" onClick={() => this.addHeader()}>Add Headers +</a>
                            </Grid>
                            {headers.length > 0 && <Grid item md={6}>
                                <a href="javascript:void(0)" onClick={() => this.removeHeader()}>Remove Headers -</a>
                            </Grid>}
                        </Grid>
                    </Fragment>
                    }
                    <div className="card-action">
                        {currentIntegration === undefined ? 
                            <Button type="submit" disabled={HttpValue === 0} className="btn btn-primary">Create Integration</Button> 
                            : 
                            <Button type="submit" disabled={HttpValue === 0} className="btn btn-primary">Update Integration</Button>
                        }
                    </div>
                </form>
            </Fragment>
        )
    }
}

const connectWithRedux = CreateHttpIntegration;
const CreateHttpIntegrationReduxForm = reduxForm({ form: 'CreateHttpIntegration', validate, keepDirtyOnReinitialize: true, destroyOnUnmount: false, forceUnregisterOnUnmount: true, enableReinitialize: true })(connectWithRedux)

export default CreateHttpIntegrationReduxForm;
