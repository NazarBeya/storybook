import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ReactComponent as IconHome } from '../../../../svg/Icon_Home.svg';
import useRecordState from '../../../../hooks/useRecordState';

const HomeNavbarLink = ({ route, parentIndex, handleClick, linkProps }) => {
    const [isFocused, setIsFocused] = useState(false);
    const { dataModified, showConfirmSaveModal } = useRecordState();

    const pageRouteStyle = {
        height: 40,
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
        height: 40,
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

    const iconStyle = {
        height: 26,
        width: 26,
        ...linkProps?.iconStyle
    };

    const handleHoverEnter = () => {
        setIsFocused(true);
    };

    const handleHoverLeave = () => {
        setIsFocused(false);
    };

    const handleLinkChange = (event) => {
        if (dataModified === true) {
            showConfirmSaveModal(true, { pathname: '/' });
            event.preventDefault();
        } else {
            showConfirmSaveModal(false);
            handleClick(0);
        }
    };

    return (
        <Link
            to={{ pathname: route.path || '/', state: route.data || {} }}
            style={{ textDecoration: 'None', width: '100%' }}
        >
            <div
                style={
                    parentIndex === 0 || isFocused
                        ? focusRouteStyle
                        : pageRouteStyle
                }
                onClick={handleLinkChange}
                onMouseEnter={handleHoverEnter}
                onMouseLeave={handleHoverLeave}
            >
                <div
                    style={{
                        display: 'flex',
                        marginTop: -5,
                        marginLeft: -1,
                        marginRight: 9
                    }}
                >
                    <IconHome
                        style={{
                            ...iconStyle,
                            fill:
                                parentIndex === 0 || isFocused
                                    ? focusRouteStyle?.color
                                    : pageRouteStyle?.color
                        }}
                    />
                </div>
                {route.title}
            </div>
        </Link>
    );
};

export default HomeNavbarLink;
