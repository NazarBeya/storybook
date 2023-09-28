import React from 'react';
import { Flex, Spacer } from '@adserve/adserve-react-components';

const SvgLabel = ({ title, icon }) => {
    return (
        <>
            <Flex centreVertical>
                {icon}
                <Spacer width={6} />
                {title}
            </Flex>
            <Spacer height={3} />
        </>
    );
};

export default SvgLabel;
