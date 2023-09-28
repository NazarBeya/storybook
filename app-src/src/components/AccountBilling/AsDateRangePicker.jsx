import { Flex } from '@adserve/adserve-react-components';
import React from 'react';
import LabelledDatePicker from './LabelledDatePicker';

const inputStyle = { width: '80%' };

const AsDateRangePicker = ({
    id = 'date-range-picker',
    startDate,
    onStartDateChange,
    endDate,
    onEndDateChange,
    startDateLabel = 'Date from',
    endDateLabel = 'Date to',
    gap = 84
}) => {
    const datePickerContainerStyle = { width: `calc(50% - ${gap >> 1}px` };

    return (
        <Flex spaceBetween style={{ width: '100%', zIndex: 99999 }}>
            <div style={datePickerContainerStyle}>
                <LabelledDatePicker
                    id={`${id}-date-from`}
                    currentDate={startDate}
                    onChange={onStartDateChange}
                    inputStyle={inputStyle}
                    maxDate={endDate}
                >
                    {startDateLabel}
                </LabelledDatePicker>
            </div>

            <div style={datePickerContainerStyle}>
                <LabelledDatePicker
                    id={`${id}-date-to`}
                    currentDate={endDate}
                    onChange={onEndDateChange}
                    inputStyle={inputStyle}
                    minDate={startDate}
                >
                    {endDateLabel}
                </LabelledDatePicker>
            </div>
        </Flex>
    );
};

export default AsDateRangePicker;
