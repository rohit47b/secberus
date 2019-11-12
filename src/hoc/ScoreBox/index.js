import React from 'react'
import LabelWithHelper from 'hoc/Label/LabelWithHelper'

export const ScoreBox = function (props) {
    const { title,count,addClass } = props
    return (<div className="score-count">
    <div className="score-box">
        <div className="mrB5">
           {title}
        </div>
        <div className={"d-flex middle-count " + addClass}>
            <div className="score-count-issue">
                <div className="count">
                   {count}
                </div>
            </div>
        </div>
    </div>
</div>)
}
