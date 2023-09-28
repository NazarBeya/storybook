import React, { useState, useEffect } from 'react';
import NavbarEntry from './NavbarEntry';
import { GetRecentUserActivities } from '../../../../services/UserActivityDataService';
import { getClaimValue } from '@adserve/adserve-react-components';

const NavbarEntries = ({ handleClick }) => {
    const pageRouteStyle = {
        height: 34,
        color: '#CCCCCC',
        fontFamily: 'Roboto',
        fontSize: 16,
        fontWeight: 500,
        cursor: 'default',
        paddingLeft: '7%',
        marginTop: 40
    };

    const [recentActivities, setRecentActivities] = useState([]);

    useEffect(() => {
        console.log('navbar entries compo called');
        GetRecentUserActivities(getClaimValue('ASId'))
            .then((data) => {
                setRecentActivities(data);
            })
            .catch(console.log);
    }, []);

    return (
        <div style={pageRouteStyle}>
            <div>Recent Activity</div>
            <ul style={{ padding: 0 }}>
                {Array.isArray(recentActivities) ? recentActivities.map((act, i) => (
                    <NavbarEntry
                        key={`navEntry${i}`}
                        entry={act}
                        index={i}
                        handleClick={handleClick}
                    />
                )) : null}
            </ul>
        </div>
    );
};

export default NavbarEntries;
