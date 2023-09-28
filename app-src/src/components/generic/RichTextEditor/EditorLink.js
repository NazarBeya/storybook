import { Transforms, Editor, Range } from 'slate';
import isUrl from 'is-url';

export const withLinks = (editor) => {
    const { insertData, insertText, isInline } = editor;

    editor.isInline = (element) => {
        return element.type === 'link' ? true : isInline(element);
    };

    editor.insertText = (text) => {
        if (text && isUrl(text)) {
            wrapLink(editor, text);
        } else {
            insertText(text);
        }
    };

    editor.insertData = (data) => {
        const text = data.getData('text/plain');

        if (text && isUrl(text)) {
            wrapLink(editor, text);
        } else {
            insertData(data);
        }
    };

    return editor;
};

export const unwrapLink = (editor) => {
    Transforms.unwrapNodes(editor, { match: (n) => n.type === 'link' });
};

export const wrapLink = (editor, url) => {
    if (isLinkActive(editor)) {
        unwrapLink(editor);
    }

    const { selection } = editor;
    const isCollapsed = selection && Range.isCollapsed(selection);
    const link = {
        type: 'link',
        url,
        children: isCollapsed ? [{ text: url }] : []
    };

    if (isCollapsed) {
        Transforms.insertNodes(editor, link);
    } else {
        Transforms.wrapNodes(editor, link, { split: true });
        Transforms.collapse(editor, { edge: 'end' });
    }
};

export const isLinkActive = (editor) => {
    const [link] = Editor.nodes(editor, { match: (n) => n.type === 'link' });
    return !!link;
};

/**
 * Adds missing protocol to url if requred
 * @param {string} url - url to sanatise
 */
export const sanitiseLinkUrl = (url) =>
    url.includes('://') ? url : `https://${url}`;
