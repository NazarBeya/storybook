import React from 'react';
import { titleClosePanelStyle } from '../../styles';
import {
    Spacer,
    IconDelete,
    IconEdit,
    IconClose,
    Tooltip
} from '@adserve/adserve-react-components';


const DetailPageContainer = ({
    title,
    onClose,
    onEdit,
    onDelete,
    deleteDisabled,
    readOnly,
    children,
    isCreating,
    isConverted
}) => {
    const titleStyle = {
        fontSize: 22,
        fontWeight: 500,
        color: '#414141',
        padding: '8px 0px 6px 0px',
        paddingLeft: isCreating === true ? 47 : 0
    };

    const mainStyle = {
        display: 'flex',
        flexDirection: 'column',
        margin: '23px 43px',
        backgroundColor: '#F0F0F0',
        width: '100%'
    };

    const deleteButton = () => {
        return (
            <IconDelete
                id='contacts-delete'
                style={{
                    width: 23,
                    height: 23
                }}
                cursor={deleteDisabled ? 'default' : 'pointer'}
                disabled={deleteDisabled}
                onClick={onDelete}
            />
        );
    };

    return (
        <div style={mainStyle}>
            <div
                style={{
                    ...titleClosePanelStyle,
                    paddingBottom: 0,
                    paddingRight: 0
                }}
            >
                <span style={titleStyle}>{title}</span>
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        marginTop: 3
                    }}
                >
                    <div style={{ marginRight: 25 }}>
                        {typeof onEdit === 'function' ? (
                            <IconEdit
                                id='contacts-edit'
                                style={{
                                    width: 23,
                                    height: 23,
                                    paddingRight: 15
                                }}
                                disabled={isConverted || !readOnly}
                                onClick={onEdit}
                            />
                        ) : (
                            <div style={{ marginRight: 23 }} />
                        )}
                    </div>
                    <div style={{ marginRight: 70 }}>
                        {typeof onDelete === 'function' ? (
                            deleteDisabled ? (
                                <Tooltip
                                    text={window.translate(
                                        deleteDisabled
                                            ? 'This record can only be deleted by the person who created it'
                                            : ''
                                    )}
                                    marginTopAdjustment={4}
                                    marginLeftAdjustment={-70}
                                    iconMarginTop={0}
                                    style={{ width: 180, height: 40 }}
                                >
                                    {deleteButton()}
                                </Tooltip>
                            ) : (
                                deleteButton()
                            )
                        ) : (
                            <div style={{ marginRight: 23 }} />
                        )}
                    </div>
                    <div>
                        {typeof onClose === 'function' ? (
                            <IconClose
                                id='close'
                                style={{
                                    width: 19,
                                    height: 19,
                                    marginRight: 10
                                }}
                                cursor='pointer'
                                onClick={onClose}
                            />
                        ) : (
                            <div style={{ marginRight: 29 }} />
                        )}
                    </div>
                </div>
            </div>
            <Spacer height={16} width={0} />
            {children}
        </div>
    );
};

export default DetailPageContainer;
