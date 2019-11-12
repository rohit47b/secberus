import React, { PureComponent, Fragment } from 'react'
import Button from '@material-ui/core/Button'
import { Grid } from '@material-ui/core'
import Dialog from '@material-ui/core/Dialog'
import Switch from '@material-ui/core/Switch'
import { Field, reduxForm } from 'redux-form'
import DialogContent from '@material-ui/core/DialogContent'
import CancelIcon from '@material-ui/icons/HighlightOff'
import DialogTitle from '@material-ui/core/DialogTitle'
import { renderTextArea } from 'reduxFormComponent'

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

class AddNoteDialogBox extends PureComponent {
    state = {comment: ''}

    componentDidMount () {
        this.props.initialize({ comment: '' });
    }

    getComment = event =>{
        this.setState({comment: event.target.value})
    }

    saveComment(alertId, comment) {
        this.props.initialize({ comment: '' });
        this.props.addComment(alertId, comment)
    }

   render(){
    const { isOpen, handleNoteDialogClose, alert, isEnableNote } = this.props
    let exposure = undefined
    if (alert !== undefined) {
        exposure = new Date(alert.create_timestamp*1000);
    }
    
    const { comment } = this.state

    return (
        <div>
        {alert !== undefined &&
            <Dialog
                open={isOpen}
                onClose={handleNoteDialogClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                className="add-dialog"
                maxWidth="sm"
                fullWidth={true}
            >
                <DialogTitle className="add-dialog-title" id="alert-dialog-title">
                    <strong>Notes</strong>
                    <CancelIcon className="icon-cancel" onClick={handleNoteDialogClose} />
                </DialogTitle>
                <DialogContent className="add-dialog-content">
                <Switch
                    checked={isEnableNote === false}
                    onChange={this.props.enableDisableNote}
                    value={isEnableNote}
                    className={isEnableNote === false ? "select-control-green active" : "select-control-red"}
                />
                    <div>
                        <span className="alert-list-title">Alert ID :</span>
                        <span>
                            <strong>{alert.id}</strong>
                        </span>
                    </div>
                    <div>
                        <span className="alert-list-title">Priority :</span>
                        <span>
                            <strong>{alert.rule.priority.name}</strong>
                        </span>
                    </div>
                    <div>
                        <span className="alert-list-title">Description :</span>
                        <span>
                            <strong>{alert.rule.description}</strong>
                        </span>
                    </div>
                    <div>
                        <span className="alert-list-title">Exposure :</span>
                        <span>
                            <strong>{exposure.toLocaleString()}</strong>
                        </span>
                    </div>
                    <div>
                        <span className="alert-list-title">Region :</span>
                        <span>
                            <strong>{alert.asset.data.region}</strong>
                        </span>
                    </div>
                    <div className="d-flex align-item-flex-end mrT10 mrB10">
                        <strong className="fnt-16">Comments</strong> <hr className="comment-line" />
                    </div>
                    <div className="comment-message">
                        {alert.comments.map((comment,index)=> {
                            return(
                            <div className="mrB5" key={index}>
                                <strong>{comment.email}</strong>
                                <p>{comment.comment}</p>
                                <div className="timestamp">
                                    {new Date(comment.timestamp).toLocaleString()}
                                </div>
                            </div>
                            )
                        })}
                        <Grid container spacing={24}>
                            <Grid item sm={12} className="text-right">
                                <Field className="text-outline mrB10" component={renderTextArea} name="comment" type="text" placeholder="Enter New Note" rows="4" value={comment} onChange={this.getComment} />
                                <Button className="btn btn-primary btn-md" disabled={this.state.comment.replace(/\s/g, "") === ''} color="primary" onClick={() => this.saveComment(alert.id, comment)}>
                                    Save
                                </Button>
                            </Grid>
                        </Grid>
                    </div>
                </DialogContent>

            </Dialog>
        }
        </div>
    )
   }
}

const connectWithRedux = AddNoteDialogBox;
const AddNoteReduxForm = reduxForm({ form: 'AddNote', validate, keepDirtyOnReinitialize: true, destroyOnUnmount: false, forceUnregisterOnUnmount: true, enableReinitialize: true })(connectWithRedux)

export default AddNoteReduxForm;

