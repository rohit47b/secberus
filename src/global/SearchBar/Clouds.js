/*
 * @Author: Virendra Patidar 
 * @Date: 2018-08-09 10:23:03 
 * @Last Modified by: Virendra Patidar
 * @Last Modified time: 2019-04-23 16:35:04
 */

import React from 'react'
import Config from 'constants/Config'

const Clouds = (props) => {
    const { selectCloud } = props
    return (<div className="btn-sec">
                <Button></Button>
            </div>
            );
}

const renderClouds = (props) => {
    const { selectCloud } = props
    return (props.clouds.map((cloud, index) => {
        return (<Button></Button>)
    }));
}

export default Clouds;