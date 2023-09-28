import React from 'react';

const AsStatus = ({ children, statusMessage, statusColor }) => {
    const statusLabelStyle = {
        position: 'absolute',
        color: statusColor,
        fontSize: 12
    };

    return (
        <div>
            {children}
            {statusMessage ? (
                <label style={statusLabelStyle}>{statusMessage}</label>
            ) : null}
        </div>
    );
};

export default AsStatus;
