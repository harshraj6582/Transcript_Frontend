

// export default App;
import React from 'react';
import TranscriptionService from './components/TranscriptionService';

const App = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 to-blue-50 p-4">
            <h1 className="text-4xl font-bold text-blue-600 mb-8 text-center">
                Transcription Service
            </h1>
            
            <TranscriptionService />
        </div>
    );
};

export default App;
