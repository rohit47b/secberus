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
import SpendHistoryBarChart from './SpendHistoryBarChart'

const names = [
    'Blended',
    'List',
    'Credits'
]

class SpendHistory extends PureComponent {
    state = {
        costType: ["Cost Type"]
    }

    handleChange = event => {
        let { costType } = this.state
        costType = event.target.value;
        
        if(costType[0]==='Cost Type' && costType.length > 1){
            costType.shift()
        } else if(costType.length === 0){
            costType[0]='Cost Type';
        }
        
        this.setState({ costType: event.target.value });
    }

    render() {
        const {costType}= this.state
        return (
            <CardWithTitle title={"Spend History"} bgImageClass={"card-billing"} left={<div className="d-flex align-item-center">
                <FormControl className="form-control-multiple-select" fullWidth={true}>
                    <Select
                        multiple
                        value={costType}
                        onChange={this.handleChange}
                        input={<Input id="select-multiple-checkbox" />}
                        renderValue={selected => selected.join(', ')}
                        className="multiple-select-box"
                        MenuProps={{
                            style: {
                                top: '39px'
                            }
                        }}
                    >
                        {names.map(name => (
                            <MenuItem className="multiple-select-box-menu" key={name} value={name}>
                                <ListItemText className="multiple-select-box-menu-item" primary={name} />
                                <Checkbox  color="primary" className="select-item-checkbox" checked={costType.indexOf(name) > -1} />
                            </MenuItem>
                        ))}

                    </Select>
                </FormControl>
                <LabelWithHelper message={"Spend History"} content={"Lorem Ipsum is simply dummy text of the printing and typesetting industry."} />
            </div>
            }
            >
               <SpendHistoryBarChart/>
            </CardWithTitle>
        )
    }
}

export default SpendHistory