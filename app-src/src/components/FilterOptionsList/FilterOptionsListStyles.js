export const mainContainerStyle = (style = {}) => {
    return {
        boxSizing: 'border-box',
        width: '100%',
        ...style
    };
};

export const optionsContainerStyle = {
    boxSizing: 'border-box',
    height: 33,
    width: '100%',
    border: '1px solid #D7D7D7',
    borderRadius: 8,
    backgroundColor: '#FFFFFF'
};

export const titleStyle = {
    fontFamily: 'Roboto',
    fontSize: 14,
    color: '#414141',
    fontWeight: 'bold'
};

export const optionTextStyle = {
    fontFamily: 'Roboto',
    fontSize: 14,
    color: '#414141',
    fontWeight: 500
};
