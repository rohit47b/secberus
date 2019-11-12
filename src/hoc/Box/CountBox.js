import React from 'react'

export const CountBox = function (props) {
    const { title, nextLineTitle, cssClass, count } = props
    return (<div className="policy-count">
        <span className="title">{title} <br /> {nextLineTitle}</span>
        <span className={cssClass + ' count'}>{count}</span>
    </div>)
};
