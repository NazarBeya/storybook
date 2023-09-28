import React from 'react';
import LineChartLegend from './LineChartLegend';
import LineChartYAxis from './LineChartYAxis';
import LineChartPlot from './LineChartPlot';
import LineChartXAxis from './LineChartXAxis';
import CrmSelect from '../../inputs/CrmSelect';
import { selectStyle } from '../../../styles';
import {
    CalculateChildDimPixels,
    CalculateFractionPixels
} from '../FunnelChart/FunnelChartUtilities';

const LineChart = ({
    title,
    id,
    data,
    period,
    dataPeriods,
    onPeriodUpdate,
    legendParams,
    xLabels,
    yLabels,
    containerStyle,
    lineChartProps,
    gap
}) => {
    const parentContainerStyle = {
        display: 'flex',
        ...containerStyle
    };

    const chartTitleContainerStyle = {
        height: '14%',
        width: '100%',
        textAlign: 'center',
        display: 'flex',
        justifyContent: 'center',
        ...lineChartProps?.titleStyles?.containerStyle
    };

    const chartTitleStyle = {
        color: '#414141',
        fontFamily: 'Roboto',
        fontSize: 22,
        lineHeight: '52px',
        fontWeight: 500,
        ...lineChartProps?.titleStyles?.titleStyle
    };

    const chartLegendContainerStyle = {
        height: '7.3%',
        width: '100%',
        ...lineChartProps?.legendStyles?.containerStyle
    };

    const chartContainerStyle = {
        display: 'flex',
        height: '64.7%',
        width: '100%',
        ...lineChartProps?.chartStyles?.containerStyle
    };

    const chartYAxisContainerStyle = {
        display: 'flex',
        width: '6.3%',
        ...lineChartProps?.yStyles?.containerStyle
    };

    const chartGapContainerStyle = {
        display: 'flex',
        width: '1%',
        ...lineChartProps?.chartStyles?.gapStyle
    };

    const chartPlotContainerStyle = {
        display: 'flex',
        width: '92.7%',
        ...lineChartProps?.chartStyles?.plotContainerStyle
    };

    const chartXAxisContainerStyle = {
        height: '15%',
        width: '100%',
        ...lineChartProps?.xStyles?.containerStyle
    };

    const titleHeight = CalculateChildDimPixels(
        parentContainerStyle?.height,
        chartTitleContainerStyle?.height
    );
    const legendHeight = CalculateChildDimPixels(
        parentContainerStyle?.height,
        chartLegendContainerStyle?.height
    );
    const xAxisHeight = CalculateChildDimPixels(
        parentContainerStyle?.height,
        chartXAxisContainerStyle?.height
    );
    const chartAreaHeight =
        parentContainerStyle?.height -
        (titleHeight + xAxisHeight + legendHeight);
    const yAxisWidth = CalculateChildDimPixels(
        parentContainerStyle?.width,
        chartYAxisContainerStyle?.width
    );
    const chartAreaWidth = parentContainerStyle?.width - yAxisWidth;
    const elementHeight = CalculateFractionPixels(
        chartAreaHeight,
        yLabels?.length
    );
    const gapWidth = CalculateChildDimPixels(
        parentContainerStyle?.width,
        gap || chartGapContainerStyle?.width
    );

    return (
        <div id={`${id}-parent-container`} style={parentContainerStyle}>
            <div style={{ width: '100%' }}>
                <div style={chartTitleContainerStyle}>
                    <span style={chartTitleStyle}>{title || 'Untitled'}</span>
                    {period && (
                        <CrmSelect
                            id='months-periods'
                            placeholder='Select time period'
                            crmLabelStyle={{ display: 'none' }}
                            value={period}
                            values={dataPeriods || []}
                            onChange={(e) =>
                              {
                                let newPeriod = Number(e.target.value);
                                if(newPeriod > 0){
                                  onPeriodUpdate(newPeriod)
                                }
                              }
                            }
                            style={{ marginLeft: 10, fontSize: 15 }}
                            selectStyle={{ ...selectStyle }}
                        />
                    )}
                </div>

                <div style={chartLegendContainerStyle}>
                    <LineChartLegend
                        id={id}
                        params={legendParams}
                        parentContainerStyle={chartLegendContainerStyle}
                    />
                </div>

                <div style={chartContainerStyle}>
                    <div style={chartYAxisContainerStyle}>
                        <LineChartYAxis
                            id={id}
                            yLabels={yLabels}
                            elementHeight={elementHeight}
                        />
                    </div>
                    <div style={gap || chartGapContainerStyle} />
                    <div style={chartPlotContainerStyle}>
                        <LineChartPlot
                            id={id}
                            data={data}
                            params={legendParams}
                            areaHeight={chartAreaHeight}
                            areaWidth={chartAreaWidth}
                            elementHeight={elementHeight}
                            xLabels={xLabels}
                            yLabels={yLabels}
                        />
                    </div>
                </div>

                <div style={chartXAxisContainerStyle}>
                    <LineChartXAxis
                        id={id}
                        xLabels={xLabels}
                        xAxisHeight={xAxisHeight}
                        yAxisWidth={yAxisWidth}
                        areaWidth={chartAreaWidth}
                        gapWidth={gapWidth}
                    />
                </div>
            </div>
        </div>
    );
};

export default LineChart;
