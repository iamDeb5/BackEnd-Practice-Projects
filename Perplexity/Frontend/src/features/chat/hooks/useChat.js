import { initializeSocketConnection } from "../service/chat.socket";
import {
  sendMessage,
  getChats,
  getMessages,
} from "../service/chat.api";
import {
  setChats,
  setCurrentChatId,
  setError,
  setLoading,
  createNewChat,
  addNewMessage,
} from "../chat.slice";
import { useDispatch, useSelector } from "react-redux";

export const useChat = () => {
  const dispatch = useDispatch();
  const chats = useSelector((state) => state.chat.chats);

  async function handleSendMessage({ message, chatId }) {
    try {
      dispatch(setLoading(true));
      const data = await sendMessage({ message, chatId });
      const { chat, aiMessage } = data;

      // Only create a new Redux chat entry for genuinely new chats
      if (!chats[chat._id]) {
        dispatch(
          createNewChat({
            chatId: chat._id,
            title: chat.title,
          }),
        );
      }

      dispatch(addNewMessage({ chatId: chat._id, content: message, role: "user" }));
      dispatch(addNewMessage({ chatId: chat._id, content: aiMessage.content, role: aiMessage.role }));
      dispatch(setCurrentChatId(chat._id));
    } catch (error) {
      dispatch(setError(error.response?.data?.message || "Failed to send message"));
    } finally {
      dispatch(setLoading(false));
    }
  }

  async function loadChats() {
    try {
      const data = await getChats();
      // Convert array to object keyed by _id; preserve messages already in Redux
      const chatsMap = {};
      data.chats.forEach((c) => {
        chatsMap[c._id] = {
          id: c._id,
          title: c.title,
          // keep existing messages if already loaded in Redux
          messages: chats[c._id]?.messages ?? [],
          lastUpdated: c.updatedAt,
        };
      });
      dispatch(setChats(chatsMap));
    } catch (err) {
      dispatch(setError("Failed to load chats"));
    }
  }

  async function handleSelectChat(chatId) {
    dispatch(setCurrentChatId(chatId));
    // Lazy-load messages only if we haven't fetched them yet
    if (!chats[chatId] || chats[chatId].messages.length === 0) {
      try {
        const data = await getMessages(chatId);
        data.messages.forEach((msg) => {
          dispatch(addNewMessage({ chatId, content: msg.content, role: msg.role }));
        });
      } catch (err) {
        dispatch(setError("Failed to load messages"));
      }
    }
  }

  function handleNewChat() {
    dispatch(setCurrentChatId(null));
  }

  return {
    initializeSocketConnection,
    handleSendMessage,
    handleNewChat,
    handleSelectChat,
    loadChats,
  };
};
