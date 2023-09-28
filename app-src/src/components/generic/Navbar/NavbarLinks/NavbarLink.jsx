import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import useRecordState from '../../../../hooks/useRecordState';

const NavbarLink = ({ route, index, parentIndex, handleClick, linkProps }) => {
    const [isFocused, setIsFocused] = useState(false);
    const { dataModified, showConfirmSaveModal } = useRecordState();

    const pageRouteStyle = {
        height: 34,
        color: '#CCCCCC',
        fontFamily: 'Roboto',
        fontSize: 16,
        fontWeight: 500,
        cursor: 'default',
        display: 'flex',
        alignItems: 'center',
        paddingLeft: '7%',
        ...linkProps?.pageRouteStyle
    };

    const focusRouteStyle = {
        height: 34,
        backgroundColor: 'rgba(0,0,0,0.5)',
        color: '#FFAF00',
        fontFamily: 'Roboto',
        fontSize: 16,
        fontWeight: 500,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        paddingLeft: '7%',
        ...linkProps?.focusRouteStyle
    };

    const handleHoverEnter = () => {
        setIsFocused(true);
    };

    const handleHoverLeave = () => {
        setIsFocused(false);
    };

    const handleLinkChange = (event, value) => {
        if (dataModified === true) {
            showConfirmSaveModal(true, route.path);
            event.preventDefault();
        } else {
            showConfirmSaveModal(false);
            if (route.path !== undefined) handleClick(value);
        }
    };

    return (
        <Link
            to={{ pathname: route.path || '', state: route.data || {} }}
            style={{ textDecoration: 'None', width: '100%' }}
        >
            <div
                style={
                    index === parentIndex || isFocused
                        ? focusRouteStyle
                        : pageRouteStyle
                }
                onClick={(event) => handleLinkChange(event, index)}
                onMouseEnter={handleHoverEnter}
                onMouseLeave={handleHoverLeave}
            >
                {route.title}
            </div>
        </Link>
    );
};

export default NavbarLink;
