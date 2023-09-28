import { AsButton } from '@adserve/adserve-react-components';
import React from 'react';
import ReactDOM from 'react-dom';
import { ReactComponent as IconClose } from '../../../../svg/icon_close.svg';
import ParentAccountTablePage3 from './ParentAccountTablePage3';

const ParentAccountTableModal = ({
    id,
    tableColumnDefinitions,
    onSelect,
    selectedParentId,
    setSelectedChildId,
    onClose,
    setModalShowing
}) => {
    const bodyStyle = {
        display: 'flex',
        flexDirection: 'column',
        // margin: '62px 43px 120px',
        margin: '0px 43px',
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
                <div style={wrapperStyle} tabIndex={-1} role='dialog' >
                    <div
                        style={{
                            ...bodyStyle,
                            marginTop: 200,
                            width: 595,
                            height: 533,
                            marginLeft: '600px'
                        }}
                        onKeyDown={handleKeyDown}>
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
                        <div >
                            <ParentAccountTablePage3
                                tableColumnDefinitions={tableColumnDefinitions}
                                selectedParentId={selectedParentId}
                                id={`${id}-tablelookup`}
                                onSelect={onSelect}
                                setModalShowing={setModalShowing}
                                setSelectedChildId={setSelectedChildId}
                            />
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <AsButton
                                style={{ width: 130, height: 34, marginTop: 15 }}
                                handleClick={onClose}
                                useSecondaryStyle
                            >
                                {window.translate("Cancel")}
                            </AsButton>
                        </div>
                    </div>
                </div>
            </div>
        </>,
        document.body
    );
};

export default ParentAccountTableModal;
