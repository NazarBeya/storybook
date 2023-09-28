import React from 'react';
import ReactDOM from 'react-dom';
import { ReactComponent as IconClose } from '../../../svg/icon_close.svg';
import CompactTableLookupPage3 from './CompactTableLookupPage3';

const CompactTableModal = ({
    id,
    searchFunction,
    searchResults,
    tableColumnDefinitions,
    minSearchLength,
    initSearchTerm,
    onSelect,
    onClose
}) => {
    const bodyStyle = {
        display: 'flex',
        flexDirection: 'column',
        margin: '62px 43px 120px',
        backgroundColor: '#FFFFFF',
        border: '1px solid #D7D7D7',
        borderRadius: 8
    };

    const overlayStyle = {
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 1040,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0,0,0,0.4)'
    };

    const wrapperStyle = {
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 1050,
        width: '100%',
        height: '100%',
        overflowX: 'hidden',
        overflowY: 'auto',
        outline: 0
    };

    const handleKeyDown = (event) => {
        if (event.keyCode === 27) {
            onClose();
        }
    };

    return ReactDOM.createPortal(
        <>
            <div>
                <div style={overlayStyle} />
                <div style={wrapperStyle} tabIndex={-1} role='dialog'>
                    <div style={bodyStyle} onKeyDown={handleKeyDown}>
                        <div
                            style={{
                                position: 'absolute',
                                alignSelf: 'flex-end'
                            }}
                        >
                            <IconClose
                                id='close'
                                style={{
                                    width: 24,
                                    height: 24,
                                    cursor: 'pointer',
                                    margin: 7
                                }}
                                viewBox='15 15 20 20'
                                onClick={onClose}
                            />
                        </div>
                        <div>
                            <CompactTableLookupPage3
                                searchFunction={searchFunction}
                                tableColumnDefinitions={tableColumnDefinitions}
                                minSearchLength={minSearchLength}
                                initSearchTerm={initSearchTerm}
                                id={`${id}-tablelookup`}
                                onSelect={onSelect}
                                data={searchResults}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>,
        document.body
    );
};

export default CompactTableModal;
