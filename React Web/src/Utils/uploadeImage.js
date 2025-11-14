import { API_PATHS } from './apiPathes';
import axiosInstance from './axiosInstance';

const uploadImage = async (imageFile) => {
    const formData = new FormData();
    // Append image file to form data
    formData.append('image', imageFile);
    try {
        const response = await axiosInstance.post(API_PATHS.IMAGE.UPLOADE_IMAGE, formData, {
            headers: {
                'Content-Type': 'multipart/form-data', // Set header for file upload
            },
        });
        return response.data; // Return response data
    } catch (error) {
        console.error("Error uploading the image:", error);
        if (error.response) {
            console.error("Response data:", error.response.data);
            console.error("Response status:", error.response.status);
            console.error("Response headers:", error.response.headers);
        } else if (error.request) {
            console.error("Request made but no response received:", error.request);
        } else {
            console.error("Error setting up the request:", error.message);
        }
        throw error;
    }
    
};

export default uploadImage;