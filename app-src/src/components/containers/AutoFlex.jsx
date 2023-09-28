import React from 'react';
import { Flex } from '@adserve/adserve-react-components';

const AutoFlex = ({ itemPadding = 0, children, ...props }) => {
    const itemWidth = `${100 / (children?.length || 1)}%`;
    return (
        <Flex {...props} style={{ width: '100%', ...props.style }}>
            {Array.isArray(children) ? (
                children.map((child, i) => (
                    <div
                        key={i}
                        style={{ width: itemWidth, padding: itemPadding }}
                    >
                        {child}
                    </div>
                ))
            ) : (
                <span style={{ padding: itemPadding }}>{children}</span>
            )}
        </Flex>
    );
};

export default AutoFlex;
