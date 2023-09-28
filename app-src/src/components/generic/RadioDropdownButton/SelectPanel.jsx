import React from 'react';
import OptionList from './OptionList';
import CreateButton from './CreateButton';

const panel = {
    boxSizing: 'border-box',
    height: 247,
    width: 132,
    border: '1px solid #CCCCCC',
    borderRadius: '0 0 15px 15px',
    backgroundColor: '#FFFFFF',
    boxShadow: '3px 2px 11px 0 rgba(0,0,0,0.33)',
    marginTop: 5,
    textAlign: 'center',
    position: 'absolute',
    zIndex: 210
};
const SelectPanel = ({
    id,
    options,
    visible = false,
    onOptionChange,
    onClickCreateButton
}) => {
    return (
        visible && (
            <div style={panel}>
                <div style={{ height: 35 }} />
                <div style={{ paddingLeft: 13 }}>
                    <OptionList
                        options={options}
                        spaceBetween={20}
                        onOptionChange={onOptionChange}
                    />
                </div>
                <div style={{ height: '10%' }} />
                <CreateButton
                    id={id + '-create-btn'}
                    text='Create'
                    onClick={onClickCreateButton}
                />
            </div>
        )
    );
};

export default SelectPanel;
