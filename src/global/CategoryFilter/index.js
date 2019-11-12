/*
 * @Author: Virendra Patidar 
 * @Date: 2018-09-19 12:47:10 
 * @Last Modified by:   Virendra Patidar 
 * @Last Modified time: 2018-09-19 12:47:10 
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

class CategoryFilter extends PureComponent {
    _mounted = false
    state = {
        ruleCategoryList: []
    }

    componentDidMount() {
        this._mounted = true
        this.fetchRuleCategory()
    }

    componentWillUnmount() {
        this._mounted = false
    }

    fetchRuleCategory() {
        this.props.actions.fetchRuleCategory().
            then(result => {
                if (this._mounted) {
                    if (result.success) {
                        this.setState({ ruleCategoryList: result.data, loaded: true });
                    } else {
                        let message = { message: result, showSnackbarState: true, variant: 'error' }
                        this.props.showMessage(message)
                    }
                }
            });
    }

    render() {
        const { category } = this.props
        const { ruleCategoryList } = this.state
        return (
            <FormControl className="multi-select">
                <Select
                    multiple
                    value={category}
                    onChange={this.props.selectHandler('category')}
                    input={<Input id="select-multiple-checkbox" />}
                    renderValue={selected => selected.join(', ')}
                    className="select-feild"
                    MenuProps={{
                        style: {
                            top: '30px'
                        }
                    }}
                >
                    <MenuItem className="select-item default-item" key={'Select Category'} value="Select Category" disabled>
                    </MenuItem>
                    {
                        ruleCategoryList.map(function (ruleCtegory, index) {
                            return <MenuItem className="select-item" key={ruleCtegory} value={ruleCtegory} >
                                <Checkbox checked={category.indexOf(ruleCtegory) > -1} />
                                <ListItemText primary={ruleCtegory} />
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
        }
    };
}

export default withRouter((connect(null, mapDispatchToProps)(CategoryFilter)));