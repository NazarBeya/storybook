import React, { useState, useEffect } from 'react';
import FunnelChartStatuses from './FunnelChartStatuses';
import FunnelChartGraphic from './FunnelChartGraphic';
import {
    CalculateChildDimPixels,
    CalculateFractionPixels,
    CalculateStatusValues
} from './FunnelChartUtilities';

const FunnelChart = ({
    title,
    id = 'funnel-chart',
    statusTitles,
    funnelStatusKey = 'status',
    funnelValueKey = 'spend',
    values,
    containerStyle,
    funnelChartProps
}) => {
    const [statusValues, setStatusValues] = useState([]);
    const parentContainerStyle = {
        display: 'flex',
        ...containerStyle
    };

    const statussContainerStyle = {
        display: 'flex',
        width: '18.5%',
        ...funnelChartProps?.statussStyles?.containerStyle
    };

    const chartContainerStyle = {
        width: '81.5%',
        ...funnelChartProps?.chartStyles?.containerStyle
    };

    const chartTitleContainerStyle = {
        height: '17.8%',
        textAlign: 'center',
        lineHeight: '50px',
        ...funnelChartProps?.titleStyles?.containerStyle
    };

    const chartTitleStyle = {
        color: '#414141',
        fontFamily: 'Roboto',
        fontSize: 22,
        fontWeight: 500,
        ...funnelChartProps?.titleStyles?.titleStyle
    };

    const chartGraphicContainerStyle = {
        height: '82.2%',
        ...funnelChartProps?.chartStyles?.chartContainerStyle
    };

    const titleHeight = CalculateChildDimPixels(
        parentContainerStyle?.height,
        chartTitleContainerStyle?.height
    );
    const chartAreaHeight = parentContainerStyle?.height - titleHeight;
    const statussWidth = CalculateChildDimPixels(
        parentContainerStyle?.width,
        statussContainerStyle?.width
    );
    const chartAreaWidth = parentContainerStyle?.width - statussWidth;
    const statusElementHeight = CalculateFractionPixels(
        parentContainerStyle?.height - titleHeight,
        statusTitles?.length < 5 ? 5 : statusTitles?.length
    );

    useEffect(() => {
        setStatusValues(
            CalculateStatusValues(values, funnelStatusKey, funnelValueKey)
        );
    }, [values, funnelStatusKey, funnelValueKey]);

    return (
        <div id={`${id}-parent-container`} style={parentContainerStyle}>
            <div style={statussContainerStyle}>
                <FunnelChartStatuses
                    id={id}
                    statusTitles={statusTitles}
                    parentContainerStyle={parentContainerStyle}
                    titleHeight={titleHeight}
                    elementHeight={statusElementHeight}
                />
            </div>
            <div style={chartContainerStyle}>
                <div style={chartTitleContainerStyle}>
                    <span style={chartTitleStyle}>{title || 'Untitled'}</span>
                </div>
                <div style={chartGraphicContainerStyle}>
                    {statusTitles && <FunnelChartGraphic
                        id={id}
                        statusTitles={statusTitles}
                        values={statusValues}
                        areaHeight={chartAreaHeight}
                        areaWidth={chartAreaWidth}
                        elementHeight={statusElementHeight}
                    />}
                </div>
            </div>
        </div>
    );
};

export default FunnelChart;
