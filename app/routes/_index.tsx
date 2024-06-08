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
import { ActionFunction, json } from '@remix-run/cloudflare';
import { useTransition } from 'react';
import { useActionData, useSubmit } from '@remix-run/react';

const formSchema = z.object({
	phoneNumber: z
		.string()
		.refine(isValidPhoneNumber, { message: 'Invalid phone number' })
		.or(z.literal('')),
	persona: z.string(),
});

export const action: ActionFunction = async ({ request }) => {
	console.log({ request });
	// Process form data and perform necessary actions
	return json({ success: true });
};

type FormSchema = z.infer<typeof formSchema>;

export default function Index() {
	const form = useForm<FormSchema, unknown, FormSchema>({
		resolver: zodResolver(formSchema),
	});

	const actionData = useActionData();
	const transition = useTransition();
	const submit = useSubmit();

	const onSubmit: SubmitHandler<z.output<typeof formSchema>> = data => {
		submit(data);
	};

	const isSubmitting =
		transition.state === 'loading' || transition.state === 'submitting';

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
					{actionData && actionData.success && (
						<p>Form submitted successfully!</p>
					)}
				</form>
			</div>
			<div className="h-full border-4 border-indigo-500/100">
				<Map />
			</div>
		</div>
	);
}
