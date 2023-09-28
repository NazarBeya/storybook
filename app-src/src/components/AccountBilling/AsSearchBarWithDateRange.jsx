import { AsSearchBar } from '@adserve/adserve-react-components';
import React, { useState } from 'react';
import AsDateRangePicker from './AsDateRangePicker';
import FlexColumn from './FlexColumn';

const AsSearchBarWithDateRange = ({
    id = 'search-bar-with-date-range',
    onSearchUpdate
}) => {
    const [currentSearchTerm, setCurrentSearchTerm] = useState('');
    const [startDate, setStartDate] = useState(
        new Date(new Date().setDate(new Date().getDate() - 90))
    );
    const [endDate, setEndDate] = useState(new Date());

    const handleSearchUpdate = (term) => {
        if (term === currentSearchTerm) return;
        setCurrentSearchTerm(term);

        onSearchUpdate({
            name: term,
            startDate: startDate,
            endDate: endDate
        });
    };

    const onStartDateChange = (event) => {
        const date = event.target.value;

        setStartDate(date);
        onSearchUpdate({
            name: currentSearchTerm,
            startDate: date,
            endDate
        });
    };

    const onEndDateChange = (event) => {
        const date = event.target.value;

        setEndDate(date);
        onSearchUpdate({
            name: currentSearchTerm,
            startDate,
            endDate: date
        });
    };

    return (
        <FlexColumn>
            <AsSearchBar
                id={id}
                height={42}
                minSearchLength={3}
                placeholder='Search ...'
                currentSearchTerm={currentSearchTerm}
                onSearchUpdate={handleSearchUpdate}
                width='calc(100% - 52px)'
            />

            <AsDateRangePicker
                id={id}
                startDate={startDate}
                onStartDateChange={onStartDateChange}
                endDate={endDate}
                onEndDateChange={onEndDateChange}
            />
        </FlexColumn>
    );
};

export default AsSearchBarWithDateRange;
