/*
 * @Author: Virendra Patidar 
 * @Date: 2018-09-19 12:47:10 
 * @Last Modified by: Virendra Patidar
 * @Last Modified time: 2019-01-10 12:45:01
 */
import React, { PureComponent } from 'react'
import { withRouter } from 'react-router-dom'

import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import ListItemText from '@material-ui/core/ListItemText'
import Checkbox from '@material-ui/core/Checkbox'
import Input from '@material-ui/core/Input'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import * as ruleActions from 'actions/ruleAction'
import { showMessage } from 'actions/messageAction'
import { setPriorityList } from 'actions/commonAction'

class PriorityFilter extends PureComponent {
    _mounted = false
    state = {
        priorityList: []
    }

    componentDidMount() {
        this._mounted = true
        this.fetchPriorityList()
    }

    componentWillUnmount() {
        this._mounted = false
    }

    fetchPriorityList() {
        if (this.props.priorityList.length === 0) {
            this.props.actions.fetchPriorityList().
                then(result => {
                    if (this._mounted) {
                        if (result.success) {
                            this.props.setPriorityList(result.data)
                            this.setState({ priorityList: result.data, loaded: true });
                        } else {
                            let message = { message: result, showSnackbarState: true, variant: 'error' }
                            this.props.showMessage(message)
                        }
                    }
                });
        } else {
            this.setState({ priorityList: this.props.priorityList, loaded: true });
        }
    }

    render() {
        const { selectedPriority } = this.props
        const { priorityList } = this.state
        return (
            <FormControl className="multi-select">
                <Select
                    multiple
                    value={selectedPriority ? selectedPriority : []}
                    onChange={this.props.selectHandler('status')}
                    input={<Input id="select-multiple-checkbox" />}
                    renderValue={selected => selected.join(', ')}
                    className="select-feild"
                    MenuProps={{
                        style: {
                            top: '30px'
                        }
                    }}
                >
                    <MenuItem className="select-item default-item" key={'Select Priority'} value="Select Priority" disabled>
                    </MenuItem>
                    {
                        priorityList.map(function (item, index) {
                            return <MenuItem className="select-item" key={item} value={item} >
                                <Checkbox checked={selectedPriority ? selectedPriority.indexOf(item) > -1 : false} />
                                <ListItemText primary={item} />
                            </MenuItem>
                        })
                    }
                </Select>
            </FormControl>
        )
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators(Object.assign({}, ruleActions), dispatch),
        showMessage: message => {
            dispatch(showMessage(message))
        }, setPriorityList: priorityList => {
            dispatch(setPriorityList(priorityList))
        }
    };
}

const mapStateToProps = (state, ownProps) => {
    return {
        priorityList: state.commonReducer.priorityList
    }
}

export default withRouter((connect(mapStateToProps, mapDispatchToProps)(PriorityFilter)));