import React from 'react';
import ReactDOM from 'react-dom';
import { ReactComponent as IconClose } from '../../../svg/icon_close.svg';
import { ReactComponent as IconMinimise } from '../../../svg/Icon_Minus.svg';
import { ReactComponent as IconMaximise } from '../../../svg/Icon_panel_expand.svg';

const ModalHeader = ({
    id,
    title,
    headerStyle,
    showMinimise,
    showMaximise,
    showClose,
    onMinimise,
    onMaximise,
    onClose,
    ...props
}) => {
    const defaultStyle = {
        display: 'flex',
        justifyContent: 'space-between',
        width: '100%',
        ...headerStyle
    };

    return (
        <div {...props} style={defaultStyle}>
            <span id={`${id}-title`}>{title}</span>
            <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                <IconMinimise
                    style={{
                        width: 18,
                        height: 18,
                        cursor: 'pointer',
                        marginRight: 36,
                        alignSelf: 'flex-end',
                        display: showMinimise ? 'unset' : 'none'
                    }}
                    onClick={onMinimise}
                />
                <IconMaximise
                    style={{
                        width: 18,
                        height: 18,
                        cursor: 'pointer',
                        marginRight: 36,
                        display: showMaximise ? 'unset' : 'none'
                    }}
                    onClick={onMaximise}
                />
                <IconClose
                    id={`${id}-close`}
                    style={{
                        width: 24,
                        height: 24,
                        cursor: 'pointer',
                        display: showClose ? 'unset' : 'none'
                    }}
                    viewBox='15 15 25 25'
                    data-dismiss='modal'
                    onClick={onClose}
                />
            </div>
        </div>
    );
};

const Modal = ({
    id = 'modal',
    isShowing,
    hide,
    title,
    modalHeaderStyle,
    modalBodyStyle,
    showMinimise = false,
    showMaximise = false,
    showClose = true,
    ...props
}) => {
    const overlayStyle = {
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 1040,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0,0,0,0.4)'
    };

    const wrapperStyle = {
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 1050,
        width: '100%',
        height: '100%',
        overflowX: 'hidden',
        overflowY: 'auto',
        outline: 0
    };

    const bodyStyle = {
        position: 'fixed',
        boxSizing: 'border-box',
        height: 228,
        width: 595,
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        textAlign: 'center',
        padding: '24px 23px 40px',
        borderRadius: 15,
        backgroundColor: '#FFFFFF',
        boxShadow: '3px 2px 11px 0 rgba(0,0,0,0.33)',
        fontFamily: 'Roboto',
        fontSize: 22,
        fontWeight: 500,
        ...modalBodyStyle
    };

    return isShowing
        ? ReactDOM.createPortal(
              <React.Fragment>
                  <div>
                      <div style={overlayStyle} />
                      <div style={wrapperStyle} tabIndex={-1} role='dialog'>
                          <div style={bodyStyle}>
                              <ModalHeader
                                  id={`${id}-header`}
                                  title={title}
                                  headerStyle={modalHeaderStyle}
                                  showMinimise={showMinimise}
                                  showMaximise={showMaximise}
                                  showClose={showClose}
                                  onClose={hide}
                              />
                              {props.children}
                          </div>
                      </div>
                  </div>
              </React.Fragment>,
              document.body
          )
        : null;
};

export default Modal;
