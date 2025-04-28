import React from "react";

const Modal = ({ children, isOpen, onClose, title }) => {
    if (!isOpen) return null; // Don't render if modal is closed

    return (
        <div className="fixed top-0 right-0 left-0 z-50  z-50 flex justify-center items-center w-full h-[calc(100%-1rem)] max-h-full overflow-y-auto overflow-x-hidden bg-black/50 bg-opacity-50">
            <div className="relative p-4 w-full max-w-2xl max-h-full bg-white rounded-lg shadow-lg">
                {/* Modal Header */}
                <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600 border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray">{title}</h3>
                    <button 
                        type="button" 
                        className="text-gray-400 rounded-lg text-sm w-8 h-8 inline-flex justify-center dark:hover:bg-red-400 dark:hover:text-white cursore-pointer items-center transition duration-200"
                        onClick={onClose}
                    >
                        ✖
                    </button>
                </div>

                {/* Modal Body */}
                <div className="p-4 md:p-5 space-y-4">{children}</div>
            </div>
        </div>
    );
};

export default Modal;
