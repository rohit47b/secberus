import React from 'react';
import PropTypes from 'prop-types';

const CustomBarLabel =(props)=> {
    const {x, y, width, height, value} = props;

    return (
        <g>
            <text  rotate={360} fontSize={9} x={x + width / 2} y={y} fill="#fff" textAnchor="middle" dy={20}>{`${value}`}</text>;
            <text rotate={360} fontSize={9} x={x + width / 2} y={y} fill="#fff" textAnchor="middle" dy={30}>$</text>;
        </g>
    )
}

CustomBarLabel.propTypes = {
    x: PropTypes.number,
    y: PropTypes.number,
    payload: PropTypes.object,
};

export default CustomBarLabel;
