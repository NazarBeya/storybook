import React from 'react';
import { AsText } from '@adserve/adserve-react-components';

const AsTextWithStatus = ({
    name,
    title,
    value,
    onChange,
    disabled = false,
    dataId,
    labelStyle,
    inputStyle,
    maxLength,
    statusMessage,
    statusColor = '#D7D7D7',
    ...props
}) => {
    const statusLabelStyle = {
        position: 'absolute',
        color: statusColor,
        fontSize: 12
    };

    return (
        <div>
            <AsText
                name={name}
                title={title}
                value={value}
                onChange={onChange}
                disabled={disabled}
                dataId={dataId}
                labelStyle={labelStyle}
                inputStyle={{
                    ...inputStyle,
                    borderColor: statusColor
                }}
                maxLength={maxLength}
                inputProps={{ autoComplete: 'off' }}
                {...props}
            />
            {statusMessage ? (
                <label style={statusLabelStyle}>{statusMessage}</label>
            ) : null}
        </div>
    );
};

export default AsTextWithStatus;
