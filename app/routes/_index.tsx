import type { SubmitHandler } from 'react-hook-form';
import { Controller, useForm } from 'react-hook-form';
import { isValidPhoneNumber } from 'react-phone-number-input';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '~/components/ui/button';
import Map from '~/components/Map';
import { PhoneInput } from '~/components/ui/phone-inputs';
import {
	Select,
	SelectTrigger,
	SelectValue,
	SelectContent,
	SelectGroup,
	SelectLabel,
	SelectItem,
} from '~/components/ui/select';
import { tasks } from '~/lib/task';
import { z } from 'zod';

import { useSubmit } from '@remix-run/react';

import type { ActionFunction } from '@remix-run/cloudflare';
import { json } from '@remix-run/cloudflare';
import { makeCall } from '~/components/Call';
import { useTransition } from 'react';

export const action: ActionFunction = async ({ request }) => {
	const formData = await request.formData();
	const submittedData = Object.fromEntries(formData.entries());
	const task = tasks[submittedData.persona.toString()];

	const callId = await makeCall(submittedData.phoneNumber.toString(), task);
	return json({ callId });
};

const formSchema = z.object({
	phoneNumber: z
		.string()
		.refine(isValidPhoneNumber, { message: 'Invalid phone number' })
		.or(z.literal('')),
	persona: z.string(),
});

type FormSchema = z.infer<typeof formSchema>;

export default function Index() {
	const form = useForm<FormSchema, unknown, FormSchema>({
		resolver: zodResolver(formSchema),
	});

	const submit = useSubmit();

	const onSubmit: SubmitHandler<z.output<typeof formSchema>> = data => {
		console.log({ data });
		const formData = new FormData();
		formData.append('phoneNumber', data.phoneNumber);
		formData.append('persona', data.persona);
		submit(formData, { method: 'post', navigate: false });
	};

	return (
		<div className="grid h-screen grid-cols-2">
			<div className="m-9 h-full ">
				<h1 className="scroll-m-20 text-4xl  tracking-tight lg:text-5xl">
					Start your Simulation 🚑
				</h1>
				<p className="my-6 leading-7 ">
					When you're ready to get started, select a persona and enter your
					phone number below.
				</p>

				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="flex flex-col items-start space-y-8"
				>
					<div className="grid grid-cols-2 gap-5">
						<Controller
							control={form.control}
							name="phoneNumber"
							render={({ field }) => {
								return (
									<PhoneInput {...field} placeholder="Enter a phone number" />
								);
							}}
						/>
						<Controller
							name="persona"
							control={form.control}
							render={({ field }) => (
								<Select onValueChange={field.onChange} value={field.value}>
									<SelectTrigger className="w-[180px]">
										<SelectValue placeholder="Select a persona" />
									</SelectTrigger>
									<SelectContent>
										<SelectGroup>
											<SelectLabel>Select a persona</SelectLabel>
											{Object.entries(tasks).map(([id, task]) => {
												return (
													<SelectItem key={id} value={id}>
														{task.title}
													</SelectItem>
												);
											})}
										</SelectGroup>
									</SelectContent>
								</Select>
							)}
						/>
					</div>
					<Button type="submit">Submit</Button>
				</form>
			</div>
			<div className="h-full border-4 border-indigo-500/100">
				<Map />
			</div>
		</div>
	);
}
