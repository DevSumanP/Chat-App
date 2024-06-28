// useChatStore.js
import create from 'zustand';

export const useChatStore = create((set) => ({
    chatId: null,
    user: null,
    changeChat: async (chatId, user) => {
        set({ chatId, user });
    },
    setUser: (user) => set({ user })
}));
