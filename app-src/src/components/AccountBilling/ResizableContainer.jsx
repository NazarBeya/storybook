import React, { useState, useEffect, useRef } from 'react';

const ResizableContainer = ({
    height,
    maxHeight,
    childRef,
    ref,
    setScrollbarHeight,
    scrollOffset = 0,
    scrollPx = 0,
    ...props
}) => {
    const [childDims, setChildDims] = useState({});
    const draggableRef = useRef(null);
    const [draggableDims, setDraggableDims] = useState({});
    const [dragging, setDragging] = useState(false);
    const [containerHeight, setContainerHeight] = useState(height);

    const mup = () => {
        setDragging(false);
        document.removeEventListener('mouseup', mup);
        document.removeEventListener('mousemove', mmove);
    };
    const mmove = (e) => {
        e.preventDefault();
        if (dragging) {
            let calculatedHeight = e?.pageY - childDims?.top;
            calculatedHeight =
                calculatedHeight < height
                    ? height
                    : calculatedHeight > maxHeight
                    ? maxHeight
                    : calculatedHeight;
            if (calculatedHeight >= height && calculatedHeight <= maxHeight) {
                setContainerHeight(calculatedHeight);
            }
            if (setScrollbarHeight) {
                setScrollbarHeight(calculatedHeight - scrollOffset);
            };
        }
    };

    useEffect(() => {
        if (childRef?.current !== null) {
            setChildDims(childRef?.current?.getBoundingClientRect());
        }
    }, [childRef?.current]);

    useEffect(() => {
        if (draggableRef?.current !== null) {
            setDraggableDims(draggableRef?.current?.getBoundingClientRect());
        }
    }, [draggableRef?.current]);

    useEffect(() => {
        if (dragging) {
            document.addEventListener('mouseup', mup);
            document.addEventListener('mousemove', mmove);
        } else {
            document.removeEventListener('mouseup', mup);
            document.removeEventListener('mousemove', mmove);
        }
    }, [dragging]);

    useEffect(() => {
        if (draggableRef?.current !== null) {
            draggableRef?.current?.scroll(0, scrollPx);
        }
        if (ref?.current !== null) {
            ref?.current?.scroll(0, scrollPx);
        }
    }, [scrollPx]);

    return (
        <>
            <div
                style={{
                    position: 'absolute',
                    marginLeft: childDims?.width - 22,
                    marginTop: containerHeight - 21,
                    zIndex: 256,
                    width: 50
                }}
            >
                <svg width='100%' preserveAspectRatio='xMaxYMin meet'>
                    <line
                        strokeWidth={2}
                        stroke={'#D7D7D7'}
                        x1={5}
                        y1={20}
                        x2={21}
                        y2={5}
                    ></line>
                    <line
                        strokeWidth={2}
                        stroke={'#D7D7D7'}
                        x1={10}
                        y1={20}
                        x2={21}
                        y2={10}
                    ></line>
                    <line
                        strokeWidth={2}
                        stroke={'#D7D7D7'}
                        x1={15}
                        y1={20}
                        x2={21}
                        y2={15}
                    ></line>
                </svg>
            </div>
            <div
                ref={ref || draggableRef}
                style={{
                    height: containerHeight,
                    cursor: 'pointer',
                    ...props.style
                }}
            >
                <div
                    onMouseDown={(e) => {
                        e.preventDefault();
                        setDragging(true);
                    }}
                    ref={draggableRef}
                    style={{
                        position: 'absolute',
                        height: 20,
                        width: 20,
                        border: '1px solid #E3E3E3',
                        marginTop: containerHeight - 23,
                        marginLeft: childDims?.width - 22,
                        zIndex: 512
                    }}
                />
                {props.children}
            </div>
        </>
    );
};

export default ResizableContainer;
