import axios from 'axios';
import { useEffect, useState } from 'react';

interface TranscriptProps {
  callId: string;
}

const Transcript = ({ callId }: TranscriptProps) => {
    const [messages, setMessages] = useState<{ user: string; text: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const pollForCompletion = async () => {
      try {
        const headers = { 'Authorization': import.meta.env.VITE_BLAND_AI_KEY };
        const response = await axios.get(`https://api.bland.ai/v1/calls/${callId}`, { headers });
        const data = response.data;

        if (data && data.transcripts) {
          const conversation = data?.transcripts?.map((item: { user: string; text: string; }) => ({
            user: item.user,
            text: item.text,
          })) ?? [];
          setMessages(conversation);
        }

        if (!data.completed) {
          setTimeout(pollForCompletion, 2000); // Re-poll if not completed
        } else {
          setLoading(false); // Stop loading when completed
        } 
      } catch (error) {
        console.error('Failed to fetch transcript:', error);
        setError('Failed to fetch transcript');
        setLoading(false);
      }
    };

    pollForCompletion();
  }, [callId]);

  return (
    <>
      <div className="max-w-lg mx-auto">
        <h2 className="text-2xl font-bold mb-4 text-center mt-3">Transcript</h2>
        {!messages.length && <p className="text-gray-500 text-center">Loading transcript...</p>}
        {error && <p className="text-red-500 text-center">Error: {error}</p>}
        {messages.length > 0 && (
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`px-4 py-2 mx-auto max-w-full w-4/5 rounded-lg ${
                  message.user === 'User' ? 'bg-blue-500 text-white' : 'bg-gray-200'
                }`}
              >
                <p className="font-bold">{message.user === 'user' ? 'Emergency Dispatcher' : 'Caller'}</p>
                <p>{message.text}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Transcript;
