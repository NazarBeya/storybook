import React from 'react';

const LineChartYAxis = ({ id, yLabels, elementHeight, yProps }) => {
    const labelContainerStyle = {
        textAlign: 'right',
        marginTop: -10,
        ...yProps?.labelContainerStyle
    };

    const labelStyle = {
        display: 'block',
        color: '#414141',
        fontFamily: 'Roboto',
        fontSize: 15,
        fontWeight: 500,
        marginTop:
            elementHeight / 2 - (yProps?.labelStyle?.fontSize * 0.66 || 10),
        ...yProps?.labelStyle
    };

    return (
        <div id={`${id}-yaxis-container`} style={labelContainerStyle}>
            {yLabels?.length > 0 && yLabels.map((label, i) => (
                <div
                    id={`${id}-yaxis-label${i}`}
                    key={`line-yaxis-label${i}`}
                    style={{ height: elementHeight }}
                >
                    <span style={labelStyle}>{label}</span>
                </div>
            ))}
        </div>
    );
};

export default LineChartYAxis;
