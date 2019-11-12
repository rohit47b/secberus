/*
 * @Author: Virendra Patidar 
 * @Date: 2018-07-11 16:44:23 
 * @Last Modified by: Virendra Patidar
 * @Last Modified time: 2018-10-10 10:29:06
 */
import React from 'react'

import TextField from '@material-ui/core/TextField'
import Paper from '@material-ui/core/Paper'
import MenuItem from '@material-ui/core/MenuItem'

import match from 'autosuggest-highlight/match'
import parse from 'autosuggest-highlight/parse'

let dataSourceConfig = {
    text: 'name',
    value: 'id',
};

export const setConfig = (config) => {
    dataSourceConfig = config
}




export const renderInput = (inputProps) => {
    const { classes, placeholder, ref, ...other } = inputProps;
    return (
        <TextField
            fullWidth
            label={placeholder}
            InputProps={{
                inputRef: ref,
                classes: {
                    //input: classes.input,
                },
                ...other,
            }}

        />
    );
}

export const renderSuggestion = (suggestion, { query, isHighlighted }) => {

    const matches = match(suggestion[dataSourceConfig.text], query);
    const parts = parse(suggestion[dataSourceConfig.text], matches);
    return (
        <MenuItem selected={isHighlighted} component="div">
            <div>
                {parts.map((part, index) => {
                    return part.highlight ? (
                        <span key={String(index)} style={{ fontWeight: 500 }}>
                            {part.text}
                        </span>
                    ) : (
                            <strong key={String(index)} style={{ fontWeight: 300 }}>
                                {part.text}
                            </strong>
                        );
                })}
            </div>
        </MenuItem>
    );
}

export const renderSuggestionsContainer = (options) => {
    const { containerProps, children } = options;

    return (
        <Paper {...containerProps} square>
            {children}
        </Paper>
    );
}

export const getSuggestionValue = (suggestion) => {
    return suggestion[dataSourceConfig.text];
}

export const getSuggestions = (value, suggestions) => {
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;
    let count = 0;
    return inputLength === 0 || suggestions===undefined || suggestions.length===0
        ? []
        : suggestions.filter(suggestion => {
            let suggestValue = suggestion[dataSourceConfig.text]
            if (suggestValue !== undefined) {
                const keep =
                    count < 5 && suggestValue.toLowerCase().indexOf(inputValue.toLowerCase()) !== -1;

                if (keep) {
                    count += 1;
                }
                return keep;
            }

        });
}
