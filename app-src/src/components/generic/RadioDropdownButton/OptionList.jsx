import React, { useState } from 'react';
import { RadioButton, Spacer, Flex } from '@adserve/adserve-react-components';

const optionText = {
    color: '#414141',
    fontFamily: 'Roboto',
    fontSize: 14,
    fontWeight: 500,
    cursor: 'pointer',
    textAlign: 'left'
};

const OptionList = ({ options, spaceBetween = 10, onOptionChange }) => {
    const [selectedRadioButton, setSelectedRadioButton] = useState(0);

    const handleClick = (i) => {
        onOptionChange(options[i]);
        setSelectedRadioButton(i);
    };

    const lastIndex = options.length - 1;

    const keyGen = (val) => val.toLowerCase().replace(' ', '-');

    return options.map((o, i) => (
        <div key={`div-${keyGen(o)}`}>
            <Flex>
                <RadioButton
                    id={keyGen(o)}
                    value={selectedRadioButton === i}
                    onClick={() => handleClick(i)}
                />
                <Spacer width={8} />
                <div style={optionText} onClick={() => handleClick(i)}>
                    {o}
                </div>
            </Flex>
            {i < lastIndex && <div style={{ height: spaceBetween }} />}
        </div>
    ));
};

export default OptionList;
