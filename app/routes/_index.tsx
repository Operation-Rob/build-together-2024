import type { LoaderFunctionArgs } from '@remix-run/cloudflare';
import { json, useLoaderData } from '@remix-run/react';

export async function loader({ context }: LoaderFunctionArgs) {
	return json({
		content: { hello: 'world' },
	});
}

export default function Index() {
	const { content } = useLoaderData<typeof loader>();

	return <pre>{JSON.stringify(content, null, 2)}</pre>;
}
