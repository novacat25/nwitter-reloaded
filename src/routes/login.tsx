import { useState } from "react"
import { INPUT_TYPE_EMAIL, INPUT_TYPE_PASSWORD } from "../constants"
import { auth } from "../utils/firebase"
import { Link, useNavigate } from "react-router-dom"
import { FirebaseError } from "@firebase/util"
import { signInWithEmailAndPassword } from "firebase/auth"
import { Input, Switcher, Title, Wrapper, Form, Error } from "../components/auth-components"

export const Login = () => {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { name, value },
    } = e
    switch (name) {
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
    if(isLoading || !email || !password) return
    try {
      setIsLoading(true)
      setError("")
      await signInWithEmailAndPassword(auth, email, password)
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
          value={isLoading ? "Loading..." : "Login"}
        />
      </Form>
      {error !== "" ? <Error>{error}</Error> : null}
      <Switcher>
        Don't have an account? <Link to="/create-account">Create one →</Link>
      </Switcher>
    </Wrapper>
  )
}
