import '../styles/globals.css'
import {useAuthState} from "react-firebase-hooks/auth"
import {auth, db} from "../firebase.js"
import Login from "./login"
import Loading from '../components/Loading'
import {useEffect} from "react"
import { doc, setDoc, serverTimestamp  } from "firebase/firestore"; 
function MyApp({ Component, pageProps }) {

  const [user, loading] = useAuthState(auth)

  useEffect(() => {
    if(user){

      setDoc(doc(db, "users", user.uid), {
        displayName: user.displayName,
        email: user.email,
        lastSeen: serverTimestamp(),
        photoUrl: user.photoURL,
      },{ merge: true });
    }

  }, [user])

  if(loading) return <Loading />
  if(!user) return <Login />


  return <Component {...pageProps} />
}

export default MyApp
