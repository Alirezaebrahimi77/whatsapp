import styled from "styled-components"
import {Avatar, useControlled } from "@material-ui/core"
import getRecipientEmail from "../utils/getRecipientEmail"
import {useAuthState} from "react-firebase-hooks/auth"
import {auth, db} from "../firebase.js"
import {useCollection} from "react-firebase-hooks/firestore"
import {query, where, collection} from "firebase/firestore"
import {useRouter} from "next/router"
import { useEffect } from "react"
function Chat({id, users}){
    const router = useRouter()
    const [user] = useAuthState(auth);

    const [recipientSnapshot] = useCollection(query(collection(db, "users"), where("email", "==", getRecipientEmail(users, user))))
    const recipient = recipientSnapshot?.docs?.[0]?.data();
    const recipientEmail = getRecipientEmail(users, user);


    const enterChat = () => {
        router.push(`/chat/${id}`)
    }

    return(
        <Container onClick={enterChat} id={id} queryId={router.query.id}>
            {recipient ? (
                <UserAvatar src={recipient?.photoUrl}/>
            ) : (
                <UserAvatar src={recipientEmail[0]}/>
            )}
            <p>{recipient ? recipient.displayName : recipientEmail}</p>
        </Container>
    )
}

export default Chat

const Container = styled.div`
    display: flex;
    align-items: center;
    cursor: pointer;
    padding: 15px;
    word-break: break-word;
    background-color: ${props => (props.id === props.queryId ? "#e9eaeb" : "")};

    :hover {
        background-color: #e9eaeb;
    }

`;
const UserAvatar = styled(Avatar)`
    margin: 5px;
    margin-right: 15px;
`