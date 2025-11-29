import React, { useRef, useState } from "react";
import { FaUpload } from "react-icons/fa";
import { motion } from "framer-motion";

const VoiceCloneUpload = ({ setVoiceCloneFile }) => {
  const fileRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleClick = () => {
    fileRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file.name);
      setVoiceCloneFile(file);
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file && file.type.startsWith("audio/")) {
      setSelectedFile(file.name);
      setVoiceCloneFile(file);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  return (
    <motion.div
      className="p-6 bg-white bg-opacity-10 backdrop-blur-xl rounded-lg shadow-lg border border-purple-500"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.25 }}
    >
      <h2 className="text-xl font-semibold text-gray-200 mb-4">
        Upload Voice Clone Audio
      </h2>

      <div
        className="border-2 border-dashed border-purple-500 rounded-lg p-4 text-center cursor-pointer hover:bg-purple-900 hover:bg-opacity-20"
        onClick={handleClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <FaUpload className="text-3xl text-purple-500 mx-auto mb-2" />
        <p className="text-gray-400 mb-1">Drag & drop or click to upload</p>

        {/* Show selected file name */}
        <p className="text-sm text-purple-300">
          {selectedFile || "No file selected"}
        </p>

        <input
          ref={fileRef}
          type="file"
          accept="audio/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>
    </motion.div>
  );
};

export default VoiceCloneUpload;
