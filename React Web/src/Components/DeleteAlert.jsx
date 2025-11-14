import React from 'react';

const DeleteAlert = ({ content, onDelete }) => {
    return (
        <div>
            <p className="text-sm">{content}</p>
            <div className="flex justify-end mt-6">
                <button
                    type="button"
                    className="flex items-center gap-2 justify-center w-30 bg-violet-600 text-white py-2 rounded-lg hover:bg-violet-400 hover:text-violet-700 transition cursor-pointer"
                    onClick={onDelete}
                >
                    Delete
                </button>
            </div>
        </div>
    );
};

export default DeleteAlert;