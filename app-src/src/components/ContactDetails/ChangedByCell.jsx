import React from 'react';

const CreatedByCell = ({ data, fieldName }) => {
        const changedBy = data[fieldName]?.name;
        

    return (
        <div style={{ textAlign: 'left', padding: '0px 10px' }}>
            {changedBy}
        </div>
    );
};

export default CreatedByCell;
