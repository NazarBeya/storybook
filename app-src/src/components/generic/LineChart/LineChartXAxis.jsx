import React from 'react';

const LineChartXAxis = ({
    id,
    xLabels,
    xAxisHeight,
    yAxisWidth,
    gapWidth,
    xProps
}) => {
    const labelStyle = {
        color: '#414141',
        fontFamily: 'Roboto',
        fontSize: 12,
        fontWeight: 500,
        ...xProps?.labelStyle
    };

    return (
        <div
            id={`${id}-xaxis-container`}
            style={{ display: 'flex', width: '100%', height: xAxisHeight }}
        >
            <div style={{ width: yAxisWidth + gapWidth }} />
            {xLabels?.length > 0 && xLabels.map((label, i) => (
                <div
                    id={`${id}-xaxis-label${i}`}
                    key={`line-xaxis-label${i}`}
                    style={{
                        display: 'flex',
                        width: `${100 / xLabels?.length}%`,
                        marginLeft: '6%',
                        marginTop: xAxisHeight / 2 - 3
                    }}
                >
                    <span style={labelStyle}>{label}</span>
                </div>
            ))}
        </div>
    );
};

export default LineChartXAxis;
