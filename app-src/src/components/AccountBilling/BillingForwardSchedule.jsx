import React, { useContext, useRef, useState, useEffect } from 'react';
import { SystemSettingsContext } from '../../contexts/SystemSettingsContext';
import {
    forwardScheduleContainerStyle,
    forwardScheduleTableStyle,
    forwardScheduleHeadCellStyle,
    forwardScheduleTextStyle,
    forwardScheduleMainCellStyle,
    forwardSchedulePoCellStyle,
    landingTitleStyle,
    forwardScheduleFootCellStyle
} from './BillingStyles';
import {
    Spacer,
    AsText
} from '@adserve/adserve-react-components';
import moment from 'moment';
import CampaignNumberForwardScheduleCell from './CampaignNumberForwardScheduleCell';

const BillingForwardSchedule = ({
    tableData = [],
    scheduledAirtime,
    scheduledOffairs,
    scheduledCommission,
    scheduledVat,
    scheduledTotal,
    updateOrderNumber,
    setScheduledAirtime,
    setScheduledOffairs,
    setScheduledCommission,
    setScheduledVat,
    setScheduledTotal
}) => {
    const { formatCurrency, dateFormat } = useContext(SystemSettingsContext);
    const tableRef = useRef(null);
    const [scrollbarHeight] = useState(246);

    useEffect(() => {
        let updatedScheduledAirtime = 0;
        let updatedScheduledOffairs = 0;
        let updatedScheduledCommission = 0;
        let updatedScheduledVat = 0;
        let updatedScheduledTotal = 0;

        for (let i = 0; i < tableData.length; i++) {
            updatedScheduledAirtime += tableData[i].airtimeValue;
            updatedScheduledOffairs += tableData[i].offAirsValue;
            updatedScheduledCommission += tableData[i].commission;
            updatedScheduledVat += tableData[i].vatValue;
            updatedScheduledTotal += tableData[i].total;
        }
        setScheduledAirtime(updatedScheduledAirtime);
        setScheduledOffairs(updatedScheduledOffairs);
        setScheduledCommission(updatedScheduledCommission);
        setScheduledVat(updatedScheduledVat);
        setScheduledTotal(updatedScheduledTotal);
    }, [tableData])

    return (
        <div style={forwardScheduleContainerStyle}>
            <div style={{ marginLeft: 8, paddingTop: 13, paddingBottom: 8 }}>
                <span style={landingTitleStyle}>Forward Schedule</span>
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
               <div style={{ height:322, maxHeight: 742, overflow: 'hidden auto' }}>
                    <table ref={tableRef} style={forwardScheduleTableStyle}>
                        <thead>
                            <tr>
                                <th
                                    style={{
                                        ...forwardScheduleHeadCellStyle,
                                        width: 150
                                    }}
                                >
                                    <span>
                                        {window.translate('Invoice Status')}
                                    </span>

                                    <div
                                        align='right'
                                        style={{
                                            ...forwardScheduleFootCellStyle,
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
                                                'Total Scheduled'
                                            )}
                                        </span>
                                    </div>
                                </th>

                                <th
                                    style={{
                                        ...forwardScheduleHeadCellStyle,
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
                                            ...forwardScheduleFootCellStyle,
                                            marginTop:
                                                255 +
                                                (scrollbarHeight - 246)
                                        }}
                                    />
                                </th>

                                <th
                                    style={{
                                        ...forwardScheduleHeadCellStyle,
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
                                            ...forwardScheduleFootCellStyle,
                                            marginTop:
                                                255 +
                                                (scrollbarHeight - 246)
                                        }}
                                    />
                                </th>

                                <th
                                    style={{
                                        ...forwardScheduleHeadCellStyle,
                                        width: 130,
                                        zIndex: 100
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
                                            ...forwardScheduleFootCellStyle,
                                            marginTop:
                                                246 +
                                                (scrollbarHeight - 246)
                                        }}
                                    />
                                </th>

                                <th
                                    style={{
                                        ...forwardScheduleHeadCellStyle,
                                        width: 120
                                    }}
                                >
                                    <span>
                                        {window.translate('Est. Airtime')}
                                    </span>

                                    <div
                                        align='right'
                                        style={{
                                            ...forwardScheduleFootCellStyle,
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
                                                scheduledAirtime
                                            ) || `£0.00`}
                                        </span>
                                    </div>
                                </th>

                                <th
                                    style={{
                                        ...forwardScheduleHeadCellStyle,
                                        width: 120
                                    }}
                                >
                                    <span>
                                        {window.translate('Est. Off-Airs')}
                                    </span>

                                    <div
                                        align='right'
                                        style={{
                                            ...forwardScheduleFootCellStyle,
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
                                                scheduledOffairs
                                            ) || `£0.00`}
                                        </span>
                                    </div>
                                </th>

                                <th
                                    style={{
                                        ...forwardScheduleHeadCellStyle,
                                        width: 120
                                    }}
                                >
                                    <span>
                                        {window.translate(
                                            'Est. Commission'
                                        )}
                                    </span>

                                    <div
                                        align='right'
                                        style={{
                                            ...forwardScheduleFootCellStyle,
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
                                                scheduledCommission
                                            ) || `£0.00`}
                                        </span>
                                    </div>
                                </th>

                                <th
                                    style={{
                                        ...forwardScheduleHeadCellStyle,
                                        width: 120
                                    }}
                                >
                                    <span>{window.translate('VAT')}</span>

                                    <div
                                        align='right'
                                        style={{
                                            ...forwardScheduleFootCellStyle,
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
                                            {formatCurrency(scheduledVat) ||
                                                `£0.00`}
                                        </span>
                                    </div>
                                </th>

                                <th
                                    style={{
                                        ...forwardScheduleHeadCellStyle,
                                        width: 120
                                    }}
                                >
                                    <span>{window.translate('Total')}</span>

                                    <div
                                        align='right'
                                        style={{
                                            ...forwardScheduleFootCellStyle,
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
                                                scheduledTotal
                                            ) || `£0.00`}
                                        </span>
                                    </div>
                                </th>

                                <th
                                    style={{
                                        ...forwardScheduleHeadCellStyle,
                                        width: 120
                                    }}
                                >
                                    <span>
                                        {window.translate(
                                            'Exp. Issue Date'
                                        )}
                                    </span>

                                    <div
                                        align='right'
                                        style={{
                                            ...forwardScheduleFootCellStyle,
                                            marginTop:
                                                255 +
                                                (scrollbarHeight - 246)
                                        }}
                                    />
                                </th>

                                <th
                                    style={{
                                        ...forwardScheduleHeadCellStyle,
                                        width: 336
                                    }}
                                >
                                    <span>
                                        {window.translate('Campaign')}
                                    </span>

                                    <div
                                        align='right'
                                        style={{
                                            ...forwardScheduleFootCellStyle,
                                            marginTop:
                                                255 +
                                                (scrollbarHeight - 246)
                                        }}
                                    />
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {tableData?.map((fs, i) => (
                                <tr key={`forward-schedule-row-${i}`}>
                                    <td
                                        align='right'
                                        style={forwardScheduleMainCellStyle(
                                            i
                                        )}
                                    >
                                        <span
                                            style={forwardScheduleTextStyle}
                                        >
                                            {fs?.status}
                                        </span>
                                    </td>
                                    <td
                                        align='right'
                                        style={forwardScheduleMainCellStyle(
                                            i
                                        )}
                                    >
                                        <span
                                            style={forwardScheduleTextStyle}
                                        >
                                            {moment(fs?.invoiceDate).format(
                                                dateFormat
                                            )}
                                        </span>
                                    </td>
                                    <td
                                        align='right'
                                        style={forwardScheduleMainCellStyle(
                                            i
                                        )}
                                    >
                                        <span
                                            style={forwardScheduleTextStyle}
                                        >   {moment(fs?.invoiceEndDate).format(
                                            dateFormat
                                        )}</span>
                                    </td>
                                    <td
                                        align='right'
                                        style={{
                                            ...forwardSchedulePoCellStyle(
                                                i
                                            ),
                                            cursor: 'text'
                                        }}
                                    >
                                        <AsText
                                            style={{
                                                width: '94%',
                                                marginTop: 6
                                            }}
                                            inputStyle={{
                                                width: '80%',
                                                height: 2,
                                                border: 'none',
                                                backgroundColor:
                                                    i % 2 === 0
                                                        ? '#FFFBEA'
                                                        : '#FFFDF4',
                                                outline: 'none',
                                                zIndex: 10
                                            }}
                                            onChange={(e) =>
                                                updateOrderNumber(
                                                    i,
                                                    e.target.value
                                                )
                                            }
                                            value={fs?.orderNumber}
                                        />
                                    </td>
                                    <td
                                        align='right'
                                        style={forwardScheduleMainCellStyle(
                                            i
                                        )}
                                    >
                                        <span
                                            style={forwardScheduleTextStyle}
                                        >
                                            {formatCurrency(
                                                fs?.airtimeValue
                                            )}
                                        </span>
                                    </td>
                                    <td
                                        align='right'
                                        style={forwardScheduleMainCellStyle(
                                            i
                                        )}
                                    >
                                        <span
                                            style={forwardScheduleTextStyle}
                                        >
                                            {formatCurrency(
                                                fs?.offAirsValue
                                            )}
                                        </span>
                                    </td>
                                    <td
                                        align='right'
                                        style={forwardScheduleMainCellStyle(
                                            i
                                        )}
                                    >
                                        <span
                                            style={forwardScheduleTextStyle}
                                        >
                                            {formatCurrency(fs?.commission)}
                                        </span>
                                    </td>
                                    <td
                                        align='right'
                                        style={forwardScheduleMainCellStyle(
                                            i
                                        )}
                                    >
                                        <span
                                            style={forwardScheduleTextStyle}
                                        >
                                            {formatCurrency(fs?.vatValue)}
                                        </span>
                                    </td>
                                    <td
                                        align='right'
                                        style={forwardScheduleMainCellStyle(
                                            i
                                        )}
                                    >
                                        <span
                                            style={forwardScheduleTextStyle}
                                        >
                                            {formatCurrency(fs?.total)}
                                        </span>
                                    </td>
                                    <td
                                        align='right'
                                        style={forwardScheduleMainCellStyle(
                                            i
                                        )}
                                    >
                                        <span
                                            style={forwardScheduleTextStyle}
                                        >
                                            {fs?.issueDate.substr(0, 10)}
                                        </span>
                                    </td>
                                    <td
                                        align='right'
                                        style={{
                                            ...forwardScheduleMainCellStyle(
                                                i
                                            ),
                                            paddingRight: 29
                                        }}
                                    >
                                        <CampaignNumberForwardScheduleCell
                                            data={fs}
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
                                        <tr key={`invoices-issued-${j}`}>
                                            <td
                                                align='right'
                                                style={forwardScheduleMainCellStyle(
                                                    j
                                                )}
                                            ></td>
                                            <td
                                                align='right'
                                                style={forwardScheduleMainCellStyle(
                                                    j
                                                )}
                                            ></td>
                                            <td
                                                align='right'
                                                style={forwardScheduleMainCellStyle(
                                                    j
                                                )}
                                            ></td>
                                            <td
                                                align='right'
                                                style={forwardScheduleMainCellStyle(
                                                    j
                                                )}
                                            ></td>
                                            <td
                                                align='right'
                                                style={forwardScheduleMainCellStyle(
                                                    j
                                                )}
                                            ></td>
                                            <td
                                                align='right'
                                                style={forwardScheduleMainCellStyle(
                                                    j
                                                )}
                                            ></td>
                                            <td
                                                align='right'
                                                style={forwardScheduleMainCellStyle(
                                                    j
                                                )}
                                            ></td>
                                            <td
                                                align='right'
                                                style={forwardScheduleMainCellStyle(
                                                    j
                                                )}
                                            ></td>
                                            <td
                                                align='right'
                                                style={forwardScheduleMainCellStyle(
                                                    j
                                                )}
                                            ></td>
                                            <td
                                                align='right'
                                                style={forwardScheduleMainCellStyle(
                                                    j
                                                )}
                                            ></td>
                                            <td
                                                align='right'
                                                style={forwardScheduleMainCellStyle(
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

export default BillingForwardSchedule;
