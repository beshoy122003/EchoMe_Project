import React from 'react';

function VideoPlayer() {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700">Generated Video</label>
      <video controls className="mt-2 w-full max-w-md border rounded">
        <source src="" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
        Download Video
      </button>
    </div>
  );
}

export default VideoPlayer;