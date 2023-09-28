import {
    ScrollableArea,
    StripedTable,
    StripedTableCell,
    StripedTableHead,
    ScrollbarSvg
} from '@adserve/adserve-react-components';
import React, { useRef, useState } from 'react';
import {
    transactionHeadCellStyle,
    transactionTableStyle,
    scrollbarStyle,
    standardScrollbarStyle
} from './BillingStyles';
import TransactionTableCell from './TransactionTableCell';
import TransactionTotalsFooterCell from './TransactionTotalsFooterCell';

const TransactionDataTable = ({ item }) => {
    console.log('li ', item?.lineItems);
    const tableHeadRef = useRef(null);
    const tableBodyRef = useRef(null);
    const tableFootRef = useRef(null);
    const scrollableAreaRef = useRef(null);

    const [scrollPx, setScrollPx] = useState(0);
    const [hightlighted, setHightlighted] = useState(-1);

    const viewPortHeight = 507; // 494 in design, -2 for top and bottom gutter borders.

    const itemCount = item?.lineItems?.length || 0;

    const scrollbarHeight = 63;

    const handleScroll = (val) => {
        setScrollPx(val);
        scrollableAreaRef?.current?.scroll(0, val);
    };

    return (
        <>
            <div
                style={{
                    position: 'absolute',
                    height: 1,
                    width: 1561,
                    backgroundColor: '#D7D7D7'
                }}
            />
            <div
                style={{
                    position: 'absolute',
                    marginTop: 50,
                    height: 1,
                    width: 1561,
                    backgroundColor: '#D7D7D7',
                    zIndex: 9000
                }}
            />
            <div
                style={{
                    position: 'absolute',
                    marginTop: 49,
                    height: 1,
                    width: 1561,
                    backgroundColor: 'white',
                    zIndex: 9000
                }}
            />
            <ScrollableArea
                ref={scrollableAreaRef}
                width='100%'
                scrollPx={scrollPx}
                onScroll={setScrollPx}
                height={
                    viewPortHeight +
                    (tableHeadRef.current?.scrollHeight || 40) +
                    (tableFootRef.current?.scrollHeight || 34)
                }
                scrollableLength={
                    (item.lineItems?.length
                        ? 34 * item.lineItems?.length
                        : viewPortHeight) - 1
                }
                maxVisibleLength={viewPortHeight}
                scrollSpeed={16}
            >
                <table style={transactionTableStyle}>
                    <StripedTableHead id='table-head' ref={tableHeadRef}>
                        <tr id='table-head-row'>
                            <th style={transactionHeadCellStyle}>
                                Off-Air Types
                            </th>

                            <th style={transactionHeadCellStyle}>
                                Description
                            </th>

                            <th style={transactionHeadCellStyle}>
                                Net
                            </th>

                            <th style={transactionHeadCellStyle}>Commission</th>

                            <th style={transactionHeadCellStyle}>VAT</th>

                            <th
                                style={{
                                    ...transactionHeadCellStyle,
                                    width: 192
                                }}
                            >
                                Total
                            </th>
                        </tr>
                    </StripedTableHead>

                    <tbody ref={tableBodyRef} id='table-body'>
                        {item?.lineItems?.map((oa, i) => (
                            <tr key={`lineitem-${i}`}>
                                <TransactionTableCell
                                    index={i}
                                    onHover={setHightlighted}
                                    highlighted={hightlighted}
                                    scrollPx={scrollPx}
                                    style={{
                                        borderLeftWidth: 1,
                                        paddingLeft: 10,
                                        textAlign: 'left'
                                    }}
                                >
                                    {oa.offairType}
                                </TransactionTableCell>

                                <TransactionTableCell
                                    index={i}
                                    onHover={setHightlighted}
                                    highlighted={hightlighted}
                                    scrollPx={scrollPx}
                                    style={{ paddingLeft: 10, textAlign: 'left' }}
                                >
                                    {oa.description}
                                </TransactionTableCell>

                                <TransactionTableCell
                                    index={i}
                                    onHover={setHightlighted}
                                    highlighted={hightlighted}
                                    scrollPx={scrollPx}
                                >
                                    {oa.lineValue}
                                </TransactionTableCell>

                                <TransactionTableCell
                                    index={i}
                                    onHover={setHightlighted}
                                    highlighted={hightlighted}
                                    scrollPx={scrollPx}
                                >
                                    {oa.commission}
                                </TransactionTableCell>

                                <TransactionTableCell
                                    index={i}
                                    onHover={setHightlighted}
                                    highlighted={hightlighted}
                                    scrollPx={scrollPx}
                                >
                                    {oa.vatValue}
                                </TransactionTableCell>

                                <TransactionTableCell
                                    index={i}
                                    end={true}
                                    onHover={setHightlighted}
                                    highlighted={hightlighted}
                                    scrollPx={scrollPx}
                                >
                                    {(oa.lineValue - oa.commission) + oa.vatValue}
                                </TransactionTableCell>
                            </tr>
                        ))}
                        {itemCount < 15
                            ? Array.apply(null, Array(15 - itemCount))
                                .map(function () {
                                    return {};
                                })
                                .map((pr, j) => (
                                    <tr key={`padding-row${j}`}>
                                        <StripedTableCell
                                            id={`padding-row${j}-line-items`}
                                            index={j}
                                            style={{
                                                height: 31,
                                                border: '1px solid #D7D7D7'
                                            }}
                                        />

                                        <StripedTableCell
                                            id={`padding-row${j}-description`}
                                            index={j}
                                            style={{
                                                height: 31,
                                                border: '1px solid #D7D7D7'
                                            }}
                                        />

                                        <StripedTableCell
                                            id={`padding-row${j}-airtime`}
                                            index={j}
                                            style={{
                                                height: 31,
                                                border: '1px solid #D7D7D7'
                                            }}
                                        />

                                        <StripedTableCell
                                            id={`padding-row${j}-commission`}
                                            index={j}
                                            style={{
                                                height: 31,
                                                border: '1px solid #D7D7D7'
                                            }}
                                        />

                                        <StripedTableCell
                                            id={`padding-row${j}-vat`}
                                            index={j}
                                            style={{
                                                height: 31,
                                                border: '1px solid #D7D7D7'
                                            }}
                                        />

                                        <StripedTableCell
                                            id={`padding-row${j}-total`}
                                            index={j}
                                            style={{
                                                height: 31,
                                                border: '1px solid #D7D7D7'
                                            }}
                                        />
                                    </tr>
                                ))
                            : null}
                        <tr ref={tableFootRef} id='table-footer'>
                            <TransactionTotalsFooterCell
                                tableBodyRef={tableBodyRef}
                                tableFootRef={tableFootRef}
                                viewPortHeight={viewPortHeight}
                            />

                            <TransactionTotalsFooterCell
                                tableBodyRef={tableBodyRef}
                                tableFootRef={tableFootRef}
                                viewPortHeight={viewPortHeight}
                            >
                                Total:
                            </TransactionTotalsFooterCell>

                            <TransactionTotalsFooterCell
                                tableBodyRef={tableBodyRef}
                                tableFootRef={tableFootRef}
                                viewPortHeight={viewPortHeight}
                            >
                                {item?.lineItems?.reduce(
                                    (n, { lineValue }) =>
                                        n + lineValue,
                                    0
                                )}
                            </TransactionTotalsFooterCell>

                            <TransactionTotalsFooterCell
                                tableBodyRef={tableBodyRef}
                                tableFootRef={tableFootRef}
                                viewPortHeight={viewPortHeight}
                            >
                                {item?.lineItems?.reduce(
                                    (n, { commission }) => n + commission,
                                    0
                                )}
                            </TransactionTotalsFooterCell>

                            <TransactionTotalsFooterCell
                                tableBodyRef={tableBodyRef}
                                tableFootRef={tableFootRef}
                                viewPortHeight={viewPortHeight}
                            >
                                {item?.lineItems?.reduce(
                                    (n, { vatValue }) => n + vatValue,
                                    0
                                )}
                            </TransactionTotalsFooterCell>

                            <TransactionTotalsFooterCell
                                tableBodyRef={tableBodyRef}
                                tableFootRef={tableFootRef}
                                end={true}
                                viewPortHeight={viewPortHeight}
                            >
                                {item?.lineItems?.reduce(
                                    (
                                        n,
                                        {
                                            lineValue,
                                            commission,
                                            vatValue
                                        }
                                    ) =>
                                        n +
                                        (lineValue -
                                            commission) +
                                        vatValue,
                                    0
                                )}
                            </TransactionTotalsFooterCell>
                        </tr>
                    </tbody>
                </table>
            </ScrollableArea>
            <div style={standardScrollbarStyle}>
                {item?.lineItems?.length > 1 && (
                    <ScrollbarSvg
                        scrollPx={scrollPx}
                        onScroll={handleScroll}
                        maxVisibleLength={464}
                        gutterOffset={200}
                        scrollableLength={
                            scrollableAreaRef?.current?.scrollHeight
                        }
                        disabled={false}
                    />
                )}
            </div>
        </>
    );
};

export default TransactionDataTable;
