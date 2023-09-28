import React, { useState, useEffect } from 'react';
import { sanitiseLinkUrl } from '../EditorLink';
import { Tooltip } from '@adserve/adserve-react-components';

const AnchorTag = ({ attributes, children, element }) => {
    const [linkMode, setLinkMode] = useState(false);

    const url = sanitiseLinkUrl(element.url);

    /**
     * Updates the link mode when an event is fired
     * @param {Event} e - event
     */
    const updateLinkMode = (e) => {
        setLinkMode(e.ctrlKey === true || e.metaKey === true);
    };

    /**
     * Overrides the default onClick action. Fixes ctrl+click on macOS
     * @param {Event} e - event
     */
    const onClick = (e) => {
        if (!linkMode) return;
        e.preventDefault();
        console.log(e.target);
        window.open(url);
    };

    /* Add the keydown event to the page, else you'd have to be
     * hovering over the link when you first press control. */
    useEffect(() => {
        document.addEventListener('keydown', updateLinkMode, true);
        document.addEventListener('keyup', updateLinkMode, true);
        return () => {
            document.removeEventListener('keydown', updateLinkMode, true);
            document.removeEventListener('keyup', updateLinkMode, true);
        };
    }, []);

    return (
        <a
            {...attributes}
            href={url}
            target='_blank'
            rel='noopener noreferrer'
            onKeyDown={updateLinkMode}
            onMouseOver={updateLinkMode}
            onClick={onClick}
            {...(linkMode && {
                contentEditable: false,
                style: {
                    cursor: 'pointer'
                }
            })}
        >
            {children}
        </a>
    );
};

export default AnchorTag;
