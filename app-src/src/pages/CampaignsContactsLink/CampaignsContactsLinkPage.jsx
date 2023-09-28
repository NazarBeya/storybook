import { AsButton, Spacer } from '@adserve/adserve-react-components';
import React, { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import PageContainer from '../../components/containers/PageContainer';
import LinkContactsTable from './LinkContactsTable';
import {
    GetCampaignAccountContacts,
    UpdateCampaignContacts
} from '../../services/CampaignsDataService';
import useSession from '../../hooks/useSession';
import { campaignManagerUrl } from '../../constants/Urls';

const CampaignsContactsLinkPage = () => {
    const [campaign, setCampaign, delCampaign] = useSession(
        'linkCampaign',
        {}
    );
    const [rowContacts, setRowContacts, delRowContacts] = useSession(
        'rowContacts',
        []
    );
    const [
        hasPrimaryContact,
        setHasPrimaryContact,
        delHasPrimaryContact
    ] = useSession('hasPrimaryContact', false);
    const [changeMade, setChangeMade] = useState(false);

    const history = useHistory();

    const location = useLocation();

    useEffect(() => {
        if (location?.state?.redirectedFrom !== 'search') {
            setCampaign(location.state.campaign);
            createRowContacts(
                location.state.campaign.id,
                location.state.campaign.campaignContacts,
                location.state.contacts
            );
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

    const emptyRowContact = {
        new: true,
        campaignId: campaign.id,
        contactRoleId: '',
        isPrimary: false
    };

    const createRowContacts = async (
        campaignId,
        campaignContacts,
        contacts
    ) => {
        const tempContacts = [];

        let accountContacts;
        try {
            accountContacts = await GetCampaignAccountContacts(
                campaignId
            );
        } catch (error) {
            console.log(error);
        }

        // Making a copy because we will remove any linked contacts that appear when running through all the contacts
        // Any left will also need to be added.
        const campContacts = campaignContacts.slice(0);

        for (let i = 0; i < accountContacts.length; i++) {
            const contact = accountContacts[i];
            const campContactIndex = campContacts.findIndex(
                (c) => c.contactId === contact.id
            );

            const rowContact = {
                ...emptyRowContact,
                id: i,
                new: false,
                campaignId,
                contactId: contact.id,
                contactName: contact.name,
                accountName: contact.accountName
            };

            if (campContactIndex > -1) {
                rowContact.contactRoleId =
                    campContacts[campContactIndex].contactRoleId;
                rowContact.isPrimary = campContacts[campContactIndex].isPrimary;

                if (rowContact.isPrimary) {
                    setHasPrimaryContact(true);
                }

                campContacts.splice(campContactIndex, 1);
            }

            tempContacts.push(rowContact);
        }

        // Add the leftover contacts
        for (let i = 0; i < campContacts.length; i++) {
            const campContact = campContacts[i];
            const contact = contacts.find((c) => c.id === campContact.contactId);

            if (contact) {
                if (campContact.isPrimary) {
                    setHasPrimaryContact(true);
                }

                tempContacts.push({
                    id: tempContacts.length,
                    new: false,
                    campaignId: campContact.campaignId,
                    contactId: campContact.contactId,
                    contactName: contact.fullName,
                    contactRoleId: campContact.contactRoleId,
                    isPrimary: campContact.isPrimary,
                    accountName: contact.accountName
                });
            }
        }

        // Now we need to sort it by contact name
        tempContacts.sort((a, b) => (a.contactName > b.contactName ? 1 : -1));

        tempContacts.push({ ...emptyRowContact, id: tempContacts.length });

        setRowContacts(tempContacts);
    };

    const handleRowContactUpdate = (contact) => {
        const index = rowContacts.findIndex((c) => c.id === contact.id);

        if (index === -1) {
            return;
        }

        var roleOrPrimarySelected = false;
        if (contact.isPrimary) {
            setHasPrimaryContact(true);
            roleOrPrimarySelected = true;
        }

        const contacts = rowContacts.map((rowContact, i) => {
            if (
                (!roleOrPrimarySelected &&
                    (rowContact.contactRoleId !== '' ||
                        rowContact.isPrimary ||
                        (rowContact.new && rowContact.contactId)) &&
                    i !== index) ||
                ((contact.contactRoleId !== '' ||
                    contact.isPrimary ||
                    (contact.new && contact.contactId)) &&
                    i === index)
            ) {
                roleOrPrimarySelected = true;
            }

            if (i === index) {
                if (!contact.campaignId)
                    contact.campaignId = campaign.id;
                return contact;
            } else {
                // If our updated entry is primary, make sure all the others are not
                if (contact.isPrimary) {
                    rowContact.isPrimary = false;
                }

                return rowContact;
            }
        });

        // We updated the last entry so need to add another
        if (index === rowContacts.length - 1) {
            contacts.push({ ...emptyRowContact, id: rowContacts.length });
        }

        setRowContacts(contacts);

        if (!changeMade && roleOrPrimarySelected) {
            setChangeMade(true);
        } else if (changeMade && !roleOrPrimarySelected) {
            setChangeMade(false);
        }
    };

    const handleNoPrimaryContact = () => {
        var roleOrPrimarySelected = false;
        for (let i = 0; i < rowContacts.length; i++) {
            const rowContact = rowContacts[i];
            rowContact.isPrimary = false;
            if (
                (rowContact.contactRoleId !== '' ||
                    (rowContact.new && rowContact.contactId)) &&
                !roleOrPrimarySelected
            ) {
                roleOrPrimarySelected = true;
            }
        }
        setRowContacts(rowContacts);
        setHasPrimaryContact(false);

        if (!changeMade && roleOrPrimarySelected) {
            setChangeMade(true);
        } else if (changeMade && !roleOrPrimarySelected) {
            setChangeMade(false);
        }
    };

    const handleSave = async () => {
        const contactsToSend = [];

        // The main way a link is established is if a role is set, if the role isn't set then discard the record
        let primaryContact = {};
        for (let i = 0; i < rowContacts.length; i++) {
            if (
                rowContacts[i].contactRoleId !== '' ||
                rowContacts[i].isPrimary ||
                (rowContacts[i].new && rowContacts[i].contactId)
            ) {
                contactsToSend.push(rowContacts[i]);
                if (rowContacts[i].isPrimary) {
                    primaryContact = {
                        id: rowContacts[i].contactId,
                        name: rowContacts[i].contactName
                    };
                }
            }
        }

        // Update the primaryContact before saving
        if (Object.keys(primaryContact).length === 0) {
            campaign.primaryContactId = null;
            campaign.primaryContactName = null;
        } else {
            campaign.primaryContactId = primaryContact.id;
            campaign.primaryContactName = primaryContact.name;
        }

        try {
            const response = await UpdateCampaignContacts(
                campaign.id,
                contactsToSend
            );

            if (response?.status === 200 || response?.status === 201) {
                campaign.campaignContacts = contactsToSend;
                handleClose();
            } else {
                console.error(response);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleClose = () => {
        delCampaign();
        delRowContacts();
        delHasPrimaryContact();
        location?.onClose
            ? location.onClose()
            : window.open(
              `${campaignManagerUrl}/campaigns/details?campaignId=${campaign?.id}&readOnly=true&goBack=true`,
              '_self'
              );
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
                <span style={titleStyle}>{campaign.name}</span>
                <Spacer height={18} />
                <span style={titleStyle}>Link Contacts</span>
                <Spacer height={35} />
                <LinkContactsTable
                    campaignContacts={rowContacts}
                    onUpdateContact={handleRowContactUpdate}
                    hasPrimaryContact={hasPrimaryContact}
                    onNoPrimaryContact={handleNoPrimaryContact}
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
                        id='save-campaigns-contacts'
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

export default CampaignsContactsLinkPage;
