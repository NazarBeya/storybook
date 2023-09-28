import React from 'react';
import { Editor, Transforms } from 'slate';
import { useSlate } from 'slate-react';
import { CheckButton } from '@adserve/adserve-react-components';

const BlockButton = ({ format, ...props }) => {
    const editor = useSlate();

    const LIST_TYPES = ['numbered-list', 'bulleted-list'];

    const isBlockActive = () => {
        const [match] = Editor.nodes(editor, {
            match: (n) => n.type === format
        });

        return !!match;
    };

    const isActive = isBlockActive(editor, format);

    const toggleBlock = () => {
        const isList = LIST_TYPES.includes(format);

        Transforms.unwrapNodes(editor, {
            match: (n) => LIST_TYPES.includes(n.type),
            split: true
        });

        Transforms.setNodes(editor, {
            type: isActive ? 'paragraph' : isList ? 'list-item' : format
        });

        if (!isActive && isList) {
            const block = { type: format, children: [] };
            Transforms.wrapNodes(editor, block);
        }
    };
    return (
        <CheckButton
            {...props}
            id={`block-button-${format}`}
            style={{
                backgroundColor: isActive ? '#d7d7d7' : '#00000000',
                border: isActive
                    ? '1px solid #ccccccff'
                    : '1px solid #cccccc00',
                margin: 8
            }}
            value={isActive}
            onClick={() => toggleBlock()}
        />
    );
};

export default BlockButton;
