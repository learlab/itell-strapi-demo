import { LogMessage } from "@itell/react-console-viewer";
import { createStoreWithProducer } from "@xstate/store";
import produce from "immer";

export const store = createStoreWithProducer(
	produce,
	{
		entities: {} as Record<
			string,
			{
				logs: LogMessage[];
			}
		>,
	},
	{
		register: (context, event: { id: string }) => {
			context.entities[event.id] = {
				logs: [],
			};
		},
		addLog: (context, event: { id: string; log: LogMessage }) => {
			context.entities[event.id].logs = [
				...context.entities[event.id].logs,
				event.log,
			];
		},
		setLogs: (context, event: { id: string; logs: LogMessage[] }) => {
			context.entities[event.id].logs = event.logs;
		},
		clearLogs: (context, event: { id: string }) => {
			context.entities[event.id].logs = [];
		},
	},
);
