import React, { useState, useEffect, useRef } from 'react';
import { auth, db, googleProvider, signInWithPopup, signOut } from '../firebase';
import { collection, doc, setDoc, onSnapshot, query, where, orderBy, addDoc, serverTimestamp } from 'firebase/firestore';
import './PremiumChat.css';

const PremiumChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [usersList, setUsersList] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [typedMessage, setTypedMessage] = useState('');

  const messagesEndRef = useRef(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        await setDoc(doc(db, "users", currentUser.uid), {
          uid: currentUser.uid,
          displayName: currentUser.displayName,
          photoURL: currentUser.photoURL,
          email: currentUser.email,
          lastSeen: serverTimestamp()
        }, { merge: true });
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, "users"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const users = [];
      snapshot.forEach((doc) => {
        if (doc.id !== user.uid) {
          users.push(doc.data());
        }
      });
      setUsersList(users);
    });
    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    if (!user || !selectedUser) return;
    const chatId = [user.uid, selectedUser.uid].sort().join('_');
    const q = query(
      collection(db, "messages"),
      where("chatId", "==", chatId),
      orderBy("createdAt", "asc")
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedMessages = [];
      snapshot.forEach((doc) => {
        fetchedMessages.push(doc.data());
      });
      setMessages(fetchedMessages);
    });
    return () => unsubscribe();
  }, [user, selectedUser]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Google Login-ի ֆունկցիան՝ սխալների էկրանային ցուցադրմամբ
  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Login Error: ", error);
      alert(`Մուտքի սխալ: ${error.message}\nՍտուգեք՝ արդյոք Firebase-ում միացված է Google Auth-ը։`);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!typedMessage.trim() || !selectedUser) return;
    const chatId = [user.uid, selectedUser.uid].sort().join('_');
    await addDoc(collection(db, "messages"), {
      chatId,
      senderId: user.uid,
      receiverId: selectedUser.uid,
      text: typedMessage.trim(),
      createdAt: serverTimestamp()
    });
    setTypedMessage('');
  };

  return (
    <>
      {/* 💬 Լողացող կոճակը */}
      <button className="premium-chat-trigger" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? '✕' : '💬'}
      </button>

      {/* 🏢 Չատի գլխավոր վահանակը */}
      <div className={`premium-chat-panel ${isOpen ? 'is-open' : ''}`}>
        <div className="chat-panel-header">
          {selectedUser && (
            <button className="chat-back-btn" onClick={() => setSelectedUser(null)}>←</button>
          )}
          <h3>{selectedUser ? selectedUser.displayName : 'Հաղորդագրություններ'}</h3>
          {/* 1. 🎯 Ավելացվեց Գլխավոր Փակելու Կոճակը (✕) */}
          <button className="chat-panel-close-x" onClick={() => setIsOpen(false)}>✕</button>
        </div>

        {!user ? (
          <div className="chat-login-overlay">
            <p className="login-hint-text">
              Մուտք գործեք Google-ով՝ այլ օգտատերերի հետ անհատական չատով կապնվելու համար:
            </p>
            <button className="google-login-btn" onClick={handleLogin}>
              {/* 2. 🎨 Կայուն SVG պատկեր, որը երբեք չի կոտրվի */}
              <svg width="18" height="18" viewBox="0 0 18 18" style={{ marginRight: '10px' }}>
                <path fill="#4285F4" d="M17.64 9.2c0-.63-.06-1.25-.16-1.84H9v3.47h4.84c-.21 1.12-.84 2.07-1.79 2.7v2.24h2.91c1.7-1.56 2.68-3.86 2.68-6.57z"/>
                <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.91-2.24c-.8.54-1.84.87-3.05.87-2.34 0-4.33-1.57-5.03-3.68H.95v2.3A9 9 0 0 0 9 18z"/>
                <path fill="#FBBC05" d="M3.97 10.77c-.18-.54-.28-1.11-.28-1.7 0-.59.1-1.16.28-1.7V5.07H.95A8.996 8.996 0 0 0 0 9c0 1.41.32 2.76.95 3.97l3.02-2.2z"/>
                <path fill="#EA4335" d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.59C13.46.8 11.43 0 9 0 5.48 0 2.45 2.02.95 5.07l3.02 2.3c.7-2.11 2.69-3.79 5.03-3.79z"/>
              </svg>
              Մուտք գործել Google-ով
            </button>
          </div>
        ) : (
          <>
            {!selectedUser ? (
              <div className="chat-users-section">
                <p className="online-users-title">Օնլայն օգտատերեր</p>
                {usersList.length === 0 ? (
                  <p className="no-users-text">Այլ օգտատերեր չկան</p>
                ) : (
                  usersList.map((u) => (
                    <div key={u.uid} className="chat-user-item" onClick={() => setSelectedUser(u)}>
                      <img src={u.photoURL || 'https://via.placeholder.com/40'} alt={u.displayName} className="user-avatar" />
                      <span className="user-name-text">{u.displayName}</span>
                      <div className="user-status-dot"></div>
                    </div>
                  ))
                )}
                <button className="chat-logout-btn" onClick={() => signOut(auth)}>
                  Դուրս գալ հաշվից
                </button>
              </div>
            ) : (
              <div className="active-chat-box">
                <div className="chat-messages-area">
                  {messages.map((msg, index) => (
                    <div key={index} className={`message-bubble ${msg.senderId === user.uid ? 'me' : 'other'}`}>
                      {msg.text}
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
                <form className="chat-input-form" onSubmit={handleSendMessage}>
                  <input 
                    type="text" 
                    className="chat-message-input" 
                    placeholder="Գրեք ձեր նամակը..." 
                    value={typedMessage}
                    onChange={(e) => setTypedMessage(e.target.value)}
                  />
                  <button type="submit" className="chat-send-btn">Ուղարկել</button>
                </form>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default PremiumChat;