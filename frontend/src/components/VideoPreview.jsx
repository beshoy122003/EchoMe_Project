import React from "react";

const VideoPreview = ({ videoURL }) => (
  videoURL && (
    <div className="mt-8">
      <h2 className="text-xl font-semibold text-gray-200 mb-4">Your Generated Video</h2>
      
      <video controls className="w-full rounded-lg shadow-lg">
        <source src={videoURL} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

    </div>
  )
);

export default VideoPreview;
