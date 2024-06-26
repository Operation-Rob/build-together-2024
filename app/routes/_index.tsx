import type { SubmitHandler } from 'react-hook-form';
import { Controller, useForm } from 'react-hook-form';
import { isValidPhoneNumber } from 'react-phone-number-input';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '~/components/ui/button';
import { PhoneInput } from '~/components/ui/phone-inputs';
import {
	Select,
	SelectTrigger,
	SelectValue,
	SelectContent,
	SelectItem,
	SelectPopover,
} from '~/components/ui/select';
import { tasks } from '~/lib/task';
import { z } from 'zod';

import { useSubmit, useNavigation } from '@remix-run/react';

import type { ActionFunction, TypedResponse } from '@remix-run/cloudflare';
import { redirect } from '@remix-run/cloudflare';
import { makeCall } from '~/components/Call';
import { ButtonLoading } from '~/components/ui/loading-button';

export const action: ActionFunction = async ({
	request,
}): Promise<TypedResponse<{ response: { callId: string } }>> => {
	const formData = await request.formData();
	const submittedData = Object.fromEntries(formData.entries());
	const task = tasks[submittedData.persona.toString()];

	const callId = await makeCall(submittedData.phoneNumber.toString(), task);

	return redirect(`/calls/${callId}`);
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

	const onSubmit: SubmitHandler<z.output<typeof formSchema>> = async data => {
		console.log({ data });
		const formData = new FormData();
		formData.append('phoneNumber', data.phoneNumber);
		formData.append('persona', data.persona);

		await submit(formData, { method: 'post', navigate: false });
	};

	const navigation = useNavigation();

	const isLoading = navigation.state !== 'idle';

	const options = Object.entries(tasks).map(([id, task]) => ({
		name: task.title,
		value: id,
	}));

	return (
		<div className="grid h-screen grid-cols-1 grid-rows-2 overflow-hidden bg-gradient-to-r from-blue-500 to-purple-600">
			<div className="m-9 flex flex-col justify-center">
				<h1 className="text-5xl font-bold tracking-tight text-white lg:text-6xl">
					Start your Simulation 🚑
				</h1>
				<p className="my-6 text-xl leading-8 text-white">
					When you're ready to get started, select a persona and enter your
					phone number below.
				</p>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="flex flex-col items-start space-y-8"
				>
					<div className="grid grid-cols-1 gap-5 md:grid-cols-2">
						<Controller
							control={form.control}
							name="phoneNumber"
							render={({ field }) => {
								return (
									<PhoneInput
										{...field}
										placeholder="Enter a phone number"
										className="w-full rounded-lg bg-white p-4 text-gray-800 shadow-md"
									/>
								);
							}}
						/>
						<Controller
							name="persona"
							control={form.control}
							render={({ field }) => {
								return (
									<Select
										className="rounded-lg rounded-e-lg  bg-white p-4 text-gray-800 shadow-md"
										placeholder="Select an item"
										aria-label="item selection"
										selectedKey={field.value}
										onSelectionChange={v => {
											return field.onChange(v);
										}}
									>
										<SelectTrigger className="w-[180px]">
											<SelectValue />
										</SelectTrigger>
										<SelectPopover>
											<SelectContent aria-label="items" items={options}>
												{item => (
													<SelectItem id={item.value} textValue={item.name}>
														{item.name}
													</SelectItem>
												)}
											</SelectContent>
										</SelectPopover>
									</Select>
								);
							}}
						/>
					</div>
					{isLoading ? (
						<ButtonLoading />
					) : (
						<Button
							type="submit"
							className="rounded-lg bg-white px-6 py-3 text-lg font-semibold text-blue-600 shadow-md transition duration-300 ease-in-out hover:bg-blue-100"
						>
							Submit
						</Button>
					)}
				</form>
			</div>
		</div>
	);
}
