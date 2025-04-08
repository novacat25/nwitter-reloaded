import { useState } from "react"
import styled from "styled-components"
import { INPUT_TYPE_NAME, INPUT_TYPE_EMAIL, INPUT_TYPE_PASSWORD } from "../constants"
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth"
import { auth } from "../utils/firebase"
import { Link, useNavigate } from "react-router-dom"
import { FirebaseError } from "@firebase/util"

const Wrapper = styled.section`
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 420px;
  padding: 50px 0;
`

const Form = styled.form`
  margin-top: 50px;
  margin-bottom: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  width: 100%;
`
const Input = styled.input`
  padding: 10px 20px;
  border-radius: 50px;
  border: none;
  width: 100%;
  font-size: 16px;

  &[type="submit"] {
     cursor: pointer;
     &:hover {
       opacity: 0.8;
     }
   }
`
const Title = styled.h1`
  font-size: 42px;
`

const Error = styled.span`
  font-weight: 600;
  color: #ed4848;
 `

 const Switcher = styled.span`
  margin-top: 20px;
  a {
    color: #1d9bf0;
  }
`

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
    </Wrapper>
  )
}
