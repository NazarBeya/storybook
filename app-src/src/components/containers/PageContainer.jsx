import React from 'react';
import { ReactComponent as IconClose } from '../../svg/icon_close.svg';

const PageContainer = ({ onClose, children }) => {
    const mainStyle = {
        display: 'flex',
        flexDirection: 'column',
        margin: '23px 43px',
        backgroundColor: '#FFFFFF',
        width: '100%'
    };

    return (
        <div style={mainStyle}>
            <div style={{ position: 'absolute', alignSelf: 'flex-end' }}>
                <IconClose
                    id='close'
                    style={{
                        width: 21,
                        height: 21,
                        cursor: 'pointer',
                        margin: 7
                    }}
                    viewBox='15 15 20 20'
                    onClick={onClose}
                />
            </div>
            {children}
        </div>
    );
};

export default PageContainer;
