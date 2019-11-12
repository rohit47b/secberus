/*
 * @Author: Virendra Patidar 
 * @Date: 2018-11-16 14:55:42 
 * @Last Modified by: Virendra Patidar
 * @Last Modified time: 2019-05-22 13:50:13
 */
import React, { PureComponent } from 'react'
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import Input from '@material-ui/core/Input';
import HttpIntegration from "./components/httpIntegration"
import SmtpIntegration from './components/smtpIntegration'

class CommunicationIntegrations extends PureComponent {
    state = {
        value: 0,
    }

    handleChangeTab = (event, value) => {
        this.setState({ value: event.target.value });
    }

    render() {
        const { value } = this.state
        return (
            <Card className="card-wizard card-panel  card-inner card-notification card-tab">
                <div className="card-title">
                    <h3 className="card-heading">Communication Integrations</h3>
                    <FormControl className="multi-select single-select">
                        <Select
                            value={value}
                            name="tabs"
                            onChange={this.handleChangeTab}
                            input={<Input id="select-multiple" />}
                            className="select-feild"
                            MenuProps={{
                                style: {
                                    top: '40px'
                                }
                            }}
                        >
                            <MenuItem className="select-item select-item-text" key={0} value={0}>
                                <span>HTTP</span>
                            </MenuItem>
                            <MenuItem className="select-item select-item-text" key={1} value={1}>
                                <span>SMTP</span>
                            </MenuItem>
                           
                        </Select>
                    </FormControl>
                </div>
                {value === 0 &&
                    <CardContent className="card-body">
                       <HttpIntegration/>
                    </CardContent>
                }
                {value === 1 &&

                    <CardContent className="card-body">
                       
                        <SmtpIntegration/>
                    </CardContent>
                }

              
            </Card>
        )
    }
}



export default CommunicationIntegrations