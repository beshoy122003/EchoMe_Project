import React, { useState, useRef } from 'react';

function Recorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState(null);
  const mediaRecorder = useRef(null);
  const audioChunks = useRef([]);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder.current = new MediaRecorder(stream);

    mediaRecorder.current.ondataavailable = (event) => {
      audioChunks.current.push(event.data);
    };

    mediaRecorder.current.onstop = () => {
      const audioBlob = new Blob(audioChunks.current, { type: 'audio/wav' });
      setAudioURL(URL.createObjectURL(audioBlob));
      audioChunks.current = [];
    };

    mediaRecorder.current.start();
    setIsRecording(true);
  };

  const stopRecording = () => {
    mediaRecorder.current.stop();
    setIsRecording(false);
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700">Record Audio</label>
      <div className="mt-2">
        {!isRecording ? (
          <button
            onClick={startRecording}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Start Recording
          </button>
        ) : (
          <button
            onClick={stopRecording}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Stop Recording
          </button>
        )}
      </div>
      {audioURL && (
        <audio controls className="mt-4">
          <source src={audioURL} type="audio/wav" />
          Your browser does not support the audio element.
        </audio>
      )}
    </div>
  );
}

export default Recorder;