import { useState } from 'react';
import { useForm } from 'react-hook-form';
import type { Country } from 'react-phone-number-input';

import { Button } from '~/components/ui/button';

import { PhoneInput } from '~/components/ui/phone-inputs';
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from '~/components/ui/select';
import { tasks } from '~/lib/task';

export default function Index() {
	const form = useForm();
	const onSubmit = () => {};
	const [_, setCountry] = useState<Country>();
	const [phoneNumber, setPhoneNumber] = useState('');

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
					</div>
					<Button type="submit">Submit</Button>
				</form>
			</div>
			<div className="h-full border-4 border-indigo-500/100">foo</div>
		</div>
	);
}
