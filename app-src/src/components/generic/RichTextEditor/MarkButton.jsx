import React from 'react';
import { CheckButton } from '@adserve/adserve-react-components';
import { useSlate } from 'slate-react';
import { toggleMark, isMarkActive } from './EditorMark';

const MarkButton = ({ editor, format, ...props }) => {
    editor = useSlate();
    const isActive = isMarkActive(editor, format);

    return (
        <CheckButton
            {...props}
            style={{
                backgroundColor: isActive ? '#d7d7d7' : '#00000000',
                border: isActive
                    ? '1px solid #ccccccff'
                    : '1px solid #cccccc00',
                margin: 8
            }}
            id={`mark-button-${format}`}
            value={isActive}
            onClick={() => toggleMark(editor, format)}
        />
    );
};

export default MarkButton;
