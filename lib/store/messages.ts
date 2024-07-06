import { create } from 'zustand'

export type Imessage = {
	created_at: string;
	id: string;
	is_edit: boolean;
	send_by: string;
	text: string;
	users: {
		avatar_url: string;
		created_at: string;
		display_name: string;
		id: string;
	} | null;
};

interface MessagesState {
  messages: Imessage[];
  actionMessage: Imessage | undefined;
	optimiticsIds: string[];
  addMessage:(message: Imessage) => void;
  setActionMessage: (message: Imessage | undefined) => void;
	optimisticDeleteMessage: (messageId: string) => void;
	optimisticUpdateMessage: (message: Imessage) => void;
	setOptimisticIds: (id: string) => void;
}

export const useMessages = create<MessagesState>()((set) => ({
  messages: [],
  actionMessage: undefined,
	optimiticsIds: [],
  addMessage: (newMessages) =>
		set((state) => ({
			messages: [...state.messages, newMessages],
			optimiticsIds: [...state.optimiticsIds, newMessages.id]
		})),
  setActionMessage: (message) => set(() => ({ actionMessage: message })),
	optimisticDeleteMessage: (messageId) => set((state) => {
		return {
			messages: state.messages.filter((message) => message.id !== messageId)
		}
	}),
	optimisticUpdateMessage: (updateMessage) => set((state) => {
		return {
			messages: state.messages.filter((message) => {
				if (message.id === updateMessage.id) {
					message.text = updateMessage.text,
					message.is_edit = updateMessage.is_edit
				}
				return message;
			})
		}
	}),
	setOptimisticIds: (id: string) => set((state) => ({ optimiticsIds: [...state.optimiticsIds, id]})),
}))
