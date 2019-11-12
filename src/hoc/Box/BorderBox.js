import React from 'react'

export const BorderBox = function (props) {
    const { content,count} = props
    return (<div className="border-box">
        <span className="title">{content} </span>
    </div>)
};
