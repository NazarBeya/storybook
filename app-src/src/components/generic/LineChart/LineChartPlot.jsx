import React, { useState, useEffect } from 'react';
import { RelativePercentage } from './LineChartUtilities';

const LineChartPlot = ({
    id,
    data,
    params,
    areaHeight,
    areaWidth,
    elementHeight,
    xLabels,
    yLabels,
    plotProps
}) => {
    const [graphBackground, setGraphBackground] = useState([]);
    const [graphParts, setGraphParts] = useState([]);

    const CalculateBackgroundLines = (count) => {
        let updatedGraphBackground = [];
        let currY = plotProps?.circleStyle?.radius || 3;
        for (let i = 0; i < count; i++) {
            updatedGraphBackground.push(
                <line
                    id={`${id}-bgline${i}`}
                    key={`line-bgline${i}`}
                    stroke={plotProps?.backgroundStyle?.stroke || '#CCCCCC'}
                    strokeWidth={plotProps?.backgroundStyle?.strokeWidth || 1}
                    x1={1}
                    x2={areaWidth}
                    y1={currY}
                    y2={currY}
                />
            );
            currY += elementHeight + elementHeight / count;
        }

        return updatedGraphBackground;
    };

    const PlotGraph = () => {
        if (yLabels == null || yLabels.length == 0) {
            return;
        }

        let currentGraphParts = [];
        let currX;
        let currY;
        let prevX;
        let prevY;
        let graphYPercent;
        for (let i = 0; i < data?.length; i++) {
            for (let j = 0; j < data[i]?.length; j++) {
                graphYPercent = RelativePercentage(data[i][j], yLabels[0]);
                currX =
                    j === data[i]?.length - 1
                        ? areaWidth - (plotProps?.circleStyle?.radius || 3)
                        : (plotProps?.circleStyle?.radius || 3) +
                          j *
                              (areaWidth / (xLabels?.length || 12) +
                                  (plotProps?.circleStyle?.radius * 2 || 6));
                currY = areaHeight * RelativePercentage(data[i][j], yLabels[0]);
                if (graphYPercent > 0.45)
                    currY -=
                        (plotProps?.circleStyle?.radius || 3) *
                        RelativePercentage(data[i][j], yLabels[0]);
                if (j > 0) {
                    currentGraphParts.push(
                        <line
                            id={`${id}-graphline${i}${j}`}
                            key={`graphline${i}${j}`}
                            stroke={params[i]?.colour}
                            transform={`matrix(1 0 0 -1 0 ${areaHeight})`}
                            strokeWidth={plotProps?.lineStyle?.strokeWidth || 3}
                            x1={
                                prevX +
                                (plotProps?.circleStyle?.radius * 0.8 || 2.6)
                            }
                            y1={prevY}
                            x2={currX}
                            y2={currY}
                        />
                    );
                }
                currentGraphParts.push(
                    <circle
                        id={`${id}-graphcircle${i}${j}`}
                        key={`graphcircle${i}${j}`}
                        transform={`matrix(1 0 0 -1 0 ${areaHeight})`}
                        cx={currX}
                        cy={currY}
                        r={plotProps?.circleStyle?.radius * 0.6 || 2.4}
                        width={plotProps?.circleStyle?.height || 6}
                        height={plotProps?.circleStyle?.width || 6}
                        stroke={plotProps?.circleStyle?.stroke || '#CCCCCC'}
                        strokeWidth={plotProps?.circleStyle?.strokeWidth || 1}
                        fill={plotProps?.circleStyle?.fill || '#FFFFFF'}
                    />
                );
                prevX = currX;
                prevY = currY;
            }
        }
        setGraphParts(currentGraphParts);
    };

    useEffect(() => {
        setGraphBackground(CalculateBackgroundLines(yLabels?.length));
        PlotGraph();
    }, [data, areaHeight, areaWidth, elementHeight, yLabels]);

    return (
        <div id={`${id}-plot-container`} style={{ height: '100%' }}>
            <div style={{ position: 'absolute' }}>
                <svg
                    id={`${id}-plot-bg-svg`}
                    style={{ position: 'absolute' }}
                    height={areaHeight}
                    width={areaWidth}
                >
                    {graphBackground}
                </svg>
                <svg
                    id={`${id}-plot-points-svg`}
                    style={{ position: 'absolute' }}
                    height={areaHeight + (plotProps?.circleStyle?.radius || 3)}
                    width={areaWidth}
                >
                    {graphParts}
                </svg>
            </div>
        </div>
    );
};

export default LineChartPlot;
