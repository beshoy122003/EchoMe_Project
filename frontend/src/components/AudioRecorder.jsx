import React, { useState, useRef } from "react";
import { FaMicrophone, FaStop } from "react-icons/fa";
import { motion } from "framer-motion";

const AudioRecorder = ({ setAudioFile, audioURL, setAudioURL }) => {
  const [recording, setRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const chunks = useRef([]);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    mediaRecorderRef.current = new MediaRecorder(stream);

    mediaRecorderRef.current.ondataavailable = (e) => {
      chunks.current.push(e.data);
    };

    mediaRecorderRef.current.onstop = () => {
      const blob = new Blob(chunks.current, { type: "audio/wav" });

      // ⬅️ ده الملف اللي الباك محتاجه
      const file = new File([blob], "recorded.wav", {
        type: "audio/wav",
      });

      setAudioFile(file); // ⬅️ مهم جداً — هيروح لـ App.jsx
      setAudioURL(URL.createObjectURL(blob)); // preview فقط

      chunks.current = [];
    };

    mediaRecorderRef.current.start();
    setRecording(true);
  };

  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    setRecording(false);
  };

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold text-gray-200 mb-4">
        Record Your Question
      </h2>

      <div className="flex gap-4">
        <motion.button
          onClick={startRecording}
          disabled={recording}
          className="flex items-center gap-2 bg-purple-600 text-white px-5 py-2 rounded-lg shadow hover:bg-purple-700 transition disabled:bg-gray-500"
          whileTap={{ scale: 0.95 }}
        >
          <FaMicrophone /> Start
        </motion.button>

        <motion.button
          onClick={stopRecording}
          disabled={!recording}
          className="flex items-center gap-2 bg-red-600 text-white px-5 py-2 rounded-lg shadow hover:bg-red-700 transition disabled:bg-gray-500"
          whileTap={{ scale: 0.95 }}
        >
          <FaStop /> Stop
        </motion.button>
      </div>

      {audioURL && (
        <audio controls src={audioURL} className="mt-4 w-full" />
      )}
    </div>
  );
};

export default AudioRecorder;
