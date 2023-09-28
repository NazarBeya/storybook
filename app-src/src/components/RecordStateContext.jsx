import React, { useState, useCallback } from 'react';

export const RecordStateContext = React.createContext({
    isModalShowing: false,
    dataModified: false,
    routePath: null,
    showConfirmSaveModal: () => {},
    dataIsModified: () => {},
    resetDataModified: () => {}
});

export default function RecordStateProvider({ children }) {
    const [isModalShowing, setIsModalShowing] = useState(false);
    const [dataModified, setDataModified] = useState(false);
    const [routePath, setRoutePath] = useState(null);

    const showConfirmSaveModal = (value, path) => {
        setIsModalShowing(value);
        setRoutePath(path);
    };

    const dataIsModified = () => {
        setDataModified(true);
    };

    const resetDataModified = () => {
        setDataModified(false);
        setIsModalShowing(false);
        setRoutePath(null);
    };

    const contextValue = {
        isModalShowing,
        dataModified,
        routePath,
        showConfirmSaveModal: useCallback(showConfirmSaveModal, []),
        dataIsModified: useCallback(dataIsModified, []),
        resetDataModified: useCallback(resetDataModified, [])
    };

    return (
        <RecordStateContext.Provider value={contextValue}>
            {children}
        </RecordStateContext.Provider>
    );
}
