/*
 * @Author: Virendra Patidar 
 * @Date: 2018-11-16 16:42:28 
 * @Last Modified by: Virendra Patidar
 * @Last Modified time: 2019-04-23 16:17:22
 */
import React, { PureComponent } from 'react'

import { Grid, Radio } from '@material-ui/core'
import Button from '@material-ui/core/Button'

class Step1 extends PureComponent {

    state = {
        selectedValue: ''
    }

    handleChange = event => {
        this.setState({ selectedValue: event.target.value });
    };


    render() {
        const { selectedValue, selectedCloud } = this.state
        return (
            <Grid container spacing={24}>
                <Grid item sm={12}>
                    <div className="stepp-head">
                        <h4 className="mrB10">Cloud Environment</h4>
                        <p className="mrT0 modal-txt">Please select your organization's cloud provider.</p>
                    </div>
                </Grid>
                <div className="service-box">
                    <Grid item sm={12} className="radio-box sec-services">
                        <Radio
                            checked={selectedValue === 'a'}
                            onChange={this.handleChange}
                            value="a"
                        />
                        <div className={selectedValue === 'a' ? 'active' : 'box-border'}>
                            <i className="mt-icon material-icons">
                                done_all
                            </i>
                            <div className="cloud-service">
                                <img alt="AWS" src="/assets/images/aws.png" />
                            </div>
                            <div className="src-title">Amazon Web Services</div>
                        </div>

                    </Grid>
                </div>
                <div className="service-box">
                    <Grid item sm={12} className="radio-box sec-services">
                        <Radio
                            checked={selectedValue === 'g'}
                            onChange={this.handleChange}
                            value="g"
                        />
                        <div className={selectedValue === 'g' ? 'active' : 'box-border'}>
                            <i className="mt-icon material-icons">
                                done_all
                            </i>
                            <div className="cloud-service">
                                <img alt="Google Cloud Platform" src="/assets/images/google-cloud.png" />
                            </div>
                            <div className="src-title">Google Cloud Platform</div>
                        </div>

                    </Grid>
                </div>
                <div className="footer-btn">
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => this.props.handleNext(0)}
                        disabled={!selectedValue}
                        className="btn-blue-next mrR10"
                    >
                        Next
                    </Button>

                    <Button
                        variant="contained"
                        color="primary"
                        className="btn-blue-next"
                        onClick={()=>{this.props.cancelOnBoardProcess()}}
                    >
                        Cancel
                    </Button>

                </div>
            </Grid>
        );
    }
}
export default Step1;