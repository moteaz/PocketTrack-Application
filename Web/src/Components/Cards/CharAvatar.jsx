import React from 'react'
import { getInitials } from '../../Utils/Helper';
    const CharAvatar = ({ fullname, width, height, style }) => {
        return (
            <div
                className={`${width || "w-20"} ${height || "h-20"} ${style || ""} flex items-center justify-center rounded-full bg-gray-300  text-gray-900 font-meduim`}
            >
                {getInitials(fullname || "")}
            </div>
        );
    };
    
    export default CharAvatar;


