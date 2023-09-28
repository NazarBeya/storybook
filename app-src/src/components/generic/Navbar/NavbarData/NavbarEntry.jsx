import React, { useState } from 'react';

const NavbarEntry = ({ entry, index, handleClick }) => {
    const [isFocused, setIsFocused] = useState(false);
    const { activityType, entityName, entityType, entityId } = entry;
    const dataEntryStyle = {
        color: '#C5C5C5',
        fontFamily: 'Roboto',
        fontSize: 15,
        fontWeight: 400,
        cursor: 'default',
        padding: '7px 12px 7px 12px',
        listStyleType: 'none'
    };

    const focusEntryStyle = {
        backgroundColor: 'rgba(0,0,0,0.5)',
        color: '#FFAF00',
        cursor: 'pointer'
    };

    const handleHoverEnter = () => {
        setIsFocused(true);
    };

    const handleHoverLeave = () => {
        setIsFocused(false);
    };

    return (
        <li
            key={`navData${index}`}
            style={{ ...dataEntryStyle, ...(isFocused ? focusEntryStyle : {}) }}
            onClick={() => handleClick(entityType, entityId)}
            onMouseEnter={handleHoverEnter}
            onMouseLeave={handleHoverLeave}
        >
            {`${entityName} - ${entityType}`}
        </li>
    );
};

export default NavbarEntry;
