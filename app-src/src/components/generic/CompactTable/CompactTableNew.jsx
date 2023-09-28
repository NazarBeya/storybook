import React, { useEffect, useRef, useState } from 'react';
import { ReactComponent as IconSearch } from '../../../svg/icon_search.svg';
import CompactTableModal from './CompactTableModal';

const CompactTableNew = ({
    id,
    value = '',
    inputType = 'text',
    inputStyle,
    buttonStyle,
    separateButton = false,
    disabled = false,
    onChange,
    onDropdownClick,
    minSearchLength = 3,
    tableColumnDefinitions,
    numResultsInDropdown = 5,
    searchFunction,
    searchFilter = 'notset',
    errorName = '',
    openDropDown = 0,
    setOpenDropDown,
    statusStyle,
    showClearButton = false,
    onRemoveClick
}) => {
    const [isHovering, setIsHovering] = useState(false);
    const [searchContent, setSearchContent] = useState(null);
    const [searchResults, setSearchResults] = useState([]);
    const [modalShowing, setModalShowing] = useState(false);
    const [dropDownShowing, setDropDownShowing] = useState(false);
    const [lastSearch, setLastSearch] = useState(undefined);
    const [searchTerm, setSearchTerm] = useState('');
    const [validSelection, setValidSelection] = useState(true);
    const containerRef = useRef(null);

    useEffect(() => {
        const val = value || '';
        setSearchTerm(val);
        setLastSearch(val);
    }, []);

    useEffect(() => {
        const val = value || '';
        setSearchTerm(val);
    }, [value]);

    /** ***************************************************************/
    /* Styles here - would rather place in seperate unit */
    /** **************************************************************/
    const groupStyle = {
        display: 'flex',
        width: '100%'
    };

    const disabledInputStyle = {
        backgroundColor: '#F7F7F7'
    };

    const disabledButtonStyle = {
        backgroundColor: '#CCCCCC',
        border: '1px solid #A6A6A6'
    };

    const submitStyle = {
        color: '#1101BE',
        cursor: searchTerm ? 'pointer' : 'default'
    };

    inputStyle = {
        fontFamily: 'roboto',
        boxSizing: 'border-box',
        border: '1px solid #D7D7D7',
        borderRadius: separateButton ? 5 : '5px 0 0 5px',
        textAlign: 'left',
        paddingLeft: 12,
        backgroundColor: '#FFFDF4',
        color: '#414141',
        width: '80%',
        fontSize: 15,
        ...inputStyle,
        ...(disabled ? disabledInputStyle : {}),
        ...(disabled && inputType === 'submit' ? submitStyle : {})
    };

    const separateButtonStyle = {
        marginLeft: 8
    };

    buttonStyle = {
        border: '2px solid #FD9A00',
        borderRadius: separateButton ? 5 : '0 5px 5px 0',
        backgroundColor: isHovering ? '#FFC134' : '#FAA800',
        height: inputStyle.height,
        ...(separateButton ? separateButtonStyle : {}),
        width: '20%',
        cursor: disabled ? 'default' : 'pointer',
        ...buttonStyle,
        ...(disabled ? disabledButtonStyle : {})
    };

    const iconStyle = {
        width: 20,
        height: 21,
        fill: '#414141'
    };

    const searchResultsStyle = {
        position: 'absolute',
        width: containerRef?.current?.offsetWidth,
        marginTop: containerRef?.current?.offsetHeight - 1,
        backgroundColor: 'white',
        zIndex: 99
    };

    const tableStyle = {
        width: '100%',
        fontSize: 14,
        fontWeight: 500,
        borderSpacing: 'unset'
    };

    const resultStyle = {
        backgroundColor: '#FFFFFF',
        borderLeft: '1px solid #CCCCCC',
        borderRight: '1px solid #CCCCCC',
        paddingLeft: 15,
        paddingBottom: 8,
        cursor: 'pointer'
    };

    const firstResultStyle = {
        borderTop: '1px solid #CCCCCC',
        paddingTop: 7
    };

    const lastResultStyle = {
        borderBottom: '1px solid #CCCCCC',
        borderRadius: '0 0 15px 15px'
    };

    const statusLabelStyle = {
        position: 'absolute',
        color: '#C40606',
        fontSize: 12,
        ...statusStyle
    };

    const errorStyle = {
        borderColor: '#C40606'
    };

    const clearStyle = {
        right: '23%',
        position: 'absolute',
        marginTop: 10,
        width: 15,
        height: 15,
        borderRadius: '50%',
        color: '#fff',
        backgroundColor: '#ccc',
        font: '13px / 1em monospace',
        textAlign: 'center',
        cursor: 'pointer'
    };

    /** ***********************************************************************************/
    /* End of Styles                                                                     */
    /** ***********************************************************************************/

    const childSearch = async (searchTerm, params) => {
        if (searchFilter !== 'notset') {
            if (!searchFilter[0] && searchFilter?.length > 0) {
                return [];
            }
        }

        //        if ((searchFunction && searchTerm.length >= minSearchLength) ) {
        if (searchFunction && searchTerm.length) {
            try {
                const results = await searchFunction(searchTerm, {
                    ...params,
                    filter: searchFilter,
                    useFirstColumnOnly: true
                });

                return results;
            } catch (error) {
                // eslint-disable-next-line no-console
                console.log(error);
                return [];
            }
        }
        return [];
    };
    const enterHit = (e) => {
        if (e.code === 'Enter') {
            doTheSearch(searchTerm, true);
        }
    };

    const doTheSearch = async (searchTerm, force = false) => {
        if (searchFilter !== 'notset') {
            if (!searchFilter[0] && searchFilter?.length > 0) {
                return;
            }
        }
        if (searchFunction && (force || searchTerm?.length >= minSearchLength)) {
            try {
                const results = await searchFunction(searchTerm, {
                    filter: searchFilter,
                    useFirstColumnOnly: true
                });

                setSearchResults(results.data);
            } catch (error) {
                // eslint-disable-next-line no-console
                console.log(error);
            }
        }
    };

    const handleHoverEnter = (e) => {
        e.currentTarget.style.backgroundColor = 'rgba(20,251,255,0.15)';
    };
    const handleHoverLeave = (e) => {
        e.currentTarget.style.backgroundColor = '#FFFFFF';
    };

    useEffect(() => {
        if (!searchResults || searchResults.length === 0 || !dropDownShowing) {
            setSearchContent(null);
            return;
        }

        const resultsSize =
            searchResults.length < numResultsInDropdown ? searchResults.length - 1 : numResultsInDropdown - 1;

        setSearchContent(
            <div style={searchResultsStyle}>
                <table id='search-results' style={tableStyle}>
                    <tbody>
                        {searchResults.slice(0, numResultsInDropdown).map((searchResult, i) => (
                            <tr
                                key={i}
                                style={{
                                    boxSizing: 'border-box'
                                }}
                            >
                                <td
                                    style={{
                                        ...resultStyle,
                                        ...(i === 0 ? firstResultStyle : {}),
                                        ...(i === resultsSize ? lastResultStyle : {})
                                    }}
                                    onMouseEnter={(e) => handleHoverEnter(e)}
                                    onMouseLeave={(e) => handleHoverLeave(e)}
                                    onMouseDown={(e) => e.preventDefault()}
                                    onClick={() => {
                                        valueSelected(searchResult);
                                    }}
                                >
                                    {searchResult.name}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );

        if (setOpenDropDown) {
            setOpenDropDown(0);
        }
    }, [searchResults, dropDownShowing]);

    const searchChanged = async (event) => {
        setSearchTerm(event.target.value);
        onChange(event);
        doTheSearch(event.target.value);
        setDropDownShowing(true);
        setValidSelection(false);
    };

    const clearText = () => {
        setSearchTerm('');
        onRemoveClick();
    };

    // Keep this here for now because some of the functionality is required
    // const handleClick = (event) => {
    //     if (onOpenClick) {
    //         onOpenClick(event);
    //     }

    //     // This is used in case the onOpenClick wants us to terminate
    //     if (event.defaultPrevented) {
    //         return;
    //     }

    //     setModalShowing(true);
    //     if (searchFilter) {
    //         doTheSearch('');
    //     }
    // };

    const valueSelected = (value) => {
        setSearchTerm(value.name);
        onDropdownClick(value);
        setDropDownShowing(false);
        setValidSelection(true);
        setIsHovering(false);
    };

    const setFocus = () => {
        if (minSearchLength === 0) {
            getValues(searchTerm);
            setDropDownShowing(true);
        }
    };

    const getValues = async (srch) => {
        if (srch?.length < minSearchLength) {
            return;
        }
        if (srch !== lastSearch) {
            setLastSearch(srch);
            doTheSearch(srch);
        }
    };

    const handleClose = () => {
        setModalShowing(false);
        setIsHovering(false);
    };

    useEffect(() => {
        if (openDropDown > 0) {
            setDropDownShowing(true);
            doTheSearch('');
        }
    }, [openDropDown]);

    return modalShowing ? (
        <CompactTableModal
            onClose={handleClose}
            searchFunction={childSearch}
            tableColumnDefinitions={tableColumnDefinitions}
            minSearchLength={minSearchLength}
            initSearchTerm={value}
            id={`${id}-tablelookup`}
            onSelect={(e) => {
                valueSelected(e);
                setModalShowing(false);
            }}
            searchResults={searchResults}
        />
    ) : (
        <>
            <div ref={containerRef} style={{ ...groupStyle, position: 'relative' }}>
                <input
                    id={`${id}-input`}
                    disabled={disabled && inputType === 'text'}
                    style={{
                        ...inputStyle,
                        ...(searchTerm.length > 0 && errorName && !validSelection ? errorStyle : null)
                    }}
                    type={disabled ? inputType : 'text'}
                    value={searchTerm || ''}
                    autoComplete='off'
                    onChange={searchChanged}
                    onBlur={() => setDropDownShowing()}
                    onFocus={setFocus}
                    onKeyDown={enterHit}
                />
                {showClearButton && (
                    <span style={clearStyle} onClick={clearText}>
                        x
                    </span>
                )}
                <button
                    id={`${id}-button`}
                    disabled={disabled}
                    style={buttonStyle}
                    onMouseOver={() => setIsHovering(true)}
                    onMouseOut={() => setIsHovering(false)}
                    onClick={() => setModalShowing(true)}
                >
                    <IconSearch viewBox='17 17 16 16' style={iconStyle} />
                </button>
                {searchContent}
            </div>
            {searchTerm.length > 0 && errorName && !validSelection ? (
                <label style={statusLabelStyle}>{`${errorName} does not exist.`}</label>
            ) : null}
        </>
    );
};

export default CompactTableNew;
