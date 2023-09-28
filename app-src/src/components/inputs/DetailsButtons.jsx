import React from 'react';
import { AsButton, Flex, Tickbox } from '@adserve/adserve-react-components';
import { labelStyle, flexCenter, bottomPanelStyle } from '../../styles';
import useRecordState from '../../hooks/useRecordState';

const buttonStyle = {
    fontSize: 15,
    height: 36
};

const primaryButtonStyle = {
    width: 130,
    marginLeft: 13,
    ...buttonStyle
};

const cancelButtonStyle = {
    width: 87,
    ...buttonStyle
};

const referenceStyle = {
    display: 'block',
    textAlign: 'left',
    fontSize: 15,
    fontWeight: 500,
    color: '#CCCCCC',
    opacity: 0.9
};

const DetailsButtons = ({
    label = window.translate('Details'),
    onUpdate,
    onCancel,
    creating = false,
    readOnly = false,
    referenceId = 'XXXXXXXXXX',
    externaleReference = '',
    isFavourite,
    onFavouriteClick,
    additionalActionButtonVisible,
    additionalActionLabel,
    onAdditionalAction
}) => {
    const { dataModified } = useRecordState();

    const id = label.charAt(0).toLowerCase() + label.slice(1);
    return (
        <Flex spaceBetween style={{ padding: '13px 42px' }}>
            <div
                style={{
                    ...flexCenter,
                    marginTop: 13,
                    width: '75%',
                    gap: 86
                }}
            >
                <div style={bottomPanelStyle}>
                    <Tickbox
                        id='campaign-favourite'
                        style={{ width: 18, height: 18 }}
                        value={isFavourite}
                        onClick={onFavouriteClick}
                        disabled={readOnly}
                    />
                    <label
                        style={{
                            ...labelStyle,
                            marginLeft: 12,
                            marginBottom: 0
                        }}
                    >
                        {window.translate('Make favourite')}
                    </label>
                </div>
                <div style={bottomPanelStyle}>
                    <span style={referenceStyle}>{`${label} ${window.translate('Reference ID')}: `}</span>
                    <span id={`${id}-reference-id`} style={referenceStyle}>
                        {referenceId}
                    </span>
                </div>
                <div style={bottomPanelStyle}>
                    {externaleReference !== '' && (
                        <>
                            <span style={referenceStyle}>{`${window.translate('External Reference ID')}: `}</span>
                            <span id={`${id}-external-reference`} style={referenceStyle}>
                                {externaleReference}
                            </span>
                        </>
                    )}
                </div>
            </div>
            <Flex id={`${id}-button-container`} spaceBetween style={{ alignItems: 'flex-end', marginTop: 13 }}>
                <AsButton id={`${id}-button-cancel`} style={cancelButtonStyle} useTertiaryStyle handleClick={onCancel}>
                    {window.translate('Cancel')}
                </AsButton>
                {additionalActionButtonVisible && (
                    <AsButton
                        id={`${id}-button-action`}
                        style={primaryButtonStyle}
                        useTertiaryStyle
                        handleClick={onAdditionalAction}
                    >
                        {additionalActionLabel}
                    </AsButton>
                )}
                <AsButton
                    id={`${id}-button-${creating ? 'create' : 'update'}`}
                    style={primaryButtonStyle}
                    handleClick={onUpdate}
                    disabled={!dataModified || (!creating && readOnly)}
                >
                    {creating ? window.translate('Create') : window.translate('Update')}
                </AsButton>
            </Flex>
        </Flex>
    );
};

export default DetailsButtons;
