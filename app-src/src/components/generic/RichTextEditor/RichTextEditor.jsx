import React, {
    useMemo,
    useCallback,
    useState,
    useRef,
    useEffect
} from 'react';
import { createEditor } from 'slate';
import { Editable, withReact, Slate } from 'slate-react';
import { withHistory } from 'slate-history';
import {
    Flex,
    ScrollableArea,
    ScrollbarSvg
} from '@adserve/adserve-react-components';
import RteToolbar from './RteToolbar';
import Leaf from './Leaf';
import Element from './Element';
import { withLinks } from './EditorLink';
import isHotkey from 'is-hotkey';
import { toggleMark, HOTKEYS } from './EditorMark';

const RichTextEditor = ({
    id = 'rich-text-editor',
    value,
    updateValue,
    editorStyle,
    ...props
}) => {
    const [scrollPx, setScrollPx] = useState(0);
    const [scrollableHeight, setScrollableHeight] = useState(0);
    const [maxVisibleHeight, setMaxVisibleHeight] = useState(444);
    const [gutterOffset, setGutterOffset] = useState(0);

    const containerRef = useRef(null);
    const toolbarRef = useRef(null);

    const renderElement = useCallback((props) => <Element {...props} />, []);
    const renderLeaf = useCallback((props) => <Leaf {...props} />, []);

    const editor = useMemo(
        () => withLinks(withHistory(withReact(createEditor()))),
        []
    );

    useEffect(() => {
        const element = document.getElementById(`${id}-editable`);
        setScrollableHeight(element?.scrollHeight || 0);
        setMaxVisibleHeight(
            (containerRef?.current?.offsetHeight || 400) -
                (toolbarRef?.current?.offsetHeight || 44) -
                2
        );
        setGutterOffset(element?.offsetTop);
    }, [value]);

    const onKeyDown = (e) => {
        for (const hotkey in HOTKEYS) {
            if (isHotkey(hotkey, e)) {
                e.preventDefault();
                const mark = HOTKEYS[hotkey];
                toggleMark(editor, mark);
            }
        }
    };

    return (
        <ScrollableArea
            id={`${id}-scrollable-area'`}
            ref={containerRef}
            style={{
                border: '1px solid rgb(215,215,215)',
                borderRadius: 5,
                width: '100%',
                height: 'unset'
            }}
            scrollPx={scrollPx}
            onScroll={setScrollPx}
            scrollSpeed={24}
            scrollableLength={scrollableHeight}
            maxVisibleLength={maxVisibleHeight}
        >
            <Slate
                {...props}
                id={id}
                editor={editor}
                value={
                    value || [
                        {
                            type: 'paragraph',
                            children: [{ text: '' }]
                        }
                    ]
                }
                onChange={updateValue}
            >
                <Flex
                    id={`${id}-outer-container`}
                    style={{
                        flexDirection: 'column',
                        width: '100%',
                        height: '100%'
                    }}
                >
                    <RteToolbar id={`${id}-toolbar`} />
                    <Flex
                        id={`${id}-inner-container`}
                        style={{ height: '100%' }}
                    >
                        <Editable
                            id={`${id}-editable`}
                            style={{
                                width: '100%',
                                position: 'relative',
                                bottom: scrollPx,
                                padding: '0 13px',
                                overflowWrap: 'anywhere',
                                ...editorStyle
                            }}
                            renderElement={renderElement}
                            renderLeaf={renderLeaf}
                            placeholder='Start typing here...'
                            onKeyDown={onKeyDown}
                        />
                        <div
                            id={`${id}-gutter`}
                            style={{
                                width: 16,
                                height: '100%',
                                borderLeft: '1px solid rgb(215, 215, 215)'
                            }}
                        >
                            <ScrollbarSvg
                                id={`${id}-scrollbar`}
                                onScroll={setScrollPx}
                                scrollPx={scrollPx}
                                gutterOffset={gutterOffset}
                                disabled={
                                    scrollableHeight - 2 <= maxVisibleHeight
                                }
                                scrollableLength={scrollableHeight}
                                maxVisibleLength={maxVisibleHeight}
                            />
                        </div>
                    </Flex>
                </Flex>
            </Slate>
        </ScrollableArea>
    );
};

export default RichTextEditor;
