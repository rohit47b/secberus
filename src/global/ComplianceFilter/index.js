/*
 * @Author: Virendra Patidar 
 * @Date: 2018-09-19 12:47:10 
 * @Last Modified by: Virendra Patidar
 * @Last Modified time: 2019-01-10 12:41:32
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

import * as commonActions from 'actions/commonAction'
import { showMessage } from 'actions/messageAction'
import { setComplianceList } from 'actions/commonAction'

class ComplianceFilter extends PureComponent {
    _mounted = false
    state = {
        complianceList: []
    }

    componentDidMount() {
        this._mounted = true
        this.fetchCompliances()
    }

    componentWillUnmount() {
        this._mounted = false
    }

    fetchCompliances() {
        if(this.props.complianceList.length===0){
        this.props.actions.fetchCompliances().
            then(result => {
                if (this._mounted) {
                    if (result.success) {
                        this.props.setComplianceList(result.data)
                        this.setState({ complianceList: result.data, loaded: true });
                    } else {
                        let message = { message: result, showSnackbarState: true, variant: 'error' }
                        this.props.showMessage(message)
                    }
                }
            });
        } else {
            this.setState({ complianceList: this.props.complianceList, loaded: true });
        }
    }

    render() {
        const { selectedCompliance } = this.props
        const { complianceList } = this.state
        return (
            <FormControl className="multi-select mrR10">
                <Select
                    multiple
                    value={selectedCompliance}
                    onChange={this.props.selectHandler('compliance')}
                    input={<Input id="select-multiple-checkbox" />}
                    renderValue={selected => selected.join(', ')}
                    className="select-feild"
                    MenuProps={{
                        style: {
                            top: '30px'
                        }
                    }}
                >
                    <MenuItem className="select-item default-item" key={'Select Compliance'} value="Select Compliance" disabled>
                    </MenuItem>
                    {
                        complianceList.map(function (compliance, index) {
                            return <MenuItem className="select-item" key={compliance.value} value={compliance.value} >
                                <Checkbox checked={selectedCompliance.indexOf(compliance.value) > -1} />
                                <ListItemText primary={compliance.name} />
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
        actions: bindActionCreators(Object.assign({}, commonActions), dispatch),
        showMessage: message => {
            dispatch(showMessage(message))
        },setComplianceList: complianceList => {
            dispatch(setComplianceList(complianceList))
        }
    };
}
const mapStateToProps = (state, ownProps) => {
    return {
        complianceList: state.commonReducer.complianceList
    }
}


export default withRouter((connect(mapStateToProps, mapDispatchToProps)(ComplianceFilter)));