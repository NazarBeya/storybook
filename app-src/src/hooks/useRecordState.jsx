import { useContext } from 'react';
import { RecordStateContext } from '../components/RecordStateContext';

const useRecordState = () => {
    const {
        isModalShowing,
        dataModified,
        routePath,
        showConfirmSaveModal,
        dataIsModified,
        resetDataModified
    } = useContext(RecordStateContext);

    return {
        isModalShowing,
        dataModified,
        routePath,
        showConfirmSaveModal,
        dataIsModified,
        resetDataModified
    };
};

export default useRecordState;
