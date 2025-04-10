import { useState } from "react"
import { auth } from "../utils/firebase"
import { Link, useNavigate } from "react-router-dom"
import { FirebaseError } from "@firebase/util"
import { signInWithEmailAndPassword } from "firebase/auth"
import { Input, Switcher, Title, Wrapper, Form, Error } from "../components/auth-components"
import { GitHubButton } from "../components/github-button"
import { FacebookButton } from "../components/facebook-button"

export const Login = () => {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)

  const initialState = {
    email: "",
    password: "",
  }
  
  const [formData, setFormData] = useState(initialState)
  const [error, setError] = useState("")

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { name, value },
    } = e
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }))
  }

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if(isLoading || !formData.email || !formData.password) return
    try {
      setIsLoading(true)
      setError("")
      await signInWithEmailAndPassword(auth, formData.email, formData.password)
      navigate("/")
    } catch (err) {
      if(err instanceof FirebaseError) {
        setError(err.message)
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Wrapper>
      <Title>Log into 𝕏</Title>
      <Form onSubmit={onSubmit}>
        <Input
          name="email"
          value={formData.email}
          placeholder="Email"
          onChange={onChange}
          type="email"
          required
        />
        <Input
          name="password"
          value={formData.password}
          placeholder="Password"
          onChange={onChange}
          type="password"
          required
        />
        <Input
          type="submit"
          value={isLoading ? "Loading..." : "Login"}
        />
      </Form>
      {error !== "" ? <Error>{error}</Error> : null}
      <Switcher>
        Don't have an account? <Link to="/create-account">Create one →</Link>
      </Switcher>
      <GitHubButton />
      <FacebookButton />
    </Wrapper>
  )
}
