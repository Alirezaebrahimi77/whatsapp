import styled from "styled-components";
import Head from "next/head";
import { Button } from "@material-ui/core";
import {auth, provider} from "../firebase"
import {signInWithPopup } from "firebase/auth";
import Image from 'next/image'
const Login = () => {
    const signIn = () => {
        signInWithPopup(auth, provider)
    }
  return (
    <Container>
      <Head>
        <title>Login</title>
      </Head>

      <LoginContainer>
        <Image src="/whatsapp.png" alt="Whatsapp login page" width={200} height={200} objectFit="cover" style={{marginBottom: "20px"}}/>
        <Button onClick={signIn}variant="outlined">Sign in with Google</Button>
      </LoginContainer>
    </Container>
  );
};

export default Login;

const Container = styled.div`
  display: grid;
  place-items: center;
  height: 100vh;
  background-color: whitesmoke;
`;
const LoginContainer = styled.div`
  padding: 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #fff;
  border-radius: 5px;
  box-shadow: 0px 4px  14px -3px rgba(0,0,0,0.7);
`;
const Logo = styled.img`
  width: 200px;
  height: 200px;
  margin-bottom: 20px;
`;
