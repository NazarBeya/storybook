import React, { forwardRef } from 'react';
import MarkButton from './MarkButton';
import BlockButton from './BlockButton';
import { Flex } from '@adserve/adserve-react-components';
import { ReactComponent as IconBold } from '../../../svg/icon_txt_Bold.svg';
import { ReactComponent as IconBullets } from '../../../svg/icon_txt_bullets.svg';
import { ReactComponent as IconItalic } from '../../../svg/icon_txt_Italic.svg';
import { ReactComponent as IconLink } from '../../../svg/icon_txt_Link.svg';
import { ReactComponent as IconNumbers } from '../../../svg/icon_txt_numbers.svg';
import { ReactComponent as IconUnderline } from '../../../svg/icon_txt_Underline.svg';
import LinkButton from './LinkButton';

const RteToolbar = forwardRef(
    ({ id = 'rich-text-editor-toolbar', editor, style, ...props }, ref) => {
        const iconAttributes = {
            height: 22,
            fill: '#414141'
        };

        return (
            <Flex
                {...props}
                ref={ref}
                id={id}
                centreVertical
                style={{
                    boxSizing: 'border-box',
                    width: '100%',
                    borderBottom: '1px solid #d7d7d7',
                    borderRadius: '5px 5px 0 0',
                    backgroundColor: '#f7f7f7',
                    justifyContent: 'flex-end',
                    height: 44,
                    zIndex: 1
                }}
            >
                <Seperator />

                <MarkButton format='bold' editor={editor}>
                    <IconBold {...iconAttributes} />
                </MarkButton>
                <MarkButton format='italic' editor={editor}>
                    <IconItalic {...iconAttributes} />
                </MarkButton>
                <MarkButton format='underline' editor={editor}>
                    <IconUnderline {...iconAttributes} />
                </MarkButton>

                <Seperator />

                <BlockButton format='numbered-list'>
                    <IconNumbers {...iconAttributes} />
                </BlockButton>
                <BlockButton format='bulleted-list'>
                    <IconBullets {...iconAttributes} />
                </BlockButton>

                <Seperator />

                <LinkButton format='link' editor={editor}>
                    <IconLink {...iconAttributes} />
                </LinkButton>
            </Flex>
        );
    }
);

const Seperator = () => (
    <div
        style={{
            borderLeft: '1px solid #d7d7d7',
            height: 30,
            boxSizing: 'border-box'
        }}
    />
);

export default RteToolbar;
