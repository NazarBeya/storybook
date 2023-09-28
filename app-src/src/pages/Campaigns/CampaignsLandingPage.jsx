import { AsSearchBar, AsTab, AsTabContainer, RadioDropdownButton } from '@adserve/adserve-react-components';
import React, { useReducer, useState } from 'react';
import { BusinessTypes } from '../../constants/Enums';
import { campaignManagerUrl } from '../../constants/Urls';
import { apiParamsReducer } from '../../services/AsGridService';
import { GetCampaigns } from '../../services/CampaignsDataService';
import { gridContainerStyle } from '../../styles';
import CampaignsGrid from '../Campaigns/CampaignsGrid';
import { apiParamDefaults, gridItem } from './GridColumnDefinitions';

// Styles

const tabArea = {
    gridColumn: '1 / 4',
    paddingTop: 18
};

const CampaignsLandingPage = () => {
    // States
    const [tab, setTab] = useState(0);
    const [searchTerm, setSearchTerm] = useState();
    const [apiParams, apiParamsDispatcher] = useReducer(apiParamsReducer, apiParamDefaults);

    // Handlers
    const handleSearchUpdate = (value) => {
        setSearchTerm(value);
    };

    const handleCreateNewCampaignButtonClick = (businessType) => {
        if (businessType === BusinessTypes.DIGITAL.text) {
            return;
        }

        if (businessType === BusinessTypes.SANDP.text) {
            businessType = 'SAndP';
        }

        if (businessType === BusinessTypes.OFFAIRS.text) {
            businessType = 'OffAirs';
        }

        window.open(
            `${campaignManagerUrl}/campaigns/create?businessType=${encodeURIComponent(
                businessType
            )}&readOnly=false&campaignId=${window.emptyGuid}&goBack=true`,
            '_self'
        );
    };

    const handleTabClick = (tabIndex) => {
        switch (tabIndex) {
            case 1:
                apiParamsDispatcher({
                    ...apiParamDefaults,
                    sortField: 'lastViewed',
                    sortOrder: 'desc',
                    viewedOnly: false,
                    myCampaigns: true,
                    tab: tabIndex
                });
                break;

            case 2:
                apiParamsDispatcher({
                    ...apiParamDefaults,
                    sortField: 'lastViewed',
                    sortOrder: 'desc',
                    viewedOnly: true,
                    myCampaigns: false,
                    tab: tabIndex
                });
                break;

            case 3:
                apiParamsDispatcher({
                    ...apiParamDefaults,
                    favouritesOnly: true,
                    viewedOnly: false,
                    myCampaigns: false,
                    tab: tabIndex
                });
                break;

            default:
                apiParamsDispatcher({
                    ...apiParamDefaults,
                    myCampaigns: false,
                    viewedOnly: false,
                    tab: tabIndex
                });
                break;
        }
        setTab(tabIndex);
    };

    return (
        <div style={{ ...gridContainerStyle, height: '80%' }}>
            <div style={gridItem} />

            <div style={{ ...gridItem }}>
                <AsSearchBar
                    id='campaignSearch'
                    placeholder={window.translate('Search Campaigns...')}
                    width={395}
                    height={42}
                    currentSearchTerm={searchTerm}
                    onSearchUpdate={handleSearchUpdate}
                />
            </div>

            <div
                style={{
                    ...gridItem,
                    display: 'flex',
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                    zIndex: 210
                }}
            >
                <RadioDropdownButton
                    id='new-campaign'
                    text={window.translate('Create New')}
                    options={[
                        window.translate(BusinessTypes.AIRTIME.text),
                        window.translate(BusinessTypes.SANDP.text),
                        window.translate(BusinessTypes.OFFAIRS.text),
                        window.translate(BusinessTypes.PACKAGE.text),
                        window.translate(BusinessTypes.DIGITAL.text)
                    ]}
                    createClick={handleCreateNewCampaignButtonClick}
                />
            </div>
            <div style={{ ...gridItem, ...tabArea }}>
                <AsTabContainer tabPanelStyle={{ height: 0 }} onTabClick={handleTabClick}>
                    <AsTab title={window.translate('All Campaigns')} />
                    <AsTab title={window.translate('My Campaigns')} />
                    <AsTab title={window.translate('Recently Viewed')} />
                    <AsTab title={window.translate('Favourites')} />
                </AsTabContainer>
            </div>
            <CampaignsGrid
                onGetData={GetCampaigns}
                searchTerm={searchTerm}
                selectedTab={tab}
                defaultApiParams={apiParams}
            />
        </div>
    );
};

export default CampaignsLandingPage;
