import React, { useContext, useState, useEffect } from 'react';
import { SystemSettingsContext } from '../../../contexts/SystemSettingsContext';

const FunnelChartGraphic = ({
    id,
    statusTitles,
    values,
    areaHeight,
    areaWidth,
    elementHeight,
    graphicProps
}) => {
    const { formatCurrency, currencySybmol } = useContext(SystemSettingsContext);

    const [funnelBlocks, setFunnelBlocks] = useState([]);
    const [funnelValues, setFunnelValues] = useState([]);
    const widthAdjustments = [0, 0, 0.25, 0.31, 0.365, 0.39]; // TODO: Use a formula for calculation in the for loop rather than static values
    // TODO: Use a formula for calculating the fill
    const funnelBlockFills = [
        { fillColour: '#000000', textColour: '#F0F0F0' },
        { fillColour: '#000000', textColour: '#F0F0F0' },
        { fillColour: '#545454', textColour: '#F0F0F0' },
        { fillColour: '#909090', textColour: '#E1E1E1' },
        { fillColour: '#BDBBBB', textColour: '#414141' },
        { fillColour: '#DBDBDB', textColour: '#414141' }
    ];
    const valueStyle = {
        display: 'inline-block',
        color: '#414141',
        fontFamily: 'Roboto',
        fontSize: 15,
        fontWeight: 900,
        marginTop: elementHeight / 2 - graphicProps?.valueStyle?.fontSize || 15,
        marginLeft: areaWidth / 2 - areaWidth / 6.5,
        ...graphicProps?.valueStyle
    };

    const CalculateFunnelBlocks = (count) => {
        const updatedFunnelBlocks = [];
        let currY = 0;
        for (let i = 1; i < count + 1; i++) {
            updatedFunnelBlocks.push(
                <polygon
                    id={`${id}-shape${i}`}
                    key={`funnel-shape${i}`}
                    points={`${
                        0 + areaWidth * widthAdjustments[i - 1]
                    },${currY} ${
                        areaWidth - areaWidth * widthAdjustments[i - 1]
                    },${currY} ${areaWidth - areaWidth * widthAdjustments[i]},${
                        currY + (elementHeight - 1)
                    } ${0 + areaWidth * widthAdjustments[i]},${
                        currY + (elementHeight - 1)
                    }`}
                    fill={
                        i > funnelBlockFills?.length
                            ? funnelBlockFills[0]?.fillColour
                            : funnelBlockFills[i]?.fillColour
                    }
                />
            );
            currY += elementHeight;
        }

        return updatedFunnelBlocks;
    };

    const SpanValues = () => {
        return values?.map((sum, i) => (
            <div
                id={`${id}-shape-value${i}`}
                key={`funnel-sum${i}`}
                style={{ height: elementHeight }}
            >
                <span
                    style={{
                        ...valueStyle,
                        color: funnelBlockFills[i + 1]?.textColour
                    }}
                >
                    {formatCurrency(sum?.spend) || `${currencySybmol}0.00`}
                </span>
            </div>
        ));
    };

    useEffect(() => {
        setFunnelBlocks(
            CalculateFunnelBlocks(
                statusTitles?.length < 5 ? 5 : statusTitles?.length
            )
        );
    }, [statusTitles, areaHeight, areaWidth]);

    useEffect(() => {
        setFunnelValues(SpanValues);
    }, [values, areaHeight, areaWidth, currencySybmol]);

    return (
        <div id={`${id}-graphic-container`} style={{ height: '100%' }}>
            <div style={{ position: 'absolute' }}>
                <svg
                    id={`${id}-shapes-svg`}
                    style={{ position: 'absolute' }}
                    height={areaHeight}
                    width={areaWidth}
                >
                    {funnelBlocks}
                </svg>
            </div>
            <div
                id={`${id}-shapes-values`}
                align='center'
                style={{ position: 'absolute' }}
            >
                {funnelValues}
            </div>
        </div>
    );
};

export default FunnelChartGraphic;
