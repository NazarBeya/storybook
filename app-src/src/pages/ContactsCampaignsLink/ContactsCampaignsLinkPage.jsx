import { AsButton, Spacer } from '@adserve/adserve-react-components';
import React, { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import PageContainer from '../../components/containers/PageContainer';
import LinkCampaignsTable from './LinkCampaignsTable';
import { UpdateContactCampaigns } from '../../services/ContactsDataService';
import useSession from '../../hooks/useSession';
import { GetAccountCampaigns } from '../../services/AccountDataService';

const ContactsCampaignsLinkPage = () => {
    const [contact, setContact, delContact] = useSession('linkContact', {});
    const [
        rowCampaigns,
        setRowCampaigns,
        delRowCampaigns
    ] = useSession('rowCampaigns', []);
    const [changeMade, setChangeMade] = useState(false);

    const history = useHistory();

    const location = useLocation();

    const [returnPath, setReturnPath] = useState('/contacts/details');

    useEffect(() => {
        if (location?.state?.redirectedFrom !== 'search') {
            setContact(location.state.contact);
            createRowCampaigns(
                location.state.contact,
                location.state.campaigns
            );
            setReturnPath(location?.state?.path || '/contacts/details');
        }
    }, []);

    const titleStyle = {
        fontSize: 22,
        fontWeight: 500,
        color: '#414141'
    };

    const buttonStyle = {
        height: 36,
        fontSize: 15
    };

    const emptyRowCampaign = {
        new: true,
        contactId: contact.id,
        contactRoleId: '',
        isPrimary: false
    };

    const createRowCampaigns = async (stateContact, campaigns) => {
        const tempCampaigns = [];
        const accountId = stateContact.accountId;

        let recIndex = stateContact.campaignContacts.length - 1;
        for (let i = 0; i < stateContact.campaignContacts.length; i++) {
            const contactCamp = stateContact.campaignContacts[i];
            const campaign = Array.isArray(campaigns) && campaigns.find(
                (o) => o.id === contactCamp.campaignId
            );

            if (campaign) {
                tempCampaigns.push({
                    id: i,
                    new: false,
                    campaignId: contactCamp.campaignId,
                    contactId: contactCamp.contactId,
                    campaignName: campaign.name,
                    contactRoleId: contactCamp.contactRoleId,
                    advertiserAccountName: campaign.advertiserAccountName,
                    agencyAccountName: campaign.agencyAccountName,
                });
            }
        }

        const accountCampaigns = accountId != null ? await GetAccountCampaigns(accountId, {
            favouritesOnly: false,
            sortField: 'name',
            sortOrder: 'asc'
        }) : null;

        for (let i = 0; i < accountCampaigns?.data?.data?.length; i++) {
            const accCampaign = tempCampaigns.find(
                (o) => o.campaignId === accountCampaigns.data.data[i].id
            );
            if (!accCampaign) {
                recIndex = recIndex + 1;
                tempCampaigns.push({
                    id: recIndex,
                    new: false,
                    campaignId: accountCampaigns.data.data[i].id,
                    campaignName: accountCampaigns.data.data[i].name,
                    advertiserAccountName: accountCampaigns.data.data[i].advertiserAccountName,
                    agencyAccountName: accountCampaigns.data.data[i].agencyAccountName
                });
            }
        }

        tempCampaigns.push({
            ...emptyRowCampaign,
            id: tempCampaigns.length,
            contactId: location?.state?.contact?.id
                ? location.state.contact.id
                : contact.id
        });

        setRowCampaigns(tempCampaigns);
    };

    const handleRowCampaignUpdate = (campaign) => {
        const index = rowCampaigns.findIndex(
            (o) => o.id === campaign.id
        );

        const campaigns = rowCampaigns.map((rowCampaign, i) => {
            if (i === index) {
                return campaign;
            } else {
                return rowCampaign;
            }
        });

        // We updated the last entry so need to add another
        if (index === rowCampaigns.length - 1) {
            campaigns.push({
                ...emptyRowCampaign,
                id: rowCampaigns.length
            });
        }

        setRowCampaigns(campaigns);

        if (!changeMade) {
            setChangeMade(true);
        }
    };

    const handleSave = async () => {
        const campaignsToSend = rowCampaigns;

        // We can lose the last entry because it will be a blank one
        campaignsToSend.pop();

        const campContacts = campaignsToSend.slice(0);
        // The main way a link is established is if a role is set, if the role isn't set then discard the record
        for (let i = 0; i < campContacts.length; i++) {
            if (
                !campContacts[i].campaignId ||
                (!campContacts[i].new && campContacts[i].contactRoleId === '')
            ) {
                const campIndex = campaignsToSend.findIndex(
                    (c) => c.id === campContacts[i].id
                );
                if (campIndex > -1) campaignsToSend.splice(campIndex, 1);
            }
        }

        try {
            const response = await UpdateContactCampaigns(
                contact.id,
                campaignsToSend
            );

            if (response?.status === 200 || response?.status === 201) {
                contact.contactCampaigns = campaignsToSend;
                handleClose();
            } else {
                console.error(response);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleClose = () => {
        delContact();
        delRowCampaigns();
        location?.onClose
            ? location.onClose()
            : history.push('/contacts/details', {
                  contactId: contact.id,
                  selectedTab: 2,
                  path: returnPath
              });
    };

    return (
        <PageContainer onClose={handleClose}>
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '24px 110px 75px 93px'
                }}
            >
                <span style={titleStyle}>{contact.fullName}</span>
                <Spacer height={18} />
                <span style={titleStyle}>Link Campaigns</span>
                <Spacer height={35} />
                <LinkCampaignsTable
                    contactCampaigns={rowCampaigns}
                    onUpdateCampaign={handleRowCampaignUpdate}
                />
                <Spacer height={17} />
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'flex-end'
                    }}
                >
                    <AsButton
                        id='cancel'
                        useTertiaryStyle
                        style={{ ...buttonStyle, width: 87 }}
                        handleClick={handleClose}
                    >
                        Cancel
                    </AsButton>
                    <Spacer width={82} />
                    <AsButton
                        id='save'
                        style={{
                            ...buttonStyle,
                            width: 130,
                            fontWeight: 'bold'
                        }}
                        disabled={!changeMade}
                        handleClick={handleSave}
                    >
                        Save
                    </AsButton>
                </div>
            </div>
        </PageContainer>
    );
};

export default ContactsCampaignsLinkPage;
