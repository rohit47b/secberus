/*
 * @Author: Virendra Patidar 
 * @Date: 2018-09-28 12:35:17 
 * @Last Modified by: Virendra Patidar
 * @Last Modified time: 2018-10-11 11:03:51
 */
import React from 'react'

import Fade from '@material-ui/core/Fade';
import Popper from '@material-ui/core/Popper';

export const HelperPopup = (props) => {
    const { content,anchorEl, open, placement,handleClosePopper,addClass,title } = props
    return (
        <Popper style={{zIndex:'1'}} open={open} anchorEl={anchorEl} placement={placement} transition>
        {({ TransitionProps }) => (
            <Fade {...TransitionProps} timeout={350}>
                <div className={"popper-card " + addClass}>
                    <div className="popper-head">
                        <span className="popper-title">{title}</span>
                        <span onClick={handleClosePopper} className="close-icon"><i className="fa fa-times-circle" aria-hidden="true"></i></span>
                    </div>
                      <div  className="popper-body" dangerouslySetInnerHTML={{ __html:  content.replace(/\n/g, '<br />') }}  />
                </div>
            </Fade>
        )}
    </Popper>
    )
}