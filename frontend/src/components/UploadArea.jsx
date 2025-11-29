import React, { useRef, useState } from "react";
import { FaUpload } from "react-icons/fa";
import { motion } from "framer-motion";

const UploadArea = ({ setFaceImage }) => {
  const fileRef = useRef(null);
  const [preview, setPreview] = useState(null);
  const [filename, setFilename] = useState("No file selected");

  const handleClick = () => {
    fileRef.current.click();
  };

  const handleFile = (file) => {
    if (file) {
      setFaceImage(file); // يروح للـ App.jsx
      setFilename(file.name);

      // preview للصورة
      const url = URL.createObjectURL(file);
      setPreview(url);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    handleFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      handleFile(file);
    }
  };

  const handleDragOver = (e) => e.preventDefault();

  return (
    <motion.div
      className="p-6 bg-white bg-opacity-10 backdrop-blur-xl rounded-lg shadow-lg border border-gray-700"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.25 }}
    >
      <h2 className="text-xl font-semibold text-gray-200 mb-4">Upload Face Image</h2>

      <div
        className="border-2 border-dashed border-gray-500 rounded-lg p-4 text-center cursor-pointer hover:bg-gray-800"
        onClick={handleClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <FaUpload className="text-3xl text-purple-500 mx-auto mb-2" />
        <p className="text-gray-400 mb-2">Drag & drop or click to upload</p>

        <p className="text-sm text-purple-300">{filename}</p>

        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      {preview && (
        <img
          src={preview}
          alt="Preview"
          className="mt-4 max-w-xs rounded-lg border border-gray-700 shadow-lg"
        />
      )}
    </motion.div>
  );
};

export default UploadArea;
