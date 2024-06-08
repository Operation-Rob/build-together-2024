import axios from 'axios';
import { useEffect, useState } from 'react';

interface AiCallProps {
  phoneNumber: string;
}

const pollForCompletion = async (callId: string, setTranscript: React.Dispatch<React.SetStateAction<string>>, setLoading: React.Dispatch<React.SetStateAction<boolean>>, setError: React.Dispatch<React.SetStateAction<string | null>>) => {
  try {
    const headers = { 'Authorization': import.meta.env.VITE_BLAND_AI_KEY };
    const response = await axios.get(`https://api.bland.ai/v1/calls/${callId}`, { headers });
    const data = response.data;

    if (data && data.transcripts) {
      const conversation = data.transcripts.map((item: { user: string; text: string; }) => `${item.user}: ${item.text}`).join('\n');
      setTranscript(conversation); // Update transcript to be just the conversation
    }

    if (!data.completed) {
      setTimeout(() => pollForCompletion(callId, setTranscript, setLoading, setError), 2000); // Re-poll if not completed
    } else {
      setLoading(false); // Stop loading when completed
    }
  } catch (error) {
    console.error('Failed to fetch transcript:', error);
    setError('Failed to fetch transcript');
    setLoading(false);
  }
};

const makeCall = async (phoneNumber: string): Promise<string> => {
  const headers = {
    'Authorization': import.meta.env.VITE_BLAND_AI_KEY
  };


  const data = {
    "phone_number": phoneNumber,
    "from": null,
    "task": "You are to simulate a person going through an emergency, so that we may practise emergency dispatching in a simulated, real time environment. Act like someone in an emergency, be frantic when you speak. The place where you live is outside the perth busport on wellington street, but don't say this unless i explicitly ask where you are.",
    "model": "turbo",
    "language": "en-US",
    "voice": "tina",
    "voice_settings": {},
    "local_dialing": false,
    "max_duration": 12,
    "answered_by_enabled": false,
    "wait_for_greeting": false,
    "record": false,
    "amd": false,
    "interruption_threshold": 110,
    "temperature": 0.5,
    "transfer_list": {},
    "metadata": {},
    "pronunciation_guide": [],
    "start_time": null,
    "request_data": {},
    "tools": [],
    "webhook": null,
    "calendly": {}
  };
  

  const response = await axios.post('https://api.bland.ai/v1/calls', data, { headers });
  return response.data.call_id;
};

const Call = ({ phoneNumber }: AiCallProps) => {
  const [callId, setCallId] = useState<string | null>(null);
  const [transcript, setTranscript] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCall = async () => {
    try {
      setLoading(true);
      setError(null);
      const id = await makeCall(phoneNumber);
      setCallId(id);
      pollForCompletion(id, setTranscript, setLoading, setError);
    } catch (err) {
      console.error('Error initiating call:', err);
      setError('Error initiating call');
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>AI Call and Transcript</h1>
      <button onClick={handleCall} disabled={loading}>Initiate Call</button>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {callId && <p>Call ID: {callId}</p>}
      {transcript && <pre>{transcript}</pre>} {/* Use <pre> for formatted output */}
    </div>
  );
};

export default Call;


