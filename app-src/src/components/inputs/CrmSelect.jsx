import React from 'react';
import { AsSelect } from '@adserve/adserve-react-components';
import { labelStyle, inputStyle } from '../../styles';
import PropTypes from 'prop-types';

const placeholderValue = { id: -1, name: 'Select...' };

const CrmSelect = ({
    creating = false,
    disabled = false,
    disabledStyle,
    crmLabelStyle,
    crmSelectStyle,
    containerStyle,
    readOnly,
    placeholder,
    value,
    values,
    onChange,
    required = false,
    ...props
}) => {
    if (placeholder) placeholderValue.name = placeholder;

    if (
        !required &&
        values?.length > 0 &&
        !values?.includes(placeholderValue)
    ) {
        values.unshift(placeholderValue);
    }

    const handleChange = (e) => {
        if (typeof onChange !== 'function') return;
        onChange(e);
    };

    const defaultIndex = values.findIndex((e) => e.isDefault);

    if (
        defaultIndex !== -1 &&
        value === null &&
        values[defaultIndex]?.id !== value
    ) {
        if (typeof onChange !== 'function') return;
        const e = {
            target: { name: props.name, value: values[defaultIndex]?.id }
        };
        onChange(e);
    }

    return (
        <AsSelect
            {...props}
            placeholder={required ? undefined : placeholder}
            labelStyle={{ ...labelStyle, ...crmLabelStyle }}
            selectStyle={{ ...inputStyle, ...crmSelectStyle }}
            containerStyle={containerStyle}
            disabledStyle={disabledStyle}
            chevronProps={{ size: inputStyle.height ?? 40 }}
            disabled={disabled}
            onChange={handleChange}
            value={
                creating
                    ? !disabled
                        ? defaultIndex === -1 || value
                            ? value
                            : values[defaultIndex]?.id
                        : values[defaultIndex]?.id
                    : value || -1
            }
            values={values}
            disableTooltip={true}
        />
    );
};

CrmSelect.defaultProps = {
    disabled: false,
    required: false
};

CrmSelect.propTypes = {
    disabled: PropTypes.bool,
    value: PropTypes.any,
    values: PropTypes.arrayOf(PropTypes.object).isRequired,
    onChange: PropTypes.func,
    required: PropTypes.bool
};

export default CrmSelect;
