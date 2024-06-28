import { useEffect, useRef, useState } from "react";
import "./chat.css";
import EmojiPicker from "emoji-picker-react";
import { arrayUnion, doc, getDoc, onSnapshot, setDoc, updateDoc } from "firebase/firestore";
import { db, storage } from "../../../../backend/db/firebase"; // Assuming storage is imported for image uploads
import { useChatStore } from "../../zustand/chatStore";
import { useUserStore } from "../../zustand/useUserStore";

const Chat = () => {
    const [open, setOpen] = useState(false);
    const [text, setText] = useState("");
    const [chat, setChat] = useState(null);
    const [img, setImg] = useState({
        file: null,
        url: "",
    });
    const { chatId, user } = useChatStore();
    const { currentUser } = useUserStore();
    const endRef = useRef(null);

    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [chat]);

    useEffect(() => {
        if (!chatId) return;

        const unSub = onSnapshot(doc(db, "chats", chatId), (res) => {
            setChat(res.data());
        });

        return () => {
            unSub();
        };
    }, [chatId]);

    const handleImage = (e) => {
        if (e.target.files[0]) {
            setImg({
                file: e.target.files[0],
                url: URL.createObjectURL(e.target.files[0]),
            });
        }
    };

    const handleEmoji = (e) => {
        setText((prev) => prev + e.emoji);
        setOpen(false);
    };

    const handleSubmit = async () => {
        if (text.trim() === "" && !img.file) return;

        let imgUrl = null;

        try {
            if (img.file) {
                imgUrl = await uploadImage(img.file); // Upload image and get URL
            }

            const newMessage = {
                senderId: currentUser.id,
                text,
                createdAt: new Date(),
                img: imgUrl, // Include imgUrl if it exists
            };

            await updateDoc(doc(db, "chats", chatId), {
                messages: arrayUnion(newMessage),
            });

            const userIDs = [currentUser.id, user.id];
            for (const id of userIDs) {
                const userChatsRef = doc(db, "userchats", id);
                const userChatsSnapshot = await getDoc(userChatsRef);

                if (userChatsSnapshot.exists()) {
                    const userChatsData = userChatsSnapshot.data();
                    const chatIndex = userChatsData.chats.findIndex(c => c.chatId === chatId);

                    if (chatIndex !== -1) {
                        userChatsData.chats[chatIndex].lastMessage = text;
                        userChatsData.chats[chatIndex].isSeen = id === currentUser.id;
                        userChatsData.chats[chatIndex].updatedAt = new Date();

                        await updateDoc(userChatsRef, {
                            chats: userChatsData.chats,
                        });
                    } else {
                        userChatsData.chats.push({
                            chatId,
                            lastMessage: text,
                            isSeen: id === currentUser.id,
                            updatedAt: new Date(),
                        });

                        await updateDoc(userChatsRef, {
                            chats: userChatsData.chats,
                        });
                    }
                } else {
                    await setDoc(userChatsRef, {
                        chats: [{
                            chatId,
                            lastMessage: text,
                            isSeen: id === currentUser.id,
                            updatedAt: new Date(),
                        }],
                    });
                }
            }

            setText("");
            setImg({
                file: null,
                url: "",
            });
        } catch (error) {
            console.error(error);
        }
    };

    const uploadImage = async (imageFile) => {
        try {
            const storageRef = storage.ref();
            const fileRef = storageRef.child(`chat_images/${imageFile.name}`);
            await fileRef.put(imageFile);
            return await fileRef.getDownloadURL();
        } catch (error) {
            console.error("Error uploading image:", error);
            throw error;
        }
    };

    return (
        <div className="chat">
            <>
                <div className="top">
                    <div className="user">
                        <img src={user?.avatar || "./avatar.png"} alt="avatar" />
                        <div className="texts">
                            <span>{user?.username}</span>
                            <p>{user?.email}</p>
                        </div>
                    </div>
                    <div className="icons">
                        <img src="./Phone.png" alt="phone icon" />
                        <img src="./VideoCamera.png" alt="video icon" />
                        <img src="./MagnifyingGlass.png" alt="video icon" />
                        <img src="./CaretDown.png" alt="info icon" />
                    </div>
                </div>
                <div className="center">
                    {chat?.messages.map((message, index) => (
                        <div
                            className={`message-container ${message.senderId === currentUser.id ? 'me' : 'them'}`}
                            key={index}
                        >
                            <div className="message-content">
                                <div className="message-bubble">
                                   
                                    <p className="message-text">{message.text}</p>
                                </div>
                                <div className="message-header">
                                    <span className="message-time">{new Date(message.createdAt.seconds * 1000).toLocaleTimeString()}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                    <div ref={endRef}></div>
                </div>
                <div className="bottom">
                    <div className="search-box">
                        <label htmlFor="file">
                            <img src="./attachment.png" alt="attachment icon" />
                        </label>
                        <input type="file" id="file" style={{ display: "none" }} onChange={handleImage} />

                        <input type="text" placeholder="Type a Message" value={text} onChange={(e) => setText(e.target.value)} />
                        <div className="emoji">
                            <img src="./face.png" alt="emoji icon" onClick={() => setOpen((prev) => !prev)} />
                            {open && (
                                <div className="picker">
                                    <EmojiPicker onEmojiClick={handleEmoji} />
                                </div>
                            )}
                        </div>
                        <div className="sendButton">
                            <img src="./send.png" alt="send icon" onClick={handleSubmit} />
                        </div>
                    </div>
                    
                </div>
            </>
        </div>
    );
};

export default Chat;
