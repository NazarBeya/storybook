export const labelStyle = {
    display: 'block',
    textAlign: 'left',
    fontSize: 12,
    color: '#414141',
    marginBottom: 5
};

export const inputStyle = {
    boxSizing: 'border-box',
    width: '100%',
    height: 40,
    outline: 'none',
    autoComplete: 'off',
    padding: '0 12px',
    fontSize: 15,
    letterSpacing: -0.3,
    fontWeight: 600
};

export const gridItemStyle = {
    textAlign: 'center',
    padding: 0
};

export const gridContainerStyle = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    gridTemplateRows: '50px 57px 1fr',
    gridGap: 0,
    padding: '19px 40px 36px 40px',
    width: '100%',
    height: '97%'
};

export const tabAreaStyle = {
    gridColumn: '1 / 4',
    paddingTop: 18
};

export const tableAreaStyle = {
    gridColumn: '1 / 4',
    backgroundColor: '#FFFFFF'
};

export const gridViewCreateButtonStyle = {
    width: 130,
    height: 40,
    fontSize: 14
};

export const tabPanelStyle = {
    boxShadow: 'unset',
    border: 'unset',
    borderRadius: 'unset',
    backgroundColor: '#f0f0f0'
};

export const detailsTitleStyle = {
    fontSize: 22,
    fontWeight: 500,
    color: '#414141',
    padding: '0px 0px 21px 47px'
};

export const disabledSelectStyle = {
    fontSize: 15,
    opacity: 1
};

export const selectStyle = {
    boxSizing: 'border-box',
    width: 60,
    border: '1px solid #D7D7D7',
    borderRadius: 5,
    backgroundColor: '#FFFDF4',
    color: '#414141',
    height: 40,
    padding: '10px',
    fontSize: 15,
    letterSpacing: -0.3,
    fontWeight: 600
};

export const sectionedPanelStyle = {
    boxSizing: 'border-box',
    border: '1px solid #D7D7D7',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    padding: '0 52px 10px 73px'
};

export const titleClosePanelStyle = {
    ...sectionedPanelStyle,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
};

export const flexCenter = {
    display: 'flex',
    alignItems: 'center'
};

export const iconPlusMinimiseStyle = {
    verticalAlign: 'bottom',
    marginLeft: 8,
    marginTop: 2,
    cursor: 'pointer'
};

export const historyPanelStyle = {
    padding: '11px 42px 25px 42px',
    display: 'flex',
    justifyContent: 'space-between'
};

export const tableCellStyle = {
    fontSize: 13
};

export const cellStyle = (h = 30,  bg = 'FFFFFF', bd = '1px solid #D7D7D7') => {
    return {
        boxSizing: 'border-box',
        height: h,
        border: bd,
        borderRadius: 5,
        backgroundColor: bg
    };
};

export const bottomPanelStyle = {
    ...flexCenter,
    ...cellStyle(40, 252),
    width: '26.5%',
    paddingLeft: 8,
    paddingTop: 3,
    marginTop: 20,
    backgroundColor: '#FFFFFF'
};