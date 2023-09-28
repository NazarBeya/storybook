const goDirect = false;
const endpointLocal = false;
const crmEndpointLocal = false;

export const endpoint = window.config?.endpoint
    ? window.config.endpoint
    : goDirect
    ? endpointLocal
        ? 'https://localhost:5001'
        : `${window.origin}/api/starter2`
    : endpointLocal
    ? `${window.origin}/api/starter2/local`
    : `${window.origin}/api/starter2`;

export const crmEndpoint = window.config?.crmEndpoint
    ? window.config.crmEndpoint
    : goDirect
    ? crmEndpointLocal
        ? 'https://localhost:5003'
        : `${window.origin}/api/crm`
    : crmEndpointLocal
    ? `${window.origin}/api/crm/local`
    : `${window.origin}/api/crm`;

export const starter2Api = endpoint;

export const campaignManagerUi = `${window.origin}/campaign-manager`;
