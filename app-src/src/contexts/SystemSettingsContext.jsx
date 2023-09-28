import React, { createContext, useEffect, useState } from 'react';
import { GetSystemSettings } from '../services/SystemSettingsService';

const SystemSettingsContext = createContext();

const SystemSettingsProvider = ({ children }) => {
    const [dateFormat, setDateFormat] = useState('DD/MM/YYYY');
    const [timeFormat, setTimeFormat] = useState('HH:mm');
    const [languageId, setLanguageId] = useState('');
    const [locale, setLocale] = useState('en-GB');
    const [currency, setCurrency] = useState('GBP');
    const [currencySybmol, setCurrencySymbol] = useState('£');
    const [logo, setLogo] = useState(
        'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7' // White square will be nulled if no image is selected
    );

    const initSystemSettings = async () => {
        try {
            const response = await GetSystemSettings();
            setDateFormat(response.dateFormat);
            setTimeFormat(response.timeFormat);
            setLanguageId(response.languageId);
            setCurrency(response.currency);
            setLocale(response.language.locale);
            setLogo(response.logo);
            setCurrencySymbol(getCurrencySymbol(response.currency));
            window.translationStrings = JSON.parse(
                response.language.translations
            );
        } catch {
            // eslint-disable-next-line no-console
            console.error(
                'There was an error initalising the system settings.'
            );
        }
    };

    useEffect(() => {
        initSystemSettings();
    }, []);

    const formatCurrency = (number) => {
        if (!number || isNaN(number) || !locale || !currency) return number;

        return new Intl.NumberFormat(locale, {
            style: 'currency',
            currency: currency
        }).format(number);
    };

    const formatNumber = (number, options) => {
        if (!number || isNaN(number) || !locale || !currency) return number;

        return new Intl.NumberFormat(locale, options).format(number);
    };

    const getCurrencySymbol = (currency) => {
      var x = 0;
      return x.toLocaleString('en-GB', {style:"currency", currency:currency}).replace("0.00", "");
    }

    return (
        <SystemSettingsContext.Provider
            value={{
                dateFormat,
                timeFormat,
                languageId,
                currency,
                formatCurrency,
                formatNumber,
                locale,
                logo,
                initSystemSettings,
                currencySybmol
            }}
        >
            {children}
        </SystemSettingsContext.Provider>
    );
};

export { SystemSettingsContext, SystemSettingsProvider };
