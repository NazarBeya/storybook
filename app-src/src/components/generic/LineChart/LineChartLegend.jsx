import React from 'react';

const LineChartLegend = ({ id, params, parentContainerStyle, legendProps }) => {
    const containerStyle = {
        display: 'flex',
        width: '100%',
        justifyContent: 'flex-end',
        textAlign: 'center',
        ...legendProps?.containerStyle
    };

    const textStyle = {
        color: '#414141',
        fontFamily: 'Roboto',
        fontSize: 12,
        fontWeight: 900,
        ...legendProps?.textStyle
    };

    const itemContainerStyle = {
        width: 100,
        marginLeft: 19,
        ...legendProps?.itemContainerStyle
    };

    const svgContainerStyle = {
        display: 'block',
        marginTop: -10,
        ...legendProps?.svgContainerStyle
    };

    const rectStyle = {
        height: 3,
        width: 37,
        strokeWidth: 3,
        ...legendProps?.rectStyle
    };

    return (
        <div id={`${id}-legend-container`} align='right' style={containerStyle}>
            {params.map((item, i) => (
                <div
                    id={`${id}-legend${i}`}
                    align='right'
                    key={`line-legend${i}`}
                    style={itemContainerStyle}
                >
                    <span style={textStyle}>{item?.title}</span>
                    <svg
                        style={svgContainerStyle}
                        height={parentContainerStyle?.height}
                        width={parentContainerStyle?.width}
                    >
                        <rect
                            width={rectStyle?.width}
                            height={rectStyle?.height}
                            stroke={
                                legendProps?.rectStyle?.stroke ||
                                params[i]?.colour
                            }
                            strokeWidth={rectStyle.strokeWidth}
                        />
                    </svg>
                </div>
            ))}
        </div>
    );
};

export default LineChartLegend;
