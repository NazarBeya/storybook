import React, { useState } from 'react';
import AccountHistoryTable from './AccountHistoryTable';
import { ReactComponent as IconPlus } from '../../svg/Icon_Plus.svg';
import { ReactComponent as IconMinimise } from '../../svg/Icon_Minus.svg';
import { sectionedPanelStyle, iconPlusMinimiseStyle, historyPanelStyle } from '../../styles';

const AccountHistory = ({ account }) => {
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
                <span style={{ color: '#141414', fontSize: 15 }}>{window.translate('Account History')}</span>
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
                    <AccountHistoryTable account={account} />
                </div>
            )}
        </div>
    );
};

export default AccountHistory;
