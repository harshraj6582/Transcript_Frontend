import React, { useState } from 'react';

const SummaryPrompt = () => {
    const [prompt, setPrompt] = useState('');
    const [summary, setSummary] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://127.0.0.1:8000/api/generate-summary/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ prompt }), // Send the user prompt
            });

            if (response.ok) {
                const data = await response.json();
                setSummary(data.summary); // Assuming the response contains the summary
            } else {
                console.error('Failed to generate summary');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div className="summary-prompt">
            <form onSubmit={handleSubmit} className="flex flex-col items-center">
                <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Enter your custom prompt here..."
                    className="border rounded p-2 mb-4 w-full"
                    rows="4"
                />
                <button type="submit" className="bg-blue-500 text-white rounded p-2">
                    Generate Summary
                </button>
            </form>
            {summary && (
                <div className="mt-4 p-4 border rounded bg-white">
                    <h2 className="text-2xl font-bold">Generated Summary:</h2>
                    <p>{summary}</p>
                </div>
            )}
        </div>
    );
};

export default SummaryPrompt;