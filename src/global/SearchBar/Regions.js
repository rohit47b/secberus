/*
 * @Author: Virendra Patidar 
 * @Date: 2018-08-09 10:23:00 
 * @Last Modified by: Virendra Patidar
 * @Last Modified time: 2019-02-21 14:31:21
 */

import React from 'react'

const Regions = (props) => {
    const { activeTab } = props
    return (<span>
        {activeTab === 'region' && <span className="services">
            {renderRegions(props)}
        </span>
        }
    </span>);
}

const renderRegions = (props) => {
    const { selectedRegion } = props
    return (props.regions.map((region, index) => {
        let customClass = ''
        if(region.region_code === selectedRegion.region_code){
            customClass='active'
        }
        return <a key={index} className={customClass} href="javascript:void(0)" onClick={() => props.setSelectRegion(region)}>
            <span>{region.region_code.toUpperCase()}</span>
        </a>
    }));
}

export default Regions;