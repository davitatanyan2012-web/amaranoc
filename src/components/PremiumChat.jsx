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
  const [callPartner, setCallPartner] = useState(null); // 👤 Զանգի գործընկերոջ տվյալները
  
  const pc = useRef(new RTCPeerConnection(servers));
  const localStream = useRef(null);
  
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const remoteAudioRef = useRef(null);
  const messagesEndRef = useRef(null);

  // 1. Ստուգում ենք Auth վիճակը
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

  // 2. Օգտատերերի ցուցակը
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
      snapshot.forEach((doc) => fetchedMessages.push(doc.data()));
      setMessages(fetchedMessages);
    });
  }, [user, selectedUser]);

  // 4. 📞 ՄՈՒՏՔԱՅԻՆ ԶԱՆԳԵՐԻ ԼՍՈՒՄ (Ուղղված է նաև դիմացինի չեղարկումը որսալու հատվածը)
  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, "calls"), where("receiverId", "==", user.uid), where("status", "==", "pending"));
    return onSnapshot(q, (snapshot) => {
      if (snapshot.empty) {
        if (callState === 'incoming') {
          handleEndCall(false);
        }
        return;
      }
      snapshot.forEach((docSnap) => {
        if (callState === 'idle') {
          const data = docSnap.data();
          setIncomingCallData({ id: docSnap.id, ...data });
          setCallType(data.type);
          setCallState('incoming');
          
          // Գտնում ենք զանգահարողի ամբողջական տվյալները
          const partnerInfo = usersList.find(u => u.uid === data.callerId) || {
            displayName: data.callerName,
            photoURL: data.callerPhoto
          };
          setCallPartner(partnerInfo);
        }
      });
    });
  }, [user, callState, usersList]);

  // 5. 🔊 Մեդիա հոսքի կարգավորում
  const setupWebRTC = async (type) => {
    localStream.current = await navigator.mediaDevices.getUserMedia({
      video: type === 'video',
      audio: true
    });

    localStream.current.getTracks().forEach((track) => {
      pc.current.addTrack(track, localStream.current);
    });

    pc.current.ontrack = (event) => {
      const remoteMediaStream = event.streams[0];
      if (type === 'video' && remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = remoteMediaStream;
      } else if (type === 'audio' && remoteAudioRef.current) {
        remoteAudioRef.current.srcObject = remoteMediaStream;
      }
    };

    if (type === 'video' && localVideoRef.current) {
      localVideoRef.current.srcObject = localStream.current;
    }
  };

  // 6. 🚀 ԶԱՆԳԻ ՍԿԻԶԲ (Caller)
  const handleInitiateCall = async (type) => {
    setCallType(type);
    setCallState('calling');
    setCallPartner(selectedUser); // Ֆիքսում ենք ում ենք զանգում

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
        const answerDescription = new RTCISessionDescription(data.answer);
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

  // 7. ✅ ՊԱՏԱՍԽԱՆԵԼ ԶԱՆԳԻՆ (Receiver)
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
    await pc.current.setRemoteDescription(new RTCISessionDescription(callData.offer));

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

  // 8. 🛑 ԶԱՆԳԻ ԱՎԱՐՏ (Ուղղված է սկզբից մերժելու բագը)
  const handleEndCall = async (notifyFirebase = true) => {
    // Վերցնում ենք ակտիվ կամ մուտքային զանգի ID-ն
    const activeCallId = currentCallId || incomingCallData?.id;

    if (notifyFirebase && activeCallId) {
      try {
        await updateDoc(doc(db, 'calls', activeCallId), { 
          status: callState === 'incoming' ? 'rejected' : 'ended' 
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
    setCallPartner(null); // Մաքրում ենք գործընկերոջը
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!typedMessage.trim() || !selectedUser) return;
    const chatId = [user.uid, selectedUser.uid].sort().join('_');
    await addDoc(collection(db, "messages"), {
      chatId, senderId: user.uid, receiverId: selectedUser.uid,
      text: typedMessage.trim(), createdAt: serverTimestamp()
    });
    setTypedMessage('');
  };

  return (
    <>
      <button className="premium-chat-trigger" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? '✕' : '💬'}
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
                    {/* Աուդիո Զանգի Էկրան */}
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
              /* Զանգ ստանալու կամ զանգելու վիճակ */
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
                <button className="btn-call-action accept" onClick={handleAcceptCall}>📞 Պատասխանել</button>
              )}
              <button className="btn-call-action hangup" onClick={() => handleEndCall(true)}>🛑 Ավարտել</button>
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
              <button className="header-icon-btn" onClick={() => handleInitiateCall('audio')}>📞</button>
              <button className="header-icon-btn" onClick={() => handleInitiateCall('video')}>📹</button>
            </div>
          )}
          <button className="chat-panel-close-x" onClick={() => setIsOpen(false)}>✕</button>
        </div>

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
                  <button type="submit" className="chat-send-btn">➤</button>
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