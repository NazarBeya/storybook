import React, { useContext, useRef, useState, useEffect } from 'react';
import { useHistory } from 'react-router';
import { SystemSettingsContext } from '../../contexts/SystemSettingsContext';
import {
    invoicesIssuedContainerStyle,
    invoicesIssuedTableStyle,
    invoicesIssuedHeadCellStyle,
    invoicesIssuedTextStyle,
    invoicesIssuedMainCellStyle,
    invoiceNumberTextStyle,
    landingTitleStyle,
    tickboxLabelStyle,
    invoicesIssuedFootCellStyle
} from './BillingStyles';
import {
    Spacer,
    Tickbox 
} from '@adserve/adserve-react-components';
import CampaignNumberCell from './CampaignNumberCell';
import moment from 'moment';

const BillingInvoicesIssued = ({
    accountName,
    tableData = [],
    showInvoices,
    showCreditNotes,
    toggleShowInvoices,
    toggleShowCreditNotes,
    invoicesAirtime,
    invoicesOffairs,
    invoicesCommission,
    invoicesVat,
    invoicesTotal
}) => {
    const history = useHistory();
    const { formatCurrency, dateFormat } = useContext(SystemSettingsContext);
    const tableRef = useRef(null);
    const [scrollbarHeight] = useState(246);

    const handleCellClick = (type = 'invoice', payload) => {
        history.push(`${type}s/details`, {
            payload: payload,
            sourceName: accountName,
            readOnly: false
        });
    };

    return (
        <div style={invoicesIssuedContainerStyle}>
            <div style={{ marginLeft: 8, paddingTop: 13, paddingBottom: 8 }}>
                <span style={landingTitleStyle}>Invoices Issued</span>
                <div style={{ float: 'right', display: 'flex' }}>
                    <div
                        style={{ display: 'flex', cursor: 'pointer' }}
                        onClick={toggleShowInvoices}
                    >
                        <Tickbox height={18} width={18} value={showInvoices} />
                        <Spacer height={0} width={12} />
                        <span style={{ ...tickboxLabelStyle, paddingTop: 1 }}>
                            Show Invoices
                        </span>
                    </div>
                    <Spacer height={0} width={43} />
                    <div
                        style={{ display: 'flex', cursor: 'pointer' }}
                        onClick={toggleShowCreditNotes}
                    >
                        <Tickbox
                            height={18}
                            width={18}
                            value={showCreditNotes}
                        />
                        <Spacer height={0} width={12} />
                        <span style={{ ...tickboxLabelStyle, paddingTop: 1 }}>
                            Show Credit Notes
                        </span>
                    </div>
                    <Spacer height={0} width={80} />
                </div>
            </div>
            <div style={{ marginLeft: 9, width: '98.8%', overflow: 'hidden auto' }}>
                <div
                    style={{
                        position: 'absolute',
                        marginTop: 0,
                        height: 1,
                        width: 1557,
                        backgroundColor: '#D7D7D7'
                    }}
                />
                <div
                    style={{
                        position: 'absolute',
                        marginTop: 41,
                        height: 1,
                        width: 1557,
                        backgroundColor: '#D7D7D7',
                        zIndex: 9000
                    }}
                />
                <div
                    style={{
                        position: 'absolute',
                        marginTop: 40,
                        height: 1,
                        width: 1557,
                        backgroundColor: 'white',
                        zIndex: 9000
                    }}
                />
                <div style={{ height: 322, maxHeight: 742, overflow: 'hidden auto' }}>
                    <table ref={tableRef} style={invoicesIssuedTableStyle}>
                        <thead>
                            <tr>
                                <th
                                    style={{
                                        ...invoicesIssuedHeadCellStyle,
                                        width: 150
                                    }}
                                >
                                    <span>
                                        {window.translate('Invoice Number')}
                                    </span>

                                    <div
                                        align='right'
                                        style={{
                                            ...invoicesIssuedFootCellStyle,
                                            marginTop:
                                                255 +
                                                (scrollbarHeight - 246)
                                        }}
                                    >
                                        <span
                                            style={{
                                                paddingRight: 11,
                                                fontSize: 15
                                            }}
                                        >
                                            {window.translate(
                                                'Total Invoiced'
                                            )}
                                        </span>
                                    </div>
                                </th>

                                <th
                                    style={{
                                        ...invoicesIssuedHeadCellStyle,
                                        width: 120
                                    }}
                                >
                                    <span>
                                        {window.translate(
                                            'Invoice Start Date'
                                        )}
                                    </span>

                                    <div
                                        align='right'
                                        style={{
                                            ...invoicesIssuedFootCellStyle,
                                            marginTop:
                                                255 +
                                                (scrollbarHeight - 246)
                                        }}
                                    />
                                </th>

                                <th
                                    style={{
                                        ...invoicesIssuedHeadCellStyle,
                                        width: 120
                                    }}
                                >
                                    <span>
                                        {window.translate(
                                            'Invoice End Date'
                                        )}
                                    </span>

                                    <div
                                        align='right'
                                        style={{
                                            ...invoicesIssuedFootCellStyle,
                                            marginTop:
                                                255 +
                                                (scrollbarHeight - 246)
                                        }}
                                    />
                                </th>

                                <th
                                    style={{
                                        ...invoicesIssuedHeadCellStyle,
                                        width: 130
                                    }}
                                >
                                    <span>
                                        {window.translate(
                                            'Purchase Order Number'
                                        )}
                                    </span>

                                    <div
                                        align='right'
                                        style={{
                                            ...invoicesIssuedFootCellStyle,
                                            marginTop:
                                                246 +
                                                (scrollbarHeight - 246)
                                        }}
                                    />
                                </th>

                                <th
                                    style={{
                                        ...invoicesIssuedHeadCellStyle,
                                        width: 120
                                    }}
                                >
                                    <span>
                                        {window.translate('Net Airtime')}
                                    </span>

                                    <div
                                        align='right'
                                        style={{
                                            ...invoicesIssuedFootCellStyle,
                                            marginTop:
                                                255 +
                                                (scrollbarHeight - 246)
                                        }}
                                    >
                                        <span
                                            style={{
                                                paddingRight: 11,
                                                fontSize: 15
                                            }}
                                        >
                                            {formatCurrency(
                                                invoicesAirtime
                                            ) || `£0.00`}
                                        </span>
                                    </div>
                                </th>

                                <th
                                    style={{
                                        ...invoicesIssuedHeadCellStyle,
                                        width: 120
                                    }}
                                >
                                    <span>
                                        {window.translate('Net Off-Airs')}
                                    </span>

                                    <div
                                        align='right'
                                        style={{
                                            ...invoicesIssuedFootCellStyle,
                                            marginTop:
                                                255 +
                                                (scrollbarHeight - 246)
                                        }}
                                    >
                                        <span
                                            style={{
                                                paddingRight: 11,
                                                fontSize: 15
                                            }}
                                        >
                                            {formatCurrency(
                                                invoicesOffairs
                                            ) || `£0.00`}
                                        </span>
                                    </div>
                                </th>

                                <th
                                    style={{
                                        ...invoicesIssuedHeadCellStyle,
                                        width: 120
                                    }}
                                >
                                    <span>
                                        {window.translate('Commission')}
                                    </span>

                                    <div
                                        align='right'
                                        style={{
                                            ...invoicesIssuedFootCellStyle,
                                            marginTop:
                                                255 +
                                                (scrollbarHeight - 246)
                                        }}
                                    >
                                        <span
                                            style={{
                                                paddingRight: 11,
                                                fontSize: 15
                                            }}
                                        >
                                            {formatCurrency(
                                                invoicesCommission
                                            ) || `£0.00`}
                                        </span>
                                    </div>
                                </th>

                                <th
                                    style={{
                                        ...invoicesIssuedHeadCellStyle,
                                        width: 120
                                    }}
                                >
                                    <span>{window.translate('VAT')}</span>

                                    <div
                                        align='right'
                                        style={{
                                            ...invoicesIssuedFootCellStyle,
                                            marginTop:
                                                255 +
                                                (scrollbarHeight - 246)
                                        }}
                                    >
                                        <span
                                            style={{
                                                paddingRight: 11,
                                                fontSize: 15
                                            }}
                                        >
                                            {formatCurrency(invoicesVat) ||
                                                `£0.00`}
                                        </span>
                                    </div>
                                </th>

                                <th
                                    style={{
                                        ...invoicesIssuedHeadCellStyle,
                                        width: 120
                                    }}
                                >
                                    <span>{window.translate('Total')}</span>

                                    <div
                                        align='right'
                                        style={{
                                            ...invoicesIssuedFootCellStyle,
                                            marginTop:
                                                255 +
                                                (scrollbarHeight - 246)
                                        }}
                                    >
                                        <span
                                            style={{
                                                paddingRight: 11,
                                                fontSize: 15
                                            }}
                                        >
                                            {formatCurrency(
                                                invoicesTotal
                                            ) || `£0.00`}
                                        </span>
                                    </div>
                                </th>

                                <th
                                    style={{
                                        ...invoicesIssuedHeadCellStyle,
                                        width: 120
                                    }}
                                >
                                    <span>
                                        {window.translate('Issue Date')}
                                    </span>

                                    <div
                                        align='right'
                                        style={{
                                            ...invoicesIssuedFootCellStyle,
                                            marginTop:
                                                255 +
                                                (scrollbarHeight - 246)
                                        }}
                                    />
                                </th>

                                <th
                                    style={{
                                        ...invoicesIssuedHeadCellStyle,
                                        width: 336
                                    }}
                                >
                                    <span>
                                        {window.translate('Campaign')}
                                    </span>

                                    <div
                                        align='right'
                                        style={{
                                            ...invoicesIssuedFootCellStyle,
                                            marginTop:
                                                255 +
                                                (scrollbarHeight - 246)
                                        }}
                                    />
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {tableData?.map((dp, i) => (
                                <tr key={`invoices-issued-${i}`}>
                                    <td
                                        align='right'
                                        style={{
                                            ...invoicesIssuedMainCellStyle(
                                                i,
                                                dp?.type === 'Credit'
                                            ),
                                            cursor: 'pointer',
                                            ...(dp.invoiceTypeName ===
                                                'CreditNote'
                                                ? {
                                                    backgroundColor:
                                                        '#FEEDEC'
                                                }
                                                : {})
                                        }}
                                        onClick={() =>
                                            handleCellClick('invoice', dp)
                                        }
                                    >
                                        <span
                                            style={invoiceNumberTextStyle(
                                                dp?.type === 'Credit'
                                            )}
                                        >
                                            {dp?.invoiceNumber}
                                        </span>
                                    </td>
                                    <td
                                        align='right'
                                        style={{
                                            ...invoicesIssuedMainCellStyle(
                                                i,
                                                dp?.type === 'Credit'
                                            ),
                                            ...(dp.invoiceTypeName ===
                                                'CreditNote'
                                                ? {
                                                    backgroundColor:
                                                        '#FEEDEC'
                                                }
                                                : {})
                                        }}
                                    >
                                        <span
                                            style={invoicesIssuedTextStyle}
                                        >
                                            {moment(
                                                dp?.periodStartDate
                                            ).format(dateFormat)}
                                        </span>
                                    </td>
                                    <td
                                        align='right'
                                        style={{
                                            ...invoicesIssuedMainCellStyle(
                                                i,
                                                dp?.type === 'Credit'
                                            ),
                                            ...(dp.invoiceTypeName ===
                                                'CreditNote'
                                                ? {
                                                    backgroundColor:
                                                        '#FEEDEC'
                                                }
                                                : {})
                                        }}
                                    >
                                        <span
                                            style={invoicesIssuedTextStyle}
                                        >
                                            {moment(
                                                dp?.periodEndDate
                                            ).format(dateFormat)}
                                        </span>
                                    </td>
                                    <td
                                        align='right'
                                        style={{
                                            ...invoicesIssuedMainCellStyle(
                                                i,
                                                dp?.type === 'Credit'
                                            ),
                                            ...(dp.invoiceTypeName ===
                                                'CreditNote'
                                                ? {
                                                    backgroundColor:
                                                        '#FEEDEC'
                                                }
                                                : {})
                                        }}
                                    >
                                        <span
                                            style={invoicesIssuedTextStyle}
                                        >
                                            {dp?.orderNumber}
                                        </span>
                                    </td>
                                    <td
                                        align='right'
                                        style={{
                                            ...invoicesIssuedMainCellStyle(
                                                i,
                                                dp?.type === 'Credit'
                                            ),
                                            ...(dp.invoiceTypeName ===
                                                'CreditNote'
                                                ? {
                                                    backgroundColor:
                                                        '#FEEDEC'
                                                }
                                                : {})
                                        }}
                                    >
                                        <span
                                            style={invoicesIssuedTextStyle}
                                        >
                                            {formatCurrency(
                                                dp?.netAirtimeValue
                                            )}
                                        </span>
                                    </td>
                                    <td
                                        align='right'
                                        style={{
                                            ...invoicesIssuedMainCellStyle(
                                                i,
                                                dp?.type === 'Credit'
                                            ),
                                            ...(dp.invoiceTypeName ===
                                                'CreditNote'
                                                ? {
                                                    backgroundColor:
                                                        '#FEEDEC'
                                                }
                                                : {})
                                        }}
                                    >
                                        <span
                                            style={invoicesIssuedTextStyle}
                                        >
                                            {formatCurrency(
                                                dp?.netOffAirsValue
                                            )}
                                        </span>
                                    </td>
                                    <td
                                        align='right'
                                        style={{
                                            ...invoicesIssuedMainCellStyle(
                                                i,
                                                dp?.type === 'Credit'
                                            ),
                                            ...(dp.invoiceTypeName ===
                                                'CreditNote'
                                                ? {
                                                    backgroundColor:
                                                        '#FEEDEC'
                                                }
                                                : {})
                                        }}
                                    >
                                        <span
                                            style={invoicesIssuedTextStyle}
                                        >
                                            {formatCurrency(dp?.commission)}
                                        </span>
                                    </td>
                                    <td
                                        align='right'
                                        style={{
                                            ...invoicesIssuedMainCellStyle(
                                                i,
                                                dp?.type === 'Credit'
                                            ),
                                            ...(dp.invoiceTypeName ===
                                                'CreditNote'
                                                ? {
                                                    backgroundColor:
                                                        '#FEEDEC'
                                                }
                                                : {})
                                        }}
                                    >
                                        <span
                                            style={invoicesIssuedTextStyle}
                                        >
                                            {formatCurrency(dp?.totalVat)}
                                        </span>
                                    </td>
                                    <td
                                        align='right'
                                        style={{
                                            ...invoicesIssuedMainCellStyle(
                                                i,
                                                dp?.type === 'Credit'
                                            ),
                                            ...(dp.invoiceTypeName ===
                                                'CreditNote'
                                                ? {
                                                    backgroundColor:
                                                        '#FEEDEC'
                                                }
                                                : {})
                                        }}
                                    >
                                        <span
                                            style={invoicesIssuedTextStyle}
                                        >
                                            {formatCurrency(dp?.total)}
                                        </span>
                                    </td>
                                    <td
                                        align='right'
                                        style={{
                                            ...invoicesIssuedMainCellStyle(
                                                i,
                                                dp?.type === 'Credit'
                                            ),
                                            ...(dp.invoiceTypeName ===
                                                'CreditNote'
                                                ? {
                                                    backgroundColor:
                                                        '#FEEDEC'
                                                }
                                                : {})
                                        }}
                                    >
                                        <span
                                            style={invoicesIssuedTextStyle}
                                        >
                                            {moment(dp?.invoiceDate).format(
                                                dateFormat
                                            )}
                                        </span>
                                    </td>
                                    <td
                                        align='right'
                                        style={{
                                            ...invoicesIssuedMainCellStyle(
                                                i,
                                                dp?.type === 'Credit'
                                            ),
                                            paddingRight: 29
                                        }}
                                    >
                                        <CampaignNumberCell
                                            data={dp}
                                            field={'campaignNumber'}
                                        />
                                    </td>
                                </tr>
                            ))}
                            {Object.keys(tableData)?.length < 19
                                ? Array.apply(
                                    null,
                                    Array(
                                        19 -
                                        Object.keys(tableData)?.length
                                    )
                                )
                                    .map(function () {
                                        return {};
                                    })
                                    .map((dp, j) => (
                                        <tr
                                            key={`invoices-issued-padding-row-${j}`}
                                        >
                                            <td
                                                align='right'
                                                style={invoicesIssuedMainCellStyle(
                                                    j
                                                )}
                                            ></td>
                                            <td
                                                align='right'
                                                style={invoicesIssuedMainCellStyle(
                                                    j
                                                )}
                                            ></td>
                                            <td
                                                align='right'
                                                style={invoicesIssuedMainCellStyle(
                                                    j
                                                )}
                                            ></td>
                                            <td
                                                align='right'
                                                style={invoicesIssuedMainCellStyle(
                                                    j
                                                )}
                                            ></td>
                                            <td
                                                align='right'
                                                style={invoicesIssuedMainCellStyle(
                                                    j
                                                )}
                                            ></td>
                                            <td
                                                align='right'
                                                style={invoicesIssuedMainCellStyle(
                                                    j
                                                )}
                                            ></td>
                                            <td
                                                align='right'
                                                style={invoicesIssuedMainCellStyle(
                                                    j
                                                )}
                                            ></td>
                                            <td
                                                align='right'
                                                style={invoicesIssuedMainCellStyle(
                                                    j
                                                )}
                                            ></td>
                                            <td
                                                align='right'
                                                style={invoicesIssuedMainCellStyle(
                                                    j
                                                )}
                                            ></td>
                                            <td
                                                align='right'
                                                style={invoicesIssuedMainCellStyle(
                                                    j
                                                )}
                                            ></td>
                                            <td
                                                align='right'
                                                style={invoicesIssuedMainCellStyle(
                                                    j
                                                )}
                                            ></td>
                                        </tr>
                                    ))
                                : null}
                        </tbody>
                    </table>
                </div>
            </div>
            <Spacer height={20} width={0} />
        </div>
    );
};

export default BillingInvoicesIssued;
