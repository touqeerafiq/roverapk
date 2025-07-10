import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  receiverId: string;
  text: string;
  timestamp: string;
  read: boolean;
  mediaUrl?: string;
  mediaType?: 'image' | 'video';
}

interface Conversation {
  id: string;
  participants: string[];
  lastMessage?: Message;
  unreadCount: number;
  bookingId?: string;
}

interface MessagesState {
  conversations: Conversation[];
  activeConversation: string | null;
  messages: Record<string, Message[]>; // Keyed by conversationId
  isLoading: boolean;
  error: string | null;
}

const initialState: MessagesState = {
  conversations: [],
  activeConversation: null,
  messages: {},
  isLoading: false,
  error: null,
};

const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    fetchConversationsStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchConversationsSuccess: (state, action: PayloadAction<Conversation[]>) => {
      state.isLoading = false;
      state.conversations = action.payload;
      state.error = null;
    },
    fetchConversationsFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    fetchMessagesStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchMessagesSuccess: (state, action: PayloadAction<{ conversationId: string; messages: Message[] }>) => {
      state.isLoading = false;
      state.messages[action.payload.conversationId] = action.payload.messages;
      state.error = null;
    },
    fetchMessagesFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    setActiveConversation: (state, action: PayloadAction<string>) => {
      state.activeConversation = action.payload;
      // Mark messages as read when conversation is opened
      const conversation = state.conversations.find(c => c.id === action.payload);
      if (conversation) {
        conversation.unreadCount = 0;
      }
      if (state.messages[action.payload]) {
        state.messages[action.payload] = state.messages[action.payload].map(message => ({
          ...message,
          read: true
        }));
      }
    },
    addMessage: (state, action: PayloadAction<Message>) => {
      const { conversationId } = action.payload;
      if (!state.messages[conversationId]) {
        state.messages[conversationId] = [];
      }
      state.messages[conversationId].push(action.payload);
      
      // Update conversation with last message
      const conversationIndex = state.conversations.findIndex(c => c.id === conversationId);
      if (conversationIndex !== -1) {
        state.conversations[conversationIndex].lastMessage = action.payload;
        // Increment unread count if not the active conversation
        if (state.activeConversation !== conversationId) {
          state.conversations[conversationIndex].unreadCount += 1;
        }
      }
    },
    addConversation: (state, action: PayloadAction<Conversation>) => {
      state.conversations.push(action.payload);
      state.messages[action.payload.id] = [];
    },
    clearActiveConversation: (state) => {
      state.activeConversation = null;
    },
  },
});

export const {
  fetchConversationsStart,
  fetchConversationsSuccess,
  fetchConversationsFailure,
  fetchMessagesStart,
  fetchMessagesSuccess,
  fetchMessagesFailure,
  setActiveConversation,
  addMessage,
  addConversation,
  clearActiveConversation,
} = messagesSlice.actions;

export default messagesSlice.reducer;