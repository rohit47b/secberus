import React, { PureComponent } from 'react';
import { Radio } from '@material-ui/core';

class SecurityFilterButton extends PureComponent {
    state = {
        selectedValue: '',
        addClass: false
    }

    handleChange = event => {
        this.setState({ selectedValue: event.target.value});
    };

   
    render() {
        const {selectedValue} = this.state
       
        return (
            <div className="filter">
                <span className="filter-btn">
                    All-194
                    <Radio
                            checked={selectedValue === 'a'}
                            onChange={this.handleChange}
                            value="a"
                            className="radio-hide"
                        />
                    <span className={selectedValue ==='a' ? 'active' :''}></span>
                </span>
                <span className="filter-btn">
                High-48
                    <Radio
                            checked={selectedValue === 'b'}
                            onChange={this.handleChange}
                            value="b"
                            className="radio-hide"
                        />
                    <span className={selectedValue ==='b' ? 'active' :''}></span>
                </span>
                <span className="filter-btn">
                Medium-162
                    <Radio
                            checked={selectedValue === 'c'}
                            onChange={this.handleChange}
                            value="c"
                            className="radio-hide"
                        />
                    <span className={selectedValue ==='c' ? 'active' :''}></span>
                </span>
                <span className="filter-btn">
                Low-15
                    <Radio
                            checked={selectedValue === 'd'}
                            onChange={this.handleChange}
                            value="d"
                            className="radio-hide"
                        />
                    <span className={selectedValue ==='d' ? 'active' :''}></span>
                </span>
            </div>
        );
    }
}

export default SecurityFilterButton; 
