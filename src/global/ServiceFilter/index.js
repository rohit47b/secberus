/*
 * @Author: Virendra Patidar 
 * @Date: 2018-09-19 12:47:10 
 * @Last Modified by: Virendra Patidar
 * @Last Modified time: 2018-12-06 16:22:39
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

import * as integrationActions from 'actions/integrationAction'
import { showMessage } from 'actions/messageAction'

class ServiceFilter extends PureComponent {
    _mounted = false
    state = {
        serviceList: [],
        allServiceNames: []
    }

    componentDidMount() {
        this._mounted = true
        this.fetchServiceList()
    }

    componentWillUnmount() {
        this._mounted = false
    }

    fetchServiceList = () => {
        if (this.props.serviceList && this.props.serviceList.length === 0) {
            this.props.actions.fetchServiceList().
                then(result => {
                    if (this._mounted) {
                        if (result.success) {
                            this.setServiceData(result.data)
                        } else {
                            let message = { message: result, showSnackbarState: true, variant: 'error' }
                            this.props.showMessage(message)
                        }
                    }
                });
        }
        else {
            this.setServiceData(this.props.serviceList)
        }

    }

    setServiceData = (list) => {
        let allServiceNames = []

        list.map((service, index) => {
            allServiceNames.push(service.service_name)
        })
        this.setState({ serviceList: list, allServiceNames }, () => { })
    }


    render() {
        const { selectServices } = this.props
        const { serviceList } = this.state
        return (
            <FormControl className="multi-select">
                <Select
                    multiple
                    value={selectServices ? selectServices : []}
                    onChange={this.props.selectHandler('service')}
                    input={<Input id="select-multiple-checkbox" />}
                    renderValue={selected => selected.join(', ')}
                    className="select-feild"
                    MenuProps={{
                        style: {
                            top: '30px'
                        }
                    }}
                >
                    <MenuItem className="select-item default-item" key={'Select Service'} value="Select Service" disabled>
                    </MenuItem>
                    {
                        serviceList.map(function (item, index) {
                            return <MenuItem className="select-item" key={item.service_name} value={item.service_name} >
                                <Checkbox checked={selectServices ? selectServices.indexOf(item.service_name) > -1 : false} />
                                <ListItemText primary={item.service_name} />
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
        actions: bindActionCreators(Object.assign({}, integrationActions), dispatch),
        showMessage: message => {
            dispatch(showMessage(message))
        }
    };
}

const mapStateToProps = (state, ownProps) => ({
    serviceList: state.commonReducer.serviceList,
})

export default withRouter((connect(mapStateToProps, mapDispatchToProps)(ServiceFilter)));