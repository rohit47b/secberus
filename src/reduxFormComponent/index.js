/*
 * @Author: Virendra Patidar 
 * @Date: 2018-07-11 16:39:16 
 * @Last Modified by: Virendra Patidar
 * @Last Modified time: 2019-05-22 22:09:10
 */
import React, { Fragment } from 'react'
import TextField from '@material-ui/core/TextField'
import SelectField from '@material-ui/core/Select'
import Autosuggest from 'react-autosuggest'
import Checkbox from '@material-ui/core/Checkbox'
import InputAdornment from '@material-ui/core/InputAdornment'
import PasswordField from './PasswordField'
import { CopyToClipboard } from 'react-copy-to-clipboard';
import Select from '@material-ui/core/Select'
import Input from '@material-ui/core/Input'
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';

import { renderInput, renderSuggestionsContainer, getSuggestionValue, renderSuggestion, styles } from './AutoComplete'

/**
 * Used for render text field
 * @param {*} param0 
 */
export const renderTextField = ({
    input,
    fixedlabel,
    controllabel,
    name,
    meta: { touched, error },
    ...custom,
    placeholder
}) => (
        <Fragment>
            {fixedlabel && <label className="fix-label">{fixedlabel}</label>}
            <TextField
                label={controllabel}
                {...input}
                {...custom}
                placeholder={placeholder}
            />
            {touched && error && <span className="validation-error">{error}</span>}
        </Fragment>
    )

export const renderTextFieldWithEndEditAdornment = ({
    input,
    fixedlabel,
    controllabel,
    name,
    meta: { touched, error },
    ...custom
}) => (
        <Fragment>
            {fixedlabel && <label className="fix-label">{fixedlabel}</label>}
            <TextField
                label={controllabel}
                {...input}
                {...custom}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position='end'>
                            <i className="fa fa-pencil" aria-hidden="true"></i>
                        </InputAdornment>
                    ),
                }}
            />
            {touched && error && <span className="validation-error">{error}</span>}
        </Fragment>
    )


export const renderTextFieldWithEndCopyToClipAdornment = ({
    input,
    title,
    fixedlabel,
    controllabel,
    name,
    copiedExternalId,
    meta: { touched, error },
    ...custom
}) => (
        <Fragment>
            {fixedlabel && <label className="fix-label">{fixedlabel}</label>}
            <TextField
                label={controllabel}
                {...input}
                {...custom}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position='end' className="input-adornment">
                            <CopyToClipboard text={input.value} onCopy={copiedExternalId}>
                                <a title={title} href="javascript:void(0)"><i className="fa fa-copy"></i></a>
                            </CopyToClipboard>
                        </InputAdornment>
                    ),
                }}
            />
            {touched && error && <span className="validation-error">{error}</span>}
        </Fragment>
    )

export const renderTextFieldWithStartPlusAdornment = ({
    input,
    controllabel,
    name,
    inputAdornment,
    meta: { touched, error },
    ...custom
}) => (
        <Fragment>
            <TextField
                label={controllabel}
                {...input}
                {...custom}
                InputProps={{
                    startAdornment: <InputAdornment className="mw-35" position="start">+ {inputAdornment}</InputAdornment>,
                }}
            />
            {touched && error && <span className="validation-error">{error}</span>}
        </Fragment>
    )


/**
 * Used for render select field
 * @param {*} param0 
 */
export const renderSelectField = ({ input, controllabel, meta: { touched, error }, children, ...custom }) => (
    <Fragment>
        <SelectField
            {...input}
            onChange={(value
            ) => input.onChange(value)}
            value={input.value}
            {...custom} >
            {children}
        </SelectField>

        {touched && error && <span className="validation-error">{error}</span>}
    </Fragment>
)

export const renderControlSelect = ({ input, label, fixedlabel, onChangeMethod, controllabel, meta: { touched, error }, children, ...custom }) => (
    <Fragment>
        {fixedlabel && <label className="fix-label">{fixedlabel}</label>}
        <FormControl className="multi-select">
            <InputLabel htmlFor="select-multiple-checkbox">{label}</InputLabel>
            <Select
                {...input}
                onChange={(value
                ) => { input.onChange(value); onChangeMethod(value) }}
                value={input.value}
                {...custom}
            >
                {children}

            </Select>
        </FormControl>
        {touched && error && <span className="validation-error">{error}</span>}
    </Fragment>
)


export const renderControlMultiSelect = ({ input, label, controllabel, onChangeMethod, meta: { touched, error }, children, ...custom }) => {
    return (<FormControl className="multi-select">
        <InputLabel htmlFor="select-multiple-checkbox">{label}</InputLabel>
        <Select
            multiple
            {...input}
            onChange={(value
            ) => { input.onChange(value); onChangeMethod(value) }}
            value={input.value}
            {...custom}
            input={<Input id="select-multiple-checkbox" />}
            renderValue={selected => selected.join(', ')}
        >
            {children}
        </Select>
    </FormControl>
    )
}

const onSuggestionSelected = (event, { suggestion, suggestionValue, suggestionIndex, sectionIndex, method }) => {
    event.preventDefault()
};

/**
 * Used for render autocomplete field
 * @param {*} param0 
 */
export const renderAutoCompleteField = ({ handleSuggestionsFetchRequested, onSuggestionsClearRequested, inputProps, suggestions, value, input, fields, controllabel, meta: { touched, error }, children, ...custom }) => (
    <Fragment>
        <Autosuggest
            renderInputComponent={renderInput}
            suggestions={suggestions}
            onSuggestionsFetchRequested={handleSuggestionsFetchRequested}
            onSuggestionsClearRequested={onSuggestionsClearRequested}
            renderSuggestionsContainer={renderSuggestionsContainer}
            getSuggestionValue={getSuggestionValue}
            renderSuggestion={renderSuggestion}
            OnSuggestionSelected={onSuggestionSelected}
            inputProps={inputProps}
            {...input}
            label={controllabel}
            {...custom}
        />
        {value === '' && error && <span className="validation-error">{error}</span>}

    </Fragment>
)

/**
 * Used for render checkbox
 * @param {*} param0 
 */
export const renderCheckbox = ({ input, controllabel, ...custom }) => (
    <Checkbox
        label={controllabel}
        checked={input.value ? true : false}
        onChange={input.onChange}
        {...custom}
    />
)

/**
 * Used for render password
 * @param {*} param0 
 */
export const renderPasswordField = ({
    input,
    name,
    placeholder,
    meta: { touched, error },
    ...custom
}) => (
        <Fragment>
            <PasswordField
                {...input}
                {...custom}
                placeholder={placeholder}
            />
            {touched && error && <span className="validation-error">{error}</span>}
        </Fragment>
    )

export const renderTextArea = ({
    input,
    fixedlabel,
    controllabel,
    name,
    meta: { touched, error },
    ...custom,
    placeholder,
    rows
}) => (
        <Fragment>
            {fixedlabel && <label className="fix-label">{fixedlabel}</label>}
            <TextField
                id="multiline-static"
                //label="Multiline"
                {...input}
                {...custom}
                multiline={true}
                rows={rows}
                defaultValue="Default Value"
                margin="normal"
                placeholder={placeholder}
            />
            {touched && error && <span className="validation-error">{error}</span>}
        </Fragment>
    )


export const renderCheckboxGroup = ({ name, options, input, meta, ...custom }) => {
    let $options = options.map((option, i) => (
        <div key={i}>
            <Checkbox
                name={`${name}[${i}]`}
                defaultChecked={true}
                disabled={true}
                onChange={(e, checked) => {
                    let newValue = [...input.value];
                    if (checked) {
                        newValue.push(option.id);
                    } else {
                        newValue.splice(newValue.indexOf(option.id), 1);
                    }
                    return input.onChange(newValue);
                }}
                {...custom}
                className="checkbox-small"
            />
            <span>{option.name}</span>
        </div>
    ));
    return (
        <div>
            {$options}
        </div>
    );
};