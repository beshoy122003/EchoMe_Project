// App.jsx
import React, { useState, useRef } from "react";
import axios from "axios";

// Components
import HeroTitle from "./components/HeroTitle";
import UploadArea from "./components/UploadArea";
import VoiceCloneUpload from "./components/VoiceCloneUpload";
import AudioRecorder from "./components/AudioRecorder";
import GenerateButton from "./components/GenerateButton";
import VideoPreview from "./components/VideoPreview";

const API_URL = import.meta.env.VITE_API_URL;

export default function App() {
  const [faceImage, setFaceImage] = useState(null);
  const [voiceCloneFile, setVoiceCloneFile] = useState(null);
  const [audioFile, setAudioFile] = useState(null);
  const [audioURL, setAudioURL] = useState(null);

  const [isLoading, setIsLoading] = useState(false);
  const [videoURL, setVideoURL] = useState(null);

  const mediaRecorderRef = useRef(null);
  const chunks = useRef([]);


  // ----------------------------
  // Audio Recording Logic
  // ----------------------------
  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    mediaRecorderRef.current = new MediaRecorder(stream);

    mediaRecorderRef.current.ondataavailable = (e) => {
      chunks.current.push(e.data);
    };

    mediaRecorderRef.current.onstop = () => {
      const blob = new Blob(chunks.current, { type: "audio/wav" });
      const file = new File([blob], "recorded.wav", { type: "audio/wav" });

      setAudioFile(file);
      setAudioURL(URL.createObjectURL(blob));
      chunks.current = [];
    };

    mediaRecorderRef.current.start();
  };

  const stopRecording = () => {
    mediaRecorderRef.current.stop();
  };


  // ----------------------------
  // Generate Video
  // ----------------------------
  const generateVideo = async () => {
    if (!faceImage || !voiceCloneFile || !audioFile) {
      alert("Please upload image, voice clone, and record audio!");
      return;
    }

    setIsLoading(true);

    const form = new FormData();
    form.append("image", faceImage);
    form.append("audio", audioFile);
    form.append("voice_clone", voiceCloneFile);
    form.append("lang", "auto");

    try {
      // STEP 1 — POST /process
      const res = await axios.post(`${API_URL}/process`, form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const videoPath = res.data.video_path;

      // STEP 2 — GET /video (fixed version!)
      const videoResponse = await axios({
        url: `${API_URL}/video`,
        method: "GET",
        params: { path: videoPath },
        responseType: "arraybuffer",
        headers: {
          Accept: "video/mp4",
        },
      });

      const blob = new Blob([videoResponse.data], { type: "video/mp4" });
      const url = URL.createObjectURL(blob);

      setVideoURL(url);
    } catch (error) {
      console.error("Video Generation Error:", error);
      alert("Error generating video. Check console.");
    }

    setIsLoading(false);
  };


  // ----------------------------
  // Render UI
  // ----------------------------
  return (
    <div className="min-h-screen bg-transparent text-white">
      <main className="flex flex-col items-center justify-center py-12">
        <HeroTitle />

        <div className="mt-12 w-full max-w-3xl">
          <UploadArea setFaceImage={setFaceImage} />
          <VoiceCloneUpload setVoiceCloneFile={setVoiceCloneFile} />

          <AudioRecorder
            setAudioFile={setAudioFile}
            audioURL={audioURL}
            setAudioURL={setAudioURL}
            startRecording={startRecording}
            stopRecording={stopRecording}
          />

          <GenerateButton isLoading={isLoading} onClick={generateVideo} />

          <VideoPreview videoURL={videoURL} />
        </div>
      </main>
    </div>
  );
}
