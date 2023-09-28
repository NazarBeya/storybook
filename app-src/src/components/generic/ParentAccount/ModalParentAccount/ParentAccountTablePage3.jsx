import React, { useState, useEffect } from 'react';
import { GetAllChildAccounts } from '../../../../services/AccountDataService';
import ParentAccountTableTable from './ParentAccountTableTable';

const ParentAccountTablePage3 = ({ tableColumnDefinitions, selectedParentId, setModalShowing, setSelectedChildId }) => {
    const [data, setData] = useState([]);
    const [selectedRow, setSelectedRow] = useState({});

    const gridContainer = {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
        gridTemplateRows: '30px 57px 50px 0.5fr 84px 70px',
        gridGap: 0,
        paddingTop: 24,
        width: '100%',
        height: '438px',
        color: '#414141'
    };

    const gridItem = {
        textAlign: 'center',
        padding: 0
    };

    const titleArea = {
        gridColumn: '1 / 4',
        fontSize: 22,
        fontWeight: 500,
        margin: 'auto',
        color: '#414141',
        paddingBottom: 20
    };

    const getAllChild = (parentId) => {
        if (parentId) {
            GetAllChildAccounts(parentId)
                .then((result) => {
                    setData(result);
                })
                .catch((error) => {
                    setData([]);
                    setSelectedRow({});
                    console.log(error);
                });
        }
    };

    useEffect(() => {
        if (selectedParentId) {
            getAllChild(selectedParentId);
        }
    }, []);

    return (
        <div style={gridContainer}>
            <div style={titleArea}>
                <span>{window.translate("Parent Subsidiary Accounts")}</span>
            </div>

            <div style={{ ...gridItem }}>
                <ParentAccountTableTable
                    columnDefinitions={tableColumnDefinitions}
                    data={data}
                    selectedRow={selectedRow}
                    onSetSelectedRow={setSelectedRow}
                    setModalShowing={setModalShowing}
                    setSelectedChildId={setSelectedChildId}
                />
            </div>

        </div>
    );
};

export default ParentAccountTablePage3;
