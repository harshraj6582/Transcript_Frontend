import React, { useState } from 'react';
import axios from 'axios';
import TranscriptionResult from './TranscriptionResult';

const UploadYouTubeUrl = () => {
    const [videoId, setVideoId] = useState('');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!videoId.trim()) {
            setError('Please enter a valid YouTube Video ID.');
            return;
        }

        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const response = await axios.post('http://127.0.0.1:8000/api/test/youtube/', {
                video_id: videoId.trim(),
            });
            setResult(response.data);
        } catch (err) {
            console.error('Error uploading YouTube Video ID:', err.message);
            setError('Failed to process the YouTube Video ID. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 to-blue-50 p-4">
            <h1 className="text-3xl font-bold text-blue-600 mb-6 text-center">
                YouTube Video Transcription
            </h1>
            <form
                onSubmit={handleSubmit}
                className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md"
            >
                <label
                    htmlFor="videoIdInput"
                    className="block text-gray-700 text-sm font-medium mb-2"
                >
                    Enter YouTube Video ID:
                </label>
                <input
                    id="videoIdInput"
                    type="text"
                    value={videoId}
                    onChange={(e) => setVideoId(e.target.value)}
                    placeholder="e.g., dQw4w9WgXcQ"
                    className="border border-gray-300 p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-400 mb-4"
                />
                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                    disabled={loading || !videoId.trim()}
                >
                    {loading ? 'Processing...' : 'Submit'}
                </button>
            </form>
            {result && (
                <div className="mt-6 w-full max-w-md bg-white p-6 rounded-lg shadow-lg">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">
                        Transcription Result:
                    </h2>
                    <TranscriptionResult result={result} />
                </div>
            )}
        </div>
    );
};

export default UploadYouTubeUrl;
