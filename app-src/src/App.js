import React, { useContext, useEffect, useState } from 'react';
import { Route, Switch } from 'react-router-dom';
import HomePage from './pages/Home/HomePage';
import RouteNavbar from './components/generic/Navbar/RouteNavbar';
import LeadLandingPage from './pages/LeadsLanding/LeadsLandingPage';
import CampaignsLandingPage from './pages/Campaigns/CampaignsLandingPage';
import CampaignsContactsLinkPage from './pages/CampaignsContactsLink/CampaignsContactsLinkPage';
import AccountLandingPage from './pages/AccountLanding/AccountLandingPage';
import LeadsDetailsPage from './pages/LeadsDetails/LeadsDetailsPage';
import ContactsLandingPage from './pages/ContactsLanding/ContactsLandingPage';
import ContactsDetailsPage from './pages/ContactsDetails/ContactsDetailsPage';
import ContactsCreatePage from './pages/ContactsDetails/ContactsCreatePage';
import ContactsCampaignsLinkPage from './pages/ContactsCampaignsLink/ContactsCampaignsLinkPage';
import LeadsCreatePage from './pages/LeadsDetails/LeadsCreatePage';
import AccountCreatePage from './pages/AccountDetails/AccountCreatePage';
import AccountDetailsPage from './pages/AccountDetails/AccountDetailsPage';
import AttachmentCreate from './components/Attachments/AttachmentCreate';
import CompactTableLookupPage from './components/generic/CompactTable/CompactTableLookupPage';
import CompactTableSearchProvider from './components/generic/CompactTable/CompactTableContext';
import RecordStateProvider from './components/RecordStateContext';
import { AsTitlebar, isAuthorised, MessageModal, MessageProvider } from '@adserve/adserve-react-components';
import { GetModules } from './services/SystemDataSerivce';
import InvoiceDetailsPage from './components/AccountBilling/InvoiceDetailsPage';
import CreditNoteDetailsPage from './components/AccountBilling/CreditNoteDetailsPage';
import { SystemSettingsContext } from './contexts/SystemSettingsContext';
import AccountActionPage from './pages/AccountDetails/AccountActionPage';

function App() {
    const { logo } = useContext(SystemSettingsContext);
    const [modules, setModules] = useState([]);
    const [moduleTitle, setModuleTitle] = useState('CRM');

    // TODO: As components are pushed, add their path to the relevant object
    const routes = [
        { title: window.translate('CRM'), path: '/' },
        { title: window.translate('Accounts'), path: '/accounts' },
        { title: window.translate('Contacts'), path: '/contacts' },
        { title: window.translate('Leads'), path: '/leads' },
        { title: window.translate('Campaigns'), path: '/campaigns' }
    ];

    const gridStyle = {
        display: 'grid',
        gridTemplateAreas: `'header' 'content' 'footer'`,
        gridTemplateRows: 'auto 1fr 50px',
        gridTemplateColumns: '1fr',
        height: '100vh',
        fontFamily: 'roboto'
    };

    const headerStyle = {
        gridArea: 'header'
    };

    const contentStyle = {
        gridArea: 'content',
        display: 'flex'
    };

    const footerStyle = {
        gridArea: 'footer',
        width: '100%',
        height: '100%',
        background: 'linear-gradient(0deg, #1A1A1A 0%, #444343 100%)'
    };

    useEffect(() => {
        async function fetchModules() {
            const m = await GetModules();
            setModules(m);
            const module = m.find((x) => x.shortCode === 'CRM');
            module?.name && setModuleTitle(module?.name);
        }

        fetchModules();
    }, []);

    window.emptyGuid = '00000000-0000-0000-0000-000000000000';

    window.newGuid = (str) => {
        if (str === undefined || !str.length) str = '' + Math.random() * new Date().getTime() + Math.random();

        let c = 0;
        let r = '';

        for (let i = 0; i < str.length; i++) c = (c + (str.charCodeAt(i) * (i + 1) - 1)) & 0xfffffffffffff;

        str = str.substr(str.length / 2) + c.toString(16) + str.substr(0, str.length / 2);
        for (let i = 0, p = c + str.length; i < 32; i++) {
            if (i === 8 || i === 12 || i === 16 || i === 20) r += '-';

            c = p = str[(i ** i + p + 1) % str.length].charCodeAt(0) + p + i;
            if (i === 12) c = (c % 5) + 1;
            // 1-5
            else if (i === 16) c = (c % 4) + 8;
            // 8-B
            else c %= 16; // 0-F

            r += c.toString(16);
        }
        return r;
    };

    return (
        <MessageProvider>
            <RecordStateProvider>
                <CompactTableSearchProvider>
                    <div style={gridStyle}>
                        <div style={headerStyle}>
                            <AsTitlebar
                                moduleTitle={moduleTitle}
                                title={moduleTitle}
                                animationDuration={500}
                                moduleLinks={modules}
                                logo={logo}
                            />
                        </div>
                        <div style={contentStyle}>
                            <div style={{ display: 'inline-flex' }}>
                                <RouteNavbar routes={routes} />
                            </div>
                            <Switch>
                                <Route exact path='/' component={AccountLandingPage} />

                                <Route exact path='/contacts' component={ContactsLandingPage} />

                                <Route exact path='/contacts/create' component={ContactsCreatePage} />

                                <Route exact path='/contacts/details' component={ContactsDetailsPage} />

                                <Route exact path='/contacts/campaignslink' component={ContactsCampaignsLinkPage} />

                                <Route exact path='/leads' component={LeadLandingPage} />

                                <Route path='/leads/create' component={LeadsCreatePage} />

                                <Route path='/leads/details' component={LeadsDetailsPage} />

                                <Route path='/attachments/create' component={AttachmentCreate} />

                                <Route exact path='/accounts' component={AccountLandingPage} />
                                <Route exact path='/accounts/create' component={AccountCreatePage} />

                                <Route exact path='/accounts/details' component={AccountDetailsPage} />

                                <Route exact path='/campaigns' component={CampaignsLandingPage} />

                                <Route exact path='/campaigns/contactslink' component={CampaignsContactsLinkPage} />

                                <Route path='/search' component={CompactTableLookupPage} />

                                <Route exact path='/accounts/invoices/details' component={InvoiceDetailsPage} />

                                <Route exact path='/accounts/creditnotes/details' component={CreditNoteDetailsPage} />

                                <Route exact path='/accounts/action' component={AccountActionPage} />
                            </Switch>
                        </div>
                        <div style={footerStyle} />
                        <MessageModal id='general-modal' />
                    </div>
                </CompactTableSearchProvider>
            </RecordStateProvider>
        </MessageProvider>
    );
}

export default App;
