export type Task = { task: string; title: string };

export const tasks: Record<string, Task> = {
	fallen: {
		title: "Help I've fallen",
		task: "You are to simulate a person going through an emergency, so that we may practise emergency dispatching in a simulated, real time environment. Act like someone in an emergency, be frantic when you speak. The place where you live is outside the perth busport on wellington street, but don't say this unless i explicitly ask where you are.",
	},
	simpsons: {
		title: 'Hit and Run',
		task: '',
	},
	robbery: {
		title: 'A robbery',
		task: '',
	},
	discipline: {
		title: 'Discipline my child',
		task: '',
	},
};
