import { GoogleAuthProvider, signInWithPopup } from "firebase/auth"
import { auth } from "../utils/firebase"
import { useNavigate } from "react-router-dom"
import { Button, Logo } from "./social-auth-components"


export const GoogleButton = () => {
  const navigate = useNavigate()
  const onClick = async () => {
    try {
      const provider = new GoogleAuthProvider()
      await signInWithPopup(auth, provider)
      navigate("/")
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <Button onClick={onClick}>
        <Logo src="/google_logo.png" />
        Continue With Google
    </Button>
  )
}
