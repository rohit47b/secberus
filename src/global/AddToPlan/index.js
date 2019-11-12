/*
 * @Author: Virendra Patidar 
 * @Date: 2019-02-28 12:56:10 
 * @Last Modified by: Virendra Patidar
 * @Last Modified time: 2019-05-21 14:49:27
 */
import { setProgressBar, setAlertsPlan } from 'actions/commonAction';
import { showMessage } from 'actions/messageAction';
import * as remediationActions from 'actions/remediationAction';
import React, { PureComponent, Fragment } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import Fade from '@material-ui/core/Fade';
import Popper from '@material-ui/core/Popper';
import { List, ListItem, ListItemText, Checkbox, Button, Radio } from '@material-ui/core'
import { cloneDeep, pull } from "lodash";
import Loader from 'global/Loader'
import SuccessMessageDialogHoc from 'hoc/SuccessMessageDialog';

class AddToPlan extends PureComponent {

    state = {
        planDataList: [],
        selectedPlanId: [],
        selectPlan: '',
        isProgress: false,
        isSubmitted: false,
        successDialog: false
    }
    componentDidMount() {
        const filterData = this.props.filterData
        if (filterData.selectAccount.id !== 'all' && filterData.selectAccount.id !== undefined) {
            this.fetchRemediationPlans(filterData)
        }
    }


    fetchRemediationPlans(filterData) {
        let payload = { account_id: filterData.selectAccount.id, sort_by: 'status', sort_order: 'ASC', limit: 5, offset: 0 }

        this.props.actions.fetchRemediationPlans(payload).
            then(result => {
                if (typeof result !== 'string') {
                    this.setState({ planDataList: result, loading: false })
                } else {
                    console.log(' Error in fetching remediation plans :- ', result);
                }
            });
    }


    addToPlanChangeHandler = (planId) => {
        this.setState({ selectPlan: planId })
    };

    addToPlan = () => {
        this.setState({ isProgress: true })
        let payload = this.props.selectedAlerts
        this.props.actions.addToPlan(payload, this.props.filterData.selectAccount.id, this.state.selectPlan).
            then(result => {
                this.props.setAlertsPlan([])
                this.setState({ isProgress: false, isSubmitted: true, successDialog: true }, () => {
                    // this.props.handleCloseDialog()
                })
            });
    }

    handelCloseSuccessDialog = () => {
        this.setState({ successDialog: false }, () => {
            this.props.handleSuccess()
        })
    }

    render() {
        const { planDataList, isProgress, isSubmitted, successDialog, selectPlan } = this.state;
        const { popperEl, openPopOver, placement, handleOpenDialog } = this.props
        return (
            <Fragment>

                {isSubmitted === true ? <SuccessMessageDialogHoc isOpen={successDialog} handelCloseDialog={this.handelCloseSuccessDialog} content={'You have successfully added to plan'} /> :
                    <Popper className={'addToPlanPepper'} key={'alerts'} style={{ zIndex: '10000' }} open={openPopOver} anchorEl={popperEl} placement={placement} transition>
                        {({ TransitionProps }) => (
                            <Fade {...TransitionProps} timeout={350}>
                                <div>
                                    {isProgress === true && <Loader />}
                                    <List className="list-filter width-auto min-width-250 pdT0">
                                        {planDataList.length > 0 && <ListItem>
                                            <span className="fnt-13"><strong>Add to Existing Plans</strong></span>
                                        </ListItem>}
                                        {planDataList.slice(1, 5).map((plan, index) => {
                                            return <ListItem className="list-filter-item" dense button key={plan.id}>
                                                <Radio
                                                    checked={selectPlan === plan.id}
                                                    onChange={() => this.addToPlanChangeHandler(plan.id)}
                                                    value={plan.id}
                                                    name="plans"
                                                    aria-label={plan.id}
                                                    className="filter-radio"
                                                />

                                                <ListItemText className="list-filter-text" primary={plan.name} />
                                            </ListItem>
                                        })}

                                        {selectPlan !== '' && <ListItem className="list-filter-foo">
                                            <span className="link-hrf fnt-13" onClick={this.addToPlan}><strong>Add</strong></span>
                                        </ListItem>}

                                        <ListItem className="list-filter-foo">
                                            <span className="link-hrf fnt-13" onClick={handleOpenDialog}><strong>Create Remediation Plan</strong></span>
                                        </ListItem>
                                    </List>
                                </div>
                            </Fade>
                        )}
                    </Popper>}
            </Fragment>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(Object.assign({}, remediationActions), dispatch),
        showMessage: message => {
            dispatch(showMessage(message))
        }, setProgressBar: isProgress => {
            dispatch(setProgressBar(isProgress))
        }, setAlertsPlan: alerts_plan => {
            dispatch(setAlertsPlan(alerts_plan))
        }
    };
}


const mapStateToProps = (state, ownProps) => {
    return {
        filterData: state.uiReducer.filterData,
    }
}

const AddToPlanRedux = withRouter((connect(mapStateToProps, mapDispatchToProps)(AddToPlan)));
export default AddToPlanRedux;
