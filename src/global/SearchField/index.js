/*
 * @Author: Virendra Patidar 
 * @Date: 2018-10-01 11:33:36 
 * @Last Modified by:   Virendra Patidar 
 * @Last Modified time: 2018-10-01 11:33:36 
 */
import React from 'react'

import Input from '@material-ui/core/Input'
import InputAdornment from '@material-ui/core/InputAdornment'
import FormControl from '@material-ui/core/FormControl'

const SearchField = (props) => {
    return (
        <FormControl className="search-box">
            <Input
                className="search-feild"
                endAdornment={<InputAdornment className="input-search" position="end">
                    <button className="serach-btn" onClick={props.handleClick ? props.handleClick : undefined}>
                        <i className="fa fa-search" aria-hidden="true"></i>
                    </button></InputAdornment>}
                placeholder="Search"
                value={props.value ? props.value : ''}
                onChange={props.handleChange('search')}
            />
        </FormControl>
    );
}

export default SearchField