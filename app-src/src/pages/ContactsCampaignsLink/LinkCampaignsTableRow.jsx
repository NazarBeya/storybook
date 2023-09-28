import {
    AsSelect,
    AsText,
    StripedTableCell,
    StripedTableScrollbarRow
} from '@adserve/adserve-react-components';
import React from 'react';
import CompactTable from '../../components/generic/CompactTable/CompactTable';
import { CampaignsLookup } from '../../services/CampaignsDataService';
import CampaignCompactTableColumnDefinitions from '../CampaignsContactsLink/CampaignCompactTableColumnDefinitions';
import CrmSelect from '../../components/inputs/CrmSelect';

const LinkCampaignsTableRow = ({
    index,
    campaign,
    contactRoles,
    onUpdateCampaign,
    scrollPx,
    onScroll,
    gutterOffsetTop,
    maxHeight,
    scrollableLength,
    noOfRows = 0
}) => {
    const tableCellStyle = {
        backgroundColor: '#FFFFFF'
    };

    const rowStyle = {
        paddingTop: index === 1 ? 16 : 0,
        paddingBottom: 10
    };

    const border = '1px solid #D7D7D7';
    const borderNone = 'none';
    const isFireFox = typeof InstallTrigger !== 'undefined';

    const inputStyle = {
        fontFamily: 'roboto',
        fontSize: 15,
        fontWeight: 500,
        boxSizing: 'border-box'
    };

    const updateCampaign = (name, value) => {
        if (onUpdateCampaign) {
            const updatedCampaign = {
                ...campaign,
                [name]: value,
                campaignId: name === 'campaignName' ? '' : campaign.campaignId,
                advertiserAccountName:
                    name === 'campaignName' && campaign.new
                        ? ''
                        : campaign.advertiserAccountName,
                agencyAccountName:
                    name === 'campaignName' && campaign.new
                        ? ''
                        : campaign.agencyAccountName
            };
            onUpdateCampaign(updatedCampaign);
        }
    };

    const handleDropdownClick = (searchResult) => {
        if (onUpdateCampaign) {
            const updatedCampaign = {
                ...campaign,
                campaignId: searchResult.id,
                campaignName: searchResult.name,
                advertiserAccountName: searchResult.advertiserAccountName,
                agencyAccountName: searchResult.agencyAccountName
            };
            onUpdateCampaign(updatedCampaign);
        }
    };

    const handleOpenClick = (event) => {
        if (Object.keys(campaign).length <= 2) {
            event.preventDefault();
        }
    };

    return (
        <StripedTableScrollbarRow
            id={`${campaign.id}-row`}
            key={campaign.id}
            index={index}
            isFirstRow={index === 1}
            scrollPx={scrollPx}
            onScroll={onScroll}
            maxHeight={maxHeight}
            gutterOffsetTop={gutterOffsetTop}
            scrollableHeight={scrollableLength}
            noOfRows={noOfRows}
            border={border}
        >
            <StripedTableCell
                index={index}
                border={borderNone}
                style={{
                    ...rowStyle,
                    borderLeft: border,
                    paddingLeft: 21
                }}
                evenStyle={tableCellStyle}
                oddStyle={tableCellStyle}
                scrollPx={scrollPx}
            />
            <StripedTableCell
                index={index}
                border={borderNone}
                style={{ ...rowStyle, paddingRight: 110 }}
                evenStyle={tableCellStyle}
                oddStyle={tableCellStyle}
                scrollPx={scrollPx}
            >
                <CompactTable
                    id={`${index}-campaign`}
                    inputStyle={{ ...inputStyle, width: 350, height: 40 }}
                    buttonStyle={{ width: 40 }}
                    separateButton
                    value={campaign.campaignName}
                    disabled={!campaign.new}
                    onOpenClick={handleOpenClick}
                    onChange={(e) =>
                        updateCampaign('campaignName', e.target.value)
                    }
                    searchFunction={(searchTerm, params) =>
                        CampaignsLookup(searchTerm, params)
                    }
                    tableColumnDefinitions={
                        CampaignCompactTableColumnDefinitions
                    }
                    onDropdownClick={handleDropdownClick}
                    returnPath='/contacts/campaignslink'
                />
            </StripedTableCell>
            <StripedTableCell
                index={index}
                border={borderNone}
                style={rowStyle}
                evenStyle={tableCellStyle}
                oddStyle={tableCellStyle}
                scrollPx={scrollPx}
            >
                <AsText
                    id={`${index}-advertiser`}
                    style={{ ...inputStyle, width: 300 }}
                    inputStyle={{ height: 30 }}
                    value={campaign.advertiserAccountName}
                    disabled
                />
            </StripedTableCell>
            <StripedTableCell
                index={index}
                border={borderNone}
                style={rowStyle}
                evenStyle={tableCellStyle}
                oddStyle={tableCellStyle}
                scrollPx={scrollPx}
            >
                <AsText
                    id={`${index}-agency`}
                    style={{ ...inputStyle, width: 300 }}
                    inputStyle={{ height: 30 }}
                    value={campaign.agencyAccountName}
                    disabled
                />
            </StripedTableCell>
            <StripedTableCell
                index={index}
                border={borderNone}
                style={{ ...rowStyle, borderRight: border }}
                evenStyle={tableCellStyle}
                oddStyle={tableCellStyle}
                scrollPx={scrollPx}
            >
                <CrmSelect
                    id={`${index}-role`}
                    crmLabelStyle={{ marginBottom: 0 }}
                    crmSelectStyle={{
                        ...inputStyle,
                        position: 'relative',
                        width: 270,
                        height: 40,
                        lineHeight: isFireFox ? 0 : 'normal'
                    }}
                    placeholder='Select...'
                    values={contactRoles}
                    value={campaign.contactRoleId}
                    disabled={campaign.new && (!campaign.campaignName || !(campaign.advertiserAccountName?.length > 0 || campaign.agencyAccountName?.length > 0))}
                    onChange={(e) =>
                        updateCampaign('contactRoleId', e.target.value)
                    }
                />
            </StripedTableCell>
        </StripedTableScrollbarRow>
    );
};

export default LinkCampaignsTableRow;
