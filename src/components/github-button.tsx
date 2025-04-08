import { GithubAuthProvider, signInWithPopup } from "firebase/auth"
import { styled } from "styled-components"
import { auth } from "../utils/firebase"
import { useNavigate } from "react-router-dom"

const Button = styled.span`
  cursor: pointer;
  margin-top: 50px;
  background-color: white;
  font-weight: 600;
  color: black;
  padding: 10px 20px;
  border-radius: 50px;
  display: flex;
  gap: 5px;
  align-items: center;
  justify-content: center;
  width: 100%;
`

const Logo = styled.img`
    height: 25px;
`

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
