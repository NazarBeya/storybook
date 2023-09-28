export const billingHeaderPanelStyle = {
    boxSizing: 'border-box',
    height: 116,
    width: 1837,
    border: '1px solid #D7D7D7',
    borderRadius: 8,
    backgroundColor: '#FFFFFF'
};

export const invoicesIssuedPanelStyle = {
    boxSizing: 'border-box',
    height: 373,
    width: 1837,
    border: '1px solid #D7D7D7',
    borderRadius: 8,
    backgroundColor: '#FFFFFF'
};

export const forwardSchedulePanelStyle = {
    boxSizing: 'border-box',
    height: 306,
    width: 1837,
    border: '1px solid #D7D7D7',
    borderRadius: 8,
    backgroundColor: '#FFFFFF'
};

export const panelTitleStyle = {
    fontSize: 16,
    fontWeight: 500
};

export const cellPadding = '16px 42px 0px 42px';

export const showInvoicesContainerStyle = (disabled) => {
    return {
        display: 'flex',
        cursor: disabled ? 'default' : 'pointer'
    };
};

export const showCreditNotesContainerStyle = (disabled) => {
    return {
        display: 'flex',
        cursor: disabled ? 'default' : 'pointer'
    };
};

export const pageContainerStyle = {
    marginLeft: 32,
    marginTop: 23
};

export const headingStyle = {
    color: '#414141',
    fontFamily: 'Roboto',
    fontSize: 15,
    fontWeight: 500
};

export const valueStyle = {
    color: '#414141',
    fontFamily: 'Roboto',
    fontSize: 15,
    fontWeight: 400
};

export const headerLabelStyle = {
    color: '#414141',
    fontFamily: 'Roboto',
    fontSize: 15,
    fontWeight: 500,
    float: 'left'
};

export const headerValueStyle = {
    color: '#414141',
    fontFamily: 'Roboto',
    fontSize: 15,
    fontWeight: 400,
    float: 'right'
};

export const headerNameStyle = {
    color: '#414141',
    fontFamily: 'Roboto',
    fontSize: 15,
    fontWeight: 400,
    marginLeft: 30,
    float: 'left'
};

export const tickboxLabelStyle = {
    color: '#414141',
    fontFamily: 'Roboto',
    fontSize: 14,
    fontWeight: 500
};

export const invoicesIssuedContainerStyle = {
    width: '100%',
    backgroundColor: '#FFFFFF'
};

export const forwardScheduleContainerStyle = {
    width: '100%',
    backgroundColor: '#FFFFFF'
};

export const invoicesIssuedTableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
    layout: 'fixed'
};

export const forwardScheduleTableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
    layout: 'fixed'
};

export const invoicesIssuedTextStyle = {
    color: '#414141',
    fontFamily: 'Roboto',
    fontSize: 14,
    fontWeight: 400
};

export const invoicesIssuedNameCellStyle = {
    boxSizing: 'border-box',
    height: 33,
    border: '1px solid #D7D7D7',
    backgroundColor: '#FFFFFF'
};

export const invoicesIssuedHeadCellStyle = {
    boxSizing: 'border-box',
    height: 41,
    border: '1px solid #D7D7D7',
    backgroundColor: '#FFFFFF',
    position: 'sticky',
    fontSize: 14,
    fontWeight: 'bold',
    top: 0
};

export const invoicesIssuedMainCellStyle = (i, isCredit = false) => {
    return {
        boxSizing: 'border-box',
        height: 35,
        border: '1px solid #D7D7D7',
        backgroundColor: isCredit
            ? '#FEEDEC'
            : i % 2 === 0
            ? '#F7F7F7'
            : '#FFFFFF',
        paddingRight: 11,
        fontFamily: 'Roboto',
        fontSize: 15,
        fontWeight: 500
    };
};

export const invoicesIssuedTotalCellStyle = (i) => {
    return {
        boxSizing: 'border-box',
        height: 35,
        border: '1px solid #D7D7D7',
        backgroundColor: i % 2 === 0 ? '#EBEBEB' : '#F7F7F7',
        paddingRight: 8
    };
};

export const invoicesIssuedSumCellStyle = {
    boxSizing: 'border-box',
    height: 35,
    border: '1px solid #D7D7D7',
    backgroundColor: '#EBEBEB',
    paddingRight: 8
};

export const forwardScheduleTextStyle = {
    color: '#414141',
    fontFamily: 'Roboto',
    fontSize: 14,
    fontWeight: 400
};

export const forwardScheduleNameCellStyle = {
    boxSizing: 'border-box',
    height: 33,
    border: '1px solid #D7D7D7',
    backgroundColor: '#FFFFFF'
};

export const forwardScheduleHeadCellStyle = {
    boxSizing: 'border-box',
    height: 41,
    border: '1px solid #D7D7D7',
    backgroundColor: '#FFFFFF',
    position: 'sticky',
    fontSize: 14,
    fontWeight: 'bold',
    top: 0
};

export const forwardScheduleMainCellStyle = (i) => {
    return {
        boxSizing: 'border-box',
        height: 35,
        border: '1px solid #D7D7D7',
        backgroundColor: i % 2 === 0 ? '#F7F7F7' : '#FFFFFF',
        paddingRight: 11,
        fontSize: 15,
        fontWeight: 500
    };
};

export const forwardSchedulePoCellStyle = (i) => {
    return {
        boxSizing: 'border-box',
        height: 35,
        border: '1px solid #D7D7D7',
        backgroundColor: i % 2 === 0 ? '#FFFBEA' : '#FFFDF4',
        paddingRight: 8
    };
};

export const forwardScheduleTotalCellStyle = (i) => {
    return {
        boxSizing: 'border-box',
        height: 35,
        border: '1px solid #D7D7D7',
        backgroundColor: i % 2 === 0 ? '#EBEBEB' : '#F7F7F7',
        paddingRight: 8
    };
};

export const forwardScheduleSumCellStyle = {
    boxSizing: 'border-box',
    height: 35,
    border: '1px solid #D7D7D7',
    backgroundColor: '#EBEBEB',
    paddingRight: 8
};

export const financialTitleStyle = {
    color: '#414141',
    fontFamily: 'Roboto',
    fontSize: 15,
    fontWeight: 'bold'
};

export const financialValueStyle = {
    color: '#414141',
    fontFamily: 'Roboto',
    fontSize: 30,
    fontWeight: 'bold'
};

export const financialStatusStyle = (score, width = 153, height = 57) => {
    switch (score) {
        case score < 90:
            return {
                height: height,
                width: width,
                border: '1px solid #E71F00',
                borderRadius: 1,
                backgroundColor: '#FFC1C0'
            };
        case score > 90 && score < 100:
            return {
                height: height,
                width: width,
                border: '1px solid #E7AE00',
                borderRadius: 1,
                backgroundColor: '#FEF1C0'
            };
        case score >= 100:
            return {
                height: height,
                width: width,
                border: '1px solid #0DB400',
                borderRadius: 1,
                backgroundColor: '#CFF1A9'
            };
        default:
            return {
                height: height,
                width: width,
                border: '1px solid #E71F00',
                borderRadius: 1,
                backgroundColor: '#FFC1C0'
            };
    }
};

export const financialTitleContainerStyle = {
    height: 25
};

export const financialValueVerticalStyle = {
    marginTop: 10
};

export const invoicesIssuedFootCellStyle = {
    position: 'absolute',
    marginTop: 255,
    marginLeft: -2,
    border: '1px solid #D7D7D7',
    backgroundColor: 'white',
    paddingTop: 8,
    width: '100%',
    height: 26
};

export const forwardScheduleFootCellStyle = {
    position: 'absolute',
    marginTop: 255,
    marginLeft: -2,
    border: '1px solid #D7D7D7',
    backgroundColor: 'white',
    paddingTop: 8,
    width: '100%',
    height: 26
};

export const invoiceNumberTextStyle = (isCredit = false) => {
    return {
        color: '#1101B0',
        fontFamily: 'Roboto',
        fontSize: 14,
        fontWeight: isCredit ? 500 : 400
    };
};

export const borderPaneStyle = (height = 148, width = 510) => {
    return {
        boxSizing: 'border-box',
        height: height,
        width: width,
        border: '1px solid #D7D7D7',
        backgroundColor: '#FFFFFF'
    };
};

export const financialSummaryStyle = {
    paddingLeft: 20,
    paddingTop: 30,
    ...borderPaneStyle()
};

export const statusSummaryStyle = {
    paddingLeft: 20,
    paddingTop: 30,
    ...borderPaneStyle()
};

export const statusCtaStyle = {
    display: 'flex',
    ...borderPaneStyle()
};

export const overviewHeadingStyle = {
    color: '#414141',
    fontFamily: 'Roboto',
    fontSize: 15,
    fontWeight: 500
};

export const overviewTextStyle = {
    color: '#414141',
    fontFamily: 'Roboto',
    fontSize: 15,
    fontWeight: 400
};

export const buttonTextStyle = {
    color: '#000000',
    fontFamily: 'Roboto',
    fontSize: 15,
    fontWeight: 'bold'
};

// From this line expect these styles to be moved to new files for their respective pages

export const accountNameStyle = {
    color: '#414141',
    fontFamily: 'Roboto',
    fontSize: 18,
    fontWeight: 500
};

export const transactionTitleStyle = {
    color: '#414141',
    fontFamily: 'Roboto',
    fontSize: 22,
    fontWeight: 500
};

export const transactionPeriodStyle = {
    color: '#414141',
    fontFamily: 'Roboto',
    fontSize: 15,
    fontWeight: 500
};

export const transactionTableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
    layout: 'fixed'
};

export const transactionHeadCellStyle = {
    boxSizing: 'border-box',
    height: 50,
    border: '1px solid #D7D7D7',
    backgroundColor: '#FFFFFF',
    color: '#414141',
    fontFamily: 'Roboto',
    fontSize: 15,
    fontWeight: 500,
    position: 'sticky',
    top: 0
};

export const transactionMainCellStyle = (i) => {
    return {
        boxSizing: 'border-box',
        height: 34,
        border: '1px solid #D7D7D7',
        backgroundColor: i % 2 === 0 ? '#F7F7F7' : '#FFFFFF'
    };
};

export const backButtonStyle = {
    boxSizing: 'border-box',
    marginLeft: 11,
    height: 40,
    width: 110,
    border: '2px solid #FD9A00',
    borderRadius: 5,
    backgroundColor: '#FAA800',
    color: '#000000',
    fontFamily: 'Roboto',
    fontSize: 15,
    fontWeight: 'bold'
};

export const landingTitleStyle = {
    color: '#414141',
    fontFamily: 'Roboto',
    fontSize: 15,
    fontWeight: 500
};

export const scrollbarStyle = (elRect, height) => {
    return {
        position: 'absolute',
        boxSizing: 'border-box',
        height: height || 246,
        width: 18,
        border: '1px solid #D7D7D7',
        backgroundColor: '#FFFFFF',
        marginLeft: elRect?.width - 18 || 1539,
        marginTop: 41
    };
};

export const standardScrollbarStyle = {
    position: 'absolute',
    boxSizing: 'border-box',
    height: 466,
    width: 18,
    border: '1px solid #D7D7D7',
    backgroundColor: '#FFFFFF',
    marginLeft: 1544,
    marginTop: -541
};
