import React, { PureComponent } from 'react'
import { Field, reduxForm } from 'redux-form'
import { SubmissionError } from 'redux-form'

import history from 'customHistory';
import APPCONFIG from 'constants/Config'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import { Button, Card, CardContent, CardHeader, Typography, Grid } from '@material-ui/core'

import * as signupActions from 'actions/signupAction'

import Loader from 'global/Loader'

import { renderTextField } from 'reduxFormComponent'



const validate = values => {
    const errors = {}
    const requiredFields = [
        'email',
    ]

    requiredFields.forEach(field => {
        if (!values[field]) {
            errors[field] = 'This field is required'
        }
    })
    if (
        values.email &&
        !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)
    ) {
        errors.email = 'Invalid email address'
    }

    return errors
}



class Resent extends PureComponent {

    state = {
        errorMessage: '',
        countryList: [],
        countryValue: '',
        countrySuggestions: [],
        selectedCountry: '',

        stateList: [],
        stateValue: '',
        stateSuggestions: [],
        selectedState: {},
        isProgress: false
    }

    componentDidMount() {
        this.props.reset();
    }

    signUpFormSubmit = (values) => {
        this.setState({ isProgress: true })
        if (this.props.uidb64) {
            let payload = values;
            payload['uuid'] = this.props.uidb64
            return this.props.actions.collaboratorCreate(payload).
                then(result => {
                    if (result) { this.setState({ isProgress: false }); throw new SubmissionError(result) };
                });
        } else {
            return this.props.actions.signup(values).
                then(result => {
                    if (result) { this.setState({ isProgress: false }); throw new SubmissionError(result) };
                });
        }
    }

    render() {

        const { handleSubmit, invalid, submitting, pristine } = this.props;
        const { errorMessage, isProgress } = this.state;


        return (
            <Grid item sm={3} className="form-panel">
                <Card className="side-login-panel">
                    <CardHeader
                        avatar={
                            <img alt="Company Logo" src={APPCONFIG.company_logo_path} className="logo-icon" />
                        }
                        className="logo-qaud"
                    />
                    <CardContent className="quad-content">
                        <Typography className="mrB15" gutterBottom variant="headline" component="label">
                            REGISTER WITH SECBERUS
                            <br /><span className="validation-error">{errorMessage}</span>
                        </Typography>

                        <form className="form-qaud" onSubmit={handleSubmit((values) => this.signUpFormSubmit(values))}>
                            <Grid item sm={12} className="qaud-grid">
                                <Field className="text-field" component={renderTextField} name="email" type="text" controllabel="Email" />
                            </Grid>
                            <Button type="submit" disabled={invalid || submitting || pristine} variant="contained" className="btn btn-success">Resent Mail</Button>
                        </form>

                        <div className="mrT25 login-foo">
                            <Button onClick={() => history.push('/login')} variant="outlined" className="btn btn-outline">Sign In</Button>
                        </div>
                    </CardContent>
                </Card>
                {isProgress && <Loader />}
            </Grid>
        )
    }
}

const mapDispatchToProps =(dispatch)=> {
    return {
        actions: bindActionCreators(Object.assign({}, signupActions), dispatch)
    };
}


// export default reduxForm({
//     form: 'resentmail',
//     validate,
//     destroyOnUnmount: false,
// })(connect(null, mapDispatchToProps)(Resent));


const connectWithRedux = withRouter((connect(null, mapDispatchToProps)(Resent)));
const resentReduxForm = reduxForm({ form: 'resentmail', validate, destroyOnUnmount: false, })(connectWithRedux)

export default resentReduxForm;