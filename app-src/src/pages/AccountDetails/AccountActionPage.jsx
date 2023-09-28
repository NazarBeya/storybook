import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { ActionWorkflow } from '../../services/WorkflowService';

const AccountActionPage = () => {
    const query = new URLSearchParams(useLocation().search);

    const [requestId] = useState(query.get('requestId'));
    const [transitionId] = useState(query.get('transitionId'));
    const [actionId] = useState(query.get('actionId'));
    const [errorMessage, setErrorMessage] = useState('');

    const [actioned, setActioned] = useState(false);

    useEffect(() => {
        if (requestId && transitionId && actionId) {
            ActionWorkflow(requestId, transitionId, actionId)
                .then(() => {
                    setActioned(true);
                })
                .catch((error) => {
                    setErrorMessage(`${error.response.data}`);
                });
        }
    }, [requestId, transitionId, actionId]);

    const showMessage = () => {
        if (errorMessage !== '') {
            return <span>{window.translate(errorMessage)}</span>;
        }

        const message = actioned
            ? window.translate(
                  'Your action has been processed.  You may now close your browser.'
              )
            : window.translate('Processing your action.  Please wait.');

        return <span>{message}</span>;
    };

    return <div>{showMessage()}</div>;
};

export default AccountActionPage;
