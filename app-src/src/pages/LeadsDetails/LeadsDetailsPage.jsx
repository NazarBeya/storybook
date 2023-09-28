import React, { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import DetailPageContainer from '../../components/containers/DetailPageContainer';
import LeadDetails from '../../components/LeadsDetails';
import { Flex, AsTabContainer, AsTab, useModal } from '@adserve/adserve-react-components';
import { tabPanelStyle } from '../../styles';
import LeadNotesAndAttachments from '../../components/LeadNotesAndAttach/LeadNotesAndAttach';
import useSession from '../../hooks/useSession';
import useRecordState from '../../hooks/useRecordState';
import AttachmentDropdownButton from '../../components/Attachments/AttachmentDropdownButton';
import { UpdateLead, DeleteLead, GetLeadStaticData, GetLeadInListingFormat } from '../../services/LeadsDataService';
import { LeadConverted } from '../../constants/Status';
import { sessionClearAllDetailsFor, sessionClearAllDetailsExcept } from '../../services/SessionService';
import LeadsConvertContext from './LeadsConvertContext';
import DeleteModal from '../../components/DeleteModal';

const LeadsDetailsPage = ({ ...props }) => {
    const history = useHistory();
    const location = useLocation();
    const { addMessage } = useModal();

    const [salutations, setSalutations] = useState([]);
    const [leadSources, setLeadSources] = useState([]);
    const [leadStatuses, setLeadStatuses] = useState([]);
    const [ratings, setRatings] = useState([]);
    const [industries, setIndustries] = useState([]);
    const [leadTypes, setLeadTypes] = useState([]);
    const [demographics, setDemographics] = useState([]);
    const [lead, setLead] = useState({});
    const [readOnly, setReadOnly] = useSession('currentLeadReadOnly');
    const [isModalShowing, setIsModalShowing] = useState(false);
    const { resetDataModified, routePath } = useRecordState();
    const [tab, setTab, delTab] = useSession(
        'leadsDetailsTab',
        location?.state?.selectedTab
            ? location?.state?.selectedTab
            : location?.state?.states?.selectedTab
            ? location?.state?.states?.selectedTab
            : 0
    );

    const hasStaticDataLoaded = () =>
        salutations.length ||
        leadSources.length ||
        leadStatuses.length ||
        ratings.length ||
        demographics.length ||
        industries.length ||
        leadTypes.length;

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
        if (!hasStaticDataLoaded()) {
            loadData();
        }
    }, []);

    // Event Handlers
    const handleClose = () => {
        resetDataModified();
        history.push(routePath ?? '/leads');
    };

    useEffect(() => {
        const leadId = location?.state?.leadId || lead.id || location?.state?.states?.lead?.id;

        if (!leadId) {
            handleClose();
            return;
        }
        if (location?.state?.redirectedFrom !== 'search') {
            GetLeadInListingFormat(leadId)
                .then((data) => {
                    setLead(data);
                })
                .catch(console.log);
        }
        if (location?.state?.selectedTab && tab !== location?.state?.selectedTab) setTab(location?.state?.selectedTab);
        else if (location?.state?.states?.selectedTab && tab !== location?.state?.states?.selectedTab)
            setTab(location?.state?.states?.selectedTab);

        setReadOnly(location.state?.readOnly ?? readOnly ?? true);

        sessionClearAllDetailsExcept('lead');
        window.scrollTo(0, 0);

        if (location?.state?.states?.lead) {
            setLead({ ...location.state.states.lead, ...lead });
        }

        return delTab;
    }, [location?.state]);

    const handleEditConfirm = () => {
        setReadOnly(false);
    };

    const handleDeleteConfirm = async () => {
        const response = await DeleteLead(lead.id);
        if (response.status === 200) {
            sessionClearAllDetailsFor('lead');
            handleClose();
        }
    };

    const handleHistoryClose = () => {
        history.push({
            pathname: '/leads/details',
            state: {
                leadId: location?.state?.leadId,
                readOnly: location?.state?.readOnly,
                selectedTab: tab
            }
        });
    };

    const handleSave = () => {
        UpdateLead({
            ...lead,
            salutationId: lead.salutationId === '-1' ? window.emptyGuid : lead.salutationId,
            leadSourceId: lead.leadSourceId === '-1' ? window.emptyGuid : lead.leadSourceId,
            leadStatusId: lead.leadStatusId === '-1' ? window.emptyGuid : lead.leadStatusId,
            industryId: lead.industryId === '-1' ? window.emptyGuid : lead.industryId,
            ratingId: lead.ratingId === '-1' ? window.emptyGuid : lead.ratingId,
            demographicId: lead.demographicId === '-1' ? window.emptyGuid : lead.demographicId
        })
            .then(() => {
                resetDataModified();
                addMessage({
                    message: window.translate('Lead updated successfully'),
                    buttons: [
                        {
                            text: window.translate('Ok')
                        }
                    ]
                });
            })
            .catch(console.log);
    };

    return (
        <LeadsConvertContext>
            <DetailPageContainer
                title={lead?.fullName || window.translate('Existing Lead')}
                onClose={handleClose}
                onEdit={handleEditConfirm}
                onDelete={() => setIsModalShowing(true)}
                deleteDisabled={!lead?.allowDelete}
                readOnly={readOnly || lead?.leadStatusName === LeadConverted}
                isConverted={lead?.leadStatusName === LeadConverted}
            >
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between'
                    }}
                >
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between'
                        }}
                    >
                        <AsTabContainer
                            style={{ height: 'unset' }}
                            tabPanelStyle={tabPanelStyle}
                            onTabClick={setTab}
                            initalTab={tab}
                        >
                            <AsTab title='Details'>
                                <Flex style={{ flexDirection: 'column' }}>
                                    <LeadDetails
                                        lead={lead}
                                        readOnly={readOnly}
                                        onCancel={handleClose}
                                        leadDispatcher={setLead}
                                        salutations={salutations}
                                        leadSources={leadSources}
                                        leadStatuses={leadStatuses}
                                        ratings={ratings}
                                        industries={industries}
                                        leadTypes={leadTypes}
                                        demographics={demographics}
                                        locationStates={location?.state?.states}
                                        onUpdate={handleSave}
                                        returnPath='/leads/details'
                                        convertButtonVisible={lead?.leadStatusName !== LeadConverted}
                                    />
                                </Flex>
                            </AsTab>
                            <AsTab title={`${window.translate('Notes & Attachments')}`}>
                                <Flex style={{ flexDirection: 'column' }}>
                                    <AttachmentDropdownButton
                                        entityId={lead?.id}
                                        heading={lead?.fullName}
                                        entityType='lead'
                                        onClose={handleHistoryClose}
                                    />
                                    <LeadNotesAndAttachments
                                        entityId={lead?.id}
                                        entityType='lead'
                                        onClose={handleHistoryClose}
                                        heading={lead?.fullName}
                                    />
                                </Flex>
                            </AsTab>
                        </AsTabContainer>
                    </div>
                </div>
                <DeleteModal
                    isShowing={isModalShowing}
                    onClose={() => setIsModalShowing(false)}
                    onSubmit={handleDeleteConfirm}
                    entityName='lead'
                />
            </DetailPageContainer>
        </LeadsConvertContext>
    );
};

export default LeadsDetailsPage;
