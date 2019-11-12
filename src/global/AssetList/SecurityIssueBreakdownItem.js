/*
 * @Author: Virendra Patidar 
 * @Date: 2018-09-19 12:21:02 
 * @Last Modified by: Virendra Patidar
 * @Last Modified time: 2019-04-23 16:30:34
 */
import React, { PureComponent } from "react"

import Button from '@material-ui/core/Button'

import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import { BarChart } from 'react-d3-components'

import { fetchServiceIconPath } from 'utils/serviceIcon'



class SecurityIssueBreakdownItem extends PureComponent {

    state = {
        open: false
    };

    
    handleToggle = (data, description, sum, service, state,service_name) => {
        this.setState(prevState => ({
            open: !prevState.open
        }));

        this.props.toggleDrawer(data, description, sum, service, state,service_name)
    };

    handleClose = event => {
        if (this.anchorEl.contains(event.target)) {
            return;
        }

        this.setState({ open: false });
    };
    componentDidMount() {
        if (this.props.index === 0) {
            const { service, state, description,service_name } = this.props.issueBreakdown;
            const data = [{
                label: service,
                values: [{ x: 'Error - ' + state.ERROR, y: state.ERROR }, { x: 'FAIL - ' + state.FAIL, y: state.FAIL }, { x: 'PASS - ' + state.PASS, y: state.PASS }]
            }];
            const sum = state.ERROR + state.FAIL + state.PASS
            this.handleToggle(data, description, sum, service, state,service_name)
        }
    }


    render() {
        const { open } = this.state;
        const { service, state, description, service_name } = this.props.issueBreakdown;
        const { activeService } = this.props
        const data = [{
            label: service,
            values: [{ x: 'ERROR -' + state.ERROR, y: state.ERROR }, { x: 'FAIL - ' + state.FAIL, y: state.FAIL }, { x: 'PASS - ' + state.PASS, y: state.PASS }]
        }];
        const scale = d3.scale.ordinal().range(['#6E6E6E', '#ec4e4e', '#19c681']);
        const sum = state.ERROR + state.FAIL + state.PASS

        return (
            <div className="asset-item" key={service}>
                {
                    (localStorage.getItem('isRunDefaultPolicy') === 'false' && localStorage.getItem('temp_account_name')===this.props.filterData.selectAccount.account_name)  ?
                        '' : <Button
                            buttonRef={node => {
                                this.anchorEl = node;
                            }}
                            aria-owns={open ? 'menu-list-grow' : null}
                            aria-haspopup="true"
                            onClick={() => this.handleToggle(data, description, sum, service, state,service_name)}
                            className={activeService === service && open === true ? 'btn-icon btn-bg-white active' : 'btn-icon btn-bg-white'}
                        >
                            <span className="icon-text"> <img alt={service_name} src={fetchServiceIconPath(service)} />{service_name ? service_name : service}</span>

                            <BarChart
                                data={data}
                                width={30}
                                height={20}
                                margin={{ top: 0, bottom: 0, left: 0, right: 0 }}
                                colorByLabel={false}
                                colorScale={scale}
                                // onClick={() => this.props.toggleDrawer(data, description, sum, service)}
                            />
                        </Button>
                }
            </div>
        );
    }
}
 
const mapStateToProps = (state, ownProps) => ({
    filterData: state.uiReducer.filterData,
  })


export default withRouter((connect(mapStateToProps, null)(SecurityIssueBreakdownItem)));