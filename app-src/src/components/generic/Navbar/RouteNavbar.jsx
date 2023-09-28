import React, { useState, useEffect } from 'react';
import NavbarLinks from './NavbarLinks/NavbarLinks';
import HomeNavbarLink from './NavbarLinks/HomeNavbarLink';
import NavbarEntries from './NavbarData/NavbarEntries';
import { useHistory, useLocation } from 'react-router-dom';
import { IndexByLocation } from './NavbarUtilities';
import useRecordState from '../../../hooks/useRecordState';
import { campaignManagerUrl } from '../../../constants/Urls';

const RouteNavbar = ({ routes }) => {
    const history = useHistory();
    const location = useLocation();
    const [index, setIndex] = useState(
        IndexByLocation(routes, location?.pathname)
    );
    const { dataModified, showConfirmSaveModal } = useRecordState();

    const navbarStyle = {
        width: 242,
        background: 'linear-gradient(0deg, #1A1A1A 0%, #444343 100%)',
        display: 'flex'
    };

    const contentContainerStyle = {
        marginTop: 57
    };

    const dividerStyle = {
        boxSizing: 'border-box',
        height: 1,
        width: 209,
        border: '1px solid #CCCCCC'
    };

    const openRecentEntry = (entityType, entityId) => {
        if (entityType === 'Campaign') {
            window.open(
                `${campaignManagerUrl}/campaigns/details?campaignId=${entityId}&readOnly=true&goBack=true`,
                '_self'
            );
            return;
        }

        const idKey = `${entityType.toLowerCase()}Id`;
        const entityPath = `${entityType.toLowerCase()}s`
        const historyPath = {
            pathname: `/${entityPath}/details`,
            state: {
                [idKey]: entityId,
                path: `/${entityPath}`
            }
        };

        if (dataModified === true) {
            showConfirmSaveModal(true, historyPath);
        } else {
            history.push(historyPath);
            setIndex(IndexByLocation(routes, `/${entityPath}`));
        }
    };

    useEffect(() => {
        const entityIndex = IndexByLocation(routes, location?.pathname);
        if (entityIndex !== -1) setIndex(entityIndex);
    }, [location]);

    return (
        <div style={{ display: 'flex', boxSizing: 'border-box' }}>
            <div style={navbarStyle}>
                <div style={{ width: '100%' }}>
                    <div style={contentContainerStyle}>
                        <HomeNavbarLink
                            route={routes[0]}
                            parentIndex={index}
                            handleClick={setIndex}
                        />
                        <NavbarLinks
                            routes={routes}
                            parentIndex={index}
                            handleClick={setIndex}
                        />
                    </div>
                    <div
                        style={{
                            ...dividerStyle,
                            marginTop: 24,
                            marginLeft: 12
                        }}
                    />
                    <NavbarEntries
                        entriesProps={{ pageRouteStyle: { marginTop: 31 } }}
                        handleClick={openRecentEntry}
                    />
                </div>
            </div>
        </div>
    );
};

export default RouteNavbar;
