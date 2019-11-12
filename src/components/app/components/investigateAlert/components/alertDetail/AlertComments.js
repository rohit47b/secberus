import React, { PureComponent, Fragment } from 'react'
import { Field, reduxForm } from 'redux-form'
import { renderTextArea } from 'reduxFormComponent'
import { CardWithTitle } from 'hoc/CardWithTitle'
import { Typography, Button } from '@material-ui/core'
import { Grid } from '@material-ui/core'

const validate = values => {
    const errors = {}
    const requiredFields = []

    requiredFields.forEach(field => {
        if (!values[field]) {
            errors[field] = 'This field is required'
        }
    })
    return errors
}

class AlertDetail extends PureComponent {
    state = {comment: ''}

    componentDidMount () {
        this.props.initialize({ comment: '' });
    }

    getComment = event =>{
        this.setState({comment: event.target.value})
    }

    saveComment(comment) {
        this.props.initialize({ comment: '' });
        this.props.addComment(comment)
    }

    render() {
        const { comment } = this.state
        return (
            <CardWithTitle title={"Alert Comments"} bgImageClass={"card-alert"}>
                <div className="comment-message">
                {this.props.comments.map(function(comment) {
                        return(
                        <div className="mrB10">
                            <strong>{comment.email}</strong>
                            <Typography component="p">{comment.comment}</Typography>
                            <div className="timestamp text-right">
                                {new Date(comment.timestamp).toLocaleString()}
                            </div>
                        </div>
                        )
                    })}

                    <Grid container spacing={24}>
                        <Grid item sm={12} className="text-right">
                            <Field className="text-outline mrB10" component={renderTextArea} name="comment" type="text" placeholder="Add Comment" rows="4" value={comment} onChange={this.getComment}/>
                            <Button className="btn btn-primary btn-md" disabled={this.state.comment.replace(/\s/g, "") === ''} color="primary" onClick={() => this.saveComment(comment)} >
                                Add
                                </Button>
                        </Grid>
                    </Grid>
                </div>

            </CardWithTitle>
        );
    }
}

const connectWithRedux = AlertDetail;
const AlertDetailReduxForm = reduxForm({ form: 'AlertDetail', validate, keepDirtyOnReinitialize: true, destroyOnUnmount: false, forceUnregisterOnUnmount: true, enableReinitialize: true })(connectWithRedux)

export default AlertDetailReduxForm

