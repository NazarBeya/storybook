import { Spacer, Tickbox } from '@adserve/adserve-react-components';
import React from 'react';
import { mainContainerStyle, optionsContainerStyle, optionTextStyle, titleStyle } from './FilterOptionsListStyles';

const FilterOptionsList = ({ options = [], filterOptions = [], optionChange }) => {
    const handleOptionChange = (val) => {
        if (optionChange !== undefined) {
            optionChange(val);
        }
    };
    return (
        <div style={mainContainerStyle()}>
            <div style={optionsContainerStyle}>
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        width: '100%',
                        paddingLeft: 9,
                        paddingTop: 8,
                        paddingRight: 40
                    }}
                >
                    <span style={titleStyle}>Show:&nbsp;&nbsp;</span>
                    {options?.map((option, i) => (
                        <div
                            key={`filter-option-${i}`}
                            onClick={() => handleOptionChange(option?.value)}
                            style={{
                                display: 'flex',
                                marginLeft: i > 2 ? 10 : 0,
                                cursor: 'pointer'
                            }}
                        >
                            <Tickbox width={18} height={18} value={filterOptions?.find((d) => d === option?.value)} />

                            <Spacer width={11} height={0} />

                            <span style={optionTextStyle}>{option?.text}</span>

                            <Spacer width={19} height={0} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FilterOptionsList;
