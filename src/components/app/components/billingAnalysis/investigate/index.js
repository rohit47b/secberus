import React, { PureComponent } from 'react'
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import ListItemText from '@material-ui/core/ListItemText';
import Select from '@material-ui/core/Select';
import Checkbox from '@material-ui/core/Checkbox';
import { CardWithTitle } from 'hoc/CardWithTitle'
import LabelWithHelper from 'hoc/Label/LabelWithHelper';
import InvestigateBarChart from './InvestigateBarChart'

const serviceTypes = [
    'S3',
    'EC2',
    'Lambda',
    'Cloudwatch'
]

const accounts= [
    'Staging',
    'Production 1',
    'Production 2'
]
const tags= [
    'Lorem Ipsum 1',
    'Lorem Ipsum 2',
    'Lorem Ipsum 3'
]

class Investigate extends PureComponent {
    state = {
        serviceType: ["Service Type"],
        account: ["Account(s)"],
        tag:["Tags"]
    }

    handleAccountChange = event => {
        let { account } = this.state
        account = event.target.value;
        
        if(account[0]==='Account(s)' && account.length > 1){
            account.shift()
        } else if(account.length === 0){
            account[0]='Account(s)';
        }
        this.setState({ account: event.target.value });
    }

    handleServiceTypeChange = event => {
        let { serviceType } = this.state
        serviceType = event.target.value;
        
        if(serviceType[0]==='Service Type' && serviceType.length > 1){
            serviceType.shift()
        } else if(serviceType.length === 0){
            serviceType[0]='Service Type';
        }
        this.setState({ serviceType: event.target.value });
    }

    handleTagChange = event => {
        let { tag } = this.state
        tag = event.target.value;
        
        if(tag[0]==='Tags' && tag.length > 1){
            tag.shift()
        } else if(tag.length === 0){
            tag[0]='Tags';
        }
        this.setState({ tag: event.target.value });
    }

    render() {
        const {account,serviceType,tag} =this.state
        return (
            <CardWithTitle title={"Investigate"} bgImageClass={"card-billing"} left={<div className="d-flex align-item-center">
                <div className="mrR30 d-flex">
                <FormControl className="form-control-multiple-select" fullWidth={true}>
                    <Select
                        multiple
                        value={account}
                        onChange={this.handleAccountChange}
                        input={<Input id="select-multiple-checkbox1" />}
                        renderValue={selected => selected.join(', ')}
                        className="multiple-select-box"
                        MenuProps={{
                            style: {
                                top: '39px'
                            }
                        }}
                    >
                        {accounts.map(type => (
                            <MenuItem className="multiple-select-box-menu" key={type} value={type}>
                                <ListItemText className="multiple-select-box-menu-item" primary={type} />
                                <Checkbox  color="primary" className="select-item-checkbox" checked={account.indexOf(type) > -1} />
                            </MenuItem>
                        ))}

                    </Select>
                </FormControl>
                <LabelWithHelper message={"Investigate"} content={"Lorem Ipsum is simply dummy text of the printing and typesetting industry."} />
                </div>
                <div className="mrR30 d-flex">
                <FormControl className="form-control-multiple-select" fullWidth={true}>
                    <Select
                        multiple
                        value={serviceType}
                        onChange={this.handleServiceTypeChange}
                        input={<Input id="select-multiple-checkbox2" />}
                        renderValue={selected => selected.join(', ')}
                        className="multiple-select-box"
                        MenuProps={{
                            style: {
                                top: '39px'
                            }
                        }}
                    >
                        {serviceTypes.map(type => (
                            <MenuItem className="multiple-select-box-menu" key={type} value={type}>
                                <ListItemText className="multiple-select-box-menu-item" primary={type} />
                                <Checkbox  color="primary" className="select-item-checkbox" checked={serviceType.indexOf(type) > -1} />
                            </MenuItem>
                        ))}

                    </Select>
                </FormControl>
                <LabelWithHelper message={"Investigate"} content={"Lorem Ipsum is simply dummy text of the printing and typesetting industry."} />
                </div>
                <FormControl className="form-control-multiple-select" fullWidth={true}>
                    <Select
                        multiple
                        value={tag}
                        onChange={this.handleTagChange}
                        input={<Input id="select-multiple-checkbox2" />}
                        renderValue={selected => selected.join(', ')}
                        className="multiple-select-box"
                        MenuProps={{
                            style: {
                                top: '39px'
                            }
                        }}
                    >
                        {tags.map(tagItem => (
                            <MenuItem className="multiple-select-box-menu" key={tagItem} value={tagItem}>
                                <ListItemText className="multiple-select-box-menu-item" primary={tagItem} />
                                <Checkbox  color="primary" className="select-item-checkbox" checked={tag.indexOf(tagItem) > -1} />
                            </MenuItem>
                        ))}

                    </Select>
                </FormControl>
                <LabelWithHelper message={"Investigate"} content={"Lorem Ipsum is simply dummy text of the printing and typesetting industry."} />
            </div>
            }
            >
                <InvestigateBarChart/>
            </CardWithTitle>
        )
    }
}

export default Investigate