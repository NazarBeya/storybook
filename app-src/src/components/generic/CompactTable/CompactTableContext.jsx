import React, { useState, useCallback } from 'react';

export const CompactTableSearchContext = React.createContext({
    compactTableId: null,
    searchFunction: null,
    searchResult: null,
    addSearchFunction: () => {},
    addSearchResult: () => {},
    removeSearchFunction: () => {}
});

export default function CompactTableSearchProvider({ children }) {
    const [compactTableId, setCompactTableId] = useState(null);
    const [searchFunction, setSearchFunction] = useState(null);
    const [searchResult, setSearchResult] = useState(null);

    const removeSearchFunction = () => {
        setCompactTableId(null);
        setSearchFunction(null);
        setSearchResult(null);
    };

    const addSearchFunction = (id, func) => {
        setCompactTableId(id);
        setSearchFunction(() => func);
    };

    const addSearchResult = (result) => {
        setSearchResult(result);
    };

    const contextValue = {
        compactTableId,
        searchFunction,
        searchResult,
        addSearchFunction: useCallback(addSearchFunction, []),
        addSearchResult: useCallback(addSearchResult, []),
        removeSearchFunction: useCallback(removeSearchFunction, [])
    };

    return (
        <CompactTableSearchContext.Provider value={contextValue}>
            {children}
        </CompactTableSearchContext.Provider>
    );
}
