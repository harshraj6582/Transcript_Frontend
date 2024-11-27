import React, { useState } from 'react';
import { AlertCircle, Upload, Youtube, Globe, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Alert, AlertDescription } from '../components/ui/alert';
import axios from 'axios';
import TranscriptionResult from './TranscriptionResult';

const TranscriptionService = () => {
  const [selectedFeature, setSelectedFeature] = useState('audioUrl');
  const [inputValue, setInputValue] = useState('');
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userPrompt, setUserPrompt] = useState('');

  const features = [
    { id: 'audioUrl', label: 'Remote Audio URL', icon: Globe },
    { id: 'localAudio', label: 'Local Audio File', icon: Upload },
    { id: 'youtube', label: 'YouTube Video', icon: Youtube },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    if (selectedFeature === 'localAudio' && !file) {
        setError('No file selected.');
        setLoading(false);
        return;
    }

    const timeoutId = setTimeout(() => {
        setLoading(false);
        setError('Request timed out. Please try again.');
    }, 3000000); // 300 seconds

    try {
        let response;
        const requestData = { user_prompt: userPrompt };

        if (selectedFeature === 'audioUrl') {
            requestData.audio_url = inputValue;
            response = await axios.post('http://127.0.0.1:8000/api/test/whisper-remote/', requestData);
        } else if (selectedFeature === 'localAudio') {
            const formData = new FormData();
            formData.append('audio_file', file);
            formData.append('user_prompt', userPrompt);
            response = await axios.post(
                'http://127.0.0.1:8000/api/test/whisper-local/',
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );
        } else if (selectedFeature === 'youtube') {
            requestData.youtube_url = inputValue;
            response = await axios.post('http://127.0.0.1:8000/api/test/youtube/', requestData);
        }
        clearTimeout(timeoutId); // Clear the timeout if the request is successful
        setResult(response.data);
    } catch (err) {
      console.error('Error:', err.message);
      setError('Failed to process the request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text mb-4">
            Audio Transcription Service
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Convert your audio to text using our advanced transcription service. 
            Support for remote audio files, local uploads, and YouTube videos.
          </p>
        </div>

        <div className="grid md:grid-cols-[1fr,1.5fr] gap-8">
          <Card className="h-fit">
            <CardHeader>
              <CardTitle>Select Input Method</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {features.map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => {
                      setSelectedFeature(id);
                      setInputValue('');
                      setFile(null);
                      setError(null);
                      setResult(null);
                    }}
                    className={`flex items-center gap-4 p-4 rounded-lg transition-all ${
                      selectedFeature === id
                        ? 'bg-blue-50 border-2 border-blue-500 text-blue-700'
                        : 'border-2 border-gray-200 hover:border-blue-200 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className={selectedFeature === id ? 'text-blue-500' : 'text-gray-400'} />
                    <span className="font-medium">{label}</span>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Input Details</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {selectedFeature === 'audioUrl' && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        Audio URL
                      </label>
                      <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="https://example.com/audio.mp3"
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                      />
                    </div>
                  )}

                  {selectedFeature === 'localAudio' && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        Audio File
                      </label>
                      <div className="border-2 border-dashed rounded-lg p-6 text-center">
                        <input
                          type="file"
                          onChange={(e) => setFile(e.target.files[0])}
                          className="hidden"
                          accept="audio/*"
                          id="audio-upload"
                        />
                        <label
                          htmlFor="audio-upload"
                          className="cursor-pointer flex flex-col items-center gap-2"
                        >
                          <Upload className="h-8 w-8 text-gray-400" />
                          <span className="text-sm text-gray-600">
                            {file ? file.name : 'Click to upload or drag and drop'}
                          </span>
                        </label>
                      </div>
                    </div>
                  )}

                  {selectedFeature === 'youtube' && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        YouTube Video ID
                      </label>
                      <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="e.g., dQw4w9WgXcQ"
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                      />
                    </div>
                  )}

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      User Prompt
                    </label>
                    <input
                      type="text"
                      value={userPrompt}
                      onChange={(e) => setUserPrompt(e.target.value)}
                      placeholder="Enter your prompt here..."
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                    />
                  </div>

                  {error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <button
                    type="submit"
                    disabled={loading || (selectedFeature !== 'localAudio' && !inputValue) || (selectedFeature === 'localAudio' && !file)}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 rounded-lg font-medium 
                             hover:from-blue-600 hover:to-purple-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed
                             flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      'Start Transcription'
                    )}
                  </button>
                </form>
              </CardContent>
            </Card>

            {result && (
              <Card>
                <CardHeader>
                  <CardTitle>Transcription Result</CardTitle>
                </CardHeader>
                <CardContent>
                  <TranscriptionResult result={result} />
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TranscriptionService;