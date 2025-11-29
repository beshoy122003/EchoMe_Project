import React from "react";
import { FaVideo } from "react-icons/fa";
import { motion } from "framer-motion";

const GenerateButton = ({ isLoading, onClick }) => (
  <div className="mt-8">   
    <motion.button
      onClick={onClick}
      className="w-full bg-purple-600 text-white py-3 rounded-xl text-lg shadow-lg hover:bg-purple-700 transition flex items-center justify-center gap-2"
      whileTap={{ scale: 0.95 }}
    >
      {isLoading ? (
        <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-6 w-6"></div>
      ) : (
        <>
          <FaVideo /> Generate Video
        </>
      )}
    </motion.button>
  </div>
);

export default GenerateButton;
