import React, { PureComponent, Fragment } from 'react'
import { Field, reduxForm, change } from 'redux-form'
import Grid from '@material-ui/core/Grid'
import Input from '@material-ui/core/Input'
import MenuItem from '@material-ui/core/MenuItem'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'
import DeleteIcon from '@material-ui/icons/Delete'
import Button from '@material-ui/core/Button'
import { cloneDeep } from "lodash"

import { renderTextField, renderTextArea } from 'reduxFormComponent'

const validate = values => {
    const errors = {}
    const requiredFields = ['subject', 'email']

    requiredFields.forEach(field => {
        if (!values[field]) {
            errors[field] = 'This field is required'
        }
    })
    return errors
}

class CreateSmtpIntegration extends PureComponent {

    state = {
        recipientName: 0,
        addCC:[],
        addBcc:[]
    };

    _addCC = []
    _addBcc = []

    componentDidMount() {
        if (this.props.currentIntegration !== undefined) {
            const ci = this.props.currentIntegration
            let current = {
                subject: ci.name,
                email: ci.to[0],
            }
            this.props.initialize({ id: ci.id, NAddCC: 0, NAddBcc: 0, subject:current.subject, email: current.email  });
            if (ci.cc !== null && ci.cc !== undefined && ci.cc.length > 0) {
                let altAddCC = []
                ci.cc.map((value, index) => {
                    altAddCC.push('X')
                    this._addCC.push('')
                    this._addCC[index] = value
                    this.props.dispatch(change('CreateSmtpIntegration', 'cc_email_'+index, this._addCC[index] ? this._addCC[index] : ''));
                })
                this.props.dispatch(change('CreateSmtpIntegration', 'NAddCC', altAddCC.length));
                this.setState({ addCC: altAddCC })
            }
            if (ci.bcc !== null && ci.bcc !== undefined && ci.bcc.length > 0) {
                let altAddBcc = []
                ci.bcc.map((value, index) => {
                    altAddBcc.push('X')
                    this._addBcc.push('')
                    this._addBcc[index] = value
                    this.props.dispatch(change('CreateSmtpIntegration', 'bcc_email_'+index, this._addBcc[index] ? this._addBcc[index] : ''));
                })
                this.props.dispatch(change('CreateSmtpIntegration', 'NAddBcc', altAddBcc.length));
                this.setState({ addBcc: altAddBcc })
            }
        } else {
            this.props.initialize({ NAddCC: 0, NAddBcc: 0 });
        }
    }

    handleRecipientChange = (event) => {
        this.setState({ recipientName: event.target.value });

    }

    handleAddCC =()=> {
        let altAddCC = cloneDeep(this.state.addCC)
        altAddCC.push('X')
        this._addCC.push('')
        this.props.dispatch(change('CreateSmtpIntegration', 'NAddCC', altAddCC.length));
        this.setState({ addCC: altAddCC })
    }
    
    setAddCC = event => {
        this._addCC[event.target.name.split('_')[2]] = event.target.value
	}

    removeAddCC =(index)=> {
        let altAddCC = cloneDeep(this.state.addCC)
        altAddCC.splice(index, 1)
        this._addCC.splice(index, 1)
        if (this._addCC.length > index) {
            let roud = 0
            while(roud <= this._addCC.length+1) {
                this.props.dispatch(change('CreateSmtpIntegration', 'cc_email_'+roud, this._addCC[roud] ? this._addCC[roud] : ''));
                roud++
            }
        }
        this.props.dispatch(change('CreateSmtpIntegration', 'NAddCC', altAddCC.length));
        this.setState({ addCC: altAddCC })
    }
    
    handleAddBcc =()=> {
        let altAddBcc = cloneDeep(this.state.addBcc)
        altAddBcc.push('X')
        this._addBcc.push('')
        this.props.dispatch(change('CreateSmtpIntegration', 'NAddBcc', altAddBcc.length));
        this.setState({ addBcc: altAddBcc })
    }

    setAddBcc = event => {
        this._addBcc[event.target.name.split('_')[2]] = event.target.value
	}
    
    removeAddBcc =(index)=> {
        let altAddBcc = cloneDeep(this.state.addBcc)
        altAddBcc.splice(index, 1)
        this._addBcc.splice(index, 1)
        if (this._addBcc.length > index) {
            let roud = 0
            while(roud <= this._addBcc.length+1) {
                this.props.dispatch(change('CreateSmtpIntegration', 'bcc_email_'+roud, this._addBcc[roud] ? this._addBcc[roud] : ''));
                roud++
            }
            
        }
        this.props.dispatch(change('CreateSmtpIntegration', 'NAddBcc', altAddBcc.length));
        this.setState({ addBcc: altAddBcc })
    }
    
    render() {
        const { recipientName,addCC,addBcc  } = this.state
        const { handleSubmit, currentIntegration} = this.props;

        return (
            <Fragment>
                <form onSubmit={handleSubmit((values) => this.props.createIntegration(values))}>
                    <Grid container spacing={32}>
                        <Grid item md={12}>
                            <Field className="text-outline" component={renderTextField} name="subject" type="text" placeholder="Enter Name for Integration" />
                        </Grid>
                    </Grid>
                    <Grid container spacing={32}>
                        <Grid item md={11}>
                            <Field className="text-outline" component={renderTextField} name="email" type="email" placeholder="Enter Email Address " fixedlabel="To:" />
                        </Grid>
                        {/* <Grid item md={1} className="d-flex align-item-center pdL0">
                            <DeleteIcon className="icon-action pdT15" />
                        </Grid> */}
                    </Grid>
                    <Grid container spacing={32}>
                        <Grid item md={12}>
                            <a onClick={this.handleAddCC} href="javascript:void(0)">Add CC</a>
                        </Grid>
                    </Grid>
                    {addCC.map((item, index) => {
                        return(
                            <Grid container spacing={32}>
                                <Grid item md={11}>
                                    <Field className="text-outline" component={renderTextField} name={"cc_email_"+index} type="email" placeholder="Enter Email Address"  fixedlabel="CC:" onChange={this.setAddCC} />
                                </Grid>
                                <Grid item md={1} className="d-flex align-item-center pdL0">
                                    <DeleteIcon className="icon-action pdT15" onClick={() => this.removeAddCC(index)} />
                                </Grid>
                            </Grid>
                        )
                    })}
                    <Grid container spacing={32}>
                        <Grid item md={12}>
                            <a onClick={this.handleAddBcc} href="javascript:void(0)">Add BCC</a>
                        </Grid>
                    </Grid>
                    {addBcc.map((item, index) => {
                        return(
                            <Grid container spacing={32}>
                                <Grid item md={11}>
                                    <Field className="text-outline" component={renderTextField} name={"bcc_email_"+index} type="email" placeholder="Enter Email Address" fixedlabel="BCC:" onChange={this.setAddBcc} />
                                </Grid>
                                <Grid item md={1} className="d-flex align-item-center pdL0">
                                    <DeleteIcon className="icon-action pdT15" onClick={() => this.removeAddBcc(index)}/>
                                </Grid>
                            </Grid>
                        )
                    })}

                    <div className="card-action">
                        {currentIntegration === undefined ? 
                            <Button type="submit" className="btn btn-primary">Create Integration</Button> 
                            : 
                            <Button type="submit" className="btn btn-primary">Update Integration</Button>
                        }
                    </div>
                </form>
            </Fragment>
        )
    }
}

const connectWithRedux = CreateSmtpIntegration;
const CreateSmtpIntegrationReduxForm = reduxForm({ form: 'CreateSmtpIntegration', validate, keepDirtyOnReinitialize: true, destroyOnUnmount: false, forceUnregisterOnUnmount: true, enableReinitialize: true })(connectWithRedux)

export default CreateSmtpIntegrationReduxForm;
