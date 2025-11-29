import React, { useState } from 'react';

function SubmitPanel() {
  const [lang, setLang] = useState('auto');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      alert('Submitted successfully!');
    }, 2000);
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700">Select Language</label>
      <select
        value={lang}
        onChange={(e) => setLang(e.target.value)}
        className="mt-1 block w-full text-sm border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
      >
        <option value="auto">Auto</option>
        <option value="en">English</option>
        <option value="ar">Arabic</option>
        <option value="ja">Japanese</option>
      </select>
      <button
        onClick={handleSubmit}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        disabled={loading}
      >
        {loading ? 'Processing...' : 'Submit'}
      </button>
    </div>
  );
}

export default SubmitPanel;