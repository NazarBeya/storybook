import React from 'react';

const FunnelChartStatuses = ({
    id,
    statusTitles,
    titleHeight,
    elementHeight,
    statusesProps
}) => {
    const titleStyle = {
        display: 'inline-block',
        color: '#414141',
        fontFamily: 'Roboto',
        fontSize: 15,
        fontWeight: 500,
        marginTop: elementHeight / 2 - statusesProps?.titleStyle?.fontSize || 15,
        marginLeft: 4,
        ...statusesProps?.titleStyle
    };

    return (
        <div id={`${id}-statuses-container`}>
            <div style={{ height: titleHeight }} />
            {statusTitles?.length > 0 && statusTitles.map((title, i) => (
                <div
                    id={`${id}-status${i}`}
                    key={`funnel-status${i}`}
                    style={{ height: elementHeight }}
                >
                    <span style={titleStyle}>{title}</span>
                </div>
            ))}
        </div>
    );
};

export default FunnelChartStatuses;
