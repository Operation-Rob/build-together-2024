import Transcript from '~/components/Transcript';
import Map from '~/components/Map';

import { useActionData, useParams, useSubmit } from '@remix-run/react';

export default function Index() {
	const params = useParams();

	return (
		<div className="grid h-screen grid-cols-2 grid-rows-2 overflow-hidden">
			<div>{params.callId && <Transcript callId={params.callId!} />}</div>
			<div>
				<Map />
			</div>
			<div>
				<pre></pre>
			</div>
		</div>
	);
}
