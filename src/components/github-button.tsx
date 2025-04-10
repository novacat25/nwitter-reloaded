import { GithubAuthProvider, signInWithPopup } from "firebase/auth"
import { auth } from "../utils/firebase"
import { useNavigate } from "react-router-dom"
import { Button, Logo } from "./social-auth-components"


export const GitHubButton = () => {
  const navigate = useNavigate()
  const onClick = async () => {
    try {
      const provider = new GithubAuthProvider()
      await signInWithPopup(auth, provider)
      navigate("/")
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <Button onClick={onClick}>
        <Logo src="/github-logo.svg" />
        Continue With GitHub
    </Button>
  )
}
