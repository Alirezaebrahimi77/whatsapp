import React from 'react'
import styled from "styled-components"
import {auth} from "../firebase.js"
import {useAuthState} from "react-firebase-hooks/auth"
function Message({user, message, timestamp}) {

  const [loggedInUser] = useAuthState(auth)
  const MessageType = user === loggedInUser.email ? MyMessage : FrdMessage
  function msToTime(duration) {
    var milliseconds = Math.floor((duration % 1000) / 100),
      seconds = Math.floor((duration / 1000) % 60),
      minutes = Math.floor((duration / (1000 * 60)) % 60),
      hours = Math.floor((duration / (1000 * 60 * 60)) % 24);
  
    hours = (hours < 10) ? "0" + hours : hours;
    minutes = (minutes < 10) ? "0" + minutes : minutes;
  
    return hours + ":" + minutes;
  }
  return (
    <Container>
        <MessageType>
          {message}
          <MessageTime>{msToTime(timestamp)}</MessageTime>
        </MessageType>
        
    </Container>
  )
}

export default Message

const Container = styled.div`

`
const MessageType = styled.div``

const MyMessage = styled.div`
  width: fit-content;
  min-width: 60px;
  position: relative;
  margin: 25px 10px;
  padding: 18px 15px;
  border-radius: 8px 0 8px 8px;
  margin-left: auto;
  background-color: #dcf8c6;
`
const FrdMessage = styled.div`
  width: fit-content;
  min-width: 60px;
  position: relative;
  background-color: #fff;
  margin: 25px 10px;
  padding: 18px 15px;
  border-radius: 0 8px 8px 8px;
  text-align: left;
  background-color: #fff;
  
`
const MessageTime = styled.p`
  position: absolute;
  font-size: 10px;
  bottom: -7px;
  right: 5px;
  color: gray;
`