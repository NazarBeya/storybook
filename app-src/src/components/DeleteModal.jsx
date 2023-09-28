import React from 'react';
import Modal from './generic/Modal/Modal';
import { AsButton, Flex } from '@adserve/adserve-react-components';

const modalButtonStyle = {
    height: 36,
    margin: 10
};

const DeleteModal = ({
    isShowing = false,
    onClose,
    title,
    entityName,
    onSubmit,
    message = '',
    ...props
}) =>
    isShowing ? (
        <Modal
            {...props}
            id='delete-modal'
            isShowing={isShowing}
            hide={onClose}
            title={title}
        >
            <Flex
                id='delete-modal-container-content'
                spaceAround
                style={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    height: '100%'
                }}
            >
                <span style={message?.length > 50 ? { width: 430 } : {}}>
                    {message === ''
                        ? `${window.translate(
                              'Are you sure you want to delete this'
                          )} ${entityName}?`
                        : message}
                </span>
                <span id='delete-modal-button-container'>
                    <AsButton
                        id='delete-modal-button-no'
                        useTertiaryStyle
                        handleClick={onClose}
                        style={{ ...modalButtonStyle, width: 87 }}
                    >
                        {window.translate('No')}
                    </AsButton>
                    <AsButton
                        id='delete-modal-button-yes'
                        handleClick={onSubmit}
                        style={{ ...modalButtonStyle, width: 130 }}
                    >
                        {window.translate('Yes')}
                    </AsButton>
                </span>
            </Flex>
        </Modal>
    ) : null;

export default DeleteModal;
