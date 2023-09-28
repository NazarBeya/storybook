import React, { useState } from 'react';
import { Flex } from '@adserve/adserve-react-components';
import FileUploadButton from '../generic/FileUploadButton';
import UploadBar from './UploadBar';

const DragDropRegion = ({
    progress,
    onFileSelect,
    disabled = false,
    ...props
}) => {
    const [selectedFile, setSelectedFile] = useState(undefined);

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        onFileSelect(file);
        setSelectedFile(file);
    };

    const handleFileSelect = (file) => {
        setSelectedFile(file);
        onFileSelect(file);
    };

    const handleDeleteClick = () => {
        setSelectedFile(undefined);
    };

    return (
        <Flex
            {...props}
            centre
            style={{
                boxSizing: 'border-box',
                border: '1px solid #d7d7d7',
                borderRadius: 5,
                height: '100%',
                textAlign: 'center',
                fontSize: 15,
                color: '#414141',
                fontWeight: 500,
                fontFamily: 'roboto',
                maxHeight: 412,
                ...props.style
            }}
            {...(disabled
                ? {}
                : {
                      onDrop: handleDrop,
                      onDragOver: handleDragOver
                  })}
        >
            <Flex
                id='drag-drop-region-centred-content-container'
                centre
                style={{
                    flexDirection: 'column',
                    minWidth: '50%',
                    maxWidth: '100%'
                }}
            >
                <div>
                    Drag and drop your file here
                    <br />
                    or
                </div>
                <FileUploadButton
                    onFileSelect={handleFileSelect}
                    disabled={disabled}
                >
                    Select file
                </FileUploadButton>
                {selectedFile && (
                    <UploadBar
                        file={selectedFile}
                        progress={progress}
                        onDeleteClick={handleDeleteClick}
                    />
                )}
            </Flex>
        </Flex>
    );
};

export default DragDropRegion;
