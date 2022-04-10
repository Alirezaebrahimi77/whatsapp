import Head from 'next/head'
import React from 'react'
import styled from "styled-components"
import ChatScreen from '../../components/ChatScreen'
import Sidebar from '../../components/Sidebar'
import {db} from "../../firebase"
import { useRouter } from 'next/dist/client/router'
import {collection, doc, query, orderBy, getDocs, getDoc, where} from "firebase/firestore"
import getRecipientEmail from '../../utils/getRecipientEmail.js';
function Chat({chats, messages, id, chatEmails}) {
  return (
    <Container>
        <Head>
            <title>Chat</title>
        </Head>
        <Sidebar serverChats={chats}/>
        <ChatContainer>
            <ChatScreen serverMessages={messages} chat_id={id} chatEmails={chatEmails}/>
        </ChatContainer>
    </Container>
  )
}

export default Chat

export async function getServerSideProps(context){

    // PREP the messages
    const messagesRef = collection(db, "chats", context.query.id, "messages");
    const q = query(messagesRef, orderBy("timestamp", "asc"));
    const snapshot = await getDocs(q);
    const messages = snapshot.docs.map(doc => ({...doc.data(), id: doc.id, timestamp: doc.data().timestamp?.toDate().getTime()}))

    // PREP the chats
    const chatsRef = collection(db, "chats")
    const chatsSnapshot = await getDocs(chatsRef)
    const chats = chatsSnapshot.docs.map(doc => ({...doc.data(), id: doc.id}))
    
    return {
        props:{
            messages: JSON.stringify(messages),
            chats: JSON.stringify(chats),
            id: context.query.id,
        }
    }

}


const Container = styled.div`
    display: flex;
`
const ChatContainer = styled.div`
    flex: 1;
    overflow: scroll;
    height: 100vh;

    ::-webkit-scrollbar{
        display: none;
    }
    -ms-overflow-style: none;
    scrollbar-width: none;

`
