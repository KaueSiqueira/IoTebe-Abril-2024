import React  from "react";
import { Modal } from "reactstrap";

function IoTebeModal({
    children,
    title,
    showModal,
    style,
    className,
    onDismissTitle,
    dismissFunc,
    toggleModal,
    disabledConfirm,
    onConfirm,
    onConfirmTitle,
    fontFamily,
    onConfirmStyle,
    backdrop = true,
    zIndex
}){

    return <Modal zIndex={zIndex} backdrop={backdrop} isOpen={showModal} style={style} toggle={toggleModal} className={className} centered>
        <div className="divSpot" onMouseEnter={() => {}} style={{
            fontFamily: fontFamily || "helvetica, sans-serif",
        }}>  
            {title && (    
                <h3 className="modalTitle" style={{
                    color: "#6b6b6b",
                    fontWeight: 700,
                    minHeight: "28px",
                    alignItems: "center",
                    display: "flex",
                }}>
                    {title}
                </h3>
            )}

            <hr className="modalLine"/>
            
            <div style={{
                padding: "4px 16px",
                marginTop: "10px",
                fontWeight: "450",
                lineHeight: "1.4",
                color: "#747575"
            }}>
                {children}
            </div>

            {(onDismissTitle || onConfirm) && (
                <div className="buttonsDiv">
                    {onDismissTitle && (
                    <button className="rounded-button-outlined" cancel={true} onClick={dismissFunc ? dismissFunc : toggleModal}>
                        {onDismissTitle}
                    </button>)}

                    {onConfirm && (
                    <button className="rounded-button" style={{
                        marginLeft: "10px",
                        ...onConfirmStyle
                    }} onClick={onConfirm} disabled={disabledConfirm}>
                        {onConfirmTitle}
                    </button>)}
                </div>
            )}
        </div>
    </Modal>
}

export default IoTebeModal