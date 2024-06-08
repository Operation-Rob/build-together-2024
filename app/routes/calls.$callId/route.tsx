import Transcript from '~/components/Transcript';
import Map from '~/components/Map';

import { useParams } from '@remix-run/react';
import { useEffect, useState } from 'react';

export default function Index() {
	const params = useParams();
	const [timer, setTimer] = useState(0);

	useEffect(() => {
		let interval;

		interval = setInterval(() => {
			setTimer(prevTimer => prevTimer + 0.1);
		}, 100);

		return () => clearInterval(interval);
	}, []);

	return (
		<div className="grid h-screen grid-cols-2 grid-rows-2 overflow-hidden">
			<div>{params.callId && <Transcript callId={params.callId!} />}</div>
			<div className="h-full">
				<Map renderAmbulance={true} />
				<div>Timer: {timer.toFixed(2)} seconds</div>
			</div>
			<div>
				<pre></pre>
			</div>
		</div>
	);
}
