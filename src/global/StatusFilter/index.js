/*
 * @Author: Virendra Patidar 
 * @Date: 2018-12-07 15:08:19 
 * @Last Modified by: Virendra Patidar
 * @Last Modified time: 2018-12-18 14:48:58
 */

import React from 'react'

import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import ListItemText from '@material-ui/core/ListItemText'
import Checkbox from '@material-ui/core/Checkbox'
import Input from '@material-ui/core/Input'

import STATIC_DATA from 'data/StaticData'

export const StatusFilter = (props) => {
    const { selectedStatus } = props
    return (
        <FormControl className="multi-select">
            <Select
                multiple
                value={selectedStatus ? selectedStatus : []}
                onChange={props.selectHandler('status')}
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
                    STATIC_DATA.STATUS_LIST.map(function (item, index) {
                        return <MenuItem className="select-item" key={item.display_name} value={item.display_name} >
                            <Checkbox checked={selectedStatus ? selectedStatus.indexOf(item.display_name) > -1 : false} />
                            <ListItemText primary={item.display_name} />
                        </MenuItem>
                    })
                }
            </Select>
        </FormControl>
    )
}
