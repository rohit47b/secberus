import React, { PureComponent } from 'react';
import {HelperPopup} from 'hoc/HelperPopup'
import ClickAwayListener from '@material-ui/core/ClickAwayListener';

class LabelWithHelper extends PureComponent  {
    state = {
        anchorEl: null,
        open: false,
        placement: null,
      }

      handleOpenPopper =  (placement) => (event) => {
        const { currentTarget } = event;
        this.setState(state => ({
          anchorEl: currentTarget,
          open: state.placement !== placement || !state.open,
          placement,
        }))
      }

      handleClosePopper =()=>{
        this.setState(state => ({
            open:false
        }))
      }

      handleClickAway = () => {
        this.setState({
          open: false,
        });
      };

    render(){
        const { anchorEl, open, placement } = this.state;
        const {title,content,textColor,isHelper,message} = this.props
        return(
          <ClickAwayListener onClickAway={this.handleClickAway}>
            <div className="sub-head">
                <span className={"heading-black "+textColor}>
                    <strong>{title}</strong>
                    { isHelper !== false && <span onClick={this.handleOpenPopper('bottom-start')} className={open == true ? "alert-icon mrL10  active" :'alert-icon mrL10' }><i className="fa fa-question-circle" aria-hidden="true"></i></span>}
                </span>
              <HelperPopup title={message} content={content} anchorEl={anchorEl}  open={open} placement={placement} handleClosePopper={this.handleClosePopper}/>
            </div>
          </ClickAwayListener>
        )
    }
}

export default LabelWithHelper