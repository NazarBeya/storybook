import React, { useState } from 'react';
import CompactTableModal from '../../components/generic/CompactTable/CompactTableModal';
import { ContactsLookup } from '../../services/ContactsDataService';
import LinkedContactsTableColumnDefinitions from './LinkedContactsTableColumnDefinitions';

const LinkContactsModal = ({ isShowing, onClose, onSelect }) => {
    const [searchResults, setSearchResults] = useState([]);

    const minSearchLength = 3;

    const childSearch = async (searchTerm, params) => {
        if (searchTerm.length) {
            try {
                const results = await ContactsLookup(searchTerm, {
                    ...params,
                    //filter: 'notset',
                    useFirstColumnOnly: true
                });

                return results;
            } catch (error) {
                // eslint-disable-next-line no-console
                console.log(error);
                return [];
            }
        }
        return [];
    };

    return (
        isShowing && (
            <CompactTableModal
                onClose={onClose}
                searchFunction={childSearch}
                tableColumnDefinitions={LinkedContactsTableColumnDefinitions}
                minSearchLength={minSearchLength}
                initSearchTerm={''}
                id='contacts-modal'
                onSelect={onSelect}
                searchResults={searchResults}
            />
        )
    );
};

export default LinkContactsModal;
