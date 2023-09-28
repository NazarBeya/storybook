import { useReducer, useEffect } from 'react';
/**
 * Extention of useReducer with session storage
 * @param {string} key - the name of the variable in local storage
 * @param {function} reducer - The reducer function
 * @param {*} initialValue - sets the initial value for the session if no value exists.
 */
const useSessionReducer = (key, reducer, initialValue) => {
    const parse = (value) => {
        if (typeof value === 'object') {
            return value;
        }
        try {
            return JSON.parse(value);
        } catch {
            return value.toString();
        }
    };
    const [get, set] = useReducer(
        reducer,
        // eslint-disable-next-line no-undef
        parse(sessionStorage.getItem(key)) ?? initialValue
    );

    useEffect(() => {
        // eslint-disable-next-line no-undef
        sessionStorage.setItem(key, JSON.stringify(get));
    }, [get]);

    // eslint-disable-next-line no-undef
    const remove = () => sessionStorage.removeItem(key);

    return [get, set, remove];
};

export default useSessionReducer;
