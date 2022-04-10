import React, { useEffect, useState, useRef } from 'react'
import styled from "styled-components"
import {auth, db} from "../firebase.js";
import { useCollection } from 'react-firebase-hooks/firestore';
import { useRouter } from 'next/router';
import {useAuthState} from "react-firebase-hooks/auth"
import {Avatar, IconButton} from "@material-ui/core"
import MoreVertIcon from "@mui/icons-material/MoreVert";
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { addDoc, collection, doc, getDoc, getDocs, onSnapshot, onSnapshotsInSync, orderBy, query, serverTimestamp, setDoc, where } from 'firebase/firestore';
import Message from './Message.js';
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';
import MicIcon from '@mui/icons-material/Mic';
import getRecipientEmail from '../utils/getRecipientEmail.js';
import TimeAgo from "timeago-react"

function ChatScreen({chat_id, serverMessages}) {
    const [user] = useAuthState(auth)
    const [messages, setMessages] = useState([])
    const [input, setInput] = useState("")
    const [recipient, setRecipient] = useState("")
    const [users, setUsers] = useState("")
    const fieldRef = useRef()


    useEffect(() => {
        const chatRef = doc(db, "chats", chat_id);
        getDoc(chatRef).then(doc => setUsers(doc.data()))

    },[chat_id])

    useEffect(() => {
        if(users){
            const recipientEmail = getRecipientEmail(users.users, user)
            
            const userDetailsRef = collection(db, "users");
            const userDetailsQuery = query(userDetailsRef, where("email", "==", recipientEmail));

            const unsubscribe = onSnapshot(userDetailsQuery, (snapshot) => {
                setRecipient(snapshot.docs.map(doc => ({...doc.data(), id: doc.id})))
               
            })

        return () => unsubscribe()

        }

    },[users])


    useEffect(() => {
        if(chat_id){
        setMessages(JSON.parse(serverMessages))
        }
    },[])

    useEffect(() => {
            if(chat_id){

            const messagesRef = collection(db, "chats", chat_id, "messages");
            const q = query(messagesRef, orderBy("timestamp", "asc"))

            const unsubscribe = onSnapshot(q, (snapshot) => {
                setMessages(snapshot.docs.map(doc => ({...doc.data(), id: doc.id, timestamp: doc.data().timestamp?.toDate().getTime()})))
                fieldRef.current.scrollIntoView({
                    behavior: "smooth",
                  });
            })

        return () => unsubscribe()
            
    }
        
    }, [chat_id]);

    const sendMessage = async (e) => {
        e.preventDefault();

        // Store the user active time
        const userRef = doc(db, "users", user.uid);
        setDoc(userRef, {lastSeen: serverTimestamp()}, {merge: true})

        // Add message
        const messageRef = collection(db, "chats", chat_id, "messages");
        await addDoc(messageRef, {
            timestamp: serverTimestamp(),
            message: input,
            user: user.email,
            photoURL: user.photoURL
        });
        setInput("");

    }

  return (
    <Container>
            <Header>
                <Avatar src={recipient[0]?.photoUrl}/>
                <HeaderInformaiton>
                    <h3>{recipient[0]?.displayName ? recipient[0]?.displayName : recipient[0]?.email}</h3>
                   
                        <p>Last active: {' '}
                            {recipient[0]?.lastSeen?.toDate() ? (
                                <TimeAgo datetime={recipient[0]?.lastSeen?.toDate()}/>
                            ) : "Unavailable"}
                        </p>
                    
                </HeaderInformaiton>
                <HeaderIcons>
                    <IconButton>
                    <AttachFileIcon />
                    </IconButton>
                    <IconButton>
                        <MoreVertIcon />
                    </IconButton>

                </HeaderIcons>
            </Header>
            <MessageContainer>

                {/* Show messages */}
                {messages?.map(message => (
                    <Message key={message.id} user={message.user} message={message.message} timestamp={message.timestamp}/>
                   
                ))}

                <EndOfMessage />
                <MessageScroll ref={fieldRef}/>

            </MessageContainer>

            <InputContainer>
                    <InsertEmoticonIcon />
                    <Input value={input} onChange={e => setInput(e.target.value)}/>
                    <button type="submit" hidden disabled={!input} onClick={sendMessage}>Send message</button>
                    <MicIcon />
            </InputContainer>
    </Container>
  )
}

export default ChatScreen

const Container = styled.div`
    width: 100%;
    border-right: 1px solid whitesmoke;
    height: 100vh;
    min-width: 300px;
    overflow-y: scroll;

    ::-webkit-scrollbar {
        display: none;
    }

    -ms-overflow-style: none;
    scrollbar-width: none;
    
`
const Header = styled.div`
    position: sticky;
    background-color: white;
    z-index: 100;
    top: 0;
    display: flex;
    padding: 11px;
    height: 80px;
    align-items: center;
    border-bottom: 1px solid whitesmoke;

`

const HeaderInformaiton = styled.div`
    margin-left: 15px;
    flex: 1;

    > h3{
        margin-bottom: 3px;
        font-Size: 16px
    }
    > p {
        font-size: 14px;
        color: gray;
    }

`
const HeaderIcons = styled.div`

`
const MessageContainer = styled.div`
    padding: 30px;
    background-color: #e5ded8;
    min-height: 90vh;
    width: 100%;
`
const EndOfMessage = styled.div``
const InputContainer = styled.form`
    display:flex;
    align-items: center;
    padding: 10px;
    position: sticky;
    bottom: 0;
    background-color: white;
    z-index: 100;
`
const Input = styled.input`
    flex: 1;
    outline: none;
    border: none;
    border-radius: 10px;
    padding: 20px;
    background-color: whitesmoke;
    margin: 0 15px;

`
const MessageScroll = styled.div`
    height: 100px
`