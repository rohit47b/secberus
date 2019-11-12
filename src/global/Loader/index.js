/*
 * @Author: Virendra Patidar 
 * @Date: 2018-10-01 11:35:18 
 * @Last Modified by:   Virendra Patidar 
 * @Last Modified time: 2018-10-01 11:35:18 
 */
import React from 'react'

import CircularProgress from '@material-ui/core/CircularProgress'

const Loader = (props) => {
    return (
        <div className="loader">
            <CircularProgress />
        </div>
    );
}

export default Loader; 