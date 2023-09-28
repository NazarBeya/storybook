import { useContext } from 'react';
import { CompactTableSearchContext } from '../components/generic/CompactTable/CompactTableContext';

const useCompactTableSearch = () => {
    const {
        compactTableId,
        searchFunction,
        searchResult,
        addSearchFunction,
        addSearchResult,
        removeSearchFunction
    } = useContext(CompactTableSearchContext);

    const getSearchResult = (id) => {
        if (id !== compactTableId) {
            return null;
        }

        return searchResult;
    };

    return {
        searchFunction,
        addSearchFunction,
        addSearchResult,
        getSearchResult,
        removeSearchFunction
    };
};

export default useCompactTableSearch;
