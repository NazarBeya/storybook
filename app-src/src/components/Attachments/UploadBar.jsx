import React from 'react';
import { Flex, Spacer, IconDelete } from '@adserve/adserve-react-components';

const Bar = ({ progress = 0, ...props }) => (
    <svg width='100%' height={12} {...props}>
        <rect
            id='upload-bar-background'
            width='100%'
            height={12}
            x={0}
            y={0}
            rx={5}
            ry={5}
            fill='#ffffff'
            stroke='#d7d7d7'
        />
        <rect
            id='upload-bar-foreground'
            width={`${progress}%`}
            height={12}
            x={0}
            y={0}
            rx={5}
            ry={5}
            fill='#faa800'
            fillRule='evenodd'
            stroke='#d7d7d7'
        />
    </svg>
);

const UploadBar = ({ file, progress, style, onDeleteClick, ...props }) => {
    return (
        <Flex
            {...props}
            style={{
                boxSizing: 'border-box',
                width: '100%',
                border: '1px solid #d7d7d7',
                borderRadius: 5,
                backgroundColor: '#f7f7f7',
                flexDirection: 'column',
                padding: '16px 13px',
                ...style
            }}
        >
            <Flex spaceBetween>
                <div id='upload-bar-file-size'>{Math.round(file.size / 1000)} KB</div>
                <IconDelete id='upload-bar-delete-icon' height={21} width={18} onClick={onDeleteClick} />
            </Flex>

            <Spacer height={15} />

            <span id='upload-bar-file-name'>{file.name}</span>

            <Spacer height={42} />

            <span id='upload-bar-span' style={{ padding: '0 40px' }}>
                <Bar id='upload-bar' progress={progress} />
            </span>
        </Flex>
    );
};

export default UploadBar;
