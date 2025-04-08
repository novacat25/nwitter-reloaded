import { FacebookAuthProvider, signInWithPopup } from "firebase/auth"
import { auth } from "../utils/firebase"
import { useNavigate } from "react-router-dom"
import { Button, Logo } from "./social-auth-components"


export const FacebookButton = () => {
  const navigate = useNavigate()
  const onClick = async () => {
    try {
      const provider = new FacebookAuthProvider()
      await signInWithPopup(auth, provider)
      navigate("/")
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <Button onClick={onClick}>
        <Logo src="/facebook-logo.png" />
        Continue With Facebook
    </Button>
  )
}
