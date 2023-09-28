import React, { useState } from 'react';
import { ReactComponent as IconPlus } from '../../svg/Icon_Plus.svg';
import { ReactComponent as IconMinimise } from '../../svg/Icon_Minus.svg';
import { sectionedPanelStyle, iconPlusMinimiseStyle, historyPanelStyle } from '../../styles';
import ContactHistoryTable from './ContactHistoryTable';
import { subheadingStyle } from '../../pages/ContactsDetails/ContactsDetailsStyles';

const ContactHistory = ({ contact }) => {
    const [open, setOpen] = useState(false);
    return (
        <div style={sectionedPanelStyle}>
            <div
                style={{
                    ...historyPanelStyle,
                    paddingRight: 19,
                    paddingBottom: 8
                }}
            >
                <span style={subheadingStyle}>{window.translate('Contact History')}</span>
                <span>
                    {open ? (
                        <>
                            <IconMinimise
                                height={19}
                                width={19}
                                style={iconPlusMinimiseStyle}
                                onClick={() => setOpen(!open)}
                            />
                        </>
                    ) : (
                        <>
                            <IconPlus
                                height={19}
                                width={19}
                                style={iconPlusMinimiseStyle}
                                onClick={() => setOpen(!open)}
                            />
                        </>
                    )}
                </span>
            </div>
            {open && (
                <div
                    style={{
                        ...historyPanelStyle,
                        paddingTop: 0,
                        flexDirection: 'column'
                    }}
                >
                    <ContactHistoryTable contact={contact} />
                </div>
            )}
        </div>
    );
};

export default ContactHistory;
