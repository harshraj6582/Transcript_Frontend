import React from 'react';
import { CheckCircle2, XCircle, FileText, FileSearch, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import ReactMarkdown from 'react-markdown';
import { toast } from 'react-hot-toast';

const TranscriptionResult = ({ result }) => {
  const { transcription_success, transcript, summary, error } = result;

  const copyToClipboard = () => {
    if (summary) {
      try {
        // Fallback method to ensure text is copied regardless of environment
        const textarea = document.createElement('textarea');
        textarea.value = summary;
        textarea.style.position = 'absolute'; // Prevent scrolling to the bottom
        textarea.style.left = '-9999px'; // Hide the textarea off-screen
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy'); // Execute the copy command
        document.body.removeChild(textarea);
  
        // Show success toast notification
        toast.success('Text copied to clipboard!');
      } catch (err) {
        // Handle any unexpected errors
        toast.error('Failed to copy text to clipboard!');
      }
    } else {
      toast.error('No text to copy!');
    }
  };
  

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center gap-3">
        {transcription_success ? (
          <div className="flex items-center gap-2 text-green-600 bg-green-50 px-4 py-2 rounded-full">
            <CheckCircle2 className="h-5 w-5" />
            <span className="font-medium">Transcription Successful</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-red-600 bg-red-50 px-4 py-2 rounded-full">
            <XCircle className="h-5 w-5" />
            <span className="font-medium">Transcription Failed</span>
          </div>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {transcript && (
          <Card className="md:col-span-2">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                <FileText className="h-5 w-5 text-blue-500" />
                Transcript
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-50 p-4 rounded-lg max-h-[400px] overflow-y-auto">
                <p className="text-gray-700 whitespace-pre-wrap font-mono text-sm leading-relaxed">
                  {transcript}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {summary && (
          <Card className="md:col-span-2">
            <CardHeader className="pb-3 flex justify-between items-center">
              <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                <FileSearch className="h-5 w-5 text-purple-500" />
                Summary
              </CardTitle>
              <button 
                onClick={copyToClipboard} 
                className="flex items-center gap-1 text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 px-4 py-2 rounded-md transition transform hover:scale-105"
              >
                <FileText className="h-4 w-4" />
                Copy
              </button>
            </CardHeader>
            <CardContent>
              <div className="bg-purple-50 p-4 rounded-lg">
                <ReactMarkdown className="text-gray-800 font-serif text-lg leading-relaxed">
                  {Array.isArray(summary) ? summary.map(item => `- ${item}`).join('\n') : `- ${summary}`}
                </ReactMarkdown>
              </div>
            </CardContent>
          </Card>
        )}

        {error && (
          <Card className="md:col-span-2 border-red-100">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg font-semibold text-red-600">
                <AlertCircle className="h-5 w-5" />
                Error Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-red-50 p-4 rounded-lg">
                <p className="text-red-600">
                  {error}
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default TranscriptionResult;
