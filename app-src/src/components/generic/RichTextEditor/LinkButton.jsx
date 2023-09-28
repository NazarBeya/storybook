import React from 'react';
import { CheckButton } from '@adserve/adserve-react-components';
import { useSlate } from 'slate-react';
import { isLinkActive, wrapLink, sanitiseLinkUrl } from './EditorLink';

const LinkButton = ({ ...props }) => {
    const editor = useSlate();

    const insertLink = (editor, url) => {
        if (editor.selection) {
            wrapLink(editor, url);
        }
    };

    const onMouseDown = (e) => {
        e.preventDefault();
        const url = window.prompt('Enter the URL of the link:');
        if (!url) return;
        insertLink(editor, sanitiseLinkUrl(url));
    };

    return (
        <CheckButton
            {...props}
            id='link-button'
            style={{
                backgroundColor: isLinkActive(editor) ? '#d7d7d7' : '#00000000',
                border: isLinkActive(editor)
                    ? '1px solid #ccccccff'
                    : '1px solid #cccccc00',
                margin: 8
            }}
            onMouseDown={onMouseDown}
        />
    );
};

export default LinkButton;
