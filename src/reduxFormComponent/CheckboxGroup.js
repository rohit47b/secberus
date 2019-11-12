import React, { Component, Fragment } from 'react';
import { Field } from "redux-form";
import PropTypes from 'prop-types';
import Checkbox from '@material-ui/core/Checkbox';

export default class CheckboxGroup extends Component {

    static propTypes = {
        options: PropTypes.arrayOf(PropTypes.shape({
            label: PropTypes.string.isRequired,
            value: PropTypes.string.isRequired
        })).isRequired
    };

    field = ({ input, meta, options }) => {

        const { name, onChange } = input;
        const { touched, error } = meta;
        const inputValue = input.value;

        const checkboxes = options.map(({ label, value }, index) => {

            const handleChange = (event) => {
                const arr = [...inputValue];
                if (event.target.checked) {
                    arr.push(value);
                }
                else {
                    arr.splice(arr.indexOf(value), 1);
                }
                return onChange(arr);
            };
            const checked = inputValue.includes(value);
            return (
                <label className="d-block" key={`checkbox-${index}`}>
                    <Checkbox className="checkbox-small" name={`${name}[${index}]`} value={value} checked={checked} onChange={handleChange} />
                    <span>{label}</span>
                </label>
            );
        });

        return (
            <div>
                <div>{checkboxes}</div>
                {touched && error && <p className="error">{error}</p>}
            </div>
        );
    };


    render() {
        const { fixedlabel } = this.props
        return <Fragment>
            {fixedlabel && <label className="fix-label">{fixedlabel}</label>}
            <Field {...this.props} type="checkbox" component={this.field} />
        </Fragment>
    }
}