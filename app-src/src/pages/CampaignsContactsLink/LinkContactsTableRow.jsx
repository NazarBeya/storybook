import {
    AsSelect,
    AsText,
    RadioButton,
    StripedTableCell,
    StripedTableScrollbarRow
} from '@adserve/adserve-react-components';
import React from 'react';
import CompactTable from '../../components/generic/CompactTable/CompactTable';
import { ContactsLookup } from '../../services/ContactsDataService';
import ContactCompactTableColumnDefinitions from '../Campaigns/ContactCompactTableColumnDefinitions';
import CrmSelect from '../../components/inputs/CrmSelect';

const LinkContactsTableRow = ({
    index,
    contact,
    contactRoles,
    onUpdateContact,
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

    const updateContact = (name, value) => {
        if (onUpdateContact) {
            const updatedContact = {
                ...contact,
                [name]: value,
                contactId: name === 'contactName' ? '' : contact.contactId,
                accountName:
                    name === 'contactName' && contact.new
                        ? ''
                        : contact.accountName
            };
            onUpdateContact(updatedContact);
        }
    };

    const handleDropdownClick = (searchResult) => {
        if (onUpdateContact) {
            const updatedContact = {
                ...contact,
                contactId: searchResult.id,
                contactName: searchResult.name,
                accountName: searchResult.accountName
            };
            onUpdateContact(updatedContact);
        }
    };

    const handleOpenClick = (event) => {
        if (Object.keys(contact).length <= 2) {
            event.preventDefault();
        }
    };

    return (
        <StripedTableScrollbarRow
            id={`${contact.id}-row`}
            key={contact.id}
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
            >
                <RadioButton
                    id={`${index}-primary`}
                    value={contact.isPrimary}
                    onClick={() => updateContact('isPrimary', true)}
                />
            </StripedTableCell>
            <StripedTableCell
                index={index}
                border={borderNone}
                style={{ ...rowStyle, paddingRight: 110 }}
                evenStyle={tableCellStyle}
                oddStyle={tableCellStyle}
                scrollPx={scrollPx}
            >
                <CompactTable
                    id={`${index}-contact`}
                    inputStyle={{ ...inputStyle, width: 350, height: 40 }}
                    buttonStyle={{ width: 40 }}
                    separateButton
                    value={contact.contactName}
                    disabled={!contact.new}
                    onOpenClick={handleOpenClick}
                    onChange={(e) =>
                        updateContact('contactName', e.target.value)
                    }
                    searchFunction={(searchTerm, params) =>
                        ContactsLookup(searchTerm, params)
                    }
                    tableColumnDefinitions={
                        ContactCompactTableColumnDefinitions
                    }
                    onDropdownClick={handleDropdownClick}
                    returnPath='/campaigns/contactslink'
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
                    id={`${index}-account`}
                    style={{ ...inputStyle, width: 350 }}
                    inputStyle={{ height: 40 }}
                    value={contact.accountName}
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
                    value={contact.contactRoleId}
                    disabled={contact.new && !contact.contactName}
                    onChange={(e) =>
                        updateContact('contactRoleId', e.target.value)
                    }
                />
            </StripedTableCell>
        </StripedTableScrollbarRow>
    );
};

export default LinkContactsTableRow;
