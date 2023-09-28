import React, { useState } from 'react';
import { IconEdit, IconDelete } from '@adserve/adserve-react-components';
import DeleteModal from '../../components/DeleteModal';

const LeadsDetailsTabActions = ({
    lead,
    readOnly = false,
    disabled = false,
    onEditClick,
    onDeleteClick
}) => {
    const style = {
        alignSelf: 'flex-end',
        position: 'absolute',
        paddingRight: 42,
        marginTop: -37
    };

    const [isModalShowing, setIsModalShowing] = useState(false);

    return (
        <>
            <div style={style}>
                <IconEdit
                    id='lead-edit'
                    style={{
                        width: 19,
                        height: 19,
                        paddingRight: 15
                    }}
                    disabled={!readOnly || disabled}
                    onClick={onEditClick}
                />
                <IconDelete
                    id='lead-delete'
                    style={{ width: 19, height: 19 }}
                    disabled={disabled}
                    cursor='pointer'
                    onClick={() => setIsModalShowing(true)}
                />
            </div>
            <DeleteModal
                isShowing={isModalShowing}
                onClose={() => setIsModalShowing(false)}
                onSubmit={onDeleteClick}
                title={lead?.fullName}
                entityName='lead'
            />
        </>
    );
};

export default LeadsDetailsTabActions;
