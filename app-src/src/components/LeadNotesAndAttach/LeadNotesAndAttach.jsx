import React from 'react';
import AttachmentList from '../Attachments/AttachmentList';

const LeadNotesAndAttach = ({ entityId, entityType, onClose, heading }) => {
    return (
        <AttachmentList
            entityId={entityId}
            entityType={entityType}
            onClose={onClose}
            heading={heading}
        />
    );
};

export default LeadNotesAndAttach;
