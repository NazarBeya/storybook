import { AsDatePicker, AsLabel } from '@adserve/adserve-react-components';
import React, { useContext } from 'react';
import { SystemSettingsContext } from '../../contexts/SystemSettingsContext';

const LabelledDatePicker = ({ children, ...props }) => {
    const { dateFormat } = useContext(SystemSettingsContext);

    return (
        <div>
            <AsLabel
                style={{
                    color: 'rgb(65,65,65)',
                    fontSize: 12,
                    marginBottom: 5
                }}
            >
                {children}
            </AsLabel>

            <AsDatePicker
                dateFormat={dateFormat}
                style={{ zIndex: 90 }}
                {...props}
            />
        </div>
    );
};

export default LabelledDatePicker;
