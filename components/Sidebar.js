import styled from "styled-components";
import { Avatar, IconButton, Button } from "@material-ui/core";
import ChatIcon from "@mui/icons-material/Chat";
import SearchIcon from "@mui/icons-material/Search";
import * as EmailValidator from "email-validator"
import {auth, db} from "../firebase.js"
import {useAuthState} from "react-firebase-hooks/auth"
import {addDoc, collection, query, where, onSnapshot, doc, getFirestore} from "firebase/firestore";
import Chat from "./Chat.js";
import {useState, useEffect} from "react" 
import CustomVerticalMenu from "./CustomVerticalMenu"
import getRecipientEmail from "../utils/getRecipientEmail.js";

function Sidebar({serverChats}) {
    const [chats, setChats] = useState(null)
    const [user] = useAuthState(auth)
    const [searchInput, setSearchInput] = useState("")

    useEffect(() => {
      if(serverChats){
        setChats(JSON.parse(serverChats))

      }
    },[])

    useEffect(() => {
      const userChatRef = collection(db, "chats")
      const q = query(userChatRef, where("users", "array-contains", user.email))

      const unsubscribe = () => {
        onSnapshot(q, (snapshot) => {
          setChats(snapshot.docs.map(doc => ({...doc.data(), id: doc.id})))
        })
      }
     unsubscribe()

    },[])

    const createChat = () => {
        const input = prompt("Please enter an email address for the user you wish to chat with")
        if(!input) return null;

        if(EmailValidator.validate(input) && !chatAlreadyExists(input) && input !== user.email){
            // We need to add the chat into the DB 'chats' collection if it does'nt already exist and is valid
            addDoc(collection(db, "chats"), {
              users: [user.email, input],
            })

        }
    }
    const chatAlreadyExists = (recipientEmail) => !!chats?.find(chat => chat.users.find(user => user === recipientEmail)?.length > 0);

    const searchHandler = (e) => {
      setSearchInput(e.target.value)
    }
    const filteredChats = chats?.filter(chat => chat.users[1].includes(searchInput.toLowerCase()))


  return (
    <Container>
      <Header>
        <UserAvatar src={user?.photoURL}/>
        <IconsContainer>
          <IconButton>
            <ChatIcon />
          </IconButton>
         <CustomVerticalMenu />
        </IconsContainer>
      </Header>
      <SearchContainer>
        <SearchIcon />
        <SearchInput placeholder="Search in chats" onChange={searchHandler} value={searchInput}/>
      </SearchContainer>
      
        <SidebarButton onClick={createChat}> Start a new chat</SidebarButton>

        {/* {List of chats} */}
        {filteredChats?.map(chat => (
          <Chat key={chat.id} id={chat.id} users={chat.users}/>
        ))}
      
    </Container>
  );
}

export default Sidebar;

const Container = styled.div``;
const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 20px;
  border-radius: 2px;
  border: 1px;
`;
const SearchInput = styled.input`
  outline: none;
  border: none;
  flex: 1;
`;

const Header = styled.div`
  display: flex;
  position: sticky;
  top: 0;
  background-color: #fff;
  z-index: 1;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  height: 80px;
  border-bottom: 1px solid whitesmoke;
`;

const UserAvatar = styled(Avatar)`
  cursor: pointer;

  :hover {
    opacity: 0.8;
  }
`;

const IconsContainer = styled.div``;

const SidebarButton = styled(Button)`
    width: 100%;

    &&&{
        border-top: 1px solid whitesmoke;
        border-bottom: 1px solid whitesmoke;
    }
    
`;
