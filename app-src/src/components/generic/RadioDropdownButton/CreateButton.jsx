import React from 'react';

const button = {
    boxSizing: 'border-box',
    height: 34,
    width: 96,
    border: '2px solid #FD9A00',
    borderRadius: 5,
    backgroundColor: '#FAA800',
    color: '#000000',
    fontFamily: 'Roboto',
    fontSize: 15,
    fontWeight: 500,
    cursor: 'pointer'
};

const CreateButton = ({ id, text, onClick }) => {
    return (
        <button id={id} style={button} onClick={onClick}>
            {text}
        </button>
    );
};

export default CreateButton;
