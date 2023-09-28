import React from 'react';
import Modal from './generic/Modal/Modal';
import { AsButton, Flex } from '@adserve/adserve-react-components';

const modalButtonStyle = {
    height: 36,
    margin: 10
};

const SaveConfirmModal = ({
    isShowing = false,
    onCancelSave,
    onClose,
    title,
    entityName,
    onSave,
    ...props
}) =>
    isShowing ? (
        <Modal
            {...props}
            id='save-confirm-modal'
            isShowing={isShowing}
            hide={onClose}
            title={title}
        >
            <Flex
                id='save-confirm-modal-container-content'
                spaceAround
                style={{ flexDirection: 'column', height: '100%' }}
            >
                <span>Save changes to this {entityName} before closing?</span>
                <span id='save-confirm-modal-button-container'>
                    <AsButton
                        id='save-confirm-modal-button-dont-save'
                        useTertiaryStyle
                        handleClick={onCancelSave}
                        style={{ ...modalButtonStyle, width: 132 }}
                    >
                        {"Don't save"}
                    </AsButton>
                    <AsButton
                        id='save-confirm-modal-button-cancel'
                        useTertiaryStyle
                        handleClick={onClose}
                        style={{ ...modalButtonStyle, width: 87 }}
                    >
                        Cancel
                    </AsButton>
                    <AsButton
                        id='save-confirm-modal-button-save'
                        handleClick={onSave}
                        style={{ ...modalButtonStyle, width: 130 }}
                    >
                        Save
                    </AsButton>
                </span>
            </Flex>
        </Modal>
    ) : null;

export default SaveConfirmModal;
