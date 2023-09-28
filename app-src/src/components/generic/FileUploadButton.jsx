import React, { useState } from 'react';

const FileUploadButton = ({
    disabled,
    children,
    useSecondaryStyle = false,
    useTertiaryStyle = false,
    hoverStyle,
    onFileSelect,
    ...props
}) => {
    const [isHovering, setIsHovering] = useState(false);

    // Styles
    const primaryColourScheme = {
        // Amber
        border: '1px solid #ff7d00',
        backgroundColor: isHovering ? '#ffc134' : '#faa800'
    };

    const secondaryColourScheme = {
        // Light Orange
        border: '1px solid #ffb50c',
        backgroundColor: isHovering ? '#ffffff' : `#fdf1d6`
    };

    const tertiaryColourScheme = {
        // White
        ...(isHovering
            ? {
                  border: '1px solid #ffb50c',
                  backgroundColor: `#fdf1d6`
              }
            : {
                  border: '2px solid #cccccc',
                  backgroundColor: `#ffffff`
              })
    };

    const disabledColourScheme = {
        backgroundColor: '#cccccc', // Grey
        border: '1px solid #a6a6a6'
    };

    const buttonStyle = {
        boxSizing: 'border-box',
        fontFamily: 'Roboto',
        fontSize: '18px',
        fontWeight: 500,
        width: '150px',
        height: '40px',
        borderRadius: '5px',
        margin: 'auto',
        color: '#000000',
        cursor: disabled ? 'default' : 'pointer',
        ...(disabled
            ? disabledColourScheme
            : {
                  ...primaryColourScheme,
                  ...(useSecondaryStyle ? { ...secondaryColourScheme } : {}),
                  ...(useTertiaryStyle ? { ...tertiaryColourScheme } : {})
              }),
        ...props.style,
        ...(!disabled && typeof hoverStyle === 'object' && isHovering
            ? { ...hoverStyle }
            : {})
    };

    // Event handlers
    /**
     * Event handler: fired when a file has been selected from the dialogue.
     * @param {object} e - event
     */
    const selectFile = (e) => {
        onFileSelect(e.target.files[0]);
        // Fix for non-firefox browsers
        e.target.value = null;
    };

    return (
        <label
            {...props}
            style={buttonStyle}
            onMouseOver={() => setIsHovering(true)}
            onMouseOut={() => setIsHovering(false)}
        >
            <div
                style={{
                    position: 'relative',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%,-50%)'
                }}
            >
                {children}
            </div>
            <input
                type='file'
                disabled={disabled}
                onChange={selectFile}
                style={{ display: 'none' }}
            />
        </label>
    );
};

export default FileUploadButton;
