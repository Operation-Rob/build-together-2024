import axios from 'axios';
import type { Task } from '~/lib/task';

export const makeCall = async (
	phoneNumber: string,
	{ task }: Task,
): Promise<string> => {
	const headers = {
		Authorization: import.meta.env.VITE_BLAND_AI_KEY,
	};

	const data = {
		phone_number: phoneNumber,
		from: null,
		task,
		model: 'enhanced',
		language: 'en-AU',
		voice: 'tina',
		voice_settings: {},
		local_dialing: false,
		max_duration: 12,
		answered_by_enabled: false,
		wait_for_greeting: false,
		record: false,
		amd: false,
		interruption_threshold: 200,
		block_interruptions: True,
		temperature: 0.3,
		transfer_list: {},
		metadata: {},
		pronunciation_guide: [],
		start_time: null,
		request_data: {},
		tools: [],
		webhook: null,
		calendly: {},
	};

	const response = await axios.post('https://api.bland.ai/v1/calls', data, {
		headers,
	});
	return response.data.call_id;
};
