import React from 'react';
import { StripedTable } from '@adserve/adserve-react-components';
import TopCampaignsTableBody from './TopCampaignsTableBody';
import CrmSelect from '../inputs/CrmSelect';
import { selectStyle } from '../../styles';

const TopCampaignsTable = ({
    title,
    id,
    campaigns,
    period,
    dataPeriods,
    onPeriodUpdate,
    stage,
    stages,
    onStageUpdate,
    containerStyle,
    topCampaignsProps
}) => {
    const parentContainerStyle = {
        ...containerStyle
    };

    const tableTitleContainerStyle = {
        height: '13.8%',
        textAlign: 'center',
        display: 'flex',
        justifyContent: 'center',
        ...topCampaignsProps?.titleStyles?.containerStyle
    };

    const tableTitleStyle = {
        color: '#414141',
        fontFamily: 'Roboto',
        fontSize: 22,
        fontWeight: 500,
        lineHeight: '50px',
        ...topCampaignsProps?.titleStyles?.titleStyle
    };

    const tableContainerStyle = {
        height: '86.2%',
        ...topCampaignsProps?.tableStyles?.tableContainerStyle
    };

    const tableRowBorder =
        topCampaignsProps?.tableStyles?.tableRowBorder ||
        '1px solid rgb(215,215,215)';

    return (
        <div id={`${id}-parent-container`} style={parentContainerStyle}>
            <div style={tableTitleContainerStyle}>
                <span style={tableTitleStyle}>{title || 'Untitled'}</span>
                {period && (
                    <CrmSelect
                        id='top-periods'
                        placeholder='Select time period'
                        crmLabelStyle={{ display: 'none' }}
                        value={period}
                        values={dataPeriods || []}
                        onChange={(e) => {
                            let newPeriod = Number(e.target.value);
                            if(newPeriod> 0){
                              onPeriodUpdate(newPeriod);
                            }
                        }}
                        style={{ marginLeft: 10, fontSize: 15 }}
                        selectStyle={{ ...selectStyle }}
                    />
                )}
                {stage && (
                    <CrmSelect
                        id='top-stages'
                        placeholder='Select stage'
                        crmLabelStyle={{ display: 'none' }}
                        value={stage}
                        values={stages || []}
                        onChange={(e) => {
                            let newStage = Number(e.target.value);
                            if(newStage> 0){
                              onStageUpdate(newStage);
                            }
                        }}
                        style={{ marginLeft: 10, fontSize: 15 }}
                        selectStyle={{ ...selectStyle }}
                    />
                )}
            </div>
            {campaigns?.length > 0 && (
                <div style={tableContainerStyle}>
                    <StripedTable id={id} style={{ width: '100%' }}>
                        <TopCampaignsTableBody
                            id={id}
                            campaigns={campaigns}
                            border={tableRowBorder}
                            tableBodyProps={topCampaignsProps?.tableStyles}
                        />
                    </StripedTable>
                </div>
            )}
        </div>
    );
};

export default TopCampaignsTable;
