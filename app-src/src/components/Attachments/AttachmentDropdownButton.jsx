import React from 'react';
import { RadioDropdownButton } from '@adserve/adserve-react-components';
import { useHistory } from 'react-router-dom';

const AttachmentDropdownButton = ({
    entityId,
    heading,
    entityType,
    onClose
}) => {
    const history = useHistory();

    /**
     * Event handler for the create button
     * @param {string} option - option
     */
    const handleCreateNewClick = (option) => {
        history.push({
            pathname: '/attachments/create',
            state: {
                entityId: entityId,
                isNote: option === 'Note',
                isEditing: false,
                heading: heading,
                entityType: entityType
            },
            onClose: onClose
        });
    };

    return (
        <div
            id='attachment-create-new-dropdown-button'
            style={{
                alignSelf: 'flex-end',
                position: 'absolute',
                marginTop: -47,
                marginRight: 33,
                zIndex: 250
            }}
        >
            <RadioDropdownButton
                text={window.translate('Create New')}
                options={['Note', 'Attach File']}
                createClick={handleCreateNewClick}
                style={{
                    marginRight: 40
                }}
            />
        </div>
    );
};

export default AttachmentDropdownButton;
