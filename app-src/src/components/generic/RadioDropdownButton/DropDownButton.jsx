import React from 'react';
import { ReactComponent as IconChevronDown } from '../../../svg/icon_chevron_down.svg';

const button = {
    boxSizing: 'border-box',
    height: 40,
    width: 130,
    border: '2px solid #FD9A00',
    borderRadius: 5,
    backgroundColor: '#FAA800',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer'
};

const buttonText = {
    color: '#000000',
    fontFamily: 'Roboto',
    fontSize: 14,
    fontWeight: 700,
    textAlign: 'center',
    paddingLeft: 9,
    paddingRight: 3
};

const DropDownButton = ({ id, text, onClick }) => {
    return (
        <div id={id + '-dropdown-btn'} style={button} onClick={onClick}>
            <div style={buttonText}>{text}</div>
            <IconChevronDown style={{ width: 27 }} />
        </div>
    );
};

export default DropDownButton;
