import { useEffect, useState } from "react";
import './conversations.css';
import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { useUserStore } from "../../../zustand/useUserStore";
import { db } from "../../../../../backend/db/firebase";
import { useChatStore } from "../../../zustand/chatStore";

const Conversations = () => {
    const [chats, setChats] = useState([]);
    const [selectedChatId, setSelectedChatId] = useState(null); // State to track selected chat
    const { currentUser } = useUserStore();
    const { changeChat } = useChatStore();

    useEffect(() => {
        if (!currentUser?.id) return;

        const unSub = onSnapshot(doc(db, "userchats", currentUser.id), async (res) => {
            const items = res.data()?.chats || [];

            const promises = items.map(async (item) => {
                const userDocRef = doc(db, "users", item.receiverId);
                const userDocSnap = await getDoc(userDocRef);
                const user = userDocSnap.data();
                return { ...item, user };
            });

            const chatData = await Promise.all(promises);
            chatData.sort((a, b) => b.updatedAt - a.updatedAt);
            setChats(chatData);
        });

        return () => {
            unSub();
        };
    }, [currentUser?.id]);

    const handleSelect = async (chat) => {
        if (!currentUser?.id) return;

        const userChatsRef = doc(db, "userchats", currentUser.id);
        const userChatsSnapshot = await getDoc(userChatsRef);

        if (userChatsSnapshot.exists()) {
            const userChats = userChatsSnapshot.data().chats.map(item => {
                // eslint-disable-next-line no-unused-vars
                const { user, ...rest } = item;
                return rest;
            });

            const chatIndex = userChats.findIndex(item => item.chatId === chat.chatId);
            if (chatIndex !== -1) {
                userChats[chatIndex].isSeen = true;

                try {
                    await updateDoc(userChatsRef, { chats: userChats });
                    changeChat(chat.chatId, chat.user);
                    setSelectedChatId(chat.chatId); // Set selected chatId
                } catch (err) {
                    console.error(err);
                }
            }
        }
    };

    if (!currentUser) {
        return null; // Or some loading indicator
    }

    return (
        <div className='conversation_lists'>
            {chats.map((chat) => (
                <div
                    key={chat.chatId}
                    onClick={() => handleSelect(chat)}
                    className={`chatList ${chat.chatId === selectedChatId ? 'selected' : ''} ${!chat.isSeen ? 'unseen' : ''}`}
                >
                    <div className="top">
                        <div className="avatar-wrapper">
                            <img src={chat.user.avatar || './avatar.png'} alt="avatar" />
                            {chat.user.isActive && <div className="active-indicator"></div>}
                        </div>
                        <div className="texts">
                            <span>{chat.user.username}</span>
                            <p className={chat.isSeen ? 'lastMessage-seen' : 'lastMessage-unseen'}>
                                {chat.senderId === currentUser.id ? `${chat.user.username}: ${chat.lastMessage}` : `You: ${chat.lastMessage}`}
                            </p>
                        </div>
                    </div>
                    {!chat.isSeen && <div className="unseen-indicator"></div>}
                </div>
            ))}
        </div>
    );
};

export default Conversations;
