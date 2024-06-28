import { useEffect, useState } from 'react';
import './App.css';
import Login from './pages/login/Login';
import SignUp from './pages/signup/SignUp';
import { Toaster } from 'react-hot-toast';  // Import Toaster component

// Fonts
import './assets/fonts/Manrope-Light.ttf';
import './assets/fonts/Manrope-Bold.ttf';
import './assets/fonts/Manrope-Medium.ttf';
import './assets/fonts/Manrope-Regular.ttf';
import './assets/fonts/Manrope-SemiBold.ttf';

import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../backend/db/firebase';
import { useUserStore } from './zustand/useUserStore';
import Chat from './components/chat/Chat';
import List from './components/list/List';
import Detail from './components/detail/Detail';
import { useChatStore } from './zustand/chatStore';

function App() {
  const { isLoading, fetchUserInfo, currentUser } = useUserStore();
  const [currentView, setCurrentView] = useState('login'); // State to track current view
  const { chatId } = useChatStore();

  useEffect(() => {
    const unSub = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchUserInfo(user?.uid);
      }
    });

    return () => {
      unSub();
    };
  }, [fetchUserInfo]);

  if (isLoading) return <div className="Loading">Loading.....</div>;

  return (
    <div className="container">
      <Toaster position="top-right" reverseOrder={false} /> {/* Add Toaster component */}
      {currentUser ? (
        <>
          <List />
          {chatId && <Chat />}
          {chatId && <Detail />}
        </>
      ) : (
        <div className="App">
          {currentView === 'login' ? (
            <Login onSwitchToSignUp={() => setCurrentView('signup')} />
          ) : (
            <SignUp onSwitchToLogin={() => setCurrentView('login')} />
          )}
        </div>
      )}
    </div>
  );
}

export default App;
