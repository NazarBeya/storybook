import React, { useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import useCompactTableSearch from '../../../hooks/useCompactTableSearch';
import { ReactComponent as IconSearch } from '../../../svg/icon_search.svg';
import {
    InputStatusColors,
    InputStatusBGColors
} from '../../../constants/Enums';

const CompactTable = ({
    id,
    value,
    valueId,
    inputType = 'text',
    inputStyle,
    buttonStyle,
    separateButton = false,
    disabled = false,
    inputLinkDisabled = false,
    onChange,
    onDropdownClick,
    onOpenClick,
    onInputClick,
    minSearchLength = 3,
    tableColumnDefinitions,
    numResultsInDropdown = 5,
    statusMessage,
    searchFunction,
    searchFilter,
    returnPath,
    returnStates,
    errorName = '',
    showClearButton = false,
    onRemoveClick
}) => {
    const [isHovering, setIsHovering] = useState(false);
    const [isDropdownHover, setIsDropdownHover] = useState(false);
    const [searchContent, setSearchContent] = useState(null);
    const [searchKeyPress, setSearchKeyPress] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [validSelection, setValidSelection] = useState(true);
    const containerRef = useRef(null);
    const history = useHistory();

    useEffect(() => {
        const val = value || '';
        setSearchTerm(val);
    }, [value]);

    const {
        addSearchFunction,
        getSearchResult,
        removeSearchFunction
    } = useCompactTableSearch();

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

    const errorInputStyle = {
        border: `1px solid ${InputStatusColors.RED}`,
        backgroundColor: InputStatusBGColors.RED
    };

    const submitStyle = {
        color: '#1101BE',
        cursor: value ? 'pointer' : 'default'
    };

    const minLengthToStartSearch = 3;

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
        ...(!disabled &&
            statusMessage &&
            !valueId &&
            value &&
            value.length >= minLengthToStartSearch &&
            !searchKeyPress &&
            !searchContent
            ? errorInputStyle
            : {}),
        ...(disabled ? disabledInputStyle : {}),
        ...(disabled && inputType === 'submit' && !inputLinkDisabled
            ? submitStyle
            : {})
    };

    const statusLabelStyle = {
        position: 'absolute',
        color: InputStatusColors.RED,
        fontSize: 12,
        width: containerRef?.current?.offsetWidth,
        // marginTop: containerRef?.current?.offsetHeight,
        marginTop:0,
        backgroundColor: 'white',
        zIndex: 89
    };

    const errorStyle = {
        borderColor: '#C40606'
    };

    const clearStyle = {
        right: '20%',
        position: 'absolute',
        marginTop: 11,
        width: 15,
        height: 15,
        borderRadius: '50%',
        color: '#fff',
        backgroundColor: '#ccc',
        font: '13px / 1em monospace',
        textAlign: 'center',
        cursor: 'pointer'
    };

    const statusMsg =
        inputStyle.backgroundColor === InputStatusBGColors.RED
            ? statusMessage
            : '';

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

    useEffect(() => {
        const result = getSearchResult(id);
        if (result) {
            console.log('result from context', result);

            if (onDropdownClick && result !== value) {
                onDropdownClick(result);
            }
        }
    }, []);

    useEffect(() => {
        const result = getSearchResult(id);
        if (result && result.name === value) {
            removeSearchFunction();
        }
    }, [value]);

    useEffect(() => {
        if (!searchResults || searchResults.length === 0 || !searchKeyPress) {
            setSearchContent(null);
            return;
        }

        const resultsSize =
            searchResults.length < numResultsInDropdown
                ? searchResults.length - 1
                : numResultsInDropdown - 1;

        setSearchContent(
            <div
                style={searchResultsStyle}
                onMouseOver={() => setIsDropdownHover(true)}
                onMouseOut={() => setIsDropdownHover(false)}
            >
                <table id='search-results' style={tableStyle}>
                    <tbody>
                        {searchResults
                            .slice(0, numResultsInDropdown)
                            .map((searchResult, i) => (
                                <tr
                                    key={i}
                                    style={{
                                        boxSizing: 'border-box'
                                    }}
                                >
                                    <td
                                        style={{
                                            ...resultStyle,
                                            ...(i === 0
                                                ? firstResultStyle
                                                : {}),
                                            ...(i === resultsSize
                                                ? lastResultStyle
                                                : {})
                                        }}
                                        onClick={() =>
                                            handleDropdownClick(searchResult)
                                        }
                                    >
                                        {searchResult.name}
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>
        );
    }, [searchResults]);

    const hideSearch = (forceHide = false) => {
        if (forceHide === true || !isDropdownHover) {
            setSearchContent(null);
            setSearchKeyPress(false);
            setIsDropdownHover(false);
        }
    };

    const handleDropdownClick = (searchResult) => {
        hideSearch(true);
        if (onDropdownClick) {
            onDropdownClick(searchResult);
        }
        setValidSelection(true);
    };

    const handleOnChange = async (event) => {
        setSearchTerm(event.target.value);
        onChange(event);
        setSearchKeyPress(true);
        if (
            searchFunction &&
            event.target.value.length >= minLengthToStartSearch
        ) {
            try {
                const results = await searchFunction(event.target.value, {
                    filter: searchFilter,
                    useFirstColumnOnly: true
                });
                setSearchResults(results.data);
                if (
                    statusMessage &&
                    results.data.length > 0 &&
                    results.data[0].name.toLowerCase() ===
                    event.target.value.toLowerCase() &&
                    onDropdownClick
                ) {
                    onDropdownClick(results.data[0]);
                }
            } catch (error) {
                console.log(error);
            }
        } else {
            hideSearch();
        }
        setValidSelection(false);
    };

    const handleClick = (event) => {
        if (onOpenClick) {
            onOpenClick(event);
        }

        // This is used in case the onOpenClick wants us to terminate
        if (event.defaultPrevented) {
            return;
        }

        addSearchFunction(id, searchFunction);

        history.push({
            pathname: '/search',
            state: {
                id: id,
                minSearchLength: minSearchLength,
                tableColumnDefinitions: tableColumnDefinitions,
                searchTerm: value,
                searchFilter: searchFilter,
                path: returnPath,
                returnStates: returnStates
            }
        });
    };

    const handleInputClick = (event) => {
        if (disabled && !inputLinkDisabled) onInputClick(event);
    };

    const clearText = () => {
        setSearchTerm('');
        onRemoveClick();
    };

    return (
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
                    value={value || ''}
                    autoComplete='off'
                    onChange={handleOnChange}
                    onClick={handleInputClick}
                    onBlur={hideSearch}
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
                    onClick={handleClick}
                >
                    <IconSearch viewBox='17 17 16 16' style={iconStyle} />
                </button>
                {/* <label style={statusLabelStyle}>{statusMsg}</label> */}
                {searchContent}
            </div>
            {searchTerm.length > 0 && errorName && !validSelection ? (
                <label style={statusLabelStyle}>{`${errorName} does not exist.`}</label>
            ) : null}
        </>
    );
};

export default CompactTable;
