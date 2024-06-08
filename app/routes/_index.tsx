// File: routes/index.tsx
import { json, LoaderFunction } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { Link } from '@remix-run/react';
import Call from '~/components/Call';
interface LoaderData {
  phoneNumber: string;
}

export const loader: LoaderFunction = async (): Promise<Response> => {
  // Simulating fetching data, e.g., a phone number
  const phoneNumber = "+61466250468";
  return json({ phoneNumber });
};

export default function Index() {
const { phoneNumber } = useLoaderData<LoaderData>();

return (
	<div>
		<Call phoneNumber={phoneNumber} />
	</div>
);
}
