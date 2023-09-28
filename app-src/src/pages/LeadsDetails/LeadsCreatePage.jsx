import React, { useState, useEffect } from 'react';
import DetailPageContainer from '../../components/containers/DetailPageContainer';
import { useHistory, useLocation } from 'react-router-dom';
import LeadsDetails from '../../components/LeadsDetails';
import { GetLeadStaticData, CreateLead, GetLeadInListingFormat } from '../../services/LeadsDataService';
import useRecordState from '../../hooks/useRecordState';
import LeadsConvertContext from './LeadsConvertContext';
import { useModal } from '@adserve/adserve-react-components';

const LeadsCreatePage = ({ ...props }) => {
    const location = useLocation();
    const history = useHistory();
    const { addMessage } = useModal();

    const { resetDataModified, routePath } = useRecordState();

    const [salutations, setSalutations] = useState([]);
    const [leadSources, setLeadSources] = useState([]);
    const [leadStatuses, setLeadStatuses] = useState([]);
    const [ratings, setRatings] = useState([]);
    const [demographics, setDemographics] = useState([]);
    const [industries, setIndustries] = useState([]);
    const [leadTypes, setLeadTypes] = useState([]);

    const [lead, setLead] = useState({});
    // Event Handlers
    const handleClose = () => {
        resetDataModified();
        history.push(routePath ?? '/leads');
    };

    const hasStaticDataLoaded = () =>
        !(
            salutations.length ||
            leadSources.length ||
            leadStatuses.length ||
            ratings.length ||
            demographics.length ||
            industries.length ||
            leadTypes.length
        );

    const loadData = async () => {
        const response = await GetLeadStaticData();
        setSalutations(response.salutations);
        setLeadSources(response.leadSources);
        setLeadStatuses(response.leadStatuses);
        setRatings(response.ratings);
        setIndustries(response.industries);
        setLeadTypes(response.leadTypes);
        setDemographics(response.demographics);
    };

    useEffect(() => {
        if (hasStaticDataLoaded()) {
            loadData();
        }
    }, []);
    useEffect(() => {
        if (location?.state?.states?.lead) {
            setLead({ ...location.state.states.lead, ...lead });
        }
    }, [location?.state, location]);

    const handleSave = () => {
        CreateLead({
            ...lead,
            salutationId: lead.salutationId === '-1' ? window.emptyGuid : lead.salutationId,
            leadSourceId: lead.leadSourceId === '-1' ? window.emptyGuid : lead.leadSourceId,
            leadStatusId: lead.leadStatusId === '-1' ? window.emptyGuid : lead.leadStatusId,
            industryId: lead.industryId === '-1' ? window.emptyGuid : lead.industryId,
            ratingId: lead.ratingId === '-1' ? window.emptyGuid : lead.ratingId,
            demographicId: lead.demographicId === '-1' ? window.emptyGuid : lead.demographicId

        })
            .then((response) => {
                resetDataModified();
                addMessage({
                    message: window.translate('Lead created successfully'),
                    buttons: [
                        {
                            text: window.translate('Ok')
                        }
                    ]
                });
                history.push(
                    routePath ?? {
                        pathname: '/leads/details',
                        state: {
                            leadId: response.data.id,
                            readOnly: false
                        }
                    }
                );
            })
            .catch(console.log);
    };

    return (
        <LeadsConvertContext>
            <DetailPageContainer title={window.translate('New Lead')} onClose={handleClose} isCreating={true}>
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column'
                    }}
                >
                    <LeadsDetails
                        onCancel={handleClose}
                        onUpdate={handleSave}
                        lead={lead}
                        leadDispatcher={setLead}
                        salutations={salutations}
                        leadSources={leadSources}
                        leadStatuses={leadStatuses}
                        locationStates={location?.state?.states}
                        ratings={ratings}
                        demographics={demographics}
                        industries={industries}
                        leadTypes={leadTypes}
                        returnPath='/leads/create'
                        creating
                    />
                </div>
            </DetailPageContainer>
        </LeadsConvertContext>
    );
};

export default LeadsCreatePage;
