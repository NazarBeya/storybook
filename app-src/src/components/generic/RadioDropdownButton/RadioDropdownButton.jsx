import React, { useState, useEffect } from 'react';
import DropdownButton from './DropDownButton';
import SelectPanel from './SelectPanel';

const RadioDropdownButton = ({ id, text, options, createClick }) => {
    const defaultOption = options[0];

    // state
    const [showSelectPanel, setShowSelectPanel] = useState(false);
    const [selectedOption, setSelectedOption] = useState(defaultOption);

    // handler
    const handleClickDropdownButton = () =>
        setShowSelectPanel(!showSelectPanel);
    const closeSelectPanel = () => setShowSelectPanel(false);
    const handleClickCreateButton = () => {
        closeSelectPanel();
        createClick(selectedOption);
    };

    return (
        <div>
            <DropdownButton
                id={id}
                text={text}
                onClick={handleClickDropdownButton}
            />
            <SelectPanel
                id={id}
                visible={showSelectPanel}
                options={options}
                onOptionChange={setSelectedOption}
                onClickCreateButton={handleClickCreateButton}
            />
        </div>
    );
};

export default RadioDropdownButton;
