import { Flex } from '@adserve/adserve-react-components';
import React from 'react';

const FlexColumn = ({ id = 'column-flex', style, ...props }) => {
    return (
        <Flex
            {...props}
            id={id}
            style={{ flexDirection: 'column', height: '100%', ...style }}
        />
    );
};

export default FlexColumn;
