import React, { useState, useEffect } from 'react';
import PageContainer from '../containers/PageContainer';
import {
    AsText,
    Flex,
    AsLabel,
    AsButton,
    Spacer
} from '@adserve/adserve-react-components';
import { inputStyle } from '../../styles';
import DragDropRegion from './DragDropRegion';
import { useLocation, useHistory } from 'react-router-dom';
import RichTextEditor from '../generic/RichTextEditor/RichTextEditor';

const buttonStyle = {
    margin: '0 10px',
    fontSize: 15,
    height: 34
};

const headingStyle = {
    fontSize: 22,
    fontWeight: 500,
    color: '#414141'
};

const AttachmentCreate = () => {
    const location = useLocation();
    const history = useHistory();

    const [currentFile, setCurrentFile] = useState(undefined);
    const [progress, setProgress] = useState(0);
    const [name, setName] = useState('');
    const [desc, setDesc] = useState('');
    const [entityId, setEntityId] = useState();
    const [isNote, setIsNote] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [noteValue, setNoteValue] = useState([
        {
            type: 'paragraph',
            children: [{ text: '' }]
        }
    ]);

    useEffect(() => {
        const entityId = location?.state?.entityId;
        if (!entityId) handleClose();
        setEntityId(entityId);
        setIsNote(location?.state?.isNote);
        setIsEditing(location?.state?.isEditing);
        setNoteValue(location?.state?.noteValue);
        setName(location?.state?.name ?? '');
        setDesc(location?.state?.description ?? '');
    }, []);

    const onUploadProgress = (e) => {
        setProgress(Math.round((100 * e.loaded) / e.total));
    };

    const upload = async () => {
        let promise;
        if (isNote) {
            // Note upload
            const NoteService = require('../../services/NoteService');
            const payload = {
                id: location.state.id,
                name: name,
                description: desc,
                entityId: entityId,
                slateValue: JSON.stringify(noteValue)
            };
            promise = isEditing
                ? NoteService.updateNote(payload, location?.state?.entityType)
                : NoteService.createNote(payload, location?.state?.entityType);
        } else {
            // Attachment upload
            setProgress(0);
            const AttachmentService = require('../../services/AttachmentService');
            if (isEditing && currentFile === undefined) {
                promise = AttachmentService.updateAttachment(
                    {
                        id: location.state.id,
                        name: name,
                        description: desc,
                        file: currentFile
                    },
                    location?.state?.entityType
                );
            } else {
                promise = AttachmentService.upload(
                    currentFile,
                    onUploadProgress,
                    entityId,
                    name,
                    desc,
                    location?.state?.entityType
                );
                // If we're replacing a file
                if (isEditing && (await promise)) {
                    promise = AttachmentService.deleteAttachment(
                        location.state, // id
                        location.state.entityType
                    );
                }
            }
        }

        if (await promise) {
            handleClose();
        }
    };

    const handleClose = () => {
        location?.onClose ? location.onClose() : history.goBack();
    };

    return (
        <PageContainer onClose={handleClose}>
            <div
                id='attachments-container'
                style={{ padding: '24px 63px 71px 66px', height: '100%' }}
            >
                <h1 id='attachment-entity-name' style={headingStyle}>
                    {location?.state?.heading}
                </h1>
                <Flex>
                    <h1 style={headingStyle}>
                        {isEditing
                            ? `Editing ${isNote ? 'Note' : 'Attachment'}`
                            : 'Create New'}
                    </h1>
                    <AsLabel
                        id='attachments-mandatory-fields-label'
                        style={{ flex: 1, textAlign: 'right' }}
                    >
                        * Mandatory fields
                    </AsLabel>
                </Flex>

                <Flex id='attachments-input-container'>
                    <div id='left-column' style={{ flex: 1 }}>
                        <Flex id='attachment-textbox-container'>
                            <div style={{ flex: 1 }}>
                                <AsText
                                    inputStyle={inputStyle}
                                    title='Name *'
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    autoFocus
                                />
                            </div>
                            <Spacer width={47} />
                            <div style={{ flex: 2 }}>
                                <AsText
                                    inputStyle={inputStyle}
                                    title='Description'
                                    value={desc}
                                    onChange={(e) => setDesc(e.target.value)}
                                />
                            </div>
                        </Flex>
                        <Spacer height={49} />
                        <Flex
                            id='attachement-content-container'
                            style={{
                                width: '100%',
                                height: 412,
                                overflowY: 'hidden'
                            }}
                        >
                            {isNote ? (
                                <RichTextEditor
                                    style={{ flex: 3 }}
                                    value={noteValue}
                                    updateValue={setNoteValue}
                                />
                            ) : (
                                <DragDropRegion
                                    style={{ flex: 3 }}
                                    onFileSelect={setCurrentFile}
                                    progress={progress}
                                    disabled={name.length < 3}
                                />
                            )}
                        </Flex>
                    </div>
                    <Flex
                        id='right-column'
                        style={{
                            flexDirection: 'column',
                            width: 324,
                            justifyContent: 'flex-end'
                        }}
                    >
                        <Flex
                            id='attachments-button-container'
                            style={{ justifyContent: 'flex-end' }}
                        >
                            <AsButton
                                style={{ ...buttonStyle, width: 85 }}
                                useTertiaryStyle
                                handleClick={handleClose}
                            >
                                Cancel
                            </AsButton>
                            <AsButton
                                style={{ ...buttonStyle, width: 130 }}
                                handleClick={upload}
                                disabled={
                                    // Has a name been specified?
                                    name.length < 3 ||
                                    // Is a note to save?
                                    (isNote && noteValue === undefined) ||
                                    // Has a file been selected to upload?
                                    (!isNote && currentFile === undefined) ||
                                    // Is a file being uploaded?
                                    progress > 0
                                }
                            >
                                {progress > 0
                                    ? 'Uploading'
                                    : isNote || isEditing
                                    ? 'Save'
                                    : 'Upload'}
                            </AsButton>
                        </Flex>
                    </Flex>
                </Flex>
            </div>
        </PageContainer>
    );
};

export default AttachmentCreate;
