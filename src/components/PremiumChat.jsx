import React, { useState, useEffect, useRef } from 'react';
import { auth, db, googleProvider, signInWithPopup, signOut } from '../firebase';
import { 
  collection, doc, setDoc, onSnapshot, query, where, orderBy, 
  addDoc, serverTimestamp, updateDoc, getDoc 
} from 'firebase/firestore';
import './PremiumChat.css';

const servers = {
  iceServers: [
    { urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302'] },
  ],
  iceCandidatePoolSize: 10,
};

const PremiumChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [usersList, setUsersList] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [typedMessage, setTypedMessage] = useState('');

  // 📞 Call States
  const [callState, setCallState] = useState('idle'); 
  const [currentCallId, setCurrentCallId] = useState(null);
  const [callType, setCallType] = useState(null);
  const [incomingCallData, setIncomingCallData] = useState(null);
  const [callPartner, setCallPartner] = useState(null);
  
  // 🔔 Notifications States
  const [unreadMessages, setUnreadMessages] = useState({});
  const [missedCallNotifier, setMissedCallNotifier] = useState(null);

  const pc = useRef(new RTCPeerConnection(servers));
  const localStream = useRef(null);
  const remoteStream = useRef(null);
  
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const remoteAudioRef = useRef(null);
  const messagesEndRef = useRef(null);

  const callStateRef = useRef(callState);
  const callPartnerRef = useRef(callPartner);
  useEffect(() => { callStateRef.current = callState; }, [callState]);
  useEffect(() => { callPartnerRef.current = callPartner; }, [callPartner]);

  // 1. Auth վիճակ
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

  // 2. Օգտատերերի ցուցակ
  useEffect(() => {
    if (!user) return;
    return onSnapshot(collection(db, "users"), (snapshot) => {
      const users = [];
      snapshot.forEach((doc) => { if (doc.id !== user.uid) users.push(doc.data()); });
      setUsersList(users);
    });
  }, [user]);

  // 3. Նամակների սինխրոնիզացիա
  useEffect(() => {
    if (!user || !selectedUser) return;
    const chatId = [user.uid, selectedUser.uid].sort().join('_');
    const q = query(collection(db, "messages"), where("chatId", "==", chatId), orderBy("createdAt", "asc"));
    
    return onSnapshot(q, (snapshot) => {
      const fetchedMessages = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        fetchedMessages.push(data);
        if (data.receiverId === user.uid && data.seen === false) {
          updateDoc(doc(db, "messages", docSnap.id), { seen: true });
        }
      });
      setMessages(fetchedMessages);
    });
  }, [user, selectedUser]);

  // 4. Չկարդացված նամակներ
  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, "messages"), where("receiverId", "==", user.uid), where("seen", "==", false));
    return onSnapshot(q, (snapshot) => {
      const counts = {};
      snapshot.forEach((doc) => {
        const data = doc.data();
        counts[data.senderId] = (counts[data.senderId] || 0) + 1;
      });
      setUnreadMessages(counts);
    });
  }, [user]);

  // 5. 📞 ՄՈՒՏՔԱՅԻՆ ԶԱՆԳԵՐԻ ԼՍՈՒՄ (Ուղղված է Bug-ը)
  useEffect(() => {
    if (!user) return;
    // Լսում ենք և pending, և accepted կարգավիճակները, որպեսզի պատասխանելիս միանգամից չփակվի
    const q = query(
      collection(db, "calls"), 
      where("receiverId", "==", user.uid), 
      where("status", "in", ["pending", "accepted"])
    );
    
    return onSnapshot(q, (snapshot) => {
      if (snapshot.empty) {
        if (callStateRef.current === 'incoming') {
          if (callPartnerRef.current) {
            setMissedCallNotifier(`Բաց թողնված զանգ ${callPartnerRef.current.displayName}-ից`);
          }
          handleEndCall(false);
        }
        return;
      }
      
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        // Միայն եթե նոր զանգ է և մենք ազատ ենք, դարձնում ենք incoming
        if (data.status === 'pending' && callStateRef.current === 'idle') {
          setIncomingCallData({ id: docSnap.id, ...data });
          setCallType(data.type);
          setCallState('incoming');
          setCallPartner({
            uid: data.callerId,
            displayName: data.callerName,
            photoURL: data.callerPhoto
          });
        }
      });
    });
  }, [user]);

  // 6. WebRTC սեթափ
  const setupWebRTC = async (type) => {
    localStream.current = await navigator.mediaDevices.getUserMedia({
      video: type === 'video',
      audio: true
    });

    remoteStream.current = new MediaStream();

    localStream.current.getTracks().forEach((track) => {
      pc.current.addTrack(track, localStream.current);
    });

    pc.current.ontrack = (event) => {
      event.streams[0].getTracks().forEach((track) => {
        remoteStream.current.addTrack(track);
      });
    };
  };

  // Հոսքերը DOM-ին կապող էֆեկտ
  useEffect(() => {
    if (callState === 'active') {
      const timer = setTimeout(() => {
        if (callType === 'video') {
          if (remoteVideoRef.current && remoteStream.current) {
            remoteVideoRef.current.srcObject = remoteStream.current;
          }
          if (localVideoRef.current && localStream.current) {
            localVideoRef.current.srcObject = localStream.current;
          }
        } else if (callType === 'audio') {
          if (remoteAudioRef.current && remoteStream.current) {
            remoteAudioRef.current.srcObject = remoteStream.current;
          }
        }
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [callState, callType]);

  // 7. 🚀 ԶԱՆԳԻ ՍԿԻԶԲ
  const handleInitiateCall = async (type) => {
    if (callState !== 'idle') return;
    
    setCallType(type);
    setCallState('calling');
    setCallPartner(selectedUser);

    await setupWebRTC(type);

    const callDoc = doc(collection(db, 'calls'));
    const offerCandidates = collection(callDoc, 'offerCandidates');
    const answerCandidates = collection(callDoc, 'answerCandidates');

    setCurrentCallId(callDoc.id);

    pc.current.onicecandidate = (event) => {
      event.candidate && addDoc(offerCandidates, event.candidate.toJSON());
    };

    const offerDescription = await pc.current.createOffer();
    await pc.current.setLocalDescription(offerDescription);

    await setDoc(callDoc, {
      offer: { type: offerDescription.type, sdp: offerDescription.sdp },
      status: 'pending',
      type,
      callerId: user.uid,
      callerName: user.displayName,
      callerPhoto: user.photoURL,
      receiverId: selectedUser.uid,
    });

    onSnapshot(callDoc, (snapshot) => {
      const data = snapshot.data();
      if (!pc.current.currentRemoteDescription && data?.answer) {
        const answerDescription = new RTCSessionDescription(data.answer);
        pc.current.setRemoteDescription(answerDescription);
        setCallState('active');
      }
      if (data?.status === 'ended' || data?.status === 'rejected') handleEndCall(false);
    });

    onSnapshot(answerCandidates, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'added') {
          pc.current.addIceCandidate(new RTCIceCandidate(change.doc.data()));
        }
      });
    });
  };

  // 8. ✅ ՊԱՏԱՍԽԱՆԵԼ ԶԱՆԳԻՆ
  const handleAcceptCall = async () => {
    const callId = incomingCallData?.id;
    if (!callId) return;
    
    setCurrentCallId(callId);
    setCallState('active');
    await setupWebRTC(incomingCallData.type);

    const callDoc = doc(db, 'calls', callId);
    const answerCandidates = collection(callDoc, 'answerCandidates');
    const offerCandidates = collection(callDoc, 'offerCandidates');

    pc.current.onicecandidate = (event) => {
      event.candidate && addDoc(answerCandidates, event.candidate.toJSON());
    };

    const callData = (await getDoc(callDoc)).data();
    await pc.current.setRemoteDescription(new RTCSessionDescription(callData.offer));

    const answerDescription = await pc.current.createAnswer();
    await pc.current.setLocalDescription(answerDescription);

    await updateDoc(callDoc, {
      answer: { type: answerDescription.type, sdp: answerDescription.sdp },
      status: 'accepted'
    });

    onSnapshot(offerCandidates, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'added') {
          pc.current.addIceCandidate(new RTCIceCandidate(change.doc.data()));
        }
      });
    });

    onSnapshot(callDoc, (snapshot) => {
      if (snapshot.data()?.status === 'ended') handleEndCall(false);
    });
  };

  // 9. 🛑 ԶԱՆԳԻ ԱՎԱՐՏ
  const handleEndCall = async (notifyFirebase = true) => {
    const activeCallId = currentCallId || incomingCallData?.id;

    if (notifyFirebase && activeCallId) {
      try {
        await updateDoc(doc(db, 'calls', activeCallId), { 
          status: callStateRef.current === 'incoming' ? 'rejected' : 'ended' 
        });
      } catch (error) {
        console.error("Error updating call status:", error);
      }
    }

    if (localStream.current) {
      localStream.current.getTracks().forEach(track => track.stop());
      localStream.current = null;
    }
    
    if (pc.current) {
      pc.current.close();
    }
    pc.current = new RTCPeerConnection(servers);

    setCallState('idle');
    setCurrentCallId(null);
    setIncomingCallData(null);
    setCallType(null);
    setCallPartner(null);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!typedMessage.trim() || !selectedUser) return;
    const chatId = [user.uid, selectedUser.uid].sort().join('_');
    await addDoc(collection(db, "messages"), {
      chatId, senderId: user.uid, receiverId: selectedUser.uid,
      text: typedMessage.trim(), createdAt: serverTimestamp(),
      seen: false 
    });
    setTypedMessage('');
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <>
      <button className="premium-chat-trigger" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
            <path fillRule="evenodd" d="M4.848 2.771A49.144 49.144 0 0 1 12 2.25c2.43 0 4.817.178 7.152.521 1.582.233 2.722 1.634 2.722 3.23v5.455c0 1.596-1.14 2.997-2.722 3.23a49.074 49.074 0 0 1-3.185.367c-.161.012-.31.09-.398.225l-2.88 4.32a.75.75 0 0 1-1.249 0l-2.88-4.32a.446.446 0 0 0-.398-.225 49.144 49.144 0 0 1-3.185-.367C3.23 14.683 2.09 13.282 2.09 11.686V6.23c0-1.596 1.14-2.997 2.722-3.23Z" clipRule="evenodd" />
          </svg>
        )}
        {Object.values(unreadMessages).reduce((a, b) => a + b, 0) > 0 && (
          <span className="global-unread-badge">!</span>
        )}
      </button>

      <div className={`premium-chat-panel ${isOpen ? 'is-open' : ''}`}>
        
        {/* --- ԶԱՆԳԻ ԷԿՐԱՆՆԵՐ --- */}
        {(callState === 'calling' || callState === 'incoming' || callState === 'active') && (
          <div className="call-overlay-screen">
            {callState === 'active' ? (
              <div className="video-streams-container">
                {callType === 'video' ? (
                  <>
                    <video ref={remoteVideoRef} autoPlay playsInline className="remote-video-feed"></video>
                    <video ref={localVideoRef} autoPlay playsInline muted className="local-video-feed"></video>
                  </>
                ) : (
                  <>
                    <div className="audio-only-placeholder">
                      {callPartner?.photoURL ? (
                        <img src={callPartner.photoURL} alt="" className="audio-avatar" />
                      ) : (
                        <div className="audio-avatar fallback">
                          {callPartner?.displayName?.charAt(0).toUpperCase() || '?'}
                        </div>
                      )}
                      <h4>{callPartner?.displayName}</h4>
                      <p className="call-status-text">Ակտիվ խոսակցություն...</p>
                    </div>
                    <audio ref={remoteAudioRef} autoPlay></audio>
                  </>
                )}
              </div>
            ) : (
              <div className="call-info-box">
                <div className="call-user-pulse ring">
                  {callPartner?.photoURL ? (
                    <img src={callPartner.photoURL} alt="" />
                  ) : (
                    <div className="avatar-fallback">
                      {callPartner?.displayName?.charAt(0).toUpperCase() || '?'}
                    </div>
                  )}
                </div>
                <h4>{callState === 'incoming' ? 'Մուտքային զանգ' : 'Զանգ է գնում...'}</h4>
                <p>{callPartner?.displayName}</p>
              </div>
            )}

            <div className="call-action-row">
              {callState === 'incoming' && (
                <button className="btn-call-action accept" onClick={handleAcceptCall}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mr-1">
                    <path fillRule="evenodd" d="M1.5 4.5a3 3 0 0 1 3-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 0 1-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 0 0 6.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 0 1 1.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 0 1-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5Z" clipRule="evenodd" />
                  </svg>
                  Պատասխանել
                </button>
              )}
              <button className="btn-call-action hangup" onClick={() => handleEndCall(true)}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mr-1 transform rotate-[135deg]">
                  <path fillRule="evenodd" d="M1.5 4.5a3 3 0 0 1 3-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 0 1-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 0 0 6.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 0 1 1.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 0 1-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5Z" clipRule="evenodd" />
                </svg>
                Ավարտել
              </button>
            </div>
          </div>
        )}

        {/* --- ՉԱՏԻ ԳԼԽԱՎՈՐ ՄԱՍԸ --- */}
        <div className="chat-panel-header">
          {selectedUser && callState === 'idle' && (
            <button className="chat-back-btn" onClick={() => setSelectedUser(null)}>←</button>
          )}
          <h3>{selectedUser ? selectedUser.displayName : 'Հաղորդագրություններ'}</h3>
          {selectedUser && callState === 'idle' && (
            <div className="header-call-buttons">
              <button className="header-icon-btn" onClick={() => handleInitiateCall('audio')}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                  <path fillRule="evenodd" d="M1.5 4.5a3 3 0 0 1 3-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 0 1-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 0 0 6.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 0 1 1.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 0 1-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5Z" clipRule="evenodd" />
                </svg>
              </button>
              <button className="header-icon-btn" onClick={() => handleInitiateCall('video')}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                  <path d="M16 12.392V8.5A1.5 1.5 0 0 0 14.5 7h-10A1.5 1.5 0 0 0 3 8.5v7A1.5 1.5 0 0 0 4.5 17h10a1.5 1.5 0 0 0 1.5-1.5v-3.892l5.213 3.65A1 1 0 0 0 22 14.433V9.567a1 1 0 0 0-1.787-.825L16 12.392Z" />
                </svg>
              </button>
            </div>
          )}
          <button className="chat-panel-close-x" onClick={() => setIsOpen(false)}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 🔔 ԾԱՆՈՒՑՈՒՄ */}
        {missedCallNotifier && (
          <div className="missed-call-alert-banner">
            <span className="flex items-center gap-1.5">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-rose-500">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
              </svg>
              {missedCallNotifier}
            </span>
            <button onClick={() => setMissedCallNotifier(null)}>✕</button>
          </div>
        )}

        {!user ? (
          <div className="chat-login-overlay">
            <button className="google-login-btn" onClick={() => signInWithPopup(auth, googleProvider)}>Մուտք գործել Google-ով</button>
          </div>
        ) : (
          <>
            {!selectedUser ? (
              <div className="chat-users-section">
                {usersList.map((u) => (
                  <div key={u.uid} className="chat-user-item" onClick={() => setSelectedUser(u)}>
                    <img src={u.photoURL} alt="" className="user-avatar" />
                    <span className="user-name-text">{u.displayName}</span>
                    {unreadMessages[u.uid] > 0 && (
                      <span className="unread-badge-count">{unreadMessages[u.uid]}</span>
                    )}
                  </div>
                ))}
                <button className="chat-logout-btn" onClick={() => signOut(auth)}>Դուրս գալ</button>
              </div>
            ) : (
              <div className="active-chat-box">
                <div className="chat-messages-area">
                  {messages.map((msg, idx) => (
                    <div key={idx} className={`message-bubble ${msg.senderId === user.uid ? 'me' : 'other'}`}>{msg.text}</div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
                <form className="chat-input-form" onSubmit={handleSendMessage}>
                  <input type="text" className="chat-message-input" placeholder="Նամակ..." value={typedMessage} onChange={(e) => setTypedMessage(e.target.value)} />
                  <button type="submit" className="chat-send-btn">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                      <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
                    </svg>
                  </button>
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