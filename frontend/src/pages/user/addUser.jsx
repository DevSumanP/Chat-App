import { arrayUnion, collection, doc, getDocs, query, serverTimestamp, setDoc, updateDoc, where } from 'firebase/firestore';
import { useState } from 'react';
import { db } from '../../../../backend/db/firebase';
import './addUser.css';
import { useUserStore } from '../../zustand/useUserStore';

const AddUser = ({ onClose }) => {
  const [user, setUser] = useState(null);
  const { currentUser } = useUserStore();

  const handleSearch = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const username = formData.get("username");

    try {
      const userRef = collection(db, "users"); // Reference to the users collection

      // Create a query against the collection
      const q = query(userRef, where("username", "==", username));

      // Execute the query
      const querySnapshot = await getDocs(q);

      // Process the query results
      if (!querySnapshot.empty) {
        setUser(querySnapshot.docs[0].data());
      } else {
        alert("User not found.");
        setUser(null);
      }
    } catch (err) {
      console.log(err);
      alert("Error searching for user.");
      setUser(null);
    }
  };

  const handleAdd = async () => {
    const chatRef = collection(db, "chats");
    const userChatsRef = collection(db, "userchats");

    try {
      const newChatRef = doc(chatRef);

      await setDoc(newChatRef, {
        createdAt: serverTimestamp(),
        messages: [],
      });

      await updateDoc(doc(userChatsRef, user.id), {
        chats: arrayUnion({
          chatId: newChatRef.id,
          lastMessage: "",
          receiverId: currentUser.id,
          updatedAt: Date.now(),
        }),
      });
      await updateDoc(doc(userChatsRef, currentUser.id), {
        chats: arrayUnion({
          chatId: newChatRef.id,
          lastMessage: "",
          receiverId: user.id,
          updatedAt: Date.now(),
        }),
      });
      console.log(`Chat created with ID: ${newChatRef.id}`);
      setUser(null); // Reset user state after adding the user
      onClose(); // Close the modal
    } catch (err) {
      console.error("Error adding chat: ", err);
    }
  };

  return (
    <div className='addUser'>
      <div className='modalHeader'>
        <h3>Add New Friends</h3>
        <img src="./add.png" alt="" onClick={onClose} />
      </div>
      <form onSubmit={handleSearch}>
        <div className="search">
          <div className="searchBar">
            <input name="username" type="text" placeholder="Search for users.." />
            <button type="submit">
              <img src="/search.png" alt="Search" />
            </button>
          </div>
        </div>
      </form>
      {user && (
        <div className="user">
          <div className="detail">
            <img src={user.avatar || "./avatar.png"} alt="Avatar" />
            <span>{user.username}</span>
          </div>
          <div className="bottom">
            <button onClick={handleAdd}>Add User</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddUser;
