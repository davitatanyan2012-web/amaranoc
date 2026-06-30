import React, { useState, useEffect, useRef } from 'react';
import { auth, db, googleProvider, signInWithPopup, signOut } from '../firebase';
import {
  collection, doc, setDoc, onSnapshot, query, where, orderBy,
  addDoc, serverTimestamp, updateDoc
} from 'firebase/firestore';
import AgoraRTC from 'agora-rtc-sdk-ng';
import './PremiumChat.css';

// ⚠️ ՈՒՇԱԴՐՈՒԹՅՈՒՆ. App ID-ն և Token-ը ՊԵՏՔ Է լինեն ՀԵՆՑ ՆՈՒՅՆ
// project-ից Agora Console-ում։
//
// AGORA_APP_ID-ն ՉԻ ՓՈԽՎՈՒՄ — սա քո Project-ի մշտական ID-ն է։
const AGORA_APP_ID = "c227a9221f8c49d898e172403865e494";

// AGORA_TOKEN-ը ՊԵՏՔ Է թարմացվի ամեն օր (wildcard token, 24 ժամ վավերական)։
// Թարմացման համար.
//   1) cd agora-token-gen
//   2) node generate-token.js
//   3) Copy արա արդյունքում տպված token-ը և տեղադրիր ՍՐԱ փոխարեն
//   4) npm run build && firebase deploy --only hosting (project root-ից)
const AGORA_TOKEN = "007eJxTYJC7l7d97upnnttDbO+myVZ8XbnT/ZxulcyJiU+9tYwmma9UYEg2MjJPtDQyMkyzSDaxTLGwtEg1NDcyMTC2MDNNNbE08atwymoIZGRYFzSZhZEBAkF8FobkjMQSBgYAWkgeuw==";

const PremiumChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [usersList, setUsersList] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [typedMessage, setTypedMessage] = useState('');

  const [callState, setCallState] = useState('idle');
  const [currentCallId, setCurrentCallId] = useState(null);
  const [callType, setCallType] = useState(null);
  const [incomingCallData, setIncomingCallData] = useState(null);
  const [callPartner, setCallPartner] = useState(null);
  const [callError, setCallError] = useState(null);

  const agoraClient = useRef(null);
  const localAudioTrack = useRef(null);
  const localVideoTrack = useRef(null);
  const [remoteVideoTrack, setRemoteVideoTrack] = useState(null);
  const messagesEndRef = useRef(null);

  // Պաշտպանվում ենք "race condition"-ից. եթե handleEndCall կանչվում է
  // մինչդեռ setupAgora-ն դեռ ընթացքի մեջ է, պետք է իմանանք դա չեղարկելու համար։
  const callSessionId = useRef(0);

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

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Google Sign-In Error:", error);
    }
  };

  useEffect(() => {
    if (!user) return;
    return onSnapshot(collection(db, "users"), (snapshot) => {
      const users = [];
      snapshot.forEach((doc) => { if (doc.id !== user.uid) users.push(doc.data()); });
      setUsersList(users);
    });
  }, [user]);

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

  // 1. ՄՈՒՏՔԱՅԻՆ ԶԱՆԳԵՐԻ ԼՍՈՂ
  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, "calls"), where("receiverId", "==", user.uid), where("status", "==", "pending"));

    const unsubscribeIncoming = onSnapshot(q, (snapshot) => {
      if (snapshot.empty) return;

      snapshot.forEach((docSnap) => {
        if (callState === 'idle') {
          const data = docSnap.data();
          setIncomingCallData({ id: docSnap.id, ...data });
          setCallType(data.type);
          setCallState('incoming');
          setCurrentCallId(docSnap.id);

          const partnerInfo = usersList.find(u => u.uid === data.callerId) || {
            displayName: data.callerName || "Օգտատեր",
            photoURL: data.callerPhoto || ""
          };
          setCallPartner(partnerInfo);
        }
      });
    });

    return () => unsubscribeIncoming();
  }, [user, callState, usersList]);

  // 2. ԱԿՏԻՎ ԶԱՆԳԻ ԿԱՐԳԱՎԻՃԱԿԻ ԼՍՈՂ
  useEffect(() => {
    const activeCallId = currentCallId || incomingCallData?.id;
    if (!activeCallId) return;

    const unsubscribeCallDoc = onSnapshot(doc(db, 'calls', activeCallId), (snapshot) => {
      if (!snapshot.exists()) {
        handleEndCall(false);
        return;
      }
      const data = snapshot.data();

      if (data.status === 'accepted' && callState === 'calling') {
        setCallState('connecting');
      }

      if (data.status === 'ended' || data.status === 'rejected') {
        handleEndCall(false);
      }
    });

    return () => unsubscribeCallDoc();
  }, [currentCallId, incomingCallData?.id, callState]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // 3. AGORA ՄԻԱՑՈՒՄ
  const setupAgora = async (channelName, type) => {
    const mySessionId = ++callSessionId.current;

    if (!agoraClient.current) {
      agoraClient.current = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
    }
    agoraClient.current.removeAllListeners();

    agoraClient.current.on("user-published", async (remoteUser, mediaType) => {
      await agoraClient.current.subscribe(remoteUser, mediaType);

      if (mediaType === "video") {
        setRemoteVideoTrack(remoteUser.videoTrack);
        setTimeout(() => {
          const remoteContainer = document.getElementById("remote-video-container");
          if (remoteContainer) {
            remoteUser.videoTrack.play(remoteContainer);
          }
        }, 300);
      }
      if (mediaType === "audio") {
        remoteUser.audioTrack.play();
      }
    });

    agoraClient.current.on("user-unpublished", (remoteUser, mediaType) => {
      if (mediaType === "video") {
        if (remoteUser.videoTrack) remoteUser.videoTrack.stop();
        setRemoteVideoTrack(null);
      }
      if (mediaType === "audio" && remoteUser.audioTrack) remoteUser.audioTrack.stop();
    });

    agoraClient.current.on("connection-state-change", (curState, prevState, reason) => {
      console.log(`Agora connection: ${prevState} -> ${curState} (${reason})`);
      if (curState === "DISCONNECTED" && reason !== "LEAVE") {
        setCallError("Կապի խնդիր։ Փորձիր նորից։");
      }
    });

    // Wildcard token-ով (AGORA_TOKEN) կարող ենք միանալ ՑԱՆԿԱՑԱԾ channel-ի,
    // user.uid-ով (Firebase uid-ով), առանց server-ից token պահանջելու։
    await agoraClient.current.join(AGORA_APP_ID, channelName, AGORA_TOKEN, user.uid);

    if (mySessionId !== callSessionId.current) {
      await agoraClient.current.leave();
      return;
    }

    if (type === 'video') {
      const [audioTrack, videoTrack] = await AgoraRTC.createMicrophoneAndCameraTracks();

      if (mySessionId !== callSessionId.current) {
        audioTrack.close();
        videoTrack.close();
        await agoraClient.current.leave();
        return;
      }

      localAudioTrack.current = audioTrack;
      localVideoTrack.current = videoTrack;

      setTimeout(() => {
        const localContainer = document.getElementById("local-video-container");
        if (localContainer) {
          videoTrack.play(localContainer);
        }
      }, 300);

      await agoraClient.current.publish([audioTrack, videoTrack]);
    } else {
      const audioTrack = await AgoraRTC.createMicrophoneAudioTrack();

      if (mySessionId !== callSessionId.current) {
        audioTrack.close();
        await agoraClient.current.leave();
        return;
      }

      localAudioTrack.current = audioTrack;
      await agoraClient.current.publish([audioTrack]);
    }

    setCallState('active');
  };

  useEffect(() => {
    if (callState === 'active' || callState === 'calling' || callState === 'connecting') {
      setTimeout(() => {
        const localContainer = document.getElementById("local-video-container");
        if (localContainer && localVideoTrack.current) {
          localVideoTrack.current.play(localContainer);
        }
        const remoteContainer = document.getElementById("remote-video-container");
        if (remoteContainer && remoteVideoTrack) {
          remoteVideoTrack.play(remoteContainer);
        }
      }, 400);
    }
  }, [callState, remoteVideoTrack]);

  const handleInitiateCall = async (type) => {
    if (!selectedUser || !user) return;

    setCallError(null);
    setCallType(type);
    setCallState('calling');
    setCallPartner(selectedUser);

    const channelName = [user.uid, selectedUser.uid].sort().join('_');

    try {
      const callDoc = doc(collection(db, 'calls'));
      setCurrentCallId(callDoc.id);

      await setDoc(callDoc, {
        channelName,
        status: 'pending',
        type,
        callerId: user.uid,
        callerName: user.displayName,
        callerPhoto: user.photoURL,
        receiverId: selectedUser.uid,
        createdAt: serverTimestamp()
      });

      await setupAgora(channelName, type);
    } catch (err) {
      console.error("Call Initiation Error:", err);
      setCallError("Կանչը չհաջողվեց սկսել։");
      handleEndCall(true);
    }
  };

  const handleAcceptCall = async () => {
    const callId = incomingCallData?.id || currentCallId;
    const channelName = incomingCallData?.channelName;
    if (!callId || !channelName) return;

    setCallError(null);
    setCallState('connecting');

    try {
      const callDocRef = doc(db, 'calls', callId);
      await updateDoc(callDocRef, { status: 'accepted' });
      await setupAgora(channelName, incomingCallData.type);
    } catch (err) {
      console.error("Accept Call Error:", err);
      setCallError("Կանչին միանալը չհաջողվեց։");
      handleEndCall(true);
    }
  };

  const handleEndCall = async (notifyFirebase = true) => {
    callSessionId.current++;

    const activeCallId = currentCallId || incomingCallData?.id;

    if (notifyFirebase && activeCallId) {
      try {
        await updateDoc(doc(db, 'calls', activeCallId), {
          status: callState === 'incoming' ? 'rejected' : 'ended'
        });
      } catch (error) {
        console.error("Firebase Update Call End Error:", error);
      }
    }

    if (localAudioTrack.current) {
      localAudioTrack.current.stop();
      localAudioTrack.current.close();
      localAudioTrack.current = null;
    }
    if (localVideoTrack.current) {
      localVideoTrack.current.stop();
      localVideoTrack.current.close();
      localVideoTrack.current = null;
    }

    if (agoraClient.current) {
      try {
        await agoraClient.current.leave();
      } catch (e) {
        console.error("Agora Leave Error:", e);
      }
    }

    setRemoteVideoTrack(null);
    setCallState('idle');
    setCurrentCallId(null);
    setIncomingCallData(null);
    setCallType(null);
    setCallPartner(null);
    setCallError(null);
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
        {isOpen ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        ) : (
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
        )}
      </button>

      <div className={`premium-chat-panel ${isOpen ? 'is-open' : ''}`}>

        {(callState === 'calling' || callState === 'incoming' || callState === 'active' || callState === 'connecting') && (
          <div className="call-overlay-screen">

            {callType === 'video' && (
              <div className="video-streams-container">
                <div id="remote-video-container" className="remote-video-feed"></div>
                <div id="local-video-container" className="local-video-feed"></div>
              </div>
            )}

            {callType === 'audio' && (
              <div className="audio-only-placeholder">
                {callPartner?.photoURL ? (
                  <img src={callPartner.photoURL} alt="" className="audio-avatar" />
                ) : (
                  <div className="audio-avatar fallback">
                    {callPartner?.displayName?.charAt(0).toUpperCase() || '?'}
                  </div>
                )}
                <h4>{callPartner?.displayName}</h4>
                <p className="call-status-text">
                  {callState === 'active' ? 'Ակտիվ խոսակցություն...' :
                   callState === 'connecting' ? 'Միանում ենք...' :
                   callState === 'incoming' ? 'Մուտքային աուդիո զանգ' : 'Զանգ է գնում...'}
                </p>
              </div>
            )}

            {callType === 'video' && callState !== 'active' && (
              <div className="call-info-box z-30">
                <div className="call-user-pulse ring">
                  {callPartner?.photoURL ? (
                    <img src={callPartner.photoURL} alt="" />
                  ) : (
                    <div className="avatar-fallback">
                      {callPartner?.displayName?.charAt(0).toUpperCase() || '?'}
                    </div>
                  )}
                </div>
                <h4>
                  {callState === 'incoming' ? 'Մուտքային վիդեո զանգ' :
                   callState === 'connecting' ? 'Միանում ենք...' : 'Վիդեո զանգ...'}
                </h4>
                <p>{callPartner?.displayName}</p>
              </div>
            )}

            {callError && <p className="call-error-text">{callError}</p>}

            <div className="call-action-row">
              {callState === 'incoming' && (
                <button className="btn-call-action accept" onClick={handleAcceptCall}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M20 15.5c-1.2 0-2.4-.2-3.6-.6-.3-.1-.7 0-1 .2l-2.2 2.2c-2.8-1.4-5.1-3.8-6.6-6.6l2.2-2.2c.3-.3.4-.7.2-1-.3-1.1-.5-2.3-.5-3.5 0-.6-.4-1-1-1H4c-.6 0-1 .4-1 1 0 9.4 7.6 17 17 17 .6 0 1-.4 1-1v-3.5c0-.6-.4-1-1-1z"/></svg>
                  Պատասխանել
                </button>
              )}
              <button className="btn-call-action hangup" onClick={() => handleEndCall(true)}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 9c-1.6 0-3.15.25-4.6.72v3.1c0 .39-.23.74-.56.9-.98.49-1.87 1.12-2.66 1.85-.18.18-.43.28-.7.28-.28 0-.53-.11-.71-.29L.29 13.1c-.18-.18-.29-.43-.29-.71 0-.28.11-.53.29-.71C3.33 8.37 7.42 6 12 6s8.67 2.37 11.71 5.68c.18.18.29.43.29.71 0 .28-.11.53-.29.71l-2.48 2.48c-.18.18-.43.29-.71.29-.27 0-.52-.11-.7-.28-.79-.74-1.69-1.36-2.67-1.85-.33-.16-.56-.5-.56-.9v-3.1C15.15 9.25 13.6 9 12 9z"/></svg>
                Ավարտել
              </button>
            </div>
          </div>
        )}

        <div className="chat-panel-header">
          {selectedUser && callState === 'idle' && (
            <button className="chat-back-btn" onClick={() => setSelectedUser(null)}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
            </button>
          )}
          <h3>{selectedUser ? selectedUser.displayName : 'Հաղորդագրություններ'}</h3>
          {selectedUser && callState === 'idle' && (
            <div className="header-call-buttons">
              <button className="header-icon-btn" onClick={() => handleInitiateCall('audio')}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
              </button>
              <button className="header-icon-btn" onClick={() => handleInitiateCall('video')}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M23 7a2 2 0 0 0-2-2h-9a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2V7z"></path><path d="M1 9.5L5 12l-4 2.5v-5z"></path></svg>
              </button>
            </div>
          )}
          <button className="chat-panel-close-x" onClick={() => setIsOpen(false)}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

        {!user ? (
          <div className="chat-login-overlay">
            <p className="login-hint-text">Մուտք գործեք համակարգ՝ անվճար զանգերից և չատից օգտվելու համար</p>
            <button className="google-login-btn" onClick={handleGoogleLogin}>
              Մուտք գործել Google-ով
            </button>
          </div>
        ) : (
          <>
            {!selectedUser ? (
              <div className="chat-users-section">
                <p className="online-users-title">Առցանց օգտատերեր</p>
                {usersList.map((u) => (
                  <div key={u.uid} className="chat-user-item" onClick={() => setSelectedUser(u)}>
                    {u.photoURL ? (
                      <img src={u.photoURL} alt="" className="user-avatar" />
                    ) : (
                      <div className="user-avatar fallback">
                        {u.displayName?.charAt(0).toUpperCase() || '?'}
                      </div>
                    )}
                    <span className="user-name-text">{u.displayName}</span>
                    <span className="user-status-dot"></span>
                  </div>
                ))}
                <button className="chat-logout-btn" onClick={() => signOut(auth)}>Դուրս գալ հաշվից</button>
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
                  <input type="text" className="chat-message-input" placeholder="Գրեք հաղորդագրություն..." value={typedMessage} onChange={(e) => setTypedMessage(e.target.value)} />
                  <button type="submit" className="chat-send-btn">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
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