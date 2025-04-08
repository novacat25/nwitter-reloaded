import { useState } from "react"
import { INPUT_TYPE_NAME, INPUT_TYPE_EMAIL, INPUT_TYPE_PASSWORD } from "../constants"
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth"
import { auth } from "../utils/firebase"
import { Link, useNavigate } from "react-router-dom"
import { FirebaseError } from "@firebase/util"
import { Input, Switcher, Title, Wrapper, Form, Error } from "../components/auth-components"
import { GitHubButton } from "../components/github-button"

export const CreateAccount = () => {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { name, value },
    } = e
    switch (name) {
      case INPUT_TYPE_NAME:
        setName(value)
        break
      case INPUT_TYPE_EMAIL:
        setEmail(value)
        break
      case INPUT_TYPE_PASSWORD:
        setPassword(value)
        break
    }
  }

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if(isLoading || !name || !email || !password) return
    try {
      setIsLoading(true)
      setError("")
      const credentials = await createUserWithEmailAndPassword(auth, email, password)
      await updateProfile(credentials.user, { displayName: name })
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
      <Title>Join 𝕏</Title>
      <Form onSubmit={onSubmit}>
        <Input
          name="name"
          value={name}
          placeholder="Name"
          onChange={onChange}
          type="text"
          required
        />
        <Input
          name="email"
          value={email}
          placeholder="Email"
          onChange={onChange}
          type="email"
          required
        />
        <Input
          name="password"
          value={password}
          placeholder="Password"
          onChange={onChange}
          type="password"
          required
        />
        <Input
          type="submit"
          value={isLoading ? "Loading..." : "Create Account"}
        />
      </Form>
      {error !== "" ? <Error>{error}</Error> : null}
      <Switcher>
        Already have an account? <Link to="/login">Login →</Link>
      </Switcher>     
      <GitHubButton /> 
    </Wrapper>
  )
}
