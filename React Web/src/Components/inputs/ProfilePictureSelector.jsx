import React, { useState, useRef, useEffect } from 'react';
import { LuUser, LuUpload, LuTrash } from 'react-icons/lu';

const ProfilePictureSelector = ({ onChange }) => {
  const inputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState(null); // Used for displaying image preview
  const [selectedImage, setSelectedImage] = useState(null); // Stores the selected image file

  // Clean up URL when the component is unmounted or when the previewUrl changes
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl); // Clean up the URL when the image is removed
      }
    };
  }, [previewUrl]);

  // Handle image selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedImage(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      onChange(file); // Call parent component's onChange to handle the file
    } else {
      console.error("Selected file is not an image");
    }
  };

  // Handle image removal
  const handleRemoveImage = () => {
    setSelectedImage(null);
    setPreviewUrl(null);
  };

  // Open file picker dialog
  const onChooseFile = () => {
    inputRef.current.click();
  };

  return (
    <div className="flex flex-col items-center justify-center mb-6">
      {/* Profile Picture Preview */}
      <div className="relative mb-4">
        {previewUrl ? (
          <img
            src={previewUrl}
            alt="Profile Preview"
            className="w-24 h-24 rounded-full object-cover"
          />
        ) : (
          <div className="w-24 h-24 rounded-full border-2 border-gray-300 flex items-center justify-center">
            <LuUser size={40} className="text-gray-500" />
          </div>
        )}

        {/* Remove Image Button */}
        {previewUrl && (
          <button
            onClick={handleRemoveImage}
            className="absolute bottom-0 right-0 bg-red-500 p-1 rounded-full text-white hover:cursor-pointer"
          >
            <LuTrash size={16} />
          </button>
        )}
      </div>

      {/* File Input */}
      <input
        type="file"
        ref={inputRef}
        className="hidden"
        accept="image/*"
        onChange={handleImageChange}
      />

      {/* Choose File Button */}
      <button
        type="button"
        onClick={onChooseFile}
        className="bg-violet-600 text-white py-2 px-2 rounded-lg flex items-center gap-2 hover:bg-violet-700 transition cursor-pointer"
      >
        <LuUpload size={18} />
        Choose a Photo
      </button>
    </div>
  );
};

export default ProfilePictureSelector;
