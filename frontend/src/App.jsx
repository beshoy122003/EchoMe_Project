// App.jsx
import React, { useState, useRef } from "react";
import axios from "axios";
import HeroTitle from "./components/HeroTitle";
import UploadArea from "./components/UploadArea";
import VoiceCloneUpload from "./components/VoiceCloneUpload";
import AudioRecorder from "./components/AudioRecorder";
import GenerateButton from "./components/GenerateButton";
import VideoPreview from "./components/VideoPreview";

const API_URL = "http://localhost:8000";

export default function App() {
  const [faceImage, setFaceImage] = useState(null);
  const [voiceCloneFile, setVoiceCloneFile] = useState(null);
  const [audioFile, setAudioFile] = useState(null);
  const [audioURL, setAudioURL] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [videoURL, setVideoURL] = useState(null);

  const mediaRecorderRef = useRef(null);
  const chunks = useRef([]);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorderRef.current = new MediaRecorder(stream);
    mediaRecorderRef.current.ondataavailable = (e) => chunks.current.push(e.data);

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

  const generateVideo = async () => {
    if (!faceImage || !voiceCloneFile || !audioFile) {
      alert("Please upload image + audio + voice clone!");
      return;
    }

    setIsLoading(true);

    const form = new FormData();
    form.append("image", faceImage);
    form.append("audio", audioFile);
    form.append("voice_clone", voiceCloneFile);

    try {
      const res = await axios.post(`${API_URL}/process`, form);
      const videoPath = res.data.video_path;

      const videoResponse = await axios({
        url: `${API_URL}/video`,
        method: "GET",
        params: { path: videoPath },
        responseType: "arraybuffer",
      });

      const blob = new Blob([videoResponse.data], { type: "video/mp4" });
      setVideoURL(URL.createObjectURL(blob));
    } catch (err) {
      console.error(err);
      alert("Error generating video");
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen text-white">
      <main className="flex flex-col items-center py-12">
        <HeroTitle />

        <div className="max-w-3xl w-full mt-12">
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
