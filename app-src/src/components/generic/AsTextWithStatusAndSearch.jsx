import React, { useState, useEffect, useRef, memo } from 'react';
import AsTextWithStatus from './AsTextWithStatus';
import { InputStatusColors, InputStatusBGColors } from '../../constants/Enums';

// eslint-disable-next-line react/display-name
const AsTextWithStatusAndSearch = memo(
    ({
        name,
        title,
        value,
        onChange,
        disabled = false,
        dataId,
        labelStyle,
        inputStyle,
        maxLength,
        searchStatus = {
            statusMessage: undefined,
            statusColor: InputStatusColors.DEFAULT,
            statusBGColor: InputStatusBGColors.DEFAULT
        },
        searchResults,
        numResultsInDropdown = 5,
        ...props
    }) => {
        const [searchContent, setSearchContent] = useState(null);
        const [searchKeyPress, setSearchKeyPress] = useState(false);
        const containerRef = useRef(null);

        const searchResultsStyle = {
            position: 'absolute',
            width: containerRef?.current?.offsetWidth,
            zIndex: 99,
            backgroundColor: 'white'
        };

        const tableStyle = {
            width: '100%',
            fontSize: 14,
            fontWeight: 500,
            borderSpacing: 'unset'
        };

        const resultStyle = {
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
            position: 'inherit',
            color: searchStatus.statusColor,
            fontSize: 12,
            width: '100%'
        };

        useEffect(() => {
            if (!searchResults || searchResults.length === 0 || !searchKeyPress) {
                setSearchContent(null);
                return;
            }

            const resultsSize =
                searchResults.length < numResultsInDropdown ? searchResults.length - 1 : numResultsInDropdown - 1;

            setSearchContent(
                <div style={searchResultsStyle}>
                    <table id='search-results' style={tableStyle}>
                        <tbody>
                            {searchStatus.statusMessage && (
                                <tr
                                    key={0}
                                    style={{
                                        boxSizing: 'border-box'
                                    }}
                                >
                                    <td
                                        style={{
                                            ...resultStyle,
                                            ...firstResultStyle
                                        }}
                                    >
                                        <label style={statusLabelStyle}>{searchStatus.statusMessage}</label>
                                    </td>
                                </tr>
                            )}

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
                                            ...(i === 0 && !searchStatus.statusMessage ? firstResultStyle : {}),
                                            ...(i === resultsSize ? lastResultStyle : {})
                                        }}
                                    >
                                        {searchResult}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            );
        }, [searchResults]);

        const hideSearch = () => {
            setSearchContent(null);
        };

        const onChangeLocal = (e) => {
            setSearchKeyPress(true);
            onChange(e);
        };

        return (
            <div ref={containerRef}>
                <AsTextWithStatus
                    name={name}
                    title={title}
                    value={value}
                    onChange={onChangeLocal}
                    disabled={disabled}
                    dataId={dataId}
                    labelStyle={labelStyle}
                    inputStyle={{
                        ...inputStyle,
                        ...(!disabled
                            ? {
                                borderColor: searchStatus.statusColor,
                                backgroundColor: searchStatus.statusBGColor ? searchStatus.statusBGColor : '#FFFDF4'
                            }
                            : {})
                    }}
                    maxLength={maxLength}
                    statusMessage={numResultsInDropdown === 0 && searchStatus.statusMessage}
                    statusColor={searchStatus.statusColor}
                    onBlur={hideSearch}
                    {...props}
                />
                {numResultsInDropdown !== 0 && searchContent}
            </div>
        );
    }
);

export default AsTextWithStatusAndSearch;
