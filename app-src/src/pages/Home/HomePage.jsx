import React, { useContext, useEffect, useState } from 'react';
import FunnelChart from '../../components/generic/FunnelChart/FunnelChart';
import TopCampaignsTable from '../../components/TopCampaignsTable/TopCampaignsTable';
import LineChart from '../../components/generic/LineChart/LineChart';
import { getClaimValue } from '@adserve/adserve-react-components';
import CrmSelect from '../../components/inputs/CrmSelect';
import { selectStyle } from '../../styles';
import {
    performancePanelStyle,
    rankingPanelStyle,
    campaignPerformanceContainerStyle,
    topCampaignsContainerStyle,
    funnelPanelStyle,
    funnelChartContainerStyle
} from './HomeStyles';
import { LegendParams, XAxis, FunnelKey } from './HomeData';
import {
    TopCampaignsLookup,
    StatusCampaignsLookup,
    CampaignsPerformanceLookup
} from '../../services/CampaignsDataService';
import { SystemSettingsContext } from '../../contexts/SystemSettingsContext';

const HomePage = () => {
    const { formatCurrency, currency, currencySybmol } = useContext(SystemSettingsContext);

    const [statusCampaigns, setStatusCampaigns] = useState([]);
    const [topCampaigns, setTopCampaigns] = useState([]);
    const [campaignStatuses, setCampaignStatuses] = useState(null);
    const [performancePeriod, setPerformancePeriod] = useState(3);
    const [funnelOwner, setFunnelOwner] = useState(1);
    const [topPeriod, setTopPeriod] = useState(1);
    const [topStage, setTopStage] = useState(1);
    const [campaignPerformances, setCampaignPerformances] = useState([]);
    const [performanceXAxis, setPerformanceXAxis] = useState(null);
    // With the Y Axis it might make more sense to provide the values from smallest to largest and reverse the order from within the LineChart for spanning the labels
    const [performanceYAxis, setPerformanceYAxis] = useState(null);

    let statusCampaignsApiParamDefaults = {
        userId: '',
        pageSize: 7,
        pageNumber: 1
    };

    let campaignPerformanceApiParamDefaults = {
        months: 3
    };

    let topCampaignsApiParamDefaults = {
      sortField: 'spend',
      sortOrder: 'desc',
      months: 1,
      stage: 'Created',
      pageSize: 10,
      pageNumber: 1
  };

    const performancePeriods = [
        { id: 3, name: '3 months' },
        { id: 6, name: '6 months' },
        { id: 12, name: '12 months' },
        { id: 18, name: '18 months' }
    ];

    const topPeriods = [
        { id: 1, name: 'This month' },
        { id: 3, name: '3 months' },
        { id: 12, name: '12 months' }
    ];

    const topStages = [
        { id: 1, name: 'Created' },
        { id: 2, name: 'Closed' }
    ];

    const funnelOwners = [
        { id: 1, name: 'All campaigns' },
        { id: 2, name: 'My campaigns' }
    ];

    useEffect(() => {
        loadCampaignsPerformance();
        loadStatusCampaigns();
        loadTopCampaigns();
    }, []);

    function loadTopCampaigns() {
        TopCampaignsLookup(topCampaignsApiParamDefaults).then((data) => {
            setTopCampaigns(data);
        });
    }

    function loadStatusCampaigns() {
        StatusCampaignsLookup(statusCampaignsApiParamDefaults).then((data) => {
            setStatusCampaigns(data);
        });
    }

    function loadCampaignsPerformance() {
        CampaignsPerformanceLookup(campaignPerformanceApiParamDefaults).then(
            (data) => {
                const createdValues = [];
                const closedValues = [];
                let maxValue = 0;
                let iMonth = 0;
                if (data.length > 0) {
                    iMonth = data[0].month;
                    setPerformanceXAxis(XAxis(iMonth, data.length));
                } else {
                    setPerformanceXAxis(XAxis(-1, performancePeriod));
                }
                let i = 0;
                while (closedValues.length < data.length) {
                    while (
                        iMonth !== data[i]?.month &&
                        closedValues.length < data.length
                    ) {
                        const createValue = `${currencySybmol}0.00`;
                        createdValues.push(createValue);
                        const closedValue = `${currencySybmol}0.00`;
                        closedValues.push(closedValue);
                        i += 1;
                    }
                    if (closedValues.length < data.length) {
                        const createValue =
                            formatCurrency(data[i]?.createdValue) || `${currencySybmol}0.00`;
                        createdValues.push(createValue);
                        const closedValue =
                            formatCurrency(data[i]?.closedValue) || `${currencySybmol}0.00`;
                        closedValues.push(closedValue);
                        if (maxValue < data[i]?.createdValue)
                            maxValue = data[i]?.createdValue;
                        if (maxValue < data[i]?.closedValue)
                            maxValue = data[i]?.closedValue;
                        iMonth += 1;
                        if (iMonth > 12) {
                            iMonth = 1;
                        }
                        i += 1;
                    }
                }

                const digits = maxValue.toString().length;
                const maxDigit =
                    ((maxValue / Math.pow(10, digits - 1)) >> 0) + 1;
                maxValue = maxDigit * Math.pow(10, digits - 1);
                const yAxis = [];
                for (let i = 1; i < 6; i++) {
                    const yAxi = formatCurrency(maxValue / i).slice(0, -3);
                    yAxis.push(yAxi);
                }
                yAxis.push(`${currencySybmol}0.00`);
                setPerformanceYAxis(yAxis);

                setCampaignPerformances([createdValues, closedValues]);
            }
        );
    }

    useEffect(() => {
        if (statusCampaigns?.length > 0) {
            const os = statusCampaigns.map((k) => {
                return k.status;
            });
            setCampaignStatuses(os);
        }
    }, [statusCampaigns?.length]);

    useEffect(() => {
        campaignPerformanceApiParamDefaults.months = performancePeriod;
        loadCampaignsPerformance();
    }, [performancePeriod, currencySybmol]);

    useEffect(() => {
        topCampaignsApiParamDefaults.months = topPeriod;
        topCampaignsApiParamDefaults.stage = topStages[topStage].name;
        loadTopCampaigns();
    }, [topPeriod, topStage]);

    useEffect(() => {
        switch (funnelOwner) {
            case 1:
                statusCampaignsApiParamDefaults.userId = '';
                break;
            case 2:
                statusCampaignsApiParamDefaults.userId = getClaimValue('ASId');
                break;
        }
        loadStatusCampaigns();
    }, [funnelOwner]);

    return (
        <div style={{ display: 'flex', flexWrap: 'wrap', marginTop: 90 }}>
            <div style={performancePanelStyle}>
                <div style={{ marginLeft: 59 }}>
                    <LineChart
                        title='Campaign Performance'
                        id='campaign-performance'
                        data={campaignPerformances}
                        period={performancePeriod}
                        dataPeriods={performancePeriods}
                        onPeriodUpdate={setPerformancePeriod}
                        legendParams={LegendParams}
                        xLabels={performanceXAxis}
                        yLabels={performanceYAxis}
                        containerStyle={campaignPerformanceContainerStyle}
                    />
                </div>
            </div>
            <div style={{ height: 32, flexBasis: '100%' }} />
            <div style={{ display: 'flex', marginTop: -10 }}>
                <div style={rankingPanelStyle}>
                    <div style={{ marginLeft: 39 }}>
                        <TopCampaignsTable
                            title='Top Campaigns'
                            id='top-campaigns'
                            campaigns={topCampaigns}
                            period={topPeriod}
                            dataPeriods={topPeriods}
                            onPeriodUpdate={setTopPeriod}
                            stage={topStage}
                            stages={topStages}
                            onStageUpdate={setTopStage}
                            containerStyle={topCampaignsContainerStyle}
                        />
                    </div>
                </div>
                <div style={funnelPanelStyle}>
                    <div style={{ marginLeft: 40 }}>
                        <FunnelChart
                            title='Campaign Funnel'
                            id='campaign-funnel'
                            statusTitles={campaignStatuses}
                            values={statusCampaigns}
                            funnelKey={FunnelKey}
                            containerStyle={funnelChartContainerStyle}
                        />
                    </div>
                    <div style={{ width: '100%', marginRight: 10 }}>
                        <CrmSelect
                            id='data-owners'
                            placeholder='Select data owner'
                            crmLabelStyle={{ display: 'none' }}
                            value={funnelOwner}
                            values={funnelOwners || []}
                            onChange={(e) => {
                                let newFunnelOwner = Number(e.target.value);
                                if (newFunnelOwner > 0)
                                    setFunnelOwner(Number(e.target.value));
                            }}
                            style={{ marginLeft: 10, fontSize: 15 }}
                            selectStyle={{ ...selectStyle }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
