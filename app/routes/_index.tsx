import type { LoaderFunctionArgs } from '@remix-run/cloudflare';
import { json, useLoaderData } from '@remix-run/react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import type { Country } from 'react-phone-number-input';

import Map from '~/components/Map';
import Transcript from '~/components/Transcript';

import { Button } from '~/components/ui/button';
import { PhoneInput } from '~/components/ui/phone-inputs';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectLabel, SelectItem } from '~/components/ui/select';
import { tasks } from '~/lib/task';

export async function loader({ context }: LoaderFunctionArgs) {
	return json({
		content: { hello: 'world' },
	});
}
export default function Index() {
	const form = useForm();
	const onSubmit = () => {};
	const [_, setCountry] = useState<Country>();
	const [phoneNumber, setPhoneNumber] = useState('');
  return (
    <div className="grid h-screen grid-cols-2 grid-rows-2 overflow-hidden">
      <div className="m-9">
        <div>
          <h1 className="text-4xl lg:text-5xl tracking-tight">
            Start your Simulation 🚑
          </h1>
          <p className="my-6 leading-7">
            When you're ready to get started, select a persona and enter your
            phone number below.
          </p>
        </div>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col items-start space-y-8"
        >
          <div className="grid grid-cols-2 gap-5">
            <PhoneInput
              name="phoneNumber"
              value={phoneNumber}
              onChange={v => setPhoneNumber(v?.toString() ?? '')}
              onCountryChange={setCountry}
              placeholder="Enter a phone number"
            />
            <Select name="persona">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a persona" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Select a persona</SelectLabel>
                  {Object.entries(tasks).map(([id, task]) => (
                    <SelectItem key={id} value={id}>
                      {task.title}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <Button type="submit">Submit</Button>
        </form>
      </div>
      <div className="border-4 border-indigo-500 col-span-1 row-span-2 overflow-hidden">
        <Map />
      </div>
	  <div className="">
		
        <Transcript callId="69"/>

      </div>
    </div>
  );
}